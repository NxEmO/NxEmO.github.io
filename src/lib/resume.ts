export const profile = {
  name: "NxEmO",
  nameReal: "You-know-Who",
  title: "游戏客户端",
  subtitle: "Unity",
  email: "439534716@qq.com",
  phone: "test",
  github: "https://github.com/NxEmO",
};

export const education = [
  {
    school: "山西大学",
    badge: "双一流",
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
];

export const skills = [
  {
    category: "图形 API",
    items: ["OpenGL", "Vulkan", "DirectX 12", "NVIDIA OptiX", "DXR"],
  },
  {
    category: "引擎与语言",
    items: ["Unity", "C++", "HLSL / GLSL", "C#","Lua",],
  },
  {
    category: "渲染技术",
    items: [
      "全局光照 (GI)",
      "Nanite",
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
