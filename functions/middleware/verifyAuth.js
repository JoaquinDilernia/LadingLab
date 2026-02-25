const admin = require("firebase-admin");

/**
 * Middleware que verifica el Firebase Auth ID token en el header Authorization.
 * Agrega req.uid y req.storeId al request si el token es válido.
 */
async function verifyAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No autorizado — token faltante" });
  }

  const idToken = header.split("Bearer ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.uid = decoded.uid;
    req.storeId = decoded.storeId || decoded.store_id;
    next();
  } catch (err) {
    console.error("verifyAuth: invalid token", err.message);
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}

module.exports = verifyAuth;
