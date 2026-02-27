// Centralized API calls to Firebase Functions
const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5001/pedidos-lett-2/us-central1/api";

async function request(method, path, body, token) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error en la solicitud");
  return data;
}

export const api = {
  // Auth
  getCustomToken: (storeId) => request("POST", "/auth/custom-token", { storeId }),
  setStoreClaim: (token) => request("POST", "/auth/set-store-claim", {}, token),

  // Store
  getStore: (storeId, token) => request("GET", `/store/${storeId}`, null, token),

  // Products
  getProducts: (storeId, token, params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request("GET", `/products/${storeId}${qs ? "?" + qs : ""}`, null, token);
  },

  // Landings
  getLandings: (storeId, token) => request("GET", `/landings/${storeId}`, null, token),
  getLanding: (storeId, landingId, token) => request("GET", `/landings/${storeId}/${landingId}`, null, token),
  createLanding: (storeId, title, token, blocks) =>
    request("POST", `/landings/${storeId}`, { title, ...(blocks ? { blocks } : {}) }, token),
  updateLanding: (storeId, landingId, data, token) => request("PUT", `/landings/${storeId}/${landingId}`, data, token),
  deleteLanding: (storeId, landingId, token) => request("DELETE", `/landings/${storeId}/${landingId}`, null, token),
  duplicateLanding: (storeId, landingId, token) =>
    request("POST", `/landings/${storeId}/${landingId}/duplicate`, {}, token),
  publishLanding: (storeId, landingId, publish, token) =>
    request("POST", `/landings/${storeId}/${landingId}/publish`, { publish }, token),
  getPublicLanding: (slug) => request("GET", `/landings/public/${slug}`),
};
