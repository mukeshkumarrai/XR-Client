FROM node:14.17.3-alpine
WORKDIR /app
COPY package.json .
RUN npm install -g npm@8.19.4
RUN npm i @angular/cli --force
COPY . .
EXPOSE 4200 49153
CMD npm run start
