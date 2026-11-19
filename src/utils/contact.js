// Contact helper — GAP-02 fix: reads VITE_* env vars; returns null when unset
// A null URL means the control is hidden or disabled (never a dead href)

const rawNumber = import.meta.env.VITE_WHATSAPP_NUMBER ?? '';
const rawPhone  = import.meta.env.VITE_SALES_PHONE ?? '';

const waNumber  = rawNumber.replace(/\D/g, '');
const telNumber = rawPhone.replace(/\D/g, '');

/**
 * Returns a wa.me URL with optional pre-filled text, or null if no number is configured.
 * @param {string} [text]
 * @returns {string|null}
 */
export function whatsappUrl(text = '') {
  if (!waNumber) return null;
  const encoded = text ? `?text=${encodeURIComponent(text)}` : '';
  return `https://wa.me/${waNumber}${encoded}`;
}

/**
 * Returns a tel: URL or null if no phone number is configured.
 * @returns {string|null}
 */
export function telUrl() {
  if (!telNumber) return null;
  return `tel:+${telNumber}`;
}
