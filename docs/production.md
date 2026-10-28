# Production Deployment Steps

Current production deployment is manual.

Build, download, and transfer the docker image to the server.

```sh
docker build -t tamufindr:prod .
docker save tamufindr:prod | gzip > tamufindr-prod.tar.gz

scp -i ~/.ssh/LightsailDefaultKey-us-east-2.pem \
  tamufindr-prod.tar.gz Caddyfile .env.production \
  ubuntu@77.113.130.242:~/tamufindr/

scp -i ~/.ssh/LightsailDefaultKey-us-east-2.pem \
  compose.prod.yaml \
  ubuntu@77.113.130.242:~/tamufindr/compose.yaml
```

On the server, load the image.

```sh
cd ~/tamufindr
sudo docker load -i tamufindr-prod.tar.gz
```

Start the db, apply the migrations, and start the application

```sh
sudo docker compose --env-file .env.production up -d db
sudo docker compose --env-file .env.production run --rm app ./node_modules/.bin/prisma migrate deploy
sudo docker compose --env-file .env.production run --rm app ./node_modules/.bin/prisma db seed
sudo docker compose --env-file .env.production up -d
```

Set user as Admin.

```sh
sudo docker compose --env-file .env.production exec db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
```

```sql
UPDATE "user"
SET role = 'ADMIN'
WHERE email = 'your-netid@tamu.edu'
RETURNING id, email, role;
\q
```

**Useful**: stop everything

```sh
sudo docker compose --env-file .env.production down -v
```
