---
title: 【Shopee】Java Parser
date: 2025-08-18 00:00:00+0000
categories: [snow, willow]
tags: [Shopee]
---

## JavaParser 注解

要使用 `com.github.javaparser.JavaParser`解析特定注解（如 `@RestController`），需通过解析 Java 源代码的抽象语法树（AST）并遍历目标元素（类、方法、字段）的注解列表。以下是具体步骤和代码示例：

------

### **1. 基本解析流程**

#### **步骤概述**

1. **解析源代码**：将 Java 文件或字符串解析为 `CompilationUnit`（AST 的根节点）。
2. **定位目标元素**：遍历 AST 找到需要检查的类、方法或字段。
3. **检查注解**：遍历元素的注解列表，匹配目标注解的名称或参数。

#### **代码示例**

```
import com.github.javaparser.StaticJavaParser;
import com.github.javaparser.ast.CompilationUnit;
import com.github.javaparser.ast.body.ClassOrInterfaceDeclaration;
import java.io.File;

public class AnnotationParser {
    public static void main(String[] args) throws Exception {
        // 1. 解析Java文件
        CompilationUnit cu = StaticJavaParser.parse(new File("YourClass.java"));
        
        // 2. 遍历所有类声明
        cu.findAll(ClassOrInterfaceDeclaration.class).forEach(clazz -> {
            // 3. 检查类是否包含@RestController注解
            boolean hasRestController = clazz.getAnnotations().stream()
                .anyMatch(annotation -> 
                    annotation.getNameAsString().equals("RestController")
                );
            System.out.println("Class has @RestController: " + hasRestController);
        });
    }
}
```

------

### **2. 解析注解的细节**

#### **注解名称匹配**

- 注解名称需与源代码中的写法一致（如 `"RestController"`而非全限定名 `org.springframework.web.bind.annotation.RestController`）。若需处理全限定名，需检查注解的 `QualifiedName`。

#### **获取注解参数**

若注解带参数（如 `@RequestMapping("/path")`），可提取参数值：

```
clazz.getAnnotations().forEach(annotation -> {
    if (annotation.getNameAsString().equals("RequestMapping")) {
        annotation.ifSingleMemberValueExpr(expr -> {
            String path = expr.toString(); // 例如：获取 "/path"
            System.out.println("Path: " + path);
        });
    }
});
```

此处 `ifSingleMemberValueExpr`适用于单参数注解（如 `@RequestMapping`）。多参数注解需遍历键值对 。

#### **获取注解位置**

通过 `getRange()`获取注解在源代码中的行号：

```
annotation.getRange().ifPresent(range -> {
    int startLine = range.begin.line;
    System.out.println("Annotation at line: " + startLine);
});
```

------

### **3. 扩展应用场景**

#### **方法/字段级注解**

类似地，可检查方法或字段的注解：

```
cu.findAll(MethodDeclaration.class).forEach(method -> {
    boolean hasMapping = method.getAnnotations().stream()
        .anyMatch(anno -> anno.getNameAsString().equals("GetMapping"));
    System.out.println("Method has @GetMapping: " + hasMapping);
});
```

#### **依赖配置**

需在项目中添加 JavaParser 依赖（Maven）：

```
<dependency>
    <groupId>com.github.javaparser</groupId>
    <artifactId>javaparser-core</artifactId>
    <version>3.28.0</version>
</dependency>
```

------

### **4. 注意事项**

- **注解名称匹配**：需考虑导入语句（如 `import org.springframework.web.bind.annotation.*;`），否则需检查全限定名。
- **嵌套注解**：若注解嵌套在组合注解中（如 `@SpringBootApplication`包含 `@RestController`），需递归解析 。
- **参数类型处理**：注解参数可能是字符串、数组或枚举，需调用 `asStringLiteralExpr()`、`asArrayInitializerExpr()`等方法转换 。

通过上述方法，可灵活解析任意注解及其属性，适用于代码审计、文档生成等场景。

## Visitor

要将给定的JavaParser代码转换为访问者模式（Visitor Pattern）形式，需通过定义自定义访问者类来解耦AST遍历与注解检查逻辑。以下为重构后的代码及效率分析：

