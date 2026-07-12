# KASH — UAE multi-product marketplace

A modern e-commerce marketplace for the UAE. Storefront (EN/AR, RTL), customer account,
and an admin panel — built mobile-first with a strict, approved design system.

## Stack
- **React 19 · Vite · Tailwind v4** · React Router · i18next (EN/AR)
- **Auth:** Firebase Authentication (email/password)
- **Data + logic + images (planned):** Cloudflare **D1** (database) + **Workers** (API) + **R2** (images)
- **Hosting (planned):** Firebase Hosting

> Everything except auth currently runs on local mock stores (React context + localStorage).
> The Cloudflare data/logic layer is the next milestone. See `PREREQUISITES.txt`.

## Getting started
```bash
npm install
cp .env.example .env.local   # fill in your Firebase web config
npm run dev
```

## Scripts
- `npm run dev` — start the Vite dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the build

## Notes
- The design system (colours, RTL rules, component contracts, security model) is documented
  in `CLAUDE.md` and must be followed — no inline hex, logical CSS properties only.
- `.env.local` is git-ignored. Firebase web config is public/safe, but keep it out of the repo.
