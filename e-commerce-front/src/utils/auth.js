import { jwtDecode } from 'jwt-decode'

const TOKEN_KEY = 'token'

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

/** Decodifica el JWT guardado. Devuelve null si no hay token o es inválido/expiró. */
export function getTokenPayload() {
  const token = getToken()
  if (!token) return null

  try {
    const payload = jwtDecode(token)
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      removeToken()
      return null
    }
    return payload
  } catch {
    removeToken()
    return null
  }
}

export function isAuthenticated() {
  return getTokenPayload() !== null
}

/** El backend manda el claim "roles" como string separado por comas (ej: "ROLE_USER,ROLE_ADMIN"). */
export function getRoles() {
  const payload = getTokenPayload()
  if (!payload?.roles) return []
  return payload.roles.split(',')
}

export function hasRole(rol) {
  return getRoles().includes(rol)
}

export function getEmail() {
  return getTokenPayload()?.sub ?? null
}
