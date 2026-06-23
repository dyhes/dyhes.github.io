---
title: 【Spring】Concepts
date: 2022-01-03 00:00:00+0000
categories: 
- nutrition
- willow
---

## Intro

Spring is a *lightweight* framework. It can be thought of as **a *framework of frameworks*** because it provides support to various frameworks such as [Struts](https://www.javatpoint.com/struts-2-tutorial), [Hibernate](https://www.javatpoint.com/hibernate-tutorial), Tapestry, [EJB](https://www.javatpoint.com/ejb-tutorial), [JSF](https://www.javatpoint.com/jsf-tutorial), etc. 

The framework, in broader sense, can be defined as **a structure** where we **find solution** of the various technical problems.

The Spring framework comprises several modules such as **IOC, AOP, DAO, Context, ORM, WEB MVC etc**. We will learn these modules in next page. Let's understand the IOC and Dependency Injection first.

Inversion Of Control (IOC) and Dependency Injection

These are the design patterns that are used to **remove dependency** from the programming code. They make the code **easier to test and maintain**. 

```java
//bad
class Employee{  
 Address address;  
 Employee(){  
  address=new Address();  
 }  
}  
//In such case, there is dependency between the Employee and Address (tight coupling).

//good
class Employee{
Address address;  
 Employee(Address address){  
  this.address=address;  
 }  
}  

```

Thus, IOC makes the code loosely coupled. In such case, there is no need to modify the code if our logic is moved to new environment.

In Spring framework, **IOC container** is responsible to inject the dependency. We provide **metadata** to the IOC container either by **XML file or annotation**.

advantage:

* makes the code loosely coupled so easy to **maintain**
* makes the code easy to **test**


## IoC Container

The IoC container is responsible to **instantiate, configure and assemble the objects**. The IoC container gets informations from the XML file and works accordingly. 

The main tasks performed by IoC container are:

- to instantiate the application class
- to configure the object
- to assemble the dependencies between the objects

### types

There are two types of IoC containers. They are:

1. **BeanFactory**
2. **ApplicationContext**

The ApplicationContext interface is built **on top of** the BeanFactory interface. It adds some extra functionality than BeanFactory such as simple integration with Spring's AOP, message resource handling (for I18N), event propagation, application layer specific context (e.g. WebApplicationContext) for web application. So it is **better** to use ApplicationContext than BeanFactory.

#### Using BeanFactory

The XmlBeanFactory is the **implementation** class for the BeanFactory interface. To use the BeanFactory, we need to create the instance of XmlBeanFactory class as given below:

```java
Resource resource=new ClassPathResource("applicationContext.xml");  
BeanFactory factory=new XmlBeanFactory(resource);   
```

The constructor of XmlBeanFactory class receives the Resource object so we need to pass the resource object to create the object of BeanFactory.

#### Using ApplicationContext

The ClassPathXmlApplicationContext class is the **implementation** class of ApplicationContext interface. We need to instantiate the ClassPathXmlApplicationContext class to use the ApplicationContext as given below:

```java
ApplicationContext context =   
    new ClassPathXmlApplicationContext("applicationContext.xml");  
```

The constructor of ClassPathXmlApplicationContext class receives string, so we can pass the name of the xml file to create the instance of ApplicationContext.

## DI

 To understand the DI better, Let's understand the Dependency Lookup (DL) first.

The Dependency Lookup is an approach where we get the resource after demand. There can be various ways to get the resource.

There are mainly two problems of dependency lookup.

- **tight coupling** The dependency lookup approach makes the code tightly coupled. **If resource is changed**, we need to perform a lot of modification in the code.
- **Not easy for testing** This approach creates a lot of problems while testing the application especially in black box testing.

The Dependency Injection is a design pattern that removes the dependency of the programs. In such case we **provide the information from the external source** such as XML file. 

Spring framework provides two ways to inject dependency

- By Constructor
- By Setter method

### By Constructor

The **<constructor-arg>** subelement of **<bean>** is used for constructor injection.

Resource

```xml
<bean id="e" class="com.javatpoint.Employee">  
 <constructor-arg value="10" type="int" ></constructor-arg>  
 <constructor-arg value="Sonoo"></constructor-arg>
</bean>  
```

test

```java
public class Test {  
    public static void main(String[] args) {  
          
        Resource r=new ClassPathResource("applicationContext.xml");  
        BeanFactory factory=new XmlBeanFactory(r);  
          
        Employee s=(Employee)factory.getBean("e");  
        s.show();  
          
    }  
}  
```

#### With Object

```xml
<beans  
    xmlns="http://www.springframework.org/schema/beans"  
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
    xmlns:p="http://www.springframework.org/schema/p"  
    xsi:schemaLocation="http://www.springframework.org/schema/beans  
                http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">  
  
<bean id="a1" class="com.javatpoint.Address">  
<constructor-arg value="ghaziabad"></constructor-arg>  
<constructor-arg value="UP"></constructor-arg>  
<constructor-arg value="India"></constructor-arg>  
</bean>  
  
  
<bean id="e" class="com.javatpoint.Employee">  
<constructor-arg value="12" type="int"></constructor-arg>  
<constructor-arg value="Sonoo"></constructor-arg>  
<constructor-arg>  
<ref bean="a1"/>  
</constructor-arg>  
</bean>  
  
</beans>  
```

#### With Collection

We can inject collection values by constructor in spring framework. There can be used three elements inside the **constructor-arg** element.

It can be:

1. **list**
2. **set**
3. **map**

Each collection can have **string based** and **non-string based** values.

##### list

```xml
<!--string based-->
<?xml version="1.0" encoding="UTF-8"?>  
<beans  
    xmlns="http://www.springframework.org/schema/beans"  
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
    xmlns:p="http://www.springframework.org/schema/p"  
    xsi:schemaLocation="http://www.springframework.org/schema/beans  
 http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">  
  
<bean id="q" class="com.javatpoint.Question">  
<constructor-arg value="111"></constructor-arg>  
<constructor-arg value="What is java?"></constructor-arg>  
<constructor-arg>  
<list>  
<value>Java is a programming language</value>  
<value>Java is a Platform</value>  
<value>Java is an Island of Indonasia</value>  
</list>  
</constructor-arg>  
</bean>  
</beans>  

<!--non-string based-->
<?xml version="1.0" encoding="UTF-8"?>  
<beans  
    xmlns="http://www.springframework.org/schema/beans"  
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
    xmlns:p="http://www.springframework.org/schema/p"  
    xsi:schemaLocation="http://www.springframework.org/schema/beans   
http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">  
  
<bean id="ans1" class="com.javatpoint.Answer">  
<constructor-arg value="1"></constructor-arg>  
<constructor-arg value="Java is a programming language"></constructor-arg>  
<constructor-arg value="John"></constructor-arg>  
</bean>  
  
<bean id="ans2" class="com.javatpoint.Answer">  
<constructor-arg value="2"></constructor-arg>  
<constructor-arg value="Java is a Platform"></constructor-arg>  
<constructor-arg value="Ravi"></constructor-arg>  
</bean>  
  
<bean id="q" class="com.javatpoint.Question">  
<constructor-arg value="111"></constructor-arg>  
<constructor-arg value="What is java?"></constructor-arg>  
<constructor-arg>  
<list>  
<ref bean="ans1"/>  
<ref bean="ans2"/>  
</list>  
</constructor-arg>  
</bean>  
  
</beans>  
```

##### map

```xml
<!--string based-->
<?xml version="1.0" encoding="UTF-8"?>  
<beans  
    xmlns="http://www.springframework.org/schema/beans"  
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
    xmlns:p="http://www.springframework.org/schema/p"  
    xsi:schemaLocation="http://www.springframework.org/schema/beans   
http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">  
  
<bean id="q" class="com.javatpoint.Question">  
<constructor-arg value="11"></constructor-arg>  
<constructor-arg value="What is Java?"></constructor-arg>  
<constructor-arg>  
<map>  
<entry key="Java is a Programming Language"  value="Ajay Kumar"></entry>  
<entry key="Java is a Platform" value="John Smith"></entry>  
<entry key="Java is an Island" value="Raj Kumar"></entry>  
</map>  
</constructor-arg>  
</bean>  
  
</beans>  

<!--non-string based-->
<?xml version="1.0" encoding="UTF-8"?>  
<beans  
    xmlns="http://www.springframework.org/schema/beans"  
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
    xmlns:p="http://www.springframework.org/schema/p"  
    xsi:schemaLocation="http://www.springframework.org/schema/beans   
http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">  
  
<bean id="answer1" class="com.javatpoint.Answer">  
<constructor-arg value="1"></constructor-arg>  
<constructor-arg value="Java is a Programming Language"></constructor-arg>  
<constructor-arg value="12/12/2001"></constructor-arg>  
</bean>  
<bean id="answer2" class="com.javatpoint.Answer">  
<constructor-arg value="2"></constructor-arg>  
<constructor-arg value="Java is a Platform"></constructor-arg>  
<constructor-arg value="12/12/2003"></constructor-arg>  
</bean>  
  
<bean id="user1" class="com.javatpoint.User">  
<constructor-arg value="1"></constructor-arg>  
<constructor-arg value="Arun Kumar"></constructor-arg>  
<constructor-arg value="arun@gmail.com"></constructor-arg>  
</bean>  
<bean id="user2" class="com.javatpoint.User">  
<constructor-arg value="2"></constructor-arg>  
<constructor-arg value="Varun Kumar"></constructor-arg>  
<constructor-arg value="Varun@gmail.com"></constructor-arg>  
</bean>  
  
<bean id="q" class="com.javatpoint.Question">  
<constructor-arg value="1"></constructor-arg>  
<constructor-arg value="What is Java?"></constructor-arg>  
<constructor-arg>  
<map>  
<entry key-ref="answer1" value-ref="user1"></entry>  
<entry key-ref="answer2" value-ref="user2"></entry>  
</map>  
</constructor-arg>  
</bean>  
  
</beans>  
```

#### inheritance

By using the **parent** attribute of **bean**, we can specify the inheritance relation between the beans. In such case, parent bean values will be inherited to the current bean.

```xml
<?xml version="1.0" encoding="UTF-8"?>  
<beans  
    xmlns="http://www.springframework.org/schema/beans"  
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
    xmlns:p="http://www.springframework.org/schema/p"  
    xsi:schemaLocation="http://www.springframework.org/schema/beans   
http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">  
  
<bean id="e1" class="com.javatpoint.Employee">  
<constructor-arg value="101"></constructor-arg>  
<constructor-arg  value="Sachin"></constructor-arg>  
</bean>  
  
<bean id="address1" class="com.javatpoint.Address">  
<constructor-arg value="21,Lohianagar"></constructor-arg>  
<constructor-arg value="Ghaziabad"></constructor-arg>  
<constructor-arg value="UP"></constructor-arg>  
<constructor-arg value="USA"></constructor-arg>  
</bean>  
  
<bean id="e2" class="com.javatpoint.Employee" parent="e1">  
<constructor-arg ref="address1"></constructor-arg>  
</bean>  
  
</beans>  
```

### By Setter

We can inject the dependency by setter method also. The **<property>** subelement of **<bean>** is used for setter injection. Here we are going to inject

1. primitive and String-based values
2. Dependent object (contained object)
3. Collection values etc.

```xml
<?xml version="1.0" encoding="UTF-8"?>  
<beans  
    xmlns="http://www.springframework.org/schema/beans"  
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
    xmlns:p="http://www.springframework.org/schema/p"  
    xsi:schemaLocation="http://www.springframework.org/schema/beans  
                http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">  
  
<bean id="obj" class="com.javatpoint.Employee">  
<property name="id">  
<value>20</value>  
</property>  
<property name="name">  
<value>Arun</value>  
</property>  
<property name="city">  
<value>ghaziabad</value>  
</property>  
  
</bean>  
  
</beans>  
```

#### With Object

```xml
<beans  
    xmlns="http://www.springframework.org/schema/beans"  
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
    xmlns:p="http://www.springframework.org/schema/p"  
    xsi:schemaLocation="http://www.springframework.org/schema/beans  
                http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">  
  
<bean id="address1" class="com.javatpoint.Address">  
<property name="addressLine1" value="51,Lohianagar"></property>  
<property name="city" value="Ghaziabad"></property>  
<property name="state" value="UP"></property>  
<property name="country" value="India"></property>  
</bean>  
  
<bean id="obj" class="com.javatpoint.Employee">  
<property name="id" value="1"></property>  
<property name="name" value="Sachin Yadav"></property>  
<property name="address" ref="address1"></property>  
</bean>
  
</beans>  
```

#### With Collection

We can inject collection values by setter method in spring framework. There can be used three elements inside the **property** element.

1. **list**
2. **set**
3. **map**

Each collection can have **string based** and **non-string based** values.

##### list

```xml
<!--string based-->
<?xml version="1.0" encoding="UTF-8"?>  
<beans  
    xmlns="http://www.springframework.org/schema/beans"  
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
    xmlns:p="http://www.springframework.org/schema/p"  
    xsi:schemaLocation="http://www.springframework.org/schema/beans  
 http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">  
  
<bean id="q" class="com.javatpoint.Question">  
<property name="id" value="1"></property>  
<property name="name" value="What is Java?"></property>  
<property name="answers">  
<list>  
<value>Java is a programming language</value>  
<value>Java is a platform</value>  
<value>Java is an Island</value>  
</list>  
</property>  
</bean>  
</beans>  

<!--non-string based-->
<?xml version="1.0" encoding="UTF-8"?>  
<beans  
    xmlns="http://www.springframework.org/schema/beans"  
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
    xmlns:p="http://www.springframework.org/schema/p"  
    xsi:schemaLocation="http://www.springframework.org/schema/beans   
http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">  
  
<bean id="answer1" class="com.javatpoint.Answer">  
<property name="id" value="1"></property>  
<property name="name" value="Java is a programming language"></property>  
<property name="by" value="Ravi Malik"></property>  
</bean>  
<bean id="answer2" class="com.javatpoint.Answer">  
<property name="id" value="2"></property>  
<property name="name" value="Java is a platform"></property>  
<property name="by" value="Sachin"></property>  
</bean>  
  
<bean id="q" class="com.javatpoint.Question">  
<property name="id" value="1"></property>  
<property name="name" value="What is Java?"></property>  
<property name="answers">  
<list>  
<ref bean="answer1"/>  
<ref bean="answer2"/>  
</list>  
</property>  
</bean>  
  
</beans>  
```

##### map

```xml
<!--string based-->
<?xml version="1.0" encoding="UTF-8"?>  
<beans  
    xmlns="http://www.springframework.org/schema/beans"  
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
    xmlns:p="http://www.springframework.org/schema/p"  
    xsi:schemaLocation="http://www.springframework.org/schema/beans   
http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">  
  
<bean id="q" class="com.javatpoint.Question">  
<property name="id" value="1"></property>  
<property name="name" value="What is Java?"></property>  
<property name="answers">  
<map>  
<entry key="Java is a programming language"  value="Sonoo Jaiswal"></entry>  
<entry key="Java is a Platform" value="Sachin Yadav"></entry>  
</map>  
</property>  
</bean>  
  
</beans>  

<!--non-string based-->
<?xml version="1.0" encoding="UTF-8"?>  
<beans  
    xmlns="http://www.springframework.org/schema/beans"  
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
    xmlns:p="http://www.springframework.org/schema/p"  
    xsi:schemaLocation="http://www.springframework.org/schema/beans   
http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">  
  
<bean id="answer1" class="com.javatpoint.Answer">  
<property name="id" value="1"></property>  
<property name="answer" value="Java is a Programming Language"></property>  
<property name="postedDate" value="12/12/2001"></property>  
</bean>  
<bean id="answer2" class="com.javatpoint.Answer">  
<property name="id" value="2"></property>  
<property name="answer" value="Java is a Platform"></property>  
<property name="postedDate" value="12/12/2003"></property>  
</bean>  
  
<bean id="user1" class="com.javatpoint.User">  
<property name="id" value="1"></property>  
<property name="name" value="Arun Kumar"></property>  
<property name="email" value="arun@gmail.com"></property>  
</bean>  
<bean id="user2" class="com.javatpoint.User">  
<property name="id" value="2"></property>  
<property name="name" value="Varun Kumar"></property>  
<property name="email" value="Varun@gmail.com"></property>  
</bean>  
  
<bean id="q" class="com.javatpoint.Question">  
<property name="id" value="1"></property>  
<property name="name" value="What is Java?"></property>  
<property name="answers">  
<map>  
<entry key-ref="answer1" value-ref="user1"></entry>  
<entry key-ref="answer2" value-ref="user2"></entry>  
</map>  
</property>  
</bean>  
  
</beans>  
```

### Difference

There are many key differences between constructor injection and setter injection.

1. **Partial dependency**: can be injected using setter injection but it is not possible by constructor. Suppose there are 3 properties in a class, having 3 arg constructor and setters methods. In such case, if you want to pass information for only one property, it is possible by setter method only.
2. **Overriding**: Setter injection overrides the constructor injection. If we use both constructor and setter injection, IOC container will use the setter injection.
3. **Changes**: We can easily change the value by setter injection. It doesn't create a new bean instance always like constructor. So setter injection is more flexible than constructor injection.

### Autowiring

Autowiring feature of spring framework enables you to inject the object dependency implicitly. It internally uses setter or constructor injection.

Autowiring can't be used to inject primitive and string values. It works with **reference only**.

#### Modes

| No.  | Mode        | Description                                                  |
| :--- | :---------- | :----------------------------------------------------------- |
| 1)   | no          | It is the default autowiring mode. It means no autowiring bydefault. |
| 2)   | byName      | The byName mode injects the object dependency according to name of the bean. In such case, property name and bean name **must be same**. It internally **calls setter method**. |
| 3)   | byType      | The byType mode injects the object dependency according to type. So property name and bean name **can be different**. It internally **calls setter method**. |
| 4)   | constructor | The constructor mode injects the dependency by **calling the constructor** of the class. It calls the constructor **having largest number of parameters.** |
| 5)   | autodetect  | It is deprecated since Spring 3.                             |

