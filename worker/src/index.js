import { verifyIdToken } from './auth.js'

// ---------- helpers ----------
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Max-Age': '86400',
}
const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', ...CORS } })
const err = (status, message) => json({ error: message }, status)

const levelFor = (stock, lowAt = 10) => (stock === 0 ? 'out' : stock <= lowAt ? 'low' : 'ok')
const DELIVERY_FEE = 15
const FREE_THRESHOLD = 100
const round2 = (n) => Math.round(n * 100) / 100

function parseJson(v, fallback) {
  if (!v) return fallback
  try { return JSON.parse(v) } catch { return fallback }
}
const slugify = (s) => (s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function mapProduct(r) {
  const images = parseJson(r.images, r.image ? [r.image] : [])
  const highlights = parseJson(r.highlights, null) ?? (r.description ? r.description.split('·').map((s) => s.trim()).filter(Boolean) : [])
  return {
    id: r.id,
    name: r.name,
    description: r.description || '',
    highlights,
    images,
    video: r.video || null,
    category: r.category,
    vendor: r.vendor,
    seller: r.seller,
    commission: r.commission,
    cost: r.cost,
    price: r.price,
    wasPrice: r.was_price,
    discountPct: r.discount_pct,
    badge: r.badge,
    freeDelivery: !!r.free_delivery,
    sku: r.sku,
    stock: r.stock,
    lowAt: r.low_at,
    inStock: r.stock > 0,
    level: levelFor(r.stock, r.low_at),
    published: !!r.published,
    rating: r.rating,
    ratingsCount: r.ratings_count,
    sold: r.sold,
    image: images[0] || r.image,
  }
}

function mapOrder(o, items) {
  return {
    id: o.id,
    uid: o.uid,
    customer: o.customer,
    email: o.email,
    date: new Date(o.created_at + 'Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    items: items ? items.reduce((n, i) => n + i.qty, 0) : o.item_count,
    subtotal: o.subtotal,
    discount: o.discount,
    deliveryFee: o.delivery_fee,
    total: o.total,
    coupon: o.coupon,
    payment: o.payment,
    status: o.status,
    address: o.address_json ? JSON.parse(o.address_json) : null,
    lines: items ? items.map((i) => ({ id: i.product_id, name: i.name, price: i.price, qty: i.qty })) : undefined,
  }
}

async function requireAuth(request, env) {
  const auth = request.headers.get('Authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) return { error: err(401, 'Missing token') }
  try {
    const payload = await verifyIdToken(token, env.FIREBASE_PROJECT_ID)
    return { user: { uid: payload.sub, email: (payload.email || '').toLowerCase(), name: payload.name || '' } }
  } catch (e) {
    return { error: err(401, 'Invalid token: ' + e.message) }
  }
}
const isAdmin = (user, env) =>
  (env.ADMIN_EMAILS || '').split(',').map((s) => s.trim().toLowerCase()).includes(user.email)

function applyCoupon(row, subtotal, baseDelivery) {
  if (!row || !row.active) return { ok: false }
  if (row.min_subtotal && subtotal < row.min_subtotal) return { ok: false, error: 'min', min: row.min_subtotal }
  if (row.type === 'percent') return { ok: true, code: row.code, discount: round2((subtotal * row.value) / 100), freeDelivery: false, label: row.label }
  if (row.type === 'freeDelivery') return { ok: true, code: row.code, discount: 0, freeDelivery: true, label: row.label }
  return { ok: false }
}

const audit = (env, actor, action, detail) =>
  env.DB.prepare('INSERT INTO audit_log (actor, action, detail) VALUES (?,?,?)').bind(actor, action, detail).run()

// ---------- router ----------
export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS })
    const url = new URL(request.url)
    const p = url.pathname.replace(/\/$/, '') || '/'
    const m = request.method
    try {
      // health
      if (p === '/' || p === '/api') return json({ ok: true, service: 'kash-api' })

      // ---- public: categories ----
      if (p === '/api/categories' && m === 'GET') {
        const { results } = await env.DB.prepare('SELECT slug, name FROM categories ORDER BY name').all()
        return json(results)
      }

      // ---- public: products ----
      if (p === '/api/products' && m === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM products WHERE published = 1 ORDER BY created_at DESC').all()
        return json(results.map(mapProduct))
      }
      let match
      if ((match = p.match(/^\/api\/products\/([^/]+)$/)) && m === 'GET') {
        const row = await env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(match[1]).first()
        return row ? json(mapProduct(row)) : err(404, 'Not found')
      }

      // ---- reviews ----
      if ((match = p.match(/^\/api\/products\/([^/]+)\/reviews$/))) {
        const pid = match[1]
        if (m === 'GET') {
          const { results } = await env.DB.prepare('SELECT rating, author, text, created_at FROM reviews WHERE product_id = ? ORDER BY created_at DESC').bind(pid).all()
          return json(results.map((r) => ({ rating: r.rating, author: r.author, text: r.text, date: r.created_at })))
        }
        if (m === 'POST') {
          const a = await requireAuth(request, env); if (a.error) return a.error
          const body = await request.json()
          await env.DB.prepare('INSERT INTO reviews (product_id, uid, author, rating, text) VALUES (?,?,?,?,?)')
            .bind(pid, a.user.uid, a.user.name || 'Customer', body.rating | 0, (body.text || '').trim()).run()
          return json({ ok: true })
        }
      }

      // ---- coupon validate (never exposes the list) ----
      if (p === '/api/coupons/validate' && m === 'POST') {
        const body = await request.json()
        const subtotal = Number(body.subtotal) || 0
        const baseDelivery = subtotal >= FREE_THRESHOLD ? 0 : DELIVERY_FEE
        const row = await env.DB.prepare('SELECT * FROM coupons WHERE code = ? AND active = 1').bind((body.code || '').trim().toUpperCase()).first()
        const res = applyCoupon(row, subtotal, baseDelivery)
        return json(res)
      }

      // ---- orders (auth) ----
      if (p === '/api/orders' && m === 'GET') {
        const a = await requireAuth(request, env); if (a.error) return a.error
        const { results } = await env.DB.prepare(
          `SELECT o.*, (SELECT COUNT(*) FROM order_items i WHERE i.order_id=o.id) AS item_count
           FROM orders o WHERE uid = ? ORDER BY created_at DESC`,
        ).bind(a.user.uid).all()
        return json(results.map((o) => mapOrder(o)))
      }
      if (p === '/api/orders' && m === 'POST') {
        const a = await requireAuth(request, env); if (a.error) return a.error
        return placeOrder(request, env, a.user)
      }
      if ((match = p.match(/^\/api\/orders\/([^/]+)$/)) && m === 'GET') {
        const a = await requireAuth(request, env); if (a.error) return a.error
        const o = await env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(match[1]).first()
        if (!o) return err(404, 'Not found')
        if (o.uid !== a.user.uid && !isAdmin(a.user, env)) return err(403, 'Forbidden')
        const { results: items } = await env.DB.prepare('SELECT * FROM order_items WHERE order_id = ?').bind(o.id).all()
        return json(mapOrder(o, items))
      }

      // ---- admin ----
      if (p.startsWith('/api/admin/')) {
        const a = await requireAuth(request, env); if (a.error) return a.error
        if (!isAdmin(a.user, env)) return err(403, 'Admins only')
        const admin = a.user

        if (p === '/api/admin/products' && m === 'GET') {
          const { results } = await env.DB.prepare('SELECT * FROM products ORDER BY created_at DESC').all()
          return json(results.map(mapProduct))
        }
        if (p === '/api/admin/orders' && m === 'GET') {
          const { results } = await env.DB.prepare(
            `SELECT o.*, (SELECT COUNT(*) FROM order_items i WHERE i.order_id=o.id) AS item_count FROM orders o ORDER BY created_at DESC`,
          ).all()
          return json(results.map((o) => mapOrder(o)))
        }
        if ((match = p.match(/^\/api\/admin\/orders\/([^/]+)$/)) && m === 'PATCH') {
          const body = await request.json()
          const status = body.status
          const o = await env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(match[1]).first()
          if (!o) return err(404, 'Not found')
          let payment = o.payment
          if (status === 'delivered' && payment === 'on-delivery') payment = 'paid'
          if (status === 'returned') payment = 'refund-due'
          await env.DB.prepare('UPDATE orders SET status=?, payment=? WHERE id=?').bind(status, payment, o.id).run()
          await audit(env, admin.email, 'order.status', `${o.id} → ${status}`)
          return json({ ok: true })
        }
        if (p === '/api/admin/products' && m === 'POST') {
          const b = await request.json()
          const prod = normalizeProduct(b)
          await upsertProduct(env, prod)
          await audit(env, admin.email, 'product.add', prod.name)
          return json(mapProduct(await env.DB.prepare('SELECT * FROM products WHERE id=?').bind(prod.id).first()))
        }
        if ((match = p.match(/^\/api\/admin\/products\/([^/]+)$/))) {
          const id = match[1]
          if (m === 'PUT') {
            const b = await request.json()
            const prod = normalizeProduct({ ...b, id })
            await upsertProduct(env, prod)
            await audit(env, admin.email, 'product.edit', id)
            return json(mapProduct(await env.DB.prepare('SELECT * FROM products WHERE id=?').bind(id).first()))
          }
          if (m === 'DELETE') {
            await env.DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run()
            await audit(env, admin.email, 'product.delete', id)
            return json({ ok: true })
          }
        }
        if ((match = p.match(/^\/api\/admin\/products\/([^/]+)\/restock$/)) && m === 'POST') {
          const b = await request.json()
          const qty = Number(b.qty) || 0
          await env.DB.prepare('UPDATE products SET stock = stock + ? WHERE id = ?').bind(qty, match[1]).run()
          await audit(env, admin.email, 'inventory.restock', `${match[1]} +${qty}`)
          return json({ ok: true })
        }
        if (p === '/api/admin/audit' && m === 'GET') {
          const { results } = await env.DB.prepare('SELECT * FROM audit_log ORDER BY at DESC LIMIT 100').all()
          return json(results)
        }
        if (p === '/api/admin/images' && m === 'POST') {
          const ct = request.headers.get('Content-Type') || 'image/jpeg'
          const ext = ct.split('/')[1]?.split('+')[0] || 'jpg'
          const key = `products/${crypto.randomUUID()}.${ext}`
          await env.IMAGES.put(key, request.body, { httpMetadata: { contentType: ct } })
          return json({ url: `${url.origin}/img/${key}` })
        }
        return err(404, 'Unknown admin route')
      }

      // ---- serve R2 images ----
      if ((match = p.match(/^\/img\/(.+)$/)) && m === 'GET') {
        const obj = await env.IMAGES.get(match[1])
        if (!obj) return err(404, 'No image')
        return new Response(obj.body, {
          headers: { 'Content-Type': obj.httpMetadata?.contentType || 'image/jpeg', 'Cache-Control': 'public, max-age=31536000', ...CORS },
        })
      }

      return err(404, 'Not found')
    } catch (e) {
      return err(500, e.message)
    }
  },
}

