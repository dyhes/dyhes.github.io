---
title: 【HTTP】Basics
date: 2021-05-14 00:00:00+0000
categories: 
- nutrition
---

## HTTP

HTTP stands for Hyper Text Transfer Protocol

![image-20220120200019157](C:\Users\dyhes\AppData\Roaming\Typora\typora-user-images\image-20220120200019157.png)

HTTP is generally designed to be simple and human readable, even with the added complexity introduced in HTTP/2 by encapsulating HTTP messages into frames.

### Request

 A typical HTTP request contains:

- HTTP **version type**
- URL
- HTTP **method**
- HTTP **request header**

![image-20220120170645475](C:\Users\dyhes\AppData\Roaming\Typora\typora-user-images\image-20220120170645475.png)

- **Optional** HTTP body.

The body of an HTTP request contains any information being submitted to the web server, such as a username and password, or any other data entered into a form.

### Status

HTTP status codes are 3-digit codes most often used to indicate whether an HTTP request has been successfully completed. Status codes are broken into the following 5 blocks:

- 1xx **Informational**
- 2xx **Success**
- 3xx **Redirection**
- 4xx **Client Error**
- 5xx **Server Error**

Keep in mind that HTTP is a “**stateless**” protocol, which means that each command runs **independent** of any other command. In the original spec, **HTTP requests each created and closed a TCP connection.** In newer versions of the HTTP protocol (HTTP 1.1 and above), persistent connection allows for multiple HTTP requests to pass over a persistent TCP connection, improving resource consumption. 

while the core of HTTP itself is stateless, HTTP cookies allow the use of stateful sessions. Using header extensibility, HTTP Cookies are added to the workflow, allowing session creation on each HTTP request to share the same context, or the same state.



### Proxy

HTTP is a **client-server** protocol: **requests** are sent by one entity, the user-agent (or a proxy on behalf of it).Each individual request is sent to a server, which handles it and provides an answer called the ***response***.  A server is not necessarily a single machine, but several server software instances can be hosted on the same machine. With HTTP/1.1 and the `Host` header, they may even share the same IP address.

Between the client and the server there are numerous entities, collectively called proxies, which perform different operations and act as **gateways or caches**. Proxies are those  numerous computers and machines which  operate at the application layers and relay the HTTP messages between the Web browser and the server.

![image-20220120200604043](C:\Users\dyhes\AppData\Roaming\Typora\typora-user-images\image-20220120200604043.png)

In reality, there are more computers between a browser and the server handling the request: there are **routers, modems, and more**.

These can be transparent, forwarding on the requests they receive without altering them in any way, or non-transparent, in which case they will change the request in some way before passing it along to the server. 

Proxies may perform numerous functions:

- **caching** (the cache can be public or private, like the browser cache)
- **filtering** (like an antivirus scan or parental controls)
- **load balancing** (to allow multiple servers to serve different requests)
- **authentication** (to control access to different resources)
- **logging** (allowing the storage of historical information)

### Procedure

When a client wants to communicate with a server, either the final server or an intermediate proxy, it performs the following steps:

1. Open a **TCP connection**: The TCP connection is used to send a request, or several, and receive an answer. The client may open a new connection, reuse an existing connection, or open several TCP connections to the servers.
2. Send an **HTTP message**: HTTP messages (before HTTP/2) are human-readable. With HTTP/2, these simple messages are encapsulated in frames, making them impossible to read directly, but the principle remains the same.
3. **Read the response** sent by the server
4. **Close or reuse the connection** for further requests.

If HTTP **pipelining** is activated, several requests can be sent without waiting for the first response to be fully received. HTTP pipelining has proven difficult to implement in existing networks, where old pieces of software coexist with modern versions. HTTP pipelining has been superseded in HTTP/2 with more robust multiplexing requests within a frame.

HTTP messages, as defined in HTTP/1.1 and earlier, are human-readable. In HTTP/2, these messages are embedded into a binary structure, a *frame*, allowing optimizations like compression of headers and multiplexing.

### `HTTP/0.9` (The One Liner) -1991

