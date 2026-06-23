---
title: 【Java】IO
date: 2022-01-05 00:00:00+0000
categories: 
- nutrition
- temple
tags:
- Java
---


从文件中读取内容，向文件中写入内容，截短文件、合并文 件、压缩文件……，诸如此类的操作，称为**文件存取操作**， 主要使用“流（Stream）”来完成

与文件操作相关的类，集中于java.io包中。

Java 1.4中加入了一个New I/O API，提供了一些类完成文件和流操作。 

Java 7中又加入了一些新类型，称为NIO.2，NIO.2中最重要的是引入了**Path**和 **AutoCloseable**接口，还有一个**Files类**，它的静态方法封装了文件的常用操作。

## File类

 Java使用File类来统一操作文件和文件夹。

* java.io.File代表与平台无关的文件或目录。也就是说可以通过File类在Java程序中操作文件或目录；

- File类只能用来**操作**文件或目录（包括新建、删除、重命名文件和目录等操作），但**不能用来访问**文件中的内容；
- 如果需要访问文件中的内容，则需要使用输入/输出流。

`RandomAccessFile`（随机文件操作）：一个独立的类，直接继承至Object.它的功能丰富，可以从文件的任意位置进行存取（输入输出）操作。`RandomAccessFile`类支持“随机访问”方式，这里“随机”是指可以跳转到文件的任意位置处读写数据。 在访问一个文件的时候，不必把文件从头读到尾，而是希望像访问一个数据库一样“随心所欲”地访问一个文件的某个部分，这时使用类就是最佳选择。‎
`RandomAccessFile`对象类有个**位置指示器‎**‎，指向当前读写处的位置，当前读写n个字节后，文件指示器将指向这n个字节后面的下一个字节处。 刚打开文件时，文件指示器指向文件的开头处，可以移动文件指示器到新的位置，随后的读写操作将从新的位置开始。 类在数据等长记录格式文件的随机（相对顺序而言）读取时有很大的优势，但该类仅限于操作文件，不能访问其他的I/O设备，如网络、内存映像等。

## IO Stream

#### 分类

* 根据操作数据类型（*能用记事本打开并能看到其中的字符内容的是文本文件，反之是二进制文件*）
  * **字节流：二进制，以字节为单位**

    字节流的两个基类 InputStream和OutputStream

    凡是以InputStream或OutputStream结尾的类型为字节流

  * **字符流：文本,以字符（2个字节）为单位**

    字符流的两个基类 Reader和Writer

    凡是以Reader或Writer结尾的均为字符流

  * **区别**

    - 字节流没有缓冲区，是直接输出的，而字符流是输出到缓冲区的。因此在输出时，字节流不调用`colse()`方法时，信息已经输出了，而字符流只有在调用close()方法关闭缓冲区时，信息才输出。要想字符流在未关闭时输出信息，则需要手动调用flush()方法；
    - 读写单位不同：字节流以字节（`8bit`）为单位，字符流以字符为单位，根据码表映射字符，一次可能读多个字节；
    - 处理对象不同：字节流能处理所有类型的数据（如图片、`avi`等），而字符流只能处理字符类型的数据；

* **根据流向**

  * 输入流
  * 输出流

* **根据具体功能**

  * 节点流：以从或向一个特定的地方（节点）读写数据。

    1、文件： `FileInputStream` 、`FileOutputStream`、 `FileReader`和 `FileWriter` 文件进行处理的节点流； 　　

    2、字符串： `StringReader` 和`StringWriter` 对字符串进行处理的节点流； 　　

    3、数组： `ByteArrayInputStream`、`ByteArrayOutputStream`、`CharArrayReader`和`CharArrayWriter` 对数组进行处理的节点流(对应的不再是文件，而是内存中的一个数组)； 　　

    4、管道： `PipedInputStream` 、`PipedOutputStream` 和`PipedReaderPipedWriter`对管道进行处理的节点流； 　　

    5、基类： `InputStream`、 `OutputStream`、 `Reader`和 `Writer`；

  * 处理流：是对一个已存在的流的**连接和封装**，通过所封装的流的功能调用实现数据读写。处理流的构造方法总是要带一个其他的流对象做参数。一个流对象经过其他流的多次包装，称为流的链接。

    1、缓冲流：`BufferedInputStream`、 `BufferedOutputStream`、 `BufferedReader`和`BufferedWriter` 　增加缓冲功能，避免频繁读写硬盘。 　　

    2、转换流：`InputStreamReader`和 `OutputStreamReader`实现字节流和字符流之间的转换。 　　

    3、数据流 `DataInputStream`和`DataOutputStream`等提供将基础数据类型写入到文件中，或者读取出来。

