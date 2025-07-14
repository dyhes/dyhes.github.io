---
title: 【Elastic Search】Fundamentals
date: 2025-03-27 00:00:00+0000
categories: 
- willow
tags:
- Elastic Search
---

## 简介

Elasticsearch（简称ES）是一个基于Apache Lucene构建的开源分布式搜索与分析引擎，属于Elastic Stack（原ELK Stack）的核心组件。以下是其核心特性与应用场景的详细介绍：

---

### 核心特性
1. **分布式与高扩展性**  
   - 通过分片机制实现数据水平扩展，每个索引可划分为多个主分片和副本分片，支持动态扩容和负载均衡。
   - 集群中节点分为主节点（管理元数据）、数据节点（存储分片）和协调节点（处理请求），自动实现故障转移。

2. **近实时搜索（NRT）**  
   - 数据写入后1秒内即可被检索，适用于日志分析、监控等需要快速响应的场景。

3. **多数据类型支持**  
   - 支持文本、数值、日期、地理空间等结构化与非结构化数据，通过动态映射自动推断字段类型。

4. **强大的查询与聚合功能**  
   - 提供全文检索（`match`）、精确匹配（`term`）、范围查询（`range`）等多种查询语法，支持复杂布尔逻辑。
   - 通过聚合（Aggregation）实现数据统计、分组和可视化分析。

5. **高可用性与容错**  
   - 副本分片保障数据冗余，主分片故障时副本自动提升为主分片，确保服务连续性。

---

### 技术架构与组件
1. **核心概念**  
   - **索引（Index）**：类似数据库表，存储具有相同结构的文档集合（如`products`索引存储商品数据）。
   - **文档（Document）**：以**JSON格式**存储的基本数据单元，包含多个字段（如商品ID、名称、价格等）。
   - **分片（Shard）**：索引的最小存储单元，主分片数量固定，副本分片可动态调整。

2. **生态系统集成**  
   - **Logstash**：数据采集与处理工具，用于清洗和传输日志等数据至Elasticsearch。
   - **Kibana**：可视化平台，支持仪表盘制作、日志分析和实时监控。

---

### 典型应用场景
1. **全文搜索引擎**  
   - 电商平台（如产品搜索）、内容管理系统（如新闻检索）利用其倒排索引技术实现高效关键词匹配。

2. **日志管理与分析**  
   - ELK Stack广泛用于集中化日志处理，例如服务器性能监控、安全事件审计。

3. **实时数据分析**  
   - 金融交易监控、社交媒体趋势分析（如用户情感分析）依赖其实时聚合能力。

4. **个性化推荐系统**  
   - 结合用户行为数据与向量检索技术（如Faiss库），实现基于相似度的商品或内容推荐。

---

### 进阶功能与挑战
1. **向量检索**  
   - 支持高维向量相似性搜索（如人脸识别、语义匹配），通过集成Faiss库优化算法性能。

2. **运维与监控**  
   - 集群稳定性依赖完善的监控体系，需关注资源分配、分片均衡和JVM性能调优。

3. **商业化扩展**  
   - 阿里云、AWS等提供托管服务（如Amazon OpenSearch），降低企业自建集群的运维成本。

---

### 历史与发展
- **2004年**：Shay Banon开发Compass作为早期原型，后重构为分布式解决方案Elasticsearch。
- **2012年**：成立Elasticsearch BV公司，2018年在纽交所上市，估值超15亿美元。
- **技术演进**：从搜索引擎扩展为综合性数据分析平台，支持机器学习、安全防护等企业级功能。

---

### 总结
Elasticsearch凭借其分布式架构、实时处理能力和丰富的生态系统，成为大数据领域的核心工具。无论是构建搜索引擎、日志分析平台，还是实现复杂的业务分析，均可通过灵活的分片策略和查询语法满足需求。对于企业而言，合理选择自建集群或云托管方案，结合监控工具（如X-Pack）优化性能，是充分发挥其价值的关键。

## 倒排索引

####  **核心概念与结构**  
倒排索引（Inverted Index）是一种通过属性值定位记录的索引方法，常用于全文检索场景。其核心思想是将“文档→关键词”的正向关系转换为“关键词→文档”的反向映射，从而快速定位包含特定关键词的文档。  
- **组成部分**：  
  - **单词词典（Term Dictionary）**：存储所有唯一关键词及其统计信息（如词频）。  
  - **倒排列表（Posting List）**：记录每个关键词对应的文档集合，包含文档编号（DocID）、出现频率（TF）、出现位置（如字符或词位置）等元数据。  