```xml
<bean id="b" class="org.sssit.B"></bean>  
<bean id="a" class="org.sssit.A" autowire="byName"></bean>  

<bean id="b1" class="org.sssit.B"></bean>  
<bean id="a" class="org.sssit.A" autowire="byType"></bean>  
```

### With Factory Method

Spring framework provides facility to inject bean using factory method. To do so, we can use two attributes of bean element.

1. **factory-method:** represents the factory method that will be invoked to inject the bean.
2. **factory-bean:** represents **the reference of the bean by which factory method will be invoked**. It is used if f**actory method is non-static**.

A method that returns instance of a class is called **factory method**.

```java
public class A {  
 public static A getA(){//factory method  
     return new A();  
 }  
}  
```

here can be three types of factory method:

\1) A **static factory method** that returns instance of **its own** class. It is used in singleton design pattern.

 ```java
 <bean id="a" class="com.javatpoint.A" factory-method="getA"></bean>  
 ```

\2) A **static factory method** that returns instance of **another** class. It is used instance is not known and decided at runtime.

```java
<bean id="b" class="com.javatpoint.A" factory-method="getB"></bean>  
```

\3) A **non-static factory** method that returns instance of **another** class. It is used instance is not known and decided at runtime.

```java
<bean id="a" class="com.javatpoint.A"></bean>  
<bean id="b" class="com.javatpoint.A" factory-method="getB" factory-bean="a"></bean>  
```