The first documented version of HTTP was [`HTTP/0.9`](https://www.w3.org/Protocols/HTTP/AsImplemented.html)

The server would get the request, reply with the HTML in response and as soon as the content has been transferred, the connection will **be closed**. 

There were

- No headers
- `GET` was the only allowed method
- Response had to be HTML

**Sample**

```http
GET /index.html
```

```http
(response body)
```

**(connection closed)**

### `HTTP/1.0` - 1996

* could deal with **other response formats**.
* It added **more methods** (i.e. `POST` and `HEAD`),
* HTTP **headers got added** to both the request and responses
* **status codes** were added to identify the response
* c**haracter set support** was introduced
* multi-part types
* authorization
* caching
* content encoding and more

**Sample**

```http
GET / HTTP/1.0
Host: kamranahmed.info
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5)
Accept: */*
```

```http
HTTP/1.0 200 OK 
Content-Type: text/plain
Content-Length: 137582
Expires: Thu, 05 Dec 1997 16:00:00 GMT
Last-Modified: Wed, 5 August 1996 15:55:28 GMT
Server: Apache 0.84

(response body)
```

**(connection closed)**

#### drawback

One of the **major drawbacks** of `HTTP/1.0` were you **couldn’t have multiple requests per connection**. That is, whenever a client will need something from the server, it will have to open a new TCP connection and after that single request has been fulfilled, connection will be closed. And for any next requirement, it will have to be on a new connection. 

 let’s assume that you visit a webpage having `10` images, `5` stylesheets and `5` javascript files, totalling to `20` items that needs to fetched when request to that webpage is made. Since the server closes the connection as soon as the request has been fulfilled, there will be a series of `20` separate connections where each of the items will be served one by one on their separate connections. 

Apart from being **connectionless**, `HTTP` also is a stateless protocol. server doesn’t maintain the information about the client and so each of the requests has to have the information necessary for the server to fulfill the request on it’s own without any association with any old requests. So it also has to send some redundant data on the wire **causing increased bandwidth usage**.

### `HTTP/1.1` - 1999

- **New HTTP methods** were added, which introduced `PUT`, `PATCH`, `OPTIONS`, `DELETE`
- **Hostname Identification** In `HTTP/1.0` `Host` header wasn’t required but `HTTP/1.1` made it **required**.
- **Persistent Connections** `HTTP/1.1` introduced the persistent connections i.e. **connections weren’t closed by default** and were kept open which allowed multiple sequential requests. To close the connections, the **header `Connection: close`** had to be available on the request. Clients usually send this header in the last request to safely close the connection.
- **Pipelining** It also introduced the support for pipelining, where **the client could** **send multiple requests to the server without waiting for the response from server on the same connection and server had to send the response in the same sequence in which requests were received**. To solve this problem that the client don't know where is the point where first response download completes and the content for next response starts, **there must be `Content-Length`** header present which clients can use to identify where the response ends and it can start waiting for the next response.

> But there was still an issue with this approach. And that is, what if the data is dynamic and server cannot find the content length before hand? Well in that case, you really can’t benefit from persistent connections, could you?! In order to solve this `HTTP/1.1` introduced chunked encoding. In such cases server may omit content-Length in favor of chunked encoding. However, if none of them are available, then the connection must be closed at the end of request.

- **Chunked Transfers** In case of dynamic content, when the server cannot really find out the `Content-Length` when the transmission starts, it may start sending the content in pieces (chunk by chunk) and add the `Content-Length` for each chunk when it is sent. And when all of the chunks are sent. whole transmission has completed, it sends an empty chunk the one with `Content-Length` set to zero in order to identify the client that transmission has completed. In order to notify the client about the chunked transfer, server includes the header `Transfer-Encoding: chunked`
- Unlike `HTTP/1.0` which had Basic authentication only, `HTTP/1.1` included **digest and proxy authentication**
- Caching
- Byte Ranges
- Character sets
- Language negotiation
- Client cookies
- Enhanced compression support
- New status codes
- ..and more

### SPDY - 2009

Google went ahead and started experimenting with alternative protocols to make the web faster and improving web security while reducing the latency of web pages. In 2009, they announced `SPDY`.

In 2015, at Google, they didn’t want to have two competing standards and so they decided to merge it into HTTP while giving birth to `HTTP/2` and deprecating SPDY.

### `HTTP/2` - 2015

`HTTP/2` was designed for low latency transport of content. The key features or differences from the old version of `HTTP/1.1` include

- **Binary** instead of Textual
- **Multiplexing** - Multiple asynchronous HTTP requests over a single connection
- **Header compression** using HPACK
- **Server Push** - Multiple responses for single request
- Request **Prioritization**
- Security

##### Frames and Streams

HTTP messages are now composed of one or more frames. There is a `HEADERS` frame for the meta data and `DATA` frame for the payload and there exist several other types of frames (`HEADERS`, `DATA`, `RST_STREAM`, `SETTINGS`, `PRIORITY` etc) 

Every `HTTP/2` request and response is given a **unique stream ID** and it is divided into frames. 

Frames are nothing but binary pieces of data. A collection of frames is called a Stream. 

Each frame has a stream id that identifies the stream to which it belongs and each frame has a **common header**. 

Also, apart from stream ID being unique, it is worth mentioning that, any request initiated by **client** uses **odd** numbers and the **response** from server has **even** numbers stream IDs.

client can use `RST_STREAM` and stop receiving a specific stream while the connection will still be open and the other streams will still be in play.

## SSL

SSL, short for **Secure Sockets Layer**, is a family of **encryption technologies** that allows web users to protect the privacy of information they transmit over the internet **introduced by Netscape in 1994**. 

That lock is supposed to signal that third parties won't be able to read any information you send or receive. 

 SSL accomplishes that by transforming your data into a coded message that only the recipient knows how to decipher.









