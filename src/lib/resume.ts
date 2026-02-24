export const profile = {
  name: "王若淼",
  nameEn: "Wang Ruomiao",
  title: "游戏引擎开发 / 图形程序工程师",
  subtitle: "UE5 · 全局光照 · 渲染管线 · 光线追踪",
  email: "1738832489@qq.com",
  phone: "17304471585",
  zhihu: "https://www.zhihu.com/people/wrm-66-76",
  github: "https://github.com",
  avatar: null,
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
    department: "天美 G 工作室",
    role: "游戏引擎开发实习生（UE5）",
    period: "2025.05 — 至今",
    highlights: [
      {
        title: "全局光照系统核心模块开发",
        desc: "独立负责面向中低算力平台的自研 GI 烘焙管线开发，将 Skylight Visibility 从运行时解耦为离线预计算，替代 UE DFAO，显著降低动态天光运行时开销，同时兼容 TOD，解决漏光与性能瓶颈问题；设计并实现 Probe 自适应偏移与有效性评估机制，提升间接光数据在复杂几何场景下的可靠性。",
      },
      {
        title: "大规模场景 GI 数据流式加载与内存优化",
        desc: "针对超大世界场景内存与显存压力，设计并实现基于视距与重要度的独立 GI 数据 Streaming 机制，在给定预设 atlas 容忍度下异步排序、自适应加载重要探针详细数据，避免因场景加载/卸载引发的渲染线程卡顿。",
      },
      {
        title: "管线定制与美术工作流赋能",
        desc: "针对 UE Nanite 架构下 VisBuffer 无法兼容传统特效渲染的痛点，通过定制 MeshDrawCommand 生成流程与 Primitive 收集逻辑，在保留 Nanite 高保真几何细节的同时实现了特效所需的深度/模板测试与交互逻辑。",
      },
      {
        title: "技术沉淀与团队赋能",
        desc: "深度撰写多篇涵盖 UE 管线定制、UE 模块源码解析、技术实现细节等技术文档，多次获选公司级技术精选/头条推荐，有效提升团队技术复用率。",
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
        title: "基于光线追踪的光照烘焙器开发",
        desc: "参与并深度开发基于硬件光线追踪的自研光照烘焙器，扩展材质采样模型，支持半透明、薄玻璃等复杂能量传输路径，完善光线在非不透明介质中的传输与衰减计算。",
      },
      {
        title: "全局光照与光线追踪技术积累",
        desc: "系统性理解并实践 ReSTIR GI / ReSTIR DI / DDGI 等现代 GI 技术方案，熟悉 DXR 与 NVIDIA OptiX 光线追踪工作流，对完整光线追踪渲染管线具备工程级理解与实践经验。",
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