## AOP

**Aspect Oriented Programming** (AOP) compliments( 补充 ) OOPs in the sense that it also provides modularity. But the key unit of modularity is aspect than class.

AOP breaks the program logic into **distinct parts** (called concerns). It is used to increase modularity by **cross-cutting concerns**.

A **cross-cutting concern** is a concern that can affect the whole application and should be centralized in one location in code as possible, such as transaction management, authentication, logging, security etc. 

AOP is mostly used in following cases:

- to provide declarative enterprise services such as declarative transaction management.
- It allows users to implement custom aspects.

### Concepts and Terminology

AOP concepts and terminologies are as follows:

- Join point : any point in your program such as method execution, exception handling, field access etc. Spring supports **only** method execution join point.
- Advice : represents **an action** taken by **an aspect** at a **particular join poin**t.
  - **Before Advice**: it executes before a join point.
  - **After Returning Advice**: it executes after a joint point completes normally.
  - **After Throwing Advice**: it executes if method exits by throwing an exception.
  - **After (finally) Advice**: it executes after a join point regardless of join point exit whether normally or exceptional return.
  - **Around Advice**: It executes before and after a join point.

- Pointcut : an **expression language** of AOP that **matches join points**.
- Introduction  : means introduction of **additional method** and fields for a type. It allows you to introduce new interface to any advised object.
- Target Object : It is the object i.e. being advised by one or more aspects. It is also known as **proxied object** in spring because Spring AOP is implemented using runtime proxies.
- Aspect : It is **a class** that contains advices, joinpoints etc.
- Interceptor : an **aspect** that contains **only one advice**.
- AOP Proxy :   used to **implement aspect contracts**, created by AOP framework. It will be a JDK dynamic proxy or CGLIB proxy in spring framework.
- Weaving : the **process** of **linking** aspect with other application types or objects to **create** an advised object. Weaving can be done at compile time, load time or runtime. Spring AOP performs weaving at runtime.

