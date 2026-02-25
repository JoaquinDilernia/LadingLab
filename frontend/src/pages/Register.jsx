import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const storeId = searchParams.get("store");

  const [form, setForm] = useState({ displayName: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!storeId) navigate("/login");
  }, [storeId, navigate]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      return setError("Las contraseñas no coinciden.");
    }
    if (form.password.length < 6) {
      return setError("La contraseña debe tener al menos 6 caracteres.");
    }

    setLoading(true);
    try {
      await register(form.email, form.password, form.displayName, storeId);
      navigate("/dashboard");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Ya existe una cuenta con ese email. Iniciá sesión.");
      } else {
        setError(err.message || "Error al crear la cuenta.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">LandingLab</div>
        <h1>Crear cuenta</h1>
        <p className="auth-subtitle">
          Conectando tienda <strong>#{storeId}</strong>
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Nombre</label>
            <input
              name="displayName"
              type="text"
              value={form.displayName}
              onChange={handleChange}
              placeholder="Tu nombre"
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>
          <div className="form-group">
            <label>Confirmar contraseña</label>
            <input
              name="confirm"
              type="password"
              value={form.confirm}
              onChange={handleChange}
              placeholder="Repetí tu contraseña"
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creando cuenta..." : "Crear cuenta y continuar"}
          </button>
        </form>
      </div>
    </div>
  );
}
