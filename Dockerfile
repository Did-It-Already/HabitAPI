FROM node:18.17.1-alpine3.17

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3525

CMD ["node", "src/app.js"]

