plugins {
    java
    id("org.springframework.boot") version "3.4.4"
    id("io.spring.dependency-management") version "1.1.7"
    id("jacoco")
}

group = "skibidicoders"
version = "0.0.1-SNAPSHOT"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

jacoco {
    toolVersion = "0.8.10"
}

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

repositories {
    mavenCentral()
}

dependencies {
    // spring boot
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-web")

    // openapi docs
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.6")

    // lombok
    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")

    // h2
    runtimeOnly("com.h2database:h2")

    // test
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.withType<Test> {
    useJUnitPlatform()
}

tasks.test {
    useJUnitPlatform() // if you're using JUnit5 (which you are)
    finalizedBy(tasks.jacocoTestReport) // Generate report after tests
}

tasks.jacocoTestReport {
    dependsOn(tasks.test) // Tests must run before report

    reports {
        xml.required.set(true)  // for SonarQube or other tools
        html.required.set(true) // nice HTML report
    }
}