------

### **1. 重构为访问者模式**

#### **步骤说明**

1. **定义注解访问者类**

   继承`VoidVisitorAdapter`，重写`visit`方法处理特定节点（如类声明）的注解检查。

2. **解耦遍历与操作**

   将注解检查逻辑封装在访问者内部，避免在`main`方法中混合遍历与业务逻辑。

3. **优化遍历过程**

   通过访问者模式自动递归遍历AST，无需手动调用`findAll`。

#### **重构代码**

```
import com.github.javaparser.StaticJavaParser;
import com.github.javaparser.ast.CompilationUnit;
import com.github.javaparser.ast.body.ClassOrInterfaceDeclaration;
import com.github.javaparser.ast.visitor.VoidVisitorAdapter;
import java.io.File;

// 自定义访问者：检查@RestController注解
class RestControllerVisitor extends VoidVisitorAdapter<Void> {
    @Override
    public void visit(ClassOrInterfaceDeclaration clazz, Void arg) {
        super.visit(clazz, arg);
        boolean hasRestController = clazz.getAnnotations().stream()
            .anyMatch(anno -> anno.getNameAsString().equals("RestController"));
        System.out.println("Class " + clazz.getName() + " has @RestController: " + hasRestController);
    }
}

public class AnnotationParser {
    public static void main(String[] args) throws Exception {
        CompilationUnit cu = StaticJavaParser.parse(new File("YourClass.java"));
        // 使用访问者遍历AST
        RestControllerVisitor visitor = new RestControllerVisitor();
        visitor.visit(cu, null);
    }
}
```

#### **关键改进**

- **关注点分离**：注解检查逻辑独立封装在`RestControllerVisitor`中。
- **隐式递归遍历**：访问者自动处理AST的递归遍历，避免手动迭代。
- **扩展性**：新增操作（如方法/字段注解检查）只需添加新访问者，无需修改原有代码。

------

### **2. 访问者模式的效率分析**

#### **优势场景**

1. **复杂操作优化**

   - 当需对AST进行**多种操作**（如同时检查注解、统计方法数）时，访问者模式避免重复遍历，效率更高。
   - 例如：在单次遍历中，多个访问者可协同处理不同任务（通过`CompositeVisitor`组合）。

2. **局部遍历控制**

   访问者可跳过无关节点（如忽略方法内部代码），减少不必要的子树解析。

3. **缓存优化**

   JavaParser内置的访问者实现（如`VoidVisitorAdapter`）已优化遍历算法，减少AST解析开销。

#### **潜在开销**

- **小规模文件**：若仅检查单个注解，**过程式代码（原代码）更轻量**，因访问者模式需创建额外类及调用栈。
- **简单操作**：单一操作（如仅检查类注解）时，访问者模式因双分派机制（`accept-visit`调用链）略有性能损耗。

------

### **3. 何时使用访问者模式？**

| **场景**                       | **推荐方案**   | **原因**                                            |
| ------------------------------ | -------------- | --------------------------------------------------- |
| 单一简单操作（如检查单个注解） | **过程式遍历** | 代码简洁，无额外类开销。                            |
| 复杂/多操作（如代码审查工具）  | **访问者模式** | 避免重复遍历，逻辑解耦，扩展性强。                  |
| 需深度定制遍历逻辑             | **访问者模式** | 可覆盖`visit`方法控制节点访问顺序（如跳过子节点）。 |

------

### **4. 性能对比结论**

✅ **访问者模式更高效的情况**：

- 需执行**多个操作**（如同时检查注解+生成文档）。
- 项目**持续扩展**（需新增AST操作）。
- 需**精细控制遍历路径**（如忽略某些节点）。

❌ **原过程式代码更高效的情况**：

- 仅需**一次性简单查询**（如单注解检查）。
- 目标文件**规模极小**（<100行代码）。

> **建议**：大型项目或复杂工具（如代码分析器）优先使用访问者模式；小型脚本可保留过程式代码。

## 统合

在访问者模式中实现对多种不同类型注解（如 `@RestController`和 `@GetMapping`）的检查，需通过 **分层访问者设计** 和 **类型分派机制** 实现高效且解耦的代码结构。以下是具体实现方案和优化建议：

