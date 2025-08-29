---
title: 【Reading】《Cracking the Coding Interview》
date: 2024-08-22 00:00:00+0000
categories: 
    - arts
tags: [Reading]
---

## Introduction



From the company's perspective, it's actually acceptable that some good candidates are rejected. They're far more concerned with false positives: people who do well in an interview but are not in fact very good.



At the vast majority of companies, there are no lists of what interviewers should ask. Rather, each interviewer selects their own questions.

Since it's somewhat of a "free for all" as far as questions, there's nothing that makes a question a "recent Google interview question" other than the fact that some interviewer who happens to work at Google just so happened to ask that question recently.

The questions asked this year at Google do not really differ from those asked three years ago. In fact, the questions asked at Google generally don't differ from those asked at similar companies (Amazon, Facebook, etc.).



Interviewers assess you relative to other candidates on that same question by the same interviewer. It's a relative comparison.

Your interviewer develops a fee! for your performance by comparing you to other people. It's not about the candidates she's interviewing *that* week. It's about all the candidates that she's ever asked this question to.

For this reason, getting a hard question isn't a bad thing. When it's harder for you, it's harder for everyone, it doesn't make it any less likely that you**'ll** do well.



"Why do you want to work for Microsoft?"

"I've been using Microsoft software as long as I can remember, and I'm really impressed at how Microsoft manages to create a product that is universally excellent. For example, I've been using Visual Studio recently to learn game programming, and its APIs are excellent." 



Some questions have "Aha!" moments. They rest on a particular insight. If the candidate doesn't get that one bit, then they do poorly. If they get it, then suddenly they've outperformed many candidates.

Even if that insight is an indicator of skills, it's still only one indicator. Ideally, you want a question that has a series of hurdles, insights, or optimizations. Multiple data points beat a single data point.



The knowledge you are expecting candidates to have should be fairly straightforward data structure and algorithm knowledge. It's reasonable to expect a computer science graduate to understand the basics of big O and trees. Most won't remember Dijkstra's algorithm or the specifics of how AVL trees works.



Your resume does not—and should not—include a full history of every role you've ever had. Include only the relevant positions—the ones that make you a more impressive candidate.



For each role, try to discuss your accomplishments with the following approach:"Accomplished X by implementing Y which led to Z." 

* "Reduced object rendering time by 75% by implementing distributed caching, leading to a 10% reduction in log-in time."
* "Increased average match accuracy from 1.2 to 1.5 by implementing a new comparison algorithm based on windiff."

Not everything you did will fit intothis approach, butthe principle is the same: show what you did, how you did it, and what the results were. Ideally, you should try to make the results "measurable" somehow.



* *Genuine Questions*

* *Insightful Questions*

* *Passion Questions*

  "I'm very interested in scalability, and I'd love to learn more about it. What opportunities are there at this

  company to learn about this?"

  "I'm not familiar with technology X, but it sounds like a very interesting solution. Could you tell me a bit

  more about how it works?"

Project

* The project had challenging components (beyond just "learning a lot").
* You played a central role (ideally on the challenging components).
* You can talk at technical depth.



**Give Structured Answers**

* Nugget First: Nugget First means starting your response with a "nugget" that succinctly describes what your response will be about.
* *S.A.R. (Situation, Action, Result)*: The S.A.R, approach means that you start off outlining the situation, then explaining the actions you took,

In almost all cases, the "action" is the most important part of the story. Unfortunately, far too many people talk on and on about the situation, but then just breeze through the action.

![image-20250822215130897](/Users/hongpeng.lin/Library/Application Support/typora-user-images/image-20250822215130897.png)



* Listen Carefully
* Draw an Example
* State a Brute Force
* Optimize
  * Look for any unused information
  * Make time vs. space tradeoff
  * Precompute information



Optimize

Look for BUD

* Bottlenecks
* Unnecessary work
* Duplicated work

## Arrays and Strings

> 方阵旋转 90 度

通过**转置矩阵 + 水平翻转**实现，空间复杂度为O(1)

