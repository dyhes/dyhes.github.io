---
title: 【数据库】笔记
date: 2023-06-06 00:00:00+0000
categories: 
  - star
---

## 发展过程

### 人工管理

![image-20220304211030252](https://i.ibb.co/tKnZ5sV/image-20220304211030252.png)

### 文件系统

* 数据只能是定长的
* 文件间是独立的
* 数据整体无结构
* 最小存取单位是**记录**

![image-20220304211047171](https://i.ibb.co/M6JYnp4/image-20220304211047171.png)

### 数据库系统

* 数据结构化
* 数据的共享性高，冗余度低，易扩充
* 数据独立性高
* 数据由DBMS统一管理和控制
* 最小存取单位是**数据项**

![image-20220304211606042](https://i.ibb.co/w7WcNc7/image-20220304211606042.png)

DBMS提供的数据控制功能具有:

* 安全性（Security）
* 完整性（Integrity)
* 并发（Concurrency)
* 恢复（Recovery）

## 概念

### 数据库（DB）

存放数据的仓库，长期存储在计算机内，有组织的**数据集合**

### 数据库管理系统（DBMS）

用户与操作系统之间的数据管理软件，负责对数据库的**管理和维护**

### 数据库系统（DBS）

在计算机系统中引入数据库后的系统，一般由数据库、数据库管理系统（及其开发工具）、**应用系统 、数据库管理员**构成。

### 数据库管理员（DBA）

进行数据库建立，使用和维护的专门人员

![image-20220304212217450](https://i.ibb.co/S33P4xF/image-20220304212217450.png)

## 数据模型

对现实世界的**模拟**，表示现实世界中的各种**事物**及其**联系**的方法

### 组成

* 数据结构
* 数据操作
* 数据完整性约束：对数据静态和动态特性的限定，定义相容数据库状态的集合及可允许的状态改变

### 概念模型（信息模型）

独立于计算机之外，不涉及信息在计算机中的表示

e. g. 实体-联系模型，语义数据模型

### 数据模型

面向计算机

e. g. 层次模型，网状模型，关系模型

![image-20220304212630193](https://i.ibb.co/18fCctr/image-20220304212630193.png)

## 三级模式结构

### 外模式（External Schema）

亦称子模式（Subschema），对数据库用户的**数据视图**，体现用户的数据观点，是对用户数据结构的逻辑描述

### 模式（Schema）

亦称概念模式或逻辑模式，数据库的总框架，对全体数据逻辑结构和特性的描述，独立于**应用程序**和**物理存储**

### 内模式（Internal Schema）

亦称存储模式，对数据库**存储结构和存取方法**的描述，规定数据在存储介质上的物理组织方式，记录寻址方式，定义物理存储块大小，溢出处理方法。

### 数据抽象

三级模式结构提供了视图级，概念级和物理级的数据抽象

### 二级映像

![image-20220304214603741](https://i.ibb.co/bmfDYxh/image-20220304214603741.png)

## 数据库技术发展

* 第一代层次、网状数据库系统
* 第二代关系数据库系统
* 新一代数据库系统

## E-R数据模型（Entity-Relationship）

* 实体（集）【方框】：现实世界中存在的（具有同类特性的）个体（的集合）
* 属性【椭圆】：实体具有的特性或特质
* 联系【菱形】： 一对一，一对多，多对多
* 实体的参与度：参与联系的最小和最大次数
* 弱实体【双框双线】：依赖于其他实体存在的实体

### EER模型（extended E-R）

增加了子类和超类的概念,使E-R数据模型具有更多的语义

下层实体用两竖边为双线的矩形框表示，上层实体和下层实体之间用加小圈 的直线连接起来，下层实体称为上层实体的子 类，上层实体称为超类。

![image-20220304225109954](https://i.ibb.co/rkz38K3/image-20220304225109954.png)

## 层次数据模型

也叫树形结构，树中的每个节点代表一种记录类型，其应满足：

* 有且仅有一个结点无双亲，这个结点称为根结点
* 其他结点有且仅有一个双亲结点

层次模型中的基本数据结构是记录和由记 录组成的层次结构

## 网状数据模型

允许

*  一个结点可以有多个双亲结点 
* 多个结点可以无双亲结点

## 关系模型

### 关系模式(relation schema)

对关系结构的描述，可用

关系名（属性名1，属性名2,...,属性名n）

### 关系 (relation)

一张二维表，可用于描述一个实体集

### 属性 (attribute)

每一列为关系的一个属性

### 域 (domain)

属性的取值范围

### 元组 (tuple)

一个元组对应实体集中的一个个体

### 键 (key)

一个或多个属性组成，能唯一标识一个元组

一个关系可能有多个键，选取一个作为主键，其余作为候选键

## 关系

D1 X D2 X D3 ... X Dn 的子集称为在域D1, D2, ... , Dn上的关系，表示为 R（D1, D2, ... , Dn）

* 关系是笛卡尔积的**有限**子集
* 关系满足交换律而笛卡尔积不满足，因此为关系的每个列附加一个属性名以取消有序性

### 三类关系

* 基本关系（基本表/基表）：实际存在的表，是实际存储数据的逻辑表示
* 查询表 ：查询结果对应的表
* 视图表 :  由基本表或其他视图表导出的虚表

### 基本关系性质

* 列是同质的
* 不同列可出自同一个域
* 分量应为不可分的数据项

## 关系模式(Relation Schema)

关系模式**（型）**：对关系**（值）**的描述，静态且稳定

* 元组集合的结构

  ​	属性构成

  ​	属性来自的域

  ​	属性与域之间的映象关系

* 元组语义以及完整性约束条件

* 属性间的数据依赖关系集合

### 关系

关系模式在某一时刻的状态或内容

动态、随时间变化

二者往往统称为关系，关系模式为关系的内涵，关系的值为关系的外延

模式中属性到对应域映射的有限集，通常写为**r(R)**

### 关系模式的形式化表示

R(U, D, dom, F)

* R: 关系名
* U: 组成该关系的属性名集合
* D: 属性组U中属性来自的域
* dom: 属性向域的映象集合
* F: 属性间的数据依赖关系集合

简记为 R(U) 或 R(A1, A2, ……, An )

### 关系数据库模式

关系模式的**集合**，是对数据库中所有数据逻辑结构的描述，表示为**R={R1, R2,……, Rp}**

### 关系数据库

关系数据库模式中每个关系模式上的关系的集合，表示为**d={r1, r2, ..., rp}** ，其中ri对应关系模式Ri上的一个关系

## 候选键（Candidate Key）

能唯一标识一个元组的某一**属性组**，最简单情况下只包含一个属性，最极端情况下所有属性组为候选键，成为全键（All Key）

### 主键（Primary Key）

多个候选键中选定一个，其余作为隐含键（Implicit Key）或候补键（Alternate Key）

### 主属性（Prime Attribute）

Prime attributes are **the attributes of the candidate key which defines the uniqueness**.

包含在任何一个候选键中的属性

## 完整性约束

对关系的某种约束条件

* 实体完整性（*Entity Integrity Constraint*）

主属性不能取空值

* 参照完整性（*Referential Integrity Constraint*）

对作为外键（Foreign Key）的值的约束

R的外键为其他基本关系S的主键：

称R为参照关系（Referencing Relation）

称S为被参照关系（Referenced Relation）或目标关系 （Target Relation）

外键为空或等于S中的某个主键值

* 用户定义的完整性（*User-defined integrity*）：保证一个数据的取值合理

## 关系代数

* 一种抽象的**查询语言**
* 用**对关系的运算**来表达查询
* 关系数据操纵语言的一种传统表达方式

### 表示记号

![image-20220321234203719](https://i.ibb.co/cwTV5VC/image-20220321234203719.png)

![image-20220321234215859](https://i.ibb.co/JqGLWy0/image-20220321234215859.png)

![image-20220321234228253](https://i.ibb.co/DYPSdkJ/image-20220321234228253.png)

![image-20220321234855404](https://i.ibb.co/jZs6R5j/image-20220321234855404.png)

### 运算符

* 集合运算符

  * 并
  * 差
  * 交
  * 笛卡尔积

* 关系运算符

  * 选择（Selection）

  又称为限制（Restriction），从行的角度进行

  * 投影（Projection）

  从R中选择出若干属性列组成新的关系,从列的角度进行运算（但可能为了避免重复取消某些元组）

  ![image-20220321235138739](https://i.ibb.co/18Ncyfj/image-20220321235138739.png)

  * 连接（Join）

  从两个关系的**笛卡尔积**中选取属性间满足一定条件的元组

  ![image-20220321235356615](https://i.ibb.co/pnCbBNP/image-20220321235356615.png)

  * * 等值连接(equijoin):比较关系为等号
    * 自然连接(Natural join)

  ![image-20220321235545346](https://i.ibb.co/JxzsnXQ/image-20220321235545346.png)

  * 除法（Division）

  ![image-20220321235719790](https://i.ibb.co/myhVFxM/image-20220321235719790.png)

同时从行和列的角度进行运算

* 扩充的关系运算

  * 属性重命名

  ![image-20220322000207770](https://i.ibb.co/Lp9LdMf/image-20220322000207770.png)

  ![image-20220322000219571](https://i.ibb.co/p3n4sW4/image-20220322000219571.png)

  * 外连接(Outer Join)

  对自然连接的扩展。除了满足连接的元组外还包含没有被连接的元组

  * * 左外连接

    左外连接的连接结果中包含了关系R （左边关系）中不满足连接条件的元组，在这些元组对 应关系S属性上的值为空值

    ![image-20220322000732778](https://i.ibb.co/WgKXV1T/image-20220322000732778.png)

    * 右外连接

    左外连接的连接结果中包含了关系S（右边关系）中不满足连接条件的元组，在这些元组对 应关系S属性上的值为空值

    ![image-20220322000826120](https://i.ibb.co/JtLPRNq/image-20220322000826120.png)

    * 全外连接

    完全外连接的连接结果中包含了关系R中不满 足连接条件的元组，同时也包含了关系S中不 满足连接条件的元组。即连接结果是左外连接 和右外连接结果的并

    ![image-20220322000801966](https://i.ibb.co/pjN5M7r/image-20220322000801966.png)

* 算术比较符

* 逻辑运算符

### 关系代数表达式

关系代数运算经过有限次复合后形成的式子

### 典型关系代数语言

ISBL（Infotmation System Base Language）

## 关系演算

* 元组关系演算

以**元组变量**作为谓词变元的基本对象

典型代表：**ALPHA**

* 域关系演算

以**域变量**作为谓词变元的基本对象

典型代表：**QBE**(Query By Example)

### ALPHA

#### 检索语句： GET

![image-20220322001459980](https://i.ibb.co/4td96bZ/image-20220322001459980.png)

* 简单检索

![image-20220322001638021](https://i.ibb.co/Vt5q3nV/image-20220322001638021.png)

* 限定检索

![image-20220322001652646](https://i.ibb.co/TqgMkZF/image-20220322001652646.png)

* 排序检索

![image-20220322001734654](https://i.ibb.co/6D5Mtkc/image-20220322001734654.png)

* 定额检索

![image-20220322001759852](https://i.ibb.co/415gz9g/image-20220322001759852.png)

* 元组变量检索

  元组变量

  * 含义：表示可以在某一关系范围内变化（也称为范围 变量Range Variable）

  * 用途：
    * 简化关系名
    * 操作条件中使用量词时必须用元组变量
  * 定义格式：RANGE 关系名 变量名

  ![image-20220322002108186](https://i.ibb.co/PtyYgNG/image-20220322002108186.png)

* 存在量词检索

![image-20220322002133485](https://i.ibb.co/qp3Cgjf/image-20220322002133485.png)

![image-20220322002201442](https://i.ibb.co/3TPTt1k/image-20220322002201442.png)

* 全称量词检索

![image-20220322002257406](https://i.ibb.co/kcJm2Gn/image-20220322002257406.png)

* 蕴函（Implication）检索

![image-20220322002343352](https://i.ibb.co/FwfZS2H/image-20220322002343352.png)

* 集函数（Aggregation function）或内部函数（Build-in function）

  ![image-20220322002502544](https://i.ibb.co/54F7G83/image-20220322002502544.png)

#### 更新语句：PUT,HOLD,UPDATE,DELETE,DROP

* 插入：-建立新元组-PUT

![image-20220322094927425](https://i.ibb.co/XCWzDkQ/image-20220322094927425.png)

* 修改：-HOLD-修改-UPDATE

![image-20220322094704212](https://i.ibb.co/1zFGTQq/image-20220322094704212.png)

**宿主语言**：开发软件赖以生存的软件环境的程序语言

* 删除：-HOLD-DELETE

![image-20220322095010204](https://i.ibb.co/C5pcjDf/image-20220322095010204.png)

## 存储异常

* 数据冗余
* 更新异常
* 插入异常
* 删除异常

> 原因：数据库模式没有反映数据间的依赖关系

## 规范化

规范化理论用于**改造**关系模式，通过**分解关系模式**来消除不合适的数据依赖，以解决存储异常问题。

#### 函数依赖

###### 定义

* 设R（U）是一个属性集U上的关系模式，X 和Y是U的子集。若对于R（U）的任意一个 可能的关系r，r中不可能存在两个元组在X 上的属性值相等， 而在Y上的属性值不等 ， 则称 “X函数确定Y” 或 “Y函数依赖于 X”，记作X→Y。

* 若X→Y，则X称为这个函数依赖的**决定属性集**（ Determinant）。
* 若X→Y，并且Y→X, 则记为X ←→Y。

###### 平凡与非平凡函数依赖

在关系模式R（U）中，对于U的子集X和Y ，若X→Y

* 且Y不属于X，则称X→Y是**非平凡**的函数依赖；

* 但Y属于X, 则称 X→Y是**平凡**的函数依赖。

###### 完全与部分函数依赖

在关系模式R（U）中，如果X→Y，

* 并且对于X的**任何一个真子集**X’，都有X'-/>Y, 则称 Y完全函数依赖于X。

* 但Y不完全函数依赖于X，则称Y部分函数依赖于X

###### 传递与直接函数依赖

在关系模式R（U）中，如果X→Y，Y→Z ，

* 且Y不属于X，Y-/>X，则称Z传递函数依赖于 X
* 且X ←→Y，则Z**直接依赖**于X

###### 键

设K为关系模式R中的属性或属性组合。若K→U（f），则K称为R的一个侯选键 （Candidate Key）。若关系模式R有多个 候选键，则选定其中的一个做为主键（ Primary Key）。

#### 范式

范式是**符合某一种级别要求**的**关系模式的集合**。

![image-20220411102431155](https://i.ibb.co/5M932Zp/image-20220411102431155.png)

###### 第一范式（NF）

一个关系模式R的所有属性都是**不可分**的基本数据项

> 第一范式实际上是对关系增加了一个约束 ，即关系中元组的**每个属性都只能取一个值**。第一范式是对关系模式的基本要求， 不满足第一范式的数据库就不是关系数据库。

###### 第二范式（2NF）

* 1NF
* 每一个非主属性都**完全函数依赖**于R的键

###### 第三范式（3NF）

* 不存在键X、属性组Y及非主属性Z（Z 不属于Y）, 使得X→Y，Y -/> X，Y→Z成立 ( 关系中每一个非主属性必须只依赖于主键)

> 在第二范式的基础上，消除非主属性对主键的**传递函数依赖**可达到3NF。
>
> 若R∈3NF，则R的每一个非主属性既不部 分函数依赖于候选键也不传递函数依赖于 候选键。

###### BC范式（BCNF）Boyce Codd Normal Form

通常认为BCNF是修正的第三范式，所以有时也称为扩充的第三范式

* 1NF
* 若X→Y且Y不属于X时X必含有键 （每一个决定属性因素都包含键）

> 若R∈BCNF，
>
> – 所有非主属性对每一个键都是完全函数依赖
>
> – 所有的主属性对每一个不包含它的键，也是完全函数依赖 
>
> – 没有任何属性完全函数依赖于非键的任何一组属性

###### 多值依赖

####### 定义

设R（U）是一个属性集U上的一个关系模式， X、 Y和Z是U的子集，并且Z＝U－X －Y，多值依赖 X→→Y成立当且仅当对R的任一关系r，r在（X，Z）上的每个值对应一组Y的值，这组值**仅仅决定于X值**而与Z值无关

 若X→→Y，而Z＝φ，则称 X→→Y为平凡的多值依赖，否则称X→→Y为非平凡的多值依赖

####### 性质

* 多值依赖具有**对称性**，若X→→Y，则X→→Z，其中Z＝U－X - Y
* 多值依赖具有**传递性**，若X→→Y，Y→→Z， 则X→→Z –Y
* 函数依赖是多值依赖的特殊情况，若X→Y，则X→→Y
* 若X→→Y，X→→Z，则
  * X→→Y并Z
  * X→→Y交Z
  * X→→Y-Z
  * X→→Y-Z

###### 第四范式（4NF）

* 1NF
* 对于R的每个非平凡多值依赖X→→Y（Y不属于X），X都含有候选键

> 如果R ∈ 4NF
>
> –不允许有非平凡且非函数依赖的多值依赖 
>
> –允许的非平凡多值依赖是函数依赖

###### 连接依赖

设R是一个关系模式，R的属性子集为R1， R2，R3，R4，R5，…，当且仅当R的每个合法值都等于R1，R2，R3，R4，R5，…， 的投影连接时，称R满足连接依赖

###### 第五范式（5NF）

R的每一个非平凡连接依赖都被R的候选键所蕴含（4NF中消除非候选键所蕴含的连接依赖)

![image-20220411110316591](https://i.ibb.co/4WDxTDB/image-20220411110316591.png)

## Armstrong公理系统

#### 逻辑蕴含

对于满足一组函数依赖 F 的关系模式R ，其任何一个关系r，若函数依赖X→Y都成立, （即r中任意两元组t，s，若t[X]=s[X]，则 t[Y]=s[Y]），则称F逻辑蕴含X →Y

#### 推理规则

* A1. 自反律（Reflexivity）：若Y 属于X 属于 U， 则X →Y为F所蕴含
* A2. 增广律（Augmentation）：若X→Y为F所蕴含，且Z属于U，则XZ→YZ为F所蕴含
* A3. 传递律（Transitivity）：若X→Y及Y→Z 为F所蕴含，则X→Z为F所蕴含

 进而：

* 合并规则：由X→Y，X→Z，有X→YZ
* 伪传递规则：由X→Y，WY→Z，有XW→Z
* 分解规则：由X→Y及Z属于Y，有X→Z

根据合并规则和分解规则，可得如下引理 X→A1 A2 …Ak成立⇔X→Ai成立（i=1，2， … ，k）

#### 有效与完备

* 有效性：指由F出发根据Armstrong公理推导出来的每个函数依赖一定在F所蕴含的函数依赖的全体之中。有效性可由正确性证明

* 完备性：F所蕴含的函数依赖的全体中的每一个函数依赖， 必定可以由F根据Armstrong公理导出

#### 闭包

在R中，X ⊆U，X_F^+= {A | X→A能由F根据 Armstrong公理导出}，称X_F^+为属性集X关于函数依赖集F的闭包。

###### 计算方法

计算X（i）（i=0，1，…） 

（1）X（0）=X 

（2）X（i+1）=X（i）A 其中A是这样的属性：在F中寻找尚未用过的左边是 X（i）的子集的FD：Y→A，其中Y是X（i）的子集。 

（3）判断X（i+1）=X（i），若是转（4），否则转（2 ）

（4） 输出X（i），即为X+

## 等价与覆盖

* 等价：F，G为FD集，F+=G+
* 覆盖：F，G为FD集，G属于F，称F覆盖G

## 最小依赖集

满足：

* **右部单属性化**：F中任一函数依赖X→ A，A必是单属性
* **不存在多余FD**：F中不存在X→ A，使得F与F-｛X→ A｝等价
* **每个FD左部没有多余属性**：F中不存在X→ A，使得X存在真子集Z，使得F与F-｛X→ A｝并｛Z→ A｝（先减后并）等价

## 模式分解

三种模式分解等价的定义

* 分解具有无损连接性（一定能达到4NF）
* 分解保持函数依赖（一定能达到3NF）
* 既保持函数依赖又具有无损连接性（一定能达到3NF）

## 关键字求解

给定关系模式S和FD集F，按F中函数依赖将S中属性分为

* L类：仅在FD左部出现
* R类：仅在FD右部出现
* LR类：左右均出现
* N类：左右均未出现

#### 引理

X为**L类或N类**属性，则必为**主属性**（包含在候选键中）

推论：

* X为S中**N类和L类组成的属性集**且X+包含S中**全部**属性，X必为S的**唯一**候选键
* X为S中的**R类属性**，即X为S的非主属性

## 设计步骤

需求分析和概念设计独立于任何数据库管理系统 

逻辑设计和物理设计与选用的DBMS密切相关

![image-20220420154849775](https://i.ibb.co/t3P8pwy/image-20220420154849775.png)

#### 需求分析

###### 任务

* 明确用户的各种需求
* 确定新系统的功能
* 充分考虑今后可能的扩充和改变

结构化分析方法（Structured Analysis）

从最上层的系统组织机构入手，自顶向下、逐层分解分析系统

* 系统抽象为

  ![image-20220420160131348](https://i.ibb.co/942558V/image-20220420160131348.png)

* 分解处理功能和数据

  * 分解处理功能

    将处理功能的具体内容分解为若干子功能

  * 分解数据

    处理功能逐步分解的同时，逐级分解所用的数据，形成若干层次的**数据流图**

  * 表达方法

    * 处理逻辑：判定表或判定树
    * 数据：数据字典

* 征取用户认可

###### 数据字典

####### 用途

进行详细的数据收集和数据分析所获得的主要结果

####### 内容

* 数据项

  **不可再分**的数据单位

  描述=｛数据项名，数据项含义说明，别名，数据类型，长度，取值范围，取值含义，与其他数据项的逻辑关系，数据项之间的联系｝

* 数据结构

  反映数据之间的**组合关系**

  可以由若干个数据项组成，也可以由若干数据结构组成，或若干二者混合

  描述=｛数据结构名，含义说明，组成：｛数据项或数据结构｝｝

* 数据流

  数据结构在系统内的**传输路径**

  描述=｛数据流名，说明，数据流来源，数据流去向，组成：｛数据结构｝，平均流量，高峰期流量｝

* 数据存储

  数据结构停留或保存的地方，数据流的来源和去向之一

  描述=｛数据存储名，说明，编号，输入的数据流，输出的数据流，组成：｛数据结构｝，数据量，存取频度，存取方式｝

* 处理过程

  一般用判定表或判定树来描述

  描述=｛处理过程名，说明，输入：｛数据流｝，输出：｛数据流｝，处理：｛简要说明｝｝

  ![image-20220420161610114](https://i.ibb.co/ZGTmS8h/image-20220420161610114.png)

![image-20220420161645960](https://i.ibb.co/6tCNYGN/image-20220420161645960.png)

数据字典是关于数据库中数据的描述，是**元数据**，而不是数据本身。 

数据字典在需求分析阶段建立，在数据库设计过程中不断修改、充实、完善。

#### 概念设计

将需求分析得到的用户需求抽象为信息结构即**概念模型**的过程就是概念结构设计

###### 工具

E-R模型

###### 设计方法

* 自顶向下：首先定义全局概念结构的框架，然后逐步细化
* 自底向上：首先定义各局部应用的概念结构，然后将其集成起来
* 逐步扩张：首先核心概念结构，然后向外扩充
* 混合策略：自顶向下设计**全局概念框架**，自底向上设计**各局部概念结构**

###### 常用策略

* 自顶向下进行需求分析

* 自底向上设计概念结构
  * 抽象数据并设计局部视图
  * 集成局部视图，得到全局概念结构

###### 数据抽象

* 分类（Classification）：

  定义某一类概念作为现实世界中一组对象的类型。

  抽象了对象值与型之间的“**is member of**”的语义

  ![image-20220420162716701](https://i.ibb.co/tPQ6LTy/image-20220420162716701.png)

* 聚集（Aggregation）：

  定义某一类型的组成成分

  抽象了对象内部类型和成分之间“**is part of**”的语义

  ![image-20220420162733911](https://i.ibb.co/P5PsyC9/image-20220420162733911.png)

* 概括（Generalization）：

  定义类型只见那的一种子集联系

  抽象了类型之间的“**is subset of**”的语义

  ![image-20220420162746102](https://i.ibb.co/C7gm2PQ/image-20220420162746102.png)

###### 局部视图设计

在多层的数据流图中选择一个适当层次的数据流图，作为设计分E-R图的出发点

通常以中层数据流图作为设计分E-R图的依据

####### 准则

* 属性不能再具有需要描述的性质，即属性必须是不可分的数据项
* 属性不能与其他实体具有联系，联系只发生在实体之间

###### 集成

####### 消除冲突

* 属性冲突
  * 属性域冲突
    * 属性值的类型
    * 取值范围
    * 取值集合不同
  * 属性取值单位冲突
* 命名冲突
  * 同名异义：不同意义的对象在不同的局部应用中具有相同的名字
  * 异名同义：同一意义的对象在不同的局部应用中具有不同名字
* 结构冲突
  * 同一对象在不同应用中具有不同的抽象。
  * 同一实体在不同分E-R图中所包含的属性个数
    和属性排列次序不完全相同。
  * 实体之间的联系在不同局部视图中呈现不同的
    类型。

####### 消除冗余

冗余的数据是指可由基本数据导出的数据 

冗余的联系是指可由其他联系导出的联系 

冗余数据和冗余联系容易破坏数据库的完整性，给数据库维护增加困难

方法：

求 F L的最小覆盖 GL ，差集为D = F L-G L。逐一 考察 D中的函数依赖，确定是否是冗余的联系， 若是，就把它去掉

> * 冗余的联系一定在D中，而 D中的联系不一定是冗余的
> * 当实体之间存在多种联系时要将实体之间的联系在形式上加以区分

#### 逻辑设计

把概念结构设计阶段设计好的基本E-R图转换 为与选用DBMS产品所支持的数据模型相符合 的逻辑结构

###### 步骤

* 将概念结构转化为一般的关系、网状、层次模型
* 将转换来的关系、网状、层次模型向特定DBMS支持下的数据模型转换
* 对数据模型进行优化
* 设计用户子模式

###### ER图转关系模型

将实体、实体的属性和实体之间的联系转换为关系模式

* 一个1:1联系可以转换为一个独立的关系模式，也可以与任意一端对应的关系模式合并。
* 一个1:n联系可以转换为一个独立的关系模式，也可以与n端对应的关系模式合并。
* 一个m:n联系转换为一个关系模式。
* 三个或三个以上实体间的一个多元联系转 换为一个关系模式。
* 具有相同键的关系模式可合并

###### 优化

* 确定数据依赖
* 消除冗余联系
* 确定所属范式
* 确定合并或分解

####### 水平分解

把（基本）关系的元组分为若干子集合，定义每个子集合为一个子关系，以提高系统的效率

* 满足“80/20原则”的应用 
* 并发事务经常存取不相交的数据

####### 垂直分解

把关系模式R的属性分解为若干子集合，形成若干子关系模式

###### 设计用户子模式

1. 使用更符合用户习惯的别名。
2. 针对不同级别的用户定义不同的外模式，以满足系统对安全性的要求。
3. 简化用户对系统的使用。

#### 物理设计

数据库在物理设备上的**存储结构**与**存取方法**称为数据库的物理结构，依赖于选定的数据库管理系统

为一个给定的逻辑数据模型选取一个最适合应用环境的物理结构的过程，就是数据库的物理设计

对物理结构进行评价，评价的重点是时间和空间效率

###### 内容

* 为关系模式选择存取方法（建立存取路径）
  * 索引方法：B+树索引方法（最普遍）
  * 局促方法（Cluster）
  * HASH方法
* 设计关系、索引等数据库文件的物理存储结构

#### 数据库实施

运用DBMS提供的数据库语言及宿主语言，根据逻辑设计和物理设计的结果

#### 数据库运行和维护

## 简介

SQL语言的前身是**SQUARE**（Specifying  Queries As Relational Expression）语 言，是1974年由Boyce和Chamberlin提出 的，并在IBM公司的关系数据库系统 System R上实现，后改名为**SEQUEL**（ Structured English QUEry Language） 语言，SEUQUEL简称SQL

SQL语言集

* 数据定义语言DDL
* 数据操纵语言DML
* 数据控制语言DCL

的功能于一体

数据查询：SELECT

数据定义：CREATE、DROP、ALTER

数据操纵：INSERT、UPDATE、DELETE

数据控制：GRANT、REVOKE

## 系统结构

SQL语言支持数据库的三级模式结构，在SQL语言中，关系模式称为基本表，外模式称为视图，内模式称为索引

* 基本表

  本身独立存在的表，SQL中一个关系对应一个基本表，基本表对应存储文件，一个表可以携带若干索引

* 视图

  从一个或多个基本表导出的“虚表”，可在视图上再定义视图，只存放定义而不存放数据

## 数据定义

### 模式

实际上定义了一个命名空间，在空间中可定义该模式包含的数据库对象如基本表、视图、索引等。

* 创建模式

  ```sql
  CREATE SCHEMA <schemaName> AUTHORIZATION <userName> [
  
  <tableDefinition>|<viewDefinition>|<authorizationDefiinition>
  
  ]
  
  CREATE SCHEMA "S-T" AUTHORIZATION SHERRY;
  ```

* 删除模式

  ```sql
  DROP SCHEMA <name> <CASCADE|RESTRICT>
  ```

  * CASCADE（级联）

    删除模式同时把该模式中所有的数据库对象全部删除

  * RESTRICT（限制）

    如该模式中定义了下属的数据库对象（表、视图等），则拒绝该删除语句执行，仅当该模式中没有任何下属对象时才能执行

### 基本表 （模式）

每一个基本表都属于某一个模式,一个模式包含多个基本表

* 创建表

  ```sql
  CREATE TABLE <name> (
  
  <colName> <dataType> [<constraint>]
  
  [,<colName> <dataType> [<constraint>]]
  
  );
  
  CREATE TABLE Student 
  (Sno CHAR(5)PRIMARY KEY, /* 列级完整性约束条件*/
  Sname CHAR(20) UNIQUE, /* Sname取唯一值*/
  Ssex CHAR(2),
  Sage SMALLINT,
  Sdept CHAR(20));
  
  CREATE TABLE Course
  (Cno CHAR(4)PRIMARY KEY,
  Cname CHAR(40), 
  Cpno CHAR(4), 
  Ccredit SMALLINT,
  FOREIGN KEY (Cpno)REFERENCES Course(Cno));
  ```

  ![image-20220426105836165](https://i.ibb.co/6br0YPM/image-20220426105836165.png)

* 删除表

  ```sql
  DROP TABLE <name>［ RESTRICT | CASCADE］；
  ```

* 修改表定义

  ```sql
  ALTER TABLE <name>
  
  [ADD <colname> <datatype>[<constriant>]]
  
  [DROP <colname> [CASCADE|RESTRICT]]
  
  [ALTER<colname> <datatype>]

ALTER TABLE Student ADD S_entrance DATE；
  
  ALTER TABLE Student ADD S_entrance DATE；
  
  ALTER TABLE Course ADD UNIQUE（Cname）；
  ```

### 视图 （外模式）

* 定义视图（外模式）

  * 创建视图
  * 删除视图
  * 间接修改视图定义：删除+创建

* 创建索引

    CREATE [UNIQUE] [CLUSTER] INDEX <idxname> ON <tablename> (

    <colname>

    )

  * 删除索引

  * 间接修改索引定义：删除+创建

  ![image-20220426103755768](https://i.ibb.co/z2PSyXs/image-20220426103755768.png)

### 索引（内模式）

索引是关系数据库的内部实现技术，属于内模式范畴

**目的**：加快查询速度

**创建**：**DBA或表的属主**可以建立索引，DBMS一般会自动建立**PRIMARY KEY**和**UNIQUE**列上的索引

**使用**：DBMS自动维护索引，自动选择是否使用、使用哪个索引

**方法**：RDBMS中索引一般采用B+树、HASH索引

* B+树索引具有动态平衡的优点
* HASH索引具有查找速度快的特点

**类别**：唯一索引、非唯一索引、聚簇索引

​	在最经常查询的列上建立聚簇索引以提高查询效率

​	一个基本表上最多只能建立**一个**聚簇索引

​	**经常更新**的列**不宜**建立聚簇索引

* 创建索引

  ```sql
  CREATE [UNIQUE][CLUSTER] INDEX <indexName> ON <tableName> (<colName>[<order>][,<colName>[order]]...);

CREATE UNIQUE INDEX Stusno ON Student（Sno）；
  CREATE UNIQUE INDEX Coucno ON Course（Cno）；
  CREATE UNIQUE INDEX SCno ON SC（Sno ASC，Cno DESC）；
  ```

  * UNIQUE : 相当于对列添加了一个UNIQUE约束
  * CLUSTER：建立聚簇索引后，基表中数据也需要按指定的 聚簇属性值的升序或降序存放。也即聚簇索引 的索引项顺序与表中记录的物理顺序一致
  * ORDER：ASC,DESC

* 删除索引

  ```sql
  DROP INDEX <indexName>;
  ```

## 数据操纵

### 数据查询

SELECT [ALL|DISTINCT]<colexpression>[,<colexpression>]

FROM <table or view>[,<table or view>]

[WHERE <conditon>]

[GROUP BY <colname>[HAVING <condition>]]

[ORDER BY <colname> [ASC|DESC]];

#### 单表查询

```sql
SELECT [ALL|DISTINCT] <colExpression>[，<colExpression>] …
FROM <tableOrViewName>[， <tableOrViewName> ] …
[ WHERE <condition> ]
[ GROUP BY <列名1> [ HAVING <condtion> ] ]
[ ORDER BY <列名2> [ ASC|DESC ] ]；
```

* 查询指定列

  ```sql
  SELECT Sno,Sname
  FROM Student;
  ```

* 查询全部列

  ```sql
  SELECT *
  FROM Student;
  ```

* 查询经过计算的值

  ```sql
  SELECT Sname,1996-Sage /*假定当年的年
  份为1996年*/
  FROM Student;
  
  SELECT Sname,'Year of Birth:',1996-
  Sage,ISLOWER(Sdept)
  FROM Student;
  
  SELECT Sname NAME,'Year of Birth: ' 
  BIRTH,1996-Sage 
  BIRTHDAY,LOWER(Sdept) DEPARTMENT
  FROM Student;
  ```

* 取消取值中的重复行

  DISTINCT短语的作用范围是所有目标列

  ```sql
  SELECT Sno FROM SC; 
  =	SELECT ALL Sno FROM SC;
  
  SELECT DISTINCT Sno FROM SC;#去掉重复行
  
  SELECT DISTINCT Cno,Grade FROM SC;
  ```

* 查询满足条件的元组

  [![O8btZF.png](https://s1.ax1x.com/2022/05/09/O8btZF.png)](https://imgtu.com/i/O8btZF)

  字符匹配：

  ```sql
  [NOT] LIKE ‘<匹配串>’ [ESCAPE ‘ <换码字符>’]
  ```

```sql
  SELECT Sname
  FROM Student
  WHERE Sdept='CS';
  
  #between
  SELECT Sname,Sdept,Sage
  FROM Student
  WHERE Sage BETWEEN 20 AND 23;
  
  SELECT Sname,Sdept,Sage
  FROM Student
  WHERE Sage NOT BETWEEN 20 AND 23;
  
  #in
  SELECT Sname,Ssex
  FROM Student
  WHERE Sdept IN ('IS','MA','CS');
  
  SELECT Sname,Ssex
  FROM Student
  WHERE Sdept NOT IN('IS','MA','CS');
  
  #like
  SELECT Sname,Sno,Ssex
  FROM Student
  WHERE Sname LIKE '刘%';
  
  SELECT Sname
  FROM Student
  WHERE Sname LIKE '欧阳__';
  
  SELECT Sname,Sno
  FROM Student
  WHERE Sname LIKE '__阳%';
  
  SELECT Sname,Sno,Ssex
  FROM Student
  WHERE Sname NOT LIKE '刘%';
  
  #查询以"DB_"开头，且倒数第3个字符为 i的课程的详细情况。
  SELECT *
  FROM Course
  WHERE Cname LIKE 'DB\_%i_ _' ESCAPE '\\';(只有一个\)
  
  SELECT Sno,Cno
  From SC
  WHERE GRADE IS NULL;
  
  SELECT Sno,Cno
  FROM SC
  WHERE Grade IS NOT NULL;
  ```

* ORDER BY

  升序：ASC；降序：DESC；缺省值为升序

  ASC：排序列为空值的元组最后显示 

  DESC：排序列为空值的元组最先显示

  ```sql
  SELECT Sno,Grade
  FROM SC
  WHERE Cno='3'
  ORDER BY Grade DESC;
  
  SELECT *
  FROM Student
  ORDER BY Sdept,Sage DESC;
  ```

* 聚集函数

  * 计数 

    COUNT（ *） 

    COUNT（[DISTINCT|ALL] <列名>） 

  * 计算总和 

    SUM（[DISTINCT|ALL] <列名>） 

  * 计算平均值 

    AVG（[DISTINCT|ALL] <列名>） 

  * 最大最小值 

    MAX（[DISTINCT|ALL] <列名>） 

    MIN（[DISTINCT|ALL] <列名>）

  ```sql
  SELECT COUNT(*)
  FROM Student;
  
  SELECT AVG(Grade)
  FROM SC
  WHERE Cno='1';
  
  ```

* Group By

  细化聚集函数的作用对象，未对查询结果分组，聚集函数将作用于整个查询结果，对查询结果分组后，聚集函数将分别作用于每个组

  使用GROUP BY子句后，SELECT子句的列名列表中**只能出现分组属性和聚集函数**

  使用HAVING短语筛选最终输出结果，只有满足HAVING短语指定条件的组才输出

  * WHERE子句作用于基表或视图，从中选择满足条件的**元组**
  * HAVING短语作用于组，从中选择满足条件的**组**

  ```sql
  SELECT Sno
  FROM SC
  GROUP BY Sno
  HAVING COUNT(*) >3;
  
  SELECT Sno,COUNT(*)
  FROM SC
  WHERE Grade>=90
  GROUP BY Sno
  HAVING COUNT(*)>=3;
  
  ```

#### 连接查询

同时涉及多个表的查询

```sql
[<表名1>.]<列名1> <比较运算符> [<表名2>.]<列名2>
[<表名1>.]<列名1> BETWEEN [<表名2>.]<列名2> AND [<表名2>.]<列名3>
```

连接条件中的各连接字段类型必须是可比的，但名字不必是相同的

**方法**：

* 嵌套循环法 (NESTED-LOOP)

  首先在表1中找到第一个元组，然后从头开始扫描表2，逐一查找满足连接条件的元组，找到后就将表1中的第一个元组与该元组拼接起来，形成结果表中一个元组

  表2全部查找完后，再找表1中第二个元组，然后再从头开始扫描表2，逐一查找满足连接条件的元组，找到后就将表1中的第二个元组与该元组拼接起来，形成结果表中一个元组，

  重复上述操作，直到表1中的全部元组都处理完毕

* 排序合并法 (SORT-MERGE)

  常用于=连接

  对表1的第一个元组，从头开始扫描表2，顺序查找满足连接条件的元组，找到后就将表1中的第一个元组与该元组拼接起来，形成结果表中一个元组。当遇到表2中第一条大于表1连接字段值的元组时，对表2的查询不再继续

  找到表1的第二条元组，然后从刚才的中断点处继续顺序扫描表2，查找满足连接条件的元组，找到后就将表1中的第二个元组与该元组拼接起来，形成结果表中一个元组。直接遇到表2中大于表1连接字段值的元组时，对表2的查询不再继续。

  重复上述操作，直到表1或表2中的全部元组都处理完毕为止

* 索引连接（INDEX-JOIN）

  对表2按连接字段建立索引。 对表1中的每个元组，依次根据其连接字段值查询表2的索引，从中找到满足条件的元组，找到后就将表1中的第一个元组与该元组拼接起来，形成结果表中一个元组。

**类型**：

* 等值连接

  ```sql
  SELECT Student.*,SC.*
  FROM Student,SC
  WHERE Student.Sno = SC.Sno;
  ```

* 自然连接

  ```sql
  SELECT 
  Student.Sno,Sname,Ssex,Sage,Sdept,Cno,Grade
  FROM Student,SC
  WHERE Student.Sno = SC.Sno;
  ```

* 自身连接

  ```sql
  SELECT FIRST.Cno,SECOND.Cpno
  FROM Course FIRST,Course SECOND
  WHERE FIRST.Cpno = SECOND.Cno;
  ```

#### 嵌套查询

一个SELECT-FROM-WHERE语句称为一个**查询块** 。

 将一个查询块嵌套在另一个查询块的WHERE子句或HAVING短语的条件中的查询称为嵌套查询

子查询的限制:不能使用ORDER BY子句

* 不相关子查询

  子查询的查询条件不依赖于父查询

  由里向外逐层处理。即每个子查询在上一级查询处理之前求解，子查询的结果用于建立其父查询的查找条件

* 相关子查询

  首先取外层查询中表的第一个元组，根据它与内层查询相关的属性值处理内层查询，若 WHERE子句返回值为真，则取此元组放入结 果表。

  然后再取外层表的下一个元组。

  重复这一过程，直至外层表全部检查完为止。

```sql
SELECT Sno,Sname,Sdept
FROM Student
WHERE Sdept IN
(SELECT Sdept
FROM Student
WHERE Sname='刘晨');

SELECT Sno,Cno
FROM SC x
WHERE Grade >=(SELECT AVG(Grade)
FROM SC y
WHERE y.Sno=x.Sno);

```

带有EXISTS谓词的子查询不返回任何数据 ，只产生逻辑真值“true”或逻辑假值 “false”。 

– 若内层查询结果非空，则外层的WHERE子句返回真值 

– 若内层查询结果为空，则外层的WHERE子句返回假值

由EXISTS引出的子查询，其目标列表达式 通常都用* ，因为带EXISTS的子查询只返回真值或假值，给出列名无实际意义

SQL语言中没有全称量词，可以把带有全称量词的谓词转换为等价的带有存在量词的谓词

SQL语言中没有蕴涵（Implication）逻辑运算，可以利用谓词演算对逻辑蕴涵谓词进行等价转换

```sql
SELECT Sname
FROM Student
WHERE EXISTS(SELECT *
FROM SC /*相关子查询*/
WHERE Sno=Student.Sno AND 
Cno='1');

SELECT Sno,Sname,Sdept
FROM Student S1
WHERE EXISTS
(SELECT *
FROM Student S2
WHERE S2.Sdept = S1.Sdept AND 
S2.Sname ='刘晨');

SELECT Sname
FROM Student
WHERE NOT EXISTS
(SELECT *
FROM Course
WHERE NOT EXISTS
(SELECT *
FROM SC
WHERE Sno= Student.Sno
AND Cno= Course.Cno));## 查询选修了全部课程的学生姓名

SELECT DISTINCT Sno
FROM SC SCX
WHERE NOT EXISTS
(SELECT *
FROM SC SCY
WHERE SCY.Sno ='95002' AND
NOT EXISTS
(SELECT *
FROM SC SCZ
WHERE SCZ.Sno= SCX.Sno AND
SCZ.Cno= SCY.Cno));## 查询至少选修了学生95002选修的全部课程的学生号码
```

#### 集合查询

```sql
<queryBlock>
UNION|INTERSECT|EXCEPT
<queryBlock>
```

* 并

  ```sql
  
  SELECT *
  FROM Student
  WHERE Sdept='CS'
  UNION
  SELECT *
  FROM Student
  WHERE Sage<=19;
  ```

* 交

  ```sql
  SELECT *
  FROM Student
  WHERE Sdept='CS'
  INTERSECT
  SELECT *
  FROM Student
  WHERE Sage<=19;
  ```

* 差

  ```SQL
  SELECT *
  FROM Student
  WHERE Sdept='CS'
  EXCEPT
  SELECT *
  FROM Student
  WHERE Sage<=19;
  ```

### 数据更新

* 插入

  ```sql
  INSERT INTO <tableName> [（<col1>[，<col2 >，…]）] VALUES （<value1> [，<value2>] … ）;
  
  INSERT INTO Student VALUES ('95020','陈冬','男',18,'IS');
  
  INSERT INTO Deptage(Sdept,Avgage) SELECT Sdept,AVG(Sage) FROM Student GROUP BY Sdept;
  ```

* 修改

  ```sql
  UPDATE <tableName> SET <col>=<Expression>[，<col>=<Expression>]… [WHERE <condition>]；
  
  UPDATE Student
  SET Sage=22
  WHERE Sno='95001';
  ```

* 删除

  ```sql
  DELETE
  FROM <tableName>
  [WHERE <condition>]；
  
  DELETE
  FROM Student
  WHERE Sno='95019';
  
  DELETE
  FROM SC;
  
  DELETE
  FROM SC
  WHERE 'CS'=
  (SELECT Sdept
  FROM Student
  WHERE Student.Sno=SC.Sno);
  ```

## 视图

虚表，从一个或几个基本表（或视图）导出的表

只存放视图的定义，不会出现数据冗余

基本表中数据发生改变时，从视图中查询出的数据也随之改变

### 创建视图

```sql
CREATE VIEW <viewName>[(<colName>[,<colName>]...)]
AS <subQuery>
[WITH CHECK OPTION];
```

#### 形式

* 行列子集视图

  ```sql
  CREATE VIEW IS_Student
  AS
  SELECT Sno,Sname,Sage
  FROM Student
  WHERE Sdept='IS';
  ```

* WITH CHECK OPTION的视图

  要求修改和插入时仍满足只有IS系学生

  ```sql
  CREATE VIEW IS_Student
  AS
  SELECT Sno,Sname,Sage
  FROM Student
  WHERE Sdept='IS'
  WITH CHECK OPTION;
  ```

  * 修改、删除时

    DBMS自动加上条件 Sdept='IS‘

  * 插入时

    DBMS自动检查Sdept是否为'IS'，不是则拒绝插入，未提供则自动补充为'IS'

* 基于多个基表的视图

  ```sql
  CREATE VIEW IS_S1(Sno,Sname,Grade)
  AS
  SELECT student.Sno,Sname,Grade
  FROM Student,SC 
  WHERE Sdept='IS' AND sTUDENT.Sno=SC.Sno AND SC.Cno='1';  
  ```

* 基于视图的视图

  ```sql
  CREATE VIEW IS_S2
  AS
  SELECT Sno,Sname,Grade
  FROM IS_S1
  WHERE Grade>=90;
  ```

* 带表达式的视图

  ```sql
  CREATE VIEW BT_S(Sno,Sname,Sbirth)
  AS 
  SELECT Sno,Sname,1996-Sage /*假定当年的年份为
  1996年*/
  FROM Student
  ```

* 分组视图

  ```sql
  CREATE VIEW S_G(Sno,Gavg)
  AS
  SELECT Sno,AVG(Grade)
  FROM Sno,AVG(Grade)
  FROM SC
  GROUP BY Sno;
  ```

### 删除视图

```sql
DROP VIEW <viewName>;
```

由该视图导出的视图定义仍在数据字典中，但已不能使用，必须显式删除

删除基表时，由该基表导出的所有视图定义都必须显式删除

### 查询视图

从用户角度，查询视图与查询基本表相同

* 视图实体化法(View Materialization)
  * 有效性检查：检查所查询视图是否存在
  * 执行试图定义，将视图临时实体化，生成临时表
  * 查询临时表
  * 查询完毕删除被实体化的视图
* 视图消解法（View Resolution）
  * 有效性检查：检查所查询视图是否存在
  * 将视图定义中的子查询与用户查询结合，转换成等价的对基本表的查询
  * 执行修正后的查询

### 更新视图

同样有实体化法和消解法

有些视图不可更新

## 数据控制

亦称为数据保护，包括数据的

* 安全性控制

  保护数据库，防止不合法的使用所造成的数据泄露和破坏

  GRANT、REVOKE

* 完整性控制

  数据库的完整性是指数据库中数据的正确性与相容性

  * 键 
  * 取值唯一的列 
  * 参照完整性 
  * 其他约束条件

* 并发控制

  当多个用户并发地对数据库进行操作时，对他们加以控制、协调，以保证并发操作正确执行，保持数据库的一致性。

* 恢复

  当发生各种类型的故障导致数据库处于不一致状态时，将数据库恢复到一致状态的功能

  回滚、重做（UNDO、REDO）

### 安全性

**授权**:DBA与表的属主可以建立

```sql
GRANT <authority1>[,<authority2>]...
[ON <targetType> <targetName>]
TO <userName>[,<userName>]...
[WITH GRANT OPTION];

#case
GRANT SELECT
ON TABLE Student
TO U1;

GRANT ALL PRIVILEGES
ON TABLE Student,Course
TO U2,U3;

GRANT SELECT
ON TABLE SC
TO PUBLIC;(all users)

GRANT UPDATE(Sno),SELECT
ON TABLE Student
TO U4;

GRANT CREATETAB
ON DATABASE S-T
TO U8;
```

* WITH GRANT OPTION：被授权对象可以传播权限

**收回**

```sql
REVOKE <authority1>[,<authority2>]...
[ON <targetType> <targetName>]
FROM <userName>[,<userName>]...;

REVOKE UPDATE(Sno)
ON TABLE Student
FROM U4;

REVOKE SELECT
ON TABLE SC
FROM PUBLIC;
```

## 嵌入式SQL

嵌入式SQL是将SQL语句嵌入程序设计语言中，被嵌入的程序设计语言，如C、C++、Java，称为宿主语言，简称主语言

```sql
EXEC SQL <SQLStatement>;
```

* SQL通信区

  SQLCA: SQL Communication Area

* 主变量

  Host Variable

* 游标

  游标是系统为用户开设的一个数据缓冲区，存放SQL语句的执行结果

```sql
EXEC SQL SELECT [ALL|DISTINCT] 
<expr>[,<expr>]...
INTO <host_var>[<indicator>]
[,<host_var>[<indicator>]]... 
FROM <tableorview>[,<tableorview>] ...
[WHERE <condition>]
[GROUP BY <colname1> [HAVING <condition>]]
[ORDER BY <colname2> [ASC|DESC]]；

EXEC SQL SELECT Sno, Sname, Ssex, Sage, 
Sdept
INTO :Hsno, :Hname, :Hsex, :Hage, :Hdept
FROM Student
WHERE Sno=:givensno；

EXEC SQL SELECT Sno, Sname, Ssex, Sage, 
Sdept
INTO :Hsno, :Hname, :Hsex, :Hage, :Hdept
FROM Student
WHERE Sno=:givensno；

EXEC SQL DELETE
FROM SC
WHERE Sno=
（SELECT Sno
FROM Student
WHERE Sname=:stdname）;
```

* 指示变量只能用于INTO子句中
* 如果INTO子句中主变量后面跟有指示变量，则当查询得出的某个数据项为空值时，系统会自动将相应主变量后面的指示变量置为负值，但不向该主变量执行赋值操作，即主变量值仍保持执行SQL语句之前的值
* 当发现指示变量值为负值时，不管主变量为何值，均应认为主变量值为NULL

### 游标

* 定义

  ```sql
  EXEC SQL DECLARE <cursorName> CURSOR
  FOR <SELECTStatement>；
  ```

  说明性语句，并不执行查询

* 打开

  ```sql
  EXEC SQL OPEN <cursorName>；
  ```

   打开游标实际上是**执行**相应的SELECT语句，把所有满足查询条件的记录从指定表取到缓冲区中
  –这时游标处于活动状态，指针指向查询结果集中第一条记录之前

* 推动

  ```sql
  EXEC SQL FETCH [[NEXT（default）|PRIOR|FIRST|LAST] FROM] <cursorName> 
  INTO <host_var>[<indicator>][,<host_var>[<indicator>]]...;
  ```

  指定方向推动游标指针，然后将缓冲区中的当 前记录取出来送至主变量供主语言进一步处理

* 关闭

  ```sql
  EXEC SQL CLOSE <cursorName>；
  ```

  关闭游标，释放结果集占用的缓冲区及其他资源

  游标被关闭后，就不再和原来的查询结果集相联系，被关闭的游标可以再次被打开，与新的查询结果相联系

## 查询处理

查询处理是指从数据库中提取数据所涉及的处理过程，包括将用户提交的查询语句转变为数据库的查询计划，并且执行这个查询计划获得查询结果

![image-20220530182950515](https://i.ibb.co/vDrnmfJ/image-20220530182950515.png)

连接操作实现

* 嵌套循环法（Nested Loop）
* 索引连接法（Index Join）
* 排序合并法（Sort-merge Join Merge Join）
* 散列合并法（Hash Join）

### 查询优化

#### 代数优化

通过对关系代数表达式的等价变换来提高查询效率

**启发式规则**：

* 选择运算应尽可能先做。
* 把投影运算和选择运算同时进行
* 把投影同其前或其后的双目运算结合起来
* 把某些选择同在它前面要执行的笛卡尔积结合起来成为一个连接运算
* 找出公共子表达式

#### 物理优化

代数优化改变查询语句中操作的次序和组合，不涉及底层的存取路径。
对于一个查询语句有许多存取方案，它们的执行效率不同， 仅仅进行代数优化是不够的。
物理优化就是要选择高效合理的操作算法或存取路径，求得优化的查询计划

* 基于存取路径
  * 选择操作
  * 连接操作
* 基于代数估算
* 两者结合

## 安全性

数据库的安全性是指保护数据库，防止因用户非法使用数据库造成数据泄露、更改或破坏

### 安全技术

* 访问控制技术

* 存取控制技术

  * 自主存取控制（Discretionary Access Control ，简称DAC）
    C2级、灵活
    同一用户对于不同的数据对象有不同的存取权限
    不同的用户对同一对象也有不同的权限
    用户还可将其拥有的存取权限转授给其他用户
  * 强制存取控制（Mandatory Access Control，简称 MAC）
    B1级、严格
    每一个数据对象被标以一定的密级
    每一个用户也被授予某一个级别的许可证
    对于任意一个对象，只有具有合法许可证的用户才
    可以存取

* 数据加密技术

* 数据库审计

  在数据库系统运行期间，记录数据库的访问情况，以利用审计数据分析数据库是否受到非法存取

在用户数量比较大的情况下，为了便于权限管理，需要引入角色的概念。

数据库角色：被命名的**一组**与数据库操作相关的**权限**。
– 角色是权限的集合
– 可以为一组具有相同权限的用户创建一个角色
– 简化授权的过程

```sql
CREATE ROLE <roleName>;

GRANT <authority> [,<authority>]...
ON <targetType> TargetName
TO <roleName>[,<roleName>]...

GRANT <role1>[，<role2>]…
TO <role3>[，<user1>]… 
[WITH ADMIN OPTION]

REVOKE <authority> [,<authority>]...
ON <targetType> TargetName
FROM <roleName>[,<roleName>]...
```

#### 强制存取

强制存取控制（MAC）是指系统为保证更高程度的安全性，按照TDI/TCSEC标准中安全策略的要求，所采取的强制存取检查手段

在MAC中，DBMS所管理的全部实体被分为主体和客体两大类

* 主体是系统中的活动实体
  – DBMS所管理的实际用户
  – 代表用户的各进程
* 客体是系统中的被动实体，是受主体操纵的
  – 文件
  – 基表
  – 索引
  – 视图

对于主体和客体，DBMS为它们每个实例（值）指派一个敏感度标记（Label）。
敏感度标记分成若干级

* 绝密（Top Secret）
* 机密（Secret）
* 可信（Confidential）
* 公开（Public）

– 主体的敏感度标记称为许可证级别（Clearance Level）。
– 客体的敏感度标记称为密级（Classification Level）。
– MAC机制就是通过对比主体的Label和客体的Label，最终确定主体是否能够存取客

* 仅当主体的许可证级别大于或等于客体的密级时，该主体才能读取相应的客体。
* 仅当主体的许可证级别等于客体的密级时，该主体才能写相应的客体

修正规则
– 主体的许可证级别 ≤客体的密级  主体能写客体
– 用户可为写入的数据对象赋予高于自己的许可证级别的密级。
– 一旦数据被写入，该用户自己也不能再读该数据对象。

### 审计

审计日志（Audit Log）将用户对数据库的所有操作记录在上面

* 用户级审计
  针对自己创建的数据库表或视图进行审计记录所有用户对这些表或视图的一切成功和（或）不成功的访问要求以及各种类型的SQL操作
* 系统级审计
  DBA设置监测成功或失败的登录要求监测GRANT和REVOKE操作以及其他数据库级权限下的操作

```sql
AUDIT(设置审计功能)

AUDIT ALTER，UPDATE 
ON SC；

NOAUDIT(取消审计功能)
NOAUDIT ALTER，UPDATE 
ON SC；

```

## 完整性

数据库的完整性是指数据的正确性、有效性和相容性，其主要目的是防止错误的数据进入数据库。

* 所谓正确性是指数据的合法性。
* 所谓有效性是指数据是否属于所定义的有效范围。
* 相容性是指表示同一事实的两个数据应相同，不一致就是不相容

### 实现方法

* 约束
* 默认值
* 规则
* 触发器

### 列级约束

主要是对属性的数据类型、数据格式和取值范围、精度等的约束。具体包括

* 对数据类型的约束，包括数据类型、长度、精度等的约束。例如学生姓名的数据类型是字符型，长度是20。
* 对数据格式的约束，例如规定日期的格式为YYYY/MM/DD。
* 对取值域的约束，例如学生成绩的取值范围必须是0～100。
* 对空值的约束 。

### 元组约束

一个元组是由若干个属性组成的，元组级约束就是元组中各个属性之间的约束关系。例如订货关系中发货日期不能小于订货日期，发货量不得超过订货量等

### 关系约束

关系约束是指一个关系的各个元组之间、或者多个关系之间存在的各种联系或约束。常见的关系约束有

* 实体完整性约束

  * 主键的值不能取空值
  * 主键的值唯一

  关系模型的实体完整性用PRIMARY KEY定义
  单属性构成的主键有两种说明方法：定义为列级约束条件、定义为表级约束条件
  对多个属性构成的主键只有一种说明方法：定义为表级约束条件
  PRIMARY KEY约束可以作为表定义的一部分在定义表时定义，也可以在表创建之后再添加

* 参照完整性约束

  参照完整性给出了数据表之间互相关联的基本要求，其核心是**不允许引用不存在的元组**，也就是说，外键字段的取值要么为空值，要么就是被引用关系中元组的对应值。

  参照完整性在CREATE TABLE中用FOREIGN KEY和REFERENCES定义

  – FOREIGN KEY短语指明表中的哪些字段是外键，REFERENCES短语指明该表中的外键所参照的数据表名和字段名。
  – FOREIGN KEY约束可以作为表定义的一部分在创建表时创建，也可以在已有表中创建FOREIGN KEY约束

* 用户自定义完整性约束

  用户定义的完整性就是针对某一具体应用的数据必须满足的语义要求

  * 列值非空（NOT NULL）
  * 列值唯一（UNIQUE）
  * 检查列值是否满足一个布尔表达式（CHECK）

  ```sql
  CONSTRAINT <constraintName>
  [PRIMARY KEY Statement
  |FOREIGN KEY Statement
  |CHECK Statement]

CREATE TABLE Student
  （Sno NUMERIC（6）
  CONSTRAINT C1 CHECK （Sno BETWEEN 90000 AND 99999）,
  Sname CHAR（20）
  CONSTRAINT C2 NOT NULL，
  Sage NUMERIC（3）
  CONSTRAINT C3 CHECK （Sage < 30），
  Ssex CHAR（2）
  CONSTRAINT C4 CHECK （Ssex IN （‘男’，‘女’）），
  CONSTRAINT StudentKey PRIMARY KEY（Sno）
  ）；
  
  ALTER TABLE Student
  DROP CONSTRAINT C1；
  ALTER TABLE Student
  ADD CONSTRAINT C1 CHECK （Sno BETWEEN 
  900000 AND 999999）；
  ALTER TABLE Student
  DROP CONSTRAINT C3；
  ALTER TABLE Student
  ADD CONSTRAINT C3 CHECK （Sage < 40）;
  ```

* 函数依赖约束

* 统计约束

### 触发器

触发器是一种特殊类型的存储过程，在对表或视图发出 UPDATE、INSERT 或DELETE 语句时自动执行

```sql
CREATE TRIGGER <triggerName> 
{ BEFORE | AFTER} <triggerEvent> ON <tableName>
FOR EACH {ROW | STATEMENT}
[WHEN <triggerCondition>]
<triggerBody>

CREATE TRIGGER Insert_Or_Update_Sal
BEFORE INSERT OR UPDATE ON Teacher 
/*触发事件是插入或更新操作*/
FOR EACH ROW /*行级触发器*/
AS BEGIN /*定义触发动作体，是PL/SQL过程块*/
IF （new.Job=‘教授’）AND （new.Sal < 4000）
THEN 
new.Sal :=4000; 
END IF；
END；

CREATE TRIGGER Insert_Sal
AFTER INSERT ON Teacher 
/*触发事件是INSERT*/
FOR EACH ROW
AS BEGIN
INSERT INTO Sal_log VALUES（
new.Eno，new.Sal，CURRENT_USER，
CURRENT_TIMESTAMP）；
END；

CREATE TRIGGER Update_Sal
AFTER UPDATE ON Teacher
/*触发事件是UPDATE */
FOR EACH ROW
AS BEGIN 
IF （new.Sal <> old.Sal）
THEN INSERT INTO Sal_log VALUES（
new.Eno，new.Sal，CURRENT_USER，
CURRENT_TIMESTAMP）；
END IF；
END；

DROP TRIGGER <triggerName> ON <t>；
```

* BEFORE
  表示在触发事件进行以前，判断触发条件是否满足若满足条件则先执行触发动作部分的操作然后再执行触发事件的操作
* AFTER
  表示在触发事件完成之后，判断触发条件是否满足若满足条件则执行触发动作部分的操作如果触发事件因错误（如违反约束或语法错误）而失败，触发器将不会执行
* 行级触发器（FOR EACH ROW）
  对每一个修改的元组都会触发触发器的检查和执行
* 语句级触发器（FOR EACH STATEMENT）
  只在SQL语句执行时候进行触发条件的检查和触发器的执行

## 恢复

### 事务（Transaction）

用户定义的一个数据库操作序列，是一个不可分割的工作单位

事务是恢复和并发控制的基本单位

* 显式定义

  ```sql
  BEGIN TRANSACTION
  SQL Statement1
  SQL Statement2
  … … … …
  COMMIT|ROLLBACK
  ```

  * COMMIT：事务正常结束

* 隐式定义

  当用户没有显式地定义事务时，DBMS按缺省 规定自动划分事务

四个特征（ACID特性）

* 原子性（Atomicity）

  事务是数据库操作的逻辑工作单位，不可分割

* 一致性（Consistency）

  事务执行的结果必须从一个状态转换到另一个状态时保持一致

* 隔离性（Isolation）

  一个事务的执行不能影响到另一个事务，即一个事务的内部操作相对于外部事务是隔离的，并发执行事务时事务间不能相互干扰

#### 事务状态

* 活动状态（active）

  初始状态，事务执行时处于活动状态

* 部分提交状态（partially committed）

  事务最后一条语句执行完毕后进入部分提交状态，此时事务中对数据的操作已经全部完成，但结果数据还驻留在内存中

* 失败状态（failed）

  事务不能正常执行，必须回滚

* 中止状态（aborted）

  事务回滚并且数据库已经恢复到事务执行前的状态

* 提交状态（committed）

  数据库系统将事务中对数据的更改完全写入磁盘时，写入一条事务日志信息，标志着事务成功完成

### 故障

某个事务在运行过程中由于种种原因未运行至正常终止点就夭折了

* 系统故障

  整个系统的正常运行突然被破坏，所有正在运行的事务都非正常终止，内存中数据库缓冲区的信息全部丢失，外部存储设备上的数据未受影响

  恢复：

  反向UNDO处理Undo队列事务

  正向REDO处理Redo队列事务

* 事务内部的故障

* 存储设备故障

  硬件故障使存储在外存中的数据部分丢失或全部丢失

  恢复：

  装入数据库发生介质故障前某个时刻的数据副本

  重做自此时始的所有成功事务，将结果重新记入数据库

* 其他原因

#### 故障恢复

由恢复子系统利用日志文件撤销（UNDO）此事务已对数据库进行的修改

### 关键问题

* 如何建立冗余数据
  * 数据转储（backup）
  * 登记日志文件（logging）
* 如何利用冗余数据进行数据库恢复

### 转储

DBA将整个数据库复制到磁带或另一个磁盘上保存起来的过程，备用的数据称为后备副本或者后援副本

* 转储状态

  * 静态转储

    在系统中无运行事务时进行转储，转储期间不允许对数据库进行任何的存取、修改活动

  * 动态转储

    转储操作与用户事务并发进行，转储期间允许对数据库进行存取或修改

    不能保证副本中的数据正确有效，需加上日志文件才能把数据库恢复至某一时刻的正确状态

* 转储方式

  * 海量转储

    每次转储全部数据库

  * 增量转储

    只转储上次转储后更新过的数据

### 日志文件

用来记录事务对数据库的更新操作的文件

#### 格式

* 以记录为单位的日志文件
* 以数据块为单位的日志文件

#### 内容

* 各事务开始标记（BEGIN TRANSACTION）
* 各事务结束标记（COMMIT|ROLLBACK）
* 各事务所有更新操作
* 与事务有关的内部更新操作
* 日志文件中的一个日志记录（log record）

基于记录

* 事务标识
* 操作类型（插入、删除、修改）
* 操作对象（记录ID、BLOCK NO.）
* 更新前数据的旧值
* 更新后数据的新值

基于数据块

* 事务标识
* 操作对象（记录ID、BLOCK NO.）
* 更新前数据所在整个数据块的值
* 更新后整个数据块的值

#### 规则

为保证数据库可恢复，登记日志文件时必须遵循

* 登记的次序严格按照并行事务执行的时间次序
* 必须先写日志文件，后写数据库（把标识修改的日志记录写至日志文件，把对数据的修改写至数据库）

#### 检查点（CheckPoint）

在日志文件中增加检查点记录（checkpoint）

增加重新开始文件

恢复子系统在登记日志文件期间动态地维护日志

记录：

* 建立检查点时刻所有正在执行的事务清单
* 这些事务最近的一个日志记录的地址

### 数据库镜像恢复

介质故障是对系统影响最为严重的一种故障，严重影响数据库的可用性

数据库镜像：

在不同的设备上同时存在两份数据库，一个是主设备，一个是镜像设备，每当主设备的数据库发生更新是，系统自动更新镜像设备的数据，使得两个设备的数据始终保持一致

## 并发

不同的事务执行方式

* 事务串行执行

  每个时刻只有一个事务运行，不能充分利用系统资源

* 交叉并发方式（Interleaved Concurrency）

  在单处理机系统中，事务的并行执行是这些并行事务的并行操作轮流交叉进行，没有真正并行运行，但能提高系统效率

* 同时并发方式（simultaneous concurrency）

  多处理机系统中，每个处理机运行一个事务，多个处理机同时运行多个事务

### 异常

* 丢失修改（Lost Update）
* 不可重复读（Non-Repeatable Read）
* 读”脏“数据（Dirty Read）

### 可串行化调度

**调度（Schedule）**：并发事务的操作顺序

**可串行化调度**：多个事务并发执行的结果与按某一次序穿行执行的结果相同

**可串行性**：并发事务正确调度的准则

**冲突操作**：不同事务对同一个数据的读写操作和写写操作

**冲突等价**：一个调度S能通过一系列非冲突操作执行顺序的交换变成调度S1，称S与S1冲突等价

不可交换：

* 冲突操作
* 同一事务内的两个操作

**冲突可串行化调度**：调度Sc可在保证冲突操作的次序不变的情况下通过交换两事务不冲突操作的次序得到可串行化调度

**数据库状态等价性**：在数据库初始状态相同时，等价的调度能产生同样的数据库状态

**调度状态可串行**：该调度等价于一个串行调度

冲突可串行化调度是可串行化调度的充分条件

**可串行化测试**：

* Ti在Tj Read(A)或者Write(A)之前Write(A)或Read(A)
* Ti在Tj Write(A)之前Write(A)

则连Ti->Tj

若结果出现回路则不是冲突可串行，否则是冲突可串行

### 封锁

事务T在对某个数据对象（表、记录）操作之前，先向系统发出请求，对其加锁，在事务T释放锁之前，其他的事务不能更新此数据对象

* 排它锁（Exclusive Locks）X锁   （写锁）

  只允许T读取和修改A，其他任何事务不能再对A加任何类型的锁

* 共享锁（Share Locks) S锁   （读锁）

  其他事务只能对A再加S锁，不能加X锁，可以读A，但不能对A做任何修改

锁的正确使用要保证

* 事务的一致性
* 调度的合法性

#### 一级封锁协议

事务T在修改数据之前必须先加X锁，直到事务结束释放

可防止丢失修改

#### 二级封锁协议

一级+读数据前加S锁，读完即可释放S锁

可防止丢失修改、读”脏“数据

#### 三级封锁协议

一级+读数据前加S锁，事务结束才释放

可防止丢失修改，读”脏“数据、不可重复读

#### 活锁

请求不断被后来者覆盖

先来先服务可解决

#### 死锁

两个封锁者等待彼此释放

##### 防止

* 一次封锁法：要求每个事务一次将所有要使用的数据全部加锁

  降低并发度

  难以事先精确确定封锁对象

* 顺序封锁法：余线对数据对象规定封锁顺序

  维护成本高

  难以实现

* 事务重试法：回滚其中一个事务

##### 检测

* 超时法
* 事务等待图法：形成事务等待图，周期性检测事务等待图寻找回路

#### 两阶段封锁协议（Two-Phase Locking 2PL）

所有事务分两个阶段对数据项加锁和解锁，在读写之前获得锁，释放锁之后不再申请和获得其他封锁

并行执行的所有事务均遵守两阶段封锁协议，则对这些事务的所有并行调度策略都是可串行化的

遵循第三级封锁协议必然遵守两阶段封锁协议

#### 锁表

锁管理器为目前已加所的数据项维护一个记录链表，每个锁请求为一个记录，按请求到达顺序排序

### 多粒度封锁

封锁粒度（Granularity）：封锁对象的大小

在一个系统中同时支持多种封锁粒度供不同的事务选择

#### 多粒度封锁协议

允许多粒度树中的贝格节点被独立地加锁

对一个结点加锁意味着对所有后裔加同样的锁

一个数据对象可能以两种方式封锁：显式封锁和隐式封锁

#### 意向锁

**目的**：提高对某个数据对象加锁时系统的检查效率

**内容**：对任一结点加基本锁必须先对上层结点加意向锁，对任一结点加意向锁说明下层结点正在被封锁

* 意向共享锁（Intent Share Lock) IS锁
* 意向排它锁（Intent Exclusive Lock）IX锁
* 共享意向排它锁（Share Intent Exclusive Lock） SIX锁=S+IX

**锁的强度**：对其他锁的排斥程度

![image-20220609212512191](https://i.ibb.co/0j3Z3DN/image-20220609212512191.png)

具有意向锁的多粒度封锁：

* 申请时自上向下
* 释放时自下向上
