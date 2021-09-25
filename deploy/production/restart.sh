docker-compose --env-file .env.production -f docker-production.yml up -d --build --force-recreate
./log.sh
