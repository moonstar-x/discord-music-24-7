FROM node:12.20.0-alpine3.12

ARG DATE_CREATED
ARG VERSION

LABEL org.opencontainers.image.created=$DATE_CREATED
LABEL org.opencontainers.image.version=$VERSION
LABEL org.opencontainers.image.authors="moonstar-x"
LABEL org.opencontainers.image.vendor="moonstar-x"
LABEL org.opencontainers.image.title="Discord Music 24/7"
LABEL org.opencontainers.image.description="A 24/7 music bot for Discord that pauses when nobody is listening."
LABEL org.opencontainers.image.source="https://github.com/moonstar-x/discord-music-24-7"

RUN apk add --no-cache ffmpeg

WORKDIR /opt/app

COPY package*.json ./

RUN npm ci --only=prod

COPY . .

CMD ["npm", "start"]
