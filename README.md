# track.it

Personal job hunt tracker: a React (Vite) frontend and Express API with Turso (SQLite). See `docs/` for product and architecture details.

## Prerequisites

- **Node.js** 18+
- **npm** 9+

## Install dependencies

From the repository root (npm workspaces will install `client` and `server`):

```bash
npm install
```

Or install each package on its own:

```bash
cd server && npm install
cd ../client && npm install
```

## Environment variables (`.env.example`)

Copy the example file and fill in values. **Do not commit real secrets** (`.env` is gitignored).

```bash
cp .env.example server/.env
cp .env.example client/.env
```

On Windows (PowerShell), from the repo root:

```powershell
Copy-Item .env.example server\.env
Copy-Item .env.example client\.env
```

**Tip:** In `client/.env` you only need `VITE_API_URL` for the UI; you can delete the server-only lines after copying, or leave them (Vite ignores variables that are not prefixed with `VITE_`).

Then set each variable as below. The same names appear in [`.env.example`](.env.example) lines 1–9.

| Variable | Used by | Description |
|----------|---------|-------------|
| `TURSO_DATABASE_URL` | **Server** | Turso database HTTP URL, e.g. `libsql://your-db-xxx.turso.io` |
| `TURSO_AUTH_TOKEN` | **Server** | Turso auth token for that database |
| `PORT` | **Server** | API port (default **3001**) |
| `VITE_API_URL` | **Client** | **Public** base URL of the API **without a trailing slash** (see below) |

### How to get Turso values

1. Sign up at [Turso](https://turso.tech) and install the [Turso CLI](https://docs.turso.tech/cli/overview) if you use it.
2. Create a database (example name: `trackit`):

   ```bash
   turso db create trackit
   ```

3. Get the URL:

   ```bash
   turso db show trackit --url
   ```

4. Create an auth token and copy it:

   ```bash
   turso db tokens create trackit
   ```

5. Put `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in **`server/.env`**.

The server runs `CREATE TABLE IF NOT EXISTS` on startup, so you do not need a separate migration step for a fresh database.

### `VITE_API_URL` (client)

- **Local development:** set in **`client/.env`** to your API origin, e.g. `http://localhost:3001`.
- **Optional (same-origin dev):** [`client/vite.config.js`](client/vite.config.js) proxies `/api` to `http://localhost:3001`. If you **clear** `VITE_API_URL` in **`client/.env`** (or leave it empty) while `npm run dev` is running, the app calls `/api/...` on the Vite dev server (port 5173), which forwards to the API. That matches the production pattern of one origin for the page and API.
- **Production:** set to your deployed API base URL, e.g. `https://your-app.vercel.app` (no trailing slash). This value is baked in at **build** time, so change it and rebuild the client when the API URL changes.

The server reads only **`server/.env`**. The Vite app reads only **`client/.env`** (variables must be prefixed with `VITE_`).

## Run the project (local)

Use **two terminals**.

**Terminal 1 — API**

```bash
cd server
npm run dev
```

- Default: `http://localhost:3001`
- Health check: [http://localhost:3001/health](http://localhost:3001/health) should return `{"ok":true}`

**Terminal 2 — Web app**

```bash
cd client
npm run dev
```

- Open the URL Vite prints (usually [http://localhost:5173](http://localhost:5173)).
- **Public app:** `/`
- **Admin:** `/admin` (no login; keep the URL private)

The Vite dev server **proxies** requests from `/api/*` to the backend on port 3001 (see `client/vite.config.js`). You can rely on `http://localhost:3001` via `VITE_API_URL` or use an empty `VITE_API_URL` with the proxy as described above.

## Build (client)

```bash
cd client
npm run build
```

Output is in `client/dist/`. For deployment, configure your host so `/api/*` is handled by the Node server and static assets are served from `client/dist` (see `vercel.json` if you use Vercel).

## Docker deployment (Render)

This repo includes Dockerfiles for both services (`client/Dockerfile` and `server/Dockerfile`) plus a `render.yaml` blueprint.

1. In Render, create a **Blueprint** from this repo (it will create **trackit-api** and **trackit-web**).
2. Set the environment variables shown below in Render.
3. Trigger a redeploy of **trackit-web** after `VITE_API_URL` is set (it is baked at build time).

| Service | Variables |
|---------|-----------|
| **trackit-api** | `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` |
| **trackit-web** | `VITE_API_URL=https://<your-api-service>.onrender.com` (no trailing slash) |

## Project layout

| Path | Role |
|------|------|
| `client/` | React + Vite UI |
| `server/` | Express API + Turso |
| `docs/` | PRD, flows, design system, architecture |
