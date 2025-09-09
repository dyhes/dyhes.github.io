---
title: 【NowCoder】Linux
date: 2025-09-09 00:00:00+0000
categories: [arts]
tags: [NowCoder]
---

## tcpdump

tcpdump 是一款强大且广泛使用的命令行网络数据包捕获和分析工具，它允许用户拦截和显示发送或经过计算机网络接口的数据包，是网络故障排查、性能分析和安全监控的利器。

下面是一个快速了解 tcpdump 常用命令的表格：

| 功能类别           | 命令示例                                                     | 说明                                                         |
| ------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **基本捕获**       | `tcpdump -i eth0`                                            | 捕获指定接口 (`eth0`) 的所有数据包。                         |
| **限制与保存**     | `tcpdump -i any -c 10 -w file.pcap`                          | 捕获所有接口的 10 个包并保存到 `file.pcap`。                 |
| **主机与端口过滤** | `tcpdump host 192.168.1.1` `tcpdump port 80` `tcpdump src host 192.168.1.1 and dst port 443` | 过滤特定主机、端口，或组合条件（如源主机+目标端口）。        |
| **协议过滤**       | `tcpdump icmp` `tcpdump tcp` `tcpdump udp`                   | 仅捕获特定协议的数据包（如 ICMP, TCP, UDP）。                |
| **高级过滤**       | `tcpdump 'net 192.168.1.0/24'` `tcpdump 'tcp port 80 and (tcp[((tcp[12:1] & 0xf0) >> 2):4] = 0x47455420)'` | 使用 CIDR 过滤网段，或基于报文内容（如 HTTP GET 请求）进行过滤。 |

### 📜 核心功能

tcpdump 的核心功能包括：

- **数据包捕获**：实时捕获流经网络接口的原始网络数据包。
- **精准过滤**：使用 **BPF (Berkeley Packet Filter)** 语法，可以根据源/目标 IP、端口、协议类型甚至特定报文内容进行过滤，极大提升分析效率。
- **详细解析**：对多种网络协议（如 Ethernet, IP, TCP, UDP, ICMP 等）进行解析，并以可读格式显示报文头信息。
- **数据保存与离线分析**：可将捕获的数据包保存为 `.pcap`文件，便于日后使用 Wireshark 等图形化工具进行深入分析。

### 🛠️ 安装与基本使用

1. **安装 tcpdump**

   在许多 Linux 发行版中，可以使用包管理器安装：

   - Debian/Ubuntu: `sudo apt install tcpdump`
   - RHEL/CentOS: `sudo yum install tcpdump`
   - macOS (使用 Homebrew): `brew install tcpdump`

2. **基本命令格式**

   tcpdump 的基本命令格式为：`sudo tcpdump [选项] [过滤表达式]`

   常用选项包括：

   - `-i <接口>`: 指定网络接口，如 `eth0`, `wlan0`, 或 `any`（所有接口）。
   - `-c <数量>`: 捕获指定数量的数据包后停止。
   - `-w <文件>`: 将捕获的数据包写入文件。
   - `-r <文件>`: 从文件中读取数据包。
   - `-n`: 不将 IP 地址解析为主机名。
   - `-nn`: 不解析主机名和端口号。
   - `-v`, `-vv`, `-vvv`: 显示更详细的信息。
   - `-X`: 以十六进制和 ASCII 码形式显示数据包内容。
   - `-A`: 以 ASCII 格式打印数据包内容。
   - `-s <长度>`: 设置要捕获的数据包长度（`-s0`表示捕获完整数据包）。

### 🔧 常用过滤表达式

tcpdump 的威力在于其灵活的过滤表达式：

- **按主机过滤**：`host 192.168.1.1`(过滤该 IP 的流量)

- **按方向过滤**：`src host 192.168.1.1`(源地址), `dst host 192.168.1.1`(目标地址)

- **按端口过滤**：`port 80`, `dst port 53`

- **按协议过滤**：`tcp`, `udp`, `icmp`

- **逻辑组合**：使用 `and`(与), `or`(或), `not`(非) 组合条件，例如：

  `src host 192.168.1.100 and (dst port 80 or dst port 443)`

### 💡 实用场景与示例

1. **捕获特定主机的 ICMP 包 (如 Ping)**

   ```
   sudo tcpdump -i any -nn icmp and host 192.168.1.1
   ```

2. **捕获 HTTP 流量并显示内容**

   ```
   sudo tcpdump -i any -A -s0 port 80
   ```

3. **捕获特定端口的流量并保存到文件**

   ```
   sudo tcpdump -i eth0 -w web_traffic.pcap port 80 or port 443
   ```

4. **从保存的文件中读取数据包**

   ```
   sudo tcpdump -r web_traffic.pcap
   ```

5. **捕获 TCP 三次握手 (SYN, SYN-ACK, ACK)**

   ```
   sudo tcpdump -nn 'tcp[tcpflags] & (tcp-syn|tcp-ack) != 0'
   ```

### ⚠️ 注意事项

- **权限要求**：tcpdump 需要 root 权限（通常使用 `sudo`）来访问网络接口。
- **性能影响**：在高流量网络上捕获所有数据包可能消耗大量 CPU 和内存。务必使用过滤条件缩小范围，或用 `-c`限制包数量。
- **隐私与安全**：tcpdump 可能捕获明文传输的敏感信息（如密码）。请仅在授权范围内使用，并妥善处理捕获的数据。

### 🔄 替代方案

虽然 tcpdump 功能强大，但在某些场景下，其他工具可能更合适：

- **Wireshark/tshark**: 提供强大的图形化界面和更深入的分析功能，tshark 是其命令行版本。
- **对加密协议的分析**：tcpdump 无法解密 HTTPS 等加密流量的内容。

### 📖 学习建议

掌握 tcpdump 的最佳方式是**结合实践**。可以先从简单的过滤条件开始，如捕获特定 IP 或端口的流量，再逐步尝试更复杂的表达式。使用 `-w`选项保存数据包，然后用 Wireshark 打开进行对比分析，这能帮助你更好地理解网络协议和 tcpdump 的输出。

tcpdump 是网络工作者工具箱中不可或缺的利器，希望这些信息能帮助你更好地理解和使用它。
