// URL base del backend
// - En Docker: Nginx redirige /api/* al contenedor backend (puerto 8080)
// - En local (Eclipse): cambia esta línea a "http://localhost:8080/api"
const API_BASE = "http://localhost:8080/api";
// Función genérica para llamadas a la API
async function apiFetch(url, options = {}) {
    try {
        const response = await fetch(API_BASE + url, {
            headers: { "Content-Type": "application/json" },
            ...options
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Error HTTP ${response.status}`);
        }

        // DELETE devuelve 204 sin cuerpo
        if (response.status === 204) return null;

        return await response.json();
    } catch (error) {
        throw error;
    }
}