**转置矩阵**：沿主对角线（主对角线上的元素满足 **行索引等于列索引**）交换元素



> Zero Matrix: Write an algorithm such that if an element in an MxN matrix is 0, its entire row and column are set to 0.

**利用矩阵自身存储标记**：

- 使用**第一行**记录各列是否需要清零（`matrix[0][j] = 0`表示第 `j`列需清零）。
- 使用**第一列**记录各行是否需要清零（`matrix[i][0] = 0`表示第 `i`行需清零）。
- **额外变量**标记第一行和第一列自身是否需要清零（避免覆盖标记信息）



> 要判断字符串 `s2`是否为 `s1`的旋转字符串（例如 `s1 = "waterbottle"`, `s2 = "erbottlewat"`），且仅调用一次 `isSubstring`方法

若 `s2`是 `s1`的旋转字符串，则 `s2`一定包含在 `s1 + s1`的拼接字符串中。

## Linked Lists

The "runner" (or second pointer) technique is used in many linked list problems. The runner technique means that you iterate through the linked list with two pointers simultaneously, with one ahead of the other. The "fast" node might be ahead by a fixed amount, or it might be hopping multiple nodes for each one node that the "slow" node iterates through.



A number of linked list problems rely on recursion. If you're having trouble solving a linked list problem, you should explore if a recursive approach will work. However, you should remember that recursive algorithms take **at least 0 ( n ) space**, where n is the depth of the recursive call. **All recursive algorithms *can* be implemented iteratively**, although they may be much more complex.



> Write code to remove duplicates from an unsorted linked list. How would you solve this problem if a temporary buffer is not allowed?

* 有缓冲：哈希表
* 无缓冲：双重循环



> implement an algorithm to find the kth to last element of a singly linked list

快指针先走 k 步



> Implement an algorithm to delete a node in the middle (i.e., any node but the first and last node, not necessarily the exact middle) of a singly linked list, given only access to that node.

将目标节点的值替换为其后继节点的值，然后跳过后继结点

低效方法：从目标节点开始，将后续所有节点的值向前复制一位，最后将尾节点置空



> Given two (singly) linked lists, determine if the two lists intersect.

走完自己走对方，若相交则会于交点



> Given a circular linked list, implement an algorithm that returns the node at the beginning of the loop.

**检测环的存在**：快指针（步长2）和慢指针（步长1）若相遇，则链表有环。

**定位环起点**：

- 将慢指针重置到链表头。
- 快慢指针均以步长1移动，再次相遇的节点即为环起点

## Stack & Queue

> Describe how you could use a single array to implement three stacks.

* **空间高效方案（两端栈 + 可移动中间栈）**

  * **栈1**​：从数组起始位置（索引0）向右生长。
  * **栈2**：从数组末尾（索引`n-1`）向左生长。
  * **栈3**：起始于数组中部，可向左/右动态移动以避免碰撞。

* **链表式方案（动态节点分配）**

  将数组划分为节点池，每个节点包含：

  * `value`：存储数据。
  * `prev`：指向上一个节点的索引（模拟链表指针）。
  * 额外维护**空闲列表**（Free List）管理未用节点。

* **固定分区方案（静态均分）**



> Stack Min: How would you design a stack which, in addition to push and pop, has a function min which returns the minimum eiement? Push, pop and min should ail operate in 0 ( 1 ) time.

**Pair 单栈法**

**差值法**

- **原理**：栈中存储 **`val - min_val`**，并用变量 `min_val`动态维护当前最小值。
- **操作**：
  - `push(val)`: 计算 `diff = val - min_val`，压入 `diff`；若 `val < min_val`，更新 `min_val = val`。
  - `pop()`: 若栈顶 `diff < 0`，需更新 `min_val = min_val - diff`。
  - `top()`: 若栈顶 `diff < 0`，返回 `min_val`；否则返回 `min_val + diff`。
- **优势**：空间优化（仅需一个栈），但边界处理复杂



