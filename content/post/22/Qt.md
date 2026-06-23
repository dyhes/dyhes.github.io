---
title: 【Qt】Basics
date: 2022-08-15 00:00:00+0000
categories: 
- snow
---

## QApplication

The **QCoreApplication** class and  **QApplication** class and provides an event loop for console Qt applications. Those class are used by applications to provide event loop. For non-GUI application that uses Qt, there should be exactly one **QCoreApplication** object. For GUI applications, we will use **QApplication**.

When calling **a.exec()** the event loop is launched.

When we compile the project, behind the scene, our Qt app is compiled in the following steps:

1. **qmake** parses the **.pro** file, and generates **makefile**.
2. The program is build using **make** (**jom** on windows).

## Signals and Slots

Signals and slots are used for communication between objects. The signals and slots mechanism is a central feature of Qt and probably the part that differs most from the features provided by other frameworks.

A signal is emitted when a particular event occurs. Qt's widgets have many predefined signals, but we can always subclass widgets to add our own signals to them. A slot is a function that is called in response to a particular signal. Qt's widgets have many pre-defined slots, but it is common practice to subclass widgets and add your own slots so that you can handle the signals that you are interested in.

All classes that inherit from QObject or one of its subclasses (e.g., QWidget) can contain signals and slots.

 Just as an object does not know if anything receives its signals, a slot does not know if it has any signals connected to it. This ensures that truly independent components can be created with Qt.  You can connect as many signals as you want to a single slot, and a signal can be connected to as many slots as you need. 

## Q_OBJECT Macro

The Q_OBJECT macro must appear in the private section of a class definition that declares its own signals and slots or that uses other services provided by Qt's meta-object system.

Note that when we want to make connection between signal and slot, we actually do it with **Object** scope:

```cpp
QObject::connect(sender, signal, receiver, slot):
```

## QString

We will use all three methods to find some substrings of a given string.

```
out << str.right(5) << endl;
```

With the `right` method, we get five rightmost characters of the `str` string. The 'train' is printed.

```
out << str.left(9) << endl;
```

With the `left` method, we get nine leftmost characters of the `str` string. The 'The night' is printed.

```
out << str.mid(4, 5) << endl;
```

With the `mid` method, we get five characters starting from the 4th position. The 'night' is printed.

```
QString str2("The big apple");
QStringRef sub(&str2, 0, 7);
```

The `QStringRef` class is a read-only version of a `QString`. Here we create a `QStringRef` of a portion of the `str2` string. The second parameter is the position and the third is the length of the substring.



The Q_OBJECT macro must be included in classes that declare their own signals and slots.





1. QMainWindow 是主窗口类，主窗口具有主菜单栏、工具栏和状态栏，类似于一般的应用程序的主窗口；
2. QWidget 是所有具有可视界面类的基类，选择 QWidget 创建的界面对各种界面组件都可以 支持；
3. QDialog 是对话框类，可建立一个基于对话框的界面；