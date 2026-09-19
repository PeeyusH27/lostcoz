/**
 * Lostcoz — Order of Dharma pre-bookings → Google Sheet.
 *
 * Supabase is the source of truth and the place dedup happens (unique index on
 * `phone`). This script only mirrors rows into a Sheet, and is itself idempotent:
 * a row is keyed by its Supabase `id`, so re-running, double webhooks and a
 * backfill on top of live traffic can never duplicate a line.
 *
 * Two paths, both optional, both safe to run together:
 *   doPost()            push — a Supabase webhook/trigger calls it on insert
 *   syncFromSupabase()  pull — backfill + a safety net on a time trigger
 *
 * Setup: see README.md next to this file.
 */

/* ------------------------------------------------------------------ config */

var SHEET_NAME = 'Pre-bookings';

/**
 * Sheet columns, in order. `key` is the Supabase column; `header` is what a
 * human reads. Append to the end when you add a field — never reorder, or the
 * existing rows stop lining up.
 */
var COLUMNS = [
  { key: 'created_at',     header: 'Received at' },
  { key: 'name',           header: 'Name' },
  { key: 'phone',          header: 'Phone' },
  { key: 'age',            header: 'Age' },
  { key: 'gender',         header: 'Gender' },
  { key: 'enjoyment',      header: 'Enjoyed (1-10)' },
  { key: 'favourite',      header: 'Favourite thing' },
  { key: 'fulfilment',     header: 'Pickup / delivery' },
  { key: 'address',        header: 'Delivery address' },
  { key: 'upi_reference',  header: 'UPI reference' },
  { key: 'amount',         header: 'Amount' },
  { key: 'payment_status', header: 'Payment status' },
  { key: 'id',             header: 'Supabase ID' },
];

var ID_COLUMN = COLUMNS.length; // 1-based index of 'Supabase ID'

function props_() {
  return PropertiesService.getScriptProperties();
}

function config_() {
  var p = props_();
  var cfg = {
    url: (p.getProperty('SUPABASE_URL') || '').replace(/\/+$/, ''),
    key: p.getProperty('SUPABASE_SECRET_KEY') || '',
    secret: p.getProperty('WEBHOOK_SECRET') || '',
  };
  if (!cfg.url || !cfg.key) {
    throw new Error('Set SUPABASE_URL and SUPABASE_SECRET_KEY in Project Settings → Script Properties.');
  }
  return cfg;
}

/* ------------------------------------------------------------------- sheet */

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);

  if (sh.getLastRow() === 0) {
    var headers = COLUMNS.map(function (c) { return c.header; });
    sh.getRange(1, 1, 1, headers.length).setValues([headers])
      .setFontWeight('bold')
      .setBackground('#0A1512')
      .setFontColor('#EAD9B8');
    sh.setFrozenRows(1);
    sh.setColumnWidth(COLUMNS.map(function (c) { return c.key; }).indexOf('favourite') + 1, 340);
    sh.setColumnWidth(COLUMNS.map(function (c) { return c.key; }).indexOf('address') + 1, 260);
  }
  return sh;
}

/** Set of Supabase ids already in the sheet — the thing that makes this idempotent. */
function existingIds_(sh) {
  var last = sh.getLastRow();
  var seen = {};
  if (last < 2) return seen;
  var ids = sh.getRange(2, ID_COLUMN, last - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    var id = String(ids[i][0] || '').trim();
    if (id) seen[id] = true;
  }
  return seen;
}

function toRow_(record) {
  return COLUMNS.map(function (c) {
    var v = record[c.key];
    if (v === null || v === undefined) return '';
    // ISO timestamp → a real Date, so the Sheet sorts and formats it properly
    if (c.key === 'created_at') {
      var d = new Date(v);
      return isNaN(d.getTime()) ? String(v) : d;
    }
    return v;
  });
}

/**
 * Appends the records the sheet has not seen. Returns how many were written.
 * A LockService guard keeps a webhook and the time trigger from interleaving.
 */
