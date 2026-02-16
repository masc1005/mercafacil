FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=development

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

RUN npm ci --omit=dev && npm cache clean --force

RUN chown -R node:node /app

USER node

EXPOSE 3000

CMD ["npm", "start"]