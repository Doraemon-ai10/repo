# RBLX Server Finder V4

Roblox server finder for public game data. Username lookup is public-data confirmation only; no Roblox password, cookie, or token is collected.

## Features
- Username lookup + second confirmation step.
- Roblox game search.
- Detailed game panel: current players, visits, favorites, max players, creator, genre, created/updated dates, description.
- Private Server enabled check using Roblox's public endpoint.
- Clear guide: if the user needs to create a private server and Roblox/network blocks access, open the official Roblox game page (VPN may be needed depending on network), create it there, return and refresh.
- Public server list with fewest players / most free slots sorting.
- Mobile launch flow with Roblox VN / Roblox Global app choice.
- Attempts `gameInstanceId` deep link so the selected public server can be opened directly.
- Static export for GitHub Pages and Vercel.

## Important limitation
Roblox's official API exposes whether Private Servers are enabled without authentication, but the user's private-server list/ownership endpoints require authentication. Therefore the website must not claim that a username owns a private server based on username alone.

## Run
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

The project is configured for static export. See `.github/workflows/deploy-pages.yml` for GitHub Pages deployment.
