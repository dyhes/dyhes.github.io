---
title: 【CUDA】Programming Guide
date: 2025-06-13 00:00:00+0000
categories: 
- nutrition
tags:
- CUDA
---
## Introduction
In general, an application has a mix of parallel parts and sequential parts, so systems are designed with a mix of GPUs and CPUs in order to maximize overall performance. 
![](https://i.ibb.co/7xgqKH7d/image.png)

The challenge is to develop application software that transparently scales its parallelism to leverage the increasing number of processor cores.

At its core are three key abstractions — a hierarchy of **thread groups**, **shared memories**, and **barrier synchronization** — that are simply exposed to the programmer as a minimal set of language extensions.

Each block of threads can be scheduled on any of the available multiprocessors within a GPU, in any order, concurrently or sequentially, so that a compiled CUDA program can execute on any number of multiprocessors.
![](https://i.ibb.co/hxDXmRFY/image-2.png)

## Programming Model
### Kernel
CUDA C++ extends C++ by allowing the programmer to define C++ functions, called *kernels*, that, when called, are executed N times in parallel by N different *CUDA threads*, as opposed to only once like regular C++ functions.

A kernel is defined using the __global__ declaration specifier and the number of CUDA threads that execute that kernel for a given kernel call is specified using a new <<<...>>>*execution configuration* syntax (see [Execution Configuration](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#execution-configuration)). Each thread that executes the kernel is given a **unique *thread ID*** that is accessible within the kernel through built-in variables.

### Thread Hierarchy
For convenience, threadIdx is a **3-component vector**, so that threads can be identified using a one-dimensional, two-dimensional, or three-dimensional *thread index*, forming a one-dimensional, two-dimensional, or three-dimensional block of threads, called a *thread block*.

The index of a thread and its thread ID relate to each other in a straightforward way: For a one-dimensional block, they are the **same**; for a two-dimensional block of size *(Dx, Dy)*, the thread ID of a thread of index *(x, y)* is *(**x + y Dx**)*; for a three-dimensional block of size *(Dx, Dy, Dz)*, the thread ID of a thread of index *(x, y, z)* is *(**x + y Dx + z Dx Dy**)*.

There is a limit to the number of threads per block, since all threads of a block are expected to **reside** on the same streaming multiprocessor core and must **share** the limited memory resources of that core. On current GPUs, a thread block may contain **up to 1024** threads.

Blocks are organized into a one-dimensional, two-dimensional, or three-dimensional *grid* of thread blocks.
![](https://i.ibb.co/tpTsSt42/image-3.png)

The number of threads per block and the number of blocks per grid specified in the <<<...>>> syntax can be of type int or dim3.

Each block within the grid can be identified by a one-dimensional, two-dimensional, or three-dimensional unique index accessible within the kernel through the built-in blockIdx variable. The dimension of the thread block is accessible within the kernel through the built-in blockDim variable.

A thread block size of 16x16 (256 threads), although arbitrary in this case, is a common choice. 

Thread blocks are required to execute **independently**. It must be possible to execute blocks in any order, **in parallel or in series**. This independence requirement allows thread blocks to be scheduled in any order and across any number of cores.

Threads within a block can **cooperate** by sharing data through some *shared memory* and by synchronizing their execution to coordinate memory accesses. More precisely, one can specify synchronization points in the kernel by calling the **__syncthreads()** intrinsic function; __syncthreads() acts as a barrier at which all threads in the block must wait before any is allowed to proceed. [Shared Memory](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#shared-memory) gives an example of using shared memory. In addition to __syncthreads(), the [Cooperative Groups API](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#cooperative-groups) provides a rich set of thread-synchronization primitives.

With the introduction of NVIDIA [Compute Capability 9.0](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#compute-capability-9-0), the CUDA programming model introduces an **optional** level of hierarchy called Thread Block Clusters that are made up of thread blocks. Similar to how threads in a thread block are guaranteed to be co-scheduled on a streaming multiprocessor, thread blocks in a cluster are also guaranteed to be co-scheduled on a GPU Processing Cluster (GPC) in the GPU.

Similar to thread blocks, clusters are also organized into a one-dimension, two-dimension, or three-dimension grid of thread block clusters. The number of thread blocks in a cluster can be user-defined, and **a maximum of 8 thread blocks** in a cluster is supported as a portable cluster size in CUDA. Note that on GPU hardware or MIG configurations which are too small to support 8 multiprocessors the maximum cluster size will be reduced accordingly. Identification of these smaller configurations, as well as of larger configurations supporting a thread block cluster size beyond 8, is **architecture-specific** and can be queried using the **`cudaOccupancyMaxPotentialClusterSize`** API.
![](https://i.ibb.co/G3HT4zGK/image-4.png)

> In a kernel launched using cluster support, the gridDim variable still denotes the size in terms of number of thread blocks, for **compatibility** purposes. The rank of a block in a cluster can be found using the [Cluster Group](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#cluster-group-cg) API.

A thread block cluster can be enabled in a kernel either using a **compile-time** kernel attribute using __cluster_dims__(X,Y,Z) or using the CUDA kernel launch API `cudaLaunchKernelEx`. 
```cpp
// Kernel definition
// Compile time cluster size 2 in X-dimension and 1 in Y and Z dimension
__global__ void __cluster_dims__(2, 1, 1) cluster_kernel(float *input, float* output)
{

}

int main()
{
    float *input, *output;
    // Kernel invocation with compile time cluster size
    dim3 threadsPerBlock(16, 16);
    dim3 numBlocks(N / threadsPerBlock.x, N / threadsPerBlock.y);

    // The grid dimension is not affected by cluster launch, and is still enumerated
    // using number of blocks.
    // The grid dimension must be a multiple of cluster size.
    cluster_kernel<<<numBlocks, threadsPerBlock>>>(input, output);
}
```
or
```cpp
// Kernel definition
// No compile time attribute attached to the kernel
__global__ void cluster_kernel(float *input, float* output)
{

}

int main()
{
    float *input, *output;
    dim3 threadsPerBlock(16, 16);
    dim3 numBlocks(N / threadsPerBlock.x, N / threadsPerBlock.y);

    // Kernel invocation with runtime cluster size
    {
        cudaLaunchConfig_t config = {0};
        // The grid dimension is not affected by cluster launch, and is still enumerated
        // using number of blocks.
        // The grid dimension should be a multiple of cluster size.
        config.gridDim = numBlocks;
        config.blockDim = threadsPerBlock;

        cudaLaunchAttribute attribute[1];
        attribute[0].id = cudaLaunchAttributeClusterDimension;
        attribute[0].val.clusterDim.x = 2; // Cluster size in X-dimension
        attribute[0].val.clusterDim.y = 1;
        attribute[0].val.clusterDim.z = 1;
        config.attrs = attribute;
        config.numAttrs = 1;

        cudaLaunchKernelEx(&config, cluster_kernel, input, output);
    }
}
```

In GPUs with compute capability **9.0**, all the thread blocks in the cluster are guaranteed to be co-scheduled on a single **GPU Processing Cluster (GPC)** and allow thread blocks in the cluster to perform **hardware-supported synchronization** using the [Cluster Group](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#cluster-group-cg) API `cluster.sync()`. Cluster group also provides member functions to query cluster group size in terms of number of threads or number of blocks using `num_threads()` and `num_blocks()` API respectively. The rank of a thread or block in the cluster group can be queried using `dim_threads()` and `dim_blocks()` API respectively.
Thread blocks that belong to a cluster have access to the **Distributed Shared Memory**. Thread blocks in a cluster have the ability to read, write, and perform atomics to any address in the distributed shared memory.

### Memory Hierarchy
![](https://i.ibb.co/qMRxr4DF/image-5.png)

There are also two additional read-only memory spaces accessible by all threads: the constant and texture memory spaces. The global, constant, and texture memory spaces are **optimized for different memory usages**.

### Heterogeneous Programming
The CUDA programming model also assumes that both the host and the device maintain their **own** separate memory spaces in DRAM, referred to as *host memory* and *device memory*, respectively. Therefore, a program manages the global, constant, and texture memory spaces visible to kernels through calls to the CUDA runtime (described in [Programming Interface](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#programming-interface)). This includes device memory **allocation** and **deallocation** as well as data **transfer** between host and device memory.

Unified Memory provides *managed memory* to **bridge** the host and device memory spaces. Managed memory is accessible from all CPUs and GPUs in the system as a single, coherent memory image with a common address space. This capability enables **oversubscription** of device memory and can greatly simplify the task of porting applications by eliminating the need to explicitly mirror data on host and device.

### Asynchronous SIMT Programming Model
In the CUDA programming model a thread is the lowest level of abstraction for doing a computation or a memory operation. Starting with devices based on the **NVIDIA Ampere GPU Architecture**, the CUDA programming model provides acceleration to memory operations via the asynchronous programming model. The asynchronous programming model defines the behavior of asynchronous operations with respect to CUDA threads.
The asynchronous programming model defines the behavior of [Asynchronous Barrier](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#aw-barrier) for synchronization between CUDA threads. The model also explains and defines how [cuda::memcpy_async](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#asynchronous-data-copies) can be used to move data asynchronously from global memory while computing in the GPU.

An asynchronous operation is defined as an operation that is **initiated by a** CUDA thread and is **executed asynchronously as-if by another** thread. In a well formed program one or more CUDA threads synchronize with the **asynchronous operation**. The CUDA thread that initiated the asynchronous operation is not required to be among the synchronizing threads.
> 发起异步操作的CUDA线程无需参与该操作的同步等待过程，其他线程可以代替它完成同步

Such an asynchronous thread (an as-if thread) is always associated with the CUDA thread that initiated the asynchronous operation. An asynchronous operation uses a synchronization object to synchronize the completion of the operation. Such a synchronization object can be explicitly managed by a user (e.g., cuda::memcpy_async) or implicitly managed within a library (e.g., cooperative_groups::memcpy_async).

A synchronization object could be a cuda::barrier or a cuda::pipeline. These objects are explained in detail in [Asynchronous Barrier](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#aw-barrier) and [Asynchronous Data Copies using cuda::pipeline](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#asynchronous-data-copies). 

These synchronization objects can be used at **different thread scopes**. A scope defines the set of threads that may use the synchronization object to synchronize with the asynchronous operation. The following table defines the thread scopes available in CUDA C++ and the threads that can be synchronized with each.
| **Thread Scope** | **Description** |
|---|---|
| cuda::thread_scope::thread_scope_thread | Only the CUDA thread which initiated asynchronous operations synchronizes. |
| cuda::thread_scope::thread_scope_block | All or any CUDA threads within the same thread block as the initiating thread synchronizes. |
| cuda::thread_scope::thread_scope_device | All or any CUDA threads in the same GPU device as the initiating thread synchronizes. |
| cuda::thread_scope::thread_scope_system | All or any CUDA or CPU threads in the same system as the initiating thread synchronizes. |
These thread scopes are implemented as extensions to standard C++ in the [CUDA Standard C++](https://nvidia.github.io/libcudacxx/extended_api/memory_model.html#thread-scopes) library.

## Programming Interface
CUDA C++ provides a simple path for users familiar with the C++ programming language to easily write programs for execution by the device.
It consists of a **minimal set of extensions** to the C++ language and a **runtime** library.

Any source file that contains some of these extensions must be compiled with `nvcc`.

The runtime provides C and C++ functions that execute on the host to allocate and deallocate device memory, transfer data between host memory and device memory, manage systems with multiple devices, etc. 

The runtime is built on top of **a lower-level C API, the CUDA driver API**, which is also accessible by the application. The driver API provides an additional level of control by exposing lower-level concepts such as **CUDA contexts** - the analogue of host processes for the device - and **CUDA modules** - the analogue of dynamically loaded libraries for the device. Most applications do not use the driver API as they do not need this **additional** level of control and when using the runtime, context and module management are **implicit**, resulting in more concise code. As the runtime is interoperable with the driver API, most applications that need some driver API features can default to use the runtime API and only use the driver API where **needed**.

### NVCC
Kernels can be written using the CUDA instruction set architecture, called ***PTX***, which is described in the PTX reference manual. It is however usually **more effective** to use a high-level programming language such as C++. In both cases, kernels must be compiled into binary code by nvcc to execute on the device.
nvcc is a compiler driver that simplifies the process of compiling *C++* or *PTX* code: It provides simple and familiar command line options and executes them by invoking the collection of tools that implement the different compilation stages. 

Only a subset of C++ is fully supported for the device code.
> CUDA设备代码（device code）仅支持部分C++语法，这是由GPU硬件架构、执行模型和编译器设计的本质差异决定的。
#### Offline Compilation
 	Source files compiled with nvcc can include a mix of host code (i.e., code that executes on the host) and device code (i.e., code that executes on the device). nvcc’s basic workflow consists in **separating** device code from host code and then:
* compiling the device code into an **assembly form** (*PTX* code) and/or **binary form** (*cubin* object),
* and modifying the host code by **replacing** the <<<...>>> syntax introduced in [Kernels](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#kernels) (and described in more details in [Execution Configuration](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#execution-configuration)) by the necessary CUDA runtime function calls to load and launch each compiled kernel **from** the *PTX* code and/or *cubin* object.
The modified host code is output either as C++ code that is left to be compiled using another tool or as object code directly by letting nvcc invoke the host compiler during the last compilation stage.
Applications can then:
* Either link to the compiled host code (this is the most common case),
* Or **ignore** the modified host code (if any) and use the CUDA driver API (see [Driver API](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#driver-api)) to load and execute the *PTX* code or *cubin* object.


#### Just-in-Time Compilation
Any *PTX* code loaded by an application at runtime is **compiled further to binary code** by the device driver. This is called *just-in-time compilation*. Just-in-time compilation increases application load time, but allows the application to **benefit** from any new compiler improvements coming with each new device driver. It is also the only way for applications to run on devices that **did not exist** at the time the application was compiled.

As an alternative to using `nvcc` to compile CUDA C++ device code, **NVRTC** can be used to compile CUDA C++ device code to PTX at runtime.

#### Compatibility
Binary code is **architecture-specific.** A *cubin* object is generated using the compiler option `-code` that specifies the targeted architecture: For example, compiling with `-code=sm_80` produces binary code for devices of [compute capability](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#compute-capability) 8.0. Binary compatibility is guaranteed from one minor revision to the next one, but not from one minor revision to the previous one or across major revisions. In other words, a *cubin* object generated for compute capability *X.y* will only execute on devices of compute capability *X.z* where *z≥y*.

Some *PTX* instructions are **only supported on devices of higher compute capabilities**. For example, [Warp Shuffle Functions](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#warp-shuffle-functions) are only supported on devices of compute capability 5.0 and above. The `-arch` compiler option **specifies the compute capability that is assumed when compiling C++ to *PTX* code**. So, code that contains warp shuffle, for example, must be compiled with -arch=compute_50 (or higher).
*PTX* code produced for some specific compute capability can always be compiled to binary code of **greater or equal** compute capability. Note that a binary compiled from an earlier PTX version **may not** make use of some hardware features. For example, a binary targeting devices of compute capability 7.0 (Volta) compiled from PTX generated for compute capability 6.0 (Pascal) will not make use of Tensor Core instructions, since these were not available on Pascal. As a result, the final binary may **perform worse** than would be possible if the binary were generated using the latest version of PTX.
*PTX* code compiled to target [Architecture-Specific Features](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#architecture-specific-features) only runs on **the exact same** physical architecture and nowhere else. Architecture-specific *PTX* code is not forward and backward compatible. Example code compiled with sm_90a or compute_90a only runs on devices with compute capability 9.0 and is not backward or forward compatible.
*PTX* code compiled to target [Family-Specific Features](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#family-specific-features) only runs on the exact same physical architecture and other architectures in the same family. Family-specific *PTX* code is **forward** compatible with other devices in the same family, and is not backward compatible. Example code compiled with sm_100f or compute_100f only runs on devices with compute capability 10.0 and 10.3.

Which *PTX* and binary code gets embedded in a CUDA C++ application is controlled by the -arch and -code compiler options or the -gencode compiler option.

```bash
nvcc x.cu -gencode arch=compute_50,code=sm_50
```

Applications using the driver API **must** compile code to separate files and explicitly load and execute the most appropriate file at runtime.

### Runtime
The runtime is implemented in the cudart library, which is linked to the application, either **statically** via `cudart.lib` or `libcudart.a`, or dynamically via `cudart.dll` or `libcudart.so`. Applications that require cudart.dll and/or cudart.so for dynamic linking typically include them as part of the application installation package. It is only safe to pass the address of CUDA runtime symbols between components that link to the same instance of the CUDA runtime.
> cudart.lib 和 libcudart.a 都是 **CUDA Runtime 库的静态链接版本**，核心区别在于 **操作系统平台和编译工具链的兼容性**。
> **cudart.lib** / **cudart.dll**: windows 
> **libcudart.a** / cudart.so : Linux / macos

All its entry points are **prefixed with cuda**.

#### Initialization
CUDA 12.0
* **核心变化** 
  * **cudaInitDevice() 与 cudaSetDevice() **在CUDA 12.0中成为**显式初始化入口**。调用二者之一会立即：✅ 初始化CUDA运行时库✅ 创建指定设备的Primary Context（主上下文）
  * **未调用时的默认行为** ：运行时自动选择device 0，并在首次需要时隐式初始化（如调用cudaMalloc或内核启动）
* **工程意义** 
  * **性能分析** ：显式初始化将耗时集中在可控阶段，避免首次API调用的延迟干扰计时。
  * **错误处理** ：必须检查cudaSetDevice()的返回值（如cudaError_t），因其可能返回设备初始化错误（如cudaErrorInvalidDevice）
历史行为（CUDA 11.x及更早）
* **cudaSetDevice()的局限性 **：仅设置当前设备，** 不触发运行时初始化**。运行时需通过其他API调用被动初始化。
* **cudaFree(0)的妙用 **：开发者调用此"空操作"函数（释放空指针）作为**显式初始化触发器**，目的包括：✅ 隔离初始化耗时（方便性能分析）✅ 提前捕获初始化错误（避免首次业务API调用失败）
```cpp
cudaSetDevice(0);        // 设置设备（不初始化运行时）
cudaFree(0);             // 强制初始化运行时并检查错误
cudaError_t err = cudaGetLastError();  // 验证初始化状态
```

The runtime creates a CUDA context for each device in the system (see [Context](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#context) for more details on CUDA contexts). This context is the **primary context** for this device and is initialized at **the first runtime** function which requires an active context on this device. It is **shared among all the host threads** of the application. As part of this context creation, the device code is just-in-time compiled if necessary (see [Just-in-Time Compilation](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#just-in-time-compilation)) and loaded into device memory. This all happens transparently.


#### Device Memory
Device memory can be allocated either as ***linear memory*** or as ***CUDA arrays***.
CUDA arrays are opaque memory layouts optimized for texture fetching. They are described in [Texture and Surface Memory](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#texture-and-surface-memory).
> * **不透明内存布局（Opaque Memory Layout）** ：CUDA数组的物理存储结构对开发者完全隐藏，无法通过指针直接访问内部数据。其布局由GPU驱动动态优化，专为**纹理拾取（Texture Fetching）** 场景设计。
> * **纹理/表面内存优化** ：数据以适合纹理缓存的格式存储，支持硬件加速的**坐标寻址、滤波（如双线性插值）和边界处理** （钳位/循环模式）。
> * **多维数据结构** ：天然支持**一维、二维或三维**数据（如图像、体渲染数据），无需手动计算内存步长（Pitch）。

Linear memory is allocated in a single unified address space, which means that separately allocated entities can reference one another via pointers, for example, in a binary tree or linked list. 
> 支持任意数据结构，但**多维数据需对齐** （用cudaMallocPitch/cudaMalloc3D避免Bank Conflict）
Linear memory is typically allocated using `cudaMalloc()` and freed using `cudaFree()` and data transfer between host memory and device memory are typically done using `cudaMemcpy()`.

Linear memory can also be allocated through `cudaMallocPitch()` and `cudaMalloc3D()`. These functions are recommended for allocations of 2D or 3D arrays as it makes sure that the allocation is **appropriately padded** to meet the alignment requirements described in [Device Memory Accesses](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#device-memory-accesses), therefore **ensuring best performance** when accessing the row addresses or performing copies between 2D arrays and other regions of device memory (using the `cudaMemcpy2D()` and `cudaMemcpy3D()` functions). The returned pitch (or stride) must be used to access array elements. 

```cpp
// Host code
int width = 64, height = 64;
float* devPtr;
size_t pitch;
cudaMallocPitch(&devPtr, &pitch,
                width * sizeof(float), height);
MyKernel<<<100, 512>>>(devPtr, pitch, width, height);

// Device code
__global__ void MyKernel(float* devPtr,
                         size_t pitch, int width, int height)
{
    for (int r = 0; r < height; ++r) {
        float* row = (float*)((char*)devPtr + r * pitch);
        for (int c = 0; c < width; ++c) {
            float element = row[c];
        }
    }
}
```

> Pitch: **每行实际分配的字节数**

#### Shared Memory
![](https://i.ibb.co/jNV47KT/image-6.png)
Thread Block 中的每个 Thread 合力进行数据加载，一次加载一块
```cpp
// Matrices are stored in row-major order:
// M(row, col) = *(M.elements + row * M.stride + col)
typedef struct {
    int width;
    int height;
    int stride;
    float* elements;
} Matrix;
// Get a matrix element
__device__ float GetElement(const Matrix A, int row, int col)
{
    return A.elements[row * A.stride + col];
}
// Set a matrix element
__device__ void SetElement(Matrix A, int row, int col,
                           float value)
{
    A.elements[row * A.stride + col] = value;
}
// Get the BLOCK_SIZExBLOCK_SIZE sub-matrix Asub of A that is
// located col sub-matrices to the right and row sub-matrices down
// from the upper-left corner of A
 __device__ Matrix GetSubMatrix(Matrix A, int row, int col)
{
    Matrix Asub;
    Asub.width    = BLOCK_SIZE;
    Asub.height   = BLOCK_SIZE;
    Asub.stride   = A.stride;
    Asub.elements = &A.elements[A.stride * BLOCK_SIZE * row
                                         + BLOCK_SIZE * col];
    return Asub;
}
// Thread block size
#define BLOCK_SIZE 16
// Forward declaration of the matrix multiplication kernel
__global__ void MatMulKernel(const Matrix, const Matrix, Matrix);
// Matrix multiplication - Host code
// Matrix dimensions are assumed to be multiples of BLOCK_SIZE
void MatMul(const Matrix A, const Matrix B, Matrix C)
{
    // Load A and B to device memory
    Matrix d_A;
    d_A.width = d_A.stride = A.width; d_A.height = A.height;
    size_t size = A.width * A.height * sizeof(float);
    cudaMalloc(&d_A.elements, size);
    cudaMemcpy(d_A.elements, A.elements, size,
               cudaMemcpyHostToDevice);
    Matrix d_B;
    d_B.width = d_B.stride = B.width; d_B.height = B.height;
    size = B.width * B.height * sizeof(float);
    cudaMalloc(&d_B.elements, size);
    cudaMemcpy(d_B.elements, B.elements, size,
    cudaMemcpyHostToDevice);
    // Allocate C in device memory
    Matrix d_C;
    d_C.width = d_C.stride = C.width; d_C.height = C.height;
    size = C.width * C.height * sizeof(float);
    cudaMalloc(&d_C.elements, size);
    // Invoke kernel
    dim3 dimBlock(BLOCK_SIZE, BLOCK_SIZE);
    dim3 dimGrid(B.width / dimBlock.x, A.height / dimBlock.y);
    MatMulKernel<<<dimGrid, dimBlock>>>(d_A, d_B, d_C);
    // Read C from device memory
    cudaMemcpy(C.elements, d_C.elements, size,
               cudaMemcpyDeviceToHost);
    // Free device memory
    cudaFree(d_A.elements);
    cudaFree(d_B.elements);
    cudaFree(d_C.elements);
}
// Matrix multiplication kernel called by MatMul()
 __global__ void MatMulKernel(Matrix A, Matrix B, Matrix C)
{
    // Block row and column
    int blockRow = blockIdx.y;
    int blockCol = blockIdx.x;
    // Each thread block computes one sub-matrix Csub of C
    Matrix Csub = GetSubMatrix(C, blockRow, blockCol);
    // Each thread computes one element of Csub
    // by accumulating results into Cvalue
    float Cvalue = 0;
    // Thread row and column within Csub
    int row = threadIdx.y;
    int col = threadIdx.x;
    // Loop over all the sub-matrices of A and B that are
    // required to compute Csub
    // Multiply each pair of sub-matrices together
    // and accumulate the results
    for (int m = 0; m < (A.width / BLOCK_SIZE); ++m) {
        // Get sub-matrix Asub of A
        Matrix Asub = GetSubMatrix(A, blockRow, m);
        // Get sub-matrix Bsub of B
        Matrix Bsub = GetSubMatrix(B, m, blockCol);
        // Shared memory used to store Asub and Bsub respectively
        __shared__ float As[BLOCK_SIZE][BLOCK_SIZE];
        __shared__ float Bs[BLOCK_SIZE][BLOCK_SIZE];
        // Load Asub and Bsub from device memory to shared memory
        // Each thread loads one element of each sub-matrix
        As[row][col] = GetElement(Asub, row, col);
        Bs[row][col] = GetElement(Bsub, row, col);
        // Synchronize to make sure the sub-matrices are loaded
        // before starting the computation
        __syncthreads();
        // Multiply Asub and Bsub together
        for (int e = 0; e < BLOCK_SIZE; ++e)
            Cvalue += As[row][e] * Bs[e][col];
        // Synchronize to make sure that the preceding
        // computation is done before loading two new
        // sub-matrices of A and B in the next iteration
        __syncthreads();
    }
    // Write Csub to device memory
    // Each thread writes one element
    SetElement(Csub, row, col, Cvalue);
}
```

#### Distributed Shared Memory
Accessing data in distributed shared memory requires all the thread blocks to exist. A user can **guarantee** that all thread blocks have started executing using `cluster.sync()` from [Cluster Group](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#cluster-group-cg) API. The user also needs to ensure that all distributed shared memory operations happen **before the exit** of a thread block, e.g., if a remote thread block is trying to read a given thread block’s shared memory, user needs to ensure that the shared memory read by remote thread block is completed before it can exit.

#### Page-Locked Host Memory
Page-locked host memory（页锁定主机内存，也称为 “固定内存” 或 “ pinned memory”）是一种特殊的主机内存分配方式，在 CUDA 编程中具有重要性能优化作用。
* **普通内存（pageable memory）**：由操作系统动态管理，可被换出到虚拟内存，CPU 访问时需通过页表映射。
* **页锁定内存**：通过cudaHostAlloc或cudaHostRegister等 API 分配，其物理地址在内存中保持固定，**不会被操作系统换出**，且 CPU 和 GPU 可直接访问其物理地址。
页锁定内存绕过了操作系统的虚拟内存管理机制，直接映射到物理内存，避免了页面调度（page fault）的开销。

#### Memory Synchronization
As the GPU cannot know at the time of execution which writes have been guaranteed at the source level to be visible and which are visible only by chance timing, it must cast a conservatively wide net for in-flight memory operations.
This sometimes leads to interference: because the GPU is waiting on memory operations it is not required to at the source level, the fence/flush may take longer than necessary.

### Asynchronous Concurrent Execution

CUDA exposes the following operations as independent tasks that can operate concurrently with one another:
* Computation on the host;
* Computation on the device;
* Memory transfers from the host to the device;
* Memory transfers from the device to the host;
* Memory transfers within the memory of a given device;
* Memory transfers among devices.

The level of concurrency achieved between these operations will depend on the feature set and compute capability of the device

Using asynchronous calls, many device operations can be queued up together to be executed by the CUDA driver when appropriate device resources are available. This relieves the host thread of much of the responsibility to manage the device, leaving it free for other tasks.

Kernel launches are **synchronous** if hardware counters are collected via a **profiler** (Nsight, Visual Profiler) unless concurrent kernel profiling is enabled. Async memory copies might also be synchronous if they involve host memory that is **not page-locked**.

Concurrent host execution is facilitated through asynchronous library functions that **return control to the host thread before the device completes the requested task**. Using asynchronous calls, many device operations can be queued up together to be executed by the CUDA driver when appropriate device resources are available. 

Programmers can globally disable asynchronicity of kernel launches for all CUDA applications running on a system by setting the **CUDA_LAUNCH_BLOCKING** environment variable to 1. This feature is provided for **debugging purposes only** and should not be used as a way to make production software run reliably.

A kernel from one CUDA context cannot execute concurrently with a kernel from another CUDA context. The GPU may time slice to provide forward progress to each context. If a user wants to run kernels from multiple process simultaneously on the SM, one must **enable MPS**.
### Stream
Applications manage the concurrent operations described above through ***streams***. A stream is **a sequence of commands** (possibly issued by **different** host threads) that execute in order. Different streams, on the other hand, may execute their commands out of order with respect to one another or concurrently; this behavior is not guaranteed and should therefore not be relied upon for correctness (for example, inter-kernel communication is undefined). The commands issued on a stream may execute **when all the dependencies of the command are met**. The dependencies could be previously launched commands on **same** stream or dependencies from **other** streams. The successful completion of **synchronize** call guarantees that all the commands launched are completed.

#### default stream
Kernel launches and host device memory copies that **do not specify** any stream parameter, or equivalently that set the stream parameter to **zero**, are issued to the **default** stream. They are therefore executed in order.

For code that is compiled using the `--default-stream per-thread` compilation flag (or that defines the `CUDA_API_PER_THREAD_DEFAULT_STREAM` macro before including CUDA headers (cuda.h and cuda_runtime.h)), the default stream is a regular stream and each host thread has its own default stream.

For code that is compiled using the `—default-stream legacy` compilation flag, the default stream is a special stream called the ***NULL stream*** and each device has a single NULL stream used for all host threads. The NULL stream is special as it causes implicit synchronization.
For code that is compiled without specifying a `—default-stream compilation` flag, `—default-stream legacy` is assumed as the **default**.
#### explicit synchronization

There are various ways to explicitly synchronize streams with each other.
* **cudaDeviceSynchronize**() waits until all preceding commands in all streams of all host threads have completed.
* **cudaStreamSynchronize**()takes a stream as a parameter and waits until all preceding commands in the given stream have completed. It can be used to synchronize the host with a specific stream, allowing other streams to continue executing on the device.
* **cudaStreamWaitEvent**()takes a stream and an event as parameters (see [Events](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#events) for a description of events)and makes all the commands added to the given stream after the call to cudaStreamWaitEvent()delay their execution until the given event has completed.
* **cudaStreamQuery**()provides applications with a way to know if all preceding commands in a stream have completed.

#### implicit synchronization
Two operations from different streams cannot run concurrently if any CUDA operation on the **NULL stream is submitted in-between** them, **unless** the streams are **non-blocking streams** (created with the cudaStreamNonBlocking flag).
Applications should follow these guidelines to improve their potential for concurrent kernel execution:
* All independent operations should be issued before dependent operations,
* Synchronization of any kind should be delayed as long as possible.

1. 默认流（NULL流）的阻塞性
* **NULL流的特性** ：默认流（未显式指定流时使用的流）具有**隐式同步作用**。当主机向NULL流提交操作（如cudaMemcpy或核函数）时，它会强制等待**所有先前提交到任何流中的操作完成**，自身执行结束后又会阻塞后续其他流的操作。
* **并发中断原因** ：若在两个不同流的操作之间插入NULL流操作（例如：StreamA操作 → NULL流操作 → StreamB操作），则：
  * NULL流操作会等待StreamA操作完成才开始；
  * StreamB操作必须等待NULL流操作完成后才能启动。*结果*：StreamA和StreamB的操作被**强制串行化**，无法并发执行。
2. 非阻塞流的例外
* **创建方式** ：使用cudaStreamCreateWithFlags(&stream, cudaStreamNonBlocking)创建的流称为**非阻塞流** （Non-Blocking Stream）。
* **规避阻塞** ：非阻塞流**不与NULL流同步**，因此：
  * 即使NULL流操作插入在非阻塞流的操作之间（如NonBlockingStreamA操作 → NULL流操作 → NonBlockingStreamB操作），NonBlockingStreamA和NonBlockingStreamB的操作仍可**并发执行** 。
  * NULL流操作仅阻塞自身，不影响非阻塞流的独立性。
#### **Host Functions**
The runtime provides a way to insert a CPU function call at any point into a stream via **cudaLaunchHostFunc**(). The provided function is executed on the host once all commands issued to the stream before the callback have completed.
A host function enqueued into a stream must not make CUDA API calls (directly or indirectly), as it might end up waiting on itself if it makes such a call leading to a deadlock.

#### Priority
The relative priorities of streams can be specified at creation using cudaStreamCreateWithPriority(). The range of allowable priorities, ordered as [ greatest priority, least priority ] can be obtained using the cudaDeviceGetStreamPriorityRange() function.

These priorities serve as hints rather than guarantees.

#### Dependent Launch
The *Programmatic Dependent Launch* mechanism allows for a dependent *secondary* kernel to launch **before** the *primary* kernel it depends on in the same CUDA stream has finished executing. Available starting with devices of **compute capability 9.0**, this technique can provide performance benefits when the *secondary* kernel can complete **significant** work that does not depend on the results of the *primary* kernel.
```cpp
__global__ void primary_kernel() {
   // Initial work that should finish before starting secondary kernel

   // Trigger the secondary kernel
   cudaTriggerProgrammaticLaunchCompletion();

   // Work that can coincide with the secondary kernel
}

__global__ void secondary_kernel()
{
   // Independent work

   // Will block until all primary kernels the secondary kernel is dependent on have completed and flushed results to global memory
   cudaGridDependencySynchronize();

   // Dependent work
}

cudaLaunchAttribute attribute[1];
attribute[0].id = cudaLaunchAttributeProgrammaticStreamSerialization;
attribute[0].val.programmaticStreamSerializationAllowed = 1;
configSecondary.attrs = attribute;
configSecondary.numAttrs = 1;

primary_kernel<<<grid_dim, block_dim, 0, stream>>>();
cudaLaunchKernelEx(&configSecondary, secondary_kernel);
```

### Events
The runtime also provides a way to closely monitor the device’s progress, as well as perform accurate timing, by letting the application asynchronously record ***events*** at any point in the program, and query when these events are completed. An event has completed when all tasks - or optionally, all commands in a given stream - preceding the event have completed. Events in **stream zero** are completed after all preceding tasks and commands in **all streams** are completed.
```cpp
cudaEvent_t start, stop;
cudaEventCreate(&start);
cudaEventCreate(&stop);

cudaEventDestroy(start);
cudaEventDestroy(stop);
```

Timing
```cpp
cudaEventRecord(start, 0);
for (int i = 0; i < 2; ++i) {
    cudaMemcpyAsync(inputDev + i * size, inputHost + i * size,
                    size, cudaMemcpyHostToDevice, stream[i]);
    MyKernel<<<100, 512, 0, stream[i]>>>
               (outputDev + i * size, inputDev + i * size, size);
    cudaMemcpyAsync(outputHost + i * size, outputDev + i * size,
                    size, cudaMemcpyDeviceToHost, stream[i]);
}
cudaEventRecord(stop, 0);
cudaEventSynchronize(stop);
float elapsedTime;
cudaEventElapsedTime(&elapsedTime, start, stop);
```

### Error Checking
**All runtime functions return an error code**, but for an asynchronous function (see [Asynchronous Concurrent Execution](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#asynchronous-concurrent-execution)), this error code cannot possibly report any of the asynchronous errors that could occur on the device since the function returns before the device has completed the task; the error code only reports errors that occur on the host prior to executing the task, typically related to parameter validation; if an asynchronous error occurs, it will be reported by some subsequent unrelated runtime function call.
The only way to check for asynchronous errors just after some asynchronous function call is therefore to **synchronize just after the call** by calling cudaDeviceSynchronize() (or by using any other synchronization mechanisms described in [Asynchronous Concurrent Execution](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#asynchronous-concurrent-execution)) and checking the error code returned by cudaDeviceSynchronize().
The runtime maintains an error variable for each host thread that is initialized to cudaSuccess and is overwritten by the error code every time an error occurs (be it a parameter validation error or an asynchronous error). **cudaPeekAtLastError**() returns this variable. **cudaGetLastError**() returns this variable and **resets** it to cudaSuccess.
Kernel launches do not return any error code, so cudaPeekAtLastError() or cudaGetLastError() **must be called just after the kernel launch to retrieve any pre-launch errors**. To ensure that any error returned by cudaPeekAtLastError() or cudaGetLastError() does not originate from calls prior to the kernel launch, one has to make sure that the runtime error variable is set to cudaSuccess just before the kernel launch, for example, by calling cudaGetLastError() just before the kernel launch. Kernel launches are asynchronous, so to check for asynchronous errors, the application must **synchronize in-between** the kernel launch and the call to cudaPeekAtLastError() or cudaGetLastError().
Note that cudaErrorNotReady that may be returned by cudaStreamQuery() and cudaEventQuery() is not considered an error and is therefore not reported by cudaPeekAtLastError() or cudaGetLastError().
> **设计逻辑** ：cudaErrorNotReady 是正常状态（表示“进行中”），而非错误
### Compute Mode
On Tesla solutions running Windows Server 2008 and later or Linux, one can set any device in a system in one of the three following modes using **NVIDIA’s System Management Interface (nvidia-smi)**, which is a tool distributed as part of the driver:
* ***Default* compute mode**: Multiple host threads can use the device (by calling cudaSetDevice() on this device, when using the runtime API, or by making current a context associated to the device, when using the driver API) at the same time.
* ***Exclusive-process* compute mode**: Only one CUDA context may be created on the device across all processes in the system. The context may be current to as many threads as desired within the process that created that context.
* ***Prohibited* compute mode**: No CUDA context can be created on the device.

⠀This means, in particular, that a host thread using the runtime API without explicitly calling cudaSetDevice() might be associated with a device **other than device 0** if device 0 turns out to be in prohibited mode or in exclusive-process mode and used by another process. cudaSetValidDevices() can be used to set a device from a prioritized list of devices.
Note also that, for devices featuring the Pascal architecture onwards (compute capability with major revision number 6 and higher), there exists support for **Compute Preemption**. This allows compute tasks to be preempted at instruction-level granularity, rather than thread block granularity as in prior Maxwell and Kepler GPU architecture, with the benefit that applications with long-running kernels can be prevented from either monopolizing the system or timing out. However, there will be **context switch overheads** associated with Compute Preemption, which is **automatically enabled** on those devices for which support exists. The individual attribute query function cudaDeviceGetAttribute() with the attribute **cudaDevAttrComputePreemptionSupported** can be used to determine if the device in use supports Compute Preemption. Users wishing to avoid context switch overheads associated with different processes can ensure that only one process is active on the GPU by **selecting exclusive-process mode**.
Applications may query the compute mode of a device by checking the computeMode device property (see [Device Enumeration](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#device-enumeration)).

## Hardware Implementation
The NVIDIA GPU architecture is built around a **scalable** array of **multithreaded *Streaming Multiprocessors*** (*SMs*). When a CUDA program on the host CPU invokes a kernel grid, the blocks of the grid are enumerated and distributed to multiprocessors with available execution capacity. The threads of a thread block execute concurrently on one multiprocessor, and multiple thread blocks can execute concurrently on one multiprocessor. As thread blocks terminate, new blocks are launched on the vacated multiprocessors.

A multiprocessor is designed to execute hundreds of threads concurrently. To manage such a large number of threads, it employs a unique architecture called ***SIMT*** (*Single-Instruction, Multiple-Thread*) that is described in [SIMT Architecture](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#simt-architecture). The instructions are pipelined, leveraging instruction-level parallelism within a single thread, as well as extensive thread-level parallelism through simultaneous hardware multithreading as detailed in [Hardware Multithreading](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#hardware-multithreading). Unlike CPU cores, they are issued in order and there is no branch prediction or speculative execution.

The NVIDIA GPU architecture uses a **little-endian** representation.

### SIMT
The multiprocessor creates, manages, schedules, and executes threads in **groups of 32 parallel threads** called *warps*. Individual threads composing a warp start together at the same program address, but they have their own instruction address counter and register state and are therefore free to branch and execute independently. The term *warp* originates from **weaving**, the first parallel thread technology. A *half-warp* is either the first or second half of a warp. A *quarter-warp* is either the first, second, third, or fourth quarter of a warp.

When a multiprocessor is **given one or more thread blocks** to execute, it partitions them into warps and each warp gets scheduled by a ***warp scheduler*** for execution. The way a block is partitioned into warps is always the same; each warp contains threads of consecutive, increasing thread IDs with the first warp containing thread 0. [Thread Hierarchy](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#thread-hierarchy) describes how thread IDs relate to thread indices in the block.
A warp executes one common instruction at a time, so **full** efficiency is realized when all 32 threads of a warp **agree** on their execution path. If threads of a warp diverge via a data-dependent conditional branch, the warp **executes each** branch path taken, disabling threads that are not on that path. Branch divergence occurs only within a warp; different warps execute independently regardless of whether they are executing common or disjoint code paths.
The SIMT architecture is **akin** to SIMD (Single Instruction, Multiple Data) vector organizations in that a single instruction controls multiple processing elements. A key difference is that SIMD vector organizations expose the SIMD width to the software, whereas SIMT instructions specify the execution and branching behavior of a single thread. In contrast with SIMD vector machines, SIMT enables programmers to write **thread-level parallel** code for independent, scalar threads, as well as data-parallel code for coordinated threads. For the purposes of correctness, the programmer can essentially ignore the SIMT behavior; however, substantial performance improvements can be realized by taking care that the code seldom requires threads in a warp to diverge. In practice, this is analogous to the role of cache lines in traditional code: Cache line size can be safely ignored when designing for correctness but must be considered in the code structure when designing for peak performance. Vector architectures, on the other hand, require the software to coalesce loads into vectors and manage divergence manually.
**Prior to NVIDIA Volta, warps used a single program counter shared amongst all 32 threads in the warp together with an active mask specifying the active threads of the warp**. As a result, threads from the same warp in divergent regions or different states of execution cannot signal each other or exchange data, and algorithms requiring fine-grained sharing of data guarded by locks or mutexes can easily lead to deadlock, depending on which warp the contending threads come from.
Starting with the NVIDIA Volta architecture, ***Independent Thread Scheduling*** allows full concurrency between threads, regardless of warp. With Independent Thread Scheduling, the GPU maintains execution state per thread, including a program counter and call stack, and can yield execution at a per-thread granularity, either to make better use of execution resources or to allow one thread to wait for data to be produced by another. **A schedule optimizer determines how to group active threads from the same warp together into SIMT units**. This retains the high throughput of SIMT execution as in prior NVIDIA GPUs, but with much more flexibility: threads can now diverge and reconverge at sub-warp granularity.
Independent Thread Scheduling can lead to a rather different set of threads participating in the executed code than intended if the developer made assumptions about warp-synchronicity[2](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#fn2) of previous hardware architectures. In particular, any warp-synchronous code (such as synchronization-free, intra-warp reductions) should be **revisited** to ensure compatibility with NVIDIA Volta and beyond. See [Compute Capability 7.x](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#compute-capability-7-x) for further details.
> The threads of a warp that are participating in the current instruction are called the ***active*** threads, whereas threads not on the current instruction are *inactive* (disabled). Threads can be inactive for a variety of reasons including having exited earlier than other threads of their warp, having taken a different branch path than the branch path currently executed by the warp, or being the last threads of a block whose number of threads is not a multiple of the warp size.
> If a **non-atomic** instruction executed by a warp writes to the same location in global or shared memory for more than one of the threads of the warp, the number of serialized writes that occur to that location varies depending on the compute capability of the device (see [Compute Capability 5.x](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#compute-capability-5-x), [Compute Capability 6.x](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#compute-capability-6-x), and [Compute Capability 7.x](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#compute-capability-7-x)), and which thread performs the final write is undefined.
> If an [atomic](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#atomic-functions) instruction executed by a warp reads, modifies, and writes to the same location in global memory for more than one of the threads of the warp, each read/modify/write to that location occurs and they are all serialized, but the order in which they occur is undefined.

### Hardware Multithreading
The execution **context** (program counters, registers, and so on) for each warp processed by a multiprocessor is maintained on-chip during the entire lifetime of the warp. Therefore, switching from one execution context to another has **no** **cost**, and at every instruction issue time, a warp scheduler **selects** a warp that has threads ready to execute its next instruction (the [active threads](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#simt-architecture-notes) of the warp) and issues the instruction to those threads.
In particular, each multiprocessor has a set of 32-bit registers that are partitioned among the warps, and a *parallel data cache* or ***shared memory*** that is partitioned among the thread blocks.
The number of blocks and warps that can reside and be processed together on the multiprocessor for a given kernel depends on the amount of registers and shared memory used by the kernel and the amount of registers and shared memory available on the multiprocessor. There are also a **maximum number** of resident blocks and a maximum number of resident warps per multiprocessor. These limits as well the amount of registers and shared memory available on the multiprocessor are a function of the compute capability of the device and are given in [Compute Capabilities](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#compute-capabilities). If there are not enough registers or shared memory available per multiprocessor to process **at least one block**, the kernel will fail to launch.

## Cooperative Groups
Cooperative Groups is an extension to the CUDA programming model, introduced in **CUDA 9**, for organizing groups of communicating threads. Cooperative Groups allows developers to express the granularity at which threads are communicating, helping them to express richer, more efficient parallel decompositions.
Historically, the CUDA programming model has provided a single, simple construct for synchronizing cooperating threads: a barrier across all threads of a thread **block**, as implemented with the **__syncthreads()** intrinsic function. However, programmers would like to define and synchronize groups of threads at other granularities to enable greater performance, design flexibility, and software reuse in the form of “collective” group-wide function interfaces. In an effort to express broader patterns of parallel interaction, many performance-oriented programmers have resorted to writing their own ad hoc and unsafe primitives for synchronizing threads within a single warp, or across sets of thread blocks running on a single GPU. Whilst the performance improvements achieved have often been valuable, this has resulted in an ever-growing collection of brittle code that is expensive to write, tune, and maintain over time and across GPU generations. Cooperative Groups addresses this by providing a **safe** and **future-proof** mechanism to enable performant code.

header.h
```cpp
// Primary header is compatible with pre-C++11, collective algorithm headers require C++11
#include <cooperative_groups.h>
// Optionally include for memcpy_async() collective
#include <cooperative_groups/memcpy_async.h>
// Optionally include for reduce() collective
#include <cooperative_groups/reduce.h>
// Optionally include for inclusive_scan() and exclusive_scan() collectives
#include <cooperative_groups/scan.h>
```

namespace
```cpp
using namespace cooperative_groups;
// Alternatively use an alias to avoid polluting the namespace with collective algorithms
namespace cg = cooperative_groups;
```

### Group Type
#### Implicit Groups
Implicit groups represent the **launch configuration** of the kernel. Regardless of how your kernel is written, it always has a set number of threads, blocks and block dimensions, a single grid and grid dimensions. In addition, if the **multi-device cooperative launch API** is used, it can have multiple grids (single grid per device). These groups provide a starting point for decomposition into finer grained groups which are typically HW accelerated and are more specialized for the problem the developer is solving.
Although you can create an implicit group anywhere in the code, it is **dangerous** to do so. Creating a handle for an implicit group is a collective operation—**all** threads in the group must participate. If the group was created in a conditional branch that not all threads reach, this can lead to deadlocks or data corruption. For this reason, it is recommended that you create a handle for the implicit group **upfront** (as early as possible, before any branching has occurred) and use that handle throughout the kernel. Group handles must be initialized at declaration time (there is no default constructor) for the same reason and copy-constructing them is discouraged.

* Thread Block Group
Any CUDA programmer is already familiar with a certain group of threads: the thread block. The Cooperative Groups extension introduces a new datatype, **thread_block**, to explicitly represent this concept within the kernel.
```cpp
thread_block g = this_thread_block();
```

* Cluster Group
This group object represents all the threads launched in a single cluster. Refer to [Thread Block Clusters](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#thread-block-clusters). The APIs are available on all hardware with Compute **Capability 9.0+**. In such cases, when a non-cluster grid is launched, the APIs assume a **1x1x1** cluster.


* Grid Group
This group object represents all the threads launched in a single grid. APIs other than sync() are available at all times, but to be able to synchronize across the grid, you need to use the **cooperative launch API**.
```cpp
grid_group g = this_grid();
```

#### Explicit Groups
* Thread Block Tile
A templated version of a tiled group, where a **template parameter** is used to specify the size of the tile - with this known at compile time there is the potential for more optimal execution.

```cpp
__global__ void cooperative_kernel(...) {
    // obtain default "current thread block" group
    thread_block my_block = this_thread_block();

    // subdivide into 32-thread, tiled subgroups
    // Tiled subgroups evenly partition a parent group into
    // adjacent sets of threads - in this case each one warp in size
    auto my_tile = tiled_partition<32>(my_block);

    // This operation will be performed by only the
    // first 32-thread tile of each block
    if (my_tile.meta_group_rank() == 0) {
        // ...
        my_tile.sync();
    }
}
```
* Single Thread Group
```cpp
thread_block_tile<1> this_thread();
```
**memcpy_async** API uses a thread_group, to copy an int element from source to destination:
```cpp
#include <cooperative_groups.h>
#include <cooperative_groups/memcpy_async.h>

cooperative_groups::memcpy_async(cooperative_groups::this_thread(), dest, src, sizeof(int));
```

* Coalesced Groups
In CUDA’s SIMT architecture, at the hardware level the multiprocessor executes threads in groups of 32 called warps. If there exists a data-dependent conditional branch in the application code such that threads within a warp diverge, then the warp serially executes each branch disabling threads not on that path. **The threads that remain active on the path are referred to as coalesced**. Cooperative Groups has functionality to discover, and create, a group containing all coalesced threads.
Constructing the group handle via **coalesced_threads**() is opportunistic. It returns the set of active threads at that point in time, and makes no guarantee about which threads are returned (as long as they are active) or that they will stay coalesced throughout execution (they will be brought back together for the execution of a collective but can diverge again afterwards).
```cpp
coalesced_group active = coalesced_threads();
```

### Group Partitioning
```cpp
template <unsigned int Size, typename ParentT>
thread_block_tile<Size, ParentT> tiled_partition(const ParentT& g);

thread_group tiled_partition(const thread_group& parent, unsigned int tilesz);
```

The **tiled_partition** method is a collective operation that partitions the parent group into a one-dimensional, row-major, tiling of subgroups. A total of ((size(parent)/tilesz) subgroups will be created, therefore the parent group size **must be evenly divisible** by the Size. The allowed parent groups are thread_block or thread_block_tile.
The implementation may cause the calling thread to **wait** until all the members of the parent group have invoked the operation before resuming execution. Functionality is limited to native hardware sizes, 1/2/4/8/16/32 and the cg::size(parent) must be greater than the Size parameter. The templated version of tiled_partition supports 64/128/256/512 sizes as well, but some additional steps are required on Compute Capability 7.5 or lower.

```cpp
template <typename Label>
coalesced_group labeled_partition(const coalesced_group& g, Label label);

template <unsigned int Size, typename Label>
coalesced_group labeled_partition(const thread_block_tile<Size>& g, Label label);
```
**Label** can be any integral type.

```cpp
coalesced_group binary_partition(const coalesced_group& g, bool pred);

template <unsigned int Size>
coalesced_group binary_partition(const thread_block_tile<Size>& g, bool pred);
```

This is a specialized form of **labeled_partition**(), where the label can only be 0 or 1.

### Group Collectives
Cooperative Groups library provides a set of **collective operations** that can be performed by a group of threads. These operations require **participation of all threads** in the specified group in order to complete the operation. All threads in the group need to pass the **same** values for corresponding arguments to each collective call, unless different values are explicitly allowed in the argument description. Otherwise the behavior of the call is undefined.

#### memcpy_async
memcpy_async is a **group-wide** collective memcpy that utilizes hardware accelerated support for non-blocking memory transactions **from global to shared memory**. Given a set of threads named in the group, memcpy_async will move specified amount of bytes or elements of the input type through a single pipeline stage. Additionally for achieving best performance when using the memcpy_async API, **an alignment of 16 bytes** for both shared memory and global memory is required. It is important to note that while this is a memcpy in the general case, it is only asynchronous if the source is global memory and the destination is shared memory and both **can be addressed with 16, 8, or 4 byte alignments**. Asynchronously copied data should only be read following a call to wait or wait_prior which signals that the corresponding stage has completed moving data to shared memory.
Having to wait on all outstanding requests can lose some flexibility (but gain simplicity). In order to efficiently overlap data transfer and execution, its important to be able to kick off an **N+1**memcpy_async request while waiting on and operating on request **N**. To do so, use memcpy_async and wait on it using the collective stage-based wait_prior API. 

```cpp
/// This example streams elementsPerThreadBlock worth of data from global memory
/// into a limited sized shared memory (elementsInShared) block to operate on.
#include <cooperative_groups.h>
#include <cooperative_groups/memcpy_async.h>

namespace cg = cooperative_groups;

__global__ void kernel(int* global_data) {
    cg::thread_block tb = cg::this_thread_block();
    const size_t elementsPerThreadBlock = 16 * 1024;
    const size_t elementsInShared = 128;
    __shared__ int local_smem[elementsInShared];

    size_t copy_count;
    size_t index = 0;
    while (index < elementsPerThreadBlock) {
        cg::memcpy_async(tb, local_smem, elementsInShared, global_data + index, elementsPerThreadBlock - index);
        copy_count = min(elementsInShared, elementsPerThreadBlock - index);
        cg::wait(tb);
        // Work with local_smem
        index += copy_count;
    }
}
```

### Multi-Device
In order to enable synchronization across multiple devices with Cooperative Groups, use of the **cudaLaunchCooperativeKernelMultiDevice** CUDA API is required. This, a significant departure from existing CUDA APIs, will allow a single host thread to launch a kernel across multiple devices.

Deprecation Notice: **cudaLaunchCooperativeKernelMultiDevice** has been deprecated in CUDA 11.3 for all devices. Example of an alternative approach can be found in the multi device conjugate gradient sample.
Optimal performance in multi-device synchronization is achieved by enabling peer access via **cuCtxEnablePeerAccess** or **cudaDeviceEnablePeerAccess** for all participating devices.

## C++ Language Extensions
### Function Execution Space Specifier
#### \_\_global__
The \_\_global__ execution space specifier declares a function as **being a kernel**. Such a function is:
* Executed on the device,
* Callable from the host,
* Callable from the device for devices of compute capability 5.0 or higher 
A \_\_global__ function must have **void** return type, and cannot be a member of a class.
Any call to a \_\_global__ function must specify its **execution configuration** as described in [Execution Configuration](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#execution-configuration).
A call to a \_\_global__ function is **asynchronous**, meaning it returns before the device has completed its execution.
#### \_\_device__
The \_\_device__ execution space specifier declares a function that is:
* Executed on the device,
* Callable from the **device only**.
#### \_\_host__ 
⠀The \_\_host__ execution space specifier declares a function that is:
* Executed on the host,
* Callable from the **host only.**

It is equivalent to declare a function **with only** the \_\_host__ execution space specifier or to declare it **without** any of the \_\_host__, \_\_device__, or \_\_global__ execution space specifier; in either case the function is compiled for the host only.

The \_\_device__ and \_\_host__ execution space specifiers can be used together however, in which case the function is **compiled for both** the host and the device. The \_\_CUDA_ARCH__ macro introduced in [Application Compatibility](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#application-compatibility) can be used to differentiate code paths between host and device:
```cpp
__host__ __device__ func()
{
#if __CUDA_ARCH__ >= 800
   // Device code path for compute capability 8.x
#elif __CUDA_ARCH__ >= 700
   // Device code path for compute capability 7.x
#elif __CUDA_ARCH__ >= 600
   // Device code path for compute capability 6.x
#elif __CUDA_ARCH__ >= 500
   // Device code path for compute capability 5.x
#elif !defined(__CUDA_ARCH__)
   // Host code path
#endif
}
```

#### inline
The compiler inlines any \_\_device__ function when **deemed** appropriate.
* The \_\_noinline__ function qualifier can be used as a hint for the compiler **not to inline** the function if possible.
* The \_\_forceinline__ function qualifier can be used to **force** the compiler to inline the function.
* The \_\_inline_hint__ qualifier enables more **aggressive** inlining in the compiler. Unlike \_\_forceinline__, it does not imply that the function is inline. It can be used to improve inlining across modules when using LTO.
The \_\_noinline__ and \_\_forceinline__ function qualifiers cannot be used together, and neither function qualifier can be applied to an inline function.
Neither the \_\_noinline__ nor the \_\_forceinline__ function qualifier can be used with the \_\_inline_hint__ function qualifier.

### Variable Memory Space Specifier
#### \_\_device__
The \_\_device__ memory space specifier declares a variable that **resides on the device**.
At most one of \_\_constant__, \_\_managed__ and \_\_shared__ may be used together with \_\_device__ to further denote which memory space the variable belongs to. If none of them is present, the variable:
* Resides in **global** memory space,
* Has the lifetime of the CUDA context in which it is created,
* Has a distinct object per device,
* Is accessible from all the threads within the grid and from the host through the runtime library (cudaGetSymbolAddress() / cudaGetSymbolSize() / cudaMemcpyToSymbol() / cudaMemcpyFromSymbol()).
> GPU 上的线程可直接读写该变量；主机（CPU）需通过 CUDA Runtime API 间接访问

#### \_\_shared__
The \_\_shared__ memory space specifier, optionally used together with \_\_device__, declares a variable that:
* Resides in the shared memory space of a thread block,
* Has the lifetime of the block,
* Has a **distinct object per block**,
* Is only accessible from all the threads within the block,
* Does not have a **constant address**.

⠀When declaring a variable in shared memory as an external array such as
```cpp
extern __shared__ float shared[];
```
the size of the array is **determined at launch time** (see [Execution Configuration](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#execution-configuration)). All variables declared in this fashion, start at the same address in memory, so that the layout of the variables in the array must be **explicitly managed** through offsets.

### dim3
This type is an integer vector type based on **uint3** that is used to specify dimensions. When defining a variable of type dim3, any component left unspecified is **initialized to 1**.

### Built-in Variables
* gridDim(dim3)
* BlockDim(dim3)
* blockIdx(uint3)
* threadIdx(uint3)
* warpSize(int)