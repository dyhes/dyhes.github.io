---
title: 【Linux】CUDA 版本
date: 2025-03-31 00:00:00+0000
categories: 
- nutrition
tags:
- Linux
---

在Linux系统中查看CUDA版本，可以通过以下多种方法实现，每种方法适用于不同场景或安装配置：

---

## **使用 `nvcc` 编译器命令**
输入命令：
```bash
nvcc --version
```
输出示例：
```
nvcc: NVIDIA (R) Cuda compiler driver
...
Cuda compilation tools, release 11.2, V11.2.67
```
**说明**：`nvcc` 是CUDA的编译器驱动，直接显示当前使用的CUDA运行时（Runtime）版本。  
**注意**：需确保CUDA的`bin`目录已添加到系统环境变量`PATH`中。

---

## **查看版本文件 `version.txt`**
运行命令：
```bash
cat /usr/local/cuda/version.txt
```
输出示例：
```
CUDA Version 11.2.67
```
**说明**：CUDA默认安装路径为`/usr/local/cuda`，该文件直接记录版本号。若安装了多个CUDA版本，需检查具体子目录（如`/usr/local/cuda-11.2`）。

---

## **使用 `nvidia-smi` 工具**
输入命令：
```bash
nvidia-smi
```
输出示例：
```
+---------------------------------------------------------------------------------------+
| NVIDIA-SMI 560.70       Driver Version: 560.70       CUDA Version: 12.6               |
...
```
**说明**：此工具显示的是NVIDIA驱动支持的**最高CUDA版本**，而非实际安装的运行时版本。若需运行CUDA程序，需确保安装的运行时版本≤驱动支持的版本。

---

## **检查CUDA安装目录**
查看默认安装路径：
```bash
ls /usr/local/cuda*
```
若存在多个版本，会显示类似目录：
```
cuda-10.1  cuda-11.2  cuda-12.6
```
**说明**：通过目录名可直观查看已安装的CUDA版本，符号链接`/usr/local/cuda`指向当前默认版本。

---

## **通过环境变量 `CUDA_HOME`**
若配置了环境变量，可运行：
```bash
echo $CUDA_HOME
cat $CUDA_HOME/version.txt
```
**说明**：适用于自定义安装路径的场景，需确保环境变量已正确设置。

---

## **版本差异说明**
- **`nvidia-smi` vs `nvcc`**：前者显示驱动支持的版本，后者显示实际使用的运行时版本，两者可能不同（如驱动支持CUDA 12.6但实际安装CUDA 11.2）。
- **多版本管理**：可通过更新符号链接`/usr/local/cuda`或调整环境变量切换版本。

建议优先使用`nvcc --version`和`version.txt`确认实际安装版本，结合`nvidia-smi`验证驱动兼容性。