// ---------- order creation (server-authoritative) ----------
async function placeOrder(request, env, user) {
  const body = await request.json()
  const items = Array.isArray(body.items) ? body.items.filter((i) => i.id && i.qty > 0) : []
  if (!items.length) return err(400, 'Empty cart')

  // Look up REAL prices/stock from D1 — never trust the client.
  const ids = items.map((i) => i.id)
  const placeholders = ids.map(() => '?').join(',')
  const { results: rows } = await env.DB.prepare(`SELECT * FROM products WHERE id IN (${placeholders})`).bind(...ids).all()
  const byId = Object.fromEntries(rows.map((r) => [r.id, r]))

  let subtotal = 0
  const lines = []
  for (const it of items) {
    const prod = byId[it.id]
    if (!prod || !prod.published) return err(400, `Unavailable: ${it.id}`)
    const qty = Math.min(it.qty, prod.stock)
    if (qty <= 0) return err(409, `Out of stock: ${prod.name}`)
    subtotal += prod.price * qty
    lines.push({ id: prod.id, name: prod.name, price: prod.price, qty })
  }
  subtotal = round2(subtotal)

  // Delivery + coupon (server-side)
  let deliveryFee = subtotal >= FREE_THRESHOLD ? 0 : DELIVERY_FEE
  let discount = 0
  let couponCode = null
  if (body.coupon) {
    const row = await env.DB.prepare('SELECT * FROM coupons WHERE code = ? AND active = 1').bind(String(body.coupon).trim().toUpperCase()).first()
    const res = applyCoupon(row, subtotal, deliveryFee)
    if (res.ok) {
      discount = res.discount
      if (res.freeDelivery) deliveryFee = 0
      couponCode = res.code
    }
  }
  const total = round2(Math.max(0, subtotal - discount + deliveryFee))
  const payment = body.payment === 'cod' ? 'unpaid' : 'paid'
  const orderId = `SQ-${Math.floor(10000 + Math.random() * 90000)}`
  const customer = body.customer || user.name || user.email

  // Atomic: decrement stock + insert order + items
  const batch = [
    env.DB.prepare(
      `INSERT INTO orders (id, uid, customer, email, subtotal, discount, delivery_fee, total, coupon, payment, status, address_json)
       VALUES (?,?,?,?,?,?,?,?,?,?, 'packing', ?)`,
    ).bind(orderId, user.uid, customer, user.email, subtotal, discount, deliveryFee, total, couponCode, JSON.stringify(body.address || null)),
  ]
  for (const l of lines) {
    batch.push(env.DB.prepare('INSERT INTO order_items (order_id, product_id, name, price, qty) VALUES (?,?,?,?,?)').bind(orderId, l.id, l.name, l.price, l.qty))
    batch.push(env.DB.prepare('UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?').bind(l.qty, l.id))
  }
  await env.DB.batch(batch)
  await audit(env, user.email, 'order.create', `${orderId} · ${customer}`)

  const o = await env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(orderId).first()
  return json(mapOrder(o, lines.map((l) => ({ product_id: l.id, name: l.name, price: l.price, qty: l.qty }))))
}

