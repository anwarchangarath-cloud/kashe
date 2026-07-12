// Mock customer account data for the local build.
export const myOrders = [
  { id: 'SQ-10493', date: '10 July 2026', items: 3, total: 54.3, status: 'delivery', label: 'Out for delivery' },
  { id: 'SQ-10482', date: '9 July 2026', items: 3, total: 128.0, status: 'packing', label: 'Packing' },
  { id: 'SQ-10461', date: '2 July 2026', items: 1, total: 37.9, status: 'delivered', label: 'Delivered' },
  { id: 'SQ-10440', date: '25 June 2026', items: 5, total: 212.0, status: 'delivered', label: 'Delivered' },
]

export const seedAddresses = [
  { id: 'a1', label: 'Home', name: 'Anwar C.', phone: '+971 5X XXX XXXX', line: 'Al Quoz 1, Dubai, UAE', isDefault: true },
  { id: 'a2', label: 'Office', name: 'Anwar C.', phone: '+971 5X XXX XXXX', line: 'Business Bay, Dubai, UAE', isDefault: false },
]

export const cards = [
  { id: 'c1', brand: 'Visa', last4: '4242', exp: '08/28' },
  { id: 'c2', brand: 'Mastercard', last4: '5518', exp: '11/27' },
]

export const coupons = [
  { code: 'SAVE20', desc: '20% off orders over AED 150', exp: '14 Jul' },
  { code: 'FREEDEL', desc: 'Free delivery, any order', exp: '31 Jul' },
  { code: 'WELCOME15', desc: '15% off your first order', exp: '31 Dec' },
]
