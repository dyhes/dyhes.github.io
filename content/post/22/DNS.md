---
title: 【DNS】Concepts
date: 2022-03-22 00:00:00+0000
categories: 
    - nutrition
tags:
    - Computer Network
---

## Domain Name

A domain name is an **identification string** that defines a realm of administrative autonomy, authority or control within the Internet. 

Domain names are used in various networking contexts and for **application-specific naming** and **addressing** purposes. In general, a domain name **identifies a network domain**, or it **represents an Internet Protocol** **(IP) resource**, such as a personal computer used to access the Internet, a server computer hosting a website, or the web site itself or any other service communicated via the Internet. As of 2017, 330.6 million domain names had been registered.

A uniform resource locator (URL), sometimes called a web address, contains the domain name of a site as well as other information, including the transfer protocol and the path. 

### types

There are two types of domain names.

* **generic** top-level domains (gTLDs)

such as .com, .edu, .org, and .gov. Authority over these domains is usually delegated to private organizations.

* **country-code** top-level domains (ccTLDs).

Each country in the world has its own **2-letter code**. These domains are administered by authorities in each country. 

Some ccTLDs, such as .tv (for the island nation of Tuvalu) and .io (the British Indian Ocean Territory), have become popular for use outside of their home countries.

## Domain Name System

The Domain Name System (DNS) is the **hierarchical and decentralized naming system** used to identify computers, services, and other resoures reachable through the Internet or other Internet Protocol (IP) networks. 

![image-20220324153500031](C:\Users\dyhes\AppData\Roaming\Typora\typora-user-images\image-20220324153500031.png)

The domain name system is administered by the **Internet Corporation for Assigned Names and Numbers(ICANN)**, a non-profit organization based in California founded in **1998**.

 A standard called **DNSSEC** seeks to beef up DNS security with **encryption**, but few people have adopted it.

## DNS Server Type

* **DNS recursor** ( **librarian** who is asked to go find a particular book somewhere in a library)

The DNS recursor is a server designed to **receive queries from client machines through applications such as web browsers**. Typically the recursor is then responsible for **making additional requests** in order to satisfy the client’s DNS query.

- **Root Nameserver**  ( an index in a library that points to different racks of books) The root server is the first step in translating (resolving) human readable host names into IP addresses. it serves as a reference to other more specific locations.
- **TLD(top level domain server) Nameserver**- (a specific rack of books in a library.) This nameserver is the next step in the search for a specific IP address, and it hosts the last portion of a hostname (In example.com, the TLD server is “com”).
- **Authoritative Nameserver** -( dictionary on a rack of books, in which a specific name can be translated into its definition.) The authoritative nameserver is the last stop in the nameserver query. If the authoritative name server has access to the requested record, it will return the IP address for the requested hostname back to the DNS Recursor (the librarian) that made the initial request.



![image-20220324154414911](C:\Users\dyhes\AppData\Roaming\Typora\typora-user-images\image-20220324154414911.png)

### Chache

caching is a data persistence process that helps short-circuit the necessary requests by serving the requested resource record earlier in the DNS lookup.

![image-20220120142648564](C:\Users\dyhes\AppData\Roaming\Typora\typora-user-images\image-20220120142648564.png)

## Subdomain

It’s worth mentioning that in instances where the query is for a subdomain such as foo.example.com or blog.cloudflare.com an **additional nameserver** will be added to the sequence **after the authoritative nameserver**, which is responsible for storing the subdomain’s **CNAME record**.

![image-20220324154954437](C:\Users\dyhes\AppData\Roaming\Typora\typora-user-images\image-20220324154954437.png)

