const API = "http://localhost:5000/auth";

export async function signup(user) {
  const res = await fetch(`${API}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  return res.json();
}

export async function login(user) {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  return res.json();
}

export async function requestOtp(email) {
  const res = await fetch(`${API}/request-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return res.json();
}

export async function verifyOtp(email, code) {
  const res = await fetch(`${API}/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });
  return res.json();
}

export async function uploadVerificationDoc(type, file, email) {
  const fd = new FormData();
  fd.append("type", type);
  if (email) fd.append("email", email);
  fd.append("file", file);
  const res = await fetch(`${API}/upload-doc`, {
    method: "POST",
    body: fd,
  });
  return res.json();
}
