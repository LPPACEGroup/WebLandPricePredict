FROM node:18.17.1-alpine AS build
WORKDIR /app
COPY package*.json ./

COPY . .
RUN npm install
RUN npm run build -- --configuration production

FROM nginx:latest AS ngi
COPY --from=build /app/dist/web-land-price-predict /usr/share/nginx/html
COPY /nginx.conf  /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# docker build -t neerachal/deploy_febe_lppm:v0.2.3 .
# docker push neerachal/deploy_febe_lppm:v0.2.3