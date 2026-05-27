---
title: 【Android】金旭亮-Android应用开发
date: 2021-11-16 00:00:00+0000
categories: 
- nutrition
tags:
    - Android
---

## 视图模式

Android Studio支持以多种方式查看Android项目，可点击左上角的下拉菜单在各视图模式之间进行切换。 

开发中最常用的是两个视图：

 （1）Android：一般开发时使用这 个视图，它帮助隐藏和折叠了一些 开发很少用到的文件和文件夹。 

（2）Project：与真实的文件管理器 中看到的文件和文件夹内容一致。

## 总体结构

* AndroidManifest.xml：用于设置 Android应用的各种配置参数。
* Java:程序员为Activity/Fragment所写的代 码放在java文件夹下的相应包文件夹中
* Android Studio使用Gradle构建项目， 这些文件中最重要的就是项目与模块所 关联的build.gradle文件。

## 控件

整个App界面是一个Activity， 其中包容有其他UI控件

一个Activity代表一个单独的用户可见的界面，由各种可视化控件所构成。

### View

所有的Android控件都派生自View

### ViewGroup

能够包容其他Android控件的控件，称为“容器” 控件，派生自ViewGroup

### Layout

一种特殊的“容器”控件， 本身不可见，其职责是排 列它所包容的控件。



 App中的UI界面与功能代码是分离的

Kotlin/Java代码 （.java/.kt），完成 交互和数据处理功能。

布局文件（.xml）确定 Activity的界面呈现

## 步骤

