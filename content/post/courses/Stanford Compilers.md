---
title: 【Stanford Compilers】Notes
date: 2023-06-06 00:00:00+0000
categories: 
  - star
---

Purpose of the compiler is

* to detect non-valid programs
* to translate to valid ones

## Lexical Analysis

partition the strings into tokens 

**Token Class**: Identifier, Keyword ...

### **Regular Languages**

Def. The regular expressions over $\sum$ are the smallest set of expressions including

* Union
* Concatenation
* Iteration

### **Formal Languages**

Def. Let $\sum$ be a set of characters (an alphabet). A language over $\sum$ is **a set of strings of characters** drawn from $\sum$

> A regular language is a type of formal language that **can be generated by a regular expression or recognized by a finite automaton (FA)**. Regular languages are a subset of the class of formal languages.

>   meaning(mapping from syntax to semantics) is many to one rather than one to many.

### **Lexical Specification**

* maximal match

* prioritized match

* Error match

  Error = {all strings not in the lexical specification}

### **Finite Automata**

* regular expressions = specification
* finite automata = implementation

a finite automaton consists of

* An input alphabet $\sum$
* A set of states $S$
* A start state $n$
* A set of accepting states $F\subseteq S$
* A set of transitions $state \rightarrow^{input} state$

####  **Deterministic Finite Automata(DFA)**

* one transition per input per state
* No $\epsilon-$moves

#### **Nondeterministic Finite Automata(NFA)**

* can have multiple transitions for one input in a given state
* can have $\epsilon-$moves

DFAs are faster to execute

