---
title: 【Big Data】Hadoop
# description: Math typesetting using KaTeX
date: 2024-08-04 00:00:00+0000
categories: 
    - nutrition
tags:
    - Hadoop
---

## Hadoop
Hadoop is an open-source framework developed by the Apache Software Foundation used for **storing and processing** large datasets in a **distributed** computing environment. It is designed to scale up from a single server to thousands of machines, each offering local computation and storage. Hadoop is built to handle massive amounts of data in a fault-tolerant and efficient manner. 
### Core Components
* **Hadoop Distributed File System (HDFS):**
  * **Purpose:** HDFS is designed to store large datasets reliably and to **stream** those datasets to user applications at high bandwidth.
  * **Architecture:** It follows a **master-slave** architecture. The HDFS cluster consists of a single **NameNode (master)** that manages the file system namespace and regulates access to files by clients. There are multiple **DataNodes (slaves)** that manage storage attached to the nodes they run on.
  * **Features:**
    * **Fault Tolerance:** Data is **replicated** across multiple nodes to ensure availability in case of hardware failure.
    * **Scalability:** Can scale up to thousands of nodes.
    * **High Throughput:** Optimized for high throughput of data access rather than low latency.
* **MapReduce:**
  * **Purpose:** A **programming model** and **execution engine** that is used for processing and generating large datasets.
  * **Components:**
    * **JobTracker:** The **master** node that manages the jobs and resources in the cluster.
    * **TaskTracker:** The **slave** nodes that execute the tasks as directed by the JobTracker.
  * **Phases:**
    * **Map Phase:** Processes input data and converts it into a set of key-value pairs.
    * **Reduce Phase:** Processes the intermediate key-value pairs to generate the final output.
* **1** **YARN (Yet Another Resource Negotiator):**
  * **Purpose:** Manages resources in the Hadoop cluster and schedules jobs.
  * **Components:**
    * **ResourceManager:** The master that controls and allocates resources.
    * **NodeManager:** Manages resources and monitoring on the individual nodes.
    * **ApplicationMaster:** Manages the lifecycle of applications running on YARN.
* **Hadoop Common:**
  * **Purpose:** Provides common utilities and libraries that support the other Hadoop components. It includes the necessary Java libraries and files needed to start Hadoop.
### Ecosystem and Tools
Hadoop has a rich ecosystem of tools and frameworks that enhance its functionality:
* **Hive:** A data warehouse infrastructure that provides data summarization, query, and analysis. It uses a SQL-like language called HiveQL.
* **Pig:** A high-level platform for creating MapReduce programs using a language called Pig Latin.
* **HBase:** A distributed, scalable, big data store modeled after Google’s Bigtable and written in Java.
* **Sqoop:** A tool designed for efficiently transferring bulk data between Hadoop and structured data stores such as relational databases.
* **Flume:** A service for efficiently collecting, aggregating, and moving large amounts of log data.
* **Oozie:** A workflow scheduling system to manage Hadoop jobs.
* **Zookeeper:** A centralized service for maintaining configuration information, naming, providing distributed synchronization, and providing group services.
* **Spark:** A fast and general engine for large-scale data processing that can run on Hadoop clusters.
### Key Features
* **Scalability:** Can scale horizontally to handle more data by adding more nodes to the cluster.
* **Cost-Effective:** Uses commodity hardware, making it a cost-effective solution for big data processing.
* **Flexibility:** Can process structured, semi-structured, and unstructured data.
* **Fault Tolerance:** Automatically handles hardware failures by replicating data across multiple nodes.
* **Distributed Computing:** Processes data in parallel across multiple nodes, increasing processing speed and efficiency.
### ⠀Use Cases
* **Data Warehousing:** Companies use Hadoop for storing vast amounts of structured and unstructured data.
* **Log Processing:** Hadoop is used to analyze and process server logs for insights and troubleshooting.
* **Recommendation Systems:** Used by companies like Netflix and Amazon for building recommendation engines.
* **Data Archival:** Storing large volumes of historical data for compliance and analysis.

## Spark
Apache Spark is an open-source, distributed computing system that provides an interface for programming entire clusters with implicit data parallelism and fault tolerance. Originally developed at UC Berkeley’s AMPLab, Spark offers a fast and general-purpose cluster-computing framework. It **extends the MapReduce model** to support more types of computations and **optimizes performance** by keeping data in memory whenever possible.
### Key Features
* **Speed:**
  * Spark **processes data in memory**, which significantly reduces the time to read and write to disk. This makes Spark up to 100 times faster than Hadoop MapReduce for certain applications.
  * The DAG (Directed Acyclic Graph) execution engine optimizes task execution by breaking down jobs into stages and tasks, which can be executed in parallel.
* **Ease of Use:**
  * Spark provides high-level APIs in Java, Scala, Python, and R. This versatility allows developers to use the language they are most comfortable with.
  * The interactive shell provided by Spark allows for real-time data analysis and debugging.
* **Compatibility:**
  * Spark is compatible with Hadoop’s HDFS and YARN, allowing it to be deployed on existing Hadoop clusters.
  * It also supports a wide range of data sources, including HBase, Cassandra, Kafka, and more.
