# Use lightweight JDK image
FROM eclipse-temurin:17-jdk-alpine
LABEL authors="Shreyas Shevale"
# Set working directory
WORKDIR /app

# Copy the JAR (replace with your actual JAR name or use wildcard)
COPY target/*.jar app.jar

# Expose the app port
EXPOSE 8761

# Run the JAR
ENTRYPOINT ["java","-jar","app.jar"]
