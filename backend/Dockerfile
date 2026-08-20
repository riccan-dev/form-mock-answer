# ビルド段階
FROM eclipse-temurin:25-jdk AS build
WORKDIR /app

COPY gradlew gradlew.bat settings.gradle build.gradle ./
COPY gradle gradle
RUN chmod +x gradlew && ./gradlew --version

COPY src src
RUN ./gradlew bootJar --no-daemon

# 実行段階
FROM eclipse-temurin:25-jre
WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
