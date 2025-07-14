---
title: 【Kokkos】Compilation
date: 2025-03-18 00:00:00+0000
categories: 
- snow
---

cmake .. \
-DCMAKE_INSTALL_PREFIX=/home/bingxing2/home/scx6625/wbx/models/kokkos4.2/install/kokkos \
-DKokkos_ENABLE_CUDA=ON \
-DKokkos_ARCH_AMPERE80=ON \
-DCMAKE_CXX_COMPILER=/home/bingxing2/home/scx6625/wbx/models/kokkos4.2/kokkos-4.2.00/bin/nvcc_wrapper \
-DCMAKE_BUILD_TYPE=Release

cmake .. \
  -DCMAKE_INSTALL_PREFIX=/home/bingxing2/home/scx6625/wbx/models/kokkos4.2/install/kernel \
  -DKokkos_ENABLE_CUDA=ON \
  -DKokkos_ARCH_AMPERE80=ON \
  -DKokkos_ROOT=/home/bingxing2/home/scx6625/wbx/models/kokkos4.2/install/kokkos \
  -DCMAKE_CXX_COMPILER=/home/bingxing2/home/scx6625/wbx/models/kokkos4.2/kokkos-4.2.00/bin/nvcc_wrapper \
-DCMAKE_BUILD_TYPE=Release

## 下载源码
下载 kokkos 和 kokkos-kernels 的 releaze 版本源码
```bash
chmod 755 /home/bingxing2/home/scx6625/wbx/models/kokkos/kokkos/bin/nvcc_wrapper
```
## 编译 kokkos
```bash
mkdir build && cd build

cmake .. \
-DCMAKE_INSTALL_PREFIX=/home/bingxing2/home/scx6625/wbx/models/kokkos/ampere \
-DKokkos_ENABLE_CUDA=ON \
-DKokkos_ARCH_AMPERE80=ON \
-DCMAKE_CXX_STANDARD=17 \
-DCMAKE_CXX_COMPILER=/home/bingxing2/home/scx6625/wbx/models/kokkos/kokkos/bin/nvcc_wrapper \
-DCMAKE_BUILD_TYPE=Release

make -j8 && make install
```
## 编译 kokkos-kernels
```bash
mkdir build && cd build

cmake .. \
  -DCMAKE_INSTALL_PREFIX=/home/bingxing2/home/scx6625/wbx/models/kokkos/ampere-kernels \
  -DKokkosKernels_ENABLE_TPL_BLAS=OFF \
  -DKokkosKernels_ENABLE_TPL_LAPACKE=OFF \
  -DKokkos_ENABLE_CUDA=ON \
  -DKokkos_ARCH_AMPERE80=ON \
  -DKokkos_ROOT=/home/bingxing2/home/scx6625/wbx/models/kokkos/ampere \
  -DCMAKE_CXX_COMPILER=/home/bingxing2/home/scx6625/wbx/models/kokkos/kokkos/bin/nvcc_wrapper \
-DCMAKE_BUILD_TYPE=Release

make

make -j8 && make install
```
### 编写程序
Makefile
```makefile
# Example Makefile for compiling a Kokkos/KokkosKernels SpGEMM example

# Set these variables to the installation paths of Kokkos and KokkosKernels
KOKKOS_PATH=/home/LinHP/MProj/models/kokkos/volta
KOKKOS_KERNELS_PATH=/home/LinHP/MProj/models/kokkos/volta-kernels
CUDA_PATH=/usr/local/cuda

# Use the nvcc_wrapper provided by Kokkos (or your preferred compiler if not using CUDA)
NVCC_WRAPPER = /home/LinHP/MProj/models/kokkos/kokkos/bin/nvcc_wrapper
CXX = $(NVCC_WRAPPER)

# Compiler and linker flags
CXXFLAGS = -O3 -std=c++17 --extended-lambda
INCLUDES = -I$(KOKKOS_PATH)/include -I$(KOKKOS_KERNELS_PATH)/include -I${CUDA_PATH}/include
LDFLAGS = -L$(KOKKOS_PATH)/lib -L$(KOKKOS_KERNELS_PATH)/lib -L${CUDA_PATH}/lib64 
LIBS =  -lcudart -lcuda -lcusparse -lkokkoscore -lkokkossimd -lkokkoscontainers -lkokkoskernels

# Target name and source files
TARGET = kokkos
SRCS = sparse.cpp

all: $(TARGET)

$(TARGET): $(SRCS)
    $(CXX) $(CXXFLAGS) $(INCLUDES) $(SRCS) -o $(TARGET) $(LDFLAGS) $(LIBS)

clean:
    rm -f $(TARGET)
```