FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache python3 make g++
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

RUN apk add --no-cache --virtual .build-deps python3 make g++ \
    && apk add --no-cache libstdc++ \
    && npm install --omit=dev \
    && npm rebuild bcrypt --build-from-source \
    && apk del .build-deps

EXPOSE 3000

CMD ["npm", "start"]