### Implementations

AOP implementations are provided by:

1. AspectJ
2. Spring AOP
3. JBoss AOP

#### Spring AOP

##### Advisor class

```java
public class BeforeAdvisor implements MethodBeforeAdvice{  
    @Override  
    public void before(Method method, Object[] args, Object target)throws Throwable {  
        System.out.println("additional concern before actual logic");  
    }  
}  
```

##### ProxyFactoryBean

The **ProxyFactoryBean** class is provided by Spring Famework. It contains 2 properties target and interceptorNames. The instance of A class will be considered as target object and the instance of advisor class as interceptor. You need to pass the advisor object as the list object as in the xml file given above.

In xml file, create 3 beans, one for A class, second for Advisor class and third for **ProxyFactoryBean** class.

```xml
<?xml version="1.0" encoding="UTF-8"?>  
<beans  
    xmlns="http://www.springframework.org/schema/beans"  
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
    xmlns:p="http://www.springframework.org/schema/p"  
    xsi:schemaLocation="http://www.springframework.org/schema/beans   
http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">  
  
<bean id="obj" class="com.javatpoint.A"></bean>  
<bean id="ba" class="com.javatpoint.BeforeAdvisor"></bean>  
  
<bean id="proxy" class="org.springframework.aop.framework.ProxyFactoryBean">  
<property name="target" ref="obj"></property>  
<property name="interceptorNames">  
<list>  
<value>ba</value>  
</list>  
</property>  
</bean>  
  
</beans>  
```

