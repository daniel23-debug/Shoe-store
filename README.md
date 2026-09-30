# STRIDE — Shoe Store Prototype

A clickable prototype for a premium footwear e-commerce store. Pure HTML/CSS/JS — no build step, no dependencies.

## Features
- Hero, trust strip, category tiles, bestsellers and full catalogue
- Filter by category & gender, sort by price/rating, live search
- Product quick-view with colour swatches, EU sizes (incl. sold-out states) and quantity
- Persistent shopping bag (localStorage) with automatic "buy 2, get 15% off" bundle discount
- Checkout flow with delivery options, M-Pesa / card / cash-on-delivery and an order confirmation screen
- Fully responsive (mobile nav drawer, 2-column grid on phones)

## Run locally
Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8080
```

## Deploy
Pushing to `main` deploys automatically to GitHub Pages via `.github/workflows/deploy-pages.yml`.
(Repo → Settings → Pages → Source: **GitHub Actions**.)

## Customise
- Products, prices and stock: `app.js` → `PRODUCTS`
- Brand name / copy: `index.html`
- Colours & fonts: `styles.css` → `:root`
- Images: `assets/`
