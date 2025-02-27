---
title: 【Spring Boot in practice】Notes
date: 2024-07-02 00:00:00+0000
categories: 
    - millet
    - willow
tags:
    - Spring Boot
math: true
---
[Link](https://reader-service.fcdn.sk/?source=3c6b6838ceb712e38b66a0ca2cde230f44274dac2f09fba71ffdc61842816357&download_location=https%3A%2F%2Fsinglelogin.re%2Fdl%2F21754907%2F994075)

## Spring boot
Spring Boot is an open source extension of the Spring Framework designed to simplify the Spring application development.

Spring Boot was introduced as a subproject under the Spring Framework to empower developers with a fast startup experience and exempt them from most of the configuration hazards.

It provides an additional layer between the Spring Framework for the user to simplify certain configuration aspects.

A Spring Boot web application can be either Servlet-based or reactive type.

### Components
* spring-boot

  This is the **primary** Spring Boot component that provides support to other components. For example, it contains the **SpringApplication class**, which contains several static methods to create a standalone Spring Boot application. It also provides support for embedded web servers (e.g., Tomcat) and supports externalized application configurations (e.g., database details of your application), etc. 
* spring-boot-autoconfigure
* Spring-boot-starters
* spring-boot-actuator

  In the context of software, particularly within the Spring Boot framework, “Actuator” refers to a set of tools and features that provide insights into the application’s runtime behavior and health.
* spring-boot-actuator-autoconfigure 
* spring-boot-loader 

  This component allows a Spring Boot application to be packaged as a single fat JAR file, including all dependencies and the embedded web servers that can be run standalone. You don’t use this module independently; instead, it is used along with Maven or Gradle plugins
* spring-boot-devtools

### Lombok

[Lombok](https://projectlombok.org/) is a Java library that automatically generates the constructors, getter, setter, toString, and others based on the presence of a few annotations in the plain old Java object (POJO) class. 

### POJO
A Plain Old Java Object (POJO) is a simple Java object that does not adhere to any special rules or conventions beyond those required by the Java Language Specification. The term is used to emphasize that these objects are free from the constraints typically imposed by more complex frameworks or libraries.

### Record 
Java 14 has introduced the concept of records in the Java language. Records are immutable data classes that require you to specify only the type and name of the fields. The Java compiler can then generate the equals, hashCode, and toString methods. It also generates the private final fields, getter methods, and public constructor. 

### pom.xml file
The pom.xml file is a fundamental component of a Maven-based Java project. Maven is a build automation tool used primarily for Java projects, and pom.xml (Project Object Model) is the configuration file that defines the project’s dependencies, build configuration, and other project-specific settings.

### application.properties file
The application.properties file is a key configuration file used in Spring Boot applications. It allows developers to define various settings and configurations for the application in a simple and readable format. 

### WAR vs EAR
In general, to run a web application, you build and package the application components in a WAR or EAR archive file and deploy it into a web (e.g., Apache Tomcat) or application server (e.g., Red Hat JBoss). Spring Boot simplifies this process to a certain degree. It does not enforce you to build a WAR or EAR file of your application. Instead, it lets you run the Spring Boot application like a regular Java application using a conventional main() method.

### Java Bean
A JavaBean is a reusable software component that follows **specific conventions** defined by the JavaBeans specification. JavaBeans are used for **encapsulating many objects into a single object** (the bean), so they can be passed around as a single bean object. 

**1 Default Constructor:**

 A JavaBean must have a no-argument (default) constructor. This allows the bean to be easily instantiated.

**2** **Properties:**

Properties are private fields that are accessed and modified through public getter and setter methods.

**3** **Serializable:**

A JavaBean should implement the Serializable interface to allow its state to be saved and restored.

**4** **Accessor Methods:**

Getter and setter methods follow a specific naming convention (getPropertyName for getters and setPropertyName for setters).
The “Bean” part of the term is a metaphor borrowed from the agricultural sense of the word, implying something small, lightweight, and reusable.

### @SpringBootApplication
@SpringBootApplication annotation is a convenient annotation that consists of three annotations: 

* @EnableAutoConfiguration

  provides the necessary support for Spring Boot to autoconfigure your application based on the JAR dependencies present in the application 
  classpath

* @ComponentScan

  Provides support to scan the packages for Spring components in the application. 
  
### Spring Component
  **A component in Spring is a Java bean that is managed by Spring** and annotated with the **@Component, @Bean, or specialized component annotations**. With the presence of @ComponentScan annotation, the Spring Boot application scans for all components present in the **root package and sub-packages** under it to manage their lifecycle. The key point to remember with ComponentScan is that the scan starts from a root package and continues to all child packages. Thus, if you have packages that are not in the root or its sub-package, none of those components will be scanned by the component scan.
* @SpringBootConfiguration
  This annotation indicates that **the annotated class provides the Spring Boot application configuration**. It is meta-annotated with Spring @Configuration annotation so that the configurations in the annotated class can be found automatically by Spring Boot. Thus, the beans defined in this main class can be autodetected and loaded by Spring. 

### run() method
Most of the time, you’ll use the static run() method of SpringApplication to bootstrap and launch your application. Spring Boot performs several activities while it executes the run() method:

**1** **Creates an instance of an** **ApplicationContext** based on the libraries present in the classpath.

**2** **Registers a** **CommandLinePropertySource** to expose command line arguments as Spring properties.

**3** **Refreshes the** **ApplicationContext** created at step 1 to load all singleton beans.

**4** **Triggers the** **ApplicationRunners** **and** **CommandRunners** configured in the application.

Most Java applications you develop consist of objects. These objects interact with each other, and there are dependencies among them. To effectively manage object creation and interdependencies, Spring uses the principles of **dependency injection (DI)**.
This dependency injection or the **inversion of control (IoC)** approach lets Spring create the objects (or, more appropriately, the **beans** in Spring parlance) and inject the dependencies externally.
The bean definitions are presented to Spring either through the **XML bean definition files** (e.g., applicationContext.xml) or through the annotation-based configurations (@Configuration annotation). Spring loads these bean definitions and keeps them available in the **Spring IoC container**. The ApplicationContext interface acts as the **Spring IoC Container**. Spring provides a plethora of ApplicationContext implementations based on the application type (Servlet or Reactive application), the bean definition configurations (e.g., to load from classpath or annotation), and so on.

Although @EventListener works well in most circumstances, it does not work for events that are published very early in the application start-up, such as ApplicationStartingEvent and ApplicationEnvironmentPreparedEvent.

By default, Spring Boot reads the application.properties or application.yml file from the following locations: 

1 The classpath root

2 The classpath /config package

3 The current directory

4 The /config subdirectory in the current directory

5 Immediate child directories of the /config subdirectory


You can maintain the profile-specific property files with the application-{profile}.properties (or .yml) file.
You can activate a profile (e.g., dev or test) using the spring.profiles.active Spring Boot property.

1 The application properties (properties or the YAML file) packaged inside the application JAR
2 Profile-specific application properties packaged inside the application JAR
3 The application properties (properties or the YAML file) packaged outside the application JAR
4 Profile-specific application properties packaged outside the application JAR

Following is the order in which properties get precedence. The higher sequence number overrides the properties of the lower sequence number:
1 SpringApplication
2 @PropertySource
3 Config data file
4 OS environment variable
5 Command line arguments

Both @Bean and @Component annotations let you **instruct Spring to create instances** of the annotated class, but their usage is slightly different. You typically use the @Bean annotation for the classes for which **you don’t have access to the source code**. Thus, you define a bean and return a new instance of the class. For the @Component annotation, as you have access to the source Java file, you can simply annotate the class with this annotation.Both @Bean and @Component annotations let you instruct Spring to create instances of the annotated class, but their usage is slightly different. You typically use the @Bean annotation for the classes for which you don’t have access to the source code. Thus, you define a bean and return a new instance of the class. For the @Component annotation, as you have access to the source Java file, you can simply annotate the class with this annotation.

The CommandLineRunner is a useful feature that is frequently used to perform several application initialization activities. In a CommandLineRunner implementation, you also have access to the command line arguments through the args parameter.

Bean Validation, part of the Java EE (Enterprise Edition) specification, is a framework that provides a standard way to enforce constraints on the properties of JavaBeans. These constraints ensure that the data within beans meets certain criteria before it is processed or persisted. 

Java annotations are a powerful feature introduced in **Java 5** that provide a way to add **metadata** to Java code. They can be applied to various elements of the code, including classes, methods, fields, parameters, and more. Annotations **do not change** the action of the compiled program but can be used by the compiler and runtime tools to **generate code, analyze code, and perform other tasks**.

## Spring Data

[Spring Data](https://spring.io/projects/spring-data) lets you access data from a variety of data sources (e.g., relational and nonrelational databases, MapReduce databases, and cloud-based data services). It attempts to provide a uniform, easy-to-use, and familiar programming model through the Spring Framework.

It is an umbrella project under the Spring Framework that contains several sub-projects, each of which targets a specific database. For instance, the **Spring Data JPA module is specific to relational databases** (e.g., H2, MySQL, PostgreSQL). Similarly, Spring Data MongoDB aims to provide support for the MongoDB database.

Java Database Connectivity (JDBC) is a **standard API** provided by Java that allows Java applications to interact with relational databases in a vendor-independent manner. JDBC provides a set of interfaces and classes that enable developers to connect to a database, execute SQL queries, and retrieve results. It serves as a bridge between Java applications and various database management systems (DBMS).

Java Persistence API (JPA) is **a specification for object-relational mapping** (ORM) in Java, which allows developers to manage relational data in Java applications using an object-oriented paradigm. JPA provides a standard way to map Java objects to database tables and to manage persistent data in applications.

* **JDBC:**
  * JDBC is a **low-level** API for interacting with relational databases. It provides a set of interfaces and classes for connecting to a database, executing SQL queries, and retrieving results. JDBC is database-centric and requires developers to write SQL queries and manage the mapping between Java objects and database tables **manually**.
* **JPA:**
  * JPA is a **high-level** API for object-relational mapping (ORM). It abstracts the database interactions and **allows developers to work with Java objects instead of SQL queries**. JPA automatically maps Java objects to database tables and handles CRUD (Create, Read, Update, Delete) operations, making it easier to manage persistent data in an object-oriented way.
JPA itself is not an implementation but a set of guidelines implemented by various ORM frameworks like **Hibernate**, EclipseLink, and **Spring Data JPA**.
Hibernate is the default JPA provider in Spring Data JPA.

MyBatis is a persistence framework that offers SQL mapping. It emphasizes direct SQL use, providing a higher degree of control over SQL queries and their execution. Unlike traditional ORM frameworks, **MyBatis does not map Java objects to database tables but rather maps SQL statements to Java methods**.

One of the core themes of Spring Data is to provide a **consistent** programming model 
to access various data sources. 

Spring Data provides a **repository abstraction layer** across the supported databases as a common programming model. The abstraction is contained in the Spring Data Commons module, and it provides several useful interfaces that let you perform the standard create, read, update, and delete (CRUD) operations as well as executing queries. This abstraction layer is the topmost layer and acts as the foundation for other Spring Data modules.

![](image%202.png)

As part of the database configuration, Spring Boot automatically configures the [HikariCP](https://github.com/brettwooldridge/HikariCP) database connection pool. A database connection pool contains one or more database connections that are generally created at the time of application startup and available for use by the application.
The benefit of a database connection pool is that a set of database connections are created at the application startup and available for use by the application. Thus, you don’t create a new connection each time you need a database connection and close it once done. The application can take a connection from the pool, use it, and return to the pool. Spring Boot uses HikariCP as the default database connection pool library.
![](image%203.png)

Spring Boot can load the SQL scripts from the classpath (e.g., the src/main/resources folder) or a preconfigured location. By default, you define the schema.sql file to provide all DDL scripts and define the data.sql file to include the DML scripts and place them inside the src/main/resources folder for Spring Boot to detect and execute these files.
To begin with, if you are using a database other than an embedded (in-memory) database, you need to set spring.sql.init.mode to always in the application.properties file.
In this schema initialization-based approach, Spring Boot re-creates the schema each time you restart the application. There is no database schema versioning done by Spring Boot.

In this schema initialization-based approach, Spring Boot re-creates the schema each time you restart the application. There is no database schema versioning done by Spring Boot.
In addition to the schema.sql and data.sql files, Spring Boot also supports database-specific SQLs. For instance, if your application supports multiple database types, and there are SQL syntax differences, you can use schema-${platform}.sql and data-${platform}.sql files.

Spring Data uses this marker interface Repository as the primary abstraction for a data source.
![](image%204.png)
In addition to the CrudRepository, Spring Data also provides a PagingAndSortingRepository, which extends the CrudRepository and provides additional support for pagination and sorting of the entities.

@Entity marks a java class as a jpa entity
@Table provides the database table details
@Column provides mapping information between the Java fields and the associated column name in the table.
@Repository marks  a class as a spring repository 

## Spring Security 
The following part comes from spring security official website
Spring Security provides comprehensive support for [authentication](https://en.wikipedia.org/wiki/Authentication). Authentication is how we **verify the identity** of who is trying to access a particular resource.

Spring Security’s PasswordEncoder interface is used to perform a one-way transformation of a password to let the password be stored securely.

To mitigate the effectiveness of Rainbow Tables, developers were encouraged to use salted passwords.

Adaptive one-way functions:
Can be adjusted to require more computational resources as hardware improves
Examples of adaptive one-way functions that should be used include [bcrypt](https://docs.spring.io/spring-security/reference/features/authentication/password-storage.html#authentication-password-storage-bcrypt), [PBKDF2](https://docs.spring.io/spring-security/reference/features/authentication/password-storage.html#authentication-password-storage-pbkdf2), [scrypt](https://docs.spring.io/spring-security/reference/features/authentication/password-storage.html#authentication-password-storage-scrypt), and [argon2](https://docs.spring.io/spring-security/reference/features/authentication/password-storage.html#authentication-password-storage-argon2).

```java
PasswordEncoder passwordEncoder =
    PasswordEncoderFactories.createDelegatingPasswordEncoder();
```

DelegatingPasswordEncoder Storage Format
```text
{id}encodedPassword
e.g. 
{bcrypt}$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG
```

```java
UserDetails user = User.withDefaultPasswordEncoder()
  .username("user")
  .password("password")
  .roles("user")
  .build();
System.out.println(user.getPassword());
// {bcrypt}$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG
```

Spring Security provides comprehensive support for [authorization](https://en.wikipedia.org/wiki/Authorization). Authorization is **determining who is allowed** to access a particular resource. Spring Security provides [defense in depth](https://en.wikipedia.org/wiki/Defense_in_depth_%28computing%29) by allowing for request based authorization and method based authorization.

Prevent CSRF (cross site request forgery)
* Synchronizer token request
* Samesite attribute
Spring Security does not directly control the creation of the session cookie, so it does not provide support for the SameSite attribute. [Spring Session](https://spring.io/projects/spring-session) provides support for the SameSite attribute in servlet-based applications. 
**Safe Methods Must be Read-only**
For [either protection](https://docs.spring.io/spring-security/reference/features/exploits/csrf.html#csrf-protection) against CSRF to work, the application must ensure that ["safe" HTTP methods are read-only](https://tools.ietf.org/html/rfc7231#section-4.2.1). This means that requests with the HTTP GET, HEAD, OPTIONS, and TRACE methods should not change the state of the application.

Default Security Headers
```http
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000 ; includeSubDomains(https only)
X-Frame-Options: DENY
X-XSS-Protection: 0
```

Spring Security provides **Spring Data integration** that allows referring to the current user within your queries. It is not only useful but necessary to include the user in the queries to support paged results since filtering the results afterwards would not scale.

In most environments, Security is stored on a per Thread basis. This means that when work is done on a new Thread, the SecurityContext is lost. Spring Security provides some infrastructure to help make this much easier for users. Spring Security provides low level abstractions for working with Spring Security in multi-threaded environments. 

The default arrangement of Spring Boot and Spring Security affords the following behaviors at runtime:
* Requires an authenticated user [for any endpoint](https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html) (including Boot’s /error endpoint)
* [Registers a default user](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/user-details-service.html) with a generated password at startup (the password is logged to the console; in the preceding example, the password is 8e557245-73e2-4286-969a-ff57fe326336)
* Protects [password storage with BCrypt](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/password-encoder.html) as well as others
* Provides form-based [login](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/form.html) and [logout](https://docs.spring.io/spring-security/reference/servlet/authentication/logout.html) flows
* Authenticates [form-based login](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/form.html) as well as [HTTP Basic](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/basic.html)
* Provides content negotiation; for web requests, redirects to the login page; for service requests, returns a 401 Unauthorized
* [Mitigates CSRF](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html) attacks
* [Mitigates Session Fixation](https://docs.spring.io/spring-security/reference/servlet/authentication/session-management.html#ns-session-fixation) attacks
* Writes [Strict-Transport-Security](https://docs.spring.io/spring-security/reference/servlet/exploits/headers.html#servlet-headers-hsts) to [ensure HTTPS](https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security)
* Writes [X-Content-Type-Options](https://docs.spring.io/spring-security/reference/servlet/exploits/headers.html#servlet-headers-content-type-options) to mitigate [sniffing attacks](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html#x-content-type-options)
* Writes [Cache Control headers](https://docs.spring.io/spring-security/reference/servlet/exploits/headers.html#servlet-headers-cache-control) that protect authenticated resources
* Writes [X-Frame-Options](https://docs.spring.io/spring-security/reference/servlet/exploits/headers.html#servlet-headers-frame-options) to mitigate [Clickjacking](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html#x-frame-options)
* Integrates with [HttpServletRequest's authentication methods](https://docs.spring.io/spring-security/reference/servlet/integrations/servlet-api.html)
* Publishes [authentication success and failure events](https://docs.spring.io/spring-security/reference/servlet/authentication/events.html)

**FilterChain**
Spring Security’s Servlet support is based on **Servlet Filters**. The following image shows the typical layering of the handlers for a single HTTP request.
![](filterchain.png)
The client sends a request to the application, and the container creates a FilterChain, which contains the Filter **instances** and Servlet that should process the HttpServletRequest, based on the path of the request URI. In a Spring MVC application, the Servlet is an instance of [DispatcherServlet](https://docs.spring.io/spring-framework/docs/6.1.9/reference/html/web.html#mvc-servlet). 
At most, one Servlet can handle a single HttpServletRequest and HttpServletResponse. 
more than one Filter can be used to:
* Prevent downstream Filter instances or the Servlet from being invoked. In this case, the Filter typically writes the HttpServletResponse.
* Modify the HttpServletRequest or HttpServletResponse used by the downstream Filter instances and the Servlet.

```java
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) {
	// do something before the rest of the application
    chain.doFilter(request, response); // invoke the rest of the application
    // do something after the rest of the application
}
```


**DelegatingFilterProxy**
Spring provides a **Filter implementation** named [DelegatingFilterProxy](https://docs.spring.io/spring-framework/docs/6.1.9/javadoc-api/org/springframework/web/filter/DelegatingFilterProxy.html) that allows **bridging** between the Servlet container’s lifecycle and Spring’s ApplicationContext. The Servlet container allows registering Filter instances by using its own standards, but it is not aware of Spring-defined Beans. You can register DelegatingFilterProxy through the standard Servlet container mechanisms but delegate all the work to a Spring Bean that implements Filter.

Here is a picture of how DelegatingFilterProxy fits into the [Filter instances and the FilterChain](https://docs.spring.io/spring-security/reference/servlet/architecture.html#servlet-filters-review).

![](image%205.png)
DelegatingFilterProxy looks up *Bean Filter 0* from the ApplicationContext and then invokes *Bean Filter0*. 

**FilterChainProxy**
[SecurityFilterChain](https://docs.spring.io/spring-security/site/docs/6.3.1/api/org/springframework/security/web/SecurityFilterChain.html) is used by [FilterChainProxy](https://docs.spring.io/spring-security/reference/servlet/architecture.html#servlet-filterchainproxy) to determine which Spring Security Filter instances should be invoked for the current request.
![](image%206.png)
The [Security Filters](https://docs.spring.io/spring-security/reference/servlet/architecture.html#servlet-security-filters) in SecurityFilterChain are typically **Beans**, but they are registered with FilterChainProxy instead of [DelegatingFilterProxy](https://docs.spring.io/spring-security/reference/servlet/architecture.html#servlet-delegatingfilterproxy). FilterChainProxy provides a number of advantages to registering directly with the Servlet container or [DelegatingFilterProxy](https://docs.spring.io/spring-security/reference/servlet/architecture.html#servlet-delegatingfilterproxy). First, it provides a starting point for all of Spring Security’s Servlet support. For that reason

FilterChainProxy is **central** to Spring Security usage, it can perform tasks that are not viewed as optional. For example, it clears out the SecurityContext to avoid memory leaks. It also applies Spring Security’s [HttpFirewall](https://docs.spring.io/spring-security/reference/servlet/exploits/firewall.html#servlet-httpfirewall) to protect applications against certain types of attacks.
In addition, it provides more flexibility in determining when a SecurityFilterChain should be invoked. In a Servlet container, Filter instances are invoked based upon the URL alone. However, **FilterChainProxy can determine invocation based upon anything in the HttpServletRequest** by using the RequestMatcher interface.
![](image%207.png)
**Security Filters**
Most of the time, the default security filters are enough to provide security to your application. However, there might be times that you want to add a custom Filter to the security filter chain.

```java
public class TenantFilter implements Filter {

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        String tenantId = request.getHeader("X-Tenant-Id"); 
        boolean hasAccess = isUserAllowed(tenantId); 
        if (hasAccess) {
            filterChain.doFilter(request, response); 
            return;
        }
        throw new AccessDeniedException("Access denied"); 
    }

}

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(Customizer.withDefaults())
            .authorizeHttpRequests(authorize -> authorize
                .anyRequest().authenticated()
            )
            .httpBasic(Customizer.withDefaults())
            .formLogin(Customizer.withDefaults());
			.addFilterBefore(new TenantFilter(), AuthorizationFilter.class); 
        return http.build();
    }

}
```

Be careful when you declare your filter as a Spring bean, either by annotating it with @Component or by declaring it as a bean in your configuration, because Spring Boot will automatically [register it with the embedded container](https://docs.spring.io/spring-boot/docs/3.1.1/reference/html/web.html#web.servlet.embedded-container.servlets-filters-listeners.beans). That may cause the filter to be invoked twice, once by the container and once by Spring Security and in a different order.
**Exception Handing**
ExceptionTranslationFilter is inserted into the [FilterChainProxy](https://docs.spring.io/spring-security/reference/servlet/architecture.html#servlet-filterchainproxy) as one of the [Security Filters](https://docs.spring.io/spring-security/reference/servlet/architecture.html#servlet-security-filters).
The [ExceptionTranslationFilter](https://docs.spring.io/spring-security/site/docs/6.3.1/api/org/springframework/security/web/access/ExceptionTranslationFilter.html) allows translation of [AccessDeniedException](https://docs.spring.io/spring-security/site/docs/6.3.1/api/org/springframework/security/access/AccessDeniedException.html) and [AuthenticationException](https://docs.spring.io/spring-security/site/docs/6.3.1/api//org/springframework/security/core/AuthenticationException.html) into HTTP responses.
![](image%208.png)
* If the user is **not authenticated** or it is an AuthenticationException, then *Start Authentication*.
  * The [SecurityContextHolder](https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html#servlet-authentication-securitycontextholder) is cleared out.
  * The HttpServletRequest is [saved](https://docs.spring.io/spring-security/reference/servlet/architecture.html#savedrequests) so that it can be used to replay the original request once authentication is successful.
  * The AuthenticationEntryPoint is used to request credentials from the client. For example, it might redirect to a log in page or send a WWW-Authenticate header.
* If it is an AccessDeniedException, then *Access Denied*. The AccessDeniedHandler is invoked to handle access denied.

> If the application does not throw an AccessDeniedException or an AuthenticationException, then ExceptionTranslationFilter does not do anything.

### Authentication
At the heart of Spring Security’s **authentication model** is the SecurityContextHolder. It contains the [SecurityContext](https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html#servlet-authentication-securitycontext).
![](securitycontextholder.png)
The SecurityContextHolder is where Spring Security stores the details of who is [authenticated](https://docs.spring.io/spring-security/reference/features/authentication/index.html#authentication). Spring Security does not care how the SecurityContextHolder is populated. If it contains a value, it is used as the currently authenticated user.

Get currently authenticated user
```java
SecurityContext context = SecurityContextHolder.getContext();
Authentication authentication = context.getAuthentication();
String username = authentication.getName();
Object principal = authentication.getPrincipal();
Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
```

By default, SecurityContextHolder uses a ThreadLocal to store these details, which means that **the SecurityContext is always available to methods in the same thread**, even if the SecurityContext is not explicitly passed around as an argument to those methods.  Using a ThreadLocal in this way is quite safe if you take care to clear the thread after the present principal’s request is processed. Spring Security’s [FilterChainProxy](https://docs.spring.io/spring-security/reference/servlet/architecture.html#servlet-filterchainproxy) ensures that the SecurityContext is always cleared.
 **Authentication**
⠀The Authentication contains:
* **principal**: Identifies the user. When authenticating with a username/password this is often an instance of [UserDetails](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/user-details.html#servlet-authentication-userdetails).
* **credentials**: Often a password. In many cases, this is cleared after the user is authenticated, to ensure that it is not leaked.
* **authorities**: The [GrantedAuthority](https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html#servlet-authentication-granted-authority) instances are high-level permissions the user is granted. Two examples are roles and scopes.


[AuthenticationManager](https://docs.spring.io/spring-security/site/docs/6.3.1/api/org/springframework/security/authentication/AuthenticationManager.html) is the API that defines **how Spring Security’s Filters perform [authentication](**https://docs.spring.io/spring-security/reference/features/authentication/index.html#authentication)**. The [Authentication](https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html#servlet-authentication-authentication) that is returned is then set on the [SecurityContextHolder](https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html#servlet-authentication-securitycontextholder) by the controller (that is, by [Spring Security’s Filters instances](https://docs.spring.io/spring-security/reference/servlet/architecture.html#servlet-security-filters)) that invoked the AuthenticationManager.
While the implementation of AuthenticationManager could be anything, the most common implementation is [ProviderManager](https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html#servlet-authentication-providermanager).
![](image%209.png)
ProviderManager delegates to **a List** of [AuthenticationProvider](https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html#servlet-authentication-authenticationprovider) instances. Each AuthenticationProvider has an opportunity to indicate that authentication should be successful, fail, or indicate it cannot make a decision and allow a downstream AuthenticationProvider to decide. If none of the configured AuthenticationProvider instances can authenticate, authentication fails with a **ProviderNotFoundException**, which is a special AuthenticationException that indicates that the ProviderManager was not configured to support the type of Authentication that was passed into it.
In practice each AuthenticationProvider knows how to **perform a specific type of authentication**. For example, one AuthenticationProvider might be able to validate a username/password, while another might be able to authenticate a SAML assertion. This lets each AuthenticationProvider do a very specific type of authentication while supporting multiple types of authentication and expose only a single AuthenticationManager bean.
ProviderManager also allows configuring **an optional parent AuthenticationManager**, which is consulted in the event that no AuthenticationProvider can perform authentication. The parent can be any type of AuthenticationManager, but it is often an instance of ProviderManager.
In fact, multiple ProviderManager instances might share the same parent AuthenticationManager. This is somewhat common in scenarios where there are multiple [SecurityFilterChain](https://docs.spring.io/spring-security/reference/servlet/architecture.html#servlet-securityfilterchain) instances that have some authentication in common (the shared parent AuthenticationManager), but also different authentication mechanisms (the different ProviderManager instances).
![](image%2010.png)

When a client makes an unauthenticated request to a resource that they are not authorized to access. In this case, an implementation of **AuthenticationEntryPoint** is used to request credentials from the client. The AuthenticationEntryPoint implementation might perform a [redirect to a log in page](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/form.html#servlet-authentication-form), respond with an [WWW-Authenticate](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/basic.html#servlet-authentication-basic) header, or take other action.
**AbstractAuthenticationProcessingFilter**
[AbstractAuthenticationProcessingFilter](https://docs.spring.io/spring-security/site/docs/6.3.1/api/org/springframework/security/web/authentication/AbstractAuthenticationProcessingFilter.html) is used as a base Filter for **authenticating a user’s credentials**. 
![](image%2011.png)
When the user submits their credentials, the AbstractAuthenticationProcessingFilter creates an [Authentication](https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html#servlet-authentication-authentication) from the HttpServletRequest to be authenticated. The type of Authentication created depends on the subclass of AbstractAuthenticationProcessingFilter. For example, [UsernamePasswordAuthenticationFilter](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/form.html#servlet-authentication-usernamepasswordauthenticationfilter) creates a UsernamePasswordAuthenticationToken from a *username* and *password* that are submitted in the HttpServletRequest.
Next, the [Authentication](https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html#servlet-authentication-authentication) is passed into the [AuthenticationManager](https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html#servlet-authentication-authenticationmanager) to be authenticated.
If authentication fails, then *Failure*.
* The [SecurityContextHolder](https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html#servlet-authentication-securitycontextholder) is cleared out.
* RememberMeServices.loginFail is invoked. If remember me is not configured, this is a no-op. See the [rememberme](https://docs.spring.io/spring-security/site/docs/6.3.1/api/org/springframework/security/web/authentication/rememberme/package-frame.html) package.
* AuthenticationFailureHandler is invoked. See the [AuthenticationFailureHandler](https://docs.spring.io/spring-security/site/docs/6.3.1/api/org/springframework/security/web/authentication/AuthenticationFailureHandler.html) interface.
If authentication is successful, then *Success*.
* SessionAuthenticationStrategy is notified of a new login. See the [SessionAuthenticationStrategy](https://docs.spring.io/spring-security/site/docs/6.3.1/api/org/springframework/security/web/authentication/session/SessionAuthenticationStrategy.html) interface.
* The [Authentication](https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html#servlet-authentication-authentication) is set on the [SecurityContextHolder](https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html#servlet-authentication-securitycontextholder). Later, if you need to save the SecurityContext so that it can be automatically set on future requests, SecurityContextRepository#saveContext must be explicitly invoked. See the [SecurityContextHolderFilter](https://docs.spring.io/spring-security/site/docs/6.3.1/api/org/springframework/security/web/context/SecurityContextHolderFilter.html) class.
* RememberMeServices.loginSuccess is invoked. If remember me is not configured, this is a no-op. See the [rememberme](https://docs.spring.io/spring-security/site/docs/6.3.1/api/org/springframework/security/web/authentication/rememberme/package-frame.html) package.
* ApplicationEventPublisher publishes an InteractiveAuthenticationSuccessEvent.
* AuthenticationSuccessHandler is invoked. See the [AuthenticationSuccessHandler](https://docs.spring.io/spring-security/site/docs/6.3.1/api/org/springframework/security/web/authentication/AuthenticationSuccessHandler.html) interface.

#### ⠀Username/Password Authentication 
authenticate users via a REST API 
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
			.authorizeHttpRequests((authorize) -> authorize
				.requestMatchers("/login").permitAll()
				.anyRequest().authenticated()
			);

		return http.build();
	}

	@Bean
	public AuthenticationManager authenticationManager(
			UserDetailsService userDetailsService,
			PasswordEncoder passwordEncoder) {
		DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
		authenticationProvider.setUserDetailsService(userDetailsService);
		authenticationProvider.setPasswordEncoder(passwordEncoder);

		return new ProviderManager(authenticationProvider);
	}

	@Bean
	public UserDetailsService userDetailsService() {
		UserDetails userDetails = User.withDefaultPasswordEncoder()
			.username("user")
			.password("password")
			.roles("USER")
			.build();

		return new InMemoryUserDetailsManager(userDetails);
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return PasswordEncoderFactories.createDelegatingPasswordEncoder();
	}

}

@RestController
public class LoginController {

	private final AuthenticationManager authenticationManager;

	public LoginController(AuthenticationManager authenticationManager) {
		this.authenticationManager = authenticationManager;
	}

	@PostMapping("/login")
	public ResponseEntity<Void> login(@RequestBody LoginRequest loginRequest) {
		Authentication authenticationRequest =
			UsernamePasswordAuthenticationToken.unauthenticated(loginRequest.username(), loginRequest.password());
		Authentication authenticationResponse =
			this.authenticationManager.authenticate(authenticationRequest);
		// ...
	}

	public record LoginRequest(String username, String password) {
	}

}
```

Built-in mechanism for reading a username:
* [Form](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/form.html)
* [Basic](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/basic.html)
  WWW-Authenticate header
* [Digest](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/digest.html)
  You should not use Digest Authentication in modern applications, because it is not considered to be secure.

**DaoAuthenticationProvider**

[DaoAuthenticationProvider](https://docs.spring.io/spring-security/site/docs/6.3.1/api/org/springframework/security/authentication/dao/DaoAuthenticationProvider.html) is an [AuthenticationProvider](https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html#servlet-authentication-authenticationprovider) implementation that uses a [UserDetailsService](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/user-details-service.html#servlet-authentication-userdetailsservice) and [PasswordEncoder](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/password-encoder.html#servlet-authentication-password-storage) to authenticate a username and password.
![](image%2012.png)
#### **Persistence**
in Spring Security the association of the user to future requests is made using [SecurityContextRepository](https://docs.spring.io/spring-security/site/docs/6.3.1/api/org/springframework/security/web/context/SecurityContextRepository.html). The default implementation of SecurityContextRepository is [DelegatingSecurityContextRepository](https://docs.spring.io/spring-security/site/docs/6.3.1/api/org/springframework/security/web/context/DelegatingSecurityContextRepository.html) which delegates to the following:
* [HttpSessionSecurityContextRepository](https://docs.spring.io/spring-security/reference/servlet/authentication/persistence.html#httpsecuritycontextrepository)
* [RequestAttributeSecurityContextRepository](https://docs.spring.io/spring-security/reference/servlet/authentication/persistence.html#requestattributesecuritycontextrepository)

**NullSecurityContextRepository**
If it is not desirable to associate the SecurityContext to an HttpSession (i.e. when authenticating with OAuth) the [NullSecurityContextRepository](https://docs.spring.io/spring-security/site/docs/6.3.1/api/org/springframework/security/web/context/NullSecurityContextRepository.html) is an implementation of SecurityContextRepository that does nothing.

The[SecurityContextPersistenceFilter](https://docs.spring.io/spring-security/site/docs/6.3.1/api/org/springframework/security/web/context/SecurityContextPersistenceFilter.html) is responsible for persisting the SecurityContext between requests using the [SecurityContextRepository](https://docs.spring.io/spring-security/reference/servlet/authentication/persistence.html#securitycontextrepository).
![](image%2013.png)
**SecurityContextHolderFilter**
The [SecurityContextHolderFilter](https://docs.spring.io/spring-security/site/docs/6.3.1/api/org/springframework/security/web/context/SecurityContextHolderFilter.html) is responsible for loading the SecurityContext between requests using the [SecurityContextRepository](https://docs.spring.io/spring-security/reference/servlet/authentication/persistence.html#securitycontextrepository).
![](image%2014.png)
Unlike,[SecurityContextPersistenceFilter](https://docs.spring.io/spring-security/reference/servlet/authentication/persistence.html#securitycontextpersistencefilter), SecurityContextHolderFilter only loads the SecurityContext it does not save the SecurityContext. This means that when using SecurityContextHolderFilter, it is required that the SecurityContext is explicitly saved.


## Restful API
@RestController

@Service

@Reposity