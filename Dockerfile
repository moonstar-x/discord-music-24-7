# Build Stage
FROM node:12.20.0-alpine3.12 AS build

RUN apk add --no-cache git
RUN git config --global url."https://github.com/".insteadOf ssh://git@github.com/

WORKDIR /opt/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Bot Image
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

RUN apk add --no-cache ffmpeg git
RUN git config --global url."https://github.com/".insteadOf ssh://git@github.com/

WORKDIR /opt/app

COPY package*.json ./LICENSE ./README.md ./

RUN npm ci --only=prod

COPY ./config ./config
COPY ./data ./data

# These are added here as a way to define which env variables will be used.
ENV DISCORD_TOKEN ""
ENV PREFIX ""
ENV OWNER_ID ""
ENV PRESENCE_TYPE ""
ENV CHANNEL_ID ""
ENV SOUNDCLOUD_CLIENT_ID ""
ENV YOUTUBE_COOKIE ""
ENV SHUFFLE ""
ENV PAUSE_ON_EMPTY ""
ENV CHANNEL_LEAVE_ON_EMPTY ""

COPY --from=build /opt/app/build ./build

VOLUME /opt/app/data /opt/app/config

CMD ["npm", "start"]