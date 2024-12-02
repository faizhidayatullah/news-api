FROM node:14.21.2-alpine
WORKDIR /app
ENV PORT 8000
COPY . .
RUN npm install
EXPOSE 8000
CMD [ "npm", "run", "start"]