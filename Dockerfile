# Use the Node alpine official image
FROM node:lts-alpine AS build

ENV NPM_CONFIG_UPDATE_NOTIFIER=false
ENV NPM_CONFIG_FUND=false

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci

# Copy the rest of the source and build
COPY . ./

# VITE_API_BASE_URL is baked into the JS bundle at build time, so it must be
# declared as a build ARG for Railway to inject the service variable here.
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

ARG VITE_MAIN_DOMAINS
ENV VITE_MAIN_DOMAINS=$VITE_MAIN_DOMAINS

RUN npm run build

# ── Serve stage ─────────────────────────────────────────────────────────────
FROM caddy

WORKDIR /app

COPY Caddyfile ./
RUN caddy fmt Caddyfile --overwrite

COPY --from=build /app/dist ./dist

CMD ["caddy", "run", "--config", "Caddyfile", "--adapter", "caddyfile"]
