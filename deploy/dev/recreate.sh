./remove.sh
docker-compose --env-file .env -f docker-dev.yml up --build -d --force-recreate -V
docker logs dev_server_1 -f