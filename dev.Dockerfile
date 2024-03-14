FROM node:16 as builder
WORKDIR /usr/app
COPY package.json .
COPY . .
RUN npm install
CMD ["npm", "start"]
