FROM node:20.17.0

WORKDIR /usr/app

COPY package*.json ./

COPY *.lock ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]