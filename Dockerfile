FROM node:20-alpine

WORKDIR /app

ARG NEXT_PUBLIC_API_URL=http://187.127.158.24:5001/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]
