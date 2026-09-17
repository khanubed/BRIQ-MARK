export type EventName =
  | "cta_click"
  | "form_submit"
  | "case_study_view"
  | "scroll_depth"
  | "booking_opened";

export function trackEvent(name: EventName, params?: Record<string, any>) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", name, params);
  }
  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics Event]: ${name}`, params);
  }
}
