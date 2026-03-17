# -------- Build stage --------
FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy only necessary files first (better caching)
COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src

RUN mvn clean package -DskipTests

# -------- Run stage --------
FROM eclipse-temurin:17-jre

WORKDIR /app

# Create non-root user
RUN addgroup --system appgroup && adduser --system appuser --ingroup appgroup

# Copy jar
COPY --from=build /app/target/*.jar app.jar

# Change ownership
RUN chown appuser:appgroup app.jar

# Switch to non-root user
USER appuser

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]
