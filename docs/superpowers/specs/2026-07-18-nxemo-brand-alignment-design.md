# NxEmO Brand Alignment Design

## Goal

把当前基于 Land1ngW 主页改造中的品牌残留整理为清晰、可信的层级：NxEmO 是个人主品牌，Whither Studio 是 NxEmO 的工作室，Land1ngW 只作为原设计来源致谢。

## Brand hierarchy

- 页面主身份统一为 `NxEmO`。
- 工作室以 `Whither Studio` 作为从属身份出现，不替代个人名称。
- 浏览器标题使用 `NxEmO — Graphics Programmer | Whither Studio`。
- 首屏动态标题只在 `NxEmO` 与 `Whither Studio` 之间切换。
- 侧边栏主品牌使用 `NxEmO`，副标题体现图形/游戏开发定位。
- 页脚使用 `NxEmO · Whither Studio · <current year>`，并写明 `Based on Land1ngW's design · Built with Next.js`。

## Content cleanup

- 删除 `Test Name`、`You-know-Who`、`phone: "test"` 和“待修改”等测试内容。
- 删除未实现的“知乎文章每日自动同步”声明。
- 删除来自原主页作者的职位头衔、教育、工作经历、技能和文章内容，避免将他人的履历归属于 NxEmO。
- 在 NxEmO 尚未提供自己的履历和作品前，不显示 Experience、Skills、Writing 导航或空白板块。
- 首屏只使用已确认的定位 `Game Developer · Whither Studio`，不声称未经确认的公司、学校或技术专长。
- README 保留并强化对 Land1ngW 的来源说明，同时更新实际使用的 Next.js 版本和当前功能状态。

## Interaction and accessibility

- 保留现有打字机效果，但只轮播两个有效品牌名称。
- 修复打字机状态切换触发的 lint 错误，不增加新的依赖。
- 为循环动画提供 `prefers-reduced-motion` 降级，使选择减少动态效果的用户得到静态内容。
- 提高次要正文颜色的可读性，但保持现有深色蓝灰视觉体系。

## Code quality

- 删除未使用的知乎图标与移动端菜单状态。
- 删除不再使用的履历数据和 Experience、Skills、Articles 组件引用。
- 不重构现有组件体系，不增加博客、项目展示、联系方式或工作室独立页面。
- 保持 Next.js 静态导出和现有 GitHub Pages 部署方式。

## Verification

- 品牌文本检查：代码与构建产物中不再出现测试身份或虚假的同步声明。
- `eslint` 必须以 0 个错误、0 个警告退出。
- Next.js 生产构建必须成功完成静态导出。
- 线上结构的桌面与 320px/390px 响应式布局不因本次修改产生横向溢出。

## Out of scope

- 新增 NxEmO 尚未提供的履历、技能、作品集卡片或可视化项目案例。
- 接入知乎同步、博客系统、CMS 或独立域名。
- 重写整体视觉设计。
- 发布、推送或修改 GitHub Pages 线上环境。
