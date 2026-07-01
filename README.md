# TEMPO

> **In sync with your body**

TEMPO is a private, offline-first period tracking Progressive Web App. It helps users log periods, understand cycle patterns, review personal trends, share a notes-free summary when needed, and view locally calculated estimates without creating an account or sending cycle data to an external service.

## Highlights

- Private onboarding profile and cycle survey
- Local 4-digit privacy PIN with Web Crypto hashing
- Automatic lock after inactivity
- Period logging with flow, pain, mood, symptoms, and notes
- Monthly home calendar with clean period, fertile, ovulation, and today markings
- Expanded weekly calendar with color-coded period, follicular, fertile, ovulation, luteal, and PMS estimate phases
- Estimated next period, ovulation date, fertile window, and PMS days
- Fertile window confidence level
- Cycle regularity score
- History-based symptom and cycle insights
- Interactive trend charts
- Editable period history
- Partner/doctor safe read-only view that hides private notes
- Offline educational library with cycle basics, PMS, doctor guidance, myths, and contraception disclaimer
- Installable offline PWA
- Responsive mobile-first interface

## Version 2 Features

Version 2 adds a safer sharing flow, richer cycle intelligence, and offline education:

- **Partner/doctor safe view:** A read-only summary screen for appointments or shared review. It includes cycle dates, period duration, flow, pain, mood, symptoms, averages, upcoming estimates, regularity score, and fertile confidence while hiding private notes and edit/delete actions.
- **Better calendar intelligence:** The home calendar stays simple and uncluttered, while the expanded calendar shows color-coded cycle phases including follicular, fertile, ovulation, luteal, PMS estimate, logged period, and predicted period.
- **Predictive insights:** TEMPO now calculates PMS estimate days, fertile window confidence, and a cycle regularity score from locally saved history.
- **Educational library:** Offline articles explain ovulation, PMS, when to consult a doctor, cycle myths, and why TEMPO predictions should not be used as contraception guidance.

## Privacy

All profile details, survey answers, settings, and period logs are stored locally in IndexedDB on the user's device.

TEMPO does not use:

- Cloud accounts
- External period-tracking APIs
- Analytics or advertising trackers
- Raw PIN storage

Predictions, phase labels, fertile confidence, PMS estimates, and regularity scores are estimates based on user-entered history. They are not medical advice and should not be used for contraception guidance.

## Technology

| Area | Technology |
| --- | --- |
| Interface | React 19, Vite, Tailwind CSS |
| State | Zustand |
| Local storage | Dexie, IndexedDB |
| Date calculations | date-fns |
| Charts | Recharts |
| Offline support | vite-plugin-pwa, Workbox |
| Hosting | Vercel |

## Project Structure

```text
src/
  components/   Reusable interface components
  db/           Dexie database configuration
  pages/        Application screens, including safe view and library
  store/        Zustand application store
  utils/        Cycle calculations and PIN utilities
test/           Calculation and validation tests
public/icons/   Favicons, PWA icons, and Apple touch icon
```

## Local Development

Requirements:

- Node.js 20 or newer
- npm

Install dependencies and start Vite:

```bash
npm install
npm run dev
```

Create and preview a production build:

```bash
npm run build
npm run preview
```

## Quality Checks

```bash
npm run lint
npm test
npm run build
```

## PWA Support

The production build generates:

- Web app manifest
- Offline service worker
- Precached application shell
- Standard and maskable `192x192` and `512x512` icons
- Safari `180x180` Apple touch icon

The app works offline after its first successful production visit.

## Deploying to Vercel

### Vercel Dashboard

1. Import the GitHub repository into Vercel.
2. Select the **Vite** framework preset.
3. Vercel will use the settings in `vercel.json`.
4. Deploy the project.

### Vercel CLI

```bash
npx vercel
npx vercel --prod
```

Deployment configuration:

- Build command: `npm run build`
- Output directory: `dist`
- Node.js: `20+`
- SPA routes rewrite to `index.html`
- Service worker and manifest use revalidation headers
- Icon assets use long-lived immutable caching

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Generate the production PWA |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run automated tests |

## Disclaimer

TEMPO is not a medical device. Cycle, period, ovulation, fertile-window, PMS, phase, confidence, regularity, and symptom information displayed by the app is estimated from locally entered data.