------

### 🔧 **一、多注解检查的访问者模式实现**

#### **1. 核心设计思路**

- **统一访问接口**：定义 `AnnotationVisitor`接口，声明对不同注解的访问方法。
- **具体访问者实现**：为每类注解创建独立访问者（如 `RestControllerVisitor`、`GetMappingVisitor`），实现注解检查逻辑。
- **AST 节点分派**：在类/方法节点中调用访问者的对应方法，实现双重分派（节点类型 + 注解类型）。

#### **2. 代码实现示例**

```
import com.github.javaparser.ast.CompilationUnit;
import com.github.javaparser.ast.body.*;
import com.github.javaparser.ast.visitor.VoidVisitorAdapter;

// 1. 定义注解访问者接口
interface AnnotationVisitor {
    void visitRestController(ClassOrInterfaceDeclaration clazz);
    void visitGetMapping(MethodDeclaration method);
}

// 2. 实现具体访问者（检查 @RestController）
class RestControllerVisitorImpl implements AnnotationVisitor {
    @Override
    public void visitRestController(ClassOrInterfaceDeclaration clazz) {
        boolean hasAnnotation = clazz.getAnnotations().stream()
            .anyMatch(anno -> anno.getNameAsString().equals("RestController"));
        System.out.println("Class has @RestController: " + hasAnnotation);
    }

    @Override
    public void visitGetMapping(MethodDeclaration method) {} // 无需实现
}

// 3. 实现具体访问者（检查 @GetMapping）
class GetMappingVisitorImpl implements AnnotationVisitor {
    @Override
    public void visitRestController(ClassOrInterfaceDeclaration clazz) {} // 无需实现

    @Override
    public void visitGetMapping(MethodDeclaration method) {
        boolean hasAnnotation = method.getAnnotations().stream()
            .anyMatch(anno -> anno.getNameAsString().equals("GetMapping"));
        System.out.println("Method has @GetMapping: " + hasAnnotation);
    }
}

// 4. AST 节点访问者（分派注解检查）
class AnnotationCheckVisitor extends VoidVisitorAdapter<AnnotationVisitor> {
    @Override
    public void visit(ClassOrInterfaceDeclaration clazz, AnnotationVisitor visitor) {
        super.visit(clazz, visitor);
        visitor.visitRestController(clazz); // 分派到具体注解检查
    }

    @Override
    public void visit(MethodDeclaration method, AnnotationVisitor visitor) {
        super.visit(method, visitor);
        visitor.visitGetMapping(method); // 分派到具体注解检查
    }
}

// 5. 客户端调用
public class Main {
    public static void main(String[] args) {
        CompilationUnit cu = StaticJavaParser.parse("/* 源代码 */");
        AnnotationCheckVisitor dispatcher = new AnnotationCheckVisitor();

        // 组合多个注解检查
        AnnotationVisitor[] visitors = {
            new RestControllerVisitorImpl(),
            new GetMappingVisitorImpl()
        };

        // 单次遍历执行所有检查
        for (AnnotationVisitor visitor : visitors) {
            cu.accept(dispatcher, visitor);
        }
    }
}
```

------

### ⚙️ **二、关键技术点解析**

#### **1. 双重分派机制**

- **第一次分派**：AST 节点（如 `ClassOrInterfaceDeclaration`）的 `accept()`方法调用访问者的 `visit()`。
- **第二次分派**：访问者的 `visitRestController()`或 `visitGetMapping()`处理具体注解逻辑。

#### **2. 注解参数提取**

若需检查注解参数（如 `@GetMapping("/path")`），在具体访问者中解析 `AnnotationExpr`：

```
// 在 GetMappingVisitorImpl 中
@Override
public void visitGetMapping(MethodDeclaration method) {
    method.getAnnotations().forEach(anno -> {
        if ("GetMapping".equals(anno.getNameAsString())) {
            anno.ifSingleMemberValueExpr(expr -> {
                String path = expr.asStringLiteralExpr().asString();
                System.out.println("Path: " + path);
            });
        }
    });
}
```

#### **3. 支持嵌套注解**

