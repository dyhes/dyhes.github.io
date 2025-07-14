---
title: 【Linux】Script
date: 2025-04-13 00:00:00+0000
categories: 
- nutrition
tags:
- Linux
---

## 后台运行
在 Linux 服务器上，默认情况下直接通过 SSH 终端前台运行 Python 脚本时，**断开 SSH 连接会导致脚本停止运行**。这是因为 SSH 会话终止时会发送挂断信号（SIGHUP），导致其子进程（即你的 Python 脚本）也被终止。但通过以下方法可实现断开连接后脚本持续运行：

---

### **默认行为与原理**
1. **直接运行脚本**：  
   若通过 `python script.py` 直接运行，脚本会绑定到当前 SSH 会话。**断开连接后进程会被终止**。
   
2. **原因**：  
   SSH 会话关闭时，系统会向所有关联进程发送 `SIGHUP` 信号，导致进程树被终止。

---

### **保持脚本持续运行的方法**
#### **`nohup` 命令（简单后台运行）**
```bash
nohup python3 script.py > output.log 2>&1 &
```
- **作用**：忽略 `SIGHUP` 信号，将脚本输出重定向到日志文件，并在后台运行。
- **优点**：无需安装额外工具，适合临时任务。
- **缺点**：无法实时交互，需手动查看日志（如 `tail -f output.log`）。

#### **`screen` / `tmux`（会话管理工具）**
- **安装与使用**：
  ```bash
  # 安装 screen（以 Ubuntu 为例）
  sudo apt install screen
  # 创建新会话
  screen -S mysession
  # 运行脚本后按 Ctrl+A+D 退出会话
  # 重连会话
  screen -r mysession
  ```
- **作用**：创建虚拟终端会话，脚本在会话中运行，即使断开连接仍保留。
- **适用场景**：需交互式操作或分屏管理多任务。

#### **`systemd` 服务（长期守护进程）**
- **步骤**：
  1. 创建服务文件 `/etc/systemd/system/my_script.service`：
     ```ini
     [Unit]
     Description=My Python Script
     After=network.target
     
     [Service]
     ExecStart=/usr/bin/python3 /path/to/script.py
     WorkingDirectory=/path/to/script_dir
     Restart=always
     User=your_username
     
     [Install]
     WantedBy=multi-user.target
     ```
  2. 启用并启动服务：
     ```bash
     sudo systemctl daemon-reload
     sudo systemctl start my_script
     sudo systemctl enable my_script  # 开机自启
     ```
- **优点**：支持进程监控、崩溃自动重启，适合生产环境。

#### **`tmux`（高级会话管理）**
```bash
# 安装 tmux
sudo apt install tmux
# 新建会话并运行脚本
tmux new -s mysession
python3 script.py
# 按 Ctrl+B 后按 D 分离会话
# 重连会话
tmux attach -t mysession
```
- **优势**：支持多窗口分屏、会话持久化，功能比 `screen` 更强大。

#### **Supervisor（专业进程管理）**
- **安装与配置**：
  ```bash
  sudo apt install supervisor
  # 创建配置文件 /etc/supervisor/conf.d/my_app.conf
  [program:my_app]
  command=python3 /path/to/script.py
  autostart=true
  autorestart=true
  stderr_logfile=/var/log/my_app.err.log
  stdout_logfile=/var/log/my_app.out.log
  ```
- **作用**：提供 Web 界面监控进程状态，支持日志轮转和多进程管理。

---

### **方法对比与选择建议**
| **方法**       | **适用场景**                         | **核心优势**                         |
|----------------|--------------------------------------|--------------------------------------|
| `nohup`        | 临时任务快速启动                     | 无需安装，命令简单                   |
| `screen`/`tmux`| 需要交互或分屏操作的任务             | 会话持久化，支持重连                 |
| `systemd`      | 长期运行的生产环境服务               | 自动重启，系统级守护                 |
| `Supervisor`   | 多进程管理及可视化监控               | 日志管理、进程分组                   |

