---
title: 【数字逻辑】笔记
date: 2023-06-06 00:00:00+0000
categories: 
  - star
---

#### 数字信号与模拟信号

- 模拟信号 Analog 连续
- 数字信号 Digital 离散

#### 逻辑电平

- 正逻辑：高1低0
- 负逻辑：高0低1

标准：**TTL**,**CMOS**

#### 时序图

将输入信号和输出信号的关系按照时间顺序排列得到的波形图

### 进制转换

整数连除，小数连乘（10-->N）

## 二进制符号表示

### 原码

最高位为符号位（0正1负）

大小以**绝对值**表示

### 反码

绝对值的原码表示每一位取反再加上符号位

### 补码

定义:
$$
(N)_{补n}=2^n-N
$$


与其小数位无关

求法：

- 原码补足n位后整体求反加一

  
  $$
  N_{补}=N_{反}+1
  $$

- 原码补足n位后**从右向左**第一个1往右不变，其余取反

### 符号数表示法

- 反码表示法：正数用**原码**表示，负数用**反码**表示
- 补码表示法：正数用**原码**表示，负数用**绝对值的补码**表示（便于运算）



## BCD码

Binary Coded Decimal

### 有权码（前五位自然）

- 8421码：自然码
- 5421码：第一位镜像自反，其余三位对应
- 2421码：镜像自反

### 无权码

- 余3码：8421码+3
- 余3循环码：第一位镜像自反，其余镜像相等,逻辑相邻

### 格雷(Gray)码

