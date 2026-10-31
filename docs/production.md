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

## Periodic Matching

The matching job runs in a separate Python container on this instance.
A systemd timer runs it every five minutes and catches up once after downtime. It connects
to the existing production database over the private Compose network.

Build and transfer the matching image and timer files from your local machine

```sh
docker build -t tamufindr-matching:prod matching-job
docker save tamufindr-matching:prod | gzip > tamufindr-matching-prod.tar.gz

scp -i ~/.ssh/LightsailDefaultKey-us-east-2.pem \
  tamufindr-matching-prod.tar.gz scripts/tamufindr-matching.service \
  scripts/tamufindr-matching.timer \
  ubuntu@77.113.130.242:~/tamufindr/
```

On the server, load the image and install the units:

```sh
cd ~/tamufindr
sudo docker load -i tamufindr-matching-prod.tar.gz
sudo cp tamufindr-matching.service tamufindr-matching.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl start tamufindr-matching.service
sudo journalctl -u tamufindr-matching.service -n 30 --no-pager
```

Enable the schedule:

```sh
sudo systemctl enable --now tamufindr-matching.timer
sudo systemctl list-timers tamufindr-matching.timer
```

The service assumes the deployment directory is `/home/ubuntu/tamufindr`; edit its
`WorkingDirectory` if needed.

Before replacing the matching image, stop the timer and wait for any active batch
to finish. After loading the replacement image, start the timer again:

```sh
sudo systemctl stop tamufindr-matching.timer
sudo systemctl status tamufindr-matching.service
# Once the service is inactive, load the replacement image as above.
sudo systemctl start tamufindr-matching.timer
```

## Stopping Production

Stop the matching timer before stopping the containers. `down` preserves the
production database; adding `-v` would delete its volume.

```sh
sudo systemctl stop tamufindr-matching.timer
sudo docker compose --env-file .env.production down
```
