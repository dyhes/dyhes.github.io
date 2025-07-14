---
title: 【Computer Network】Notes
date: 2023-06-06 00:00:00+0000
categories: 
  - star
---

## Lecture 1 (introduction)

### Internet

* network of networks
* infrastructure that provides services to applications
* provides programming interface to distributed applications

### protocol

Protocols define the format, order of messages sent and received among network entities, and actions taken on msg transmission, receipt  

### Access network

* cable-based access

  frequency division multiplexing (FDM): different channels transmitted in different frequency bands

* digital subscriber line (DSL)

  use existing telephone line to central office DSLAM

  * data over DSL phone line goes to Internet
  * voice over DSL phone line goes to telephone net

* wireless access

  * Wireless local area networks
  * wide-area cellular access networks

* enterprise networks

  * companies, universities

### Packets

host sending function:

* takes application message

* breaks into smaller chunks known as packets, of length L bits

* transmits packet into access network at transmission rate R

  link transmission rate, aka link capacity, aka link bandwidth

* packet transmission delay:

  time needed to transmit L-bit packet into link $=\frac{L(bits)}{R(bits/sec)}$

### Physical media

* guided media

  signals propagate in solid media: copper, fiber, coax

  * Twisted pair (TP)

    two insulated copper wires

  * Coaxial cable

    two concentric copper conductors

  * fiber optic cable

    glass fiber carrying light pulses, each pulse a bit

* unguided media

  signals propagate freely: radio

  * wireless radio

    signal carried in various "bands" in electromagnetic spectrum

### network-core

#### two key functions

* forwarding
  * aka "switching"
  * local action: move arriving packet from router's input link to appropriate router output link
* routing:
  * global action: determine source-destination paths taken by packets

#### packet switching

hosts break application-layer messages into packets

network forwards packets from one router to the next, across links on the path from source to destination

* store-and-forwarding

  entire packet must arrive at router before it can be transmitted on next link

* queueing

  if arrival rate to link exceeds transmission rate of link for some period of time

  * packets will queue
  * packets can be dropped(lost) if memory (buffer) in router fills up

#### curcuit switching

end-end resources allocated to, reserved for "call" bewteen source and destination

* each link has four circuits

* dedicated resources: no sharing

* circuit segment idle if not used by call

* commonly used in traditional telephone networks

* types

  * frequency division multiplexing (FDM)

    optical, electromagnetic frequencies divides into (narrow) frequency bands

  * time division multiplexing (TDM)

    time divided into slots

### Packet delay

$$
d_{nodal}=d_{proc}+d_{queue}+d_{trans}+d_{prop}
$$