> Sort Stack: Write a program to sort a stack such that the smallest items are on the top. You can use an additional temporary stack, but you may not copy the elements into any other data structure (such as an array). The stack supports the following operations: push, pop, peek, and isEmpty.

类似插入排序

若 `auxStack`非空且其栈顶元素 > `temp`，则将其弹出并压回原栈（`inputStack.push(auxStack.pop())`），直至找到 `temp`的正确插入位置

- **弹出原栈顶元素**：`temp = inputStack.pop()`
- **动态调整临时栈**：若 `auxStack`非空且其栈顶元素 > `temp`，则将其弹出并压回原栈（`inputStack.push(auxStack.pop())`），直至找到 `temp`的正确插入位置
- **插入元素**：将 `temp`压入 `auxStack`，此时 `auxStack`保持降序（栈顶最大）



> 动物收容所系统（仅收容猫和狗），需遵循“先进先出”规则，并支持三种领养操作（领养最老动物、领养最老狗、领养最老猫）

id 作为隐式的时间戳



## Trees & Graphs

> Given a directed graph, design an algorithm to find out whether there is a route between two nodes.

首选 BFS（保证最短路径），次选 DFS

大规模图优化

- **双向 BFS**：从起点和终点同时搜索，相遇即终止，减少搜索空间
- **迭代加深 DFS**：限制深度逐步增加，平衡 DFS 空间效率与 BFS 完备性



> Implement a function to check if a binary tree is balanced.

自底向上（后序）：**先计算左右子树高度**，再判断当前节点平衡性（即“左右中”顺序），提前终止



> 公共祖先

* 最优：递归后序

  * **终止条件**：

    - 当前节点为空 → 返回 `null`。
    - 当前节点是 `p`或 `q`→ 直接返回该节点（因其可能是祖先或目标本身）。

    **递归搜索**：

    - 在左子树中搜索 `p`或 `q`。
    - 在右子树中搜索 `p`或 `q`。

    **结果合并**：

    - 若左右子树均返回非空 → 当前节点是 LCA（因 `p`和 `q`分属两侧）。
    - 若仅左子树非空 → 返回左子树结果（LCA 在左侧）。
    - 若仅右子树非空 → 返回右子树结果（LCA 在右侧）。
    - 若均空 → 返回 `null`。

* 次优：哈希表存储父节点



> Check Subtree: T1 and T2 are two very large binary trees, with T1 much bigger than T2. Create an algorithm to determine if 12 is a subtree o f T l . AtreeT2 is a subtree of T1 if there exists a node n in T1 such that the subtree of n is identical to 12, That is, if you cut off the tree at node n, the two trees would be identical. （值相等）

基础：递归匹配， 最坏 O(mn)

优化：高度过滤

**超大规模树优化**：字符串序列化 + KMP



> “Paths with Sum: You are given a binary tree in which each node contains an integer value (which might be positive or negative). Design an algorithm to count the number of paths that sum to a given value. The path does not need to start or end at the root or a leaf, but it must go downwards (traveling only from parent nodes to child nodes).”

暴力递归：时间复杂度 O(n^2)

**前缀和 + 哈希表 + DFS 回溯**

1. **前缀和定义**：

   记录从根节点到当前节点的路径和 `currSum`。若存在节点 A和 B满足 currSumB−currSumA=targetSum，则 A→B的路径和即为目标值。

2. **哈希表作用**：

   存储路径前缀和及其出现次数，键为 `currSum`，值为出现次数。

3. **回溯机制**：

   在 DFS 递归返回时，移除当前节点的前缀和，确保不同分支的路径计算互不干扰



> Random Node: You are implementing a binary tree class from scratch which has a method getRandomNode() which returns a random node from the tree. All nodes should be equally likely to be chosen.

在二叉树类中实现 `getRandomNode()`方法（确保所有节点被选中的概率严格相等）的最佳算法是 **子树大小统计法**，结合高效的随机数生成和平衡树优化。

