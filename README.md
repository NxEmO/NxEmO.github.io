# NxEmO · Whither Studio

NxEmO 的个人主页、个人文章索引与 Whither Studio 的线上入口，使用 Next.js 16 构建，并通过 GitHub Pages 发布静态文件。

早期视觉设计基于 Land1ngW 的主页设计；当前布局参考 [Shrei 的博客](https://zushinzackery2-ship-it.github.io/blog/)，采用顶部导航、个人资料侧栏、背景壁纸与磨砂卡片，保留 NxEmO / Whither Studio 的品牌信息与仓库内原有背景图。

## Appearance

- 顶部可切换自动 / 浅色 / 深色主题，以及水波、磨砂和雨滴效果。外观偏好保存在当前浏览器中。
- 水波默认开启：WebGL 对原背景图进行实时折射，鼠标移动、点击和触摸会激起涟漪；开启雨滴后会增加水面落点。水波与雨滴可以独立关闭。
- 雨滴默认关闭：开启后显示玻璃上的滑落水滴、细小水珠和湿润拖尾，局部折射背景；关闭水波也能单独使用雨滴。磨砂默认开启，切换会同时改变卡片的模糊程度与透明度；手机端显示带文字的独立控制栏。
- WebGL 不可用或系统开启“减少动态效果”时显示原静态壁纸；页面隐藏时停止渲染，移动端限制为 30 帧和较低分辨率。
- 自动主题跟随系统，雨滴默认关闭；系统开启“减少动态效果”时停止装饰动画。
- 手机端显示紧凑个人资料和完整导航，文章继续读取本地 Markdown 与知乎索引。

## Local articles

完整的站内文章放在 `content/articles/`，每篇文章是一个 Markdown 文件：

```md
---
title: Graphics Notes
excerpt: A short summary shown in the writing index.
date: 2026-08-17
slug: graphics-notes
---

Article body in Markdown.
```

- `/writing/` 展示站内文章和知乎文章摘要。
- `/articles/<slug>/` 展示完整的站内文章。
- 站内文章在构建时生成静态 HTML，文章内容和版本历史保存在 Git 仓库中。

## Zhihu index sync

网站只同步知乎文章的标题、摘要、发布时间和原文链接，不复制知乎全文。GitHub Actions 每天运行 `npm run sync:zhihu`，通过知乎开放平台的“用户的内容 API”获取你的文章，成功后更新 `data/zhihu.json`，再由部署流程重新构建网站。

官方接口地址是 `https://developer.zhihu.com/api/v1/user/contents`。获取你自己的内容时，不需要 OAuth Token；同步脚本会自动发送 `ContentType=article`、分页参数和时间戳。

要启用自动同步，请在 GitHub 仓库的 Actions secrets 中配置：

- `ZHIHU_API_TOKEN`：知乎开放平台个人中心生成的 Access Secret。

同步脚本不会抓取登录页面、Cookie 或浏览器状态。没有配置 Access Secret 时会保留当前快照；同步失败也不会清空已有文章。

## Commands

```bash
npm run dev
npm run lint
npm run build
npm run sync:zhihu
```
