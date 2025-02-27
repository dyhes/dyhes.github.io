---
title: 【OpenHarmony】Basics
date: 2025-01-13 00:00:00+0000
categories: 
    - nutrition
tags:
    - HarmonyOS
---
## Introduction<!-- {"fold":true} -->
我们对应用框架、应用服务、系统、媒体、图形等领域的重点开放能力提供了开发指导，助力开发者快速完成应用的开发。
* 应用框架相关Kit开放能力：Ability Kit（程序框架服务）、ArkUI（方舟UI框架）等。
* 应用服务相关Kit开放能力：Calendar Kit（日历服务）、Location Kit（位置服务）等。
* 系统相关Kit开放能力：Network Kit（网络服务）、Universal Keystore Kit（密钥管理服务）等。
* 媒体相关Kit开放能力：Audio Kit（音频服务）、Media Library Kit（媒体文件管理服务）等。
* 图形相关Kit开放能力：ArkGraphics 2D（方舟2D图形服务）等。
### UI 框架
OpenHarmony提供了一套UI开发框架，即**方舟开发框架（ArkUI框架）**。方舟开发框架可为开发者提供应用UI开发所必需的能力，比如多种组件、布局计算、动画能力、UI交互、绘制等。
方舟开发框架针对不同目的和技术背景的开发者提供了两种开发范式，分别是基于ArkTS的声明式开发范式（简称“声明式开发范式”）和兼容JS的类Web开发范式（简称“类Web开发范式”）。以下是两种开发范式的简单对比。
| **开发范式名称** | **语言生态** | **UI更新方式** | **适用场景** | **适用人群** |
|---|---|---|---|---|
| 声明式开发范式 | ArkTS语言 | 数据驱动更新 | 复杂度较大、团队合作度较高的程序 | 移动系统应用开发人员、系统应用开发人员 |
| 类Web开发范式 | JS语言 | 数据驱动更新 | 界面较为简单的程序应用和卡片 | Web前端开发人员 |
### 应用模型
应用模型是OpenHarmony为开发者提供的应用程序所需能力的抽象提炼，它提供了应用程序必备的**组件和运行机制**。有了应用模型，开发者可以基于一套统一的模型进行应用开发，使应用开发更简单、高效。请见[应用模型的构成要素](https://docs.openharmony.cn/pages/v5.0/zh-cn/application-dev/application-models/application-models.md#%E5%BA%94%E7%94%A8%E6%A8%A1%E5%9E%8B%E7%9A%84%E6%9E%84%E6%88%90%E8%A6%81%E7%B4%A0)。
随着系统的演进发展，OpenHarmony先后提供了两种应用模型：
* **Stage模型：** OpenHarmony API 9开始新增的模型，是目前主推且会长期演进的模型。在该模型中，由于提供了AbilityStage、WindowStage等类作为应用组件和Window窗口的“舞台”，因此称这种应用模型为Stage模型。Stage模型开发可见[Stage模型开发概述](https://docs.openharmony.cn/pages/v5.0/zh-cn/application-dev/application-models/stage-model-development-overview.md)。**快速入门以此为例提供开发指导。**
* **FA（Feature Ability）模型：** OpenHarmony API 7开始支持的模型，已经不再主推。FA模型开发可见[FA模型开发概述](https://docs.openharmony.cn/pages/v5.0/zh-cn/application-dev/application-models/fa-model-development-overview.md)。**快速入门章节不再对此展开提供开发指导。**
⠀FA模型和Stage模型的整体架构和设计思想等更多区别，请见[应用模型解读](https://docs.openharmony.cn/pages/v5.0/zh-cn/application-dev/application-models/application-models.md)。
快速入门提供了一个含有两个页面的开发实例，并基于Stage模型构建第一个ArkTS应用，以便开发者理解以上基本概念及应用开发流程。
### ArkTS工程目录结构（Stage模型）
* **AppScope > app.json5**：应用的全局配置信息，详见[app.json5配置文件](https://docs.openharmony.cn/pages/v5.0/zh-cn/application-dev/quick-start/app-configuration-file.md)。
* **entry**：OpenHarmony工程模块，编译构建生成一个HAP包。
  * **src > main > ets**：用于存放ArkTS源码。
  * **src > main > ets > entryability**：应用/服务的入口。
  * **src > main > ets > pages**：应用/服务包含的页面。
  * **src > main > resources**：用于存放应用/服务所用到的资源文件，如图形、多媒体、字符串、布局文件等。关于资源文件，详见[资源文件的分类](https://docs.openharmony.cn/pages/v5.0/zh-cn/application-dev/quick-start/resource-categories-and-access.md#%E8%B5%84%E6%BA%90%E5%88%86%E7%B1%BB)。
  * **src > main > module.json5**：模块配置文件。主要包含HAP包的配置信息、应用/服务在具体设备上的配置信息以及应用/服务的全局配置信息。具体的配置文件说明，详见[module.json5配置文件](https://docs.openharmony.cn/pages/v5.0/zh-cn/application-dev/quick-start/module-configuration-file.md)。
  * **build-profile.json5**：当前的模块信息 、编译信息配置项，包括buildOption、targets配置等。
  * **hvigorfile.ts**：模块级编译构建任务脚本，开发者可以自定义相关任务和代码实现。
  * **obfuscation-rules.txt**：混淆规则文件。混淆开启后，在使用Release模式进行编译时，会对代码进行编译、混淆及压缩处理，保护代码资产。
* **oh_modules**：用于存放三方库依赖信息。
* **build-profile.json5**：应用级配置信息，包括签名signingConfigs、产品配置products等。
* **hvigorfile.ts**：应用级编译构建任务脚本。










## 应用程序包
用户应用程序泛指运行在设备的操作系统之上，为用户提供特定服务的程序，简称“应用”。一个应用所对应的软件包文件，称为“应用程序包”。
当前系统提供了应用程序包开发、安装、查询、更新、卸载的管理机制，便于开发者开发和管理应用。同时，系统还屏蔽了不同的芯片平台的差异（包括x86/ARM，32位/64位等），应用程序包在不同的芯片平台都能够安装运行，这使得开发者可以聚焦于应用的功能实现。
### Multi Module
* **支持模块化开发：** 一个应用通常会包含多种功能，将不同的功能特性按模块来划分和管理是一种良好的设计方式。在开发过程中，我们可以将每个功能模块作为一个独立的Module进行开发，Module中可以包含源代码、资源文件、第三方库、配置文件等，每一个Module可以独立编译，实现特定的功能。这种模块化、松耦合的应用管理方式有助于应用的开发、维护与扩展。
* **支持多设备适配：** 一个应用往往需要适配多种设备类型，在采用多Module设计的应用中，每个Module都会标注所支持的设备类型。有些Module支持全部类型的设备，有些Module只支持某一种或几种类型的设备（比如平板），那么在应用市场分发应用包时，也能够根据设备类型做精准的筛选和匹配，从而将不同的包合理的组合和部署到对应的设备上。
### Module Type
Module按照使用场景可以分为两种类型：
* **Ability类型的Module：** 用于实现应用的功能和特性。每一个Ability类型的Module编译后，会生成一个以.hap为后缀的文件，我们称其为HAP（Harmony Ability Package）包。HAP包可以独立安装和运行，是应用安装的基本单位，一个应用中可以包含一个或多个HAP包，具体包含如下两种类型。
  * entry类型的Module：应用的主模块，包含应用的入口界面、入口图标和主功能特性，编译后生成entry类型的HAP。每一个应用分发到同一类型的设备上的应用程序包，只能包含唯一一个entry类型的HAP。
  * feature类型的Module：应用的动态特性模块，编译后生成feature类型的HAP。一个应用中可以包含一个或多个feature类型的HAP，也可以不包含。
* **Library类型的Module：** 用于实现代码和资源的共享。同一个Library类型的Module可以被其他的Module多次引用，合理地使用该类型的Module，能够降低开发和维护成本。Library类型的Module分为Static和Shared两种类型，编译后会生成共享包。
  * Static Library：静态共享库。编译后会生成一个以.har为后缀的文件，即静态共享包HAR（Harmony Archive）。
  * Shared Library：动态共享库。编译后会生成一个以.hsp为后缀的文件，即动态共享包HSP（Harmony Shared Package）。
> **说明：**实际上，Shared Library编译后除了会生成一个.hsp文件，还会生成一个.har文件。这个.har文件中包含了HSP对外导出的接口，应用中的其他模块需要通过.har文件来引用HSP的功能。为了表述方便，我们通常认为Shared Library编译后生成HSP。
HAR与HSP两种共享包的主要区别体现在：
| **共享包类型** | **编译和运行方式** | **发布和引用方式** |
|---|---|---|
| HAR | HAR中的代码和资源跟随使用方编译，如果有多个使用方，它们的编译产物中会存在多份相同拷贝。<br>注意：[编译HAR](https://docs.openharmony.cn/pages/v5.0/zh-cn/application-dev/quick-start/har-package.md#%E7%BC%96%E8%AF%91)时，建议开启混淆能力，保护代码资产。 | HAR除了支持应用内引用，还可以独立打包发布，供其他应用引用。 |
| HSP | HSP中的代码和资源可以独立编译，运行时在一个进程中代码也只会存在一份。 | HSP一般随应用进行打包，当前支持应用内和[集成态HSP](https://docs.openharmony.cn/pages/v5.0/zh-cn/application-dev/quick-start/integrated-hsp.md)。应用内HSP只支持应用内引用，集成态HSP支持发布到ohpm私仓和跨应用引用。 |
![](OpenHarmony/in-app-hsp-har.png)
### ⠀Stage模型包结构
分别对开发态、编译态、发布态的应用程序结构展开介绍。
#### 开发态
工程结构主要包含的文件类型及用途如下：
> **说明：**
> * AppScope目录由DevEco Studio自动生成，不可更改。
> * Module目录名称可以由DevEco Studio自动生成（比如entry、library等），也可以自定义。为了便于说明，下表中统一采用Module_name表示。
| **文件类型** | **说明** |
|---|---|
| 配置文件 | 包括应用级配置信息、以及Module级配置信息：<br>- **AppScope > app.json5**：[app.json5配置文件](https://docs.openharmony.cn/pages/v5.0/zh-cn/application-dev/quick-start/app-configuration-file.md)，用于声明应用的全局配置信息，比如应用Bundle名称、应用名称、应用图标、应用版本号等。<br>- **Module_name > src > main > module.json5**：[module.json5配置文件](https://docs.openharmony.cn/pages/v5.0/zh-cn/application-dev/quick-start/module-configuration-file.md)，用于声明Module基本信息、支持的设备类型、所含的组件信息、运行所需申请的权限等。 |
| ArkTS源码文件 | **Module_name > src > main > ets**：用于存放Module的ArkTS源码文件（.ets文件）。 |
| 资源文件 | 包括应用级资源文件、以及Module级资源文件，支持图形、多媒体、字符串、布局文件等，详见[资源分类与访问](https://docs.openharmony.cn/pages/v5.0/zh-cn/application-dev/quick-start/resource-categories-and-access.md)。<br>- **AppScope > resources** ：用于存放应用需要用到的资源文件。<br>- **Module_name > src > main > resources** ：用于存放该Module需要用到的资源文件。 |
| 其他配置文件 | 用于编译构建，包括构建配置文件、编译构建任务脚本、混淆规则文件、依赖的共享包信息等。<br>- **build-profile.json5**：工程级或Module级的构建配置文件，包括应用签名、产品配置等。<br>- **hvigorfile.ts**：应用级或Module级的编译构建任务脚本，开发者可以自定义编译构建工具版本、控制构建行为的配置参数。<br>- **obfuscation-rules.txt**：混淆规则文件。混淆开启后，在使用Release模式进行编译时，会对代码进行编译、混淆及压缩处理，保护代码资产。<br>- **oh-package.json5**：用于存放依赖库的信息，包括所依赖的三方库和共享包。 |
#### 编译态
![](OpenHarmony/image.png)
从开发态到编译态，Module中的文件会发生如下变更：
* **ets目录**：ArkTS源码编译生成.abc文件。
* **resources目录**：AppScope目录下的资源文件会**合入**到Module下面资源目录中，如果两个目录下存在重名文件，编译打包后只会保留AppScope目录下的资源文件。
* **module配置文件**：AppScope目录下的app.json5文件字段会**合入**到Module下面的module.json5文件之中，编译后生成HAP或HSP最终的module.json文件。
⠀**说明：**
在编译HAP和HSP时，会把他们所依赖的HAR直接编译到HAP和HSP中。
#### 发布态
每个应用中至少包含一个.hap文件，可能包含若干个.hsp文件、也可能不含，一个应用中的所有.hap与.hsp文件合在一起称为**Bundle**，其对应的bundleName是应用的唯一标识（详见[app.json5配置文件](https://docs.openharmony.cn/pages/v5.0/zh-cn/application-dev/quick-start/app-configuration-file.md)中的bundleName标签）。
当应用发布上架到应用市场时，需要将Bundle打包为一个.app后缀的文件用于上架，这个.app文件称为**App Pack**（Application Package），与此同时，DevEco Studio工具自动会生成一个**pack.info**文件。**pack.info**文件描述了App Pack中每个HAP和HSP的属性，包含APP中的bundleName和versionCode信息、以及Module中的name、type和abilities等信息。
> **说明：**
> * App Pack是发布上架到应用市场的基本单元，但是不能在设备上直接安装和运行。
> * 在应用签名、云端分发、端侧安装时，都是以HAP/HSP为单位进行签名、分发和安装的。
![](OpenHarmony/image%202.png)
#### 包选择
| **Module类型** | **包类型** | **说明** |
|---|---|---|
| Ability | [HAP](https://docs.openharmony.cn/pages/v5.0/zh-cn/application-dev/quick-start/hap-package.md) | 应用的功能模块，可以独立安装和运行，必须包含一个entry类型的HAP，可选包含一个或多个feature类型的HAP。 |
| Static Library | [HAR](https://docs.openharmony.cn/pages/v5.0/zh-cn/application-dev/quick-start/har-package.md) | 静态共享包，编译态复用。<br>- 支持应用内共享，也可以发布后供其他应用使用。<br>  - 作为二方库，发布到[OHPM私仓](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/ide-ohpm-repo-V5)，供公司内部其他应用使用。<br>  - 作为三方库，发布到[OHPM中心仓](https://ohpm.openharmony.cn/)，供其他应用使用。<br>- 多包（HAP/HSP）引用相同的HAR时，会造成多包间代码和资源的重复拷贝，从而导致应用包膨大。<br>- 注意：[编译HAR](https://docs.openharmony.cn/pages/v5.0/zh-cn/application-dev/quick-start/har-package.md#%E7%BC%96%E8%AF%91)时，建议开启混淆能力，保护代码资产。 |
| Shared Library | [HSP](https://docs.openharmony.cn/pages/v5.0/zh-cn/application-dev/quick-start/in-app-hsp.md) | 动态共享包，运行时复用。<br>- 当多包（HAP/HSP）同时引用同一个共享包时，采用HSP替代HAR，可以避免HAR造成的多包间代码和资源的重复拷贝，从而减小应用包大小。 |

| **规格** | **HAP** | **HAR** | **HSP** |
|---|---|---|---|
| 支持在配置文件中声明[UIAbility](https://docs.openharmony.cn/pages/v5.0/zh-cn/application-dev/application-models/uiability-overview.md)组件与[ExtensionAbility](https://docs.openharmony.cn/pages/v5.0/zh-cn/application-dev/application-models/extensionability-overview.md)组件 | √ | × | × |
| 支持在配置文件中声明[pages](https://docs.openharmony.cn/pages/v5.0/zh-cn/application-dev/quick-start/module-configuration-file.md#pages%E6%A0%87%E7%AD%BE)页面 | √ | × | √ |
| 支持在设备上独立安装运行 | √ | × | × |

> **说明：**
> * HAR虽然不支持在配置文件中声明pages页面，但是可以包含pages页面，并通过[命名路由](https://docs.openharmony.cn/pages/v5.0/zh-cn/application-dev/ui/arkts-routing.md#%E5%91%BD%E5%90%8D%E8%B7%AF%E7%94%B1)的方式进行跳转。
> * 由于**HSP仅支持应用内共享**，如果HAR依赖了HSP，则该HAR文件仅支持应用内共享，不支持发布到二方仓或三方仓供其他应用使用，否则会导致编译失败。
> * HAR和HSP均不支持循环依赖，也不支持依赖传递。

### HAP
HAP（Harmony Ability Package）是应用安装和运行的基本单元。HAP包是由代码、资源、第三方库、配置文件等打包生成的模块包，其主要分为两种类型：entry和feature。
* entry：应用的主模块，作为应用的入口，提供了应用的基础功能。
* feature：应用的动态特性模块，作为应用能力的扩展，可以根据用户的需求和设备类型进行选择性安装。
⠀应用程序包可以只包含一个基础的entry包，也可以包含一个基础的entry包和多个功能性的feature包。
#### 使用场景
* 单HAP场景：如果只包含UIAbility组件，无需使用ExtensionAbility组件，优先采用单HAP（即一个entry包）来实现应用开发。虽然一个HAP中可以包含一个或多个UIAbility组件，为了避免不必要的资源加载，推荐采用“一个UIAbility+多个页面”的方式。
* 多HAP场景：如果应用的功能比较复杂，需要使用ExtensionAbility组件，可以采用多HAP（即一个entry包+多个feature包）来实现应用开发，每个HAP中包含一个UIAbility组件或者一个ExtensionAbility组件。在这种场景下，可能会存在多个HAP引用相同的库文件，导致重复打包的问题。

#### ⠀约束限制
* 不支持导出接口和ArkUI组件，给其他模块使用。
* 多HAP场景下，App Pack包中同一设备类型的所有HAP中**必须有且只有一个Entry类型的HAP**，Feature类型的HAP可以有一个或者多个，也可以没有。
* 多HAP场景下，同一应用中的所有HAP的配置文件中的bundleName、versionCode、versionName、minCompatibleVersionCode、debug、minAPIVersion、targetAPIVersion、apiReleaseType相同，同一设备类型的所有HAP对应的moduleName标签必须**唯一**。HAP打包生成App Pack包时，会对上述参数配置进行校验。
* 多HAP场景下，同一应用的所有HAP、HSP的**签名证书要保持一致**。上架应用市场是以App Pack形式上架，应用市场分发时会将所有HAP从App Pack中拆分出来，同时对其中的所有HAP进行重签名，这样保证了所有HAP签名证书的一致性。在调试阶段，开发者通过命令行或DevEco Studio将HAP安装到设备上时，要保证所有HAP签名证书一致，否则会出现安装失败的问题。

## 应用配置文件
每个应用项目的代码目录下必须包含应用配置文件，这些配置文件会向编译工具、操作系统和应用市场提供应用的基本信息。
在基于Stage模型开发的应用项目代码下，都存在一个app.json5配置文件、以及一个或多个module.json5配置文件。
[app.json5配置文件](https://docs.openharmony.cn/pages/v5.0/zh-cn/application-dev/quick-start/app-configuration-file.md)主要包含以下内容：
* 应用的全局配置信息，包含应用的Bundle名称、开发厂商、版本号等基本信息。
* 特定设备类型的配置信息。

⠀[module.json5配置文件](https://docs.openharmony.cn/pages/v5.0/zh-cn/application-dev/quick-start/module-configuration-file.md)主要包含以下内容：
* Module的基本配置信息，包含Module名称、类型、描述、支持的设备类型等基本信息。
* [应用组件](https://docs.openharmony.cn/pages/v5.0/zh-cn/application-dev/application-models/stage-model-development-overview.md)信息，包含UIAbility组件和ExtensionAbility组件的描述信息。
* 应用运行过程中所需的权限信息。

### app.json5
https://docs.openharmony.cn/pages/v5.0/zh-cn/application-dev/quick-start/app-configuration-file.md

### module.json5

https://docs.openharmony.cn/pages/v5.0/zh-cn/application-dev/quick-start/module-configuration-file.md

## ArkTs
[OpenAtom OpenHarmony](https://docs.openharmony.cn/pages/v5.0/zh-cn/application-dev/quick-start/arkts-get-started.md)

## Supplement
### Module
在 **OpenHarmony** 中，**Module**（模块）是应用开发中的一个重要概念，用于组织和划分应用的功能单元。它是 OpenHarmony 应用的基本组成部分，每个模块可以独立开发、编译和部署，最终组合成一个完整的应用。
#### Module 的核心概念
1. **模块化设计**  
   - OpenHarmony 采用模块化设计，允许开发者将应用拆分为多个模块，每个模块负责特定的功能或业务逻辑。  
   - 这种设计提高了代码的可维护性和复用性，同时也支持动态加载和按需安装。
2. **模块类型**  
   - **Entry Module**（主模块）：应用的入口模块，包含应用的核心功能和资源，是应用安装和运行的起点。  
   - **Feature Module**（功能模块）：应用的扩展模块，包含特定的功能或业务逻辑，可以按需下载和安装，支持应用的动态扩展。
3. **模块结构**  
   每个模块通常包含以下内容：  
   - **代码文件**：包括 ArkTS、JavaScript、C/C++ 等代码，用于实现模块的功能。  
   - **资源文件**：包括图片、字符串、布局文件等，用于支持模块的 UI 和功能。  
   - **配置文件**：`module.json` 文件，定义了模块的元数据、依赖关系、Ability 信息等。
#### Module 的配置文件
每个模块都有一个 `module.json` 文件，用于描述模块的基本信息和配置。其主要内容包括：
- **模块名称**：模块的唯一标识符。  
- **模块类型**：指明模块是 Entry Module 还是 Feature Module。  
- **Ability 信息**：定义模块中包含的 Ability（功能单元），如 Page Ability 和 Service Ability。  
- **依赖关系**：声明模块依赖的其他模块或库。  
- **资源路径**：指定模块的资源文件存放位置。
示例 `module.json` 文件：
```json
{
  "module": {
    "name": "entry",
    "type": "entry",
    "abilities": [
      {
        "name": ".MainAbility",
        "icon": "$media:icon",
        "label": "$string:app_name",
        "launchType": "standard"
      }
    ],
    "dependencies": [
      {
        "bundleName": "com.example.feature",
        "moduleName": "feature"
      }
    ]
  }
}
```
#### Module 的开发与构建
1. **开发工具**  
   - 使用 **DevEco Studio** 开发工具，开发者可以创建和管理模块，编写代码和配置文件。  
2. **构建与打包**  
   - 每个模块可以独立编译和打包，生成对应的 HAP（HarmonyOS Ability Package）文件。  
   - 最终，多个模块的 HAP 文件组合成一个完整的应用。
3. **动态加载**  
   - Feature Module 支持动态加载，可以在应用运行时按需下载和安装，减少初始安装包的大小。
#### Module 的应用场景
1. **大型应用开发**  
   - 对于功能复杂的大型应用，可以将应用拆分为多个模块，由不同团队并行开发，提高开发效率。  
2. **动态功能扩展**  
   - 通过 Feature Module，可以实现应用的动态功能扩展，用户可以根据需要下载和安装特定功能。  
3. **代码复用**  
   - 将通用功能封装为独立的模块，可以在多个应用中复用，减少重复开发。
#### 总结
在 OpenHarmony 中，Module 是应用开发的基本单元，支持模块化设计和动态加载。通过将应用拆分为多个模块，开发者可以提高代码的可维护性、复用性和扩展性，同时为用户提供更灵活的应用体验。
### .json5
**JSON5** 是 JSON（JavaScript Object Notation）的扩展格式，旨在解决 JSON 格式的一些局限性，使其更易于人类阅读和编写。JSON5 在保留 JSON 简单性和兼容性的基础上，增加了一些灵活的语法特性。
#### JSON5 的主要改进
1. **支持注释**  <!-- {"fold":true} -->
   - JSON5 允许在数据中添加单行注释（`//`）和多行注释（`/* ... */`），方便开发者添加说明。  
   ```json5
   {
       // 这是一个单行注释
       "name": "JSON5",
       /* 这是一个
          多行注释 */
       "version": "1.0.0"
   }
   ```
2. **键名可以不加引号**  <!-- {"fold":true} -->
   - JSON5 允许键名不使用引号（前提是键名是有效的标识符），简化了书写。  
   ```json5
   {
       name: "JSON5",  // 键名不加引号
       version: "1.0.0"
   }
   ```
3. **支持尾随逗号**  <!-- {"fold":true} -->
   - JSON5 允许在对象和数组的最后一个元素后添加逗号，避免修改数据时频繁调整格式。  
   ```json5
   {
       "name": "JSON5",
       "version": "1.0.0",  // 尾随逗号
   }
   ```
4. **字符串支持多行和单引号**  <!-- {"fold":true} -->
   - JSON5 允许字符串使用单引号（`'`）和多行形式（用反引号或换行符），方便处理复杂文本。  
   ```json5
   {
       description: '这是一个使用单引号的字符串',
       multiLine: `这是一个
                   多行字符串`
   }
   ```
5. **数字支持更多格式**  <!-- {"fold":true} -->
   - JSON5 支持十六进制（`0x`）、浮点数（`.`）、正负号（`+`/`-`）以及特殊值（如`Infinity`和`NaN`）。  
   ```json5
   {
       hex: 0xFF,        // 十六进制
       float: 3.14,      // 浮点数
       positive: +100,   // 正数
       negative: -50,    // 负数
       infinity: Infinity, // 无穷大
       notANumber: NaN   // 非数字
   }
   ```
#### JSON5 的使用场景<!-- {"fold":true} -->
1. **配置文件**  
   - JSON5 的注释和灵活语法使其非常适合用于配置文件，开发者可以更清晰地描述配置项。  
2. **开发工具**  
   - 许多开发工具和框架支持 JSON5，例如 Babel、ESLint 等，方便开发者编写和维护配置。  
3. **数据交换**  
   - 虽然 JSON5 的灵活性更适合人类阅读，但在数据交换场景中，仍建议使用标准的 JSON 格式以确保兼容性。  
#### JSON5 的解析与生成<!-- {"fold":true} -->
1. **JavaScript 解析**  
   - 可以使用 `json5` 库来解析 JSON5 数据。  
   ```javascript
   const JSON5 = require('json5');
   const data = JSON5.parse('{name: "JSON5"}');
   console.log(data.name); // 输出: JSON5
   ```
2. **生成 JSON5**  
   - 可以使用 `json5` 库将 JavaScript 对象转换为 JSON5 字符串。  
   ```javascript
   const JSON5 = require('json5');
   const obj = {name: "JSON5", version: "1.0.0"};
   const json5Str = JSON5.stringify(obj);
   console.log(json5Str); // 输出: {name:"JSON5",version:"1.0.0"}
   ```
#### 总结<!-- {"fold":true} -->
JSON5 是 JSON 的扩展格式，通过支持注释、无引号键名、尾随逗号、多行字符串等特性，使其更易于人类阅读和编写。它非常适合用于配置文件和开发工具，但在数据交换场景中仍需注意兼容性问题。
### .so
`.so`文件是**共享对象文件**（Shared Object File）的缩写，是一种在Linux和类Unix系统（包括Android和HarmonyOS）中使用的动态链接库文件格式。它类似于Windows系统中的`.dll`文件（动态链接库），用于存储可被多个程序共享的代码和资源。
#### `.so`文件的核心特点
1. **动态链接**  
   - `.so`文件在程序运行时被加载，而不是在编译时静态链接到程序中。  
   - 这种机制可以减少程序的内存占用，并支持代码的复用和更新。  
2. **共享性**  
   - 多个程序可以同时使用同一个`.so`文件，避免重复加载相同的代码，节省系统资源。  
3. **平台依赖性**  
   - `.so`文件是平台相关的，通常针对特定的CPU架构（如ARM、x86）和操作系统编译，不能跨平台直接使用。  
#### `.so`文件的使用场景
1. **跨语言调用**  
   - 在HarmonyOS或Android中，`.so`文件通常用于实现C/C++代码与Java/ArkTS等高级语言之间的跨语言调用。  
   - 例如，通过JNI（Java Native Interface）或Node-API调用`.so`文件中的函数。  
2. **性能优化**  
   - 对于计算密集型任务（如图像处理、物理模拟等），使用C/C++编写的`.so`文件可以提供更高的性能。  
3. **复用已有代码**  
   - 开发者可以将已有的C/C++库编译为`.so`文件，在HarmonyOS或Android应用中复用，减少开发成本。  
#### `.so`文件的生成
1. **编译工具**  
   - 使用GCC、Clang等编译器，将C/C++代码编译为`.so`文件。  
   - 在HarmonyOS中，可以使用NDK（Native Development Kit）提供的工具链进行编译。  
2. **编译命令示例**  
   ```bash
   gcc -shared -o libexample.so example.c
   ```
   - `-shared`选项表示生成共享库文件。  
   - `-o`选项指定输出文件名。  
#### `.so`文件的加载与使用
1. **动态加载**  
   - 在程序运行时，可以通过`dlopen`函数动态加载`.so`文件，并通过`dlsym`函数获取其中的函数指针。  
2. **示例代码**  
   ```c
   #include <dlfcn.h>
   #include <stdio.h>
   
   int main() {
       void *handle = dlopen("./libexample.so", RTLD_LAZY);
       if (!handle) {
           fprintf(stderr, "%s\n", dlerror());
           return 1;
       }
   
       void (*func)() = dlsym(handle, "example_function");
       if (func) {
           func();
       }
   
       dlclose(handle);
       return 0;
   }
   ```
#### `.so`文件在HarmonyOS中的应用
在HarmonyOS中，`.so`文件通常用于：
- 实现高性能的底层功能（如图形渲染、音频处理）。  
- 支持跨语言调用（如ArkTS/JS与C/C++之间的交互）。  
- 复用已有的C/C++库，降低开发成本。  
#### 总结
`.so`文件是一种动态链接库文件，广泛用于Linux、Android和HarmonyOS等系统中。它支持代码的共享和动态加载，适用于跨语言调用、性能优化和代码复用等场景。在HarmonyOS开发中，`.so`文件是实现高性能和跨语言能力的重要工具。
### HAP
HAP（HarmonyOS Ability Package）是HarmonyOS应用的基本部署单元，类似于Android中的APK（Android Package）。它是HarmonyOS应用的安装包格式，包含了应用的所有资源、代码和配置文件，用于在HarmonyOS设备上安装和运行应用。
#### HAP包的核心组成
1. **Ability**  
   - Ability是HarmonyOS应用的基本组成单元，代表应用的一个功能模块。  
   - 分为两种类型：  
     - **Page Ability**：用于提供用户界面（UI）的Ability，类似于Android中的Activity。  
     - **Service Ability**：用于在后台执行任务的Ability，类似于Android中的Service。  
2. **资源文件**  
   - 包括图片、字符串、布局文件等，用于支持应用的UI和功能。  
   - 资源文件通常存放在`resources`目录下，支持多语言、多分辨率适配。  
3. **配置文件**  
   - `config.json`：应用的全局配置文件，定义了应用的包名、版本号、Ability信息、权限声明等。  
   - `module.json`：模块级配置文件，定义了模块的依赖关系、资源路径等。  
4. **代码文件**  
   - 包括ArkTS（HarmonyOS推荐的前端开发语言）、JavaScript、C/C++等代码文件，用于实现应用的逻辑功能。  
5. **库文件**  
   - 包括动态库（`.so`文件）和静态库（`.a`文件），用于支持应用的底层功能。  
#### HAP包的类型
1. **Entry HAP**  
   - 主模块包，包含应用的核心功能和资源，是应用安装和运行的入口。  
2. **Feature HAP**  
   - 功能模块包，包含应用的扩展功能，可以按需下载和安装，支持应用的动态扩展。  
#### HAP包的特点
1. **模块化设计**  
   - HAP包支持模块化开发，开发者可以将应用拆分为多个HAP包，实现功能的动态加载和按需安装。  
2. **分布式能力**  
   - HAP包支持HarmonyOS的分布式特性，可以在多个设备上无缝协同运行。  
3. **安全性**  
   - HAP包通过签名机制确保应用的完整性和安全性，防止篡改和恶意攻击。  
#### HAP包的生成与安装
1. **生成**  
   - 使用DevEco Studio开发工具，开发者可以编译和打包应用，生成HAP包。  
   - 打包过程中会自动处理资源压缩、代码混淆等优化操作。  
2. **安装**  
   - HAP包可以通过应用市场、ADB命令行或OTA方式安装到HarmonyOS设备上。  
   - 安装过程中会进行签名验证和权限检查，确保应用的安全性。  
#### 总结
HAP包是HarmonyOS应用的安装包格式，包含了应用的代码、资源和配置文件，支持模块化设计和分布式能力。通过HAP包，开发者可以高效地开发、部署和运行HarmonyOS应用，为用户提供无缝的智能体验。
## hvigor
**hvigor** 是 OpenHarmony 和 HarmonyOS 生态中的一种**构建工具**，专为 HarmonyOS 应用开发设计。它基于 Gradle 构建系统，但针对 HarmonyOS 的特点进行了优化和扩展，旨在提高开发效率和构建性能。
#### hvigor 的核心功能
1. **项目构建**  
   - hvigor 支持 HarmonyOS 应用的编译、打包和构建，生成 HAP（HarmonyOS Ability Package）文件。  
   - 它能够处理多模块项目的依赖关系，确保构建过程的正确性和高效性。
2. **任务管理**  
   - hvigor 提供了丰富的构建任务（如编译、打包、清理等），开发者可以通过命令行或 IDE（如 DevEco Studio）执行这些任务。  
   - 支持自定义任务，满足特定项目的构建需求。
3. **依赖管理**  
   - hvigor 支持对项目依赖的管理，包括本地依赖和远程依赖。  
   - 通过配置文件（如 `build-profile.json5`），开发者可以声明项目的依赖关系。
4. **插件支持**  
   - hvigor 支持插件机制，开发者可以通过插件扩展构建功能。  
   - HarmonyOS 提供了多种官方插件，如代码混淆插件、资源压缩插件等。
5. **性能优化**  
   - hvigor 针对 HarmonyOS 应用的构建过程进行了优化，减少了构建时间，提高了构建效率。  
   - 支持增量编译，只编译发生变化的代码和资源，进一步提升构建速度。
#### hvigor 的配置文件
hvigor 使用 JSON5 格式的配置文件来定义项目的构建规则和参数。主要配置文件包括：
1. **`build-profile.json5`**  
   - 定义项目的构建配置，如编译选项、依赖关系、插件配置等。  
   示例：
   ```json5
   {
     "app": {
       "signingConfigs": {
         "release": {
           "storeFile": "release.keystore",
           "storePassword": "password",
           "keyAlias": "key",
           "keyPassword": "password"
         }
       },
       "buildTypes": {
         "release": {
           "signingConfig": "release"
         }
       }
     }
   }
   ```
2. **`module.json5`**  
   - 定义模块的元数据和配置，如模块名称、Ability 信息、资源路径等。  
   示例：
   ```json5
   {
     "module": {
       "name": "entry",
       "type": "entry",
       "abilities": [
         {
           "name": ".MainAbility",
           "icon": "$media:icon",
           "label": "$string:app_name",
           "launchType": "standard"
         }
       ]
     }
   }
   ```
#### hvigor 的使用
1. **命令行使用**  
   - 开发者可以通过命令行执行 hvigor 任务，例如：  
     ```bash
     hvigor clean  # 清理构建目录
     hvigor build  # 构建项目
     ```
2. **集成到 DevEco Studio**  
   - DevEco Studio 内置了 hvigor 支持，开发者可以通过 IDE 的图形界面执行构建任务，查看构建日志和结果。
#### hvigor 的优势
1. **专为 HarmonyOS 优化**  
   - hvigor 针对 HarmonyOS 应用的构建需求进行了深度优化，提供了更好的性能和兼容性。
2. **简化构建流程**  
   - 通过配置文件和插件机制，hvigor 简化了构建流程，降低了开发者的学习成本。
3. **高效开发体验**  
   - 支持增量编译和任务并行执行，显著提升了开发效率。
#### 总结
hvigor 是 HarmonyOS 生态中的核心构建工具，基于 Gradle 构建系统并针对 HarmonyOS 进行了优化。它提供了高效的构建能力、灵活的配置选项和丰富的插件支持，帮助开发者快速构建和部署 HarmonyOS 应用。通过 hvigor，开发者可以更专注于应用功能的实现，而无需过多关注构建细节。