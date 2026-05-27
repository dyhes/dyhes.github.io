---
title: 【Web】Browser
date: 2021-05-13 00:00:00+0000
categories: 
- nutrition
- grass
---

## What is a web browser

A web browser is a **computer program** that allows users to **download and view websites**.

### history of web browser

The **first** web browser, called **WorldWideWeb**, was created in **1990** by Sir **Tim Berners-Lee.** He then recruited Nicola Pellow to write the Line Mode Browser, which displayed web pages on dumb terminals.
1993 was a landmark year with the release of **Mosaic**, credited as "the world's first popular browser". Its innovative graphical user interface made the World Wide Web system easy to use and thus more accessible to the average person. This, in turn, sparked the Internet boom of the 1990s, when the Web grew at a very rapid rate. Marc Andreessen, the leader of the Mosaic team, soon started his own company, **Netscape**, which released the Mosaic-influenced **Netscape Navigator** in **1994**. Navigator quickly became the most popular browser.

Microsoft debuted **Internet Explorer** in 1995, leading to a browser war with Netscape. Within a few years, Microsoft gained a dominant position in the browser market for two reasons: it bundled Internet Explorer with its popular Windows operating system and did so as freeware with no restrictions on usage. The market share of Internet Explorer peaked at over **95%** in the early 2000s.

In 1998, Netscape launched what would become the **Mozilla Foundation** to create a new browser using the open source software model. This work evolved into the **Firefox** browser, first released by Mozilla in 2004. Firefox market share peaked at 32% in 2010.

Apple released its **Safari** browser in 2003. Safari remains the dominant browser on Apple devices, though it did not become popular elsewhere.

Google debuted its **Chrome browser** in **2008**, which steadily took market share from Internet Explorer and became the most popular browser in **2012**. Chrome has remained dominant ever since.

Microsoft released its **Edge browser** in **2015** as part of the Windows 10 release. (Internet Explorer is still used on older versions of Windows.)

## Components

![image-20220120165610428](C:\Users\dyhes\AppData\Roaming\Typora\typora-user-images\image-20220120165610428.png)



- **User Interface**: This component allows **end-users** to interact with all visual elements available on the web page. The visual elements include the **address bar, home button, next button,** and all other elements that fetch and display the web page requested by the end-user.
- **Browser Engine:** It is a **core component** of every web browser. The browser engine functions as an intermediary or a bridge between the user interface and the rendering engine. It queries and handles the rendering engine as per the inputs received from the user interface.
- **Rendering Engine:** As the name suggests, this component is responsible for rendering a specific web page requested by the user on their screen.
- **Networking:** This component is responsible for managing network calls using standard protocols like HTTP or FTP. It also looks after security issues associated with internet communication.
- **JavaScript Interpreter**: As the name suggests, it is responsible for parsing and executing the JavaScript code embedded in a website.
- **UI Backend:** This component uses the **user interface methods of** **the underlying operating system**. It is mainly used for drawing basic widgets (windows and combo boxes).
- **Data Storage/Persistence:** It is a persistent layer. A web browser needs to store various types of data locally, for example, cookies. As a result, browsers must be compatible with data storage mechanisms such as WebSQL, IndexedDB, FileSystem, etc.

## Process

### Navigation

#### TCP Handshake

![image-20220120001242662](C:\Users\dyhes\AppData\Roaming\Typora\typora-user-images\image-20220120001242662.png)

TCP (Transmission Control Protocol) uses a **three-way handshake** to set up a TCP/IP connection over an IP based network.

* **SYN**：chronize

The host, generally the browser, sends a TCP SYNchronize packet to the server. 

* **SYN**：chronize-**ACK**nowledgement

The server receives the SYN and sends back a SYNchronize-ACKnowledgement. 

* **ACK**：nowledge

The host receives the server's SYN-ACK and sends an ACKnowledge. The server receives ACK and the TCP socket connection is established.

![Three-Way Handshake - an overview | ScienceDirect Topics](data:image/jpeg;base64,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)

