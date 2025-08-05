---
title: 【Shopee】Insight Hub
date: 2025-08-04 00:00:00+0000
categories: [snow]
tags: [Shopee]
---

**InsightHub** is an internal tool for automatically extracting knowledge from Java projects and building an AI-assisted project knowledge center.

It integrates:

- **Spring AI + Ollama + LLM** for understanding and explaining code.
- **MyBatis + MySQL** for task tracking and persistent storage.
- **Milvus** for storing code embeddings and enabling semantic search.
- **Redis** for caching.

---

## ✨ Features

- Automatic structure extraction (classes, methods, relationships)
- Method-level comment generation via LLM
- Embedding generation + Milvus vector storage
- Project-level semantic search and intelligent Q&A

---

## 🌍 Docker Compose

This project includes a preconfigured Docker Compose setup for local development.

### ♻ How to start services

```bash
docker-compose up -d
```

This will start:

- **MySQL** (on port 3306)
- **Redis** (on port 6379)
- **Milvus** (on port 19530)
- **Nebula Graph** (optional)
- **Ollama** (on port 11434)

### 🎧 Pull LLM model for Ollama (e.g. codellama)

```bash
curl http://localhost:11434/api/pull -d '{"name": "codellama:7b"}'
```

---

## ⚖️ Configuration

### application-local.yaml

Make sure this file exists in `src/main/resources/`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/insighthub
    username: insighthub_user
    password: insighthub_pass
    driver-class-name: com.mysql.cj.jdbc.Driver

  data:
    redis:
      host: localhost
      port: 6379

  ai:
    openai:
      base-url: http://localhost:11434
      api-key: dummy
      chat:
        model: codellama:7b
      embedding:
        model: llama-embedding

milvus:
  host: localhost
  port: 19530
  database: default
  collection: insighthub_vectors
```

### Activating the profile

In `application.yaml`:

```yaml
spring:
  profiles:
    active: local
```

Or via command line:

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

---

## ⚙️ Local Dev Workflow

1. Start all services via Docker Compose:

```bash
docker-compose up -d
```

2. Start the Spring Boot app:

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

3. Test endpoint:

```bash
curl -X POST http://localhost:8080/api/test/ask \
     -H "Content-Type: text/plain" \
     -d "你是谁"
```

4. You should get a natural language answer from the local LLM via Ollama.

---

## 💡 Notes

- You can configure different LLMs via Ollama (e.g. `llama2`, `mistral`, `llama3`)
- Milvus is used to store embeddings for later retrieval (e.g. RAG)
- The project is designed to support agent-based architecture

---

## ☑️ To-do (Next Steps)

-