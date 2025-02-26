---
title: 【Redis】In Spring Boot
date: 2024-09-23 00:00:00+0000
categories: 
    - snow
tags:
    - Spring Boot
    - Redis
    - Docker
---


## dependency

```java
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

## application.properties

```java
spring.data.redis.host=localhost
spring.data.redis.port=6379
```

## compose.yaml

```dockerfile
redis:
  # 与 ’redis:latest' subtle differences
  image: redis:latest
  container_name: postopia-redis
  ports:
    - "6379:6379"
```

## Config

```java
@Configuration
public class RedisConfig {

    @Bean
    RedisConnectionFactory redisConnectionFactory() {
        return new LettuceConnectionFactory();
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        // Use String serializers for keys
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new StringRedisSerializer());

        return template;
    }
}
```

## Service

```java
@Service
public class RedisService {
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    public void setByMinute(String key, Object value, int minute) {
        redisTemplate.opsForValue().set(key, value, minute, TimeUnit.MINUTES);
    }

    public String get(String key) {
        return (String) redisTemplate.opsForValue().get(key);
    }

    public void delete(String key) {
        redisTemplate.delete(key);
    }
}
```

