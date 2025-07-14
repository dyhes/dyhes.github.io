---
title: 【k8s】Fundamentals
date: 2025-05-14 00:00:00+0000
categories: 
- nutrition
- willow
tags:
- k8s
---

## **Kubernetes Explained in 6 Minutes | k8s Architecture**
https://www.youtube.com/watch?v=TlHvYWVUZyc
![](https://i.ibb.co/fVy2MFQZ/image.png)

![](https://i.ibb.co/4nYSrZFb/image-3.png)
Pods are the smallest deployable units in k8s.

A pod hosts one or more containers and provide shared storage and networking for those containers

Pods are created and managed by the k8s control plane

## v.s. Docker Compose
Docker Compose 和 Kubernetes（k8s）在容器化技术生态中扮演着不同的角色，主要区别体现在功能定位、架构设计、适用场景和复杂度等方面。以下是两者的核心差异总结：

---

### **功能定位**
1. **Docker Compose**  
   - **核心作用**：专注于单机环境下的多容器应用管理，通过简单的 YAML 文件定义服务、网络和存储，实现一键启动多容器应用。  
   - **功能特性**：  
     - 快速搭建本地开发环境，支持服务依赖关系定义（如数据库和 Web 服务联动）。  
     - 环境隔离（如开发、测试环境独立配置）。  
     - 手动管理容器生命周期（启动、停止、日志查看）。

2. **Kubernetes**  
   - **核心作用**：面向大规模生产环境，提供跨集群的容器编排能力，支持自动化运维、高可用性和复杂场景的扩展。  
   - **功能特性**：  
     - 自动扩缩容（HPA）、滚动更新、故障自愈。  
     - 服务发现与负载均衡（内置 Service 和 DNS）。  
     - 动态存储管理（PV/PVC）、多租户隔离（Namespace）。

---

### **架构设计**
1. **Docker Compose**  
   - **架构**：单机架构，依赖 Docker Daemon 管理本地容器，通过 `docker-compose.yml` 文件定义服务。  
   - **组件**：仅需 Docker 引擎和 Compose CLI，无需额外组件。

2. **Kubernetes**  
   - **架构**：分布式集群架构，包含 Master 节点（API Server、Scheduler、Controller Manager）和 Worker 节点（运行 Pod）。  
   - **组件**：包含 Pod、Service、Deployment 等抽象层，支持跨主机调度和复杂的网络策略。

---

### **配置文件与复杂度**
1. **Docker Compose**  
   - **配置**：简单直观的 YAML 文件，例如定义 Web 服务和数据库：  
     ```yaml
     version: "3"
     services:
       web:
         image: nginx:latest
         ports: ["80:80"]
       db:
         image: mysql:5.7
         environment: MYSQL_ROOT_PASSWORD=example
     ```  
   - **学习成本**：适合开发者和小型团队，无需深入理解分布式系统。

2. **Kubernetes**  
   - **配置**：需要编写多个 YAML 文件定义 Deployment、Service 等，例如：  
     ```yaml
     apiVersion: apps/v1
     kind: Deployment
     metadata:
       name: nginx-deployment
     spec:
       replicas: 3
       selector:
         matchLabels:
           app: nginx
       template:
         metadata:
           labels:
             app: nginx
         spec:
           containers:
           - name: nginx
             image: nginx:1.14.2
             ports:
             - containerPort: 80
     ```  
   - **学习成本**：需掌握集群管理、网络模型和存储编排等概念，适合有运维经验的团队。

---

### **适用场景**
| **场景**                | **Docker Compose**                                  | **Kubernetes**                                      |
|-------------------------|-----------------------------------------------------|-----------------------------------------------------|
| **开发与测试**          | 本地快速启动多容器应用，模拟生产环境依赖。  | 不适用，需依赖集群环境。                            |
| **单机部署**            | 适合小规模应用（如原型验证）。              | 不适用。                                            |
| **生产环境**            | 无法满足高可用性和扩展需求。                        | 支持数千节点、自动故障恢复和跨云部署。      |
| **微服务架构**          | 仅支持简单服务交互。                                | 管理数百个微服务，提供负载均衡和流量控制。  |

---

### **协同使用建议**
- **开发阶段**：使用 Docker Compose 快速构建镜像并测试服务间交互。  
- **生产阶段**：通过 Kubernetes 部署容器集群，结合 Prometheus（监控）、Istio（服务网格）等工具实现云原生架构。  
- **迁移路径**：可通过工具（如 Kompose）将 Compose 文件转换为 Kubernetes 资源描述文件。

---

### **总结**  
Docker Compose 是**轻量级开发工具**，适合快速启动和简单管理；Kubernetes 是**企业级编排平台**，解决大规模、高可用场景的复杂性。两者互补而非竞争，实际项目中常结合使用：Compose 用于开发，Kubernetes 用于生产。

## Docker Compose vs. Minikube
Docker Compose 与 Minikube 是容器化开发中常用的两种工具，但其设计目标、适用场景和功能特性存在显著差异。以下从六个维度对比两者的核心区别：

---

### 设计目标与定位
1. **Docker Compose**  
   - **单机容器编排工具**：专注于在单台主机上快速启动和协调多个容器，通过简单的 YAML 文件定义服务、网络和存储。  
   - **适用场景**：开发/测试环境中快速启动依赖服务（如数据库、缓存），或小型项目的本地集成测试。  

2. **Minikube**  
   - **本地 Kubernetes 模拟器**：在单机环境中启动轻量级 Kubernetes 集群（通常基于虚拟机或 Docker 容器），用于学习和模拟生产级 Kubernetes 环境。  
   - **适用场景**：需要验证 Kubernetes 配置、测试集群功能，或实现开发环境与生产部署的一致性。

---

### 架构差异
| **特性**           | **Docker Compose**                | **Minikube**                          |
|--------------------|-----------------------------------|---------------------------------------|
| **集群支持**        | 仅支持单机部署，无集群概念         | 模拟多节点 Kubernetes 集群（单节点为主） |
| **服务发现**        | 依赖容器名称或自定义网络           | 内置 Kubernetes DNS 服务（如 Service 名称解析） |
| **资源管理**        | 手动分配端口和存储卷               | 支持 Kubernetes 的 PersistentVolume 和 StorageClass |
| **跨节点通信**      | 不支持                            | 通过 CNI 插件支持跨节点 Pod 通信          |

---

### 部署场景对比
| **场景**           | **Docker Compose**                | **Minikube**                          |
|--------------------|-----------------------------------|---------------------------------------|
| **开发环境**        | 快速启动本地服务依赖（如 MySQL、Redis） | 需要验证 Kubernetes 配置或 Operator 行为时使用 |
| **测试环境**        | 单机集成测试                      | 模拟生产环境的滚动更新、故障自愈等特性       |
| **生产环境**        | 不适用                            | 需结合完整 Kubernetes 集群（如 EKS、GKE） |

---

### 核心功能特性
1. **Docker Compose 的优势**  
   - 简单易用：通过 `docker-compose up` 一键启动多容器服务。  
   - 轻量级：无集群管理开销，适合资源有限的本地开发。  

2. **Minikube 的进阶能力**  
   - **自动化运维**：支持 Kubernetes 的 Horizontal Pod Autoscaler（HPA）、滚动更新、蓝绿部署。  
   - **生产级特性**：内置 Service 和 Ingress 实现负载均衡，支持 Liveness/Readiness 探针。  
   - **生态集成**：与 Helm、Prometheus 等云原生工具链无缝对接。

---

### 学习与维护成本
| **维度**           | **Docker Compose**                | **Minikube**                          |
|--------------------|-----------------------------------|---------------------------------------|
| **学习曲线**        | 低（仅需掌握 YAML 语法）           | 高（需理解 Pod、Deployment、Service 等概念） |
| **运维复杂度**      | 低（单机日志和监控）               | 高（需管理集群状态、网络策略和存储方案）       |
| **调试难度**        | 直接通过容器日志排查问题            | 需熟悉 `kubectl logs` 和 `kubectl describe` 命令 |

---

### 使用建议
1. **优先选择 Docker Compose 的场景**  
   - 快速验证微服务本地交互逻辑。  
   - 需要同时启动多个轻量级服务（如 Spring Boot 应用 + PostgreSQL + Redis）。  

2. **优先选择 Minikube 的场景**  
   - 开发与生产环境需保持一致的 Kubernetes 配置（如 ConfigMap、Ingress）。  
   - 测试 Operator 或 Helm Chart 的本地行为。  

3. **混合使用策略**  
   - **开发阶段**：用 Docker Compose 启动数据库等依赖服务，降低资源消耗。  
   - **预发布阶段**：通过 Minikube 验证 Kubernetes 部署配置，确保与生产环境对齐。

---

### 总结
| **工具**          | **核心价值**                      | **局限性**                            |
|-------------------|----------------------------------|---------------------------------------|
| Docker Compose    | 极简的本地多容器协作               | 无法模拟集群特性，缺乏生产级运维能力 |
| Minikube          | 本地 Kubernetes 全功能模拟         | 学习成本高，单节点性能受限         |

根据实际需求灵活选择：**轻量级开发选 Docker Compose，生产兼容性验证选 Minikube**。两者亦可结合使用，例如开发阶段用 Compose，部署前通过 Minikube 完成最终测试。

## **What is Kubernetes | Kubernetes explained in 15 mins**
https://www.youtube.com/watch?v=VnvRFRk_51k
![](https://i.ibb.co/tphfPPrb/image-2.png)

![](https://i.ibb.co/VdWMsPL/image-4.png)

![](https://i.ibb.co/9mJv4f7m/image-5.png)

Usually one pod per application unless your main application needs some helper containers
* JS Application
* Server (Java A)
* DB
* Message Broker

## **Kubernetes Crash Course for Absolute Beginners**
https://www.youtube.com/watch?v=s_o8dwzRlu4
### Service
* Service: Permanent IP address
* Lifecycle of Pod and Service not connected
* replicas is connected to the same service (load balance)
![](https://i.ibb.co/JFC6CShQ/image-6.png)

![](https://i.ibb.co/Mk6tQnMW/image-9.png)

Ingress: entry point

![](https://i.ibb.co/tW5x25B/image-7.png)

## ConfigMap & Secret
**ConfigMap**: 
* External  Configuration of your application
* for non-confidential data only
Secret: Used to store secret data

## Volume
persistent (not gone when pod restarted) data storage
![](https://i.ibb.co/jZxkCg1f/image-8.png)

### Deployment & StatefulSet
Blue print and abstraction of pods

DB can’t be replicated via Deployment!

* Deployment: for stateless apps 
* StatefulSet: for stateful apps or databases (tedious)

DB are often hosted outside of k8s cluster

## K8s Configuration
![](https://i.ibb.co/CpvVkxxV/image-10.png)
* Attributes of ’spec’ is specific to the kind
* third part ’status’ automatically generated and added by k8s
* Etcd holds the current status of any k8s component

## Minikube and Kubectl
![](https://i.ibb.co/TMnX4cwJ/image-11.png)

![](https://i.ibb.co/RpSgfPGX/image-12.png)

![](https://i.ibb.co/qFdWN1C6/image-13.png)

![](https://i.ibb.co/ZRS0MSK3/image-14.png)

### Practice
![](https://i.ibb.co/8gYygnX0/image-15.png)

![](https://i.ibb.co/tPHWB5s7/image-16.png)

![](https://i.ibb.co/Kpmknx0R/image-17.png)

![](https://i.ibb.co/7JN34Yjf/image-18.png)

![](https://i.ibb.co/QF5Mkpqx/image-19.png)

![](https://i.ibb.co/ynt0hLFT/image-20.png)

* For pods, label is a required field.
* For others(like deployments), label is optional but a good practice.

![](https://i.ibb.co/WqB5s75/image-21.png)
**selector**: identify which pod belonging to a deployment

‘—’: you can have multiple yaml configurations within one file

![](https://i.ibb.co/6RpkKtmz/image-22.png)

![](https://i.ibb.co/VYxxMmkX/image-23.png)

![](https://i.ibb.co/BVJtv5XK/image-24.png)