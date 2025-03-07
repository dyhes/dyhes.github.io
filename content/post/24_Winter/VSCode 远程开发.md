---
title: 【VS Code】远程开发
date: 2025-02-28 00:00:00+0000
categories: 
    - snow
---

以下是使用 **VSCode 连接服务器进行远程开发**的完整指南，整合了配置、调试、文件传输等关键步骤：

---

## **连接服务器基础配置**
1. **安装必要插件**  
   - 在 VSCode 中安装 **Remote - SSH** 扩展（通过扩展市场搜索安装）。
   - 若需 Python 开发，建议同时安装 **Python 扩展**以支持语法高亮和调试功能。

2. **配置 SSH 连接**  
   - 按 `F1` 打开命令面板，输入 `Remote-SSH: Add New SSH Host`，按提示输入服务器地址（格式：`user@server_ip`）。
   - 编辑生成的 SSH 配置文件（通常位于 `~/.ssh/config`），补充详细信息如端口号、密钥路径等。例如：
     ```
     Host my_server
       HostName 192.168.1.100
       User user
       Port 22
       IdentityFile ~/.ssh/private_key
     ```  
     

3. **连接服务器**  
   - 再次按 `F1`，选择 `Remote-SSH: Connect to Host`，选择配置好的服务器，输入密码或确认密钥后即可连接。

---

## **免密登录优化（可选）**
为避免频繁输入密码，可通过 SSH 密钥对实现免密登录：
1. **生成密钥对**  
   - 本地终端运行 `ssh-keygen -t rsa`，生成公钥（`id_rsa.pub`）和私钥（`id_rsa`）。
   - 推荐为不同服务器生成独立密钥对，例如 `ssh-keygen -f ~/.ssh/id_rsa_work`。
     -f参数后面跟着的是文件路径
2. **上传公钥到服务器**  
   - 将公钥内容复制到服务器的 `~/.ssh/authorized_keys` 文件中（若文件不存在需手动创建并设置权限为 `600`）。
   - 或使用命令 `ssh-copy-id -i ~/.ssh/id_rsa.pub user@server_ip` 自动完成。

3. **配置本地 SSH 客户端**  
   - 在 `~/.ssh/config` 中指定私钥路径，例如：
     ```
     IdentityFile ~/.ssh/id_rsa_work
     ```  
     

---

## **文件传输与管理**

首次连接将自动下载 VS Code Server

1. **通过 Remote-SSH 直接编辑**  
   - 连接服务器后，VSCode 左侧资源管理器可直接浏览服务器文件，支持直接编辑并自动保存到远程。

2. **使用 SFTP 插件批量传输**  
   - 安装 **SFTP 插件**，按 `Ctrl+Shift+P` 运行 `SFTP: Config`，填写服务器信息（协议、端口、远程路径等）。
   - 右键本地文件选择 `Upload` 上传至服务器，或右键服务器文件选择 `Download` 下载到本地。

---

## **远程 Python 调试**
1. **配置调试环境**  
   - 在 VSCode 中创建或修改 `launch.json`，添加远程调试配置：
     ```json
     {
       "name": "Python: Remote Debug",
       "type": "python",
       "request": "remote",
       "host": "server_ip",
       "port": 5678,
       "pathMappings": [{
         "localRoot": "${workspaceFolder}",
         "remoteRoot": "/remote/project/path"
       }]
     }
     ```  
     

2. **启动远程调试**  
   - 在服务器终端运行 `python -m debugpy --listen 5678 --wait-for-client your_script.py`，启动调试监听。
   - 返回 VSCode 按 `F5` 开始调试，支持断点、变量监控等功能。

---

## **常见问题与优化**
- **连接失败**：检查防火墙设置、SSH 端口是否开放，或尝试通过终端直接 SSH 连接排查问题。
- **权限问题**：确保服务器上的 `.ssh` 目录权限为 `700`，`authorized_keys` 文件权限为 `600`。
- **性能优化**：在远程开发时关闭不必要的插件，或通过 `Remote-SSH: Settings` 调整资源占用。

---

通过以上步骤，你可以在 VSCode 中无缝连接服务器，实现代码编辑、调试、文件传输等完整开发流程。若需更详细的操作示例，可参考各插件的官方文档或扩展教程。