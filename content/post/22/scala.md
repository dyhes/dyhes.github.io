---
title: 【Scala】浅窥
date: 2022-06-13 00:00:00+0000
categories: 
- nutrition
- temple
---


```scala
object HelloWorld {
  def main(args: Array[String]): Unit = {
    println("Hello, world!")
  }
}
```

Static members (methods or fields) do not exist in Scala. Rather than defining static members, the Scala programmer declares these members in singleton objects.



To compile the example, we use `scalac`, the Scala compiler. 



One of Scala’s strengths is that it makes it very easy to interact with Java code. All classes from the `java.lang` package are imported by default, while others need to be imported explicitly.



```scala
import java.util.{Date, Locale}
import java.text.DateFormat._

object FrenchDate {
  def main(args: Array[String]): Unit = {
    val now = new Date
    val df = getDateInstance(LONG, Locale.FRANCE)
    println(df format now)
  }
}
```

This last line shows an interesting property of Scala’s syntax. Methods taking one argument can be used with an infix syntax. 

```scala
df format now

df.format(now)
```



Scala is a pure object-oriented language in the sense that *everything* is an object, including numbers or functions.



Classes in Scala are declared using a syntax which is close to Java’s syntax. One important difference is that classes in Scala can have parameters. 

```scala
class Complex(real: Double, imaginary: Double) {
  def re() = real
  def im() = imaginary
}


//a better way
class Complex(real: Double, imaginary: Double) {
  def re = real
  def im = imaginary
}
```



```scala
class Complex(real: Double, imaginary: Double) {
  def re = real
  def im = imaginary
  override def toString() =
    "" + re + (if (im >= 0) "+" else "") + im + "i"
}
```



```scala
type Environment = String => Int
```















