export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';
export const PLACEHOLDER_IMG = 'https://placehold.co/300x200?text=Sin+imagen';

// Envoltorio fino de fetch para los endpoints que requieren sesión.
// Antepone API_URL y agrega los headers que el backend espera; devuelve la
// Response tal cual para que cada componente decida cómo leerla (el backend
// responde algunos casos como texto plano y otros como JSON).
export function apiFetch(path, options = {}) {
  const headers = { ...options.headers };

  // El JwtFilter del backend solo lee 'Authorization: Bearer <token>'
  const token = localStorage.getItem('token');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Sin este header Spring no parsea el body como JSON en @RequestBody
  if (options.body) {
    headers['Content-Type'] = 'application/json';
  }

  return fetch(`${API_URL}${path}`, { ...options, headers });
}