![image-20230310211302078](https://i.ibb.co/VQvZzgS/image-20230310211302078.png)

##### **Subset Method for NFA Determinization**

* $\epsilon-closure$
* transition

##### **Partition Method for DFA Minimization**

## Syntactic Analysis (Parsing)

### **CFG**

CFG (context-free grammars) are a natural notation for the recursive structure of programming languages.

A CFG consists of

* A set of terminals $T$
* A set of non-terminals $N$
* A start symbol $S$
* A set of productions (Productions can be read as rules)

**steps:**

1. Begin with a string with only the start symbol $S$
2. Replace any non-terminal $X$ in the string by the right-hand side of some production $X \rightarrow Y_1...Y_n$
3. Repeat 2. until there are no non-terminals

Def. Let $G$ be a context-free grammar with start symbol $S$. Then the language $L(G)$ of $G$ is:
$$
{a_1...a_n| a}
$$

* Terminals are so-called because there are no rules for replacing them
* Once generated, terminals are permanent
* Terminals ought to be tokens of the language

### Derivations

A derivation is a sequence of productions
$$
S\rightarrow ... \rightarrow ... \rightarrow ... \rightarrow ... 
$$
A derivation can be drawn as a tree

* start symbol is the tree's root
* For a production $X\rightarrow Y_1...Y_n$ add children $Y_1...Y_n$ to node $X$

left-most derivation: at each step, replace the left-most non-terminal

right-most derivation: at each step, replace the right-most non-terminal

> right-most and left-most derivations have the same parse tree

### Parse Tree

A parse tree  has

* terminals at the leaves
* non-terminals at the interior nodes

A in-order traversal of the leaves is the original input

The parse tree shows the association of operations, the input string does not

### Ambiguity

A grammar is ambiguous if it has more than one parse tree for some string. Equivalently, there is more than one right-most or left-most derivation for some string

* Impossible to convert automatically an ambiguous grammar to an unanbiguous one
* Used with care, ambiguity can simplify the grammar
  * sometimes allows more natural definitions  
  * we need disambiguation mechanisms
* most tools allow **precedence and associativity declarations** to disambiguate grammars

### Error Handling

#### Panic mode

* when an error is detected:
  * discard tokens until one with a clear role is found
  * continue from there
* Looking for synchronizing tokens
  * typically the statement or expression terminators

#### Error productions

specify known common mistakes in the grammar

#### Abstract Syntax Tree

Like parse trees but ignore some details

**A parse tree**

* Traces the operation of the parser
* Captures nesting structure
* But too much information
  * Parentheses
  * Single-successor nodes

**Abstract Syntax Tree**

* Also captures the nesting structure
* But abstracts from the concrete syntax
  * more compact and easier to use
* An important data structure in a compiler

### Recursive Descent Algorithm

* The parse tree is constructed
  * from the top to down
  * from left to right
* Terminals are seen in order of appearance in the token stream

![image-20230311164126008](https://i.ibb.co/tYRgn6W/image-20230311164126008.png)

**Limitation**

* if a production for non-terminal X succeeds cannot backtrack to try a different production for X later
* Left-recursion must be eliminated first

sufficient for grammars where for any non-terminal at most one production can succeed

 **left recursion**

eg: $S->Sa$, can be eliminated

### Predictive Parser

like recursive-descent but parser can "predict" which production to use

* by looking at the next few tokens
* no backtracking

Predictive parsers accept LL(k) (**left-to-right left-most k-tokens-lookahead**) grammars

 LL(1): at each step, only one choice of production

**left-factoring**: to eliminate the common prefixes of multiple productions for one non-terminal

steps:

* for the leftmost non-terminal $S$
* look at the next input token $a$
* choose the production shown at $[S, a]$ (parsing table)
* reject on reaching error state
* accept on end of input & empty stack

use a stack to record frontier of parse tree

frontier:

* non-terminals that have yet to be expanded
* terminals that have yet to matched against the input

top of stack: leftmost pending terminal or non-terminal

* consider non-terminal $A$, production $A\rightarrow \alpha$ and token $t$
*  $T[A,t] = \alpha$ in two cases:
  * if $\alpha \rightarrow^{*} t\beta$
    * $\alpha$ can derive a $t$ in the first position
    * we say that $t\in First(\alpha)$
  * if $A\rightarrow \alpha$  and $\alpha \rightarrow^{*} \epsilon$ and $S\rightarrow^{*} \beta A t \delta$
    * useful if stack has $A$, input is $t$, and $A$ cannot derive $t$
    * in this case only option is to get rid of $A$ (by deriving $\epsilon$) : can work only if $t$ can follow $A$ in at least one derivation
    * We say that $t\in Follow(A)$

#### **First Set** 

Def. 
$$
First(X)=\{t|X\rightarrow^{*}t\alpha\}\cup\{\epsilon | X\rightarrow^{*}\epsilon\}
$$
**Algorithm**

* $First(t)=\{t\}$
* $\epsilon\in First(X)$
  * if $X\rightarrow \epsilon$
  * if $X\rightarrow A_1...A_n$ and $\epsilon\in First(A_i)$ for $1\le i \le n$
* $First(\alpha)\subseteq First(X)$ if $X\rightarrow A_1...A_n\alpha$ and  $\epsilon\in First(A_i)$ for $1\le i \le n$

#### Follow Set

Def.
$$
Follow(X) = \{t|S\rightarrow^{*} \beta A t \delta\}
$$
intuition

* if $X\rightarrow AB$ then $First(B)\subseteq Follow(A)$ and $Follow(X)\subseteq Follow(B)$
* if $B\rightarrow^{*}\epsilon$ then $Follow(X)\subseteq Follow(A)$
* if $S$ is the start symbol then $\$\in Follow(S)$

Algorithm

* $\$\in Follow(S)$
* $First(\beta) -\{\epsilon\}\subseteq Follow(X)$ for each production $A\rightarrow\alpha X\beta$
* $Follow(A)\subseteq Follow(X)$ for each production $A\rightarrow \alpha X\beta$ where $\epsilon\in First(\beta)$

#### Parsing Table

for each production $A\rightarrow \alpha$ in G do:

* for each terminal $t\in First(\alpha)$ do $T[A,t] = \alpha$
* if $\epsilon\in First(\alpha)$, for each $t\in Follow(A)$ do $T[A,t] = \alpha$
* if $\epsilon \in First(\alpha)$ and $\$\in Follow(A)$ do $T[A,\$] = \alpha$

LL(1) Table

* if any entry is multiply defined then G is not LL(1)
* Most programming language CFGs are not LL(1)

### Bottom-Up Parsing

* Bottom-Up parsing is more general than (deterministic) top-down parsing
* Bottom-Up is the preferred method
* Bottom-Up parsing reduces a string to the start symbol by inverting productions
* A bottom-up parser traces a rightmost derivation in reverse
* Bottom-up parsing uses only two kinds of actions
  * Shift
  * Reduce

**shift-reduce conflict**: it is legal to shift or reduce

**reduce-reduce conflict**: it is legal to reduce by two different productions (bad)

**Handle**: a reduction that also allows further reductions back to the start symbol

* handles always appear at the top of the stack
* never to the left of the rightmost non-terminal

Bottom-up parsing algorithms are based on recognizing handles

#### viable prefix

Def. 	$\alpha$ is a viable prefix if there is an $\omega$ such that $\alpha|\omega$ is a state of a shift-reduce parser

* a viable prefix does not extend past the right end of the handle
* viable prefix is a prefix of the handle
* as long as a parser has viable prefixes on the stack no parsing error has been detected

> For any grammar, the set of viable prefixes is a regular language

#### Recognizing VP

steps:

* add a dummy production $S^{'}\rightarrow S$ to $G$

* The NFA states are the items of $G$

* for item $E\rightarrow \alpha .X\beta$ add transition:
  $$
  (E\rightarrow \alpha.X\beta)\rightarrow^{X}(E\rightarrow \alpha X.\beta)
  $$
  
* For item $E\rightarrow \alpha.X\beta$ and production $X\rightarrow \gamma$ add
  $$
  (E\rightarrow \alpha.X\beta)\rightarrow^{\epsilon}(X\rightarrow.\gamma)
  $$
  
* every state is an accepting state
* start state is $S^{'}\rightarrow .S$

#### LR(0) Parsing

LR(0) Parsing steps:

* LR(0) Parsing: Assume
  * stack contains $\alpha$
  * next input is $t$
  * DFA on input $\alpha$ terminates in state $s$
* Reduce by $X\rightarrow\beta$ if
  * $s$ contains item $X\rightarrow\beta.$
* Shift if
  * $s$ contains item $X\rightarrow\beta.t\omega$
  * equivalent to saying $s$ has a transition labeled $t$
* LR(0) gas a reduce/reduce conflict if:
  * any state has two reduce items
  * $X\rightarrow \beta.$ and $Y\rightarrow \omega$
* LR(0) has a shift/reduce conflict if:
  * any state has a reduce item and a shift item
  * $X\rightarrow \beta.$ and $Y\rightarrow\omega .t \delta$

#### SLR Parsing

simple left-to-right right-most parsing

* Assume
  * stack contains $\alpha$
  * next input is $t$
  * DFA on input $\alpha$ terminates in state $s$
* Reduce by $X\rightarrow\beta$ if
  * $s$ contains item $X\rightarrow\beta.$ and $t\in Follow(X)$
* Shift if
  * $s$ contains item $X\rightarrow\beta.t\omega$
  * equivalent to saying $s$ has a transition labeled $t$
* LR(0) gas a reduce/reduce conflict if:
  * any state has two reduce items
  * $X\rightarrow \beta.$ and $Y\rightarrow \omega$
* LR(0) has a shift/reduce conflict if:
  * any state has a reduce item and a shift item
  * $X\rightarrow \beta.$ and $Y\rightarrow\omega .t \delta$

steps:

* let $M$ be DFA for viable prefixes of $G$
* let $|x_1...x_n\$$ be initial configuration
* repeat until configuration is $S|\$$
  * let $\alpha|\omega$ be current configuration
  * run $M$ on current stack $\alpha$
  * if $M$ rejects $\alpha$, report parsing error
  * if $M$ accepts $\alpha$ with items $I$, let $a$ be next input
    * shift if $X\rightarrow \beta.a\gamma\in I$
    * reduce if $X\rightarrow \beta.\in I$ and $a\in Follow(X)$
    * report parsing error if neither applies

##### Improvement

change stack to contain pairs
$$
<Symbol,DFA\space State>
$$
the bottom of the stack is $<any, start>$ where

* $any$ is any dummy symbol
* $start$ is the start of state of the DFA



* Define $goto[i,A]=j$ if $state_i\rightarrow^{A}state_j$
* $goto$ is just the transition function of the DFA

## Semantic Analysis

last "front end" phase

catches all remaining errors

### Scope

matching identifier declarations with uses

the scope of an identifier is **the portion of a program in which that identifier is accessible**

most languages have static scope: scope depends only on the program text, not run-time behavior

a few languages are dynamically scoped: scope depends on execution of the program

### Symbol Tables

much of semantic analysis can be expressed as a recursive descent of an AST

A symbol table is a data structure that tracks the current bindings of identifiers

###  Types

* the notion varies from language to language
* consensus
  * a set of values
  * a set of operations on those values
*  classes are one instantiation of the modern notion of type

the goal of type checking is to ensure that operations are used with the correct types

three kinds of languages:

* Statically typed: all or almost all checking of types is done as part of compilation (C, Java)
* Dynamically typed: Almost all checking of types is done as part of program execution
* Untyped: No type checking (machine code)

A lot of code is written in statically typed languages with an "escape" mechanism

* Type Checking is the process of verifying fully typed programs
* Type Inference is the process of filling in missing type information
* The two are different, but the terms are often used interchangeably

#### Type Checking

A type system is sound if

* whenever $\vdash e: T$
* then $e$ evaluates to a value of type $T$

we only want sound rules, but some sound rules are better than others

Type checking proves fact $e: T$

* proof is on the structure of the AST
* proof has the shape of the AST
* one type rule is used for each AST node

in the type rule used for a node $e$:

* Hypotheses are the proofs of types of $e$'s subexpressions
* conclusion is the type of $e$

types are computed in a bottom-up pass over the AST

#### Type environment

a type environment gives types for free variables

* a type environment is a function from Object Identifiers to Types
* A variable is **free** in an expression if it is not defined within the expression

let $O$ be a function from $ObjectIdentifiers$ to $Types$

the sentence $O \vdash e: T$ is read: Under the assumption that variables have the types given by $O$, it is provable that the expression $e$ has the type $T$

and we can write new rules:
$$
\frac{O(x)=T}{O\vdash x: T}
$$
The type environment is passed down the AST from the root towards the leaves

Types are computed up the AST from the leaves towards the root

#### Subtyping

Define a relation $\le$ on classes

* $X\le X$
* $X\le Y$ if $X$ inherits from $Y$
* $X\le Z$ if $X\le Y$ and $Y\le Z$

####  Typing Methods

method environment $M$

####  General themes

*  Type rules are defined on the structure of expressions
* Types of variables are modeled by an environment
* cam be implemented in a single traversal over the AST 
* Type environment is passes down the tree
* Types are passed up the tree

#### SELF_TYPE

if $SELF\_TYPE $  appears textually in the class $C$ as the declared type of $E$ then
$$
dynamic\_type(E)\le C
$$

* in type checking it is always safe to replace $SELF\_TYPE_c$ by $C$

## Code Generation

* Management of run-time resources
* Correspondence between
  * static (compile-time)
  * dynamic (run-time)
* Storage organization

compiler is responsible for:

* Generating code
* Orchestrating use of the data area

two goals:

* correctness
* speed

 ### Activations

an invocation of procedure $P$ is an activation of $P$

the lifetime of an activation of $P$ is

* all the steps to execute $P$
* including all the steps in procedures $P$ calls

the lifetime of a variable $x$ is the portion of execution in which $x$ is defined

note

* lifetime is a dynamic (run-time) concept
* scope is a static concept

lifetimes of procedure activations are properly nested

activation lifetimes can be depicted as a tree

the activation tree depends on run-time behavior

since activations are properly nested,  a stack can track currently active procedures

#### Activation Record (AR)

the information needed to manage one procedure activation is called an activation record (AR) or frame

if procedure $F$ calls $G$, then $G$'s activation record contains a mix of info about $F$ and $G$, $G$'s AR contains information needed to

* Complete execution of $G$
* Resume execution of $F$

The compiler must determine, at compile-time, the layout of activation records and generate code that correctly accesses locations in the activation record

###  Globals & Heap

Globals are assigned a fixed address once

* Variables with fixed address are "statically allocated"

A value that outlives the procedure that creates it cannot be kept in the AR

Languages with dynamically allocated data use a Heap to store dynamic data

Spaces

![image-20230314211257948](https://i.ibb.co/x1qwTLZ/image-20230314211257948.png)

* The code area contains object code

  for many languages, fixed size and read only

* The static area contains data (not code) with fixed addresses

  fixed size, may be readable and writable

* The stack contains an AR for each currently active procedure

  each AR usually fixed size, contains locals

* Heap contains all other data

  heap is managed by malloc and free in C

### Alignment

Data is word aligned if it begins at a word boundary

Most machines have some alignment restrictions or performance penalties for poor alignment

### Stack Machines

only storage is a stack

an instruction $r = F(a_1,...a_n)$ :

* Pops $n$ operands from the stack
* Computes the operation $F$ using the operands
* Pushes the result $r$ on the stack

location of the operands/ result is not explicitly stated

* always the top of the stack

In contrast to a register machine

* add instead of add r1, r2, r3
* more compact programs

There is an intermediate point between a pure stack machine and a pure register machine

An n-register stack machine

* conceptually, keep the top n locations of the pure stack machine's stack in registers

consider a 1-register stack machine

* the register is called the accumulator

1. consider an expression $op(e_1,...,e_n)$, $e_1,...,e_n$ are subexpressions
2. for each $e_i$
3. * compute $e_i$
   * push result on the stack
4. pop $n - 1$ values from the stack, compute $op$
5. store result in the accumulator

####  code generation

for each expression $e$ we generate MIPS code that

* computes the value of $e$ in $\$a_0$
* Preserves $\$sp$ and the contents of the stack

define a code generation function $cgen(e)$ whose result is the code generated for $e$

code generation can be written as **a recursive-descent of the AST**

###  variables

 use a frame pointer

* always points to the return address on the stack
* since it does not move it can be used to find the variables

let $x_i$ be the $i-th$ formal parameter of the function for which code is being generated
$$
cgen(x_i) = lw\space $a_0\space 4*i(\$sp)
$$
The activation record must be designed together with the code generator

Using a stack machine for compiler is recommended.

**Production compilers** do different things

* emphasis is on keeping values in registers
* intermediate results are laid out in the AR, not pushed and popped from the stack

### temporaries

the code generator must assign a fixed location in the AR for each temporary

let $NT(e)$ = count of temps needed to evaluate $e$

$NT(e_1+e_2)$

* needs at least as many temporaries as $NT(e_1)$
* needs at least as many temporaries as $NT(e_2) + 1$

for a function definition $f(x_1,...,x_n) = e$ then AR has $2+n+NT(e)$ elements

* return address
* frame pointer
* n arguments
* $NT(e)$ locations for intermediate results

code generation must know how many temporaries are in use at each point

add a new argument to code generation: the position of the next available temporary

the temporary area is used like a small, fixed-size stack

### Object Layout

OO implementation = Basic code generation + More stuff

OO slogan: If B is a subclass of A, then an object of class B can be used wherever an object of class A is expected

This means that code in class A works unmodified for an object of class B

Object are laid out in **contiguous memory**

* Class tag is an integer

  identifies class of the object

* Object size is an integer

  size of the object in words

* Dispatch ptr is a pointer to a table of methods

* attributes in subsequent slots

Each attribute stored at a fixed offset in the object 

Observation: Given a layout for class A, a layout for subclass B can be defined by extending the layout of A with additional slots for the additional attributes of B

## Semantics

many ways to specify semantics: 

**Operational Semantics**

* describes program evaluation via execution rules (on an abstract machine)
* most useful for specifying implementations

**Denotational Semantics**

* program's meaning is a mathematical function

**Axiomatic Semantics**

* Program behavior described via logical formulae
  * if execution begins in state satisfying X, then it ends in state satisfying Y
  * X, Y formulas
* Foundation of many program verification systems

### Operational Semantics

Recall the typing judgment
$$
Context \vdash e: C
$$
in the given context, expression e has type C

We use something similar for evaluation
$$
Context \vdash e: v
$$
In the given context, expression e evaluates to value v

We track variables and their values with:

* An environment : where in memory a variable is
* A store: what is in the memory

A variable environment maps variables to locations

* keep track of which variables are in scope
* tells us where those variables are

$$
E = [a: I_1,b : I_2]
$$

A store maps memory locations to values
$$
S=[I_1\rightarrow5,I_2\rightarrow 7]
$$
$S^{'}= S[12/I_1]$ defines a store $S^{'}$ such that $S^{'}(I_1)=12$ and $S^{'} = S(I)$ if $I\ne I_1$

The evaluation judgement is
$$
so, E, S\vdash e: v, S^{'}
$$

* Given so the current value of self
* And E the current variable environment
* And S the current store
* If the evaluation of e terminates then
* The value of e is v
* And the new store is $S^{'}$

$$
E(id) = I_{id}\newline
S(I_{id}) = v \newline
-------------\newline
so,E,S\vdash id:v,S
$$

## Intermediate Code

A language between the source and the target

Provides an intermediate level of abstraction

* more details than the source
* fewer details than the target

**high-level assembly**

* uses register names, but has an unlimited number
* uses control structures like assembly language
* uses opcodes but some are higher level

**common form of intermediate code**

each instruction is of the form
$$
x:= y\space op\space z
\newline
x:= op\space y
$$
$y$ and $z$ are registers or constants

similar to assembly code generation

but use any number of IL registers to hold intermediate results

## Optimization

optimization is out **last** compiler phase

most **complexity** in modern compilers is in the optimizer

seeks to improve a program's resource utilization

* execution time (most often)
* code size
* network messages sent, etc.

when：

* On AST

  * Pro: machine independent
  * Con: too high level

* On assembly language

  * Pro: Exposes optimization opportunities

  * Con: 

    Machine dependent

    Must reimplement optimizations when retargeting

* On an intermediate language

  * Pro: 

    Machine independent

    Exposes optimization opportunities

### Basic Block

A basic block is a maximal sequence of instructions with:

* no labels (except at the first instruction)
* no jumps (except at the last instruction)

idea

* cannot jump into a basic block (except at beginning)
* cannot jump out of a basic block (except at end)
* a basic block is a single-entry, single-exit, straight-line code segment

### control-flow graph

a control-flow-graph is a directed graph with

* basic blocks as nodes
* an edge from block A to block B if the execution can pass form the last instruction in A to the first instruction in B

the body of a method (or procedure) can be represented as a control-flow graph

### Granularity

1. local optimizations

   apply to a basic block in isolation

2. Global optimizations

   apply to a control-flow graph (method body) in isolation

3. Inter-procedural optimizations

   apply across method boundaries

most compilers do 1. many do 2. few do 3.

In practice, often a conscious decision is made not to implement the fanciest optimization known

* some optimizations are hard to implement
* some optimizations are costly in compilation time
* some optimizations have low payoff
* many fancy optimizations are all three!

### Local Optimization

optimize one basic block

no need to analyze the whole procedure body

* some statement can be deleted

  $x:= x + 0$

  $x:= x*1$

* some statements can be simplified

  $x:=x*0$ to $x:=0$

  $y:= y**2$ to $y:=y*y$

  $x:=x*8$ to $x:=x<<3$

  $x:=x*15$ to $t:=x << 4; x:=t-x$

* Operations on constants can be computed at compile time
  * if there is a statement $x:=y\space op\space z$
  * and $y$ and $z$ are constants
  * then $y$ op $z$ can be computed at compile time
  
* constant folding can be dangerous

  in cross-compiler

* Eliminate unreachable blocks

some optimizations are simplified if each register occurs only once on the left-hand side of an assignment

**common subexpression elimination**

  if

* basic block is in single assignment form
* a definition $x:=$ is the first use of $x$ in a block

then

* When two assignments have the same rhs, they compute the same value

**copy propagation**

if $w:= x$ appears in a block, replace subsequent uses of $w$ with uses of $x$

**dead elimination**

if

$w:=rhs$ appears in a basic block

$w$ does not appear anywhere else in the program

then

the statement $w:=rhs$ is dead and can be eliminated

typically optimizations interact: performing one optimization enables another

optimizing compilers repeat optimizations until no improvement is possible

#### Peephole optimization

optimizations can be directly applied to assembly code

 Peephole optimization is effective for improving assembly code

the "peephole" is a short sequence of (usually contiguous) instructions

the optimizer replaces the sequence with another equivalent one (but faster)

### Global Optimization

Global optimization tasks share several traits:

* The optimization depends on knowing a property X at a particular point in program execution
* Proving X at any point requires knowledge of the entire program

#### Dataflow Analysis

To replace a use of x by a constant k we must know: on every path to the use of x, the last assignment to x is $x:=k$

Checking the condition requires global dataflow analysis: an analysis of the entire control-flow graph
