// Savings calculator — GAP-03 fix: no invented defaults, fuel-aware GST
// Q-CALC Option A: 18% applied only when fuel = Coal; others return null

const GST_RATE = { Coal: 0.18 };
const PELLET_GST = 0.05;

/**
 * @param {number|string} tonnes     Monthly consumption
 * @param {number|string} currentPrice  ₹ per tonne (user input, no default)
 * @param {number|string} pelletPrice   ₹ per tonne (user input, no default)
 * @param {string} fuel
 * @returns {{ saving: number|null, fuelGstAmount: number|null, pelletGstAmount: number|null }}
 */
export function estimateSavings(tonnes, currentPrice, pelletPrice, fuel) {
  const t  = Number(tonnes);
  const cp = Number(currentPrice);
  const pp = Number(pelletPrice);

  // All inputs must be valid positive numbers
  if (!t || !cp || !pp || isNaN(t) || isNaN(cp) || isNaN(pp) || t <= 0 || cp <= 0 || pp <= 0) {
    return { saving: null, fuelGstAmount: null, pelletGstAmount: null };
  }

  const fuelRate = GST_RATE[fuel] ?? null;

  // Rate unknown → cannot compare (Q-CALC: show — for non-Coal)
  if (fuelRate === null) {
    return { saving: null, fuelGstAmount: null, pelletGstAmount: null };
  }

  const currentTotal = t * cp * (1 + fuelRate);
  const pelletTotal  = t * pp * (1 + PELLET_GST);
  const saving       = currentTotal - pelletTotal;

  return {
    saving:          Math.round(saving),
    fuelGstAmount:   Math.round(t * cp * fuelRate),
    pelletGstAmount: Math.round(t * pp * PELLET_GST),
  };
}

/**
 * Format a number as Indian Rupees, or return '₹\u00a0——' for null/NaN.
 * @param {number|null} value
 * @returns {string}
 */
export function inr(value) {
  if (value == null || isNaN(value)) return '₹\u00a0——';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}