#### AspectJ

The **Spring Framework** recommends you to use **Spring AspectJ AOP implementation** over the Spring 1.2 old style dtd based AOP implementation because it provides you **more control** and it is **easy to use**.

Spring AspectJ AOP implementation provides many annotations:

1. **@Aspect** declares the class as aspect.
2. **@Pointcut** declares the pointcut expression.

The annotations used to create advices are given below:

1. **@Before** declares the before advice. It is applied before calling the actual method.
2. **@After** declares the after advice. It is applied after calling the actual method and before returning result.
3. **@AfterReturning** declares the after returning advice. It is applied after calling the actual method and before returning result. But you can get the result value in the advice.
4. **@Around** declares the around advice. It is applied before and after calling the actual method.
5. **@AfterThrowing** declares the throws advice. It is applied if actual method throws exception.

##### @Pointcut

Let's try the understand the pointcut expressions by the examples given below:

```java
@Pointcut("execution(public * *(..))") 
```

It will be applied on all the public methods.

```java
@Pointcut("execution(public Operation.*(..))")  
```

It will be applied on all the public methods of Operation class.

```java
@Pointcut("execution(* Operation.*(..))")  
```

It will be applied on all the methods of Operation class.

```java
@Pointcut("execution(* Operation.*(..))")  
```