This handshake step happens after a **DNS lookup** and before the **TLS handshake**, which creating a secure connection. The connection can be terminated independently by each side of the connection via a four-way handshake.

#### TLS(Transport Layer Security) Negotiation

This step determines which **cipher** will be used to encrypt the communication, verifies the server, and **establishes that a secure connection** is in place before beginning the actual transfer of data. This requires three more round trips to the server before the request for content is actually sent.

![image-20220120160737102](C:\Users\dyhes\AppData\Roaming\Typora\typora-user-images\image-20220120160737102.png)

(The DNS lookup, the TCP handshake, and 5 steps of the TLS handshake including clienthello, serverhello and certificate, clientkey and finished for both server and client)

While making the connection secure adds time to the page load, a secure connection is worth the latency expense, as the data transmitted between the browser and the web server cannot be decrypted by a third party.

After the 8 round trips, the browser is finally able to make the request.

#### TTFB(Time to First Byte)

TTFB  refers to the **time** between the browser requesting a page and when it receives **the first byte of information** from the server. This time includes 

* DNS lookup
* establishing the connection using a TCP handshake
* SSL handshake(if the request is made over https)

#### TCP Slow Start / 14kb rule

The first response packet will be 14Kb. This is part of **TCP slow start**, an **algorithm** which balances the speed of a network connection. Slow start gradually increases the amount of data transmitted until the network's **maximum bandwidth** can be determined.

![image-20220120161834945](C:\Users\dyhes\AppData\Roaming\Typora\typora-user-images\image-20220120161834945.png)

As the server sends data in TCP packets, the user's client confirms delivery by returning acknowledgements, or ACKs. If the server sends too many packets too quickly, they will be dropped. Meaning, there will be no acknowledgement. 



### Critical Rendering Path

#### Parsing

Once the browser receives the first chunk of data, it can begin parsing the information received. Parsing is the step the browser takes to turn the data it receives over the network into the DOM and CSSOM, which is used by the renderer to paint a page to the screen.

It's important for web performance optimization to include everything the browser needs to **start rendering a page**, or at least a **template of the page** - the CSS and HTML needed for the first render -- in the **first 14 kilobytes**.

* **Building the DOM tree**

  The **first** step is processing the HTML markup and building the DOM tree. HTML parsing involves **tokenization** and **tree construction**. HTML tokens include start and end tags, as well as attribute names and values. If the document is well-formed, parsing it is straightforward and faster. The parser parses tokenized input into the document, building up the document tree.

  When the parser finds **non-blocking** resources, such as an image, the browser will request those resources and continue parsing. Parsing can continue when a **CSS file is encountered**, but `<script>` tags—particularly those without an async or defer attribute—**block rendering**, and pause the parsing of HTML. Though the browser's preload scanner hastens this process, excessive scripts can still be a significant bottleneck.

  * **Preload Scanner**

    While the browser builds the DOM tree, this process occupies **the main thread**. As this happens, the *preload scanner* will parse through the content available and request **high priority resources** like CSS, JavaScript, and web fonts. 

* **Building the CSSOM**

  The **second** step in the critical rendering path is processing CSS and building the CSSOM tree. The CSS object model is **similar** to the DOM. The DOM and CSSOM are both trees. They are independent data structures. The browser converts the CSS rules into a map of styles it can understand and work with. The browser goes through each rule set in the CSS, creating a tree of nodes with parent, child, and sibling relationships based on the CSS selectors.

  As with HTML, the browser needs to convert the received CSS rules into something it can work with. Hence, it **repeats the HTML-to-object process**, but for the CSS.

  The CSSOM tree includes styles from the user agent style sheet. The browser begins with the most general rule applicable to a node and recursively refines the computed styles by applying more specific rules. In other words, it **cascades** the property values.