- **示例**：  
  若文档1内容为“Tom lives in Guangzhou”，文档2为“He once lived in Shanghai”，则倒排索引的关键词映射如下：  
  ```
  guangzhou → [文档1]  
  live      → [文档1, 文档2]  
  shanghai  → [文档2]
  ```  
  进一步扩展的倒排列表还会记录词频和位置，例如`live`在文档1出现2次（位置2、5），在文档2出现1次（位置2）。

####  **构建方法与流程**  
倒排索引的构建通常分为以下步骤：  
1. **文档分析与分词**：  
   - 通过分词器（Analyzer）对文本进行分词、去停用词（如“的”“is”）、统一大小写、词干化（如“lives”→“live”）等处理。  
   - 中文需额外分词处理（如“广州市”拆分为“广州”“市”）。  
2. **生成倒排列表**：  
   - 建立关键词与文档的映射，记录词频、位置等信息。  
3. **压缩与存储优化**：  
   - 使用**文档编号差值（D-Gap）**压缩存储（如将187、196、199转换为187、9、3），减少存储空间。  
   - 前缀压缩（如“阿拉伯语”压缩为“3,语”）和数字差值压缩提升效率。  

####  **应用场景与优势**  
- **搜索引擎**：  
  倒排索引是Google、百度等搜索引擎的核心技术，支持亿级数据毫秒级响应。相比传统数据库索引，其优势在于：  
  - **海量数据处理**：通过分布式分片（如Elasticsearch）实现水平扩展。  
  - **高效查询**：基于词典的二分查找快速定位关键词，避免全表扫描。  
- **扩展功能**：  
  - **短语搜索**：通过记录词位置实现精确匹配（如查询“live in”需相邻位置）。  
  - **相关性排序**：结合TF-IDF、BM25算法计算文档与查询的相关性得分。  

####  **与其他索引的对比**  
- **正向索引**：传统“文档→关键词”结构，适合单文档查询，但无法高效支持关键词检索。  
- **动态索引（如B+树）**：支持实时增删改，但复杂度高；倒排索引更适合读多写少的场景。  

####  **典型优化技术**  
- **合并法（Merge Policy）**：  
  将内存中的临时索引分批写入磁盘，最终归并成完整索引，适用于大数据场景。  
- **混合存储策略**：  
  区分热数据（高频访问）与冷数据（历史存档），通过ILM（索引生命周期管理）自动迁移存储介质。  

---  
### 总结  
倒排索引通过“关键词→文档”的反向映射和高效的压缩算法，成为处理海量文本数据的核心技术。它在搜索引擎、日志分析（如ELK技术栈）及推荐系统中广泛应用，并持续通过分布式架构与语义分析技术（如向量检索）扩展能力边界。

## 介绍1
| **Relational DB** | **Elasticsearch** |
|:-:|:-:|
| 数据库(database) | 索引(indices) |
| 表(tables) | types |
| 行(rows) | documents |
| 字段(columns) | fields |
elasticsearch(集群)中可以包含多个索引(数据库)，每个索引中可以包含多个类型(表)，每个类型下又包含多个文档(行)，每个文档中又包含多个字段(列)

**在排序的过程中，只能使用可排序的属性进行排序。那么可以排序的属性有哪些呢?**
* 数字
* 日期
* ID
**布尔查询**
* must (&&)
* should  (||)
* must_not (!)
* filter range
  * gt
  * gte
  * lt
  * lte
匹配方式
* 模糊匹配（`match`）
  * 不经过分词，直接查询精确的值
* 精确匹配（`term`）
  * 会使用分词器解析

## 介绍2
### index索引
一个索引就是一个拥有几分相似特征的文档的集合。比如说，你可以有一个客户数据的索引，另一个产品目录的索引，还有一个订单数据的索引。一个索引由一个名字来标识（必须全部是小写字母的），并且当我们要对对应于这个索引中的文档进行索引、搜索、更新和删除的时候，都要使用到这个名字。在一个集群中，可以定义任意多的索引。

### type类型
在一个索引中，你可以定义一种或多种类型。一个类型是你的索引的一个逻辑上的分类/分区，其语义完全由你来定。通常，会为具有一组共同字段的文档定义一个类型。比如说，我们假设你运营一个博客平台并且将你所有的数据存储到一个索引中。在这个索引中，你可以为用户数据定义一个类型，为博客数据定义另一个类型，当然，也可以为评论数据定义另一个类型。

