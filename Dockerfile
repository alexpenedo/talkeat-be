FROM node:10 as dist
WORKDIR /tmp/
COPY package.json package-lock.json tsconfig.json ./
COPY src/ src/
RUN npm install
RUN npm run build

FROM node:10 as node_modules
WORKDIR /tmp/
COPY package.json package-lock.json ./
RUN npm install --production

FROM node:10
WORKDIR /usr/local/nub-api
COPY --from=node_modules /tmp/node_modules ./node_modules
COPY --from=dist /tmp/dist ./dist
CMD ["node", "dist/main.js"]