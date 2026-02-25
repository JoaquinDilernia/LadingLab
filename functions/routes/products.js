const express = require("express");
const axios = require("axios");
const { getFirestore } = require("firebase-admin/firestore");
const verifyAuth = require("../middleware/verifyAuth");

const router = express.Router();
const db = getFirestore();

const TN_APP_ID = process.env.NUBE_CLIENT_ID;
const TN_API_BASE = "https://api.tiendanube.com/v1";

async function getStoreToken(storeId) {
  const doc = await db.collection("landinglab_stores").doc(String(storeId)).get();
  if (!doc.exists) throw new Error("Tienda no encontrada");
  return doc.data().access_token;
}

/**
 * GET /api/products/:storeId?page=1&per_page=50&q=term
 * Proxy a la API de Tienda Nube para listar productos.
 */
router.get("/:storeId", verifyAuth, async (req, res) => {
  const { storeId } = req.params;

  if (String(req.storeId) !== String(storeId)) {
    return res.status(403).json({ error: "Sin acceso a esta tienda" });
  }

  try {
    const token = await getStoreToken(storeId);
    const { page = 1, per_page = 50, q } = req.query;

    const params = { page, per_page };
    if (q) params.q = q;

    const response = await axios.get(`${TN_API_BASE}/${storeId}/products`, {
      params,
      headers: {
        Authentication: `bearer ${token}`,
        "User-Agent": `${TN_APP_ID} (landinglab@techdi.com.ar)`,
      },
    });

    // Mapear solo los campos necesarios para el builder
    const products = response.data.map((p) => ({
      id: String(p.id),
      name: p.name?.es || p.name?.pt || Object.values(p.name || {})[0] || "",
      description: p.description?.es || "",
      price: p.variants?.[0]?.price || "0",
      compare_at_price: p.variants?.[0]?.compare_at_price || null,
      image: p.images?.[0]?.src || null,
      images: (p.images || []).map((img) => img.src),
      url: p.canonical_url || "",
      handle: p.handle || "",
      stock: p.variants?.[0]?.stock || null,
    }));

    return res.json({ products, total: response.headers["x-total-count"] || products.length });
  } catch (err) {
    const status = err.response?.status;
    console.error("products GET error:", err.message, status);
    return res.status(status || 500).json({ error: "Error al obtener productos" });
  }
});

module.exports = router;