## Official

### Index
The index is the **fundamental unit of storage** in Elasticsearch, a logical namespace for storing data that share similar characteristics. 
### Documents and fields
Elasticsearch serializes and stores data in the form of JSON documents. A document is a set of fields, which are key-value pairs that contain your data. Each document has a unique ID, which you can create or have Elasticsearch auto-generate.
```json
{
  "_index": "my-first-elasticsearch-index",
  "_id": "DyFpo5EBxE8fzbb95DOa",
  "_version": 1,
  "_seq_no": 0,
  "_primary_term": 1,
  "found": true,
  "_source": {
    "email": "john@smith.com",
    "first_name": "John",
    "last_name": "Smith",
    "info": {
      "bio": "Eco-warrior and defender of the weak",
      "age": 25,
      "interests": [
        "dolphins",
        "whales"
      ]
    },
    "join_date": "2024/05/01"
  }
}
```

An indexed document contains data and metadata. [Metadata fields](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-fields.html) are system fields that store information about the documents. In Elasticsearch, metadata fields are prefixed with an underscore. For example, the following fields are metadata fields:
* _index: The name of the index where the document is stored.
* _id: The document’s ID. IDs must be unique per index.

### Mapping
Each index has a [mapping](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping.html) or schema for how the fields in your documents are indexed. A mapping defines the [data type](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-types.html) for each field, how the field should be indexed, and how it should be stored. When adding documents to Elasticsearch, you have two options for mappings:
* [Dynamic mapping](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping.html#mapping-dynamic): Let Elasticsearch automatically detect the data types and create the mappings for you. Dynamic mapping helps you get started quickly, but might yield suboptimal results for your specific use case due to automatic field type inference.
* [Explicit mapping](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping.html#mapping-explicit): Define the mappings up front by specifying data types for each field. Recommended for production use cases, because you have full control over how your data is indexed to suit your specific use case.
> You can use a combination of dynamic and explicit mapping on the same index. This is useful when you have a mix of known and unknown fields in your data.

### Data Adding
#### General content
General content is data that **does not have a timestamp**. This could be data like vector embeddings, website content, product catalogs, and more. For general content, you have the following options for adding data to Elasticsearch indices:
* [API](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs.html): Use the Elasticsearch [Document APIs](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs.html) to index documents directly, using the Dev Tools [Console](https://www.elastic.co/guide/en/kibana/8.17/console-kibana.html), or cURL.If you’re building a website or app, then you can call Elasticsearch APIs using an [Elasticsearch client](https://www.elastic.co/guide/en/elasticsearch/client/index.html) in the programming language of your choice. If you use the Python client, then check out the elasticsearch-labs repo for various [example notebooks](https://github.com/elastic/elasticsearch-labs/tree/main/notebooks/search/python-examples).
* [File upload](https://www.elastic.co/guide/en/kibana/8.17/connect-to-elasticsearch.html#upload-data-kibana): Use the Kibana file uploader to index single files for one-off testing and exploration. The GUI guides you through setting up your index and field mappings.
* [Web crawler](https://github.com/elastic/crawler): Extract and index web page content into Elasticsearch documents.
* [Connectors](https://www.elastic.co/guide/en/elasticsearch/reference/current/es-connectors.html): Sync data from various third-party data sources to create searchable, read-only replicas in Elasticsearch.
#### Timestamped data
Timestamped data in Elasticsearch refers to datasets that include a timestamp field. If you use the [Elastic Common Schema \(ECS\)](https://www.elastic.co/guide/en/ecs/8.17/ecs-reference.html), this field is named **@timestamp**. This could be data like logs, metrics, and traces.
For timestamped data, you have the following options for adding data to Elasticsearch data streams:
* [Elastic Agent and Fleet](https://www.elastic.co/guide/en/fleet/8.17/fleet-overview.html): The preferred way to index timestamped data. Each Elastic Agent based integration includes default ingestion rules, dashboards, and visualizations to start analyzing your data right away. You can use the Fleet UI in Kibana to centrally manage Elastic Agents and their policies.
* [Beats](https://www.elastic.co/guide/en/beats/libbeat/8.17/beats-reference.html): If your data source isn’t supported by Elastic Agent, use Beats to collect and ship data to Elasticsearch. You install a separate Beat for each type of data to collect.
* [Logstash](https://www.elastic.co/guide/en/logstash/8.17/introduction.html): Logstash is an open source data collection engine with real-time pipelining capabilities that supports a wide variety of data sources. You might use this option because neither Elastic Agent nor Beats supports your data source. You can also use Logstash to persist incoming data, or if you need to send the data to multiple destinations.
* [Language clients](https://www.elastic.co/guide/en/cloud/current/ec-ingest-guides.html): The linked tutorials demonstrate how to use Elasticsearch programming language clients to ingest data from an application. In these examples, Elasticsearch is running on Elastic Cloud, but the same principles apply to any Elasticsearch deployment.

### Query
#### Query languages
Elasticsearch provides a number of query languages for interacting with your data.
* **Query DSL** is the primary query language for Elasticsearch today.
* **ES|QL** is a new piped query language and compute engine which was first added in version **8.11**.
ES|QL does not yet support all the features of Query DSL. Look forward to new ES|QL features and functionalities in each release.

#### Query DSL
[Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html) is a full-featured JSON-style query language that enables complex searching, filtering, and aggregations. It is the original and most powerful query language for Elasticsearch today.
The [_search endpoint](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-your-data.html) accepts queries written in Query DSL syntax.
Query DSL support a wide range of search techniques, including the following:
* **[Full-text search](https://www.elastic.co/guide/en/elasticsearch/reference/current/full-text-search.html)**: Search text that has been analyzed and indexed to support phrase or proximity queries, fuzzy matches, and more.
* **[Keyword search](https://www.elastic.co/guide/en/elasticsearch/reference/current/keyword.html)**: Search for exact matches using keyword fields.
* **[Semantic search](https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search-semantic-text.html)**: Search semantic_text fields using dense or sparse vector search on embeddings generated in your Elasticsearch cluster.
* **[Vector search](https://www.elastic.co/guide/en/elasticsearch/reference/current/knn-search.html)**: Search for similar dense vectors using the kNN algorithm for embeddings generated outside of Elasticsearch.
* **[Geospatial search](https://www.elastic.co/guide/en/elasticsearch/reference/current/geo-queries.html)**: Search for locations and calculate spatial relationships using geospatial queries.

Learn about the full range of queries supported by [Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html).
You can also filter data using Query DSL. Filters enable you to include or exclude documents by retrieving documents that match specific field-level criteria. A query that uses the filter parameter indicates [filter context](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-filter-context.html#filter-context).

#### Analyze with Query DSL
[Aggregations](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations.html) are the primary tool for analyzing Elasticsearch data using Query DSL. Aggregrations enable you to build complex summaries of your data and gain insight into key metrics, patterns, and trends.
Because aggregations leverage the same data structures used for search, they are also very fast. This enables you to analyze and visualize your data in real time. You can search documents, filter results, and perform analytics at the same time, on the same data, in a single request. That means aggregations are calculated in the context of the search query.
The folowing aggregation types are available:
* [Metric](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics.html): Calculate metrics, such as a sum or average, from field values.
* [Bucket](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket.html): Group documents into buckets based on field values, ranges, or other criteria.
* [Pipeline](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline.html): Run aggregations on the results of other aggregations.

⠀Run aggregations by specifying the [search API](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-search.html)'s aggs parameter. Learn more in [Run an aggregation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations.html#run-an-agg).

#### ES|QL
[Elasticsearch Query Language \(ES|QL\)](https://www.elastic.co/guide/en/elasticsearch/reference/current/esql.html) is a piped query language for filtering, transforming, and analyzing data. ES|QL is built on top of a new compute engine, where search, aggregation, and transformation functions are directly executed within Elasticsearch itself. ES|QL syntax can also be used within various Kibana tools.
The [_query endpoint](https://www.elastic.co/guide/en/elasticsearch/reference/current/esql-rest.html) accepts queries written in ES|QL syntax.
Today, it supports a subset of the features available in Query DSL, but it is rapidly evolving.
It comes with a comprehensive set of [functions and operators](https://www.elastic.co/guide/en/elasticsearch/reference/current/esql-functions-operators.html) for working with data and has robust integration with Kibana’s Discover, dashboards and visualizations.
Learn more in [Getting started with ES|QL](https://www.elastic.co/guide/en/elasticsearch/reference/current/esql-getting-started.html), or try [our training course](https://www.elastic.co/training/introduction-to-esql).

### Search

Full-text search is powered by [text analysis](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis.html). Text analysis normalizes and standardizes text data so it can be efficiently stored in an inverted index and searched in near real-time. Analysis happens at both [index and search time](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-index-search-time.html).
#### 响应例子 
```json
{
  "took": 0,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": { 
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1.8378843, 
    "hits": [
      {
        "_index": "cooking_blog",
        "_id": "1",
        "_score": 1.8378843, 
        "_source": {
          "title": "Perfect Pancakes: A Fluffy Breakfast Delight", 
          "description": "Learn the secrets to making the fluffiest pancakes, so amazing you won't believe your tastebuds. This recipe uses buttermilk and a special folding technique to create light, airy pancakes that are perfect for lazy Sunday mornings.", 
          "author": "Maria Rodriguez",
          "date": "2023-05-01",
          "category": "Breakfast",
          "tags": [
            "pancakes",
            "breakfast",
            "easy recipes"
          ],
          "rating": 4.8
        }
      }
    ]
  }
}
```
#### 请求例子
Specify the and operator to require both terms in the description field. 
```json
GET /cooking_blog/_search
{
  "query": {
    "match": {
      "description": {
        "query": "fluffy pancakes",
        "operator": "and"
      }
    }
  }
}
```
Use the [minimum_should_match](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-minimum-should-match.html) parameter to specify the minimum number of terms a document should have to be included in the search results.
```json
GET /cooking_blog/_search
{
  "query": {
    "match": {
      "title": {
        "query": "fluffy pancakes breakfast",
        "minimum_should_match": 2
      }
    }
  }
}
```
When users enter a search query, they often don’t know (or care) whether their search terms appear in a specific field. A [multi_match](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html) query allows searching across multiple fields simultaneously.
```json
GET /cooking_blog/_search
{
  "query": {
    "multi_match": {
      "query": "vegetarian curry",
      "fields": ["title", "description", "tags"]
    }
  }
}
```
in many cases, matches in certain fields (like the title) might be more relevant than others. We can adjust the importance of each field using field boosting
```json
GET /cooking_blog/_search
{
  "query": {
    "multi_match": {
      "query": "vegetarian curry",
      "fields": ["title^3", "description^2", "tags"] 
    }
  }
}
```
[Filtering](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-filter-context.html#filter-context) allows you to narrow down your search results based on exact criteria. Unlike full-text searches, filters are binary (yes/no) and do not affect the relevance score. Filters execute faster than queries because excluded results don’t need to be scored.
This [bool](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-bool-query.html) query will return only blog posts in the "Breakfast" category.
```json
GET /cooking_blog/_search
{
  "query": {
    "bool": {
      "filter": [
        { "term": { "category.keyword": "Breakfast" } }  
      ]
    }
  }
}
```
> | Note the use of category.keyword here. This refers to the ~[keyword](https://www.elastic.co/guide/en/elasticsearch/reference/current/keyword.html)~ multi-field of the category field, ensuring an exact, case-sensitive match. 

The .keyword suffix accesses the unanalyzed version of a field, enabling exact, case-sensitive matching. This works in two scenarios:
* **When using dynamic mapping for text fields**. Elasticsearch automatically creates a .keyword sub-field.
* **When text fields are explicitly mapped with a** **.keyword** **sub-field**. 

Often users want to find content published within a specific time frame. A [range](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-range-query.html) query finds documents that fall within numeric or date ranges.
```json
GET /cooking_blog/_search
{
  "query": {
    "range": {
      "date": {
        "gte": "2023-05-01", 
        "lte": "2023-05-31" 
      }
    }
  }
}
```

Sometimes users want to search for exact terms to eliminate ambiguity in their search results. A [term](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-term-query.html) query searches for an exact term in a field without analyzing it. Exact, case-sensitive matches on specific terms are often referred to as "keyword" searches.
```json
GET /cooking_blog/_search
{
  "query": {
    "term": {
      "author.keyword": "Maria Rodriguez" 
    }
  }
}
```

A [bool](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-bool-query.html) query allows you to combine multiple query clauses to create sophisticated searches. In this tutorial scenario it’s useful for when users have complex requirements for finding recipes.
Let’s create a query that addresses the following user needs:
* Must be a vegetarian recipe
* Should contain "curry" or "spicy" in the title or description
* Should be a main course
* Must not be a dessert
* Must have a rating of at least 4.5
* Should prefer recipes published in the last month
```json
GET /cooking_blog/_search
{
  "query": {
    "bool": {
      "must": [
        { "term": { "tags": "vegetarian" } },
        {
          "range": {
            "rating": {
              "gte": 4.5
            }
          }
        }
      ],
      "should": [
        {
          "term": {
            "category": "Main Course"
          }
        },
        {
          "multi_match": {
            "query": "curry spicy",
            "fields": [
              "title^2",
              "description"
            ]
          }
        },
        {
          "range": {
            "date": {
              "gte": "now-1M/d"
            }
          }
        }
      ],
      "must_not": [ 
        {
          "term": {
            "category.keyword": "Dessert"
          }
        }
      ]
    }
  }
}
```
## Index, Shard and Segment
ElasticSearch 中的 **Index**、**Shard** 和 **Segment** 是层级递进的数据组织单元，以下是它们的区别与联系：

---

### **Index（索引）**
- **定义**：  
  Index 是 ElasticSearch 中存储结构化数据的逻辑容器，类似于关系型数据库中的“表”。每个 Index 包含一组具有相似结构的文档（Document），并通过 Mapping 定义字段类型、分词规则等元信息。
- **核心功能**：  
  - 提供数据分类和逻辑隔离，例如 `products` 索引存储商品数据，`logs` 索引存储日志数据。
  - 包含配置参数（如分片数、副本数）和别名（Alias）。
- **特点**：  
  - 逻辑概念，不直接对应物理存储。
  - 支持动态扩容，但分片数（Shard）在创建后不可修改。

---

### **Shard（分片）**
- **定义**：  
  Shard 是 Index 的物理分片，用于分布式存储和并行处理数据。每个 Shard 本质上是一个独立的 Lucene 索引实例。
- **类型**：  
  - **主分片（Primary Shard）**：负责数据写入和存储，数量在 Index 创建时固定。
  - **副本分片（Replica Shard）**：主分片的拷贝，提供冗余和查询负载均衡。
- **核心功能**：  
  - 水平扩展存储容量和吞吐量。
  - 通过分片路由算法（如 `hash(routing) % shard_num`）确定文档存储位置。
- **特点**：  
  - 物理存储单元，分布在集群的不同节点上。
  - 每个 Shard 包含完整的倒排索引和数据文件。

---

### **Segment（段）**
- **定义**：  
  Segment 是 Lucene 中的最小存储单元，每个 Shard 由多个 Segment 组成。Segment 是倒排索引的实际载体，存储文档的词典（Term Dictionary）、倒排列表（Postings List）等数据。
- **核心功能**：  
  - 支持近实时搜索：新写入的文档先写入内存缓冲区（Index Buffer），定期通过 **Refresh** 操作生成新 Segment（默认 1 秒）。
  - 通过 **Merge** 操作合并小 Segment 为更大文件，减少碎片并提升查询效率。
- **特点**：  
  - 不可变性：写入磁盘后不可修改，删除操作通过 `.del` 文件标记。
  - 文件结构：包含 `.fdt`（文档内容）、`.tip`（Term 索引）、`.doc`（倒排列表）等文件。

---

### **三者的联系**
1. **层级关系**：  
   - 一个 **Index** 被划分为多个 **Shard**（物理分片），每个 Shard 对应一个 Lucene 索引。
   - 每个 **Shard** 由多个 **Segment** 组成，Segment 是 Lucene 的底层倒排索引文件。
   
2. **数据流程**：  
   - 文档写入时，先路由到对应 Shard，存入内存缓冲区（Index Buffer），随后通过 Refresh 生成新 Segment。
   - 查询时，请求被分发到所有相关 Shard，每个 Shard 检索其所有 Segment 并汇总结果。

3. **性能影响**：  
   - **Shard 数量**：过多会导致集群管理开销大（如元数据同步），过少则限制扩展性（建议单个 Shard 容量 20-50GB）。
   - **Segment 数量**：过多会降低查询速度（需遍历多个文件），定期 Merge 可优化性能。

---

### **总结**
- **Index** 是逻辑容器，**Shard** 是物理分片，**Segment** 是底层存储结构。  
- Shard 通过分片机制实现分布式存储，Segment 通过倒排索引和合并优化查询效率。  
- 合理规划 Shard 数量和 Segment 合并策略是性能调优的关键。

## acknowledged 和 shards_acknowledged
在 Elasticsearch 的索引操作响应中，`acknowledged` 和 `shards_acknowledged` 分别表示以下含义：

---

### **`acknowledged`**
- **含义**：表示索引的元数据变更（如创建、删除或更新）**已被集群的主节点（Master Node）确认并执行**。  
- **适用场景**：所有涉及索引元数据修改的操作（例如新建索引、修改分片配置等）都会返回此字段。
- **返回值说明**：  
  - `true`：操作成功提交到集群，且主节点已完成元数据更新。  
  - `false`：操作未完成（通常由网络问题或主节点不可用导致）。

**示例场景**：  
创建索引 `my-explicit-mappings-books` 时，若 `acknowledged` 为 `true`，说明该索引已在集群中注册，但此时分片（Shard）可能尚未完全分配。

---

### **`shards_acknowledged`**
- **含义**：表示索引的**所有主分片（Primary Shard）已成功启动并分配**到集群的节点上。  
- **适用场景**：仅在新建索引或调整分片参数（如 `number_of_shards`）时出现。  
- **返回值说明**：  
  - `true`：所有主分片已分配并准备好接收数据。  
  - `false`：分片分配延迟或失败（可能因节点资源不足或配置错误）。

**示例场景**：  
若 `shards_acknowledged` 为 `true`，说明索引 `my-explicit-mappings-books` 的主分片已分配到可用节点，后续可正常写入数据。

---

### **两者的区别与联系**
| 字段                 | 作用层级       | 触发条件                 | 关键依赖因素               |  
|----------------------|---------------|--------------------------|---------------------------|  
| `acknowledged`       | 元数据层面     | 所有索引元数据操作       | 主节点的协调能力          |  
| `shards_acknowledged`| 分片物理分配   | 仅索引创建或分片配置变更  | 节点资源、分片分配策略     |  

- **联系**：`shards_acknowledged` 的成功需以 `acknowledged` 为前提。例如，新建索引时，主节点先确认元数据（`acknowledged: true`），再分配分片（`shards_acknowledged: true`）。  
- **例外情况**：若集群繁忙，可能出现 `acknowledged: true` 但 `shards_acknowledged: false`，需通过 `GET _cluster/health` 检查分片状态。

---

### **总结**
- `acknowledged` 表示“集群接受了操作请求”，而 `shards_acknowledged` 表示“分片已物理就绪”。  
- 在索引创建场景中，若两者均为 `true`，说明索引已完全可用；若仅 `acknowledged` 为 `true`，需进一步排查分片分配问题。

: 搜索结果中提供的索引操作示例和说明，包括创建、删除和查看索引的响应字段解释。

## Keyword type family

在 Elasticsearch 中，**Keyword 类型家族**专为结构化数据的精确匹配和高效处理设计，适用于需要原样存储、无需分词的场景。以下是其核心成员及特性：

---

#### **`keyword` 类型**
- **核心特性**：  
  - **不分词**：字段值原样存储，例如 "Elasticsearch" 不会被拆分为 "elastic" 或 "search"。  
  - **精确匹配**：支持 `term` 查询（精确值匹配）、排序（如字典序）和聚合（如统计唯一值）。  
  - **适用场景**：  
    - **结构化标识符**：如 ID、邮箱、状态码、标签等。  
    - **短文本处理**：通过 `ignore_above` 参数限制索引长度（默认 256 字符），避免长文本浪费资源。  
  - **示例**：  
    ```json
    "tags": { 
      "type": "keyword",
      "ignore_above": 100 
    }
    ```

---

#### **`constant_keyword` 类型（9+ 版本引入）**
- **核心特性**：  
  - **固定值约束**：字段值全局固定，所有文档的该字段必须为同一值（或缺失）。例如日志索引中固定环境标识 `env: "prod"`。  
  - **优化存储**：仅存储一次值，减少重复数据占用空间。  
  - **适用场景**：  
    - 过滤特定索引数据（如按业务类型、环境分类）。  

---

#### **`wildcard` 类型（10+ 版本引入）**
- **核心特性**：  
  - **非结构化文本优化**：针对高基数或大值字段（如日志消息、URL路径）设计，支持 `wildcard`（通配符）和 `regexp`（正则）查询。  
  - **存储压缩**：采用前缀编码（如 "abcdef" → "abc*"），提升模糊查询性能。  
  - **适用场景**：  
    - 日志分析中的模糊匹配（类似 `grep` 操作）。  
  - **示例**：  
    ```json
    "error_message": { 
      "type": "wildcard" 
    }
    ```

---

#### **Keyword 家族与 Text 类型的对比**
| **特性**       | **Keyword 家族**                     | **Text 类型**                     |  
|-----------------|--------------------------------------|-----------------------------------|  
| **分词处理**    | 不分析，原样存储                     | 通过分词器拆分为词项              |  
| **查询场景**    | 精确匹配（`term`）、排序、聚合        | 全文搜索（`match`）               |  
| **存储优化**    | 短文本压缩，长文本截断（`ignore_above`） | 支持倒排索引，存储分词后的词项    |  
| **适用字段**    | 结构化标识符、枚举值                 | 长文本内容（如描述、评论）        |  

---

#### **最佳实践与注意事项**
1. **避免全文搜索**：  
   - 不要对 `keyword` 字段使用 `match` 查询（需改用 `term`）。  
2. **多字段映射**：  
   - 若需同时支持精确匹配和全文搜索，可使用 **Multi-fields**，如将字段同时映射为 `text` 和 `keyword`：  
     ```json
     "name": {
       "type": "text",
       "fields": {
         "keyword": { "type": "keyword" }
       }
     }
     ```
3. **性能优化**：  
   - 高频聚合字段可开启 `eager_global_ordinals` 加速聚合计算。  
   - 冷数据存储使用 `doc_values: false` 减少磁盘占用（但会禁用排序/聚合）。

---

### 总结
**Keyword 类型家族**是处理结构化数据的利器，尤其适合精确匹配、排序和聚合场景。合理选择 `keyword`、`constant_keyword` 或 `wildcard`，结合多字段映射和参数优化，能显著提升 Elasticsearch 的查询效率与存储性能。

## 分词透明性
在 Elasticsearch 中，**索引（Index）中的文档（Document）被分成的 Token 对用户是透明的**，但用户可以通过特定接口或工具间接感知其存在。以下是具体分析：

---

### **分词过程的透明性**
- **底层自动分词**：  
  当文档存入索引时，Elasticsearch 会通过 **分词器（Analyzer）** 自动将文本拆分为 Token（如将 "Brave New World" 拆分为 ["brave", "new", "world"]），并建立倒排索引。这一过程无需用户手动干预，用户只需关注原始文本的写入和查询逻辑。  
  - 例如，用户写入 `"name": "Brave New World"`，无需指定如何分词，系统会根据映射（Mapping）中定义的分词规则自动处理。

- **查询时的透明性**：  
  用户执行搜索时，输入的查询词也会被分词（如搜索 "new world" 会被拆分为 ["new", "world"]），系统自动匹配倒排索引中的 Token。用户无需了解分词细节，只需关注搜索结果是否符合预期。

---

### **用户感知 Token 的途径**
虽然分词过程透明，但用户仍可通过以下方式间接感知或干预 Token：
1. **映射定义（Mapping）**：  
   用户可通过定义字段的 `analyzer`（如 `standard`、`ik_max_word`）或 `keyword` 类型，显式控制分词规则。例如，指定 `"type": "keyword"` 可禁用分词。
2. **测试分词效果**：  
   使用 Elasticsearch 的 `_analyze` API 可查看文本分词后的 Token 列表。例如：
   ```json
   POST _analyze
   {
     "analyzer": "standard",
     "text": "Brave New World"
   }
   ```
   响应会显示 Token 结果：`["brave", "new", "world"]`。
3. **查询高亮与相关性评分**：  
   搜索结果中的高亮片段（Highlighting）和相关性评分（`_score`）会反映分词后的匹配情况。例如，若搜索 "new"，高亮会标记 "New"，说明 Token 匹配成功。

---

### **透明性的设计意义**
- **简化使用**：  
  用户无需关注底层分词细节（如 Token 如何存储、倒排索引如何构建），只需通过自然语言交互即可完成搜索，降低使用门槛。
- **性能优化**：  
  分词和索引过程由 Elasticsearch 自动完成，系统会根据分片（Shard）和副本（Replica）机制分布式处理数据，用户无需手动管理存储和计算资源。

---

### **总结**
- **默认透明**：文档分词的 Token 存储和匹配对用户透明，用户只需关注数据写入和查询逻辑。  
- **可控性**：通过映射和 API 可显式干预分词规则，满足定制化需求。  
- **设计优势**：透明性简化了操作流程，同时分布式架构保障了性能和高可用性。

如需进一步验证分词结果，建议使用 `_analyze` API 或 Kibana 的 Dev Tools 进行测试。