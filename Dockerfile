FROM alpine:latest

RUN apk add --update nodejs npm

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 4000

CMD ["npm","run","start"]
