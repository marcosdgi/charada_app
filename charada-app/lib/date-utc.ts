/**
 * Utilidades de fecha/hora en UTC.
 * La app usa UTC para todo; el backend valida en UTC.
 * Usar siempre estos helpers al enviar o comparar fechas/horas con la API.
 */

/** Fecha de hoy en UTC (YYYY-MM-DD). Usar como valor por defecto en formularios y filtros. */
export function getTodayUTC(): string {
  const now = new Date();
  return formatDateUTC(now);
}

/**
 * Formatea un Date a fecha solo en UTC (YYYY-MM-DD).
 * Útil para enviar fecha al API (jugadas, listados por día, etc.).
 */
export function formatDateUTC(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Devuelve la fecha/hora actual en ISO 8601 UTC (ej. para logs o campos datetime del API).
 */
export function toUTCISOString(date: Date = new Date()): string {
  return date.toISOString();
}

/**
 * Parsea un string YYYY-MM-DD como fecha a medianoche UTC.
 * Útil si el backend devuelve fechas en UTC y quieres construir un Date para cálculos.
 */
export function parseUTCDateString(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
}
