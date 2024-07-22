from maven:3.8.3-openjdk-17 as builder
workdir /app
copy pom.xml .
copy src ./src
run mvn -B dependency:go-offline dependency:resolve-plugins clean package -DskipTests
run mvn -o -B package -DskipTests
from openjdk:17
workdir /app
copy --from=builder /app/target/BackEndSample-0.0.1-SNAPSHOT.jar ./app.jar
expose 8000
cmd ["java","-jar","app.jar"]