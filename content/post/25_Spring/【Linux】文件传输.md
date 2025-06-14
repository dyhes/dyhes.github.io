---
title: 【Linux】文件传输
date: 2025-03-19 00:00:00+0000
categories: 
- nutrition
tags:
- Linux
---
使用 Python paramiko 从服务器A往服务器B传输文件时突然无法建立SSH连接

无法 ping 通，mac上也无法ping 通，可能是因为云服务器B的安全设置
但mac ssh可以正常连接 而服务器 A ssh 无法连接

```bash
sudo systemctl status ssh

```

输出为
3月 18 20:42:58 ubun sshd[2161323]: Accepted publickey for LinHP from 10.63.73.193 port 54224 ssh2: ED25519 SHA256:UYeM7K2FrBnqkAL9NhA73XGb3lDKK4YBW9/8e>
3月 18 20:42:58 ubun sshd[2161323]: pam_unix(sshd:session): session opened for user LinHP by (uid=0)
3月 18 20:49:17 ubun sshd[2165862]: Accepted publickey for LinHP from 10.63.73.193 port 54352 ssh2: ED25519 SHA256:UYeM7K2FrBnqkAL9NhA73XGb3lDKK4YBW9/8e>
3月 18 20:49:17 ubun sshd[2165862]: pam_unix(sshd:session): session opened for user LinHP by (uid=0)
3月 18 20:58:18 ubun sshd[2172643]: Accepted publickey for LinHP from 10.63.73.193 port 54497 ssh2: ED25519 SHA256:UYeM7K2FrBnqkAL9NhA73XGb3lDKK4YBW9/8e>
3月 18 20:58:18 ubun sshd[2172643]: pam_unix(sshd:session): session opened for user LinHP by (uid=0)
3月 18 21:12:01 ubun sshd[2182111]: Accepted publickey for LinHP from 10.63.73.193 port 54563 ssh2: ED25519 SHA256:UYeM7K2FrBnqkAL9NhA73XGb3lDKK4YBW9/8e>
3月 18 21:12:01 ubun sshd[2182111]: pam_unix(sshd:session): session opened for user LinHP by (uid=0)
3月 19 10:13:18 ubun sshd[2712696]: Accepted publickey for LinHP from 10.63.73.193 port 55045 ssh2: ED25519 SHA256:UYeM7K2FrBnqkAL9NhA73XGb3lDKK4YBW9/8e>
3月 19 10:13:18 ubun sshd[2712696]: pam_unix(sshd:session): session opened for user LinHP by (uid=0)

猜测可能由于session过多