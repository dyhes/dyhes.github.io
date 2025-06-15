---
title: 【Spring Cloud】Deployment
date: 2025-05-31 00:00:00+0000
categories: 
- willow
- nutrition
tags:
- Spring
- Postopia
---
## Spring Cloud 应用
```groovy
apply plugin: 'org.springframework.boot'

//默认行为
bootJar {
	enabled = true
}
jar {
	enabled = true
}
```

执行
```shell
./gradlew clean build
```
构建普通jar包（用于被其他服务依赖）和bootJar包
### Dockerfile
```dockerfile
# 选择轻量级基础镜像（推荐）
FROM eclipse-temurin:17.0.15_6-jre-ubi9-minimal

# 设置工作目录
WORKDIR /app

# 复制JAR文件到容器
COPY build/libs/gateway.jar app.jar

# 暴露服务端口（与实际端口一致）
EXPOSE 8080

# 启动命令
ENTRYPOINT ["java", "-jar", "app.jar"]

```

## Nginx
Dockerfile
```dockerfile
FROM nginx:stable-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

COPY dist/ /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

```
nginx.conf
```nginx
server {
  listen 80;
  server_name localhost;
  
  location / {
    root /usr/share/nginx/html;
    index index.html;
    try_files $uri $uri/ /index.html;
  }
  
  error_page 500 502 503 504 /50x.html;
  location = /50x.html {
    root /usr/share/nginx/html;
  }
}

```

## Minikube

可能存在网络问题，在 Docker Desktop 提前拉取镜像后
```shell
minikube start --driver=docker \
--base-image="kicbase/stable:v0.0.45" --memory=7500mb --cpus=4

```

```bash
#!/bin/bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/volumes/
kubectl apply -f k8s/config/
kubectl apply -f k8s/infra/
kubectl apply -f k8s/backend/
kubectl apply -f k8s/frontend/
```

### 查看pod
kubectl get pods -n postopia
### 查看deployment
kubectl get deployments -n postopia
### 查看原因
kubectl describe pod mysql -n postopia
kubectl describe svc nacos -n postopia
kubectl describe pod nacos -n postopia

kubectl describe pod user-service -n postopia

kubectl describe pod nacos-5bb4c6c67b-4gp4q -n postopia
### 查看 logs

kubectl logs -l app=mysql -n postopia

kubectl logs -l app=gateway -n postopia

kubectl logs -l app=comment-service -n postopia

kubectl logs -f comment-service-664bdb7c6d-x4trv -n postopia

kubectl logs -f space-service-577f84bfcc-x2vl5 -n postopia
kubectl logs mysql-*

kubectl logs -f gateway-59bd97c779-x664w -n postopia

kubectl logs -n postopia -f user-service-67c8888fc7-7dcvq
查看上次崩溃前日志
kubectl logs -f mysql-697cc894c9-stzql -n postopia —previous

kubectl logs -f mysql-5656bc586-nktt5 -n postopia --previous

kubectl logs -f mysql -n postopia

kubectl logs -f nacos-54b76d5dcc-mrgkd -n postopia --previous
### 查看环境变量
kubectl exec -it comment-service-664bdb7c6d-x4trv -n postopia -- env | grep REDIS_HOST
### 查看目录
kubectl exec -it mysql-697cc894c9-stzql -n postopia -- ls /var/run/mysqld/
### 重启 Deployment
kubectl rollout restart -n postopia deployment/<deployment-name> 

kubectl rollout restart deployment/nacos -n postopia

kubectl rollout restart  -n postopia deployment/user-service

kubectl rollout restart deployment/comment -n postopia
### 构建镜像
eval $(minikube docker-env)

docker build -t postopia-nacos-mysql:latest ./nacos-mysql
docker build -t postopia-es:latest ./elastic-search
*# Build application services*

docker build -t postopia-gateway:latest ./gateway
docker build -t postopia-user:latest ./user-service
docker build -t postopia-space:latest ./space-service
docker build -t postopia-post:latest ./post-service
docker build -t postopia-comment:latest ./comment-service
docker build -t postopia-message:latest ./message-service
docker build -t postopia-vote:latest ./vote-service
docker build -t postopia-opinion:latest ./opinion-service
docker build -t postopia-search:latest ./search-service
### 加载镜像
 minikube image load

## Server



## Kubernetes
to be continued



docker-compose -f compose-test.yaml up -d user-service

ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCutl60XhY0VKswZUESzBt3AdgqvPlNSIxJNbaSODfoUZwTsiioajG3II5mH0k9VKm6H8DYT0qwMrR2AieAVh1DOFJ1XN/vjSNXGOiF5mHkwui/nrU4bE8m6jg3AMKTPW2jpSSBh0zYstMeK50rLVu83Tt3sI7okMfTL9yATIwb+nGTsKyjEOmgG4909R88IrVJ6zuF0X0F/d5k8RoswO2i8BlOoM5jG0Jtla1fOj+w+B1AGNt0m1FXaLVjlk1sBYwM29qbBJzeET3BzHo17Q49kDfgzH/FpgIlEZordyoNc8pGx0WVp6OQtqlvq9+FF2/sYWQjsInjNSh8+PtYdv0upTiVgpG/Bx5xBuJIMrEqFXSTFcSH3sdr+rmZDIfc/V+vWaBa7D564CBH33WXZh2WkizOY+3VFhK7IDp6r3d6XkJPdUHI+orKfGFWUdnEFX/sDMn4jX/6vmE4muYxbwRniFZ1u17vgZCFwnhfNeSIIEOH+6dsQXztP6bN/761KUtOs2ST+LFNpw9mO+RPL4v2cIPqNNaqZ7Dufoy4/RlC2RbMIOGryFG+73JxmKeVwyiK2bFK0IAgV386BVunuhV0GLuBmjODa//c1KWDoKpTR1qJ0tduzlMvGN8uUuOnADZDrupUlmkwh6zx3xUHCdtWk1E917TjwZdy0sq2IqCy3Q== github-actions action@github