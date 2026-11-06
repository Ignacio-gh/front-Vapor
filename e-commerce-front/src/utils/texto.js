// Pasa a minúsculas y quita tildes para que "accion" encuentre "Acción":
// NFD separa la letra de su diacrítico y ese rango de Unicode son esos diacríticos
export function normalizar(texto) {
  return (texto ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}