It will be applied on all the public setter methods of Employee class.

```java
@Pointcut("execution(int Operation.*(..))")  
```

It will be applied on all the methods of Operation class that returns int value.

example

```java
@Aspect  
public class TrackOperation{  
    @Pointcut("execution(* Operation.*(..))")  
    public void k(){}//pointcut name  
      
    @Before("k()")//applying pointcut on before advice  
    public void myadvice(JoinPoint jp)//it is advice (before advice)  
    {  
        System.out.println("additional concern");  
        //System.out.println("Method Signature: "  + jp.getSignature());  
    }  
}  
```

xml

```xml
    <bean id="opBean" class="com.javatpoint.Operation">   </bean>  
    <bean id="trackMyBean" class="com.javatpoint.TrackOperation"></bean>  
    <bean class="org.springframework.aop.aspectj.annotation.AnnotationAwareAspectJAutoProxyCreator"></bean>  
```

## Spring JdbcTemplate

Spring **JdbcTemplate** is a powerful **mechanism** to **connect to the database and execute SQL queries**. It internally uses JDBC api, but eliminates a lot of problems of JDBC API.

The problems of JDBC API are as follows:

- We need to write a lot of code before and after executing the query, such as creating connection, statement, closing resultset, connection etc.
- We need to perform exception handling code on the database logic.
- We need to handle transaction.
- Repetition of all these codes from one to another database logic is a time consuming task.

