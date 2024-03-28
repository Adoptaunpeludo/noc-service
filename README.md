# dev

1. Clone file env.template to .env
2. Config environment variables

```
PORT=3000

MAILER_SERVICE=
MAILER_EMAIL=
MAILER_SECRET_KEY=

PROD=false

MONGO_URL=
MONGO_DB_NAME=NOC
MONGO_USER=
MONGO_PASS=

RABBITMQ_USER=
RABBITMQ_PASS=
RABBITMQ_URL=
```

3 Install dependencies

```
  npm i
```

4 Raise BD if local with 

```
  docker compose up -d
```

5 Generate prisma if using prisma

```
  npx prisma migrate dev
```

6 Run in development mode

```
  npm run dev
```
