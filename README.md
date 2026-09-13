# 🦆 CruiseDuck Tracker ("Operation Rubber Duck")

[![Google Cloud Run](https://img.shields.io/badge/Deploy-Google%20Cloud%20Run-4285F4?logo=google-cloud&logoColor=white)](https://cloud.google.com/run)
[![Cloud Firestore](https://img.shields.io/badge/Database-Cloud%20Firestore%20(operationruberduck--db)-FFA000?logo=firebase&logoColor=white)](https://firebase.google.com/docs/firestore)
[![Three.js / Globe.gl](https://img.shields.io/badge/3D%20Visualization-Three.js%20%2B%20Globe.gl-00D2B8?logo=threedotjs&logoColor=white)](#)
[![Zero PII](https://img.shields.io/badge/Privacy-100%25%20Zero--PII-4AE290)](#3-strict-functional--architectural-constraints)

A full-stack physical-to-digital IoT/Web scavenger hunt built for a father-and-son Caribbean cruise adventure. Custom rubber ducks equipped with waterproof QR tags (`?id=DUCK-042&sig=8f3a9d`) are hidden across the ship. When a fellow passenger scans a duck tag on their smartphone, they are taken to an interactive **3D Spinning Globe** (`Three.js / Globe.gl`) running on **Google Cloud Run** and backed by **Google Cloud Firestore** (`operationruberduck-db`).

---

## 🌴 Key Features & Caribbean Cruise Capabilities

1. **Interactive 3D Spinning Globe (`GlobeView.tsx`):**
   - Renders glowing pins for every finder's hometown around the world.
   - Animates golden flight arcs from each hometown to the Cruise Ship's current position in the Caribbean Sea (`21.4691° N, 71.1399° W`).
   - Calculates exact Great-Circle statute miles traveled using the Haversine formula and awards the **"Farthest Hometown Traveler"** trophy!

2. **Frictionless Mobile-First City/Country Pinning (`FindSubmissionModal.tsx`):**
   - **100% Zero-PII:** No login, names, emails, or phone numbers required.
   - Includes a bundled global cities database (`worldCities.ts`) for instant offline/low-bandwidth autocomplete on satellite Wi-Fi, plus Nominatim fallback for any town on Earth.
   - Automatically detects QR query parameters (`?id=DUCK-042&sig=...`) and verifies cryptographic HMAC signatures.

3. **Cruise-Ship NAT-Aware Anti-Spam Protection (`antiSpamService.js`):**
   - Cruise ship satellite Wi-Fi (Starlink Maritime / VSAT) routes all passengers through shared Carrier-Grade NAT IP addresses.
   - Instead of blocking shared shipboard IPs, CruiseDuck Tracker enforces a 4-layer defense:
     1. **Cryptographic QR HMAC Signatures (`?id=DUCK-042&sig=8f3a9d`)**
     2. **Device Fingerprinting + Local Session Cooldown (1-hour cooldown per device per duck)**
     3. **Automated PII & Profanity Scrubbing (regex stripping of emails, phone numbers, URLs, and profanity)**
     4. **Strict 100-Character Note Enforcement**

4. **Built-In Waterproof QR Tag Studio (`TagGeneratorModal.tsx`):**
   - Generates ready-to-print `1.5" × 1.5"` waterproof QR label sheets with Level-H (30% recovery) QR codes and embedded cryptographic signatures for `DUCK-001` through `DUCK-025+`.

---

## 🏗️ Repository Directory Tree

```text
Operation-Ruber-Duck/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions CI/CD pipeline (Workload Identity Federation -> Cloud Run)
├── client/                         # React 19 + TypeScript + Vite + Three.js / Globe.gl Frontend
│   ├── index.html                  # Tropical Caribbean Vacation mobile-first HTML entry point
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── App.tsx                 # Main CruiseDuck Tracker Caribbean Vacation Experience
│       ├── index.css               # Tropical Caribbean Resort CSS Design System & @media print Tag Sheet
│       ├── types/duck.ts           # TypeScript interfaces for Ducks, Discoveries, and Stats
│       ├── data/worldCities.ts     # Bundled global cities dataset for zero-latency satellite autocomplete
│       ├── utils/deviceFingerprint.ts # Cruise-ship NAT-safe device fingerprinting & cooldown manager
│       └── components/
│           ├── GlobeView.tsx       # 3D Interactive Spinning Globe with glowing pins & flight arcs
│           ├── FindSubmissionModal.tsx # Mobile-first City/Country picker modal with anti-spam check
│           ├── DuckCatalogModal.tsx # Captain's Duck Fleet Roster (DUCK-001 to DUCK-025)
│           └── TagGeneratorModal.tsx # Printable Waterproof QR Code Tag Studio
├── server/                         # Node.js 22 / Express Backend Server (Google Cloud Run)
│   ├── index.js                    # Express API Server + Static SPA Host
│   ├── services/
│   │   ├── firestoreService.js     # Stateful Cloud Firestore service targeting `operationruberduck-db`
│   │   └── antiSpamService.js      # Maritime NAT-safe rate limiter, HMAC validator, & PII scrubber
│   ├── data/seedDucks.js           # Initial fleet of 25 custom Caribbean Cruise Ducks
│   └── tests/
│       └── databaseAndApi.test.js  # Automated QA Verification Suite proving cross-device DB persistence
├── Dockerfile                      # Multi-stage Docker build (Vite React frontend -> Express Node.js 22 container)
├── cloudbuild.yaml                 # Google Cloud Build pipeline deploying to Cloud Run (`operationruberduck-db`)
├── firestore.rules                 # Cloud Firestore security rules
├── firestore.indexes.json          # Cloud Firestore composite index definitions
├── ARCHITECTURE.md                 # Formal Product Architecture & Engineering Specification
└── README.md
```

---

## 🧪 Running Automated Database & Anti-Spam QA Tests

To verify that all duck discoveries are permanently recorded to the server database (`operationruberduck-db`) and shared across independent devices (never trapped in client `localStorage`), run:

```bash
cd server
npm test
```

The automated test suite (`server/tests/databaseAndApi.test.js`) validates:
1. `databaseId === 'operationruberduck-db'` configuration.
2. Cryptographic QR HMAC signature verification & Haversine distance calculations.
3. Zero-PII redaction (email/phone stripping) and profanity filtering.
4. End-to-End Cross-Device Server Database Persistence (Client A submits a discovery -> Client B queries `GET /api/discoveries` with zero shared local storage and receives the persisted record).
5. Cruise-Ship NAT-Aware Rate Limiting (blocks duplicate spam from the same device while allowing fellow passengers on the same shared ship NAT IP).

---

## 🚀 Deploying to Google Cloud Run

### Option 1: Google Cloud Build (`cloudbuild.yaml`)
```bash
gcloud builds submit --config cloudbuild.yaml
```

### Option 2: Direct `gcloud run deploy`
```bash
gcloud run deploy cruiseduck-tracker \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="FIRESTORE_DATABASE_ID=operationruberduck-db,NODE_ENV=production"
```
