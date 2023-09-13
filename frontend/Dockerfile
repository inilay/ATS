FROM node:18.16.1 AS prod

WORKDIR /frontend

COPY package.json package-lock.json ./

RUN npm ci

COPY ./ ./

RUN npm run build


FROM nginx:1.23

COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY --from=prod /frontend/build /usr/share/nginx/html

# CMD ["nginx", "-g", "daemon off;"]

# COPY --from=BUILD /app/dist/index.html /nginx/static/index.html
# COPY --from=BUILD /app/dist/static/css /nginx/static/
# COPY --from=BUILD /app/dist/static/js /nginx/static/

