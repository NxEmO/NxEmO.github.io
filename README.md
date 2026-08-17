# NxEmO · Whither Studio

NxEmO 的个人主页、个人文章索引与 Whither Studio 的线上入口，使用 Next.js 16 构建，并通过 GitHub Pages 发布静态文件。

视觉设计基于 Land1ngW 的主页设计，并按 NxEmO / Whither Studio 的品牌信息重新整理。

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
