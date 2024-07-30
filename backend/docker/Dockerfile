# Stage 1: Build
FROM gradle:8.9-jdk17 as build

WORKDIR /openvidu-recording-java
COPY ./build.gradle build.gradle
COPY ./settings.gradle settings.gradle
COPY ./src/main src/main

RUN gradle clean build

# Stage 2: Package
FROM alpine:3.15

# Install OpenJDK 17
RUN apk update && \
    apk add openjdk17 && \
    rm -rf /var/cache/apk/*

# Install basic-webinar
RUN mkdir -p /opt/openvidu-recording-java
COPY --from=build /openvidu-recording-java/build/libs/*.jar /opt/openvidu-recording-java/openvidu-recording-java.jar

# Entrypoint
COPY ./docker/entrypoint.sh /usr/local/bin
RUN chmod +x /usr/local/bin/entrypoint.sh

CMD ["/usr/local/bin/entrypoint.sh"]
