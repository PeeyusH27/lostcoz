/**
 * Shape of the meet registration form's action state.
 *
 * Kept out of actions.ts because a `"use server"` module may only export async
 * functions — a plain object export there is a build error.
 */
export type MeetState = {
  status: "idle" | "success" | "duplicate" | "error";
  /** Field name → message, for the inline errors under each input. */
  errors?: Record<string, string>;
  /** Form-level message, shown above the submit button. */
  message?: string;
};

export const initialMeetState: MeetState = { status: "idle" };
