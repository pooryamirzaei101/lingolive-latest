FROM node:22-bookworm-slim AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-bookworm-slim AS runtime

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000 \
    MEDIA_ROOT=/var/lib/lingolive/media

WORKDIR /app
RUN groupadd --system --gid 10001 lingolive \
    && useradd --system --uid 10001 --gid lingolive --home-dir /app lingolive \
    && mkdir -p /var/lib/lingolive/media \
    && chown -R lingolive:lingolive /var/lib/lingolive /app
COPY --from=build --chown=lingolive:lingolive /app /app

USER lingolive
VOLUME ["/var/lib/lingolive/media"]
EXPOSE 3000
CMD ["npm", "run", "start"]
