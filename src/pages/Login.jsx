import { useState } from "react";
import { login } from "../api/auth";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const data = await login(form);

    if (data.token) {
      localStorage.setItem("token", data.token);
      setMsg("Login Successful 🎉");
    } else {
      setMsg(data.error);
    }
  }

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button>Login</button>
      </form>

      <p>{msg}</p>
    </div>
  );
}