| No.  | Method                                                       | Description                                                  |
| :--- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| 1)   | public int update(String query)                              | is used to insert, update and delete records.                |
| 2)   | public int update(String query,Object... args)               | is used to insert, update and delete records using PreparedStatement using given arguments. |
| 3)   | public void execute(String query)                            | is used to execute DDL query.                                |
| 4)   | public T execute(String sql, PreparedStatementCallback action) | executes the query by using PreparedStatement callback.      |
| 5)   | public T query(String sql, ResultSetExtractor rse)           | is used to fetch records using ResultSetExtractor.           |
| 6)   | public List query(String sql, RowMapper rse)                 | is used to fetch records using RowMapper.                    |

## ORM

Spring provides API to easily integrate Spring with ORM frameworks such as Hibernate, JPA(Java Persistence API), JDO(Java Data Objects), Oracle Toplink and iBATIS.

There are a lot of advantage of Spring framework in respect to ORM frameworks. There are as follows:

- **Less coding is required**: By the help of Spring framework, you don't need to write extra codes before and after the actual database logic such as getting the connection, starting transaction, commiting transaction, closing connection etc.
- **Easy to test**: Spring's IoC approach makes it easy to test the application.
- **Better exception handling**: Spring framework provides its own API for exception handling with ORM framework.
- **Integrated transaction management**: By the help of Spring framework, we can wrap our mapping code with an explicit template wrapper class or AOP style method interceptor.

## Spring MVC

A Spring MVC is a Java framework which is used to build web applications. It follows the Model-View-Controller design pattern. It implements all the basic features of a core spring framework like Inversion of Control, Dependency Injection.

A Spring MVC provides an elegant solution to use MVC in spring framework by the help of **DispatcherServlet**. Here, **DispatcherServlet** is a class that receives the incoming request and maps it to the right resource such as controllers, models, and views.


- **Model** - A model contains the **data** of the application. A data can be a single object or a collection of objects.
- **Controller** - A controller contains the **business logic** of an application. Here, the @Controller annotation is used to mark the class as the controller.
- **View** - A view represents the provided information in a particular format. Generally, JSP+JSTL is used to create a view page. Although spring also supports other view technologies such as Apache Velocity, Thymeleaf and FreeMarker.
- **Front Controller** - In Spring Web MVC, **the DispatcherServlet class works as the front controller**. It is responsible to manage the flow of the Spring MVC application.



the advantages of Spring MVC Framework:-

- **Separate roles** - The Spring MVC separates each role, where the model object, controller, command object, view resolver, DispatcherServlet, validator, etc. can be fulfilled by a specialized object.
- **Light-weight** - It uses light-weight servlet container to develop and deploy your application.
- **Powerful Configuration** - It provides a robust configuration for both framework and application classes that includes easy referencing across contexts, such as from web controllers to business objects and validators.
- **Rapid development** - The Spring MVC facilitates fast and parallel development.
- **Reusable business code** - Instead of creating new objects, it allows us to use the existing business objects.
- **Easy to test** - In Spring, generally we create JavaBeans classes that enable you to inject test data using the setter methods.
- **Flexible Mapping** - It provides the specific annotations that easily redirect the page.























