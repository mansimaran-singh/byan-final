import { useState } from "react";
import { signup } from "../api/auth";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const data = await signup(form);
    setMsg(data.message || data.error);
  }

  return (
    <div>
      <h2>Signup</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button>Signup</button>
      </form>

      <p>{msg}</p>
    </div>
  );
}
