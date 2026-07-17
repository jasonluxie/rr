# Restaurant Roulette 🍽️

An elegant, lightweight web application that resolves the age-old question: *"Where should we eat?"* 

The app requests your location, retrieves nearby restaurants using the Google Places API via a secure Cloudflare Worker, filters the results to eliminate spam/ghost kitchens, and picks a winning restaurant using an animated HTML5 Canvas roulette wheel.

---

## 🏗️ Architecture & Security

To protect your API credentials and minimize costs, the application is divided into two distinct components:

1. **Frontend UI (`index.html`)**:
   - A single-file, zero-framework, vanilla stack (HTML5, CSS3, ES6+ JS).
   - High-fidelity visual design with responsive layouts and modern glassmorphic panels.
   - Interactive HTML5 Canvas animation loop with physics-based deceleration and Retina (high-DPI) scaling.
   - Secure: **Never** stores or transmits your API keys directly from the browser.

2. **Backend Proxy (`worker.js`)**:
   - A Cloudflare Worker serverless microservice.
   - Appends your Google Places API Key securely to the headers and proxies the request to the Google Places Nearby Search endpoint.
   - Handles CORS headers dynamically to block unauthorized access.
   - **Cache Shielding**: Rounds coordinates (`lat`/`lng`) to 3 decimal places (approx. 100-meter precision) to group location queries. It caches successful API results for 1 hour on the Cloudflare edge network, reducing duplicate Google billing hits to virtually zero.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla CSS3 (custom HSL variables, glassmorphism, responsive grid), Vanilla ES6+ JavaScript, Canvas 2D Context.
- **Backend**: Cloudflare Workers (ES modules syntax).
- **APIs**: Google Places API (Nearby Search), HTML5 Geolocation API, Google Maps URLs API (linking winners via Place ID).
- **Build/Dev Tool**: Vite (used as a lightweight local development server).

---

## 🚀 Setup & Deployment

### 1. Configure Google Cloud Console
1. Log in to the [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the **Places API** for your project. (Ensure a billing account is linked to activate your $200 free monthly credits).
3. Under **Credentials**, create an **API key** and copy it.
4. *(Recommended)* restrict the API key to only allow calls to the **Places API**.

### 2. Configure Cloudflare Worker
Deploy the worker code to Cloudflare and bind your API key to a secure environment variable:

1. Log in to your Cloudflare account via the local Wrangler CLI:
   ```bash
   npx wrangler login
   ```
2. Upload your API key as a secret named `MAPS_KEY`:
   ```bash
   npx wrangler secret put MAPS_KEY
   ```
   *Paste your Google API key when prompted.*
3. Deploy the worker script to your worker (named `rr`):
   ```bash
   npx wrangler deploy worker.js --name rr --compatibility-date 2026-07-17
   ```
   Take note of your deployed Worker URL (e.g. `https://rr.jasonluxie.workers.dev`).

### 3. Run the Frontend Locally
1. Install project dependencies (Vite & Wrangler):
   ```bash
   npm install
   ```
2. Start the local server:
   ```bash
   npm run dev
   ```
3. Open your browser to the local address (typically `http://localhost:5173/rr/`).
4. Paste your Cloudflare Worker URL in the settings panel (it persists automatically to `localStorage`).
5. Select a search radius, click **Get Local Restaurants**, and press **SPIN**!