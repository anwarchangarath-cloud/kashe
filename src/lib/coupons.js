// Client-side coupon rules for the local build. In production coupons are NEVER
// client-readable — a Cloud Function validates them (see CLAUDE.md · Security).
const RULES = {
  SAVE20: { type: 'percent', value: 20, minSubtotal: 150, label: '20% off orders over AED 150' },
  WELCOME15: { type: 'percent', value: 15, minSubtotal: 0, label: '15% off your order' },
  FREEDEL: { type: 'freeDelivery', label: 'Free delivery' },
}

// Returns { ok, discount, freeDelivery, label, error }.
export function applyCoupon(code, subtotal, deliveryFee = 0) {
  const key = (code ?? '').trim().toUpperCase()
  if (!key) return { ok: false, error: 'empty' }
  const rule = RULES[key]
  if (!rule) return { ok: false, error: 'invalid' }
  if (rule.minSubtotal && subtotal < rule.minSubtotal) {
    return { ok: false, error: 'min', min: rule.minSubtotal }
  }
  if (rule.type === 'percent') {
    return { ok: true, code: key, discount: Math.round(subtotal * rule.value) / 100, freeDelivery: false, label: rule.label }
  }
  if (rule.type === 'freeDelivery') {
    return { ok: true, code: key, discount: 0, freeDelivery: true, deliverySaved: deliveryFee, label: rule.label }
  }
  return { ok: false, error: 'invalid' }
}

export const FREE_DELIVERY_THRESHOLD = 100
export const DELIVERY_FEE = 15

export function deliveryFeeFor(subtotal) {
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
}