```cpp
struct TreeNode {
    int val;
    int size;          // 当前子树节点总数（含自身）
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), size(1), left(nullptr), right(nullptr) {}
};
```

**子树大小维护**

- **插入时**：递归更新路径上所有节点的 `size`（`size = 1 + left_size + right_size`）
- **删除时**：同步更新 `size`，并处理后继节点替换逻辑（避免 size 统计错误）
- **时间复杂度**：`insert`和 `remove`均为 `O(h)`（`h`为树高）

**随机节点选择**

- **算法**：从根节点开始，根据左子树大小 `leftSize`和随机数 `randIndex`决定搜索方向：
  - `randIndex < leftSize`→ 进入左子树
  - `randIndex == leftSize`→ 返回当前节点
  - `randIndex > leftSize`→ 进入右子树

## **Bit Manipulation**

Bit manipulation is used in a variety of problems. Sometimes, the question explicitly calls for bit manipulation. Other times, it's simply a useful technique to **optimize** your code. 

> ( (n & ( n - 1 ) ) == 0)

n & ( n - 1 ) 去除最后一个 1

* 判断是否只含一个 1 （即 2 的幂）



> 汉明距离：二进制不同位数量

异或后求 1 数



> 整数奇偶位交换

**提取奇偶位**

- **奇数位掩码** `0xAAAAAAAA`（32位：`10101010...1010`）→ 提取第1、3、5...位
- **偶数位掩码** `0x55555555`（32位：`01010101...0101`）→ 提取第0、2、4...位

**位移交换位置**

- 奇数位 **右移1位**（原位置1→位置0）
- 偶数位 **左移1位**（原位置0→位置1）

**合并结果**

- 移位后的奇偶位通过 **按位或（`|`）** 合并为新整数



> 给定正整数后寻找二进制表示中“1”的个数相同的最接近较大数和较小数的问题



## **Math and Logic Puzzles**

The good news is that if you are asked a puzzle or brainteaser, it's likely to be a reasonably fair one. It probably won't rely on a trick of wording, and it can almost always be logically deduced. Many have their foundations in mathematics or computer science, and almost all have solutions that can be logically deduced.



> The Heavy Pill: You have 20 bottles of pills. 19 bottles have 1.0 gram pills, but one has pills of weight 1.1 grams. Given a scale that provides an exact measurement, how would you find the heavy bottle? You can only use the scale once.

1. 将20瓶药丸编号从1到20。
2. 从第1瓶取1粒药丸，从第2瓶取2粒药丸，依此类推，从第20瓶取20粒药丸。
3. 将所有取出的药丸一起放在天平上称重，得到总重量W。

如果所有药丸都是1.0克，理论总重量应为（1+2+3+...+20）×1.0 = 210克。但由于有一瓶药丸是1.1克，实际重量W会大于210克。多出的重量ΔW = W - 210克，是由于重药丸每粒多0.1克造成的。

因此，重药丸的瓶子编号m可以通过计算ΔW / 0.1得到，即m = ΔW / 0.1。例如，如果W = 210.5克，则ΔW = 0.5克，m = 0.5 / 0.1 = 5，表示第5瓶是重的。

通过这种方法，只需一次称重就能准确找出重药丸的瓶子。

> Jugs of Water: You have a five-quart jug, a three-quart jug, and an unlimited supply of water (but no measuring cups). How would you come up with exactly four quarts of water? Note that the jugs are oddly shaped, such that filling up exactly "half" of the jug would be impossible.

要得到恰好四夸脱的水，使用五夸脱壶和三夸脱壶，按照以下步骤操作：

