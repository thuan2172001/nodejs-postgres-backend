docker-compose --env-file .env -f docker-dev.yml up -d --build --force-recreate
docker logs dev_server_1 -f