若注解嵌套（如 `@RequestMapping(method = RequestMethod.GET)`），需递归解析：

```
anno.getChildNodes().stream()
    .filter(node -> node instanceof AnnotationExpr)
    .map(node -> (AnnotationExpr) node)
    .forEach(nestedAnno -> { /* 处理嵌套 */ });
```

------

### 🚀 **三、性能与扩展性优化**

#### **1. 避免重复遍历**

- **单次遍历多检查**：通过组合模式，在单次 AST 遍历中执行所有注解检查，减少 I/O 和解析开销。
- **局部解析控制**：在访问者中跳过无关节点（如字段声明），仅遍历类和方法节点。

#### **2. 动态扩展新注解**

新增注解检查只需两步：

1. 在 `AnnotationVisitor`接口添加新方法（如 `visitPostMapping()`）。
2. 实现新的具体访问者类（如 `PostMappingVisitorImpl`），无需修改现有代码。

#### **3. 缓存优化**

- **注解名称缓存**：预加载常用注解名（如 `RestController`、`GetMapping`），避免重复字符串比较。
- **AST 缓存**：对同一文件多次检查时，复用 `CompilationUnit`对象。

------

### ✅ **四、对比过程式代码的优势**

| **场景**       | **访问者模式**               | **过程式代码**             |
| -------------- | ---------------------------- | -------------------------- |
| 多注解检查     | ✅ 单次遍历完成所有检查       | ❌ 需多次遍历或复杂条件嵌套 |
| 新增注解类型   | ✅ 扩展新类即可，符合开闭原则 | ❌ 需修改原有逻辑           |
| 复杂代码结构   | ✅ 自动处理嵌套类、匿名类     | ❌ 需手动递归遍历           |
| 性能（大文件） | ✅ 通过组合访问者优化         | ❌ 多次解析开销大           |

------

### 💎 **五、总结**

在访问者模式中实现多注解检查的核心是：

1. **分层设计**：通过 `AnnotationVisitor`接口解耦注解类型与检查逻辑。
2. **双重分派**：利用 AST 节点的 `accept()`方法动态调用具体注解处理器。
3. **组合优化**：在单次遍历中组合多个访问者，避免重复解析。

此方案适用于静态代码分析、API 路由扫描等场景，兼具**高扩展性**与**高性能**，尤其适合大型项目中的注解自动化处理。

## 高效

针对代码中多个 `ClassOrInterfaceDeclaration`和 `MethodDeclaration`的高效组合问题，可通过以下优化策略提升性能与可维护性：

------

### 🔧 **一、优化方案：组合访问者与状态共享**

#### 1. **单次遍历多操作（核心优化）**

**问题**：原代码对每个访问者独立遍历 AST，导致多次解析开销。

**解决**：创建 **复合访问者**，在单次遍历中执行所有检查：

```
public class CompositeAnnotationVisitor implements AnnotationVisitor {
    private final List<AnnotationVisitor> visitors = new ArrayList<>();
    
    public void addVisitor(AnnotationVisitor visitor) {
        visitors.add(visitor);
    }

    @Override
    public void visitRestController(ClassOrInterfaceDeclaration clazz) {
        visitors.forEach(v -> v.visitRestController(clazz));
    }

    @Override
    public void visitGetMapping(MethodDeclaration method) {
        visitors.forEach(v -> v.visitGetMapping(method));
    }
}

// 客户端调用
public static void main(String[] args) {
    CompilationUnit cu = StaticJavaParser.parse("/* 源代码 */");
    AnnotationCheckVisitor dispatcher = new AnnotationCheckVisitor();
    
    CompositeAnnotationVisitor composite = new CompositeAnnotationVisitor();
    composite.addVisitor(new RestControllerVisitorImpl());
    composite.addVisitor(new GetMappingVisitorImpl());
    
    // 仅需单次遍历
    cu.accept(dispatcher, composite);
}
```

**优势**：

- ✅ **避免重复遍历**：AST 仅解析一次，性能提升显著；
- ✅ **逻辑解耦**：新增检查只需添加访问者，无需修改遍历逻辑。

------

#### 2. **节点访问优化**

**问题**：`AnnotationCheckVisitor`对每个节点无差别分派检查。