// ---------- product normalization (create/update) ----------
function normalizeProduct(b) {
  const idBase = (b.sku || b.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const id = b.id || idBase || `sku-${Date.now()}`
  const price = Number(b.price) || 0
  const was = b.wasPrice ? Number(b.wasPrice) : null
  const discountPct = was && price && was > price ? Math.round((1 - price / was) * 100) : null
  const images = Array.isArray(b.images) ? b.images.filter(Boolean) : b.image ? [b.image] : []
  const highlights = Array.isArray(b.highlights) ? b.highlights.map((s) => String(s).trim()).filter(Boolean) : []
  const primary = images[0] || `https://picsum.photos/seed/${id}/600/600`
  return {
    id,
    name: b.name || 'Untitled',
    description: b.description || '',
    highlights: JSON.stringify(highlights),
    images: JSON.stringify(images.length ? images : [primary]),
    video: b.video || null,
    category: b.category || 'General',
    vendor: b.vendor || 'KASH Essentials',
    seller: b.seller || null,
    commission: b.commission != null ? Number(b.commission) : null,
    cost: b.cost != null ? Number(b.cost) : null,
    price,
    was_price: was,
    discount_pct: discountPct,
    badge: discountPct ? 'discount' : 'new',
    sku: b.sku || id.toUpperCase(),
    stock: Number(b.stock) || 0,
    low_at: Number(b.lowAt) || 10,
    published: b.published === false ? 0 : 1,
    image: primary,
  }
}
async function upsertProduct(env, p) {
  // Make sure the category exists (create-on-the-fly).
  if (p.category) {
    await env.DB.prepare('INSERT OR IGNORE INTO categories (slug, name) VALUES (?, ?)').bind(slugify(p.category), p.category).run()
  }
  await env.DB.prepare(
    `INSERT INTO products (id,name,description,highlights,images,video,category,vendor,seller,commission,cost,price,was_price,discount_pct,badge,sku,stock,low_at,published,image)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
     ON CONFLICT(id) DO UPDATE SET
       name=excluded.name, description=excluded.description, highlights=excluded.highlights, images=excluded.images,
       video=excluded.video, category=excluded.category, vendor=excluded.vendor, seller=excluded.seller,
       commission=excluded.commission, cost=excluded.cost, price=excluded.price, was_price=excluded.was_price,
       discount_pct=excluded.discount_pct, badge=excluded.badge, sku=excluded.sku, stock=excluded.stock,
       low_at=excluded.low_at, published=excluded.published, image=excluded.image`,
  ).bind(p.id, p.name, p.description, p.highlights, p.images, p.video, p.category, p.vendor, p.seller, p.commission, p.cost, p.price, p.was_price, p.discount_pct, p.badge, p.sku, p.stock, p.low_at, p.published, p.image).run()
}