![image-20221006143351261](https://i.ibb.co/K90SsxR/image-20221006143351261.png)

#### $d_{proc}$

proccessing delay

* check bit errors
* determine output link
* typically<microsecs

#### $d_{queue}$

queueing delay

* depends on congestion level of router
* $\alpha$ : average packet arrival rate
* tranfic intensity: $\frac{L\cdot a}{R}$
  * $\frac{L\cdot a}{R}\sim 0$ avg. queueing delay small
  * $\frac{L\cdot a}{R}\to 1$ avg. queueing delay large
  * $\frac{L\cdot a}{R}\gt 1$ average delay infinite

#### $d_{trans}$

transmission delay

* $d_{trans=L/R}$

#### $d_{prop}$

propagation delay

* $d$ : length of physical link
* $s$ : propagation speed
* $d_{prop}=d/s$

### Layers

 each layer implements a service

* application

  supporting network applications

  HTTP,IMAP,SMTP,DNS

* transport

  process-process data transfer

  TCP,UDP

* network

  routing of datagrams from source to destination

  IP, routing protocols

* link

  data transfer bewteen neighboring network elements

  Ethernet, WiFi, PPP

* physical

  bits "on the wire"

#### Services

* application

  exchanges message M to implement some application service using services of transport layer

* transport

  transfers application-layer M from one process to another, using network layer services

  encapsulates application-layer M with transport layer header $H_t$ to create a transport-layer segment

* network

  transfer transport-layer segment $[H_t,M]$ from one host to another, using link layer services

  encapsulates transport-later segment $[H_t,M]$ with network layer header $H_n$ to create a network-layer datagram

* link

  transfer network-layer datagram $[H_n|H_t,M]$ from host to neighboring host, using physical layer services

  encapsulates network-later datagram $[H_n|H_t,M]$, with link-layer header $H_l$ to crate a link-layer frame

![image-20221006153800437](https://i.ibb.co/dgN0Hj9/image-20221006153800437.png)

![image-20221006154133008](https://i.ibb.co/4gKGvPK/image-20221006154133008.png)

### History

* 1961-1972: early packet-switching principles
* 1972-1980： internetworking; new, proprietary networks
* 1980-1990: new protocols, many new networks
* 1990-2000s: commercialization, the Web, new applications
* 2005-now: more application, mobility, cloud

## Lecture 2 (application layer)

### client-server paradigm

* server

  * always-on host
  * permanent IP address
  * often in data centers, for scaling

* clients

  * contact, communicate with server
  * may be intermittently connected
  * may have dynamic IP addresses
  * do not communicate directly with each other

* example

  HTTP, IMAP, FTP

### peer-to-peer architecture

* no always-on host
* arbitrary end systems directly communicate
* peers request service from other peers, provide service in return to other peers
* peers are intermittently connected and change IP addresses
* example: P2P file sharing

### process communicating

process: program running within a host

* within same host, two processes communicate using inter-process communication (defined by OS)
* processes in different hosts communicate by exchanging messages
  * client process: process that initiates communication
  * server process: process that waits to be contacted

### sockets

* process sends/receives messages to/from its socket
* socket analogous to door
  * sending process shoves message out door
  * sending process relies on transport infrastructure on other side of door to deliver message to socket at receiving process

### addressing processes

to receive messages, process must have identifier which includes both IP address and port numbers associated with process on host

### application-layer protocol

An application-layer protocol defines:

* types of messages exchanged

  e.g. request, response

* message syntax

  what fields in messages & how fields are delineated

* message semantics

  meaning of information in fields

* rules

  for when and how send & respond to messages

type of protocol

* open protocols
  * defined in RFCs, everyone has access to protocol definition
  * allows for interoperability
  * e.g. HHTP,SMTP
* proprietary protocols
  * e.g. Skype, Zoom

### Internet transport protocols services

* TCP  service

  * reliable transport

  * flow conrtol

    sender won't overwhelm receiver

  * congestion control

    throttle sender when network overloaded

  * connection-oriented

    setup required between client and server processes

  * does not provide: timing, minimum throughput guarantee, security

* UDP service

  * unreliable transfer

### HTTP

hypertext transfer protocol (application-layer)

"stateless": server maintains no information about past client requests

* non persistent

  * tcp connection opened
  * at most one object sent over tcp connection
  * tcp connection closed

  downloading multiple objects required multiple connections

* persistent (HTTP1.1)

  * tcp connection opened
  * multiple objects can be sent over single tcp connection
  * tcp connection closed

#### cookies

used to maintain some state between transactions

can be used for

* authorization
* shopping carts
* recommendations
* user session state

### Email

* user agents
* mail servers
* simple mail transfer protocol: SMTP

#### SMTP

* SMTP handshaking
* SMTP transfer of messages
* SMTP closure

#### IMAP

Internet Mail Access Protocol: messages stored on server, IMAP provides retrieval, deletion, folders of stored messages on server

### Domain Name System (DNS)

distributed database implemented in hierarchy of many name servers

application-layer protocol: hosts, DNS servers communicate to resolve name( address/name translation)

services:

* hostname-to-IP-address translation

* host aliasing

  canonical, alias names

* mail server aliasing

* load distribution

  replicated Web servers: many IP addresses correspond to one name

#### Hierarchy

* root

  official, contact-of-last-resort by name servers that can not resolve name

* Top level Domain

* Authoritative

### Local DNS name servers

when host makes DNS query, it is sent to its local DNS server

* Local DNS server returns reply, answering:
  * from its local cache of recent name-to-address translation pairs( possibly out of dates)
  * forwarding request into DNS hierarchy for resolution
* each ISP has local DNS name server

### DNS name resolution

* iterated query

  ![image-20221008221149895](https://i.ibb.co/ByZm2Sf/image-20221008221149895.png)

* recursive query

  puts burden of name resolution on contacted name server

  ![image-20221008221313656](https://i.ibb.co/XpJ5xv2/image-20221008221313656.png)

###  Caching DNS information

one name server learns mapping, it caches mapping, and immediately returns a cached mapping in response to a query

* improves response time
* cache entries timeout (disappear) after some time (TTL)
* TLD server typically cached in local name servers
* cached entries may be out-of-date

###  DNS records

resource records(RR) format: (name, value, type, ttl)

#### Type

* A

  name is host

  value is IP address

* NS

  name is domain (e.g. foo.com) 

  value is hostname of authoritative name server for this domain

* CNAME

  name is alias name for some "canonnical" (the real) name

  value is canonical name

  e.g. www.ibm.com is really servereasy.backup2.ibm.com

### DNS protocal messages

DNS query and reply messages, both have same format

* message header

  * identification

    16 bit ## for query

    reply to query uses same #

  * flags

    * query or reply
    * recursion desired
    * recursion avaliable
    * reply is authoritative

![image-20221008222553158](https://i.ibb.co/LJF1Sb7/image-20221008222553158.png)

### P2P

#### two main challenges

* the peers may join or leave the network, so the service provided by a particular peer will come and go
* the peer address is likely to change

#### BitTorrent

P2P file distribution

* file devided into 256kb chunks
* peers in torrent send/receive file chunks

participant

* tracker

  tracks peers participating in torrent

* torrent

  group of peers exchanging chunks of a file

### Video streaming and CDNs

stream video traffic: major consumer of Internet bandwidth

* video

  sequence of images displayed at constant rate

* digital image

  array of pixels

  each pixel represented by bits

* coding

  use redundancy within and between images to decrease ## bits used to encode image

  * spatial
  * temporal

  two type of video encoding method

  * CBR: (constant bit rate)

    video encoding rate fixed

  * VBR: (variable bit rate)

    video encoding rate changes as amout of spatial, temporal encoding changes

* streaming

  client playout early part of video, while server still sending later part of video

main challenges

* server-to-client bandwidth will vary over time
* packet loss, delay due to congestion

#### DASH

Dynamic, Adaptive Streaming over HTTP

##### server

* divides video file into multiple chunks
* each chunk encoded at multiple different rates
* different rate encodings stroed in different files
* files replicated in various CDN nodes
* manifest file: provides URLs for different chunks

##### client

* periodically estimates server-to-client bandwidth
* consulting manifest, requests one chunk at a time
  * chooses maximum coding rate sustainable given current bandwidth
  * can choose different coding rates at different points in time (depending on available bandwidth at time), and from different servers

#### CDNs

store/serve multiple copies of videos at multiple geographically distributed sites

* enter deep

  push CDN servers deep into many access networks

* bring home

  smaller number of larger clusters in POPs near access nets

### Socket Programming

socket: the only api that sits between application layer and transport layer

## Lecture 3(Transport Layer)

provide **logical communication** between application processes running on different hosts

actions in end systems:

* sender: break application messages into segments, passes to network layer
* receiver: reassembles segments into messages, passes to application layer

### Transport layer vs. Network layer

* network layer: logical communication between hosts

* transport layer: logical communication between processes

  relies on, enhances, network layer services

analogy

12 kids in Ann's house sending letters to 12 kids in Bill's

* hosts=houses
* processes=kids
* app messages =letters in envelops
* transport protocol= Ann and Bill who demux to in-hohuse siblings
* network-layer protocol= postal service

### Actions

* Sender:
  * is passed an application-layer message
  * determines segment header fields values
  * creates segment
  * passes segment to IP
* Receiver
  * receives segment from IP
  * checks header values
  * extracts application-layer message
  * demultiplexes messages up to application via socket

### Types

* TCP: transmission control protocol
  * reliable, **in-order** delivery
  * congestion control
  * flow control
  * connection setup
* UDP: user datagram protocol
  * unreliable, unordered delivery
  * no-frills extension of "best-effort" IP
* Services not available:
  * delay guarantees
  * bandwidth guarantees

 ### Demultiplexing and multiplexing

 demultiplexing at receiver:

use header info to deliver received segments to correct socket

* host receives IP datagrams

  * each datagram has source IP address, destination IP address
  * each datagram carries one transport-layer segement
  * each segment has source, destination number

  ![image-20221022194123464](https://i.ibb.co/d7sfDjt/image-20221022194123464.png)

* host uses IP address & port number to direct segment to appropriate socket

#### connection-oriented demultiplex

tcp socket identified by 4-tuple:

* source IP address
* source port number
* dest IP address
* dest port number

### UDP

* "no frills","bare bones" Internet transport protocol
* "best effort" service, UDP segments may be：
  * lost
  * delivered out-of-order to app 
* connectionless
  * no handshaking
  * each UDP segment handled independently

### segment format

* source port
* dest port
* length
* checksum
* application data

![image-20221022200348119](https://i.ibb.co/2NW7Bw7/image-20221022200348119.png)

##### checksum

goal: detect errors in transmitted segment

* sender
  * treat contents of UDP segment( including UDP header fields and IP addresses) as sequence of 16-bit integers
  * checksum: addition (one's complement sum) of segment content
  * put checksum value into UDP checksum field
* receiver
  * compute checksum
  * check if equals

### Reliable Data Transfer

![image-20221022204239430](https://i.ibb.co/tK0wtbK/image-20221022204239430.png)

...

### TCP

![image-20221022211547831](https://i.ibb.co/ggsLWs5/image-20221022211547831.png)

* sequence number

  indicate the byte stream number of the first byte in segment payload

  count of bytes( not segments)

* Acknowledgement number

  used by receiver to tell sender the sequence number of the next byte that's expected to be received from the sender

  serves as a cumulative acknowledgement for all bytes of data that have occurred before that sequence number and 

#### congestion control

multiple senders/receivers

* end-end congestion control
  * no explicit feedback from network
  * congestion inferred from observed loss, delay
  * approch taken by TCP
*  network-assisted congestion control
  * routers provides direct feedback to sending/receiving hosts with flows passing through congested router
  * may indicate congestion level or explicitly set sending rate

#### TCP congestion control

##### Loss-based

###### AIMD

senders can increase sending rate until packet loss (congestion) occurs, then decrease sending rate on loss event

* Additive Increase

  increase sending rate by 1 maximum segment size every RTT until loss detected

* Multiplicative Decrease

  cut sending rate in half at each loss event

###### slow start

![image-20221022223827678](https://i.ibb.co/nQcrDmc/image-20221022223827678.png)

#### Delay-based

Keeping the just pipe full but not fuller

#### flow control

one sender one receiver

## Lecture 4 (Network-layer Data Plane)

transport segment from sending to receiving host

* sender

  encapsulates segments into datagrams, passes to link layer

* receiver

  delivers segments to transport layer protocol

in every internet devices: hosts, routers

routers

* examines header fields in all IP datagrams passing through it
* moves datagrams from input ports to  output ports to transfer datagrams along end-end path

### Two key function

* forwarding

  move packets from a router's input link to appropriate router output link

* routing

  determine route taken by packets from source to destination

### Router

![image-20221023145657394](https://i.ibb.co/tQQmdry/image-20221023145657394.png)

#### Input port functions

![image-20221023150518101](https://i.ibb.co/VSvYyn7/image-20221023150518101.png)

##### decentralized switching

* using header field values, lookup output port using forwarding table in input port memory(" match plus action")
* destination-based forwarding: forward based only on destination IP address (traditional)
* generalized forwarding: forward based on any set of header field values

##### Longest prefix matching

when looking for forwarding table entry for given destination address, use longest address prefix that matches destination address

#### Switching fabrics

* transfer packet from input link to appropriate output link
* switching rate: rate at which packets can be transfer from inputs to outputs
  * often measured as multiple of input/output line rate
  * N inputs: switching rate N times line rate desirable

##### type

* via memory

  first generation routers:

  * traditional computers with switching under direct control of CPU

* via bus

  datagram from input port memory to output port memory via a shared bus

* via interconnection network

  can exploiting parallelism:

  * fragment datagram into fixed length cells on entry
  * switch cells through the fabric, reassemble datagram at exit

![image-20221023151806995](https://i.ibb.co/gFZQ9KF/image-20221023151806995.png)

#### Input port queueing

* if switch fabric slower than input ports combined
  * queueing delay and loss due to input buffer overflow
  * Head-of-the-Line(HOL) blocking: queued datagram at front of queue prevents others in queue from moving forward

#### output port queueing

* buffering required when datagrams arrive from fabric faster than link transmission rate.

  drop policy:

  * tail drop: drop arriving packet
  * priority: drop on priority basis

* scheduling discipline chooses among queued datagrams for transmission

  * first come, first served
  * priority
  * round robin
  * weighted fair queueing

![image-20221023153118613](https://i.ibb.co/wRWDtMR/image-20221023153118613.png)

### Internet Protocol

#### IPV4

##### IP Datagram format

 ![image-20221023161411158](https://i.ibb.co/b3gzN6M/image-20221023161411158.png)

#### address

* ip address

  32-bit identifier associated with each host or router interface

* interface

  connection between host/router and physical link

  * router's typically have multiple interfaces
  * host typically has one or two interfaces (e.g., wired Ethernet, wireless 802.11)

  ![image-20221023162100957](https://i.ibb.co/vs24SK2/image-20221023162100957.png)

  blue are are link layer detail

* subnet part
  devices in same subnet have common high order bits

* host part

  remaining low order bits

##### ways to get IP

* hard-coded by sysadmin in config file

* Dynamic Host Configuration Protocol: dynamically get address from a server
  * plug-and-play

#### CIDR

Classless InterDomain Routing( pronounced "cider")

* subnet portion of address of arbitrary length
* address format: a.b.c.d/x, where x is bit count in subnet portion of address

![image-20221023163856687](https://i.ibb.co/p4G54v2/image-20221023163856687.png)

#### Subnets

definition

* device interfaces that can physically reach each other without passing through an intervening router
* a piece of the network that contains all devices that can reach each other without passing through a network layer router

#### DHCP

host dynamically obtains IP address from network server when it 
"joins" network

* can renew its lease on address in use
* allows reuse of addresses (only hold address while connected/on)
* support for mobile users who join/leave network

steps

* DHCP discover (optional)

  hsot broadcasts DHCP discover msg

* DHCP offer (optional)

  DHCP server responds with DHCP offer msg

* above two steps can be skipped if a client remembers and wishes to reuse a previously allocated network address

* DHCP request

  host requests IP address with DHCP request msg

* DHCP ack

  DHCP server sends address: DHCP ack msg

typically, DHCP server will be co-located in router, serving all subnets to which router is attached

![image-20221023172138826](https://i.ibb.co/GcLK3FM/image-20221023172138826.png)

DHCP can return more than just allocated IP address on subnet:

* address of first-hop router for client
* name and IP address of DNS server
* network mask (indicating network versus host portion of address)

#### ICANN

internet corporation for assigned names and numbers

* allocates IP addresses, through 5 regional registries( RRs) (who may allocate to local registries)
* manages DNS root zone, including delegation of individual TLD management

#### NAT

network address translation:

all devices in local network share just one IPv4 address as far as outside world is concerned

![image-20221023174747031](https://i.ibb.co/KrpxXkS/image-20221023174747031.png)

* all devices in local network have 32-bit address in a "private" IP address space (10/8,172.16/12,192.168/16 prefixes) that can only be used in local network
* advantages:
  * just one IP address needed form provider ISP for all devices
  * can change addresses of host in local network without notifying outside world
  * can change ISP without changing addresses of devices in local network
  * security: devices inside local net not directly addressable, visible by outside world
* implimentation
  * outgoing datagrams replacement
  * translation pair remembrance
  * incoming datagrams replacement

#### IPV6

![image-20221023205223631](https://i.ibb.co/YjCK7hM/image-20221023205223631.png)

tunneling:

ipv6 datagram carried as payload in ipv4 datagram among ipv4 routers

![image-20221023205301203](https://i.ibb.co/KhJnppc/image-20221023205301203.png)

### Generalized Forwarding

match plus action

* many header fields can determine action
* many action possible: drop/copy/modify/log packet

#### Flow table

* flow: defined by header field values (in link-,network-,transport layer fields)

![image-20221023211415475](https://i.ibb.co/DpNtCGf/image-20221023211415475.png)

## Lecture 5 (Network-layer Control Plane)

### Per-router control plane

#### Routing algorithm

determine "good" paths (equivalently routes), from sending hosts to receiving host, through network of routers

* path: sequence of routers packets traverse from given initial source host to final destination host
* "good": least "cost", "fastest", "least congested"

##### classification

pers1

* global: all routers have complete topology, link cost info

  * "link state" algorithm

    e.g. Dijkstra

*  decentralized: iterative process of computation, exchange of info with neighbors

  * router initially only know link costs to attached neighbors
  * "distance vector" algorithms

pers2

* static: routes change slowly over time
* dynamic: routes change more quickly
  * periodic updates or in response to link cost changes

#### scalable routing

aggregate routers into regions known as "autonomous systems"(AS) (a.k.a "domains")

##### intra-AS ("intra-domain")

routing among routers within same AS ("netwrok")

*  all routers in AS must run same intra-domain protocol
* routers in different AS can run different intra-domain routing protocols
* gateway router: at "edge" of its own AS, has link(s) to router(s) in other AS'es

most common intra-AS routing protocols

* RIP routing information protocol
* OSPF open shortest path first
* EIGRP enhanced interior gateway routing protocol

##### inter-AS ("inter-domain")

routing among AS'es

* gateways perform inter-domian routing

BGP( Border Gateway Protocol): the de facto inter-domain routing protocol

* allows subnet to advertise its exsistence, and the destinations it can reach, to rest of Internet
* BGP provides each AS a means to:
  * obtain destination network reachability info from neighboring ASes (eBGP)
  * determine routes to other networks based on reachability infomation and policy
  * propagate reachability information to all AS-internal routers (iBGP)
  * advertise (to neighboring) destination reachability info

### ICMP

internet control message protocol

* used by hosts and routers to communicate network-level information
  * error reporting: unreachable host, network, port, protocol
  * echo request/reply (used by ping)
* network layer "above" IP:
  * ICMP messages carried in IP datagrams, protocol number: 1
* ICMP message: type, code plus header and first 8 bytes of IP datagram causing error

![image-20221024152736352](https://i.ibb.co/qrWz8r4/image-20221024152736352.png)

## Lecture 6 (Link-Layer)

### Terminology

* nodes

  hosts, routers

* links

  communication channels that directly connect physically adjacent nodes

  * wired, wireless
  * LANs

* frame

  layer-2 packet encapsulates datagram

### Context

* datagram transferred by different link protocols over different links
  * e.g. WiFi on first link, Ethernet on next link
* each link protocol provides different services
  * e.g. may or may not provide reliable data tranfer over link

### Services

* framing, link access
  * encapsulate datagram into frame,  adding header, trailer
  * channel access if shared medium
  * "MAC" accesses in frame headers identify source, destination
* reliable delivery between adjacent nodes
* flow control
  * pacing between adjacent sending and receiving nodes
* error detection
  * error caused by signal attenuation, noise
  * receiver detects errors, signals retranssmision, or drop frame
* error correction
  * receiver identifies and corrects bit error(s) without retransmission
* half-duplex and full-duplex
  * with half duplex, nodes at both ends of link can transmit, but not at same time

### implementation

* in each-and-every host
* link layer implemented on-chip or in network interface card(NIC)
* attaches into host's system buses
* combination of hardware, software, firmware

![image-20221024194755683](https://i.ibb.co/T84bLZc/image-20221024194755683.png)

### MAC addresses

* used "locally" to get frame from one interface to another physically connected interface 
* 48-bits MAC address burned in NIC ROM ,also sometimes software settable
* MAC address allocation administered by IEEEE
* manufacturer buys portion of MAC address space (to assure uniqueness)
* analogy
  * MAC address: like social security number
  * IP address: like postal address
* MAC flat address: portability
  * can move interface from one LAN to  another
  * recall IP address not portable: depends on IP subnet to which node is attac

each interface on LAN

* has unique 48-bit MAC address
* has a locally unique 32-bit IP address

### Multiple access links

* point to point
  * point-to-point link between Ethernet switch, host
  * PPP for dial-up access
* broadcast( shared wire or medium)
  * old-school Ethernet
  * upstream HFC in cable-based access network
  * 802.11 wireless LAN, 4G/5G. satellite

### Multiple access protocols

why

* single shared broadcast channel
* two or more simultaneous transmissions by nodes: interference
  * collision if node receives two or more signals at the same time

* distributed algorithm that determines how nodes share channel, i.e. ,determine which node can transmit
* communication about channel sharing must use channel itself
  * no out-of-band channel for coordination

#### taxonomy

* taking turns
  * nodes take turns, but nodes with more to send can take longer turns
* random access
  * channel not divided, allow collisions
  * "recover" from collisions
* channel partitioning
  * divide channel into smaller "pieces" (time slots, frequency, code)
  * allocate piece to node for exclusive use

#### channel partitioning

##### TDMA

time division multiple access

* access to channel in "rounds"
* each station gets fixed length slot (length= packet transmission time) in each round
* unused slots go idle

![image-20221025151506652](https://i.ibb.co/fHYXp8G/image-20221025151506652.png)

##### FDMA

frequency division multiple access

* channel spectrum divided into frequency bands
* each station assigned fixed frequency band
* unused transmission time in frequency bands go idle

![image-20221025151446703](https://i.ibb.co/HTLMNLx/image-20221025151446703.png)

#### Random access

* when node has packet to send
  * transmit at full channel data rate R
  * no a priori coordination among nodes
* two+ sending nodes: "collision"
* random access protocol specifies:
  * when to send
  * how to detect collisions
  * how to recover from collisions (e.g., via delayed retransmissions)
* examples
  * ALOHA
  * CSMA, CSMA/CD, CSMA/CA

##### Slotted ALOHA

* allow collision to happen (and then recover via retransmission)

* use randomization in choosing when to retransmit

* setting

  * all frames same size
  * time divided into equal size slots (time to transmit 1 frame)
  * nodes are synchronized
  * nodes begin transmissions (if any) at slot start times
  * if 2 or more nodes transmit in slot, collision detected by sender

* operation

  * when node has new frame to send, transmit in next slot
    * if no collision: success
    * if collision: node retransmits frame in each subsequent slot with probability p until success

* Pros

  * single active node can continuously transmit at full rate of channel
  * highly decentralized: only slots in nodes need to be in sync
  * simple

* Cons

  * synchronization
  * collision, "wasting" slots
  * idle slots, "wasting" slots

* efficiency: long-run fraction of successful slots (many nodes, all with many frames to send)

  ...

  at best 37%

##### CSMA

carrier sense multiple access

* sinle CSMA

  listen before transmit

  * if channel sensed idel: transmit entire frame
  * if channel sensed busy: defer transmission

* CSMA/CD

  CSMA with collision detection

  * collisions detected within short time

  * colliding transmissions aborted, reducing channel wastage

  * collision detection easy in wired, difficult with wireless

  * reduces the amount of time wasted in collisions

  * algorithm

    * Ethernet receives datagram form network layer, creates frame

    * if Ethernet senses channel:

      if idle: start frame transmission

      if busy: wait until channel idle, then transmit

    * if entire frame transmitted without collision: done

    * if another transmission detected while sending: abort, send jam signal

    * after aborting, entire binary (enponential) backoff:

      after mth collision, chooses K at random from {0,1,2,...,2^m-1}. NIC waits K*512 bit times, returns to step 2

      more collisions: longer backoff interval

###### collisions

* collision can still occur with carrier sensing:
  * propagation delay means two nodes may not hear each other's just started transmission
* collision: entire packet transmission time wasted
  * distance & propagation delay play role in determining collision probability

#### taking turns

* channel allocated explicitly
* nodes won't hold channel for long if nothing to send
* two approaches: polling, token passing

##### polling

* centralized controller uses polling messages to "invite" client nodes to transmit in turn

##### token passing

* control token message explicitly passed from one node to next, sequentially
* transmit while holding token

### ARP

address resolution protocol

ARP table: each IP node (host, router) on LAN has table

* IP/MAC address mappings for some LAN nodes:

  <IP,MAC,TTL>

  * TTL(time to live): time after which address mapping will be forgotten (typically 20 min)

### Ethernet

"dominant" wired LAN technology

* first widely used LAN technology
* simpler, cheap
* kept up with speed race: 10Mbps- 400 Gbps
* single chip, multiple speeds (e.g., Broadcom BCM5761)

#### topology

* bus
  * popular through mid 90s
  * all nodes ihn same collision domain (can collide with each other)
* switched
  * prevails today
  * active link-layer 2 switch in center
  * each "spoke" run a (seperate) Ethernet protocol (nodes do not collide with each other)

![image-20221025161439993](https://i.ibb.co/bRf0WwD/image-20221025161439993.png)

#### frame structure

sending interface encapsulates IP datagram (or other network layer protocol packet) in Ethernet frame

![image-20221025161546416](https://i.ibb.co/16gt5tG/image-20221025161546416.png)

* preamble
  * used to synchronize receiver, sender clock rates
  * 7 bytes of 10101010 followed by one byte of 10101011

* dest. source address

  6 byte mac address

  * if adapter receives frame with matching destination address, or with broadcast address (e.g., ARP packet), it passes data in frame to network layer protocol
  * otherwise, adapter discards frame

* type

  * indicates higher layer protocol
  * mostly IP but others possible e.g., Novell IPX, AppleTalk
  * used to demultiplex up at receiver

* CRC

  cyclic redundancy check at receiver

  * error detected: frame is dropped

#### feature

* connectionless: no handshaking between sending and receiving NICs

* unreliable: receiving NIC doesn't send ACKs or NAKs to sending NIC

  data in dropped frames recovered only if initial sender uses higher layer rdt (e.g. TCP), otherwise dropped data lost

* MAC protocol: unslotted CSMA/CD with binary backoff

#### standards

standards:link & physical layers

many different Ethernet standards

* common MAC protocol and frame format
* different speeds: 2Mbps, 10Mbps, 100Mbps...
* different physical layer media: fiber, cable

![image-20221025162853104](https://i.ibb.co/jDgXkq6/image-20221025162853104.png)

### Switch

link-layer device: take an active role

* store, forward Ethernet frames

* examine incoming frame's MAC address, selectively forward frame to one-or-more outgoing links when frame is to be forwarded on segment, uses CSMA/CD to access segment

* transparent

  hosts unaware of presence of switches

* plug-and-play, self-learning
  don't need to be configured

#### multiple simultaneous transmissions

* hosts have dedicated, direct connection to switch
* switches buffer packets
* Ethernet protocol used on each incoming link, so:
  * no collisions; full duplex
  * each link is tis own collision domain

#### self-learning

* map host and mac address by link and source address in frame

* frame destination location known

  selectively send

* frame destination location unknown

  flood

### VLAN

motivation

* single broadcast domain
  * scaling
  * efficiency, security, privacy, efficiency issues
* administrative issues

definition

switch supporting VLAN capabilities can be configured to define multiple virtual LANs over single physical LAN infrastructure

#### Port-based VLANs

switch ports grouped (by switch management software) so that single physical switch operates as multiple virtual switches

![image-20221025165500032](https://i.ibb.co/j3mqd2n/image-20221025165500032.png)
