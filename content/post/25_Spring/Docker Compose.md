---
title: 【Docker Compose】Notes
date: 2025-05-14 00:00:00+0000
categories: 
- willow
- nutrition
tags:
- Docker
---
## Version
在 `docker-compose.yaml` 文件中，第一行的 `version` 字段用于指定当前文件遵循的 Docker Compose 配置规范版本。它的作用主要体现在以下几个方面：

---

### **定义语法与功能支持**
`version` 决定了 Compose 文件使用的语法规则和可用功能。不同版本的 Compose 规范支持不同的配置项：
- **版本 2**：引入 `services` 顶级键，支持资源限制（如 CPU、内存）、容器依赖管理、网络和卷的高级配置。
- **版本 3**：兼容 Docker Swarm 集群模式，支持滚动更新、服务扩展等编排功能，适用于多主机部署场景。
- **更高版本（如 3.8）**：逐步新增特性（如 GPU 资源分配、健康检查增强等），同时保持向后兼容性。

若未显式指定 `version`，默认行为因 Docker Compose 版本而异：
- 旧版工具（如 Docker Compose v1/v2）可能默认使用版本 2 的语法；
- 新版工具（如 Compose V2+）支持无 `version` 声明，直接遵循最新的 [Compose 规范](https://compose-spec.io/)。

---

### **与 Docker 引擎的兼容性**
Docker Compose 文件版本需与 Docker 引擎版本匹配，否则可能因语法不兼容导致报错。例如：
- `version: '3.8'` 要求 Docker Engine **19.03.0+**；
- `version: '3'` 最低要求 Docker Engine **1.13.0+**；
- 若使用旧版 Docker（如 17.06），需选择 `version: '3.3'` 或更低。

---

### **废弃与演进**
- **旧版本（如 v1）**：已废弃，仅支持基础配置，不推荐使用。
- **新版规范趋势**：官方逐步弱化对 `version` 的强制要求。若文件未声明 `version`，默认采用最新规范，同时可能触发警告（如 `WARN[0000] version is obsolete`）。
- **推荐做法**：
  - **单机环境**：可省略 `version`，直接使用最新语法；
  - **集群或需明确版本控制**：显式声明版本（如 `3.8`）以确保兼容性。

---

### 示例与选择建议
```yaml
version: '3.8'  # 声明使用 3.8 版本规范（需 Docker 19.03.0+）
services:
  web:
    image: nginx
    deploy:  # 此配置项仅在版本 3+ 中有效
      replicas: 3
```

**总结**：`version` 主要用于控制语法解析规则和功能范围，需根据 Docker 环境版本和需求选择。新版开发中可逐步过渡到无 `version` 声明，以简化配置。

## Volumns 不设置
在 Docker Compose 中，**不设置 `volumes` 字段时，Docker 不会自动创建任何宿主机目录或数据卷**，此时容器内的数据仅存储在容器的可写层中，且具备以下特性：

---

### **数据存储方式**
- **默认行为**：不配置 `volumes` 时，容器内的文件系统与宿主机完全隔离，所有数据仅在容器内部临时存储。
- **数据生命周期**：当容器被删除或重建时，所有未持久化的数据都会丢失。

---

### **自动创建的条件**
若需 Docker 自动创建目录或卷，需满足以下条件：
- **显式定义 `volumes`**：必须通过 `volumes` 字段明确指定宿主机路径（如 `- /host/path:/container/path`）或命名卷（如 `- my_volume:/container/path`）。
- **宿主机路径不存在时**：当使用绑定挂载（`bind` 模式）且宿主机目录不存在时，Docker 会尝试自动创建该目录，但可能因权限问题导致容器无法写入（自动创建的目录权限默认归属 `root`）。

---

### **推荐做法**
- **显式定义持久化路径**：若需数据持久化，应在 `volumes` 中明确配置宿主机路径或命名卷。例如：
  ```yaml
  services:
    app:
      volumes:
        - ./data:/app/data  # 自动创建宿主机目录（需注意权限）
        - db_volume:/var/lib/mysql  # 使用命名卷自动管理
  volumes:
    db_volume:
  ```
- **手动创建宿主机目录**：对于关键目录（如配置文件、日志路径），建议提前手动创建并设置权限（如 `chmod 777 /host/path`），避免自动创建引发的权限问题。
- **使用命名卷**：对于需要跨容器共享或长期存储的数据，优先使用 Docker 管理的命名卷（`volumes` 模式），其生命周期独立于容器，且权限更易控制。

---

### 模式对比
| **模式**        | **是否需要显式定义 `volumes`** | **数据持久化** | **自动创建目录** | **适用场景**                     |
|----------------|--------------------------|------------|------------|------------------------------|
| 未配置 `volumes` | 否                        | 否          | 否          | 临时测试、无需保存数据的场景             |
| 绑定挂载（`bind`） | 是                        | 是          | 是（有条件）    | 开发环境配置文件映射、日志收集           |
| 命名卷（`volume`） | 是                        | 是          | 是（自动管理）  | 生产环境数据持久化、多容器共享数据         |

---

**总结**：Docker Compose 仅在显式配置 `volumes` 时才会根据规则自动创建目录或卷。若需数据持久化，务必通过 `volumes` 字段定义路径或命名卷，并优先通过手动管理目录权限以避免运行时问题。

## Volumes 语法
在 Docker Compose 中，`volumes` 用于定义容器与宿主机之间的数据挂载规则，支持多种语法格式和配置选项。以下是其核心语法规则及使用场景的总结：

---

### **短格式（Short Syntax）**
短格式是日常开发中最常用的简洁写法，适用于快速定义简单的数据挂载需求。

####  **基本结构**
```yaml
volumes:
  - [宿主机路径|卷名]:[容器路径]:[权限]
```

####  **常见用法示例**
| **场景**                     | **示例**                           | **说明**                                                                 |
|-----------------------------|-----------------------------------|-------------------------------------------------------------------------|
| **绑定挂载（Bind Mount）**    | `- /host/path:/container/path`   | 将宿主机的 `/host/path` 映射到容器的 `/container/path`，路径需存在或自动创建 |
| **相对路径绑定**              | `- ./data:/app/data`             | 以 Compose 文件所在目录为基准的相对路径映射                                 |
| **只读权限**                 | `- /configs:/etc/configs:ro`     | 容器内目录 `/etc/configs` 以只读模式挂载                                 |
| **匿名卷**                   | `- /var/lib/mysql`               | 容器内路径挂载到宿主机随机生成的匿名卷（数据生命周期与容器绑定）                     |
| **命名卷**                   | `- db_volume:/var/lib/mysql`     | 使用预定义的命名卷 `db_volume`（需在顶级 `volumes` 块中声明）                   |

---

### **长格式（Long Syntax）**
长格式（Compose v3.2+ 支持）提供更精细的配置选项，适用于复杂场景。

####  **基本结构**
```yaml
volumes:
  - type: volume|bind|tmpfs
    source: [宿主机路径|卷名]
    target: [容器路径]
    volume:
      nocopy: true|false  # 是否禁止复制容器初始数据到新卷
    read_only: true|false
```

####  **示例与配置项**
```yaml
volumes:
  - type: bind           # 绑定宿主机目录
    source: ./static     # 宿主机相对路径
    target: /opt/app/static
    read_only: true      # 容器内只读

  - type: volume         # 使用命名卷
    source: db_data
    target: /var/lib/mysql
    volume:
      nocopy: true       # 禁止从容器复制初始化数据到新卷

  - type: tmpfs          # 临时内存文件系统
    target: /tmp/cache
    tmpfs:
      size: 10000        # 限制内存大小（单位：字节）
```

---

### **匿名卷与命名卷对比**
| **类型**   | **定义方式**               | **生命周期**               | **适用场景**                     |
|----------|-------------------------|-------------------------|------------------------------|
| **匿名卷** | `- /container/path`     | 随容器删除而丢失               | 临时数据存储（如测试环境）         |
| **命名卷** | 需在顶级 `volumes` 块声明    | 独立于容器，需手动删除           | 生产环境数据持久化（如数据库文件）      |

**命名卷定义示例**：
```yaml
volumes:
  db_data:  # 顶级定义命名卷
    driver: local
    driver_opts:
      type: nfs          # 使用 NFS 驱动
      o: addr=192.168.1.100,rw
```

---

### **数据持久化策略**
1. **开发环境**  
   - 使用绑定挂载（`bind`）实时同步代码和配置文件。
   - 示例：`- ./src:/app/src` 实现代码热更新。

2. **生产环境**  
   - 优先使用命名卷（`volume`）保证数据安全性和可移植性。
   - 结合云存储驱动（如 AWS EBS、NFS）实现跨主机共享。

3. **临时数据**  
   - 使用 `tmpfs` 类型将数据存储在内存中，避免磁盘 I/O 开销。

---

### **注意事项**
1. **路径存在性**  
   - 绑定挂载时，若宿主机路径不存在，Docker 会自动创建目录（需注意权限问题）。

2. **权限冲突**  
   - 容器内进程需有权限读写挂载路径，可通过 `chmod` 提前设置宿主机目录权限。

3. **版本兼容性**  
   - 长格式需 Compose 文件版本 ≥ `3.2`。

4. **数据备份**  
   - 命名卷可通过 `docker volume inspect` 查看物理路径，便于备份。

---

### **完整示例**
```yaml
version: '3.8'
services:
  db:
    image: mysql:8.0
    volumes:
      - db_data:/var/lib/mysql      # 命名卷持久化数据
      - ./my.cnf:/etc/mysql/my.cnf  # 绑定配置文件（只读）
    environment:
      - MYSQL_ROOT_PASSWORD=secret

volumes:
  db_data:  # 定义命名卷
    driver: local
```

通过合理选择 `volumes` 语法，可灵活管理容器数据，满足开发、测试、生产多场景需求。

## build
Docker Compose 的 `build` 命令用于根据 `docker-compose.yml` 文件中的配置构建服务镜像，是管理多容器应用的核心命令之一。以下是其核心功能和用法详解：

---

### 基本用法
1. **构建所有服务镜像**  
   默认情况下，`docker-compose build` 会读取 `docker-compose.yml` 文件中所有定义了 `build` 配置的服务，并依次构建它们的镜像。例如：
   ```yaml
   services:
     web:
       build: ./app  # 指定构建上下文目录
     api:
       build: ./api
   ```
   执行 `docker-compose build` 将同时构建 `web` 和 `api` 服务的镜像。

2. **构建指定服务镜像**  
   若只需构建部分服务，可在命令后添加服务名称。例如：
   ```bash
   docker-compose build web  # 仅构建 web 服务
   ```

---

### 常用选项与参数
1. **强制不使用缓存（`--no-cache`）**  
   默认情况下，Docker 会利用缓存层加速构建。使用 `--no-cache` 可跳过缓存，从头开始构建：
   ```bash
   docker-compose build --no-cache
   ```

2. **拉取最新基础镜像（`--pull`）**  
   强制从镜像仓库拉取最新版本的 `FROM` 基础镜像，确保构建基于最新依赖：
   ```bash
   docker-compose build --pull
   ```

3. **并行构建（`--parallel`）**  
   在 Docker Compose 3.4+ 版本中，可通过 `--parallel` 并行构建多个服务，缩短构建时间：
   ```bash
   docker-compose build --parallel
   ```

4. **传递构建参数（`--build-arg`）**  
   向 Dockerfile 传递动态参数，例如环境变量：
   ```bash
   docker-compose build --build-arg APP_ENV=production
   ```

5. **保留中间容器（`--no-rm`）**  
   默认构建后会删除中间容器，添加此选项可保留用于调试：
   ```bash
   docker-compose build --no-rm
   ```

---

### 配置文件中的 `build` 参数
在 `docker-compose.yml` 中，`build` 部分支持以下配置：
- **`context`**：指定构建上下文的目录（包含 Dockerfile 的路径）。
- **`dockerfile`**：自定义 Dockerfile 文件名（默认为 `Dockerfile`）。
- **`args`**：定义构建时传递的变量，需在 Dockerfile 中通过 `ARG` 声明。
  ```yaml
  services:
    web:
      build:
        context: ./app
        dockerfile: Dockerfile.prod
        args:
          - APP_VERSION=1.0
  ```

---

### 使用场景与注意事项
1. **适用场景**  
   - 修改了 Dockerfile 或构建上下文中的文件（如代码、依赖配置）。
   - 需要手动更新镜像版本或传递特定构建参数。

2. **与 `docker-compose up` 的区别**  
   `docker-compose up` 会自动检测镜像是否需要重新构建，但直接使用 `build` 命令可更精细控制构建过程（例如跳过缓存）。

3. **注意事项**  
   - 并行构建需确保服务间无依赖，否则可能引发构建顺序问题。
   - 构建完成后需通过 `docker-compose up` 启动服务容器。

---

### 完整示例
假设项目结构如下：
```yaml
version: '3.8'
services:
  app:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
      args:
        - NODE_ENV=production
    ports:
      - "3000:3000"
  db:
    image: postgres:14
```
执行以下命令将构建 `app` 服务镜像：
```bash
docker-compose build --no-cache --pull app
```

---

通过灵活组合这些选项和配置，可以高效管理 Docker 镜像的构建流程，确保开发与生产环境的一致性。

## rebuild
在 Docker Compose 中执行镜像的重新构建（Rebuild）可通过以下方法实现，适用于开发过程中代码或配置变更后的更新需求：

---

### 核心命令及用法
####  **单独执行 `build` 命令**  
通过 `docker-compose build` 重新构建所有服务的镜像，默认使用缓存加速构建。若需强制完全重建，需添加参数：  
```bash
# 重建全部服务镜像（跳过缓存）
docker-compose build --no-cache

# 仅重建指定服务（如 web 服务）
docker-compose build --no-cache web
```
通过 `--no-cache` 参数禁用缓存，确保从头开始构建镜像。

####  **结合 `up` 命令触发重建**  
通过 `docker-compose up` 的 `--build` 参数，可在启动服务时自动执行镜像重建：  
```bash
# 重建并启动所有服务（推荐开发调试使用）
docker-compose up --build

# 后台运行并强制重建指定服务
docker-compose up -d --build web
```
此方式会先执行构建流程再启动容器，适合需要快速验证变更的场景。

---

### 高级配置与参数
####  **拉取最新基础镜像**  
使用 `--pull` 参数强制从镜像仓库更新 `FROM` 指令中的基础镜像：  
```bash
docker-compose build --pull
```
确保构建基于最新依赖环境，避免基础镜像过期问题。

####  **传递构建参数**  
在 `docker-compose.yml` 中定义 `args` 或通过命令行动态注入变量：  
```yaml
# docker-compose.yml 配置示例
services:
  app:
    build:
      context: .
      args:
        APP_ENV: production
```
命令行覆盖参数：  
```bash
docker-compose build --build-arg APP_ENV=staging
```
适用于环境差异配置（如开发/生产环境切换）。

####  **并行构建加速**  
在 Docker Compose 3.4+ 版本中，启用并行构建缩短多服务重建时间：  
```bash
docker-compose build --parallel
```
需确保服务间无构建顺序依赖。

---

### 清理与调试技巧
####  **删除旧容器与中间层**  
重建前可通过以下命令清理环境：  
```bash
# 停止并删除所有关联容器（保留数据卷）
docker-compose down

# 删除构建过程中的临时容器（避免残留干扰）
docker-compose build --force-rm
```
`--force-rm` 参数强制删除中间容器。

####  **查看构建日志**  
通过日志排查构建失败原因：  
```bash
docker-compose logs --tail=100 web
```
结合 `docker-compose config` 验证配置文件语法正确性。

---

### 典型场景示例
####  **全量重建并启动服务**  
```bash
docker-compose down && docker-compose build --no-cache && docker-compose up -d
```
适用于代码或依赖项大规模变更后的环境刷新。

####  **增量更新指定服务**  
```bash
docker-compose build --pull web && docker-compose up -d web
```
仅更新 `web` 服务，减少对其他服务的影响。

---

通过灵活组合上述命令，可高效管理镜像重建流程，兼顾开发效率与部署稳定性。建议根据具体需求选择参数组合，并通过 `docker-compose help build` 查看完整选项说明。