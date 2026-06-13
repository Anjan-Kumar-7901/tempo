# TEMPO

## In sync with your body

TEMPO is a private, offline-first period tracking Progressive Web App (PWA) designed to help users track their menstrual cycles, understand patterns, and view simple predictions based on their own data.

The application prioritizes privacy by storing all data locally on the device and does not require account creation in the MVP version.

---

## Features

### Cycle Tracking

* Log period start and end dates
* View period history
* Edit and delete entries
* Track cycle duration

### Predictions

* Next period estimate
* Average cycle length
* Average period duration
* Current cycle day

### Insights

* Cycle trends
* Duration trends
* Symptom frequency
* Period history analytics

### Privacy

* Local-only data storage
* Offline-first architecture
* 4-digit PIN protection
* No cloud sync in MVP
* No third-party period tracking APIs

### PWA

* Installable on mobile devices
* Works offline
* Responsive design
* Optimized for iOS and Android

---

## Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS

### State Management

* Zustand

### Storage

* IndexedDB
* Dexie.js

### Date Calculations

* date-fns

### Charts

* Recharts

### PWA

* vite-plugin-pwa

### Deployment

* Vercel

---

## Project Structure

src/

* components/
* pages/
* db/
* store/
* utils/

---

## Getting Started

### Clone Repository

git clone https://github.com/your-username/tempo.git

cd tempo

### Install Dependencies

npm install

### Run Development Server

npm run dev

### Build Production

npm run build

### Preview Production Build

npm run preview

---

## Privacy Notice

TEMPO stores user data locally on the device.

Predictions are generated using cycle history and are estimates only.

TEMPO is not a medical device and should not be used for medical diagnosis, fertility treatment decisions, or contraception planning.

---

## Roadmap

### MVP

* PIN protection
* Cycle tracking
* Period predictions
* Calendar
* Insights

### Future Versions

* Cloud backup
* Email authentication
* Mobile authentication
* Multi-device sync
* Export reports
* Advanced cycle insights

---

## License

MIT License
