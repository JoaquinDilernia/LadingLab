const express = require("express");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const verifyAuth = require("../middleware/verifyAuth");

const router = express.Router();
const db = getFirestore();

function checkStoreAccess(req, storeId) {
  return String(req.storeId) === String(storeId);
}

/**
 * GET /api/landings/public/:slug
 * Devuelve una landing publicada por su slug (SIN auth).
 * Incrementa el contador de views.
 * DEBE estar antes de /:storeId para que Express no confunda "public" con un storeId.
 */
router.get("/public/:slug", async (req, res) => {
  try {
    const snap = await db
      .collection("landinglab_landings")
      .where("slug", "==", req.params.slug)
      .where("status", "==", "published")
      .limit(1)
      .get();

    if (snap.empty) return res.status(404).json({ error: "Landing no encontrada" });

    const doc = snap.docs[0];
    const data = doc.data();

    // Incrementar views async (no bloquear la respuesta)
    doc.ref.update({ views: FieldValue.increment(1) }).catch(() => {});

    return res.json({
      id: doc.id,
      ...data,
      access_token: undefined,
      created_at: data.created_at?.toDate?.()?.toISOString(),
      updated_at: data.updated_at?.toDate?.()?.toISOString(),
      published_at: data.published_at?.toDate?.()?.toISOString(),
    });
  } catch (err) {
    console.error("landings public GET error:", err.message);
    return res.status(500).json({ error: "Error" });
  }
});

/**
 * GET /api/landings/:storeId
 * Lista todas las landings de un store.
 */
router.get("/:storeId", verifyAuth, async (req, res) => {
  if (!checkStoreAccess(req, req.params.storeId)) {
    return res.status(403).json({ error: "Sin acceso" });
  }
  try {
    const snap = await db
      .collection("landinglab_landings")
      .where("store_id", "==", String(req.params.storeId))
      .orderBy("created_at", "desc")
      .get();

    const landings = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate?.()?.toISOString(),
      updated_at: doc.data().updated_at?.toDate?.()?.toISOString(),
      published_at: doc.data().published_at?.toDate?.()?.toISOString(),
    }));

    return res.json({ landings });
  } catch (err) {
    console.error("landings GET error:", err.message);
    return res.status(500).json({ error: "Error al obtener landings" });
  }
});

/**
 * POST /api/landings/:storeId
 * Crea una landing nueva.
 * Body: { title: string }
 */
router.post("/:storeId", verifyAuth, async (req, res) => {
  if (!checkStoreAccess(req, req.params.storeId)) {
    return res.status(403).json({ error: "Sin acceso" });
  }
  const { title, blocks } = req.body;
  if (!title) return res.status(400).json({ error: "title requerido" });

  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .concat("-" + Date.now().toString(36));

  try {
    const landing = {
      store_id: String(req.params.storeId),
      title,
      slug,
      status: "draft",
      blocks: Array.isArray(blocks) ? blocks : [],
      seo: { title: "", description: "", og_image: "" },
      theme: { primary_color: "#000000", font: "Inter" },
      views: 0,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
      published_at: null,
    };

    const docRef = await db.collection("landinglab_landings").add(landing);
    return res.status(201).json({ id: docRef.id, ...landing });
  } catch (err) {
    console.error("landings POST error:", err.message);
    return res.status(500).json({ error: "Error al crear landing" });
  }
});

/**
 * GET /api/landings/:storeId/:landingId
 * Devuelve una landing específica.
 */
router.get("/:storeId/:landingId", verifyAuth, async (req, res) => {
  if (!checkStoreAccess(req, req.params.storeId)) {
    return res.status(403).json({ error: "Sin acceso" });
  }
  try {
    const doc = await db.collection("landinglab_landings").doc(req.params.landingId).get();
    if (!doc.exists || doc.data().store_id !== String(req.params.storeId)) {
      return res.status(404).json({ error: "Landing no encontrada" });
    }
    const data = doc.data();
    return res.json({
      id: doc.id,
      ...data,
      created_at: data.created_at?.toDate?.()?.toISOString(),
      updated_at: data.updated_at?.toDate?.()?.toISOString(),
      published_at: data.published_at?.toDate?.()?.toISOString(),
    });
  } catch (err) {
    console.error("landings GET/:id error:", err.message);
    return res.status(500).json({ error: "Error al obtener landing" });
  }
});

