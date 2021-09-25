docker-compose --env-file .env.production -f docker-production.yml stop
docker-compose --env-file .env.production -f docker-production.yml rm --force
docker volume prune --force