<img src="https://pics2.baidu.com/feed/6159252dd42a28341e23dde5587a81ec17cebfa8.jpeg?token=201587ab58af94624ef1a60c83d1e396&s=C8611F7091BFE5CC1C5D95CB000030B2" alt="img" referrerpolicy="no-referrer">

![img](https://pic4.zhimg.com/80/v2-a001c51e37e77edf5a73dbba3bc80153_1440w.jpg)

#### 关闭流

**流关闭的原则**：先打开先关闭；如果A依赖B，则先关闭A再关闭B；对于处理流如果将节点流关闭以后再关闭处理流，会抛出IO异常，所以直接关闭处理流就行了，会自动调用关闭里面节点流的方法。

> **注意**：
>
> * 如果将节点流关闭以后再关闭处理流，会抛出IO异常
> * 如果关闭了处理流，在关闭与之相关的节点流，也可能出现IO异常。

#### InputStream

![img](https://pic1.zhimg.com/80/v2-d464303fd5be6fdb7b11678857824520_1440w.jpg)

`ByteArrayInputStream`：字节数组输入流，它的内部缓冲区就是一个字节数组，该类的功能就是从字节数组(`byte[]`)中进行以字节为单位的读取资源文件；

`PipedInputStream`：管道字节输入流，它和`PipedOutputStream`一起使用，能实现**多线程间的管道通信。**多线程管道通信的主要流程是在一个线程中向`PipedOutputStream`写入数据，这些数据会自动传送到对应的管道输入流`PipedInputStream`中，其他线程通过读取`PipeInputStream`中缓冲的数据实现多线程间通信；

`FilterInputStream` ：过滤输入流，装饰者模式中处于装饰者，具体的装饰者都要继承它，所以在该类的子类下都是用来装饰别的流的，也就是处理类。常见的子类有`DataInputStream`和`BufferedInputStream`；

`BufferedInputStream`：缓冲输入流，由于基础输入流一个字节一个字节读取,频繁与磁盘进行交互,造成读取速度较低.缓冲流的存在就是先将数据读取到缓冲流(内存中),然后一次性从内存中读取多个字符.提高读取的效率；

`DataInputStream`：数据输入流,以机器无关的方式读取Java的基本类型；

`FileInputSream`：文件输入流，它通常用于对文件进行读取操作；

`File`：对指定目录的文件进行操作。注意，该类虽然是在IO包下，但是并不继承自四大基础类；

`ObjectInputStream`：对象输入流，用来提供对“基本数据或对象”的持久存储。通俗点讲，也就是能直接传输对象（反序列化中使用）。

#### OutputStream

![img](https://pic4.zhimg.com/80/v2-e208c6f6b8021e0d2a3c519fcbecb6d7_1440w.jpg)

`ByteArrayOutputStream`：字节数组输出流，它的内部缓冲区就是一个字节数组，该类的功能就是从字节数组(`byte[]`)中进行以字节为单位的写入资源文件；

`PipedOutputStream` ：管道字节输出流，它和`PipedInputStream`一起使用，能实现**多线程间的管道通信。**

`FilterOutputStream` ：过滤输出流，装饰者模式中处于装饰者，具体的装饰者都要继承它，所以在该类的子类下都是用来装饰别的流的，也就是处理类。常见的子类有`DatOutputStream`、`BufferedOutputStream`和

`BufferedOutputStream`：缓冲输出流，由于基础输入流一个字节一个字节写入,频繁与磁盘进行交互,造成读取速度较低.缓冲流的存在就是先将数据写入到缓冲流(内存中),然后一次性从内存中写入多个字符.提高读取的效率；

`DataOutputStream`：数据输出流,以机器无关的方式读取Java的基本类型；

`PrintStream`：继承了`FilterOutputStream`。是"装饰类"的一种,所以属于字节流体系中(与`PrintStream`相似的流`PrintWriter`继承于`Writer`,属于字符流体系中),为其他的输出流添加功能.使它们能够方便打印各种数据值的表示形式；

`FileOutputStream` ：文件输出流，它通常用于对文件进行写入操作；

`ObjectOutputStream` ：对象输出流，用来提供对“基本数据或对象”的持久存储。通俗点讲，也就是能直接传输对象（反序列化中使用），和所有`FilterOutputStream` 的子类都是装饰流(序列化中使用)。

#### Reader

![img](https://pic1.zhimg.com/80/v2-0e823bac3cb2feab11a1d7db5b598dc4_1440w.jpg)

`CharArrayReader` :字符数组输入流。它和`ByteArrayInputStream`类似，只不过`ByteArrayInputStream`是字节数组输入流，而`CharArray`是字符数组输入流

`PipedReader`:管道字符流， 是从与其它线程共用的管道中读取数据。

`FilterReader`：过滤输入字符流， 是所有自定义具体装饰流的父类，为所有装饰类提供一个标准、只是简单重写了父类Reader的所有方法、要求子类必须重写核心方法、和提供具有自己特色的方法、这里没有像字节流那样有很多的子类来实现不同的功能、可能是因为字符流本来就是字节流的一种装饰、所以在这里没有必要再对其进行装饰、只是提供一个扩展的接口而已；

`BufferedReader`：缓冲字符流， 为了提高字符流读写的效率，引入了缓冲机制，进行字符批量的读写，提高了单个字符读写的效率；

`InputStreamReader`是一个连接字节流和字符流的桥梁，它将字节流转变为字符流；

`FileReader`：继承`InputStreamReader`，可以说是一个达到此功能、常用的工具类，在其源代码中明显使用了将`FileInputStream` 转变为`Reader` 的方法。我们可以从这个类中得到一定的技巧。`Reader` 中各个类的用途和使用方法基本和`InputStream` 中的类使用一致。后面会有`Reader` 与`InputStream` 的对应关系。

#### Writer

![img](https://pic1.zhimg.com/80/v2-e0bddfb105d00fe202435737684e8240_1440w.jpg)

`CharArrayWriter`、`StringWriter` 是两种基本的介质流，它们分别向`Char` 数组、`String` 中写入数据。

`PipedWriter` 是向与其它线程共用的管道中写入数据 `BufferedWriter` 是一个装饰器为`Writer` 提供缓冲功能。

`PrintWriter` 和`PrintStream` 极其类似，功能和使用也非常相似。

`OutputStreamWriter` 是`OutputStream` 到`Writer` 转换的桥梁，它的子类`FileWriter` 其实就是一个实现此功能的具体类。功能和使用和`OutputStream` 极其类似。

转换流

**4.1、定义**：字符和字节直接的转换，是字符流和字节流之间的桥梁，文本文件在硬盘中以字节流的形式存储时，通过`InputStreamReader`读取后转化为字符流给程序处理，即可对读取到的字节数据经过指定编码转换成字符；程序处理的字符流通过`OutputStreamWriter`转换为字节流保存，即可对读取到的字符数据经过指定编码转换成字节。

**4.2、何时使用转换流？**

①当字节和字符之间有转换动作时； ②流操作的数据需要编码或解码时。

**4.3、具体的对象体现：**

`InputStreamReader`:字节到字符的桥梁 `OutputStreamWriter`:字符到字节的桥梁 这两个流对象是字符体系中的成员，它们有转换作用，本身又是字符流，所以在构造的时候需要传入字节流对象进来，即：

`InputStreamReader(InputStream in`)：将字节流以字符流输入。

`OutputStreamWriter`(`OutStreamout`):将字节流以字符流输出。

#### `System.in` and `System.out`

**System.in**和**System.out**分别代表了系统标准的输入和输出设备
默认输入设备是：键盘，输出设备是：显示器
System.in的类型是InputStream
System.out的类型是PrintStream

#### 对象流

ObjectInputStream和OjbectOutputSteam用于存储和读取基本数据类型数据或对象的处理流。它的强大之处就是可以把Java中的对象写入到数据源中，也能把对象从数据源中还原回来。

* 序列化：用ObjectOutputStream类保存基本类型数据或对象的机制
* 反序列化：用ObjectInputStream类读取基本类型数据或对象的机制

ObjectOutputStream和ObjectInputStream不能序列化static和transient修饰的成员变量

#### 总结

`InputStream`类的功能不足被`Scanner`解决了

`OutputStream`类的功能不足被`PrintStream`解决了

`Reader`类功能不足被`BufferReader`解决了

`Writer`类的功能不足被`PrintWriter`解决了

输出数据用`printStream`，`printwriter`读取数据用`Scanner`其次是`bufferReader`

## NIO

java.nio全称java non-blocking IO，是指jdk1.4 及以上版本里提供的新api（New IO） ，为所有的原始类型（boolean类型除外）提供缓存支持的数据容器，使用它可以提供非阻塞式的高伸缩性网络。