/**
 * PUT /api/landings/:storeId/:landingId
 * Actualiza una landing (bloques, título, seo, theme).
 */
router.put("/:storeId/:landingId", verifyAuth, async (req, res) => {
  if (!checkStoreAccess(req, req.params.storeId)) {
    return res.status(403).json({ error: "Sin acceso" });
  }
  try {
    const doc = await db.collection("landinglab_landings").doc(req.params.landingId).get();
    if (!doc.exists || doc.data().store_id !== String(req.params.storeId)) {
      return res.status(404).json({ error: "Landing no encontrada" });
    }

    const allowed = ["title", "blocks", "seo", "theme", "slug"];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    updates.updated_at = FieldValue.serverTimestamp();

    await db.collection("landinglab_landings").doc(req.params.landingId).update(updates);
    return res.json({ ok: true });
  } catch (err) {
    console.error("landings PUT error:", err.message);
    return res.status(500).json({ error: "Error al actualizar landing" });
  }
});

/**
 * POST /api/landings/:storeId/:landingId/publish
 * Publica o despublica una landing.
 * Body: { publish: boolean }
 */
router.post("/:storeId/:landingId/publish", verifyAuth, async (req, res) => {
  if (!checkStoreAccess(req, req.params.storeId)) {
    return res.status(403).json({ error: "Sin acceso" });
  }
  const { publish } = req.body;
  try {
    const doc = await db.collection("landinglab_landings").doc(req.params.landingId).get();
    if (!doc.exists || doc.data().store_id !== String(req.params.storeId)) {
      return res.status(404).json({ error: "Landing no encontrada" });
    }

    await db.collection("landinglab_landings").doc(req.params.landingId).update({
      status: publish ? "published" : "draft",
      published_at: publish ? FieldValue.serverTimestamp() : null,
      updated_at: FieldValue.serverTimestamp(),
    });

    return res.json({ ok: true, status: publish ? "published" : "draft" });
  } catch (err) {
    console.error("landings publish error:", err.message);
    return res.status(500).json({ error: "Error al publicar" });
  }
});

/**
 * DELETE /api/landings/:storeId/:landingId
 */
router.delete("/:storeId/:landingId", verifyAuth, async (req, res) => {
  if (!checkStoreAccess(req, req.params.storeId)) {
    return res.status(403).json({ error: "Sin acceso" });
  }
  try {
    const doc = await db.collection("landinglab_landings").doc(req.params.landingId).get();
    if (!doc.exists || doc.data().store_id !== String(req.params.storeId)) {
      return res.status(404).json({ error: "Landing no encontrada" });
    }
    await db.collection("landinglab_landings").doc(req.params.landingId).delete();
    return res.json({ ok: true });
  } catch (err) {
    console.error("landings DELETE error:", err.message);
    return res.status(500).json({ error: "Error al eliminar" });
  }
});

/**
 * POST /api/landings/:storeId/:landingId/duplicate
 * Duplica una landing existente.
 */
router.post("/:storeId/:landingId/duplicate", verifyAuth, async (req, res) => {
  if (!checkStoreAccess(req, req.params.storeId)) {
    return res.status(403).json({ error: "Sin acceso" });
  }
  try {
    const doc = await db.collection("landinglab_landings").doc(req.params.landingId).get();
    if (!doc.exists || doc.data().store_id !== String(req.params.storeId)) {
      return res.status(404).json({ error: "Landing no encontrada" });
    }

    const source = doc.data();
    const newTitle = `${source.title} (copia)`;
    const newSlug = source.slug
      .replace(/-[a-z0-9]+$/, "")       // quitar suffix de timestamp anterior
      .concat("-copia-" + Date.now().toString(36));

    const copy = {
      store_id: source.store_id,
      title: newTitle,
      slug: newSlug,
      status: "draft",
      blocks: source.blocks || [],
      seo: source.seo || { title: "", description: "", og_image: "" },
      theme: source.theme || { primary_color: "#000000", font: "Inter" },
      views: 0,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
      published_at: null,
    };

    const docRef = await db.collection("landinglab_landings").add(copy);
    return res.status(201).json({ id: docRef.id, ...copy });
  } catch (err) {
    console.error("landings duplicate error:", err.message);
    return res.status(500).json({ error: "Error al duplicar landing" });
  }
});

module.exports = router;
