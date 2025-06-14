FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev


COPY . .

EXPOSE 3001
EXPOSE 5502

CMD ["sh", "-c", "node server.js & node app.js"]