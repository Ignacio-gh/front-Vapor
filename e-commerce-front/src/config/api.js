export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';
export const PLACEHOLDER_IMG = 'https://placehold.co/300x200?text=Sin+imagen';

// Envoltorio fino de fetch para los endpoints que requieren sesión.
// Antepone API_URL, manda la cookie de sesión y agrega el Content-Type; devuelve la
// Response tal cual para que cada componente decida cómo leerla (el backend
// responde algunos casos como texto plano y otros como JSON).
export function apiFetch(path, options = {}) {
  const headers = { ...options.headers };

  // Sin este header Spring no parsea el body como JSON en @RequestBody
  if (options.body) {
    headers['Content-Type'] = 'application/json';
  }

  // El JWT viaja en una cookie HttpOnly que setea el login. Como el front (5173) y el back (8080)
  // son orígenes distintos, el navegador solo la manda (y solo la guarda) con credentials: 'include'
  return fetch(`${API_URL}${path}`, { ...options, headers, credentials: 'include' });
}