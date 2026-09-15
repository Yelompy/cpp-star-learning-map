export interface LearningStage {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  color: string;
}

export interface CodeExample {
  code: string;
  output: string;
  explanation: string;
}

export interface Exercise {
  prompt: string;
  hint: string;
}

export interface KnowledgeNode {
  id: string;
  stageId: string;
  title: string;
  summary: string;
  goal: string;
  content: string[];
  prerequisiteIds: string[];
  position: { x: number; y: number };
  example: CodeExample;
  pitfalls: string[];
  interviewTip: string;
  exercise: Exercise;
  career: string;
}

export interface LearningProgress {
  version: 1;
  completedIds: string[];
  favoriteIds: string[];
  lastVisitedId?: string;
}

export const stages: LearningStage[] = [
  { id: "launch", order: 1, title: "启程", subtitle: "让第一段程序亮起来", color: "#73e6ff" },
  { id: "syntax", order: 2, title: "语法基础", subtitle: "理解数据、函数与内存", color: "#8ca8ff" },
  { id: "oop", order: 3, title: "面向对象", subtitle: "组织可复用的软件模型", color: "#bf8cff" },
  { id: "stl", order: 4, title: "标准库", subtitle: "站在成熟抽象之上", color: "#ff8ed1" },
  { id: "modern", order: 5, title: "现代 C++", subtitle: "写安全、高效的现代代码", color: "#ffb66e" },
  { id: "algorithm", order: 6, title: "算法能力", subtitle: "把问题转化为可计算步骤", color: "#ffe979" },
  { id: "engineering", order: 7, title: "工程实践", subtitle: "从代码走向真实系统", color: "#83f2b2" },
  { id: "career", order: 8, title: "就业导航", subtitle: "选择方向并证明你的能力", color: "#ffffff" },
];

type TopicSeed = Omit<KnowledgeNode, "position" | "prerequisiteIds" | "goal">;