![image-20220302215938158](https://i.ibb.co/02vgH73/image-20220302215938158.png)

#### 格雷转二进制

$$
G_{n-1}=B_{n-1},B_{i}=G_{i} \oplus B_{i+1}
$$



#### 二进制转格雷

$$
G_{n-1}=B_{n-1},G_{i}=B_{i+1} \oplus B_{i}
$$

## 逻辑函数

### 相等

* 输入变量相同，任意一组变量取值结果相同
* 亦即真值表相同

### 反函数

输入相同，输出相反，成为互反（互补）

### 对偶式

* '*'与'+'互换
* 0与1互换

### 标准形式

* 与或（最小项之和）
* 或与（最大项之积）
* 与非-与非

![image-20220307235255629](https://i.ibb.co/CVmL9T4/image-20220307235255629.png)

* 或非-或非

![image-20220307235344512](https://i.ibb.co/n83vrdc/image-20220307235344512.png)

* 与或非

![image-20220307235419959](https://i.ibb.co/st692Jj/image-20220307235419959.png)

e.g.![image-20220307232938130](https://i.ibb.co/Vp4M1CP/image-20220307232938130.png)

## 基本定律

![image-20220307224145641](https://i.ibb.co/4KDYw3d/image-20220307224145641.png)

## 运算规则

### 代入规则

等式两边同一逻辑变量代以同样逻辑函数等式仍成立

![image-20220307225707305](https://i.ibb.co/sWG0bsZ/image-20220307225707305.png)

### 反演规则

* '*'与'+'互换
* 0与1互换
* 变量取反

得反函数

### 对偶规则

两个函数相等则其对偶式相等

## 基本定理

![image-20220307231710783](https://i.ibb.co/dWTXXLL/image-20220307231710783.png)

![image-20220307231719189](https://i.ibb.co/xfqKqhr/image-20220307231719189.png)

![image-20220307231729915](https://i.ibb.co/XYGPYxt/image-20220307231729915.png)

![image-20220307231739354](https://i.ibb.co/4P1XKxX/image-20220307231739354.png)

## 复合运算

* 与非，或非，与或非
* 异或

![image-20220307231946227](https://i.ibb.co/7K3WRnx/image-20220307231946227.png)

![image-20220307232339191](https://i.ibb.co/vCFGv9Y/image-20220307232339191.png)

* 同或

![image-20220307232418504](https://i.ibb.co/znnZ3Cg/image-20220307232418504.png)

![image-20220307232448191](https://i.ibb.co/yhF6CFj/image-20220307232448191.png)

## 最大项、最小项

最大（小）项：n个变量或其反变量仅出现一次之和（积），均为2^n个

![image-20220307233905218](https://i.ibb.co/W56Y1Sg/image-20220307233905218.png)

## 代数化简法

![image-20220307234921454](https://i.ibb.co/7k1qXv4/image-20220307234921454.png)

![image-20220307234937027](https://i.ibb.co/n130qMj/image-20220307234937027.png)

![image-20220307234951959](https://i.ibb.co/rw5vF7r/image-20220307234951959.png)

![image-20220307235100605](https://i.ibb.co/LZ8sbFZ/image-20220307235100605.png)

### 变换方法

![image-20220307235558902](https://i.ibb.co/0V2ZN21/image-20220307235558902.png)

## 卡诺图化简法

### 卡诺图

![image-20220307235858189](https://i.ibb.co/pvZ6psd/image-20220307235858189.png)

#### 特点

* n变量卡诺图有2^n个方格
* 大于4时无法用二维表示
* 形式不一

![image-20220308000409984](https://i.ibb.co/71TMFtm/image-20220308000409984.png)

#### 填法

* 真值表：按0，1填
* 与或：与项覆盖区域填1其余填0
* 或与：或项覆盖区域填0其余填1

#### 性质

* 均1则1
* 均0则0
* 取反得反
* （两图）相乘为（各小格）与
* 相加为或
* 异或为异或

### 最小覆盖原则

* 每个"1"**至少**被覆盖一次
* 圈尽量少亦即每个圈包含的"1"尽量多
* 每个圈至少包含一个独有的"1"小格

## 非完全描述逻辑函数

* 完全描述逻辑函数：输入变量的每一组取值都有确定的函数值（"0"或"1"）与之对应
* 非完全描述逻辑函数：有些取值组没有确定的函数值，可能有多种不同的最简形式

### 任意项（无关项）

![image-20220308103606583](https://i.ibb.co/jzFwGzV/image-20220308103606583.png)

### 代数法化简

根据需要舍弃（定义为"0"）或加进（定义为"1"）以使逻辑相邻的最小项个数最大化

## 逻辑函数描述方法

* 真值表
* 卡诺图
* 逻辑表达式
* 逻辑图
* 时序图

![image-20220308104342546](https://i.ibb.co/JmV5mky/image-20220308104342546.png)

## 门电路

### 二极管

单向导电性

钳位特性：导通时端电压可视为不变

### DDL“与门”

![image-20220322163536389](https://i.ibb.co/p1Bzwqn/image-20220322163536389.png)

### DDL“或门”

![image-20220322163825340](https://i.ibb.co/gPNsc8n/image-20220322163825340.png)

* 缺点：

  DDL与门，输入为0V时，输出低电位被钳位在0.3V 

  DDL或门，输入为3V时，输出高电位被钳位在3- 0.3=2.7V。

存在电压阈值损失，不能多级互联

## 三极管

![image-20220322164235227](https://i.ibb.co/df95RFW/image-20220322164235227.png)

## 组合逻辑电路

* 由逻辑门组成
* 内部无反馈环节
* 不具有"记忆"功能（输出仅由当前时刻的输入决定）

compared with 时序逻辑电路：有反馈环节，具有“记忆”功能，输出和之前的状态有关

组合电路是由逻辑门组成的多输入，多输出（或单输出）的逻辑电路

![image-20220322164947456](https://i.ibb.co/FsdfhG9/image-20220322164947456.png)

### 分析一般步骤

![image-20220320211254319](https://i.ibb.co/1bkxZ7M/image-20220320211254319.png)

* 写表达式
* 列真值表
* 分析功能

## 常用组合电路

### 半加器

![image-20220322170439899](https://i.ibb.co/LS3f8j8/image-20220322170439899.png)

### 全加器

![image-20220322171233373](https://i.ibb.co/DM8tr8w/image-20220322171233373.png)

#### 应用

* 四位全加器

![image-20220322171432383](https://i.ibb.co/sHZxF1D/image-20220322171432383.png)

* 减法器

![image-20220322171515134](https://i.ibb.co/HFZkRV2/image-20220322171515134.png)

### 数据选择器

又称为多路开关，多路转换器

![image-20220322173812807](https://i.ibb.co/Y2KsDVS/image-20220322173812807.png)

#### 自扩展

用多片某类选择器构成更大范围的选择器，如：

![image-20220322174110022](https://i.ibb.co/QFXBpJt/image-20220322174110022.png)

### 多路分配器

与数据选择器功能相反，将一个输入分别送到多个输出端

![image-20220322182215499](https://i.ibb.co/RQM5Wwq/image-20220322182215499.png)

### 编码器

编码：用**数码信号**表示**特定对象**

二进制编码：用多位二进制数形成一组二进制代码，并将代码赋予特定的含义

#### 8线-3线普通编码器

输入8个高低电平信号，输出三位二进制数

![image-20220322183001216](https://i.ibb.co/xXN0LDj/image-20220322183001216.png)

## 组合逻辑电路设计

### 用小规模电路(SSI)实现——各种逻辑门

实际逻辑问题=》真值表=》逻辑表达式=》逻辑化简=》逻辑电路图

#### 优先编码器

允许多个输入同时有效，按规定的优先级别进行编码



![image-20220322184012763](https://i.ibb.co/YWzbTXz/image-20220322184012763.png)



##### 典型优先编码器

![image-20220322184821751](https://i.ibb.co/Prp1gTG/image-20220322184821751.png)

##### 优先编码器扩展

![image-20220322185456554](https://i.ibb.co/T2VSHpc/image-20220322185456554.png)

#### 译码器

编码的逆过程，将代码“翻译为特定的对象，将一组二进制代码“翻译”为一组高低电平信号

* 通用译码器

  * 二进制译码器

    将n位二进制代码，译为特定含义的2^n个输出信号

    2线-4线，3线-8线，4线-16线

  * 二-十进制译码器

  * 代码转换器

* 显示译码器

##### 通用译码器

![image-20220322190432978](https://i.ibb.co/HHk4dPn/image-20220322190432978.png)

###### 74LS138

![image-20220322190735824](https://i.ibb.co/XLFpBM2/image-20220322190735824.png)

###### 4线-16线译码器（74LS138扩展）

![image-20220322190747010](https://i.ibb.co/C7MS9VK/image-20220322190747010.png)

###### 二-十进制译码器

![image-20220322193444313](https://i.ibb.co/TW7ySq4/image-20220322193444313.png)

##### 显示译码器

将4位二进制代码译为数码显示器所需的信号

###### 七段译码显示器

![image-20220322194500664](https://i.ibb.co/d4KzNrC/image-20220322194500664.png)

74LS47：输出低电平有效，用于共阳极数码管

74LS48：输出高电平有效，用于共阴极数码管

#### 数值比较器

比较两个相同位数的二进制数的大小，由F_A<B,F_A=B,F_A>B三个输出表示比较的结果

![image-20220322202859439](https://i.ibb.co/1f667H0/image-20220322202859439.png)

### 用中规模集成电路（MSI）实现——译码器，选择器

采用中规模器件（一般指**译码器、数据选择器和全加器**等）设计组合电路，应对逻辑函数进行变换，得到与指定器件相一致的表达式

* 用数据选择器设计

如果逻辑函数输入变量数与数据选择器控制端数量相同（如用8选1实现3变量函数），则输入变量与控制 变量一一相接，数据输入端接高、低电平。

![image-20220322212948907](https://i.ibb.co/L1BNm1h/image-20220322212948907.png)

如果逻辑函数输入变量数多于数据选择器控制端数 （如用4选1实现3变量函数），则需分离多余的变量。 未被分离的输入变量与控制变量相接，被分离变量 则与数据输入端相接

![image-20220322213505266](https://i.ibb.co/yBrVssf/image-20220322213505266.png)

一般情况下，一个n变量的逻辑函数可用（2 n）选1 或（2 n-1）选1数据选择器实现。 如果部分变量出现的频率更低的话，则通过一些门 电路可实现更多变量的逻辑函数。

![image-20220322212924666](https://i.ibb.co/b2bwK7D/image-20220322212924666.png)

* 译码器

对于最小项译码器来说，其输出是输入变量的所有 最小项。 由于所有逻辑函数都可转化成其最小项的和的形式， 因此任何逻辑函数都可采用译码器实现。 首先需要将表达式转换成**最小项的和的形式**。

3线-8线译码器可实现任何3变量的逻辑函数。

4线-16线译码器可实现任何4变量的逻辑函数

![image-20220322214850744](https://i.ibb.co/df93qHT/image-20220322214850744.png)

## 竞争和冒险

信号通过门传输需要时间，即实际的逻辑门存在传 输延迟时间。

![image-20220322215057098](https://i.ibb.co/Xy5XJfS/image-20220322215057098.png)

输入有竞争现象时，输出不一定都产生冒险。 冒险分为逻辑冒险和功能冒险两种

* 逻辑冒险

当多个输入信号中某一个发生变化时，由于此信号在电路中经过的途径不同，使到达电路某个门的多个 输入信号之间产生时间差，即存在由所有的逻辑部件 的延迟时间引起的竞争，称为“逻辑竞争”，由此产生的冒险为“逻辑冒险”。

![image-20220322215250237](https://i.ibb.co/Qpxr2Vz/image-20220322215250237.png)

* 功能冒险

在组合电路的输入端，当有几个变量变化时，由于 其变化的快慢不同，传递到某个门的输入端必然存在 时间差，这种现象叫作“功能竞争” 。 由此产生的冒险为“功能冒险”。

消除

1. 加滤波电容
2. 引入禁止脉冲

## 触发器

能够存储**1位二进制数字信号**的基本单元电路叫做 触发器。 触发器是构成各种复杂数字系统的基本逻辑单元。

![image-20220411161715659](https://i.ibb.co/M728RKP/image-20220411161715659.png)

#### 原态与次态

触发器在接收信号之前所处的状态称为原态/初态， 用Q^n表示；

 触发器在接收信号之后建立的新的稳定状态，叫做次态/新态，用Q^n+1表示。 

显然，触发器的次态 Q^n+1是由输入信号和原态Q^n的取值情况所决定。

#### 基本RS触发器

![image-20220411202336498](https://i.ibb.co/h23K8Hy/image-20220411202336498.png)

![image-20220411203317682](https://i.ibb.co/P5XSNcJ/image-20220411203317682.png)

![image-20220411203703330](https://i.ibb.co/YZRS0fT/image-20220411203703330.png)

![image-20220411203738033](https://i.ibb.co/jgTfnn4/image-20220411203738033.png)

#### 同步RS触发器

在较复杂的数字系统中，当采用多个触发器时，往往要求各个触发器的翻转在时间上同步，因此需引入一个**公用的同步信号**，使这些触发器只有在同步信号到达时才按输入信号改变输出状态。 通常称此同步信号为**时钟脉冲信号**，简称**时钟**，用**CP**表示。

同步触发器又称作**电平触发型触发器**

![image-20220411205844040](https://i.ibb.co/j9NhWjy/image-20220411205844040.png)

![image-20220411211128687](https://i.ibb.co/5xkqCR2/image-20220411211128687.png)

#### 空翻

同一时钟脉冲作用期间，引起触发器发生两次以及多次翻转的现象

同步RS触发器存在空翻现象，为了提高抗干扰能力， 克服空翻，希望一个CP脉冲作用期间Q只改变一次。可采用以下结构形式：主从型、边沿型。

#### 主从型触发器

主从结构的触发器也叫做**脉冲触发型触发器**

###### RS

![image-20220411220022511](https://i.ibb.co/bXk2Ktm/image-20220411220022511.png)

主从RS触发器和同步RS触发器的**特性表相同**，但 工作时序不同。 ❑ 主从RS触发器在CP由1→0（下降沿）后根据CP＝1 期间S、R的状态而改变状态。 ❑ 即输出状态的变化发生在CP信号的下降沿。

###### JK

* CP=1，主触发器根据J、K状态而动作，从触发器保持

* CP=0，从触发器根据主触发器的状态进行输出

![image-20220411221218429](https://i.ibb.co/JnvS7M7/image-20220411221218429.png)



###### 注意

* 只有CP=1期间输入信号未发生过变化的条件下， 用CP下降沿到达时输入的状态决定触发器的次态才是 正确的。
* 主从JK触发器存在一次变化问题。

#### 边缘型触发器

为了进一步增强触发器的抗干扰能力，提高工作的可靠性，希望**触发器的次态仅仅取决于CP的上升沿或下降沿到来时刻输入信号的状态**，而在此之前的或之后输入信号状态的任何变化对触发器的次态都没有影响。

* 维持阻塞结构的边沿触发器
* 利用CMOS传输门的边沿触发器

#### 逻辑功能

* RS

* JK
* D
* T
* T'

![image-20220412172225250](https://i.ibb.co/0Gysvhj/image-20220412172225250.png)

![image-20220412172252346](https://i.ibb.co/FbrGrXD/image-20220412172252346.png)

#### 相互转换

将具有某种逻辑功能的触发器FF，在其输入端加一转换电路（组合逻辑电路），可完成另一待求触发器的逻辑功能。

![image-20220412172744905](https://i.ibb.co/M9ZQmNx/image-20220412172744905.png)

![image-20220412173151585](https://i.ibb.co/6ZMkxMB/image-20220412173151585.png)

## 时序逻辑电路

由组合逻辑电路和存储电路构成，它在某一时刻的输出状态不仅与该时刻输入信号有关， 还与电路原来的输出状态有关。

包含**组合电路**和**存储电路**两部分 存储电路的输出**反馈**到组合电路的输入端。

![image-20220412191344745](https://i.ibb.co/FxnN8vR/image-20220412191344745.png)

![image-20220412191410185](https://i.ibb.co/KqbyhpQ/image-20220412191410185.png)

#### 功能描述方法

* 逻辑函数表达式（3个方程）
* 状态转换真值表
* 状态转换图
* 时序图

#### 分类

###### 按照存储单元状态变化特点（动作特点）

* **同步**时序逻辑电路

  所有触发器状态变化受同一CP控制

* **异步**时序逻辑电路

  触发器状态不同时变化

###### 按照输出信号特点

* **Mealy型**

  输出信号取决于**存储电路**与**输入变量**

* **Moore型**

  输出仅仅取决于存储电路的状态

###### 按照逻辑功能

* 计数器
* 寄存器 
* 移位寄存器 
* 顺序脉冲发生器

#### 电路分析

* **写方程**：根据逻辑电路图写出各触发器的**时钟方程、驱动方程、输出方程**

* **求状态方程**：将驱动方程代入相应触发器的特性方程，得到各触发器的**状态方程**（即次态方程）

* **列出状态转换真值表**：依次设初态，求次态，列出状态转换真值表

  或者画出状态转换图（有效循环无效循环，自启动）

  （或时序图）

* **说明逻辑功能**

###### 名词解释

* 有效状态：使用的状态
* 无效状态：未使用的状态

* 有效循环： 在CP脉冲作用下，电路在有效状态中的循环
* 无效循环： 在CP脉冲作用下，电路在无效状态中的循环
* 自启动：电路一旦进入无效状态，在CP脉冲作用下，能自 返回到有效循环中去的电路叫能自启动，否则叫不能自启动。

## 中规模时序逻辑电路

#### 寄存器

寄存器是存放二进制数码的逻辑部件，由触发器构成。 一个触发器可寄存一位二进制代码，N 个触发器构成的寄存器可寄存N 位二进制数码

![image-20220412203204393](https://i.ibb.co/WBr7sDX/image-20220412203204393.png)

#### 移位寄存器

* 功能：存储代码, 移位。 

  移位－寄存器中的代码在CP脉冲作用下，逐位左移或右移

* 用途

  * 存数
  * 数据串行--并行转换
  * 数值运算 
  * 数据处理

* 分类

  * 单向移位寄存器

    ![image-20220412214320406](https://i.ibb.co/yNSHMJY/image-20220412214320406.png)

  * 双向移位寄存器

    ![image-20220412214645266](https://i.ibb.co/sbYrbfK/image-20220412214645266.png)

![image-20220412215443579](https://i.ibb.co/zrgJvPG/image-20220412215443579.png)

#### 计数器

用于计算输入脉冲CP的个数

###### 应用

计数、**分频**（因此又称为分频器）、定时、产生脉冲序列及节拍脉冲， 进行数字运算等

###### 分类

* 按计数增减：
  * 加法计数器
  * 减法计数器
  * 可逆计数器
  * 其他计数器
* 按动作特点：
  * 同步计数器
  * 异步计数器
* 按进制：
  * 二进制计数器
  * 二-十进制计数器
  * 任意计数器

###### 同步计数器

####### 二进制加法

特点：

* 最低位每来一个CP改变一次状态
* 第i位在第0～(i－1)全为1时，改变状态。

![image-20220412225416513](https://i.ibb.co/9gStJ19/image-20220412225416513.png)

####### 十进制加法

![image-20220412225453047](https://i.ibb.co/YLmMqtk/image-20220412225453047.png)



####### 二进制减法

* 在多位二进制数末位减1
* 第i位以下皆为0时， 则第i位应翻转

![image-20220412230328193](https://i.ibb.co/XtPF3Sx/image-20220412230328193.png)

####### 十进制减法

![image-20220412230344753](https://i.ibb.co/6JN0G0r/image-20220412230344753.png)

####### 小结

![image-20220412230031154](https://i.ibb.co/Rj0J9Y6/image-20220412230031154.png)

![image-20220412230043471](https://i.ibb.co/kGD8hRK/image-20220412230043471.png)

###### 异步计数器

![image-20220412231011204](https://i.ibb.co/SrCb2c5/image-20220412231011204.png)

![image-20220412231324655](https://i.ibb.co/VWsdfxk/image-20220412231324655.png)

###### 对比

异步计数器由于触发器逐级翻转，工作速度低； 将某些状态译码时，译码器输出端会有竞争冒险产 生的尖峰脉冲；但其结构简单，可自启动。 同步计数器工作频率较高，传输延迟短，但结构 复杂

###### 74LS191

![image-20220412232128120](https://i.ibb.co/Z2hCKTy/image-20220412232128120.png)

#### 移位计数器

移位计数器是一种特殊形式的计数器。 它是在移位寄存器的基础上增加**反馈电路**构成的。 常用的移位计数器有**环形计数**器和**扭环形计数器**

![image-20220412234357328](https://i.ibb.co/3hjwt5k/image-20220412234357328.png)

优点：不需要译码

缺点：状态利用率低，不能自启动

解决自启动：

* 修改输出与输入之间的**反馈逻辑**，使电路具有自启动能力。

* 当电路进入无效状态时，利用触发器的异步置位、 复位端，把电路置成有效状态。

![image-20220412234626098](https://i.ibb.co/t4ctcQW/image-20220412234626098.png)

## 中规模集成计数器

#### **同步十进制加法计数器74160 **

![image-20220412235931664](https://i.ibb.co/fD9pmcj/image-20220412235931664.png)

#### **同步四位二进制加法计数器74161 **

74161（16进制）除了进制与74160（10进制）不同之外，其他功能与74160相同

#### **异步二-五-十进制加法计数器74290 **

![image-20220413092603208](https://i.ibb.co/xXksZLX/image-20220413092603208.png)

![image-20220413093225206](https://i.ibb.co/VH7sGbW/image-20220413093225206.png)

#### **同步四位二进制加减法计数器CC4516**

![image-20220413093246564](https://i.ibb.co/59zq5H2/image-20220413093246564.png)

#### 任意进制计数器设计

若已有N进制计数器芯片，需M进制计数器，分两种情况： 

* M < N: 用一片N进制计数器即可。 

  想办法跳过N-M个状态。 

  * 清零法（复位法）（反馈归零法）： 适用于有清零端的计数器。 

    * 异步清零
    * 同步清零

    ![image-20220413094213667](https://i.ibb.co/9t2st9F/image-20220413094213667.png)

    （相与或与非取决于高电平有效还是低电平有效）

    异步控制可靠性差。清零信号随着计数器被置零立即消失，持续时间极短，易导致触发器的误动 作，该电路不可靠。

  * 置数法（置位法）: 适用于有预置数功能的计数器。

    通过给计数器重复置入某数值的方法跳越N-M个状态，从而获得M进制计数器。

    * 同步式预置数的计数器（74160，74161）： 预置数信号从Si状态译出，待下一个CP信号到来， 才将所需数据置入。
    * 异步式预置数的计数器（74191）： 预置数信号从Si+1状态译出，只要预置数信号有效，立即将所需数据置入，不受CP信号控制

* M > N:视情况需用多片N进制计数器

  * 适合于M=N1 X N2的情况

    * 串行进位方式：低位片的进位输出信号作为高位片的时钟输入
    * 并行进位方式 ：低位片的进位输出信号作为高位片的工作状态控制信号（使能），两片的时钟输入端同时接输入信号

  * 适合于所有情况

    将2片N进制计数器通过级联构成NxN进制计数 器，并且假定M<NxN

    * 整体清零方式 
    * 整体置数方式 

## 顺序脉冲发生器

在计算机和控制系统中，常常要求系统的某些操作按时间顺序分时工作，因此需要产生一个节拍控制脉冲，以协调各部分的工作。 能产生节拍脉冲的电路叫做节拍脉冲发生器，又称顺序脉冲发生器(脉冲分配器)

#### 分类

* 计数器型 

  该电路由计数器和译码器构成。 n个触发器构成的计数器有2 n个状态。在时钟脉冲 作用下，计数器不断改变状态，经译码后在2 n个输出端上每一时刻只有相应的一条输出线上出现高电 平(或低电平)，其他输出线上均出现低电平(或高电平)

  **缺点**：触发器翻转时刻不可能完全一致，可能存在干扰脉冲

* 移位寄存器型

  采用环形计数器和扭环形计数器构成顺序脉冲发生器。可以避免在译码过程中出现干扰脉冲。

  环形计数器的每个触发 器的Q端输出就是节拍脉冲。 不需要另加译码器。

## 序列脉冲发生器 

在数字信号的传输和数字系统的测试中，有时需要用到一组特定的串行数字信号，通常把这种串行数字信号叫做序列信号。 产生序列信号的电路称为序列信号/脉冲发生器

#### 构造方法

* 用计数器和数据选择器组成 

* 用计数器加输出电路

## 时序逻辑电路设计

时序电路设计是时序逻辑电路分析的逆过程。

根据给出的逻辑问题（命题要求）， 设计出能实现逻辑要求的时序电路，画出逻辑图。

* 经典设计方法，采用尽可能少的小规模器件 （触发器和门电路）； 
* 采用标准中规模、大规模集成器件进行逻辑 设计；
* 采用可编程逻辑器件进行设计

#### 同步时序逻辑电路

![image-20220413104025073](https://i.ibb.co/82gPMLM/image-20220413104025073.png)

* 逻辑抽象

  确定输入变量、输出变量、及电路的状态数。 定义输入、输出状态及电路状态含义。 画原始状态转换图(表)

* 状态化简

  合并等价状态,进行状态化简，求出最简状态转换图(表)。

  等价状态： 若两个状态在输入相同时输出相同,次态也相同, 称其为等价状态

* 状态分配

  确定触发器数目n，2^n-1<M<=2^n，进行状态编码(状态分配)

* 选定触发器类型

  确定触发器类型，求出： 状态方程 输出方程 驱动方程

* 判断能否自启动