* **Other Processes**

  * JavaScript Compilation

  While the CSS is being parsed and the CSSOM is created, other assets, including JavaScript files, are downloading (thanks to the preload scanner).  JavaScript is interpreted, compiled, parsed and executed. The scripts are parsed into **abstract syntax trees**.  Some browser engines take the Abstract Syntax Tree and pass it into an interpreter, outputting bytecode which is executed on the main thread. This is known as JavaScript compilation.

  * Building the Accessibility Tree

  The **accessibility object model (AOM)** is like a semantic version of the DOM. The browser updates the accessibility tree when the DOM is updated. The accessibility tree is not modifiable by assistive technologies themselves. Until the AOM is built, the content is not accessible to **screen readers**.

#### Render

Rendering steps include style, layout, paint and, in some cases, compositing. The CSSOM and DOM trees created in the parsing step are combined into a **render tree** which is then used to compute the layout of every visible element, which is then painted to the screen. In some cases, content can be promoted to their own layers and composited, improving performance by painting portions of the screen on the GPU instead of the CPU, freeing up the main thread.

* **Style**

  The **third** step in the critical rendering path is **combining the DOM and CSSOM into a render tree**. The computed style tree, or render tree, construction starts with the root of the DOM tree, traversing each visible node.

  * tags that aren't going to be displayed are not included in the render tree
  * Nodes with `visibility: hidden` applied are included in the render tree, as they do take up space.
  * As we have not given any directives to override the user agent default, the **script node** will not be included in the render tree.

  Each visible node has its CSSOM rules applied to it. The render tree holds all the visible nodes with content and computed styles -- matching up all the relevant styles to every visible node in the DOM tree, and determining, based on the CSS cascade, what the computed styles are for each node.

* **Layout**

  The **fourth step** in the critical rendering path is **running layout on the render tree to compute the geometry of each node.** 

  Once the render tree is built, layout **commences**. The render tree identified which nodes are displayed (even if invisible) along with their computed styles, but **not the dimensions or location** of each node. To determine the exact size and location of each object, the browser starts at the **root** of the render tree and traverses it.

  The btime the size and position of nodes are determined is called **layout**. **Subsequent** recalculations of node size and locations are called **reflows**. Suppose the initial layout occurs before the image is returned. If the size of a image is not declared, there will be a reflow once the image size is known.

* **Paint**

  The **last** step in the critical rendering path is **painting the individual nodes to the screen**, the first occurrence of which is called the first meaningful paint.

  In the painting or rasterization phase, the browser converts each box calculated in the layout phase to actual pixels on the screen. Painting involves drawing every visual part of an element to the screen, including text, colors, borders, shadows, and replaced elements like buttons and images. The browser needs to do this super quickly.

  To ensure smooth scrolling and animation, everything **occupying the main thread**, including calculating styles, along with reflow and paint, must take the browser less than 16.67ms to accomplish. 

  To ensure repainting can be done even faster than the initial paint, the drawing to the screen is generally broken down into **several layers**. If this occurs, then **compositing** is necessary.

  Painting can break the elements in the layout tree into layers. Promoting content into layers on the GPU (instead of the main thread on the CPU) improves paint and repaint performance. There are **specific properties and elements that instantiate a layer**, including <video> and <canvas>, and any element which has the CSS properties of opacity, a 3D transform, will-change, and a few others. These nodes will be painted onto their own layer, along with their descendants, unless a descendant necessitates its own layer for one (or more) of the above reasons.


* **Compositing**

  When sections of the document are drawn in different layers, overlapping each other, compositing is necessary to ensure they are drawn to the screen **in the right order** and the content is rendered correctly.

  As the page continues to load assets, reflows can happen. A reflow sparks a repaint and a re-composite. Only the layer that needed to be repainted would be repainted, and composited if necessary. 

### Interactivity

Once the main thread is done **painting** the page, you would think we would be "all set." That isn't necessarily the case. If the load includes JavaScript, that was correctly deferred, and only executed after the onload event fires, the main thread might be busy, and not available for scrolling, touch, and other interactions.

##### TTI(Time to Interactive)

TTI is the measurement of how long it took from that **first request** which led to the DNS lookup to when the **page is interactive**.
