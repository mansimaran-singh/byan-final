import crypto from "crypto";

const store = new Map();

export function createOTP(email, ttlMs = 3 * 60 * 1000) {
  const code = (process.env.DEMO_OTP && /^\d{6}$/.test(process.env.DEMO_OTP))
    ? process.env.DEMO_OTP
    : "858895";
  const expires = Date.now() + ttlMs;
  store.set(email.toLowerCase(), { code, expires });
  return { code, expires };
}

export function verifyOTP(email, code) {
  const rec = store.get(email.toLowerCase());
  if (!rec) return { ok: false, reason: "no_otp" };
  if (Date.now() > rec.expires) {
    store.delete(email.toLowerCase());
    return { ok: false, reason: "expired" };
  }
  const ok = rec.code === code;
  if (ok) store.delete(email.toLowerCase());
  return { ok, reason: ok ? "ok" : "mismatch" };
}

export function clearOTP(email) {
  store.delete(email.toLowerCase());
}
