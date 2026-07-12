# Project: KASH — UAE multi-product marketplace

> Brand name is **KASH**. The wordmark renders as `KASH.` (highlight dot).

## Stack

React 19 · Vite · Tailwind v4 · Firebase (Firestore, Auth, Storage, Functions) · i18next (EN/AR) · Cloudflare Pages

## Auth
OTP-only (mobile → 4-digit code). No password field anywhere.
Sign-in and sign-up are one flow — account created on first login.
Google and Apple as secondary options.

## Account dashboard
"Where is my order" is the primary job. Active order tracking sits
above the fold, before profile, addresses or settings.
---
- Headings & hero: 'Fraunces' (serif, weights 400–600). Body & UI: Albert Sans.
- Canvas is #FBFBF9, not pure white. Cards stay #FFFFFF.
## Design system — non-negotiable

The colour palette is approved and final. Every colour has exactly one job.
Never introduce a colour outside this list. Never use a hex value inline.

```css
:root {
  --brand:      #0B4FA8;  /* header, nav, links, category icons, trust */
  --brand-dark: #0B2A4F;  /* footer, admin sidebar */
  --action:     #FF6A00;  /* BUTTONS ONLY */
  --price:      #E01E37;  /* prices and discount badges ONLY */
  --success:    #1B8A3A;  /* in stock, free delivery, delivered */
  --highlight:  #FFD54A;  /* sale emphasis, countdowns */
  --surface:    #F5F5F3;  /* soft grey surfaces */
  --canvas:     #FFFFFF;  /* page background, cards */
  --ink:        #1A1A1A;  /* body text */
  --ink-muted:  #6B6B6B;  /* secondary text */
  --border:     #E5E5E5;  /* hairlines */
}
```

### The rules that make it work

1. **`--action` orange appears ONLY on buttons.** Never on backgrounds, never on text,
   never on borders. If orange appears twice in the same card, one of them is wrong.
2. **`--price` red appears ONLY on prices and discount badges.** Never on a button —
   red buttons read as "stop" and suppress clicks.
3. **`--success` green appears ONLY on stock status, delivery promises, and confirmations.**
4. **One primary (orange) action per screen section.** Everything else is an outlined
   secondary button.
5. **Neutral dominates.** Roughly 60% white/grey, 30% brand blue, 10% everything else.
   The moment orange spreads across a background, the buttons stop standing out.
6. **Destructive actions are outlined red, never filled.** They are never the largest
   button on screen and always require confirmation.

### Admin panel inverts the palette

In `/admin`, colour means **status, not sales**:

| Token | Storefront | Admin |
|---|---|---|
| `--brand-dark` | footer | sidebar |
| `--brand` | header, trust | active nav, links, "Shipped" |
| `--action` | every button | ONE primary action per screen |
| `--price` | prices | errors, stock-outs, returns |
| `--highlight` | sale emphasis | pending, awaiting action |
| `--success` | free delivery | delivered, paid, settled |

An operator clicks dozens of things a minute. If every admin button were orange,
nothing would stand out. A row is amber because it needs work, red because something
is wrong, green because it is done.

---

## Typography

- One family: **Albert Sans** (weights 400, 500, 700). Arabic: **Noto Sans Arabic**.
- Sentence case everywhere. Never Title Case. Never ALL CAPS except tiny tracked labels.
- Body 14–16px. Never below 11px.

---

## RTL — build it in from day one

The Arabic store is a language toggle, not a second codebase.
**Never write `left` or `right`.** Use logical properties only.

```css
/* NO  */  margin-left: 8px;  padding-right: 12px;  left: 0;   text-align: left;
/* YES */  margin-inline-start: 8px;  padding-inline-end: 12px;
           inset-inline-start: 0;  text-align: start;
```

Tailwind: use `ms-*` `me-*` `ps-*` `pe-*` `start-*` `end-*`.
Never `ml-*` `mr-*` `pl-*` `pr-*` `left-*` `right-*`.

Then `<html dir="rtl">` mirrors the whole app for free.

---

## Component contracts

### Button
```jsx
<Button variant="primary">   // --action orange fill. ONE per screen section.
<Button variant="secondary"> // outlined --brand blue
<Button variant="danger">    // outlined --price red. Never filled.
<Button variant="ghost">     // text only
```
`variant="primary"` is the ONLY place `--action` may appear.

### ProductCard
Fixed anatomy. Do not rearrange — it appears on 3 screens and must be identical.

```
┌──────────────────────┐
│ [-75%]      image  ♡ │  discount badge top-start (--price)
│                      │  wishlist top-end
├──────────────────────┤
│ Product name         │  2 lines max, --ink
│ AED 7.92  31.99      │  --price, strikethrough --ink-muted
│ Free delivery · Stock│  --success
│ ┌──────────────────┐ │
│ │   Add to cart    │ │  full width, --action
│ └──────────────────┘ │
└──────────────────────┘
```

### StatusBadge (admin)
```jsx
pending   → --highlight bg
packing   → --highlight bg
shipped   → --brand bg
delivered → --success bg
returned  → --price bg, and tint the ENTIRE ROW
```
Problems must be findable by peripheral vision, without reading.

---

## Security — do not compromise

- **Never trust the client on price.** Cart sends `{productId, qty}` only.
  A Cloud Function reads prices from Firestore and computes the total.
- **Orders are created only by Cloud Function.** Firestore rule: `allow create: if false`.
- **Coupons are never client-readable.** `allow read: if false`. Validate server-side.
- **Stock decrement runs in a Firestore transaction.** Two people buying the last item
  must not both succeed.
- **Every staff action writes to `auditLog`** — refunds, price changes, stock adjustments.
  User + timestamp + before + after. Immutable.
- Roles: `customer` `ops` `manager` `owner`. Only `owner` touches settings, staff, payouts.

---

## Payments

Card · Apple Pay · **Cash on delivery**.

COD is not optional for the UAE market. It also means an order can be *shipped but not
yet paid* — the admin orders table must surface `unpaid`, `on delivery`, `refund due`
as payment states, not just payment methods.

---

## Definition of done — every screen

Before marking any screen complete:

- [ ] Renders correctly with `dir="rtl"` and Arabic strings
- [ ] Works at 375px on a real phone
- [ ] Loading, empty, and error states all exist
- [ ] Zero hardcoded hex values — tokens only
- [ ] Orange appears exactly once per card and once per screen section
- [ ] No `left`/`right` CSS — logical properties only

---

## Build order

1. Tokens + primitives (Button, Card, Badge, Input)
2. Layout (Header, Nav, Footer, MobileTabBar)
3. ProductCard — used on 3 screens, get it right once
4. Home → Category → Product
5. Cart (client state) → Checkout (server-validated)
6. Admin: Orders → Products → Inventory → Settings

## Scope for v1 — do not build these yet

Vendor portal · commission engine · reports · promotions engine · content CMS.
Vendors run on a spreadsheet for the pilot. 44 products does not justify a portal.
