FROM bitnami/node:18

WORKDIR /app

COPY . .

RUN yarn && yarn build

EXPOSE 3000

CMD [ "node", "build/index.js" ]