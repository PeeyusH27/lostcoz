/**
 * Lostcoz — Supabase → Google Sheet mirror.
 *
 * Mirrors every form table into the Sheet:
 *   prebookings         → "Pre-bookings"                         (/prebook)
 *   meet_registrations  → one tab per meet, e.g. "Meet · 18 Oct 2026"  (/meet)
 *
 * Supabase is the source of truth and the place dedup happens (unique index on
 * `prebookings.phone` and on `meet_registrations (event, whatsapp)`), so a repeat
 * submission never becomes a row in the first place. This script then keeps the
 * Sheet an exact copy, keyed by Supabase `id`:
 *   new in Supabase       → appended
 *   changed in Supabase   → updated in place (e.g. payment_status → paid)
 *   deleted in Supabase   → removed
 *   same id twice here    → extra copy removed
 * Re-running, double webhooks and a full pull on top of live pushes can never
 * duplicate a line.
 *
 * Two paths, both optional, both safe to run together:
 *   doPost()            push — a Supabase webhook/trigger calls it on insert/update/delete
 *   syncFromSupabase()  pull — full mirror of every table, on a 5-minute trigger
 *
 * Columns to the RIGHT of the mirrored ones are yours: notes typed there are
 * never overwritten and move with their row.
 *
 * Setup: see README.md next to this file.
 */

/* ------------------------------------------------------------------ config */

/**
 * One entry per Supabase table. In `columns`, `key` is the Supabase column and
 * `header` is what a human reads. Append new columns just before 'Supabase ID'
 * and never reorder existing ones, or rows already in the Sheet stop lining up.
 * The id column must stay last.
 *
 * `splitBy` gives each value of that column its own tab — one tab per meet.
 * A value listed in `tabs` uses that name; any other is named from the date at
 * the end of the slug: community-meet-2026-10-18 → `tabPrefix` + "18 Oct 2026".
 * Renaming a tab by hand makes the next sync create a fresh one, so rename it
 * here too (or add it to `tabs`).
 *
 * `type`:
 *   date      ISO timestamp → a real Sheets date
 *   whatsapp  10-digit number → a wa.me link, one click to message them
 *   text      forced to text, so a numeric string keeps its leading zeros
 *   file      Storage object path → a signed "View" link (see SIGNED_URL_DAYS)
 */
var TABLES = [
  {
    table: 'prebookings',
    sheet: 'Pre-bookings',
    noun: 'pre-booking',
    header: { bg: '#0A1512', fg: '#EAD9B8' },
    columns: [
      { key: 'created_at',     header: 'Received at', type: 'date' },
      { key: 'name',           header: 'Name' },
      { key: 'phone',          header: 'Phone', type: 'whatsapp' },
      { key: 'age',            header: 'Age' },
      { key: 'gender',         header: 'Gender' },
      { key: 'enjoyment',      header: 'Enjoyed (1-10)' },
      { key: 'favourite',      header: 'Favourite thing', width: 340 },
      { key: 'fulfilment',     header: 'Pickup / delivery' },
      { key: 'address',        header: 'Delivery address', width: 260 },
      { key: 'upi_reference',  header: 'UPI reference', type: 'text' },
      { key: 'amount',         header: 'Amount' },
      { key: 'payment_status', header: 'Payment status' },
      { key: 'id',             header: 'Supabase ID' },
    ],
  },
  {
    table: 'meet_registrations',
    sheet: 'Meet registrations', // rows with no event
    noun: 'meet registration',
    splitBy: 'event',
    tabPrefix: 'Meet · ',
    tabs: { 'community-meet-2026-10-04': 'Meet registrations' }, // first meet keeps its original tab
    header: { bg: '#070709', fg: '#FAE7CF' },
    columns: [
      { key: 'created_at',      header: 'Registered at', type: 'date' },
      { key: 'event',           header: 'Event' },
      { key: 'name',            header: 'Name' },
      { key: 'whatsapp',        header: 'WhatsApp', type: 'whatsapp' },
      { key: 'age_range',       header: 'Age' },
      { key: 'organisation',    header: 'Company / college / school', width: 220 },
      { key: 'heard_from',      header: 'Heard about us via', width: 200 },
      { key: 'favourite_game',  header: 'Favourite board game', width: 200 },
      { key: 'party_size',      header: 'People' },
      { key: 'amount_due',      header: 'Amount due (₹)' },
      { key: 'payment_status',  header: 'Payment status' },
      { key: 'screenshot_path', header: 'Payment screenshot', type: 'file', bucket: 'meet-payments' },
      { key: 'id',              header: 'Supabase ID' },
    ],
  },
];