**解决**：**按需分派**，仅对目标节点触发操作：

```
class AnnotationCheckVisitor extends VoidVisitorAdapter<AnnotationVisitor> {
    @Override
    public void visit(ClassOrInterfaceDeclaration clazz, AnnotationVisitor visitor) {
        super.visit(clazz, visitor);
        if (visitor instanceof RestControllerVisitorImpl) { // 仅触发相关检查
            visitor.visitRestController(clazz);
        }
    }

    @Override
    public void visit(MethodDeclaration method, AnnotationVisitor visitor) {
        super.visit(method, visitor);
        if (visitor instanceof GetMappingVisitorImpl) {
            visitor.visitGetMapping(method);
        }
    }
}
```

**优势**：

- ⚡️ **减少冗余调用**：避免对非目标访问者执行空方法。

------

#### 3. **状态共享与结果聚合**

**问题**：各访问者独立输出结果，难以统一处理。

**解决**：引入 **共享上下文对象** 聚合结果：

```
class AnnotationContext {
    public Map<String, Boolean> restControllerResults = new HashMap<>();
    public Map<String, Boolean> getMappingResults = new HashMap<>();
}

class RestControllerVisitorImpl implements AnnotationVisitor {
    private AnnotationContext context;
    
    public RestControllerVisitorImpl(AnnotationContext context) {
        this.context = context;
    }
    
    @Override
    public void visitRestController(ClassOrInterfaceDeclaration clazz) {
        boolean hasAnnotation = ...; // 检查逻辑
        context.restControllerResults.put(clazz.getNameAsString(), hasAnnotation);
    }
}
```

**使用方式**：

```
AnnotationContext context = new AnnotationContext();
CompositeAnnotationVisitor composite = new CompositeAnnotationVisitor();
composite.addVisitor(new RestControllerVisitorImpl(context));
composite.addVisitor(new GetMappingVisitorImpl(context));
```

**优势**：

- 💡 **集中管理结果**：便于后续生成报告或批量处理。

------

### ⚙️ **二、性能对比与适用场景**

| **方案**               | 时间复杂度                     | 适用场景               | 优势                   |
| ---------------------- | ------------------------------ | ---------------------- | ---------------------- |
| **原方案（多次遍历）** | O(n×m)（n=节点数, m=访问者数） | 简单检查，节点数少     | 实现简单               |
| **复合访问者**         | O(n)                           | 多类型节点、大规模代码 | 避免重复遍历，性能最优 |
| **按需分派**           | O(n)（减少空调用）             | 访问者逻辑复杂且差异大 | 减少冗余操作           |

------

### 🚀 **三、扩展优化建议**

1. **并行处理**

   对独立类声明启用多线程检查（线程安全前提下）：

   ```
   cu.findAll(ClassOrInterfaceDeclaration.class).parallelStream()
      .forEach(clazz -> composite.visitRestController(clazz));
   ```

   **适用场景**：超大型项目（类数量 > 1000）。

2. **增量解析**

   仅解析含注解的节点（需结合符号解析）：

   ```
   cu.getTypes().stream()
     .filter(type -> type.getAnnotations().isNonEmpty())
     .forEach(type -> type.accept(dispatcher, composite));
   ```

   **优势**：跳过无注解节点，减少 AST 遍历深度。

3. **缓存机制**

   复用已解析的 AST 结构：

   ```
   // 全局缓存 CompilationUnit
   private static Map<String, CompilationUnit> astCache = new ConcurrentHashMap<>();
   CompilationUnit cu = astCache.computeIfAbsent(filePath, 
                       path -> StaticJavaParser.parse(new File(path)));
   ```

   **适用场景**：多次分析同一文件（如持续集成环境）。

------

### 💎 **总结**

高效组合多类与方法声明的核心策略：

1. **复合访问者模式** → 单次遍历完成多检查；

2. **按需分派** → 避免对非目标访问者触发空操作；

3. **共享上下文** → 统一管理检查结果。

   针对超大规模代码，可结合 **并行处理**、**增量解析** 和 **AST缓存** 进一步优化性能。此方案适用于静态分析工具、API 路由扫描等场景，兼顾效率与扩展性。















