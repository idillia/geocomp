# GeoComp

**Global Compensation, Liquidity, and Purchasing Power Simulator.**

A single-page React app that compares a US W2 offer against a foreign contractor
setup (Brazil PJ, Portugal standard freelancer, or Portugal NHR 2.0). Everything
runs **100% in the browser** — no financial data ever leaves your device.

## Accuracy

Tax math uses real static tables (tax year 2024, single filer), pulled once and
saved locally in [`src/taxData.ts`](src/taxData.ts):

- **Federal** — real progressive IRS brackets (10%–37%) + $14,600 standard deduction.
- **FICA** — 6.2% Social Security capped at the $168,600 wage base, 1.45% Medicare
  on all wages, plus 0.9% Additional Medicare over $200,000.
- **State** — real 2024 California and New York progressive brackets; Texas and
  Washington have no wage income tax.
- **Cost of living** — monthly rent / expense defaults seeded from Numbeo (2025).
- **Foreign** — effective average rates (Simples Nacional Fator R for Brazil PJ;
  progressive IRS for Portugal standard; statutory flat 20% for NHR 2.0).

401(k) deferrals reduce income tax but not FICA; Section 125 health premiums
reduce both. See the notes in `taxData.ts` for sources.

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build to dist/
npm run preview  # preview the production build
```

## Deploy (GitHub Pages)

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds and publishes `dist/` to GitHub Pages. In the repo settings, set
**Settings → Pages → Build and deployment → Source** to **GitHub Actions** once.

## Stack

React 18 · TypeScript · Vite · Chakra UI v3 · Lucide icons.