const seeds: TopicSeed[] = [
  {
    id: "dev-environment", stageId: "launch", title: "开发环境", summary: "认识编译器、编辑器与从源码到程序的完整过程。",
    content: ["C++ 源文件只是文本，必须先由编译器翻译成目标文件，再由链接器组合为可执行程序。推荐先使用支持 C++17 的 GCC、Clang 或 MSVC。", "遇到错误时先区分编译错误、链接错误和运行错误：它们发生在不同阶段，解决方法也不同。"],
    example: { code: "// hello.cpp\n#include <iostream>\n\nint main() {\n    std::cout << \"Hello, C++!\\n\";\n    return 0;\n}", output: "Hello, C++!", explanation: "保存后以 C++17 标准编译。main 是入口，程序从这里开始执行。" },
    pitfalls: ["文件扩展名误写成 .c，导致按 C 语言编译。", "只看最后一条错误；通常第一条错误最接近根因。"], interviewTip: "能够清楚解释预处理、编译、汇编、链接四个阶段。",
    exercise: { prompt: "编译并运行一个输出姓名与学习目标的程序。", hint: "使用两次 std::cout，观察是否必须显式写 return 0。" }, career: "所有 C++ 岗位的起点，工程面试也常从构建流程展开。"
  },
  {
    id: "program-structure", stageId: "launch", title: "程序结构", summary: "读懂头文件、命名空间、main 函数和语句。",
    content: ["#include 把声明引入当前翻译单元；语句通常以分号结束；花括号界定作用域。", "std 是标准库使用的命名空间。初学时显式写 std:: 能避免名称冲突，也能让来源更清晰。"],
    example: { code: "#include <iostream>\n\nint main() {\n    int year = 2026;\n    std::cout << \"学习年份：\" << year << '\\n';\n}", output: "学习年份：2026", explanation: "声明、赋值与输出组成最小但结构完整的程序。" },
    pitfalls: ["在头文件或大型项目中写 using namespace std;。", "混淆圆括号、方括号和花括号的用途。"], interviewTip: "说明 main 返回 int 的原因，以及省略 return 0 时标准规定的行为。",
    exercise: { prompt: "输出三行个人学习信息，并为每条语句添加注释。", hint: "换行可以使用 '\\n'，注释使用 //。" }, career: "快速阅读入口文件和第三方示例是进入项目的基本能力。"
  },
  {
    id: "variables-types", stageId: "launch", title: "变量与类型", summary: "掌握整数、浮点数、字符、布尔值和常量。",
    content: ["类型决定一段内存如何被解释、可表达的值以及可执行的操作。优先选择能准确表达业务含义的类型。", "使用 const 表达不可修改的值，使用 auto 让编译器从初始化表达式推导类型，但不要因此隐藏关键语义。"],
    example: { code: "#include <iostream>\nint main() {\n    const int maxPlayers = 4;\n    double score = 92.5;\n    bool passed = score >= 60.0;\n    std::cout << maxPlayers << ' ' << std::boolalpha << passed;\n}", output: "4 true", explanation: "比较表达式得到 bool，std::boolalpha 让它以文字显示。" },
    pitfalls: ["把小数保存进 int，导致小数部分被截断。", "使用未初始化的局部变量。"], interviewTip: "理解有符号/无符号混合比较与整数溢出的风险。",
    exercise: { prompt: "声明温度、城市首字母和是否下雨，并输出它们。", hint: "分别考虑 double、char 与 bool。" }, career: "类型选择会直接影响接口正确性、内存占用和性能。"
  },
  {
    id: "io", stageId: "launch", title: "输入与输出", summary: "使用流读取用户输入，并处理整行文本。",
    content: ["std::cin 和 std::cout 是标准输入输出流。>> 按空白分隔读取，而 std::getline 可以读取包含空格的一整行。", "真实程序必须考虑输入失败；流对象可在条件语句中用于判断读取是否成功。"],
    example: { code: "#include <iostream>\n#include <string>\nint main() {\n    std::string name;\n    std::cout << \"你的名字：\";\n    std::getline(std::cin, name);\n    std::cout << \"你好，\" << name << \"！\";\n}", output: "你的名字：小星\n你好，小星！", explanation: "getline 不会在姓名中出现空格时提前停止。" },
    pitfalls: ["混用 >> 和 getline 时遗留换行符。", "默认相信输入一定符合预期格式。"], interviewTip: "能解释格式化读取失败后 failbit 的含义和恢复方法。",
    exercise: { prompt: "读取姓名和年龄，输出明年年龄。", hint: "若先用 >> 读取年龄，再 getline，要留意缓冲区中的换行。" }, career: "命令行工具、日志与数据解析都依赖可靠的 I/O。"
  },
  {
    id: "operators", stageId: "launch", title: "运算符与表达式", summary: "理解算术、比较、逻辑运算及求值规则。",
    content: ["表达式由值、运算符和函数调用构成。括号可以明确意图，避免依赖难记的优先级。", "&& 和 || 具有短路求值特性：结果确定后，右侧可能不会执行。"],
    example: { code: "#include <iostream>\nint main() {\n    int age = 20;\n    bool hasTicket = true;\n    bool allowed = age >= 18 && hasTicket;\n    std::cout << std::boolalpha << allowed;\n}", output: "true", explanation: "只有两个条件都为真时 allowed 才为真。" },
    pitfalls: ["把赋值 = 写成相等比较 ==。", "整数除法 5 / 2 得到 2，而不是 2.5。"], interviewTip: "短路求值常用于空指针保护，但应避免在表达式中隐藏副作用。",
    exercise: { prompt: "计算三个成绩的浮点平均值并判断是否及格。", hint: "至少让一个操作数是 double。" }, career: "条件表达式的清晰度直接影响业务规则是否可靠。"
  },
  {
    id: "control-flow", stageId: "launch", title: "流程控制", summary: "使用分支与循环控制程序执行路径。",
    content: ["if/else 处理条件分支，switch 适合离散值，for 与 while 处理重复任务。", "循环应有明确的初始化、继续条件和推进步骤；能用范围 for 时通常更不易越界。"],
    example: { code: "#include <iostream>\nint main() {\n    int sum = 0;\n    for (int i = 1; i <= 5; ++i) {\n        if (i % 2 == 0) continue;\n        sum += i;\n    }\n    std::cout << sum;\n}", output: "9", explanation: "continue 跳过偶数，最终累加 1、3、5。" },
    pitfalls: ["循环条件永远为真造成死循环。", "边界写成 < 还是 <= 时出现差一错误。"], interviewTip: "面试中先口述循环不变量，再写代码，能显著减少边界错误。",
    exercise: { prompt: "打印 1 到 100 中同时能被 3 和 5 整除的数。", hint: "使用 % 判断余数，使用 && 连接条件。" }, career: "业务逻辑、遍历算法和状态机都建立在流程控制之上。"
  },
  {
    id: "functions", stageId: "syntax", title: "函数", summary: "把任务拆成有清晰输入、输出和职责的单元。",
    content: ["函数通过参数接收数据，通过返回值交付结果。声明描述接口，定义提供实现。", "小而单一职责的函数更容易测试和复用；只读的大对象优先按 const 引用传递。"],
    example: { code: "#include <iostream>\nint square(int value) {\n    return value * value;\n}\nint main() {\n    std::cout << square(6);\n}", output: "36", explanation: "square 隐藏计算细节，调用者只关心输入和结果。" },
    pitfalls: ["非 void 函数遗漏返回值。", "值传递大对象造成不必要复制。"], interviewTip: "理解重载依据参数列表而不是返回类型。",
    exercise: { prompt: "写一个函数返回三个整数中的最大值。", hint: "可以组合 std::max，也可以逐步比较。" }, career: "接口设计与职责拆分是团队代码评审的高频关注点。"
  },
  {
    id: "arrays-strings", stageId: "syntax", title: "数组与字符串", summary: "管理一组连续元素与常用文本数据。",
    content: ["原生数组长度固定且容易退化为指针；现代代码优先使用 std::array 或 std::vector。", "std::string 管理自己的字符内存，提供长度、查找、拼接等安全操作。"],
    example: { code: "#include <array>\n#include <iostream>\nint main() {\n    std::array<int, 4> scores{80, 92, 76, 88};\n    int total = 0;\n    for (int score : scores) total += score;\n    std::cout << total / scores.size();\n}", output: "84", explanation: "范围 for 避免手动索引，size 返回元素数量。" },
    pitfalls: ["访问下标等于 size 的元素。", "把 C 风格字符串和 std::string 的生命周期混为一谈。"], interviewTip: "清楚数组、指针、std::array、std::vector 的差异。",
    exercise: { prompt: "统计字符串中元音字母出现的次数。", hint: "遍历每个 char，用分支判断。" }, career: "缓冲区、协议字段和业务列表都离不开序列数据。"
  },
  {
    id: "pointers-references", stageId: "syntax", title: "指针与引用", summary: "理解对象地址、间接访问与参数别名。",
    content: ["指针保存地址，可以为空并可重新指向；引用是已有对象的别名，初始化后不能改绑。", "裸指针适合表达非拥有关系；资源所有权应优先交给对象或智能指针。"],
    example: { code: "#include <iostream>\nvoid addOne(int& value) { ++value; }\nint main() {\n    int count = 2;\n    int* pointer = &count;\n    addOne(*pointer);\n    std::cout << count;\n}", output: "3", explanation: "& 取得地址，* 解引用，引用参数直接修改原对象。" },
    pitfalls: ["解引用 nullptr 或已失效地址。", "返回局部变量的引用或指针。"], interviewTip: "能从所有权、可空性和重绑定能力比较指针与引用。",
    exercise: { prompt: "写 swapValues(int&, int&) 交换两个整数。", hint: "保存一个临时值，再完成三次赋值。" }, career: "系统、游戏和嵌入式开发尤其依赖对地址与生命周期的理解。"
  },
  {
    id: "struct-enum", stageId: "syntax", title: "结构体与枚举", summary: "用自定义类型表达一组相关数据和有限状态。",
    content: ["struct 将相关字段组合为一个值类型；enum class 给有限选项提供作用域和类型安全。", "类型名称应表达领域概念，而不是仅仅复制数据表结构。"],
    example: { code: "#include <iostream>\nenum class Status { idle, running, done };\nstruct Task {\n    int id;\n    Status status;\n};\nint main() {\n    Task task{7, Status::running};\n    std::cout << task.id;\n}", output: "7", explanation: "聚合初始化按字段顺序构造 Task。" },
    pitfalls: ["依赖未固定的结构体内存布局做跨平台传输。", "使用无作用域 enum 污染命名空间。"], interviewTip: "理解内存对齐可能让 sizeof(struct) 大于字段大小之和。",
    exercise: { prompt: "设计 Book 结构体与 BookState 枚举，并创建两个实例。", hint: "字段可以包含标题、价格与状态。" }, career: "领域建模决定代码是否能清晰映射真实业务。"
  },
  {
    id: "memory-model", stageId: "syntax", title: "内存与生命周期", summary: "分清自动存储、动态存储以及对象何时有效。",
    content: ["局部对象通常在进入作用域时构造、离开作用域时销毁；动态对象由程序决定释放时机。", "现代 C++ 倾向通过 RAII 和容器管理资源，避免直接配对 new/delete。"],
    example: { code: "#include <iostream>\nint main() {\n    int outer = 1;\n    {\n        int inner = 2;\n        std::cout << outer + inner;\n    } // inner 的生命周期结束\n}", output: "3", explanation: "作用域不仅控制名称可见性，也控制自动对象的生命周期。" },
    pitfalls: ["内存泄漏、重复释放和释放后使用。", "把栈与堆理解为语言强制的唯一实现。"], interviewTip: "能够画出函数调用期间局部对象与动态对象的生命周期。",
    exercise: { prompt: "分析一个返回局部变量引用的函数为什么错误。", hint: "函数返回后，局部对象已经销毁。" }, career: "内存错误通常隐蔽且代价高，是 C++ 面试与生产排障重点。"
  },
  {
    id: "debugging", stageId: "syntax", title: "调试基础", summary: "用断点、单步和变量观察定位问题。",
    content: ["调试不是猜测：先稳定复现，再缩小范围，最后验证假设。编译器警告、调试器和最小复现都很重要。", "断点暂停执行后可查看调用栈、当前变量与控制流；日志适合记录跨时间状态。"],
    example: { code: "#include <iostream>\nint main() {\n    int total = 0;\n    for (int i = 0; i < 3; ++i) {\n        total += i; // 在这里观察 i 与 total\n    }\n    std::cout << total;\n}", output: "3", explanation: "逐轮观察变量，可以确认循环是否符合预期。" },
    pitfalls: ["一次修改多个地方后无法确认真正修复点。", "忽略编译器警告或只靠打印调试。"], interviewTip: "描述一次完整排障过程：现象、假设、证据、修复和回归验证。",
    exercise: { prompt: "故意制造一次数组越界，并用调试器定位触发位置。", hint: "开启警告和 AddressSanitizer 会提供更直接的证据。" }, career: "高效定位问题往往比首次写对更能区分工程能力。"
  },
  {
    id: "classes", stageId: "oop", title: "类与封装", summary: "把状态和维护这些状态的行为放在一起。",
    content: ["class 通过 public 提供稳定接口，通过 private 保护内部不变量。调用者不应依赖对象内部表示。", "好的类让非法状态难以构造，并让每个公开操作都有清晰语义。"],
    example: { code: "#include <iostream>\nclass Counter {\npublic:\n    void increment() { ++value_; }\n    int value() const { return value_; }\nprivate:\n    int value_ = 0;\n};\nint main() { Counter c; c.increment(); std::cout << c.value(); }", output: "1", explanation: "外部只能通过公开方法维护计数器状态。" },
    pitfalls: ["把所有字段都设为 public，失去不变量保护。", "创建只包含 getter/setter、没有领域行为的贫血类。"], interviewTip: "const 成员函数承诺不修改对象的可观察状态。",
    exercise: { prompt: "实现 BankAccount，余额不能通过公开操作变为负数。", hint: "把 balance 设为 private，在 withdraw 中验证金额。" }, career: "大型项目通过封装限制变化范围，降低协作成本。"
  },
  {
    id: "constructors", stageId: "oop", title: "构造与析构", summary: "控制对象如何进入有效状态以及如何释放资源。",
    content: ["构造函数建立对象不变量，初始化列表直接初始化成员；析构函数在生命周期结束时执行清理。", "优先遵循零法则：让标准容器和智能指针替你管理资源。"],
    example: { code: "#include <iostream>\n#include <string>\nclass User {\npublic:\n    explicit User(std::string name) : name_(std::move(name)) {}\n    ~User() { std::cout << \"bye\"; }\nprivate:\n    std::string name_;\n};\nint main() { User user(\"Nova\"); }", output: "bye", explanation: "main 结束时 user 自动析构。explicit 防止意外隐式转换。" },
    pitfalls: ["在构造函数体内赋值，错过直接初始化。", "手写析构后忽略复制/移动语义。"], interviewTip: "掌握零法则、三法则与五法则的适用条件。",
    exercise: { prompt: "为 Rectangle 添加验证长宽为正的构造函数。", hint: "无效输入可以抛出 std::invalid_argument。" }, career: "资源类的构造析构质量直接决定异常安全与稳定性。"
  },
  {
    id: "inheritance", stageId: "oop", title: "继承", summary: "在真正的 is-a 关系中复用接口与行为。",
    content: ["公有继承表达派生类可以替代基类。若只是复用实现，组合通常更清晰、更松耦合。", "基类用于多态删除时应提供虚析构函数。"],
    example: { code: "#include <iostream>\nstruct Shape {\n    virtual double area() const = 0;\n    virtual ~Shape() = default;\n};\nstruct Square : Shape {\n    double side;\n    double area() const override { return side * side; }\n};\nint main() { Square s{ {}, 3 }; std::cout << s.area(); }", output: "9", explanation: "纯虚函数定义共同接口，override 请求编译器检查重写。" },
    pitfalls: ["为复用几行代码建立深层继承树。", "通过基类指针删除对象却没有虚析构。"], interviewTip: "用里氏替换原则判断继承关系是否合理。",
    exercise: { prompt: "设计 Circle 和 Rectangle，共同实现 Shape::area。", hint: "通过 const Shape& 调用，验证动态多态。" }, career: "维护旧框架时常遇到继承；新设计应谨慎控制层次。"
  },
  {
    id: "polymorphism", stageId: "oop", title: "多态", summary: "通过统一接口在运行时或编译期选择行为。",
    content: ["虚函数实现运行时多态，调用由对象真实类型决定；模板和重载则实现编译期多态。", "值传递派生对象给基类会发生对象切片，应使用引用或智能指针保留动态类型。"],
    example: { code: "#include <iostream>\nstruct Greeter {\n    virtual void say() const { std::cout << \"hello\"; }\n    virtual ~Greeter() = default;\n};\nstruct CppGreeter : Greeter {\n    void say() const override { std::cout << \"hello C++\"; }\n};\nvoid greet(const Greeter& g) { g.say(); }\nint main() { CppGreeter g; greet(g); }", output: "hello C++", explanation: "引用保留动态类型，所以调用派生类实现。" },
    pitfalls: ["构造和析构期间期待虚调用分派到派生类。", "按值接收多态基类造成切片。"], interviewTip: "理解虚函数表是常见实现手段，但不是标准规定的语义。",
    exercise: { prompt: "创建两种 Logger，通过同一接口输出不同前缀。", hint: "让基类方法为纯虚函数，并通过 const 引用调用。" }, career: "插件、渲染后端和策略替换常使用多态边界。"
  },
  {
    id: "operator-overload", stageId: "oop", title: "运算符重载", summary: "让自定义类型以符合直觉的方式参与表达式。",
    content: ["运算符重载不能改变优先级、参数数量和基本语义。只有当操作对领域类型自然时才应重载。", "保持对称性和一致性，例如 == 应满足自反、对称、传递。"],
    example: { code: "#include <iostream>\nstruct Vec2 {\n    int x, y;\n    Vec2 operator+(const Vec2& other) const {\n        return {x + other.x, y + other.y};\n    }\n};\nint main() { auto v = Vec2{1, 2} + Vec2{3, 4}; std::cout << v.x << ',' << v.y; }", output: "4,6", explanation: "+ 返回新值，不修改任一操作数，符合加法直觉。" },
    pitfalls: ["重载 &&、|| 后误以为仍有短路语义。", "让 + 修改左操作数，违反用户预期。"], interviewTip: "说明成员与非成员运算符的选择，以及何时使用 friend。",
    exercise: { prompt: "为 Money 实现 == 与 +，并保持币种一致。", hint: "不同币种相加应拒绝或显式换算。" }, career: "数值库、图形库和领域值对象依赖清晰的运算语义。"
  },
  {
    id: "templates-basics", stageId: "oop", title: "模板基础", summary: "编写可服务于多种类型的通用代码。",
    content: ["函数模板和类模板把类型作为参数，由编译器在使用处实例化。模板要求应尽量清晰。", "错误信息常出现在实例化点；先检查传入类型是否支持模板体内需要的操作。"],
    example: { code: "#include <iostream>\ntemplate <typename T>\nT larger(T a, T b) { return a < b ? b : a; }\nint main() { std::cout << larger(7, 12); }", output: "12", explanation: "调用时 T 被推导为 int，并生成对应实现。" },
    pitfalls: ["把模板定义只放在普通 .cpp，导致其他翻译单元无法实例化。", "写过于宽泛的模板，却没有表达类型要求。"], interviewTip: "理解模板实例化、特化以及头文件可见性的原因。",
    exercise: { prompt: "写 clampValue 模板，把值限制在最小值与最大值之间。", hint: "只依赖 < 比较，返回边界或原值。" }, career: "STL 与高性能库大量使用泛型编程。"
  },
  {
    id: "containers", stageId: "stl", title: "容器", summary: "根据访问、插入和内存特性选择数据结构。",
    content: ["std::vector 是默认首选序列容器，具有连续内存和良好缓存局部性。map、unordered_map、set 等服务于不同查找与排序需求。", "选择容器时考虑访问模式、元素数量、稳定性要求和性能测量，而不是凭印象。"],
    example: { code: "#include <iostream>\n#include <vector>\nint main() {\n    std::vector<int> values{2, 4};\n    values.push_back(6);\n    for (int value : values) std::cout << value << ' ';\n}", output: "2 4 6", explanation: "vector 自动管理动态数组容量。" },
    pitfalls: ["在 vector 扩容后继续使用旧迭代器或指针。", "为了频繁查找盲目选择链表。"], interviewTip: "比较 vector、deque、list 的内存布局与复杂度。",
    exercise: { prompt: "用 vector 保存成绩，删除所有不及格项。", hint: "结合 remove_if 与 erase。" }, career: "容器选择是性能、可维护性与正确性的共同决策。"
  },
  {
    id: "iterators", stageId: "stl", title: "迭代器", summary: "用统一方式连接容器和算法。",
    content: ["迭代器像广义指针，表示序列中的位置。半开区间 [begin, end) 让空区间和长度计算更自然。", "不同迭代器支持的能力不同；算法会通过类别表达最低要求。"],
    example: { code: "#include <iostream>\n#include <vector>\nint main() {\n    std::vector<int> v{3, 5, 8};\n    for (auto it = v.begin(); it != v.end(); ++it) {\n        std::cout << *it << ' ';\n    }\n}", output: "3 5 8", explanation: "end 指向尾后位置，不能解引用。" },
    pitfalls: ["解引用 end()。", "容器修改后使用已经失效的迭代器。"], interviewTip: "掌握输入、前向、双向、随机访问迭代器能力层次。",
    exercise: { prompt: "使用迭代器找到 vector 中第一个负数。", hint: "手写循环后再尝试 std::find_if。" }, career: "读懂 STL 算法接口必须理解迭代器和区间。"
  },
  {
    id: "algorithms-lib", stageId: "stl", title: "标准算法", summary: "用已验证的算法替代重复手写循环。",
    content: ["<algorithm> 提供排序、查找、变换、计数和分区等操作。算法表达意图更直接，也更容易优化。", "经典 erase-remove 惯用法用于真正删除序列容器中满足条件的元素。"],
    example: { code: "#include <algorithm>\n#include <iostream>\n#include <vector>\nint main() {\n    std::vector<int> v{4, 1, 3, 2};\n    std::sort(v.begin(), v.end());\n    std::cout << std::binary_search(v.begin(), v.end(), 3);\n}", output: "1", explanation: "binary_search 要求输入区间已排序。" },
    pitfalls: ["在未排序范围上使用二分查找。", "调用 remove 后忘记 erase，容器大小没有改变。"], interviewTip: "知道算法复杂度前提，例如 sort 通常为 O(n log n)。",
    exercise: { prompt: "统计一组单词中长度大于 5 的数量。", hint: "使用 std::count_if 与谓词。" }, career: "熟练使用标准算法能减少缺陷并提升代码表达力。"
  },
  {
    id: "lambdas", stageId: "stl", title: "Lambda", summary: "在使用位置定义短小函数对象并控制捕获。",
    content: ["Lambda 由捕获列表、参数、可选说明符和函数体组成。捕获决定它如何访问外部变量。", "优先显式捕获关键变量，异步场景尤其要注意引用捕获的生命周期。"],
    example: { code: "#include <algorithm>\n#include <iostream>\n#include <vector>\nint main() {\n    int limit = 5;\n    std::vector<int> v{2, 7, 9};\n    auto count = std::count_if(v.begin(), v.end(), [limit](int n) { return n > limit; });\n    std::cout << count;\n}", output: "2", explanation: "[limit] 按值保存阈值，让谓词自包含。" },
    pitfalls: ["异步任务按引用捕获已经离开作用域的变量。", "默认捕获过多变量，隐藏依赖。"], interviewTip: "Lambda 本质上生成带 operator() 的闭包类型。",
    exercise: { prompt: "按字符串长度对 vector<string> 排序。", hint: "把比较 Lambda 传给 std::sort。" }, career: "回调、算法、并发任务都广泛使用 Lambda。"
  },
  {
    id: "string-processing", stageId: "stl", title: "字符串处理", summary: "完成查找、切分、转换与安全的文本拼接。",
    content: ["std::string 存储拥有的文本；std::string_view 是轻量只读视图，不拥有字符。", "处理协议或用户输入时必须明确编码、边界与格式失败策略。"],
    example: { code: "#include <iostream>\n#include <string>\nint main() {\n    std::string path = \"cpp/stars\";\n    auto slash = path.find('/');\n    std::cout << path.substr(0, slash);\n}", output: "cpp", explanation: "find 返回位置，未找到时返回 std::string::npos。" },
    pitfalls: ["让 string_view 指向已经销毁的临时字符串。", "把字节数直接当作中文字符数。"], interviewTip: "解释 string 的小字符串优化可能存在但不由标准保证。",
    exercise: { prompt: "把逗号分隔的一行文本切分为多个字段。", hint: "循环使用 find，并正确处理最后一个字段。" }, career: "配置、日志、协议与数据导入都包含大量文本边界问题。"
  },
  {
    id: "generic-programming", stageId: "stl", title: "泛型编程", summary: "通过类型参数和抽象要求复用算法。",
    content: ["泛型代码关注类型具备什么能力，而非它具体叫什么。STL 将数据结构、迭代方式和算法解耦。", "编译期抽象可以保持零额外运行时成本，但应控制实例化规模和错误复杂度。"],
    example: { code: "#include <iostream>\n#include <vector>\ntemplate <typename Range>\nauto sum(const Range& range) {\n    typename Range::value_type result{};\n    for (const auto& value : range) result += value;\n    return result;\n}\nint main() { std::cout << sum(std::vector<int>{1, 2, 3}); }", output: "6", explanation: "算法只要求范围可遍历且元素可累加。" },
    pitfalls: ["为了泛型而泛型，增加理解成本。", "假定类型支持未声明的操作。"], interviewTip: "能够说明静态多态与动态多态的权衡。",
    exercise: { prompt: "写 printRange，支持 vector 和 array。", hint: "只依赖范围 for 与输出运算符。" }, career: "库设计、性能框架和基础设施代码的核心能力。"
  },
  {
    id: "raii", stageId: "modern", title: "RAII", summary: "让资源生命周期绑定到对象生命周期。",
    content: ["RAII 在构造时获得资源，在析构时释放资源，因此函数正常返回或抛异常都能清理。", "锁、文件、内存和句柄都应由具有明确所有权的对象管理。"],
    example: { code: "#include <fstream>\n#include <string>\nint main() {\n    std::ofstream file(\"note.txt\");\n    file << \"C++ stars\";\n} // file 自动关闭", output: "生成包含 C++ stars 的 note.txt", explanation: "即使中途 return，ofstream 析构仍负责关闭文件。" },
    pitfalls: ["获得资源后在多个分支手动释放。", "析构函数抛出异常。"], interviewTip: "RAII 是 C++ 异常安全和资源管理的根基。",
    exercise: { prompt: "设计 ScopeTimer，在构造和析构间统计耗时。", hint: "保存 steady_clock::now()，在析构时计算差值。" }, career: "系统可靠性很大程度上取决于资源是否有单一明确所有者。"
  },
  {
    id: "smart-pointers", stageId: "modern", title: "智能指针", summary: "用 unique_ptr、shared_ptr 表达动态对象所有权。",
    content: ["std::unique_ptr 表示独占所有权，是动态多态和工厂返回值的默认选择。std::shared_ptr 仅用于真正共享生命周期。", "std::weak_ptr 观察 shared_ptr 管理的对象而不增加引用计数，可打破环。"],
    example: { code: "#include <iostream>\n#include <memory>\nint main() {\n    auto value = std::make_unique<int>(42);\n    std::cout << *value;\n}", output: "42", explanation: "make_unique 一次完成分配和构造，离开作用域自动释放。" },
    pitfalls: ["所有对象都使用 shared_ptr，隐藏所有权设计。", "用多个 shared_ptr 独立接管同一个裸指针。"], interviewTip: "解释 shared_ptr 控制块、weak_ptr 和循环引用。",
    exercise: { prompt: "让工厂函数返回 unique_ptr<Shape>。", hint: "使用 std::make_unique<Derived>()，返回时自动上转型。" }, career: "现代项目会通过所有权类型审查资源安全。"
  },
  {
    id: "move-semantics", stageId: "modern", title: "移动语义", summary: "转移资源而不是复制资源，理解值类别。",
    content: ["移动构造把可转移资源从即将不用的对象交给新对象。被移动对象仍然有效，但值通常未指定。", "std::move 只是把表达式转换为可移动的右值引用，本身不移动任何数据。"],
    example: { code: "#include <iostream>\n#include <string>\n#include <utility>\nint main() {\n    std::string source = \"nebula\";\n    std::string target = std::move(source);\n    std::cout << target;\n}", output: "nebula", explanation: "target 接管字符串资源；之后只应对 source 做无前置条件操作。" },
    pitfalls: ["移动后继续依赖原对象的具体值。", "对 const 对象使用 move 却期待资源被转移。"], interviewTip: "区分左值、纯右值、将亡值和万能引用。",
    exercise: { prompt: "记录 vector 扩容时自定义类型复制与移动次数。", hint: "在复制/移动构造函数中输出日志，并考虑 noexcept。" }, career: "高吞吐系统通过移动避免昂贵复制。"
  },
  {
    id: "type-deduction", stageId: "modern", title: "类型推导", summary: "正确使用 auto、decltype 与模板推导规则。",
    content: ["auto 按模板推导的相似规则从初始化器得到类型，通常会去掉顶层 const 和引用。", "decltype 可精确查询表达式类型；decltype(auto) 常用于保持返回表达式的引用性。"],
    example: { code: "#include <iostream>\n#include <vector>\nint main() {\n    const std::vector<int> values{2, 4};\n    for (const auto& value : values) std::cout << value << ' ';\n}", output: "2 4", explanation: "const auto& 避免复制并保证只读。" },
    pitfalls: ["auto 意外复制代理对象或丢失引用。", "为了短而使用 auto，反而让接口语义不清。"], interviewTip: "能手算 auto、auto&、const auto& 对 const 左值的推导结果。",
    exercise: { prompt: "判断多个 auto 声明的真实类型，并用 static_assert 验证。", hint: "配合 std::is_same_v<decltype(x), Type>。" }, career: "模板与现代库代码中，类型推导决定接口是否安全。"
  },
  {
    id: "concurrency-basics", stageId: "modern", title: "并发基础", summary: "理解线程、互斥、原子操作与数据竞争。",
    content: ["当多个线程并发访问同一内存且至少一个写入、又没有同步时，会产生数据竞争并导致未定义行为。", "优先减少共享状态；确需共享时用 mutex、原子或更高层任务抽象建立 happens-before。"],
    example: { code: "#include <iostream>\n#include <mutex>\n#include <thread>\nint main() {\n    int count = 0;\n    std::mutex mutex;\n    auto work = [&] { std::lock_guard lock(mutex); ++count; };\n    std::thread a(work), b(work);\n    a.join(); b.join();\n    std::cout << count;\n}", output: "2", explanation: "lock_guard 用 RAII 保证离开作用域时解锁。" },
    pitfalls: ["忘记 join/detach 导致 std::terminate。", "多把锁获取顺序不一致造成死锁。"], interviewTip: "区分并发与并行，并能定义数据竞争。",
    exercise: { prompt: "让四个线程安全地累加同一计数器。", hint: "分别尝试 mutex 与 std::atomic<int>。" }, career: "后端、游戏引擎和系统软件都重视并发正确性。"
  },
  {
    id: "cpp20", stageId: "modern", title: "C++20 常用特性", summary: "认识 ranges、concepts、span 与结构化并发工具。",
    content: ["C++20 ranges 让算法组合更自然，concepts 让模板约束出现在接口上，span 提供不拥有的连续区间视图。", "生产项目应以编译器与团队标准为准，按收益逐步采用新特性。"],
    example: { code: "#include <concepts>\n#include <iostream>\ntemplate <std::integral T>\nT twice(T value) { return value * 2; }\nint main() { std::cout << twice(21); }", output: "42", explanation: "integral concept 在接口处明确参数必须是整数类型。" },
    pitfalls: ["为了追新而降低工具链兼容性。", "把 ranges 视图保存得比底层范围更久。"], interviewTip: "说明 concepts 如何改善模板错误和重载选择。",
    exercise: { prompt: "用 ranges 过滤偶数并输出其平方。", hint: "组合 views::filter 与 views::transform。" }, career: "新项目逐步采用 C++20，理解核心特性能提高适应力。"
  },
  {
    id: "complexity", stageId: "algorithm", title: "复杂度", summary: "用时间与空间增长趋势评估算法。",
    content: ["大 O 描述输入规模增长时资源消耗的上界趋势，忽略常数但不等于忽略真实测量。", "还要考虑最坏、平均与摊还复杂度，以及缓存和数据规模。"],
    example: { code: "#include <vector>\nbool contains(const std::vector<int>& values, int target) {\n    for (int value : values)\n        if (value == target) return true;\n    return false;\n}", output: "最坏检查 n 个元素，时间 O(n)，额外空间 O(1)", explanation: "目标在末尾或不存在时会遍历整个范围。" },
    pitfalls: ["只背复杂度，不检查算法前提。", "忽略常数、缓存与实际输入分布。"], interviewTip: "回答复杂度时同时说清 n 代表什么以及最坏/平均情形。",
    exercise: { prompt: "分析双重循环，但内层次数逐轮减半时的复杂度。", hint: "不要只因嵌套就判断为 O(n²)，写出总次数。" }, career: "性能判断和算法面试的共同语言。"
  },
  {
    id: "linear-structures", stageId: "algorithm", title: "线性结构", summary: "掌握数组、链表、栈、队列的适用场景。",
    content: ["数组适合随机访问和连续存储；链表适合已知位置的插删；栈是后进先出，队列是先进先出。", "实际 C++ 中 vector/deque 往往比手写链表更实用，选择需要结合访问模式。"],
    example: { code: "#include <iostream>\n#include <stack>\nint main() {\n    std::stack<int> stack;\n    stack.push(1); stack.push(2);\n    std::cout << stack.top();\n    stack.pop();\n}", output: "2", explanation: "只能从栈顶查看和弹出，体现后进先出。" },
    pitfalls: ["对空栈调用 top/pop。", "因为理论插入 O(1) 就默认链表更快。"], interviewTip: "能用两个栈实现队列并分析摊还复杂度。",
    exercise: { prompt: "使用栈判断括号序列是否合法。", hint: "遇到左括号入栈，右括号检查并弹出匹配项。" }, career: "调度、解析、撤销和缓存策略都依赖线性结构。"
  },
  {
    id: "trees-heaps", stageId: "algorithm", title: "树与堆", summary: "理解层次数据、二叉搜索树与优先队列。",
    content: ["树表达层次关系，遍历包括前序、中序、后序与层序。堆只保证父子优先关系，适合快速取得极值。", "平衡搜索树维持 O(log n) 操作；标准库 map/set 通常提供这一复杂度保证。"],
    example: { code: "#include <iostream>\n#include <queue>\nint main() {\n    std::priority_queue<int> q;\n    q.push(3); q.push(9); q.push(5);\n    std::cout << q.top();\n}", output: "9", explanation: "priority_queue 默认最大元素优先，底层通常使用堆。" },
    pitfalls: ["把堆当作完全排序结构。", "递归遍历极深树导致栈溢出。"], interviewTip: "掌握堆的建堆 O(n) 与单次 push/pop O(log n)。",
    exercise: { prompt: "用小顶堆找数组中最大的 K 个元素。", hint: "维护大小为 K 的堆，遇到更大元素时替换堆顶。" }, career: "索引、任务优先级与游戏场景树都建立在树结构上。"
  },
  {
    id: "hashing", stageId: "algorithm", title: "哈希", summary: "用散列将键快速映射到值。",
    content: ["哈希表通过哈希函数定位桶，平均查询接近 O(1)，最坏可退化到 O(n)。", "自定义键必须让相等对象产生相同哈希值，并避免轻易受控的碰撞攻击。"],
    example: { code: "#include <iostream>\n#include <string>\n#include <unordered_map>\nint main() {\n    std::unordered_map<std::string, int> score{{\"cpp\", 100}};\n    std::cout << score.at(\"cpp\");\n}", output: "100", explanation: "at 在键不存在时抛异常，不会静默插入。" },
    pitfalls: ["用 operator[] 查询导致不存在的键被插入。", "把平均 O(1) 当成绝对常数时间。"], interviewTip: "解释负载因子、rehash 与迭代器失效。",
    exercise: { prompt: "找出数组中第一个重复出现的整数。", hint: "用 unordered_set 记录已见元素。" }, career: "缓存、去重、路由和对象查找的基础。"
  },
  {
    id: "graphs", stageId: "algorithm", title: "图", summary: "描述复杂关系并使用 BFS、DFS 探索。",
    content: ["图由顶点和边组成，可有向或无向、加权或无权。邻接表适合稀疏图。", "BFS 按层扩展，可求无权最短路；DFS 适合连通性、拓扑与回溯。"],
    example: { code: "#include <iostream>\n#include <queue>\n#include <vector>\nint main() {\n    std::vector<std::vector<int>> g{{1,2},{3},{3},{}};\n    std::queue<int> q; q.push(0);\n    std::vector<bool> seen(4); seen[0] = true;\n    while (!q.empty()) { int u=q.front(); q.pop(); std::cout<<u<<' '; for(int v:g[u]) if(!seen[v]) seen[v]=true,q.push(v); }\n}", output: "0 1 2 3", explanation: "入队时标记可避免同一节点被重复加入。" },
    pitfalls: ["出队后才标记访问，造成重复入队。", "忘记处理非连通图。"], interviewTip: "能选择邻接矩阵/表，并给出 BFS/DFS 的 O(V+E)。",
    exercise: { prompt: "判断课程依赖图是否存在环。", hint: "尝试 DFS 三色标记或拓扑排序。" }, career: "依赖管理、网络路由、AI 导航和社交关系都可建模为图。"
  },
  {
    id: "search-dp", stageId: "algorithm", title: "排序、搜索与动态规划", summary: "掌握高频算法范式与状态设计。",
    content: ["二分查找依赖单调性；排序常用于预处理；动态规划通过状态和转移复用重叠子问题。", "写 DP 前先定义状态含义、初始条件、转移顺序和最终答案位置。"],
    example: { code: "#include <algorithm>\n#include <iostream>\n#include <vector>\nint main() {\n    std::vector<int> a{1, 4, 7, 9};\n    auto it = std::lower_bound(a.begin(), a.end(), 6);\n    std::cout << *it;\n}", output: "7", explanation: "lower_bound 返回第一个不小于目标的位置。" },
    pitfalls: ["二分边界混用闭区间与半开区间模板。", "DP 状态定义含糊，导致转移与初始化矛盾。"], interviewTip: "先写暴力递归，再识别重复子问题，通常更容易推导 DP。",
    exercise: { prompt: "求爬 n 级台阶的方法数，每次走 1 或 2 级。", hint: "dp[i] = dp[i-1] + dp[i-2]。" }, career: "算法面试重点考察建模、边界和复杂度沟通。"
  },
  {
    id: "git-cmake", stageId: "engineering", title: "Git 与 CMake", summary: "管理代码历史并构建多文件项目。",
    content: ["Git 提交应小而有意义，分支服务于协作隔离；CMake 用目标描述源码、依赖和编译要求。", "现代 CMake 优先 target_* 接口，不使用全局 include 或编译选项污染所有目标。"],
    example: { code: "cmake_minimum_required(VERSION 3.20)\nproject(StarCpp LANGUAGES CXX)\nadd_executable(star main.cpp)\ntarget_compile_features(star PRIVATE cxx_std_17)", output: "生成一个要求 C++17 的 star 可执行目标", explanation: "以目标为中心声明标准，依赖关系更清晰。" },
    pitfalls: ["把构建目录和二进制提交进仓库。", "依赖 IDE 私有配置，换环境无法构建。"], interviewTip: "能够解释静态库、动态库和可执行目标的链接关系。",
    exercise: { prompt: "建立含 app 与 library 两个目标的 CMake 项目。", hint: "使用 add_library，再用 target_link_libraries 连接。" }, career: "能在干净环境一键构建是作品集和入职协作的底线。"
  },
  {
    id: "testing", stageId: "engineering", title: "测试与质量", summary: "用自动化测试保护行为和边界。",
    content: ["单元测试验证小范围行为，集成测试验证组件协作。测试应覆盖正常路径、边界和失败路径。", "可测试设计通常意味着更清晰的依赖边界，而不是为覆盖率数字服务。"],
    example: { code: "#include <cassert>\nint add(int a, int b) { return a + b; }\nint main() {\n    assert(add(2, 3) == 5);\n    assert(add(-1, 1) == 0);\n}", output: "断言全部通过时没有输出", explanation: "真实项目使用测试框架；assert 示例用于理解断言思想。" },
    pitfalls: ["只测实现细节，重构即大面积失败。", "测试之间共享可变状态导致偶发失败。"], interviewTip: "说明如何测试异常、时间、文件和外部服务依赖。",
    exercise: { prompt: "为 clampValue 编写正常、边界、超界三组测试。", hint: "最小值和最大值本身也必须覆盖。" }, career: "测试能力是从练习代码跨越到可维护产品的重要标志。"
  },
  {
    id: "linux", stageId: "engineering", title: "Linux 基础", summary: "掌握进程、文件、权限与常用开发工具。",
    content: ["C++ 后端和系统岗位经常运行在 Linux。理解路径、文件描述符、进程、信号、权限和环境变量。", "学会通过编译器、调试器、性能工具和日志组合定位问题，而不是只背命令。"],
    example: { code: "#include <filesystem>\n#include <iostream>\nint main() {\n    for (const auto& entry : std::filesystem::directory_iterator(\".\"))\n        std::cout << entry.path().filename() << '\\n';\n}", output: "列出当前目录中的文件名", explanation: "C++17 filesystem 提供跨平台文件系统接口。" },
    pitfalls: ["写死绝对路径和平台分隔符。", "误把进程、线程和协程视为同一种隔离。"], interviewTip: "理解进程虚拟地址空间、系统调用与用户态/内核态边界。",
    exercise: { prompt: "编写工具统计目录中不同扩展名文件数量。", hint: "使用 filesystem 与 unordered_map。" }, career: "后端与系统开发的日常环境，也是部署排障基础。"
  },
  {
    id: "networking", stageId: "engineering", title: "网络编程", summary: "理解 TCP/IP、套接字与消息边界。",
    content: ["TCP 提供可靠字节流，但不保留消息边界；应用协议必须自行定义长度、分隔符或固定结构。", "网络操作会部分读写、超时和失败，生产服务需处理连接生命周期、背压和并发。"],
    example: { code: "// 长度前缀协议的核心思路\nstruct Header {\n    std::uint32_t payloadSize;\n};\n// 先完整读取固定长度 Header，\n// 再按网络字节序解析并读取 payloadSize 字节。", output: "每条消息都有明确边界", explanation: "TCP 一次 read 不保证对应一次 send，必须循环收满所需字节。" },
    pitfalls: ["假设一次 recv 能收到完整消息。", "忽略网络字节序、超时和恶意长度。"], interviewTip: "能说明 TCP 三次握手、四次挥手与粘包本质。",
    exercise: { prompt: "设计一个聊天消息协议，写出字段与失败处理。", hint: "考虑版本、类型、长度上限和编码。" }, career: "C++ 后端、基础设施和实时系统的核心领域。"
  },
  {
    id: "performance", stageId: "engineering", title: "性能分析", summary: "用测量定位瓶颈，理解缓存与分配成本。",
    content: ["优化流程是建立基线、采样定位热点、提出假设、修改并回归测量。不要先优化没有证据的代码。", "算法复杂度、缓存局部性、分配次数、锁竞争和 I/O 都可能是瓶颈。"],
    example: { code: "#include <chrono>\nauto start = std::chrono::steady_clock::now();\n// 运行待测代码\nauto elapsed = std::chrono::steady_clock::now() - start;", output: "得到单调时钟测量的耗时", explanation: "微基准需预热、多次运行并避免优化器删掉被测逻辑。" },
    pitfalls: ["用一次 wall-clock 测量得出结论。", "优化后不做正确性与真实性能回归。"], interviewTip: "给出一个通过 profiler 找到热点而不是凭感觉优化的案例。",
    exercise: { prompt: "比较 vector 预留容量前后的插入耗时和扩容次数。", hint: "调用 reserve，并对自定义类型记录移动次数。" }, career: "C++ 的竞争力常体现在可预测延迟和资源效率。"
  },
  {
    id: "code-quality", stageId: "engineering", title: "代码规范与安全", summary: "建立清晰接口、错误策略和自动质量门禁。",
    content: ["命名、所有权和错误处理应让意图可见。开启编译警告、静态分析和 Sanitizer，尽早发现未定义行为。", "安全设计包括输入限制、整数边界、资源上限和最小权限，而不只是避免语法错误。"],
    example: { code: "#include <optional>\nstd::optional<int> parsePort(int value) {\n    if (value < 1 || value > 65535) return std::nullopt;\n    return value;\n}", output: "有效端口返回值，无效端口返回空", explanation: "类型显式表达可能失败，调用者必须处理。" },
    pitfalls: ["吞掉异常或使用模糊错误码。", "信任外部输入的长度和范围。"], interviewTip: "说明异常、optional、expected 风格结果各自适合的错误类型。",
    exercise: { prompt: "为读取数组元素设计不会越界的接口。", hint: "可返回 optional<reference_wrapper<const T>>。" }, career: "成熟团队看重代码审查、可观察性与安全边界。"
  },
  {
    id: "backend-track", stageId: "career", title: "后端开发路线", summary: "连接 Linux、网络、并发、数据库与服务治理。",
    content: ["后端方向应能实现可观测的网络服务：协议解析、并发模型、缓存、数据库、超时重试与优雅退出。", "项目重点不是堆功能，而是展示吞吐、延迟、错误处理和压测证据。"],
    example: { code: "struct RequestContext {\n    std::string traceId;\n    std::chrono::steady_clock::time_point deadline;\n};\n// 每次请求携带追踪标识与截止时间", output: "请求可以被追踪，并在超时后停止无效工作", explanation: "工程化服务必须把可观察性和资源边界放进设计。" },
    pitfalls: ["只实现 happy path，没有超时和断连处理。", "只报告 QPS，不说明机器、请求和延迟分位数。"], interviewTip: "准备一个能深入解释线程模型、协议、瓶颈和故障恢复的服务项目。",
    exercise: { prompt: "设计一个短链接服务，画出接口、存储、缓存和失败路径。", hint: "先估算读写比例和数据规模，再选择组件。" }, career: "目标岗位：C++ 后端、基础设施、存储、实时服务。"
  },
  {
    id: "game-track", stageId: "career", title: "游戏开发路线", summary: "补齐数学、渲染、引擎架构与实时性能。",
    content: ["游戏方向在 C++ 基础上学习线性代数、图形管线、资源系统、ECS、动画、物理和工具链。", "作品应展示稳定帧时间、清晰模块边界和可操作的场景，而不是只跟随教程复刻。"],
    example: { code: "struct Transform {\n    Vec3 position;\n    Quaternion rotation;\n    Vec3 scale{1, 1, 1};\n};\n// 将空间状态与渲染、物理系统解耦", output: "实体可由多个系统共享统一空间数据", explanation: "真实引擎会进一步处理父子层级、矩阵缓存与坐标系。" },
    pitfalls: ["忽视数学基础，靠试参数修正渲染结果。", "平均 FPS 很高，却存在明显长帧卡顿。"], interviewTip: "能逐帧解释输入、更新、物理、动画、渲染的执行顺序。",
    exercise: { prompt: "实现一个固定时间步小游戏循环并记录帧耗时。", hint: "区分渲染帧率与物理更新频率。" }, career: "目标岗位：客户端、引擎、图形、玩法与工具开发。"
  },
  {
    id: "embedded-track", stageId: "career", title: "嵌入式路线", summary: "在有限资源和硬件约束下写可预测代码。",
    content: ["嵌入式方向补充数字电路、寄存器、中断、通信总线、RTOS、交叉编译与硬件调试。", "需要明确哪些语言特性可用，避免不可控分配、异常成本或动态初始化。"],
    example: { code: "#include <cstdint>\nvolatile std::uint32_t* const status = reinterpret_cast<std::uint32_t*>(0x40000000);\nbool ready() { return (*status & 0x1u) != 0; }", output: "读取内存映射寄存器的最低位状态", explanation: "示意代码依赖具体芯片手册；volatile 不等于线程同步。" },
    pitfalls: ["把 volatile 当作原子或内存屏障。", "忽略栈大小、对齐、端序和实时截止时间。"], interviewTip: "能解释中断上下文限制、内存映射 I/O 与交叉编译。",
    exercise: { prompt: "设计按键消抖状态机，并写出状态转换。", hint: "用固定周期采样和稳定计数，不用阻塞延时。" }, career: "目标岗位：MCU、机器人、汽车电子、IoT 与实时控制。"
  },
  {
    id: "systems-track", stageId: "career", title: "系统开发路线", summary: "深入操作系统、编译器、存储与高性能基础设施。",
    content: ["系统方向需要理解虚拟内存、文件系统、进程线程、系统调用、同步原语、ABI 与硬件缓存。", "项目应展示正确性边界、可移植性、基准测试和故障场景，而不只是调用系统 API。"],
    example: { code: "class FileDescriptor {\npublic:\n    explicit FileDescriptor(int fd) : fd_(fd) {}\n    ~FileDescriptor();\n    FileDescriptor(const FileDescriptor&) = delete;\nprivate:\n    int fd_;\n};", output: "文件描述符由对象独占并自动关闭", explanation: "这把操作系统资源包装成不可复制的 RAII 类型。" },
    pitfalls: ["不了解 ABI 就跨模块传递不稳定类型。", "基准只测热缓存或完全不符合生产负载。"], interviewTip: "选择一个 OS 主题画图讲清数据从用户态到内核再到设备的路径。",
    exercise: { prompt: "设计一个线程安全的有界阻塞队列。", hint: "使用 mutex、两个条件变量，并处理关闭状态。" }, career: "目标岗位：操作系统、数据库、编译器、存储与高性能计算。"
  },
  {
    id: "portfolio", stageId: "career", title: "作品集项目", summary: "用可运行、可测量、可解释的项目证明能力。",
    content: ["一个好项目包含明确问题、架构图、构建步骤、测试、性能数据、已知限制和下一步，而不只是源代码。", "选择一个主项目深入打磨，再用小项目证明不同基础能力。提交历史也应反映真实迭代。"],
    example: { code: "README 结构\n1. 问题与目标\n2. 架构与关键取舍\n3. 一键构建/运行\n4. 测试与性能数据\n5. 已知限制与复盘", output: "招聘者可以在几分钟内理解并验证项目", explanation: "文档与可复现性是项目质量的一部分。" },
    pitfalls: ["项目范围过大，最终没有可运行版本。", "复制教程项目却无法解释关键取舍。"], interviewTip: "用 STAR 结构准备项目冲突、性能优化和缺陷修复故事。",
    exercise: { prompt: "为你的目标岗位写一页项目设计说明。", hint: "先定义可验收的最小版本和三项技术亮点。" }, career: "作品集把知识点转化为可信的工程证据。"
  },
  {
    id: "interview", stageId: "career", title: "面试与简历", summary: "把知识、项目和解决问题过程清晰表达出来。",
    content: ["简历应围绕目标岗位写可验证成果：做了什么、解决何种问题、采用何种技术、结果如何。", "面试中先澄清需求，再说明方案与复杂度，边写边验证边界；不会时展示推理和排查能力。"],
    example: { code: "项目描述公式\n动词 + 场景/规模 + 技术决策 + 可验证结果\n\n示例：为并发日志系统设计有界队列，\n通过批量写入降低锁竞争，并用基准记录 P99 延迟。", output: "一条具体、可追问且有证据的项目描述", explanation: "不要捏造数字；没有生产数据时可明确写本地基准环境。" },
    pitfalls: ["简历堆满技术名词，却没有决策和结果。", "背标准答案，追问生命周期或边界时无法推导。"], interviewTip: "建立错题与项目追问表，每次模拟后补证据而非只背结论。",
    exercise: { prompt: "把一条“负责某模块”改写为包含问题、行动和结果的描述。", hint: "结果可以是测试覆盖、延迟、内存、缺陷或交付效率。" }, career: "把准备转化为岗位匹配度和可信沟通。"
  }
];

const positions = [
  { x: 13, y: 25 }, { x: 42, y: 13 }, { x: 72, y: 26 },
  { x: 26, y: 58 }, { x: 58, y: 54 }, { x: 82, y: 77 },
];

export const knowledgeNodes: KnowledgeNode[] = seeds.map((seed, index) => {
  const stageTopics = seeds.filter((item) => item.stageId === seed.stageId);
  const withinStage = stageTopics.findIndex((item) => item.id === seed.id);
  const previous = index > 0 ? seeds[index - 1] : undefined;
  return {
    ...seed,
    goal: `完成本节后，你能够理解${seed.title}的核心概念，并在小型程序中正确使用它。`,
    prerequisiteIds: previous ? [previous.id] : [],
    position: positions[withinStage],
  };
});

export const EMPTY_PROGRESS: LearningProgress = {
  version: 1,
  completedIds: [],
  favoriteIds: [],
};

export const PROGRESS_STORAGE_KEY = "cpp-star-map-progress-v1";
