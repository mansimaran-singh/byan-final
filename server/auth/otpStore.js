import crypto from "crypto";

const store = new Map();

export function createOTP(email, ttlMs = 3 * 60 * 1000) {
  // Generate a cryptographically secure random 6‑digit code
  // Avoid reusing the last code for this email if still valid
  const prev = store.get(email.toLowerCase());
  let code = null;
  for (let i = 0; i < 5; i++) {
    const n = crypto.randomInt(0, 1000000);
    const candidate = String(n).padStart(6, "0");
    if (!prev || prev.code !== candidate) { code = candidate; break; }
  }
  if (!code) {
    // Fallback if by chance all candidates matched previous
    const n = (crypto.randomInt(0, 900000) + 100000);
    code = String(n);
  }
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