1. 填满五夸脱壶（此时五夸脱壶有5夸脱，三夸脱壶有0夸脱）。
2. 将五夸脱壶中的水倒入三夸脱壶，直到三夸脱壶满（此时五夸脱壶剩2夸脱，三夸脱壶有3夸脱）。
3. 倒空三夸脱壶（此时五夸脱壶有2夸脱，三夸脱壶有0夸脱）。
4. 将五夸脱壶中的水倒入三夸脱壶（此时五夸脱壶有0夸脱，三夸脱壶有2夸脱）。
5. 填满五夸脱壶（此时五夸脱壶有5夸脱，三夸脱壶有2夸脱）。
6. 将五夸脱壶中的水倒入三夸脱壶，直到三夸脱壶满（三夸脱壶已有2夸脱，只能接受1夸脱，因此五夸脱壶倒出1夸脱后剩4夸脱）。

现在，五夸脱壶中恰好有4夸脱水。

> Blue-Eyed Island: A bunch of people are living on an island, when a visitor comes with a strange order: all blue-eyed people must leave the island as soon as possible. There will be a flight out at 8:00 pm every evening. Each person can see everyone else's eye color, but they do not know their own (nor is anyone allowed to tell them). Additionally, they do not know how many people have blue eyes, although they do know that at least one person does. How many days will it take the blue-eyed people to leave?

### **推理过程（归纳法）**

#### **情形1：只有1个蓝眼睛的人**

- **第1天**：此人看到岛上无人有蓝眼睛，但访客说“至少有一人是蓝眼睛”，因此立即推断自己是蓝眼睛。
- **结果**：第1天晚上离开。

#### **情形2：有2个蓝眼睛的人（A和B）**

- **第1天**：
  - A看到B是蓝眼睛，心想：“如果我不是蓝眼睛，B今晚会离开（因为B会看到岛上只有他自己是蓝眼睛）”。
  - B同样推理，因此两人均不行动。
- **第2天**：
  - A发现B未离开 → 推断“B一定也看到了另一个蓝眼睛的人” → 此人只可能是自己。
  - B同步推理出相同结论。
- **结果**：第2天晚上两人同时离开。

#### **情形3：有3个蓝眼睛的人（A、B、C）**

- **第1天**：每人看到两个蓝眼睛的人，均认为“如果我不是蓝眼睛，另外两人会在第2天离开”（参考情形2）。
- **第2天**：无人离开 → 每人意识到：“如果我不是蓝眼睛，其他两人应已离开。但事实未发生，说明我也一定是蓝眼睛”。
- **第3天**：所有人同时离开。

------

### **通用规律：若有 n个蓝眼睛的人**

- **离开时间**：所有人会在第 n天晚上同时离开。
- **推理逻辑**：
  1. 访客的声明使“至少一人是蓝眼睛”成为公共知识。
  2. 第 k天无人离开，意味着“蓝眼睛人数 ≥k”。
  3. 每个蓝眼睛的人通过观察他人未离开的天数，逐步排除“蓝眼睛人数 <k”的可能性。
  4. 到第 n天，所有人同步推断出自己也是蓝眼睛。

✅ **公共知识的作用**：若访客未公开声明（例如私下告知每个人），则公共知识不成立，无人能离开。

> "100 Lockers: There are 100 closed lockers in a hallway. A man begins by opening all 100 lockers. Next, he doses every second locker. Then, on his third pass, he toggles every third locker (closes it if it is open or opens it if it is closed). This process continues for 100 passes, such that on each pass i, the man toggles every i t h locker. After his 100th pass in the hallway, in which he toggles only locker #100, how many lockers are open?"

关键：因数成对出现，因此只有完全平方数会打开

锁柜最终是否打开取决于它被切换的次数。由于初始状态为关闭，奇数次切换后锁柜打开，偶数次切换后锁柜关闭。

每个锁柜被切换的次数等于其编号的因数个数。例如，锁柜n会被切换当且仅当i是n的因数（i从1到100）。

因此，锁柜打开当且仅当其编号的因数个数为奇数。只有完全平方数有奇数个因数，因为因数成对出现，但平方数的平方根只计算一次。

在1到100之间，完全平方数有10个：1, 4, 9, 16, 25, 36, 49, 64, 81, 100。

因此，经过100次操作后，有10个锁柜是打开的。

## DataBase

去 leetcode 训练

