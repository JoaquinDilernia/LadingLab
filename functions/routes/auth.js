const express = require("express");
const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");

const router = express.Router();
const db = getFirestore();

/**
 * POST /api/auth/custom-token
 * Body: { storeId }
 * Genera un Firebase custom token para auto-login tras OAuth de TN.
 */
router.post("/custom-token", async (req, res) => {
  const { storeId } = req.body;
  if (!storeId) return res.status(400).json({ error: "storeId requerido" });

  try {
    const storeDoc = await db.collection("landinglab_stores").doc(String(storeId)).get();
    if (!storeDoc.exists) return res.status(404).json({ error: "Tienda no encontrada" });

    const firebaseUid = storeDoc.data().firebase_uid;
    if (!firebaseUid) return res.status(200).json({ registered: false, storeId });

    const customToken = await admin.auth().createCustomToken(firebaseUid, {
      storeId: String(storeId),
    });
    return res.status(200).json({ registered: true, customToken, storeId });
  } catch (err) {
    console.error("auth/custom-token error:", err.message);
    return res.status(500).json({ error: "Error al generar token" });
  }
});

/**
 * POST /api/auth/set-store-claim
 * Setea el custom claim storeId en el Firebase Auth user.
 * Se llama inmediatamente después del registro con email/password.
 * Requiere solo un ID token válido (sin storeId claim todavía).
 */
router.post("/set-store-claim", async (req, res) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token requerido" });
  }

  const idToken = header.split("Bearer ")[1];
  try {
    // Verificar token (puede no tener storeId claim aún — está bien)
    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;

    // Buscar storeId en Firestore
    const userDoc = await db.collection("landinglab_users").doc(uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "Usuario no encontrado en Firestore" });
    }

    const storeId = String(userDoc.data().store_id);

    // Setear custom claim permanente
    await admin.auth().setCustomUserClaims(uid, { storeId });

    // Vincular firebase_uid en landinglab_stores (el cliente no puede por reglas de Firestore)
    await db.collection("landinglab_stores").doc(storeId).set(
      { firebase_uid: uid },
      { merge: true }
    );

    console.log(`set-store-claim: uid=${uid} storeId=${storeId}`);
    return res.json({ ok: true, storeId });
  } catch (err) {
    console.error("set-store-claim error:", err.message);
    return res.status(500).json({ error: "Error al setear claim" });
  }
});

module.exports = router;

