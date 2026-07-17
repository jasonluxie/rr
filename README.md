# Restaurant Roulette

An elegant, lightweight web application that resolves the age-old question: "Where should we eat?"

The app retrieves nearby restaurants using the Google Places API via a secure Cloudflare Pages Function, filters the results to eliminate spam/ghost kitchens, and picks a winning restaurant using an animated HTML5 Canvas roulette wheel.

---

## Architecture & Security

To protect your API credentials and minimize costs, the application is divided into two distinct components:

1. **Frontend UI (index.html)**:
   - A single-file, zero-framework, vanilla stack (HTML5, CSS3, ES6+ JS).
   - Centered visual focus on the canvas wheel, with configuration options and restaurant lists placed side-by-side underneath.
   - Interactive HTML5 Canvas animation loop with physics-based deceleration and Retina (high-DPI) scaling.
   - **Location Geocoding Search**: Resolves desktop browser geolocation inaccuracies (where ISPs center traffic in metropolitan hubs rather than local suburbs) by allowing users to enter custom cities or zip codes. It integrates Nominatim to resolve coordinates for free with client-side fallback to browser Geolocation.
   - Secure: Never stores or transmits your API keys directly from the browser. Fetches data relatively via `/api`.

2. **Backend Proxy (functions/api.js)**:
   - Built as a Cloudflare Pages Function serving the `/api` route.
   - Appends your Google Places API Key securely to the headers and proxies the request to the Google Places Nearby Search endpoint.
   - **Cache Shielding**: Rounds coordinates (lat/lng) to 3 decimal places (approx. 100-meter precision) to group location queries. It caches successful API results for 1 hour on the Cloudflare edge network, reducing duplicate Google billing hits to virtually zero.

---

## Tech Stack

- **Frontend**: HTML5, Vanilla CSS3 (custom HSL variables, glassmorphism, responsive grid), Vanilla ES6+ JavaScript, Canvas 2D Context.
- **Backend**: Cloudflare Pages Functions (ES modules syntax).
- **APIs**: Google Places API (Nearby Search), HTML5 Geolocation API, OpenStreetMap Nominatim API, Google Maps URLs API (linking winners via Place ID).
- **Build/Dev Tool**: Vite (used as a lightweight local development server with a built-in proxy for local testing).