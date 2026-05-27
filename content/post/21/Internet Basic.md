---
title: 【Internet】Basics
date: 2021-05-15 00:00:00+0000
categories: 
- nutrition
- grass
---

## What is Internet

The internet is **the world’s most popular computer network**. It began as an **academic research project** in **1969**, and became a **global commercial network** in the **1990s**.

The internet began as **ARPANET**, an academic research network that was funded by the military’s Advanced Research Projects Agency (ARPA, now DARPA) and that began operations in 1969.

In **1973**, software engineers Vint Cerf and Bob Kahn began work on the next generation of networking standards for the ARPANET. These standards, known as **TCP/IP**, became the foundation of the modern internet. 

The shared technical standards that make the internet work are managed by an organization called the **Internet Engineering Task Force**.

The **Internet Corporation for Assigned Names and Numbers**(ICANN)  is in charge of distributing **domain names** and **IP addresses**. 

The **World Wide Web** was created by **Timothy Berners-Lee** in 1991. It offered a more powerful and user-friendly interface than other internet applications. The web supported hyperlinks, allowing users to browse from one document to another with a single click. Over time, the web became increasingly sophisticated, supporting images, audio, video, and interactive content.

In 1994, Berners-Lee created the **World Wide Web Consortium(W3C)**  to be the web’s official standards organization. He is still the W3C’s director and continues to oversee the development of web standards. 

### How we access Internet

Most people access internet content using a web browser.

the web is just one of many internet applications. Other popular Internet applications include **email** and **BitTorrent**.

## Basic parts of the Internet

The internet has three basic parts:

- **The last mile** is the part of the internet that connects homes and small businesses to the internet.
- **Data centers** are rooms full of servers that store user data and host online apps and content.
- **The backbone** consists of long-distance networks — mostly on **fiber optic cables**   —that carry data between data centers and consumers.

### Wireless Internet

There are two basic types of **wireless internet** access: 

* **wifi**

Wifi networks use **unlicensed spectrum**: electromagnetic frequencies that are available for anyone to use without charge. To prevent neighbors’ networks from interfering with each other, there are strict limits on the power (and therefore the range) of wifi networks.

* **cellular**：.

Cellular networks are more centralized. They work by breaking up the service territory into **cells**.  Each cell has a **tower** at its **center** providing services to devices there. 

## IP address


Internet Protocol addresses are numbers that computers use to identify each other on the internet. 

## Packet

A packet is the **basic unit of information** transmitted over the internet.  Splitting information up into small, digestible pieces allows the network’s capacity to be used more efficiently.

A packet consists of  two parts:

* **header**

 The header contains information that **helps the packet get to its destination**,  including the **length** of the packet, its **source and destination**, and a **checksum value** that helps the recipient detect if a packet was damaged in transit.

* body ( actual data )

### Discard packet

If internet routers experience **congestion or other technical problems**, they are allowed to deal with it by simply discarding packets. 

It’s the **sending computer’s responsibility** to detect that a packet didn’t reach its destination and send another copy. 

## OSI

The **open systems interconnection** (OSI) model  is a conceptual model  which enables diverse communication systems to communicate using standard protocols. 

The OSI Model can be seen as a universal language for computer networking. 

![undefined](https://www.cloudflare.com/img/learning/ddos/what-is-a-ddos-attack/osi-model-7-layers.svg)

Although the modern Internet doesn’t strictly follow the OSI Model (it more closely follows the simpler Internet protocol suite), the OSI Model is still very useful for troubleshooting network problems.

### 7. The application layer

This is the only layer that directly interacts with data from the user. Software applications like web browsers and email clients rely on the application layer to initiate communications. But it should be made clear that client software applications are not part of the application layer. Application layer protocols include [HTTP](https://www.cloudflare.com/learning/ddos/glossary/hypertext-transfer-protocol-http/) as well as SMTP (Simple Mail Transfer Protocol is one of the protocols that enables email communications).

### 6. The presentation layer

This layer is primarily responsible for preparing data so that it can be used by the application layer; in other words, layer 6 makes the data presentable for applications to consume. 

The presentation layer is responsible for translation, [encryption](https://www.cloudflare.com/learning/ssl/what-is-encryption/), and compression of data.

![The Presentation Layer](https://cf-assets.www.cloudflare.com/slt3lc6tev37/60dPoRIz0Es5TjDDncEp2M/7ad742131addcbe5dc6baa16a93bf189/6-presentation-layer.svg)

### 5. The session layer

This is the layer responsible for opening and closing communication between the two devices. The time between when the communication is opened and closed is known as the session. The session layer ensures that the session stays open long enough to transfer all the data being exchanged, and then promptly closes the session in order to avoid wasting resources.

The session layer also synchronizes data transfer with checkpoints. For example, if a 100 megabyte file is being transferred, the session layer could set a checkpoint every 5 megabytes. In the case of a disconnect or a crash after 52 megabytes have been transferred, the session could be resumed from the last checkpoint, meaning only 50 more megabytes of data need to be transferred. Without the checkpoints, the entire transfer would have to begin again from scratch.

![The Session Layer](https://cf-assets.www.cloudflare.com/slt3lc6tev37/6jFRnaZSuIMoUzSotZXYbG/cc7a47d2b3f8d3e77b9ffbdb8b8d5280/5-session-layer.svg)

### 4. The transport layer

Layer 4 is responsible for end-to-end communication between the two devices. This includes taking data from the session layer and breaking it up into chunks called segments before sending it to layer 3. The transport layer on the receiving device is responsible for reassembling the segments into data the session layer can consume.

The transport layer is also responsible for flow control and error control. Flow control determines an optimal speed of transmission to ensure that a sender with a fast connection doesn’t overwhelm a receiver with a slow connection. The transport layer performs error control on the receiving end by ensuring that the data received is complete, and requesting a retransmission if it isn’t.

![The Transport Layer](https://cf-assets.www.cloudflare.com/slt3lc6tev37/1MGbIKcfXgTjXgW0KE93xK/64b5aa0b8ebfb14d5f5124867be92f94/4-transport-layer.svg)

### 3. The network layer

The network layer breaks up segments from the transport layer into smaller units, called packets, on the sender’s device, and reassembling these packets on the receiving device. The network layer also finds the best physical path for the data to reach its destination; this is known as routing.

![The Network Layer](https://cf-assets.www.cloudflare.com/slt3lc6tev37/76JgEjycZl12c90UByKfJA/d6578bcd7b151c489e61f42227a45713/3-network-layer.svg)

### 2. The data link layer

The data link layer is very similar to the network layer, except the data link layer facilitates data transfer between two devices on the SAME network. The data link layer takes packets from the network layer and breaks them into smaller pieces called frames. Like the network layer, the data link layer is also responsible for flow control and error control in intra-network communication (The transport layer only does flow control and error control for inter-network communications).

![The Data Link Layer](https://cf-assets.www.cloudflare.com/slt3lc6tev37/3MR4mPOwaos80t1annw7BG/8ea1c59ccfa1baf6e9738773daa30450/2-data-link-layer.svg)

### 1. The physical layer

This layer includes the physical equipment involved in the data transfer, such as the **cables and switches**. This is also the layer where the data gets converted into a bit stream, which is a string of 1s and 0s. The physical layer of both devices must also agree on a signal convention so that the 1s can be distinguished from the 0s on both devices.

![The Physical Layer](https://cf-assets.www.cloudflare.com/slt3lc6tev37/3m1ZkcaaBYHoodrEO3brv2/2819c4db294631b5753cd55de0c01bd9/1-physical-layer.svg)





