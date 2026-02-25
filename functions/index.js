const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const axios = require("axios");
const cors = require("cors")({ origin: true });
const express = require("express");

admin.initializeApp();
const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });

// Tienda Nube credentials (desde .env)
const TN_APP_ID = process.env.NUBE_CLIENT_ID;
const TN_CLIENT_SECRET = process.env.NUBE_CLIENT_SECRET;
const TN_TOKEN_URL = "https://www.tiendanube.com/apps/authorize/token";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// ─────────────────────────────────────────────
// OAuth Callback — Tienda Nube redirige aquí tras instalar la app
// ─────────────────────────────────────────────
exports.authCallback = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const { code } = req.query;

    if (!code) {
      console.error("authCallback: no code received");
      return res.status(400).send(errorPage("No se recibió el código de autorización de Tienda Nube."));
    }

    try {
      // 1. Intercambiar code por access_token
      const tokenResponse = await axios.post(
        TN_TOKEN_URL,
        new URLSearchParams({
          client_id: TN_APP_ID,
          client_secret: TN_CLIENT_SECRET,
          grant_type: "authorization_code",
          code,
        }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": `${TN_APP_ID} (landinglab@techdi.com.ar)`,
          },
        }
      );

      const { access_token, token_type, scope, user_id } = tokenResponse.data;

      if (!access_token) {
        throw new Error(`TN no devolvió access_token: ${JSON.stringify(tokenResponse.data)}`);
      }

      console.log(`authCallback: token obtenido para store ${user_id}`);

      // 2. Guardar / actualizar store en Firestore
      const storeRef = db.collection("landinglab_stores").doc(String(user_id));
      const storeSnap = await storeRef.get();

      await storeRef.set(
        {
          access_token,
          token_type,
          scope,
          user_id,
          updated_at: FieldValue.serverTimestamp(),
          ...(!storeSnap.exists && { installed_at: FieldValue.serverTimestamp() }),
        },
        { merge: true }
      );

      // 3. Ver si ya tiene usuario registrado
      const storeData = (await storeRef.get()).data();
      const firebaseUid = storeData.firebase_uid;

      if (firebaseUid) {
        // Generar custom token para auto-login
        const customToken = await admin.auth().createCustomToken(firebaseUid, {
          storeId: String(user_id),
        });
        console.log(`authCallback: store ${user_id} tiene usuario, redirigiendo con custom token`);
        return res.redirect(302, `${FRONTEND_URL}/auth/callback?token=${customToken}&store=${user_id}`);
      }

      // Sin usuario → ir a registro
      console.log(`authCallback: store ${user_id} sin usuario, redirigiendo a registro`);
      return res.redirect(302, `${FRONTEND_URL}/register?store=${user_id}`);

    } catch (error) {
      const status = error.response?.status;
      const data = error.response?.data;
      console.error("authCallback error:", { status, data, message: error.message });
      return res.status(500).send(errorPage(error.message));
    }
  });
});

// ─────────────────────────────────────────────
// API — Express app con todas las rutas
// ─────────────────────────────────────────────
const app = express();
app.use(express.json());
app.use(cors);

app.use("/auth", require("./routes/auth"));
app.use("/store", require("./routes/store"));
app.use("/products", require("./routes/products"));
app.use("/landings", require("./routes/landings"));

exports.api = functions.https.onRequest(app);

// ─────────────────────────────────────────────
// Webhook — eventos de Tienda Nube
// ─────────────────────────────────────────────
exports.webhook = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") return res.status(405).send("Method not allowed");

    const event = req.headers["x-tiendanube-topic"] || req.headers["x-nuvemshop-topic"];
    const storeId = req.headers["x-tiendanube-store-id"] || req.headers["x-nuvemshop-store-id"];

    console.log(`webhook: event="${event}" storeId="${storeId}"`);

    await db.collection("landinglab_webhook_events").add({
      event,
      store_id: storeId,
      payload: req.body,
      received_at: FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ ok: true });
  });
});

// ─────────────────────────────────────────────
// Health Check
// ─────────────────────────────────────────────
exports.healthCheck = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    res.json({
      status: "ok",
      app: "LandingLab",
      app_id: TN_APP_ID,
      timestamp: new Date().toISOString(),
    });
  });
});

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function errorPage(message) {
  return `<html><body style="font-family:sans-serif;text-align:center;padding:50px">
    <h2>Error al conectar con Tienda Nube</h2>
    <pre style="background:#f0f0f0;padding:16px;border-radius:8px;text-align:left;display:inline-block;max-width:600px;white-space:pre-wrap">${message}</pre>
  </body></html>`;
}
