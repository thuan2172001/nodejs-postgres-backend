docker-compose --env-file .env -f docker-dev.yml stop
docker-compose --env-file .env -f docker-dev.yml rm --force
docker volume prune --force