# Production Deployment Steps

Current production deployment is manual.

Build, download, and transfer the docker image to the server. 

```bash
docker build -t tamufindr:prod .
docker save tamufindr:prod | gzip > tamufindr-prod.tar.gz
scp -i ~/.ssh/LightsailDefaultKey-us-east-2.pem tamufindr-prod.tar.gz compose.prod.yaml Caddyfile ubuntu@77.113.130.242:~/
```

On the server, load the image.

```bash
sudo docker load -i tamufindr-prod.tar.gz
```

Create `.env.production` and restrict its permissions

```bash
chmod 600 .env.production
```

Start the production db

```bash
sudo docker compose \
  --env-file .env.production \
  -f compose.prod.yaml \
  up -d db
```

Apply the migrations

```bash
sudo docker compose \
  --env-file .env.production \
  -f compose.prod.yaml \
  run --rm app ./node_modules/.bin/prisma migrate status
```

Start the application

```bash
sudo docker compose \
  --env-file .env.production \
  -f compose.prod.yaml \
  up -d
```