* 使用xml定义UI布局文件，其中需要通过代码访问的控件需要给 定一个Id。
* .在onCreate()方法中setContentView(布局文件），指定Activity使用 此特定的界面布局。
* 使用findViewById()方法获取特定控件的引用
* 调整控件的属性、给其特定事件添加响应代码

> 消除findViewById:
>
> 视图绑定 （View Binding）
>
> 数据绑定库 （Data Binding  Library）

## Log类

当Android App运行时，可以使用Log类，在Logcat面板输出信息

1. Log.v(String tag, String msg)；（VERBOSE）
2. Log.d(String tag, String msg)；（DEBUG）
3. Log.i(String tag, String msg)；（INFO）
4. Log.w(String tag, String msg)；（WARN）
5. Log.e(String tag, String msg)；（ERROR）

### compared with Timber

它会自动检测它所处的类，使用类名作为TAG，从而省去了自定 义TAG的麻烦，但在需要时你也可以人工指定TAG名称。 

当使用Release模式发布App时，它会自动地Disable掉，无需 人工处理。

## 显示信息

### Toast

```java
Toast.makeText(Context对象, "要显示的信息",Toast.LENGTH_LONG).show()
```

> 有许多的Android函数都需要有一个Context对象作为参数。 
>
> 使用Context对象，你就可以获取Android操作系统的当前状态信息，访问到Android操作系统的各种组件，调用它的服务。
>
> Android应用中常见的界面组件——Activity和Fragment（后 面课程介绍），都派生自Context类，所以，它们都可以看成是一个Context对象。当你在编程中发现某个方法需要有一个 Context对象时，直接将一个Activity或Fragment对象的引用传给它就好了，也可以通过“控件变量名.context”得到一 个Context对象。

### 对话框

Dialog

## 图片

Android项目的drawable文件夹用于保存App中用到的图片或图标。可以从网上找到各种图片（.jpg或.png），直接将其复制到此文件夹中，即可供App所使用。

复制到drawable文件夹下的图片，拥有一 个（资源）标识值，其格式为： 放在drawable中的图片文件，其名字中不要有汉字或空格等字 符，应该采用全英文小写字母作为文件名。 

R.drawable.图片文件名

Android Studio中可以创建 两种类型的图片资源，一种 称为“Image Asset”，是 基于像素的位图，另一种是 “Vector Asset”，是一种 矢量图形。

* 位图图形即常见的“数码相 片”，扩展名通常为“.jpg” 或“.png”，当放大到一定程度时，可以明显地看到其中的像素色块。

* 矢量图形是使用数学方式描述的，可以随意地放大和缩小，清晰度不会改变，在 Android中，这种图像资源的扩展名为".xml"

## 菜单

* 在res/menu中编写菜单资源文件

* 在Activity中重写**onCreateOptionsMenu** 和**onOptionsItemSelected**两个方法

### context menu

调用registerForContextMenu()方 法为某个view注册上下文菜单，其参 数就是那个长按弹出上下文菜单的控 件，此方法一般在onCreate里面调用

## 用户输入

EditText是Android App中让用户输入信息 的主要控件之一。

为了规范用户的输入信息， EditText提供 了InputType属性，用于过滤掉不合法的输 入字符，只有符合输入类型要求的字符，才 允许接收并显示出来。

可以给EditText提供一个实现了TextWatcher接口的对象，在里面写代码实现特定的监控功能。

## 布局

使用XML定义App界面并非唯一的方式，可以使用代码完成相同的功能：

事实上，用XML定义的界面，最后也是要转换为代码来实现布局的

> 实际开发中，应该使用XML为设计UI的主要方式，代码作为辅助手段。 但现在Google正在研发一种称为Compose的技术，完全使用kotlin取代 XML来定义界面，非常值得关注，它很可能代表了技术的发展方向

![image-20220415103836954](C:\Users\dyhes\AppData\Roaming\Typora\typora-user-images\image-20220415103836954.png)

### ViewGroup

View有一个特殊的子类，称为ViewGroup。ViewGroup提供了**对其子组件的管理功能**，包括布局、动画等。ViewGroup的子组件可以是View也可以是ViewGroup。常用的布局控件（比如LinearLayout）都是ViewGroup的子类。

### Box Model

• View支持padding，但是不支持margin。

• ViewGroup支持padding和margin

Android控件所占的具体位置，是由其父控件（主要就是布局控件）通过layout_width和layout_height等相关布局属性在App运行时“动态” 计算出来的，上述两个属性可以取的值有三种：

* 固定值：比如100dp
* wrap_content：数值依控件所显示的具体内容而定
* match_parent：与其父控件的数值相匹配（一致）

### 度量

采用设备无关的像素（dp：Density-independent Pixel），能够让图像在不同分辨率的屏幕上都显示出一样的大小。

布局通常使用dp作为单位，而字体尺寸则使用sp（Scalable pixels） 作为单位，这两者基本上是一样的，只不过sp会保留用户的设置（比如 用户可以选择使用大字体来显示App上的文本）

### 颜色

Android系统有12种已经定义好的颜色，具体的类型定义在Color类中。

```java
textView.setTextColor(Color.RED)
```

在布局文件中设置颜色需要在色值前面加“#”，如 android:textColor="#000000"。 也可以通过Color.rgb(int red, int green, int blue) 和Color.argb(int alpha, int red, int green, int blue)这两种方法指定颜色，后者可以同时指定“透明度”。 在代码中设置颜色可以直接填八位的十六进制数值，如 setTextColor(0xff00ff000)

##### colors.xml

res/values目录下有个colors.xml文件，可用于定义颜色常量。

* 如果要在布局、样式等XML文件中使用颜色常量，可以使用“@color/ 颜色常量名”的方式
* 如果要在代码中使用XML颜色常量，在Activity中可通过这行代码获取： getResources().getColor(R.color.颜色常量名)。

### 布局控件

早期的Andorid提供了很多种布局控件， 不少都被废弃了，就当前的学习者来 说，只需要掌握**LinearLayout、 FrameLayout、ConstraintLayout** 这三种控件就足以应付大多数Android 应用开发场景

* **LinearLayout**:

  LinearLayout是一种Android中最常 用的布局，它将自己包含的子元素按 照一个特定的方向进行排列。

  排列方向有两种：水平和垂直

* **FrameLayout**:

  所有的子控件都被放置在FrameLayout区域最左上 的区域。而且无法为这些控件指定一个精确的位置， 但可以通过layout_gravity指定放置区域。

  如果一个FrameLayout里边有多个子控件，不做任 何调整的话，那么后边的子控件的显示会重叠在前一个控件上。

* **ConstraintLayout**:

  Very important

扁平的控件层次结构优于多层 的控件层次结构。

因此，为了能提升Android应用界面的绘制速度，现在推荐使用 “扁平化”的ConstraintLayout来设计那些比较复杂的原先必须 使用“多层嵌套”才能实现的用户界面。

##### layout_gravity和gravity

layout_gravity设定该控件与上级 级控件的对齐方式，而gravity设定 布局内部子控件对齐与排列方式。

使用layout_gravity，通常 要求控件的尺寸是 "wrap_content"，而要使用 gravity，控件的尺寸通常 是"match_parent"

##### weightSum和layout_weight

“指定所有子控件weight 之和”。 • 子控件的layout_weight值设定其在 weightSum中所占的份额。

也可以不指定weightSum，直接按照子 控件的layout_weight值“协商”瓜分 可用的空间，值大的，占据更大的空间。

## ConstraintLayout

在build.gradle中添加以下依赖：

```gradle
dependencies {
implementation 'androidx.constraintlayout:constraintlayout:2.1.3' 
}
```

Android内置的控件，比如TextView，可以直接在XML中使用其 类名。另外，其属性名前通常有“android:”前缀，表明它是 系统内置的控件，随着用户手机操作系统而一同安装，App可以 直接使用它们。

ConstraintLayout是一个外部库（library）控件，并不是 Android的有机组成部分。它本身必须被打包到Apk中，与应用一起 安装。它的属性以app:开头

## Activity生命周期

状态：

* Initialized

* Created
* Started
* Resumed
* Destroyed

在Android 中，Activity 的生命周期交给操作系统统一管理。

在android.app.Activity 类中，Android 定义了一系列与生命周期相 关的方法，这些方法将被系统在合适的时机回调，我们可以根据 需要“覆盖（或重写，override）”特定的方法。

```java
public class Activity {
protected void onCreate(Bundle savedInstanceState);
protected void onStart();
protected void onResume();
protected void onPause();
protected void onStop();
protected void onDestroy();
}
```

![image-20220415145259260](C:\Users\dyhes\AppData\Roaming\Typora\typora-user-images\image-20220415145259260.png)



调用Activity的finish()方法可以通知Android销毁Activity对 象并将它从Back Stack（回退堆栈）中移除，这时，onDestory() 方法会被调用，可以在此方法中“清理必要的资源”

### 创建activity

* 为新Activity创建一个布局文件，设计好其布局。
* 在App的清单文件中注册这个Activity。
* 创建一个Intent实例，调用startActivity(intent)方法，即可启动并显示这个Activity。
* 创建一个Activity类，并且在Activity的onCreate()方法中将布局文件与Activity关联起来

### activity信息交流

* Intent提供了putExtra()系列 方法将信息放到Bundle中
* 可以使用getXXExtra()系列 方法取出信息

如果是离散的基础数据类型（比如Int和String）信息，直接调用putXXX系 列方法存入

如果是一个对象，需要进行特殊的处理，让其实现Parcelable接口，并 附加@Parcelize注解



随着技术的不断演进，特别是Android Jetpack相关组件的推出，现在更推荐 采用“单Activity多Fragment”的方式

## Back Stack

用户使用App的过程可以看成是多个Activity顺序显示 的过程，用户可以随时使用“Back”键回退回前一 个Activity。但这里有一个问题，那就是Android有可 能会销毁掉不在前台的Activity，所以，Android引入 了一个Task的机制解决这个问题。Activity可以被销 毁，但它的相关信息仍然放在Task中，依据这些信息 Android就可以重新创建并显示“前一个”Activity。

* 位于Task栈顶的Activity称为“前台Activity”，用户可以看到它，并且能与它交互。
* 其余的Activity称为“后台Activity”，用户看不到它，只有它上面的Activity被移除之后，它成为栈顶，才能被用户看到。

由于用户影响Task栈的最常见也是最主要的方式是使用手机的“Back”按键，所以，Task栈通常被称为“回退堆栈（Back Stack）”或“返回栈”。
当系统资源紧张时，Android可以销毁掉一些“后台Activity

### Task

Android操作系统允许用户打开多个App，每个打开的App都对应着一个Task。

* 当前正在与用户交互的App所对应着的Task，称为“前台Task”

* 其他的App对应的Task，称为“后台Task”

### activity启动模式

```xml
<activity android:name=".MainActivity"
android:launchMode="standard"/>
```

* standard：这是默认模式，每次激活Activity时都会创建Activity实例，并放入Back Stack中。
* singleTop：如果在栈顶已有一个实例，则重用此实例，并调用此实例的onNewIntent 方法。否则，创建新的实例并放入栈顶（即使栈中已经存在该Activity的实例，只要不在栈顶，都会创建实例）
* singleTask: 这种模式的Activity在一个Task中只能有一个实例存在。当需要启 动一个SingleTask模式的Activity时，如果所有前台后台Task中都没 有它的实例，系统就会创建它并将它压入当前Task的堆栈中。如果另外的Task中已存在该Activity 的实例，则系 统会通过调用这一Activity的 onNewIntent() 方法将 intent 转送给它，而不是创建新实例
* singleInstance：在一个新栈中创建实例，并让多个应用共享该实例。一 旦该模式的Activity的实例已经存在，任何应用在激活该Activity时，都会重 用该栈中的实例（并会自动调用其onNewIntent 方法）。

## Intent

Android平台采用“松散协同配合”的理念进行设计，淡化了进程的概念。
Android应用可以使用多个不同来源的可重用组件以聚合的方式构建（比如在你的应用中直接集成Android系统提供的拍照程序完成照像功能）。

为了让这些组件能相互沟通和协作，Android引入了“Intent”这一特殊的组件当作“信使”，完成组件间相互通信的工作。

![image-20220415155533031](C:\Users\dyhes\AppData\Roaming\Typora\typora-user-images\image-20220415155533031.png)

### Intent Filter

每个Activity都可以指定一个或多个Intent Filter，以便告诉系统该 Activity 可以响应什么类型的Intent

### 类型

* **显式（Explicit）Intent**

  直接启动特定的Activtity，只需要两个参数：context和要启动的Activity的类型，通常用于在同一个App内切换显示Activity

* **隐式（implicit）Intent**

  告诉Android“你想干什么”，由Android帮助你筛选启动特定的Activtity，至少需要两个参数：一个是Action，另一个是Data URI，还可以附加有其他的参数（比如Category，Extra等）

## Fragment

将复杂的Activity进行分解，使Android App应用更为模块化。

可使用代码方便地进行控制，因此可以构建出高度灵活的UI。
它是许多其它Android技术的基础，比如一些控件（ViewPages）就使用Fragment作为其界面元素，Jetpack架构组件（比如导航）也是以Fragment作为基本构建单元的。

Fragment由两部分组成：一个是布局文件，另一个是派生 自Fragment的自定义类，至少要重写onCreateView方法。

#### 规范

Fragment类名称通常采用驼峰命名法，以“Fragment”结束： 例如：SignInFragment 

相应的XML文件应该遵守以下命名规范： fragment_<FRAGMENT_NAME>.xml例如：fragment_sign_in.xml

### 状态

Resumed：处于可见状态，能接收用户响应

Started：处于可见状态，但不能接收用户响应

Created：处于不可见状态

![image-20220415162002907](C:\Users\dyhes\AppData\Roaming\Typora\typora-user-images\image-20220415162002907.png)

### 信息交流

- **from Activity**

  * **直接（不推荐）**

    Activity可以通过FragmentManager的findFragmentByTag等方法获取 特定Fragment对象的引用，然后直接访问Fragment类所定义的公有属性或 方法，即可向这一Fragment对象传送特定的信息。

  * **Arguments实现（推荐）**

    为了解决Activity向Fragment传送信息比较麻烦且易出错的问题， Android为Fragment提供了一个名为arguments的Bundle对象，使用它 来传送信息，就不会出错。

  * 工厂方法

* **to Activity**

  1. 定义一个专用接口，此接口中所定义方法的参数代表Fragment需要传给Activity的信息；

  2. 在Fragment内部定义一个类型为这个接口的属性；
  3. Activity实现这个接口，并在App运行创建Fragment时，将自身引用传给Fragment；
  4. Fragment在适合的时机，回调Activity实现的接口方法。

* 与Fragment



## Jetpack

### 构成

* 基础组件
* 架构组件
* 行为组件
* 界面组件

![image-20220415163749383](C:\Users\dyhes\AppData\Roaming\Typora\typora-user-images\image-20220415163749383.png)

由于Android Jetpack提供了现成的ViewModel、DataBinding等组件， 所以，MVVM就成为了推荐的Android App UI层设计模式

![image-20220415164658083](C:\Users\dyhes\AppData\Roaming\Typora\typora-user-images\image-20220415164658083.png)

## Lifecycles

![image-20220415165548612](C:\Users\dyhes\AppData\Roaming\Typora\typora-user-images\image-20220415165548612.png)

## ViewModel

ViewModel是一个类，它包容那 些Activity/Fragment需要显示 的数据

## 架构

![image-20220415173711644](C:\Users\dyhes\AppData\Roaming\Typora\typora-user-images\image-20220415173711644.png)

## ViewPage

ViewPage主要用于实现界面的切换

## 进程与线程



郑乐祺：注册/登录

李赛伽：校园论坛+学生事务

余力：校园监测

林宏鹏：主页+教务管理

