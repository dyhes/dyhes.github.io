---
title: 【Linux】磁盘
date: 2025-03-18 00:00:00+0000
categories: 
- nutrition
tags:
- Linux
---

在Linux系统中，查看磁盘空间是日常管理的重要操作，以下是常用的命令及方法，结合不同场景的需求进行整理：


### **基础命令**
1. **`df` 命令**  
   • **功能**：查看文件系统的整体磁盘空间使用情况（如总容量、已用空间、剩余空间及挂载点）  
   • **常用选项**：  
   ◦ `df -h`：以易读格式（GB/MB）显示所有已挂载文件系统的信息  
   ◦ `df -i`：显示inode使用情况（适用于检查小文件过多导致空间占满的问题）  
   ◦ `df -T`：显示文件系统类型（如ext4、xfs）  
   • **示例**：  
   ```bash
   $ df -h
   Filesystem      Size  Used Avail Use% Mounted on
   /dev/sda1        50G   40G   10G  80% /
   ```

2. **`du` 命令**  
   • **功能**：统计目录或文件的具体磁盘占用  
   • **常用选项**：  
   ◦ `du -sh <目录>`：汇总显示目录总大小（如 `du -sh /home`）  
   ◦ `du -h --max-depth=1`：显示当前目录下一级子目录的大小  
   ◦ `du -ah | sort -rh | head -n 10`：列出当前目录下最大的前10个文件  
   • **示例**：  
   ```bash
   $ du -sh /var/log
   2.5G    /var/log
   ```

---

### **进阶工具**
3. **`lsblk` 命令**  
   • **功能**：显示块设备信息（如硬盘、分区及挂载点）  
   • **常用选项**：  
   ◦ `lsblk`：列出所有块设备的树状结构（包含设备名称、大小、类型）  
   ◦ `lsblk -f`：显示文件系统类型、UUID等详细信息  
   • **示例**：  
   ```bash
   $ lsblk
   NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
   sda      8:0    0   100G  0 disk
   ├─sda1   8:1    0    50G  0 part /
   └─sda2   8:2    0    50G  0 part /data
   ```

4. **`fdisk` 命令**  
   • **功能**：查看磁盘分区表及详细信息  
   • **常用命令**：  
   ◦ `sudo fdisk -l`：列出所有磁盘的分区信息（需root权限）  
   • **示例**：  
   ```bash
   $ sudo fdisk -l
   Disk /dev/sda: 100 GiB, 107374182400 bytes
   ```

5. **`lsof` 命令**  
   • **功能**：查找被删除但仍被进程占用的文件（释放隐藏空间）  
   • **示例**：  
   ```bash
   $ lsof | grep deleted
   java    1234  user  1w   REG  8,1  5G  123456 /var/log/app.log (deleted)
   ```  
   ◦ 重启相关进程后可释放占用的空间。

---

### **图形化工具**
6. **GNOME 磁盘工具**  
   • 适用于桌面环境，提供可视化界面查看磁盘信息、分区及健康状态。

---

### **场景化排查技巧**
• **快速定位大文件/目录**：  
  • 结合 `du` 和 `sort`：`du -ah / | sort -rh | head -n 20`。  
• **日志文件清理**：  
  • 检查 `/var/log` 目录，删除或压缩旧日志（如 `*.log`）。  
• **Docker 空间管理**：  
  • 使用 `docker system df` 查看镜像、容器及卷的占用。

---

### **总结**
• **常规监控**：优先使用 `df -h` 和 `du -sh`。  
• **深入分析**：结合 `lsblk` 查看设备结构，用 `find` 或 `lsof` 定位隐藏问题。  
• **定期清理**：重点关注 `/tmp`、`/var/log` 及用户主目录。

如需进一步优化磁盘空间，可参考清理缓存、卸载冗余软件包等方法。
