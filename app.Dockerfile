FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev


COPY . .

EXPOSE 5502

CMD ["node app.js"]