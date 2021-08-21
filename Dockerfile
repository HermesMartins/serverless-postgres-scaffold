FROM mhart/alpine-node:12.22

WORKDIR /src/

COPY package.json package-lock.json /src/

RUN npm ci --silente

COPY . .

CMD npm run start