---

### **注意事项**
1. **日志管理**：通过 `> output.log` 或服务配置记录输出，避免资源占用失控。
2. **资源监控**：长期运行需关注内存和 CPU 使用情况，防止脚本异常占用资源。
3. **脚本健壮性**：添加异常处理逻辑（如 `try-except`），避免因报错导致进程退出。

若需进一步优化（如分布式任务或状态持久化），可参考 `foreverVM` 等工具实现代码永生不灭的高级功能。

## 程序终止
在Linux系统中终止某个Python程序可以通过多种方式实现，具体方法根据实际场景和需求选择。以下是详细的操作步骤和注意事项：

---

### **精确终止指定Python程序**
#### **查找目标进程的PID（进程ID）**
使用 `ps` 或 `pgrep` 命令筛选出目标Python进程的PID：
```bash
ps aux | grep python | grep -v grep
```
- **作用**：列出所有包含“python”关键字的进程，并排除`grep`自身。
- **示例输出**：
  ```
  user   1234  0.5  0.1 123456 7890 pts/0  S+   10:00   python my_script.py
  ```
  - **PID**是第二列的数字（例如`1234`）。

#### **发送终止信号**
通过PID向进程发送终止信号：
- **正常终止（SIGTERM）**：
  ```bash
  kill PID
  ```
  - 允许程序执行清理操作（如保存数据、关闭文件）。
- **强制终止（SIGKILL）**：
  ```bash
  kill -9 PID
  ```
  - 立即终止进程，不执行清理操作，适用于无响应的情况。

---

### **通过进程名终止**
#### **使用`pkill`命令**
根据进程名批量终止所有匹配的Python程序：
```bash
pkill -f "python my_script.py"
```
- **参数**：
  - `-f`：匹配完整的命令行（包含参数）。
  - 若不指定脚本名（如`pkill python`），会终止所有Python进程，可能导致误杀。

#### **使用`killall`命令**
终止所有同名进程：
```bash
killall python3
```
- **注意**：需指定Python解释器版本（如`python3`），避免影响系统服务。

---

### **使用系统工具可视化终止**
#### **`top`或`htop`工具**
- **操作步骤**：
  1. 运行 `top` 或 `htop`（需安装）。
  2. 按 `k`（在`top`中）或选中进程后按 `F9`（在`htop`中）。
  3. 输入PID或选择信号（如`SIGTERM`或`SIGKILL`）终止进程。

#### **监控工具的优势**
- 实时查看CPU/内存占用，辅助定位异常进程。
- 适合需要动态管理多个进程的场景。

---

### **脚本自动化终止**
编写Shell脚本批量终止进程：
```bash
#!/bin/bash
TARGET_SCRIPT="my_script.py"
PIDS=$(pgrep -f "$TARGET_SCRIPT")
for PID in $PIDS; do
  kill -15 $PID
done
```
- **功能**：优雅终止指定脚本的所有实例。
- **定时任务**：结合`cron`定期清理无响应进程。

---

### **注意事项**
1. **避免误杀系统进程**：
   - 使用`grep`精确匹配脚本名或参数（如`grep "my_script.py"`）。
2. **优先使用SIGTERM**：
   - 强制终止（`kill -9`）可能导致数据损坏，仅作为最后手段。
3. **程序内优雅退出**：
   - 在Python代码中捕获`SIGTERM`信号，实现资源清理：
     ```python
     import signal, sys
     def cleanup(sig, frame):
         print("Exiting...")
         sys.exit(0)
     signal.signal(signal.SIGTERM, cleanup)
     ```
   - 适用于长期运行的服务。

---

### **总结**
- **精确终止**：推荐先通过`ps`或`pgrep`查找PID，再用`kill`操作。
- **批量操作**：谨慎使用`pkill`或`killall`，避免影响其他进程。
- **复杂场景**：结合脚本或系统工具动态管理进程。
