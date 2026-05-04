# Deployment Guide

Pokemon Explorer is a Vite React static frontend. Production deployment serves
the built `dist/` directory through a static web server such as Nginx.

## Requirements

- Ubuntu or CentOS server
- Nginx
- Node.js LTS, such as Node 22 used by the sample workflow
- npm
- Git
- Domain or subdomain
- SSL certificate

## Local Build

Run the same quality gates locally before deploying:

```bash
npm install
npm run lint
npm run build
npm run test:e2e
```

The production build output is:

```txt
dist/
```

## Environment Configuration

Copy the env template before building:

```bash
cp .env.example .env
```

Important variables:

```env
VITE_POKE_API_BASE_URL=https://pokeapi.co/api/v2
VITE_QUERY_RETRY=2
VITE_QUERY_STALE_TIME_MS=300000
VITE_QUERY_GC_TIME_MS=1800000
VITE_POKEMON_LIST_PAGE_SIZE=20
```

Vite embeds `VITE_` variables at build time. Rebuild the app after changing
production env values.

## Nginx Deployment Path

Recommended static deployment path:

```txt
/var/www/pokemon-explorer
```

## Manual Deployment Steps

1. SSH into the server.
2. Install Node.js.
3. Install Nginx.
4. Clone the repository.
5. Install dependencies with `npm install` or `npm ci`.
6. Copy `.env.example` to `.env` and update values if needed.
7. Build the app with `npm run build`.
8. Copy the contents of `dist/` to `/var/www/pokemon-explorer`.
9. Configure Nginx.
10. Test and restart or reload Nginx.
11. Enable SSL.

Example copy command:

```bash
sudo mkdir -p /var/www/pokemon-explorer
sudo rsync -av --delete dist/ /var/www/pokemon-explorer/
```

## Nginx Config

Example server block:

```nginx
server {
    listen 80;
    server_name example.com;

    root /var/www/pokemon-explorer;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }
}
```

The `try_files` fallback is required for React Router. Without it, direct route
refreshes such as `/pokemon/venusaur` or `/team-lab` can return a server 404.

After editing the config:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Ubuntu Notes

Install base packages:

```bash
sudo apt update
sudo apt install nginx git -y
```

Enable and start Nginx if needed:

```bash
sudo systemctl enable nginx
sudo systemctl start nginx
```

## CentOS Notes

Install base packages:

```bash
sudo dnf install nginx git -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

Open firewall services if needed:

```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## SSL

Use Certbot or your hosting provider's certificate tooling. For a public Nginx
server with Certbot, the flow usually looks like:

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d example.com
```

Use the equivalent package manager commands for CentOS if Certbot is installed
from EPEL or Snap.

## GitHub Actions Deployment

Recommended CI/CD flow:

- Checkout code.
- Setup Node.
- Install dependencies.
- Run lint.
- Run build.
- Optionally run Playwright tests.
- Archive or copy `dist/`.
- Deploy to the server through rsync or scp.
- Reload Nginx.

QEMU is usually not necessary for a Vite static frontend. A normal
GitHub-hosted Ubuntu runner is enough. If the project later moves to Docker
multi-architecture images, QEMU can be added at that point.

Sample workflow using SSH deployment:

```yaml
name: Deploy Frontend

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Build
        run: npm run build

      - name: Deploy dist to server
        uses: easingthemes/ssh-deploy@v5.1.0
        with:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          REMOTE_USER: ${{ secrets.REMOTE_USER }}
          SOURCE: "dist/"
          TARGET: "/var/www/pokemon-explorer"

      - name: Reload Nginx
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.REMOTE_HOST }}
          username: ${{ secrets.REMOTE_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            sudo nginx -t
            sudo systemctl reload nginx
```

## Deployment Checklist

- `npm run lint` passes.
- `npm run build` passes.
- `npm run test:e2e` passes where practical.
- `.env` values are correct before building.
- `dist/` is copied to the Nginx deployment path.
- Nginx config has SPA fallback.
- SSL is installed.
- Direct route refresh works for `/`, `/pokemon/venusaur`, and `/team-lab`.
- PokeAPI is reachable from the browser.
- Light, dark, and system theme modes work.
- Mobile responsiveness is checked.
