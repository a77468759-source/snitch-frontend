# Snitch storefront

## Run locally

1. Configure `server/.env` with `MONGO_URI`, `ACCESS_TOKEN`, and `REFRESH_TOKEN`. ImageKit credentials are needed only when using the seller product-upload endpoint.
2. Start the API from `server` with `npm run dev`.
3. In a second terminal, start the storefront from `client` with `npm run dev`.

The Vite development server proxies `/api` requests to `http://localhost:3000`. For a separately hosted API, set `VITE_API_URL` to its base URL before building the client. The API server must allow the storefront's exact origin in its comma-separated `CLIENT_ORIGINS` setting (for example, `http://localhost:5173` during local development). In production, refresh-token cookies require HTTPS and are configured for cross-site requests. Set `VITE_CONTACT_EMAIL` to show a working email link on the support page.

## Store features

- Signed-in product browsing, product details, search, size filtering, and sorting use authenticated `GET /api/products` requests.
- Sign-in and registration use the auth API; the refresh token is kept in an HTTP-only cookie.
- Guest bags are stored in the browser and merged into the authenticated cart on sign-in.
- Checkout is cash on delivery. Orders are stored per user, and available stock is checked and decremented by the API.

Only products with `published: true` are shown in the collection. The store requires a MongoDB connection and at least one published product to display catalog items.

Visitors must sign in or create an account before they can access storefront pages. The login/registration page remains available while signed out. Product list and detail API endpoints also require a valid access token.

The product seed script uses demo inventory: sizes S, M, L, and XL with 50 units each.
