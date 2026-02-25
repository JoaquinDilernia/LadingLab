const express = require("express");
const { getFirestore } = require("firebase-admin/firestore");
const verifyAuth = require("../middleware/verifyAuth");

const router = express.Router();
const db = getFirestore();

/**
 * GET /api/store/:storeId
 * Devuelve info de la tienda (sin el access_token).
 */
router.get("/:storeId", verifyAuth, async (req, res) => {
  const { storeId } = req.params;

  if (String(req.storeId) !== String(storeId)) {
    return res.status(403).json({ error: "Sin acceso a esta tienda" });
  }

  try {
    const doc = await db.collection("landinglab_stores").doc(String(storeId)).get();
    if (!doc.exists) return res.status(404).json({ error: "Tienda no encontrada" });

    const data = doc.data();
    // No exponer el access_token
    const { access_token, ...safeData } = data;
    return res.json(safeData);
  } catch (err) {
    console.error("store GET error:", err.message);
    return res.status(500).json({ error: "Error al obtener tienda" });
  }
});

module.exports = router;
