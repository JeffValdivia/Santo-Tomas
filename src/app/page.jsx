"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const demoUsers = {
  admin: { email: "admin@santotomas.edu", password: "Admin123", role: "ADMIN" },
  docente: { email: "docente@santotomas.edu", password: "Docente123", role: "DOCENTE" },
  alumno: { email: "alumno@santotomas.edu", password: "Alumno123", role: "ALUMNO" },
};

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("Ingresando...");
    const match = Object.values(demoUsers).find(
      (user) => user.email === email && user.password === password
    );
    if (!match) {
      setStatus("Credenciales inválidas");
      return;
    }
    setStatus("Bienvenido");
    if (match.role === "ADMIN") router.push("/dashboard");
    if (match.role === "DOCENTE") router.push("/docente");
    if (match.role === "ALUMNO") router.push("/alumno");
  };

  return (
    <div className="login-hero">
      <div className="login-overlay" style={{ gridTemplateColumns: 'minmax(320px,420px)', justifyContent: 'center' }}>
        <div className="login-panel">
          <div>
            <div className="login-title">Iniciar Sesion</div>
            <div className="login-subtitle">Accede con tu cuenta institucional</div>
          </div>
          <form className="login-form" onSubmit={handleSubmit}>
            <input
              className="input"
              placeholder="Usuario o email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <input
              className="input"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button className="button" type="submit">Iniciar Sesion</button>
          </form>
          {status ? <span className="muted">{status}</span> : null}
          <a className="muted" href="/login">¿Olvidaste tu contraseña?</a>
        </div>
      </div>
    </div>
  );
}
