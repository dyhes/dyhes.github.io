---
title: 【Docker】Introduction
date: 2023-03-21 00:00:00+0000
categories: 
- nutrition
tags:
- Docker
---

## What is Docker

Docker is an open source platform for building, deploying, and managing containerized applications. 

It enables developers to package applications into containers—standardized **executable components** combining **application source code** with the o**perating system (OS) libraries and dependencies** required to run that code in any environment.

Developers can create containers **without** Docker, but the platform makes it **easier, simpler, and safer** to build, deploy and manage containers. 

Docker is essentially a **toolkit** that enables developers to build, deploy, run, update, and stop containers using simple commands and work-saving automation through a single API.

Containers are made possible by **process isolation** and **virtualization capabilities** built into the **Linux kernel**.

## Docker tools

### DockerFile

Every Docker container ***starts with*** **a simple text file** containing **instructions** for how to build the Docker container image. *DockerFile* **automates** the process of Docker image creation. It’s essentially a list of command-line interface (CLI) instructions that Docker Engine will run in order to assemble the image.

### Docker images

*Docker images* contain **executable application source code** as well as all the **tools, libraries, and dependencies** that the application code needs to run as a container. 

When you run the Docker image, it **becomes one instance** (or multiple instances) of the container.

Multiple Docker images can be created from a single base image, and they’ll share the commonalities of their stack.

Docker images are made up of ***layers***, and each layer corresponds to **a version** of the image. Whenever a developer makes changes to the image, a new top layer is created, and this top layer replaces the previous **top layer** as the **current version** of the image. Previous layers are saved for **rollbacks** or to be **re-used** in other projects.

Each time a container is created from a Docker image, yet another new layer called the **container layer** is created. Changes made to the container—such as the addition or deletion of files—are saved to the container layer only and exist only while the container is running. 

This iterative image-creation process enables increased **overall efficiency** since multiple live container instances can run from just a single base image, and when they do so, they leverage a common stack.

### **Docker containers**

Docker containers are the **live, running instances** of Docker images. While Docker images are **read-only** files, containers are live, ephemeral, executable content. Users can interact with them, and administrators can adjust their settings and conditions using docker commands.

### **Docker Hub**

Docker Hub is the **public repository of Docker images** It includes images that have been produced by Docker, Inc., certified images belonging to the Docker Trusted Registry, and many thousands of other images.

All Docker Hub users can share their images at will. They can also download predefined base images from the Docker filesystem to use as a starting point for any containerization project.

### **Docker daemon**

Docker daemon is a **service** running on your operating system This service creates and manages your Docker images for you using the commands from the client, acting as the **control center** of your Docker implementation.

### **Docker registry**

A Docker registry is a scalable open-source **storage and distribution system** for docker images. The registry enables you to track image versions in repositories, using tagging for identification. This is accomplished using git, a version control tool.

### **Docker Compose**

If you’re **building an application out of processes in multiple containers** that all reside on the same host, you can use *Docker Compose* to manage the application’s architecture. Docker Compose creates a YAML file that specifies which services are included in the application and can deploy and run containers with a single command. Using Docker Compose, you can also define persistent volumes for storage, specify base nodes, and document and configure service dependencies.

### **Kubernetes**

To monitor and manage container lifecycles in more complex environments, you’ll need to turn to a **container orchestration tool.** While Docker includes its own orchestration tool (called Docker Swarm), most developers choose Kubernetes instead.

Kubernetes is an open-source container orchestration platform descended from a project developed for internal use at Google. Kubernetes schedules and automates tasks integral to the management of container-based architectures, including container deployment, updates, service discovery, storage provisioning, load balancing, health monitoring, and more. In addition, the open source ecosystem of tools for Kubernetes—including Istio and Knative—enables organizations to deploy a high-productivity Platform-as-a-Service (PaaS) for containerized applications and a faster on-ramp to serverless computing.
