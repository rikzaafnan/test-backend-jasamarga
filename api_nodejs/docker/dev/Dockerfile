#################################
# STEP 1 build executable binary
#################################
FROM node:16-alpine AS builder
RUN apk update && apk add --no-cache git


# grab deps and build
WORKDIR /app
COPY package*.json .
COPY .env .
COPY dev.config.cjs .
COPY README.md .
COPY src ./src
RUN npm install

#################################
# STEP 2 build executable binary
#################################
FROM node:16-alpine

WORKDIR /app

COPY --from=builder /app /app

RUN npm i pm2 -g

## Use an unprivileged user.
#USER appuser:appuser

ENTRYPOINT ["pm2-runtime","start", "dev.config.cjs"]

