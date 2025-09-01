# Spotify Microservices Application : Spring Boot

## Project Setup:

1. Clone repository & Open root folder in intellij.
2. .env file setup: replace with your values
```dotenv
SPOTIFY_CLIENT_ID=<client_id>
SPOTIFY_CLIENT_SECRET=<client_secret>

GEMINI_API_KEY=<key>

KAFKA_SERVER_URL=http://172.21.55.181:9092

OLLAMA_BASE_URL=http://localhost:11434

EUREKA_SERVICE_HOSTNAME=localhost
EUREKA_DEFAULT_ZONE_URL="http://${EUREKA_SERVICE_HOSTNAME}:8761/eureka/"

REDIS_HOST=localhost
REDIS_PORT=6379

USER_SERVICE_HOST=http://localhost:8001
AUTH_SERVICE_HOST=http://localhost:8002
MUSIC_SERVICE_HOST=http://localhost:8003
WISHLIST_SERVICE_HOST=http://localhost:8004
AI_LLM_CHAT_SERVICE_HOST=http://localhost:8005

FRONTEND_URL=http://localhost:4200
```
3. Create .env file with above values and set it in run configuration of config server service

