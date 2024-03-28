# dev

1. Clone file env.template to .env
2. Config environment variables

```
PORT=3000

MAILER_SERVICE=
MAILER_EMAIL=
MAILER_SECRET_KEY=

PROD=false

MONGO_URL=mongodb://jadero:123456@localhost:27017/
MONGO_DB_NAME=NOC
MONGO_USER=jadero
MONGO_PASS=123456
```

3 Install dependencies

```
  npm i
```

4 Raise BD with

```
  docker compose up -d
```

5 Generate prisma

```
  npx prisma migrate dev
```

6 Run in development mode

```
  npm run dev
```
