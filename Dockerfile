#first step
FROM node:16 as builder
WORKDIR /usr/app
COPY package.json .
COPY . .
RUN npm install

#final step
# FROM keymetrics/pm2:15-alpine
# COPY --from=builder /usr/app .
CMD ["npm", "start"]
