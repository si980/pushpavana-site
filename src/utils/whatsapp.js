// Sanitise phone: strip all non-digit characters
// GAP-01 fix: original was /\\D/g which matched literal backslash + D
export function sanitisePhone(raw) {
  if (!raw) return '';
  return String(raw).replace(/\D/g, '');
}
