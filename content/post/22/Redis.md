---
title: 【Redis】Concepts
date: 2022-03-02 00:00:00+0000
categories: 
- nutrition
- willow
---

## Introduction

### What is Redis

Redis is a fast in-memory database and cache, is’ name comes from “**RE**mote **DI**ctionary **S**erver”.

By default Redis stores data in memory, with periodic disk persistence as a default. As Redis persists data to disk it can serve as a classical database for many use cases as well as a cache. 

### Intelligent Caching

By default Redis stores data in memory, with periodic disk persistence as a default. As Redis persists data to disk it can serve as a classical database for many use cases as well as a cache. 

Redis is commonly used as a cache to store frequently accessed data in memory so that applications can be responsive to users.

With the capacity to:

- designate how long you want to keep data(data structures in Redis can be marked with a Time To Live (TTL) set in seconds)
- which data to evict first(In some use cases a least recently used (LRU) or least frequently used (LFU) metric makes more sense for eviction. )

Redis enables a series of intelligent caching patterns.

### Other Features

#### Publication and Subscription Messaging (Pub/Sub)

Pub/Sub messaging allows for messages to be passed to channels and for all subscribers to that channel to receive that message.

#### Lua Scripting

Redis has a scripting facility which enables custom scripts to be written and executed in the Lua language.

#### Geospatial Features

Redis provides a series of geospatial index data structures and commands. Latitude and longitude coordinates are stored and users can query distances between objects or query for objects within a given radius of a point.

#### Hyperloglog

The hyperloglog data structure enables approximate set counting in a much smaller space than keeping a full unique set of items.

#### Bitmaps

Bitmaps allow for the highly efficient storage of True and False values as 1 or 0 inside Redis strings. 

### Persist to Disk

Redis can be configured to write to disk in two formats, a binary format and an “append only file” (AOF) format. The binary format mirrors what is in memory and is on by default. 

The AOF file can be turned on in the configuration and is a simple log of all commands which can be replayed to return a node to its previous state.