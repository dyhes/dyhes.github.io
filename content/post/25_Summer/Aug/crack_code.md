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

