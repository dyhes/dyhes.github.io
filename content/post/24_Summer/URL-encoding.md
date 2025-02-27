---
title: 【Front】URL encoding
# description: Math typesetting using KaTeX
date: 2024-08-07 00:00:00+0000
categories: 
    - nutrition
    - grass
tags:
---

In URL encoding, **reserved characters** that have special meanings  and **unsafe characters**
might be altered during transmission or have special meanings in certain contexts in URLs are typically encoded using a percent sign ('%') followed by two hexadecimal digits representing the ASCII value of the character.
For example:
* The ASCII value of '/' is 47 in decimal.
* 47 in hexadecimal is 2F.
⠀Thus, '/' becomes '%2F' when it is URL-encoded. This encoding is often necessary to ensure that URLs are transmitted correctly over the Internet, where certain characters might otherwise be misinterpreted.
Any characters outside the ASCII range (0-127) should also be encoded, as they might not be correctly interpreted by all systems. These are typically encoded using UTF-8 and then percent-encoded.
**Path** and **Query Parameters** usually need to be url-encoded.
