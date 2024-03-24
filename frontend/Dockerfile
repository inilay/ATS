FROM node:18.16.1 AS build

WORKDIR /frontend

COPY package.json package-lock.json ./

RUN npm ci

COPY ./ ./

RUN npm run build


FROM nginx:1.23

COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /frontend/build /usr/share/nginx/html



# COPY --from=build /app/dist/index.html /nginx/static/index.html
# COPY --from=build /app/dist/static/css /nginx/static/
# COPY --from=build /app/dist/static/js /nginx/static/


CMD ["nginx", "-g", "daemon off;"]
