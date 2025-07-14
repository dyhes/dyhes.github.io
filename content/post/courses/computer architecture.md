---
title: 【Computer Architecture】Notes
date: 2023-06-06 00:00:00+0000
categories: 
  - star
---

## Instruction

### definition

* instruction set

  The vocabulary of commands understood by a given architecture.

* stored-program

  The idea that  instructions and data of  many types can be stored  in memory as numbers,  leading to the stored-program computer.

* word

  The natural unit  of access in a computer,  usually a group of 32 bits;  corresponds to the size  of a register in the MIPS  architecture

* address

  A value used to delineate the location of  a specific data element  within a memory array
  
* instruction format 

  A form of representation  of an instruction  composed of fields of  binary numbers. 

* machine  language 

  Binary  representation used for communication within a computer system.

* opcode 

  The field that  denotes the operation and  format of an instruction.

* text segment

  The segment of a UNIX object  file that contains the machine language code for routines in the source  file

* program counter  (PC) 

  The register containing the address  of the instruction in the  program being executed

### type

* MIPS

* ARMv7 (32-bit)
* intel x86
* ARMv8 (64-bit)

![image-20221007232522382](https://i.ibb.co/TTJFncy/image-20221007232522382.png)

### register

![image-20221008172806802](https://i.ibb.co/HYvTdmd/image-20221008172806802.png)

### MIPS instruction type

* arithmetic

* data transfer

  a command that moves data between memory and registers

* logical

* conditional branch

* unconditional jump

### Number Representation

Numbers are kept in computer hardware as **a series of high and low electronic  signals**, and so they are considered base 2 numbers. 

A single digit of a binary number is thus the **“atom”** of computing, since all  information is composed of binary digits or bits.

The phrase least significant bit is used to refer to the rightmost bit (bit 0 above) and most significant bit to the leftmost bit (bit 31).

#### sign and magnitude

Unsign number are quite natural, but computer programs calculate both positive and negative numbers, so we need a  representation that distinguishes the positive from the negative. The most obvious  solution is to **add a separate sign, which conveniently can be represented in a single  bit**; the name for this representation is sign and magnitude

##### shortcomings

* it’s  not obvious where to put the sign bit. 
* adders for sign and magnitude may need an extra step to set  the sign because we can’t know in advance what the proper sign will be. 
* a  separate sign bit means that sign and magnitude has both a positive and a negative zero, which can lead to problems for inattentive programmers

####  two’s complement(补码)

##### reason

In the search for a more attractive alternative, the question arose as to what  would be the result for unsigned numbers if we tried to subtract a large number  from a small one. Th e answer is that it would try to borrow from a string of leading  0s, so the result would have a string of leading 1s. Given that there was no obvious better alternative, the final solution was to pick  the representation that made the hardware simple: leading 0s mean positive, and  leading 1s mean negative.

Every computer today uses  two’s complement binary representations for signed numbers.

##### feature

Two’s complement representation has the advantage that all negative numbers  have a 1 in the most significant bit. This bit is oft en called the sign bit.
$$
(x_{31}\times-2^{31})+\sum_{i=0}^{30}x_{i}\times2^i
$$
Signed versus unsigned applies to loads as well as to arithmetic. 

* Signed load

  copy the sign repeatedly to fill the rest of the register—called sign extension

  its purpose is to place a correct representation of the number within that register

* Unsigned load

  simply fill with 0s to the left of the data

##### negation

Simply invert every 0 to 1 and every 1 to 0, then add one to the result

##### sign extension

take the most significant bit  from the smaller quantity—the sign bit—and replicate it to fill the new bits of the  larger quantity

#### name

Two’s complement gets its name from the rule that the unsigned sum  of an n-bit number and its n-bit negative is $2^n$; hence, the negation or complement of a  number x is $2^n-x$, or its “two’s complement.”

#### one's complement(反码)

A notation that represents  the most negative value  by $10 . . . 000_{two}$ and the  most positive value by $01 . . . 11_{two}$, leaving an  equal number of negatives  and positives but ending  up with two zeros, one  positive ($00 . . . 00$) and  one negative ($11 . . . 11$).  

The term is also used to  mean the inversion of  every bit in a pattern: 0 to 1 and 1 to 0.

This relation helps explain its name since  the complement of x is $2^n-x-1$

It was also an attempt to be a better solution  than sign and magnitude, and several early scientific computers did use the notation.

One’s complement adders did need an extra step to subtract a number, and  hence two’s complement dominates today.

#### biased noatation

A notation that represents  the most negative value  by $00 . . . 000$ and the  most positive value by $11  . . . 11$, with 0 typically  having the value $10 . . .  00$, thereby biasing  the number such that  the number plus the  bias has a non-negative  representation.

### Note

* The processor can keep only a small amount of data in registers, but  computer memory contains billions of data elements. Hence, data structures  (arrays and structures) are kept in memory.
* Memory is just a large, single-dimensional array, with the address acting as the  index to that array, starting at 0.
* arithmetic operations occur only on registers in MIPS  instructions
* In MIPS, words must start at addresses that are multiples of 4. This requirement  is called an alignment restriction, and many architectures have it.
* The process of putting less commonly used variables (or those needed  later) into memory is called spilling registers

### Instruction representation

Instructions are kept in the computer as **a series of high and low electronic  signals** and may be represented as numbers. In fact, each piece of an instruction  can be considered as an individual number, and placing these numbers side by side  forms the instruction.

#### Fields

All MIPS instructions are 32 bits long, and can also be represented as fields of binary numbers.

![image-20221008145919050](https://i.ibb.co/CKct0M3/image-20221008145919050.png)

(R-format)

Here is the meaning of each name of the fields in MIPS instructions:

* op

  Basic operation of the instruction, traditionally called the **opcode**

* rs

  The first register source operand

* rt

  The second register source operand

* rd

  The register destination operand. It gets the result of the operation

* shamt: Shift amount. 

* funct: Function. 

  This field, often called the **function code**, selects the specific  variant of the operation in the op field.

![image-20221008145952595](https://i.ibb.co/T4wd8ff/image-20221008145952595.png)

(I-format)

### spilling registers

The ideal data structure for spilling registers is a stack—a last-in-first-out  queue. 

A stack needs a pointer to the **most recently** allocated address in the stack  to show where the next procedure should place the registers to be spilled or where  old register values are found. 

The stack pointer is adjusted by one word for each  register that is saved or restored. MIPS soft ware reserves register 29 for the stack  pointer, giving it the obvious name $sp. 

By historical precedent, stacks “grow” from higher addresses to lower addresses.  This convention means that you push values onto the stack by subtracting from the  stack pointer. Adding to the stack pointer shrinks the stack, thereby popping values  off the stack.

### frame pointer

Some MIPS soft ware uses a frame pointer ($fp) to point to the first word of  the frame of a procedure. A stack pointer might change during the procedure, and  so references to a local variable in memory might have different offsets depending  on where they are in the procedure, making the procedure harder to understand.  Alternatively, a frame pointer offers a stable base register within a procedure for  local memory-references. 

### heap

![image-20221008172448444](https://i.ibb.co/KyC34w0/image-20221008172448444.png)