/**
 * Screenshot links are signed once, when the row first lands, and last this
 * long. Anyone holding the Sheet can open them, so share the Sheet only with
 * the team. To refresh an expired link, clear its cell and sync.
 */
var SIGNED_URL_DAYS = 365;

var PAGE_SIZE = 1000;

function config_() {
  var p = PropertiesService.getScriptProperties();
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

function tableConfig_(name) {
  for (var i = 0; i < TABLES.length; i++) if (TABLES[i].table === name) return TABLES[i];
  return null;
}

var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Name of the tab `record` belongs in. See `splitBy` above. */
function tabName_(t, record) {
  var key = t.splitBy && record && record[t.splitBy] ? String(record[t.splitBy]) : '';
  if (!key) return t.sheet;
  if (t.tabs && t.tabs[key]) return t.tabs[key];
  var m = key.match(/(\d{4})-(\d{2})-(\d{2})$/);
  return (t.tabPrefix || '') + (m ? Number(m[3]) + ' ' + MONTHS[Number(m[2]) - 1] + ' ' + m[1] : key);
}

/**
 * `records` grouped by tab name. Tabs that always exist (the table's own, or
 * the ones named in `tabs`) are included even when empty, so a full sync can
 * clear rows deleted from Supabase.
 */
function byTab_(t, records) {
  var groups = {};
  if (!t.splitBy) groups[t.sheet] = [];
  for (var k in t.tabs || {}) groups[t.tabs[k]] = [];
  records.forEach(function (r) {
    var name = tabName_(t, r);
    (groups[name] = groups[name] || []).push(r);
  });
  return groups;
}

/* --------------------------------------------------------------- supabase */

function headers_(cfg) {
  return { apikey: cfg.key, Authorization: 'Bearer ' + cfg.key };
}

/**
 * Every row of `table`, oldest first. Returns null when the table does not exist
 * yet (its SQL has not been run), so one missing table does not stop the others.
 */
function fetchAll_(cfg, table) {
  var rows = [];
  for (var offset = 0; ; offset += PAGE_SIZE) {
    var h = headers_(cfg);
    h.Range = offset + '-' + (offset + PAGE_SIZE - 1);
    var res = UrlFetchApp.fetch(
      cfg.url + '/rest/v1/' + table + '?select=*&order=created_at.asc,id.asc',
      { method: 'get', headers: h, muteHttpExceptions: true }
    );
    var code = res.getResponseCode();
    if (code === 404) return null;
    if (code !== 200 && code !== 206) {
      throw new Error(table + ': Supabase returned ' + code + ': ' + res.getContentText());
    }
    var page = JSON.parse(res.getContentText());
    rows = rows.concat(page);
    if (page.length < PAGE_SIZE) return rows;
  }
}

/** Storage path → signed URL, for a private bucket. Paths it cannot sign are left out. */
function signPaths_(cfg, bucket, paths) {
  var out = {};
  for (var i = 0; i < paths.length; i += 100) {
    var res = UrlFetchApp.fetch(cfg.url + '/storage/v1/object/sign/' + bucket, {
      method: 'post',
      contentType: 'application/json',
      headers: headers_(cfg),
      payload: JSON.stringify({ expiresIn: SIGNED_URL_DAYS * 86400, paths: paths.slice(i, i + 100) }),
      muteHttpExceptions: true,
    });
    if (res.getResponseCode() !== 200) {
      console.warn('Could not sign ' + bucket + ' links: ' + res.getResponseCode() + ' ' + res.getContentText());
      continue;
    }
    JSON.parse(res.getContentText()).forEach(function (item) {
      if (item.signedURL && !item.error) out[item.path] = cfg.url + '/storage/v1' + item.signedURL;
    });
  }
  return out;
}

/* ------------------------------------------------------------------- sheet */

function sheet_(t, name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(name) || ss.insertSheet(name);

  if (sh.getLastRow() === 0) {
    var headers = t.columns.map(function (c) { return c.header; });
    sh.getRange(1, 1, 1, headers.length).setValues([headers])
      .setFontWeight('bold')
      .setBackground(t.header.bg)
      .setFontColor(t.header.fg);
    sh.setFrozenRows(1);
    t.columns.forEach(function (c, i) {
      if (c.width) sh.setColumnWidth(i + 1, c.width);
      if (c.type === 'date') sh.getRange(2, i + 1, sh.getMaxRows() - 1, 1).setNumberFormat('dd mmm yyyy, hh:mm');
    });
  }
  return sh;
}

/**
 * Anything a person typed is written as plain text. Without this, an answer
 * starting with = + - or @ would be run as a Sheets formula.
 */
function plain_(v) {
  return typeof v === 'string' && /^[=+\-@']/.test(v) ? "'" + v : v;
}

function link_(url, label) {
  return '=HYPERLINK("' + String(url).replace(/"/g, '""') + '","' + String(label).replace(/"/g, '""') + '")';
}

/** One Supabase record → one Sheet row. `current` is the row already in the Sheet, if any. */
function toRow_(t, record, current, signed) {
  return t.columns.map(function (c, i) {
    var v = record[c.key];
    if (v === null || v === undefined || v === '') return '';
    switch (c.type) {
      case 'date': {
        var d = new Date(v);
        return isNaN(d.getTime()) ? String(v) : d;
      }
      case 'whatsapp':
        return /^\d{10}$/.test(String(v)) ? link_('https://wa.me/91' + v, v) : plain_(String(v));
      case 'text':
        return "'" + v;
      case 'file': {
        // keep a link signed on an earlier run, as long as it still points at this file
        var existing = current ? String(current[i] || '') : '';
        if (existing.indexOf(v) !== -1 && existing.charAt(0) === '=') return existing;
        return signed[v] ? link_(signed[v], 'View') : plain_(String(v));
      }
      default:
        return plain_(v);
    }
  });
}

/** Loose equality between what is in a cell and what we would write to it. */
function same_(a, b) {
  if (a instanceof Date && b instanceof Date) return Math.abs(a.getTime() - b.getTime()) < 1000;
  var sb = typeof b === 'string' ? b.replace(/^'/, '') : b;
  return String(a) === String(sb);
}

function sameRow_(a, b) {
  for (var i = 0; i < b.length; i++) if (!same_(a[i], b[i])) return false;
  return true;
}

/**
 * Brings tab `name` in line with `records`.
 *   mode 'full'    records is everything that belongs in this tab: add, update, and remove rows Supabase no longer has
 *   mode 'upsert'  add or update just these records
 *   mode 'delete'  remove just these records
 * Rows with no Supabase id (typed in by hand) are never touched.
 */
function mirror_(t, name, records, mode) {
  var cfg = config_();
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var sh = sheet_(t, name);
    var width = t.columns.length;
    var idCol = width - 1;
    var last = sh.getLastRow();

    // Current rows, with formulas (links) read as formulas so they can be compared and kept.
    var rows = [];
    if (last > 1) {
      var range = sh.getRange(2, 1, last - 1, width);
      var values = range.getValues();
      var formulas = range.getFormulas();
      rows = values.map(function (r, i) {
        return r.map(function (v, j) { return formulas[i][j] || v; });
      });
    }

    var index = {};
    var remove = [];
    rows.forEach(function (r, i) {
      var id = String(r[idCol] || '').trim();
      if (!id) return;
      if (index[id] !== undefined) remove.push(i); // same id twice: keep the first
      else index[id] = i;
    });

    var stats = { added: 0, updated: 0, removed: 0 };

    if (mode === 'delete') {
      records.forEach(function (r) {
        if (r && r.id && index[r.id] !== undefined) remove.push(index[r.id]);
      });
    } else {
      // Sign only files that don't already have a link in the Sheet.
      var signed = {};
      t.columns.forEach(function (c, ci) {
        if (c.type !== 'file') return;
        var need = [];
        records.forEach(function (r) {
          var path = r[c.key];
          if (!path) return;
          var at = index[r.id];
          var cell = at === undefined ? '' : String(rows[at][ci] || '');
          if (cell.indexOf(path) === -1 || cell.charAt(0) !== '=') need.push(path);
        });
        if (need.length) {
          var s = signPaths_(cfg, c.bucket, need);
          for (var k in s) signed[k] = s[k];
        }
      });

      var seen = {};
      var append = [];
      records.forEach(function (r) {
        var id = r && r.id ? String(r.id) : '';
        if (!id || seen[id]) return;
        seen[id] = true;
        var at = index[id];
        var row = toRow_(t, r, at === undefined ? null : rows[at], signed);
        if (at === undefined) {
          append.push(row);
        } else if (!sameRow_(rows[at], row)) {
          sh.getRange(at + 2, 1, 1, width).setValues([row]);
          stats.updated++;
        }
      });

      if (mode === 'full') {
        rows.forEach(function (r, i) {
          var id = String(r[idCol] || '').trim();
          if (id && !seen[id] && remove.indexOf(i) === -1) remove.push(i);
        });
      }

      if (append.length) {
        sh.getRange(sh.getLastRow() + 1, 1, append.length, width).setValues(append);
        stats.added = append.length;
      }
    }

    // Bottom-up, so earlier deletions don't shift the rows still to go.
    remove.sort(function (a, b) { return b - a; });
    var done = {};
    remove.forEach(function (i) {
      if (done[i]) return;
      done[i] = true;
      sh.deleteRow(i + 2);
      stats.removed++;
    });

    return stats;
  } finally {
    lock.releaseLock();
  }
}

/* --------------------------------------------------------------- push path */

/**
 * Supabase → here, on every change.
 *
 * Accepts any of these bodies:
 *   Dashboard "Database Webhooks":  { type, table, record, old_record, schema }
 *   the SQL trigger in supabase/schema.sql: the same shape
 *   the older prebookings-only trigger: the row itself
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
    var type = String(body.type || 'INSERT').toUpperCase();
    var record = type === 'DELETE' ? body.old_record : body.record || (body.type ? null : body);
    if (!record || !record.id) return json_({ ok: false, error: 'no record' });

    // A bare row carries no table name; tell the two apart by their columns.
    var name = body.table || (e.parameter && e.parameter.table) ||
      (record.whatsapp !== undefined ? 'meet_registrations' : 'prebookings');
    var t = tableConfig_(name);
    if (!t) return json_({ ok: false, error: 'unknown table ' + name });

    // An upsert that moves a row to another event leaves the old copy until the next full sync.
    var tab = tabName_(t, record);
    var stats = mirror_(t, tab, [record], type === 'DELETE' ? 'delete' : 'upsert');
    return json_({ ok: true, table: name, sheet: tab, stats: stats });
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
 * Full mirror of every table. Run once after setup to backfill, then leave it on
 * the 5-minute trigger: it catches anything a webhook missed, plus edits and
 * deletions made in Supabase.
 */
function syncFromSupabase() {
  var cfg = config_();
  var report = [];
  TABLES.forEach(function (t) {
    var records = fetchAll_(cfg, t.table);
    if (records === null) {
      report.push({ sheet: t.sheet, missing: true });
      console.warn(t.table + ' does not exist yet — run supabase/schema.sql. Skipped.');
      return;
    }
    var groups = byTab_(t, records);
    for (var name in groups) {
      var stats = mirror_(t, name, groups[name], 'full');
      report.push({ sheet: name, stats: stats, total: groups[name].length });
      console.log(t.table + ' → ' + name + ': ' + groups[name].length + ' in Supabase · +' + stats.added +
        ' ~' + stats.updated + ' -' + stats.removed);
    }
  });
  return report;
}

/* ---------------------------------------------------------- spreadsheet UI */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Lostcoz')
    .addItem('Sync now', 'syncNowWithToast')
    .addItem('Turn on auto-sync (every 5 minutes)', 'installAutoSync')
    .addItem('Turn off auto-sync', 'removeAutoSync')
    .addToUi();
}

function syncNowWithToast() {
  try {
    var lines = syncFromSupabase().map(function (r) {
      if (r.missing) return r.sheet + ': table not created yet';
      var s = r.stats;
      if (!s.added && !s.updated && !s.removed) return r.sheet + ': up to date';
      return r.sheet + ': ' + [
        s.added && s.added + ' added',
        s.updated && s.updated + ' updated',
        s.removed && s.removed + ' removed',
      ].filter(Boolean).join(', ');
    });
    SpreadsheetApp.getActiveSpreadsheet().toast(lines.join('\n'), 'Lostcoz', 8);
  } catch (err) {
    SpreadsheetApp.getUi().alert(String(err));
  }
}

/** Idempotent: clears any earlier sync trigger (including the old hourly one) first. */
function installAutoSync() {
  removeAutoSync_();
  ScriptApp.newTrigger('syncFromSupabase').timeBased().everyMinutes(5).create();
  SpreadsheetApp.getActiveSpreadsheet().toast('Auto-sync on: every 5 minutes.', 'Lostcoz');
}

function removeAutoSync() {
  var n = removeAutoSync_();
  SpreadsheetApp.getActiveSpreadsheet().toast(n ? 'Auto-sync off.' : 'Auto-sync was not on.', 'Lostcoz');
}

function removeAutoSync_() {
  var n = 0;
  ScriptApp.getProjectTriggers().forEach(function (tr) {
    if (tr.getHandlerFunction() === 'syncFromSupabase') {
      ScriptApp.deleteTrigger(tr);
      n++;
    }
  });
  return n;
}
