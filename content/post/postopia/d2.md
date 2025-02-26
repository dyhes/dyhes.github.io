---
title: 【Postopia Dev Log】Day 2
date: 2024-07-07 00:00:00+0000
image: /covers/cover11.png
categories: 
    - moon
    - snow
tags:
    - Postopia
math: true
---
考虑到不确定能把系统做到什么程度，暂时不考虑分布式相关事宜

运行./gradlew bootRun 热加载不知道为什么没有生效，找来找去没找到原因

想直接用dokcer实现，不熟悉docker和docker compose困难重重

根据 [SpringBoot DevTools Auto Restart and Live Reload](https://digitalsanctuary.com/java/springboot-devtools-auto-restart-and-live-reload.html) 一顿操作之后控制台有反应了，但是没有效果

根据 [LiveReload does not detect changes](https://github.com/spring-projects/spring-boot/issues/38538) 

”For a change to be noticeable **it has to be compiled**. You can learn more about this [in the reference documentation](https://docs.spring.io/spring-boot/docs/3.2.x/reference/html/using.html#using.devtools.restart). We generally recommend using an IDE to both to run the application and to make changes. It will then compile the changes so that they can be noticed by DevTools.“

成功解决问题

进度：
完成注册，热加载
## knowledge

### UUID, Long ID comparison

UUID:
* Globally unique
* 128-bit value
* String representation
* No sequential ordering
* Suitable for distributed systems
* Can be generated without DB interaction
* Larger storage size (typically 36 characters)
⠀Long ID:
* Locally unique (per table)
* 64-bit integer
* Numeric representation
* Sequential (if auto-incremented)
* Simpler and more human-readable
* Smaller storage size (8 bytes)
* Typically faster for indexing and joining
### @GeneratedValue

The @GeneratedValue annotation in Spring Boot is used to specify **how the primary key should be generated for an entity**. Here's a breakdown of its key aspects:
Common strategies:
* GenerationType.AUTO (default)
* GenerationType.IDENTITY
  * Pros: Simple, efficient for single-node systems
  * Cons: Can cause issues in distributed systems or data migrations
* GenerationType.SEQUENCE
  * Pros: Efficient, works well in high-concurrency environments
  * Cons: Not supported by all databases (e.g., MySQL before 8.0)
* GenerationType.TABLE
  * Pros: Database-independent, works everywhere
  * Cons: Potentially slower, requires extra table management
### Lombok Constructor related annotation

* @NoArgsConstructor
* @AllArgsConstructor
* @RequiredArgsConstructor
  all final and @NonNull fields 
* @Builder
  used to generate a builder pattern for your class
```java
MyClass myClass = MyClass.builder()
                         .name("John Doe")
                         .age(30)
                         .address("123 Main St")
                         .build();

```
### ./gradlew 

This part of the command is invoking the **Gradle Wrapper** (gradlew or gradlew.bat), which is a script that comes bundled with the Gradle build tool. The Gradle Wrapper ensures that the correct version of Gradle is used for the project, regardless of whether or not the user has Gradle installed on their system.
### Dockerfile

A Dockerfile is a script that contains a series of instructions on how to build a Docker image. Each **instruction** in a Dockerfile creates a **layer** in the image, and when you build the image, Docker executes these instructions step by step to produce the final image.
**FROM**
Specifies the **base image** to use for the Docker image you’re building. Every Dockerfile **must start with** a FROM instruction.
**FROM** ubuntu:20.04

**LABEL**
Adds **metadata** to the image, such as a maintainer name or a version.
**LABEL** maintainer="example@example.com"

**RUN**
**Executes a command** in the shell. It’s often used for installing software packages.
**RUN** apt-get update && apt-get install -y nginx

**COPY**
Copies files or directories from your local filesystem into the Docker image.
**COPY** ./localfile /containerfile

**ADD**
Similar to COPY, but also **supports URL sources and automatic unpacking** of compressed files.
**ADD** https://example.com/file.tar.gz /tmp/

**WORKDIR**
Sets the **working directory** for any subsequent RUN, CMD, ENTRYPOINT, COPY, and ADD instructions.
**WORKDIR** /app

**CMD**
Provides a command that will be executed **when a container is started from the image**. Only one CMD instruction is allowed per Dockerfile; if multiple CMD instructions are specified, **only the last one takes effect**.
**CMD** ["nginx", "-g", "daemon off;"]

**ENTRYPOINT**
Sets the default application to be used every time a container is created from the image. Unlike CMD, ENTRYPOINT **won’t be overridden by command-line arguments**.
**ENTRYPOINT** ["nginx", "-g", "daemon off;"]

**ENV**
Sets environment variables.
**ENV** MY_ENV_VAR=my_value

**EXPOSE**
Informs Docker that the container listens on the specified network ports at runtime. This doesn’t actually publish the port; it’s a form of **documentation**.
**EXPOSE** 80

**VOLUME**
Creates a mount point with the specified path and marks it as holding externally mounted volumes from the native host or other containers.
**VOLUME** ["/data"]

**USER**
Sets the user name or UID to use when running the image and for any RUN, CMD, and ENTRYPOINT instructions that follow it.
**USER** nginx



a project can have multiple Dockerfiles.
e.g.
├── Dockerfile         ## Default Dockerfile for production
├── Dockerfile.dev     ## Dockerfile for development
├── Dockerfile.test    ## Dockerfile for testing
## Articles
[Using Docker Compose with Spring Boot and PostgreSQL](https://medium.com/@saygiligozde/using-docker-compose-with-spring-boot-and-postgresql-235031106f9f)

[SpringBoot DevTools Auto Restart and Live Reload](https://digitalsanctuary.com/java/springboot-devtools-auto-restart-and-live-reload.html)

