export const profile = {
  name: "Land1ngW",
  nameReal: "王若淼",
  title: "游戏引擎开发 / 图形渲染工程师",
  subtitle: "UE5 · 全局光照 · 渲染管线 · 光线追踪",
  email: "1738832489@qq.com",
  phone: "17304471585",
  zhihu: "https://www.zhihu.com/people/wrm-66-76",
  github: "https://github.com/LandingW",
};

export const education = [
  {
    school: "华南理工大学",
    badge: "985 · 双一流",
    degree: "本科 · 软件工程",
    period: "2024.09 — 至今",
  },
];

export const experiences = [
  {
    company: "腾讯 IEG",
    department: "天美 G1 工作室",
    role: "游戏引擎开发实习生（UE5）",
    period: "2025.05 — 至今",
    highlights: [
      {
        title: "独立支撑 G1 预研 3A 项目 GI 方案落地",
        desc: "作为核心开发者，独立承担 G1 工作室预研 3A 项目全局光照技术方案的设计与工程落地。从零搭建适配中低算力平台的自研 GI 烘焙管线，将 Skylight Visibility 从运行时解耦为离线预计算，彻底替代 UE 原生 DFAO 方案；同时兼容 TOD（Time of Day）动态天光变化，系统性解决了漏光、性能瓶颈与画面稳定性问题，方案已通过项目组技术评审并进入集成阶段。",
      },
      {
        title: "Probe 自适应偏移与有效性评估系统",
        desc: "针对复杂几何场景下光照探针数据不稳定的共性问题，设计并实现 Probe 自适应偏移与有效性评估机制。通过对探针周围几何遮挡关系的离线分析，动态调整探针采样位置，配合有效性权重剔除无效探针数据，显著提升间接光结果在角色走廊、密集建筑等复杂场景下的可靠性与视觉稳定性。",
      },
      {
        title: "大规模场景 GI 数据流式加载与显存优化",
        desc: "针对预研 3A 项目超大开放世界地图的内存与显存压力，将全局光照系统与场景分块逻辑解耦，设计基于视距与探针重要度的独立 GI Streaming 机制。在给定 atlas 预算下进行异步优先级排序，自适应加载近场高精度探针数据，有效消除因场景流式加载/卸载引发的渲染线程帧率抖动，同时保证视觉质量不降级。",
      },
      {
        title: "Nanite 架构下特效渲染管线定制",
        desc: "针对 UE Nanite VisBuffer 架构无法直接兼容传统粒子特效渲染的深层痛点，深入 UE 渲染管线底层，定制 MeshDrawCommand 生成流程与 Primitive 收集逻辑，在完整保留 Nanite 虚拟几何高保真细节的前提下，成功支持特效所需的深度写入、模板测试与交互逻辑，打通了美术特效工作流与 Nanite 场景的协作瓶颈。",
      },
      {
        title: "技术沉淀与跨团队输出",
        desc: "结合项目实战，深度撰写多篇涵盖 UE 管线定制、GI 系统架构、源码模块解析的技术文档，多次入选公司级技术精选与头条推荐，有效沉淀了可复用的工程知识资产，并在跨项目组技术分享中获得正向反馈。",
      },
    ],
  },
  {
    company: "腾讯 IEG",
    department: "游戏前沿技术部",
    role: "腾讯引擎图形学远程人才培养计划",
    period: "2024 — 2025",
    highlights: [
      {
        title: "硬件光线追踪光照烘焙器开发",
        desc: "参与并深度开发基于 DXR 硬件光线追踪的自研光照烘焙器，负责扩展材质采样模型，新增对半透明材质、薄玻璃等复杂能量传输路径的支持，完善光线在非不透明介质中的传输与衰减计算，为高质量间接光结果提供更准确的材质响应基础。",
      },
      {
        title: "现代 GI 算法研究与工程实践",
        desc: "系统研究并实践 ReSTIR GI / ReSTIR DI / DDGI 等现代全局光照技术，深入理解各方案的采样策略、收敛特性与工程约束；熟悉 DXR 与 NVIDIA OptiX 完整工作流，具备从加速结构构建、光线调度、着色到降噪协同的全链路工程级理解与实践经验。",
      },
    ],
  },
];

export const skills = [
  {
    category: "图形 API",
    items: ["OpenGL", "Vulkan", "DirectX 12", "NVIDIA OptiX", "DXR"],
  },
  {
    category: "引擎与语言",
    items: ["UE5 / Unreal Engine", "C++", "HLSL / GLSL", "Python"],
  },
  {
    category: "渲染技术",
    items: [
      "全局光照 (GI)",
      "路径追踪",
      "ReSTIR GI / DI",
      "DDGI",
      "Nanite",
      "光照烘焙",
      "实时光追",
    ],
  },
  {
    category: "GPU 架构",
    items: [
      "TBR / TBDR 移动端架构",
      "SIMT 执行模型",
      "Shader 性能优化",
      "Subpass / Framebuffer Fetch",
    ],
  },
  {
    category: "调试工具",
    items: ["RenderDoc", "PIX", "Nsight", "WinDbg", "LLDB / Rider"],
  },
  {
    category: "工程实践",
    items: [
      "UE5 源码级二次开发",
      "渲染管线定制",
      "Crash Dump 分析",
      "AI 辅助工程（Cursor / Gemini CLI）",
    ],
  },
];

export const navSections = [
  { id: "home", label: "Home" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "articles", label: "Writing" },
];
