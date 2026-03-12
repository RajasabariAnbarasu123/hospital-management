# # Build stage
# FROM maven:3.9.12-eclipse-temurin-17 as builder
# WORKDIR /app
# COPY . .
# RUN mvn clean package -DskipTests

# # Runtime stage
# FROM eclipse-temurin:17-jre-alpine
# WORKDIR /app
# COPY --from=builder /app/target/appointment-system-1.0.0.jar app.jar

# EXPOSE 8080

# ENV JAVA_OPTS="-Xmx512m -Xms256m"

# ENTRYPOINT exec java $JAVA_OPTS -jar app.jar





FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]