# DOCKERFILE FOR ARACHNE NODE UI
# NODE 16+ VERSIONS NOT SUPPORTED
FROM node:14.21-buster AS BUILDER

# INSTALL DEPS
WORKDIR /arachne
COPY package.json ./
RUN npm install

# BUILD
COPY ./ /arachne
RUN npm run build-node


FROM nginx:1.25-alpine

# COPY CONFIG AND BUILD OUTPUT
RUN rm -rf /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=BUILDER /arachne/public /usr/share/nginx/html

# ENABLE USE OF RUNTIME ENVIRONMENT VARIABLES
WORKDIR /usr/share/nginx/html
COPY ./env.sh .
COPY .env .
RUN apk add --no-cache bash
RUN chmod +x env.sh

EXPOSE 8010

CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]
