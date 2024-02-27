FROM node:21-alpine
WORKDIR /app
COPY ./package.json .
RUN yarn install --production
COPY ./ .
RUN yarn add typescript tsc ts-node && yarn build
CMD ["yarn", "start"]
EXPOSE 3000