function appendRecords_(records) {
  if (!records || !records.length) return 0;

  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var sh = sheet_();
    var seen = existingIds_(sh);
    var rows = [];

    for (var i = 0; i < records.length; i++) {
      var r = records[i];
      var id = r && r.id ? String(r.id) : '';
      if (!id || seen[id]) continue;
      seen[id] = true; // guard against a duplicate inside this same batch
      rows.push(toRow_(r));
    }

    if (rows.length) {
      sh.getRange(sh.getLastRow() + 1, 1, rows.length, COLUMNS.length).setValues(rows);
    }
    return rows.length;
  } finally {
    lock.releaseLock();
  }
}

/* --------------------------------------------------------------- push path */

/**
 * Supabase → here, on insert.
 *
 * Accepts either shape:
 *   Dashboard "Database Webhooks": { type, table, record, old_record, schema }
 *   the SQL trigger in supabase/schema.sql:  the row itself
 *
 * Apps Script web apps cannot read custom request headers, so the shared secret
 * travels in the query string: .../exec?secret=…
 */
function doPost(e) {
  try {
    var cfg = config_();
    if (cfg.secret && (!e || !e.parameter || e.parameter.secret !== cfg.secret)) {
      return json_({ ok: false, error: 'forbidden' });
    }
    if (!e || !e.postData || !e.postData.contents) {
      return json_({ ok: false, error: 'empty body' });
    }

    var body = JSON.parse(e.postData.contents);
    var record = body.record || body;
    if (!record || !record.id) return json_({ ok: false, error: 'no record' });

    var written = appendRecords_([record]);
    return json_({ ok: true, written: written });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: String(err) });
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* --------------------------------------------------------------- pull path */

/**
 * Reads every pre-booking from Supabase and appends whatever the sheet is
 * missing. Run it once after setup to backfill, and leave it on a time trigger
 * so a dropped webhook self-heals. Pages 1000 rows at a time.
 */
function syncFromSupabase() {
  var cfg = config_();
  var pageSize = 1000;
  var offset = 0;
  var fetched = [];

  while (true) {
    var res = UrlFetchApp.fetch(
      cfg.url + '/rest/v1/prebookings?select=*&order=created_at.asc',
      {
        method: 'get',
        headers: {
          apikey: cfg.key,
          Authorization: 'Bearer ' + cfg.key,
          Range: offset + '-' + (offset + pageSize - 1),
        },
        muteHttpExceptions: true,
      }
    );

    var code = res.getResponseCode();
    if (code !== 200 && code !== 206) {
      throw new Error('Supabase returned ' + code + ': ' + res.getContentText());
    }

    var page = JSON.parse(res.getContentText());
    fetched = fetched.concat(page);
    if (page.length < pageSize) break;
    offset += pageSize;
  }

  var written = appendRecords_(fetched);
  console.log('Supabase rows: ' + fetched.length + ' · new rows written: ' + written);
  return written;
}

/* -------------------------------------------------------------- spreadsheet UI */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Lostcoz')
    .addItem('Sync pre-bookings now', 'syncNowWithToast')
    .addItem('Install hourly auto-sync', 'installHourlyTrigger')
    .addToUi();
}

function syncNowWithToast() {
  try {
    var n = syncFromSupabase();
    SpreadsheetApp.getActiveSpreadsheet().toast(
      n === 0 ? 'Already up to date.' : 'Added ' + n + ' new pre-booking' + (n === 1 ? '' : 's') + '.',
      'Lostcoz'
    );
  } catch (err) {
    SpreadsheetApp.getUi().alert(String(err));
  }
}

/** Idempotent: clears any previous copy of this trigger before adding one. */
function installHourlyTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'syncFromSupabase') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
  ScriptApp.newTrigger('syncFromSupabase').timeBased().everyHours(1).create();
  SpreadsheetApp.getActiveSpreadsheet().toast('Hourly sync installed.', 'Lostcoz');
}
