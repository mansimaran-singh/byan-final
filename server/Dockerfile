FROM node:18-alpine
WORKDIR /srv
COPY package*.json ./
RUN npm ci || npm install
COPY . .
ENV PORT=5000
EXPOSE 5000
CMD ["npm","run","start"]
