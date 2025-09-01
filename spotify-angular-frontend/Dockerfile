# Stage 1: Build
FROM node:22

WORKDIR /app

# Copy package.json & install deps
COPY package*.json ./
RUN npm install --silent

# Copy source
COPY . .

EXPOSE 4300

CMD ["npm", "run", "start"]