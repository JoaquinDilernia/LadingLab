import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export default function AuthCallback() {
  const { loginWithCustomToken } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const store = searchParams.get("store");

    if (!token) {
      setError("Token no encontrado en la URL.");
      return;
    }

    loginWithCustomToken(token)
      .then(() => navigate("/dashboard"))
      .catch((err) => {
        console.error("AuthCallback error:", err);
        setError("No se pudo iniciar sesión automáticamente. Ingresá manualmente.");
        setTimeout(() => navigate("/login"), 2500);
      });
  }, []);

  if (error) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: "center" }}>
        <div className="auth-logo">LandingLab</div>
        <div className="auth-loading">
          <div className="spinner" />
          <p>Iniciando sesión...</p>
        </div>
      </div>
    </div>
  );
}
