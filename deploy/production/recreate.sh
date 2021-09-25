deploy/production/remove.sh
docker-compose --env-file .env.production -f docker-production.yml up --build -d --force-recreate -V
deploy/production/log.sh
