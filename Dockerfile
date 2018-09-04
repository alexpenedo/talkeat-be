FROM node:10 as dist
WORKDIR /tmp/
COPY package.json package-lock.json tsconfig.json ./
COPY src/ src/
COPY env/ env/
COPY credentials/ credentials/
RUN npm install
RUN npm run build

FROM node:10 as node_modules
WORKDIR /tmp/
COPY package.json package-lock.json ./
RUN npm install --production

FROM node:10
WORKDIR /usr/local/talkeat
COPY --from=node_modules /tmp/node_modules ./node_modules
COPY --from=dist /tmp/dist ./dist
COPY --from=dist /tmp/env ./env
COPY --from=dist /tmp/credentials ./credentials

HEALTHCHECK --interval=30s --timeout=20s --start-period=1m  \
      CMD curl -f http://localhost/api/status || exit 1

CMD ["node", "dist/main.js"]