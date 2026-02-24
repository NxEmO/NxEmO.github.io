# 王若淼 · 个人网站

基于 Next.js 15 构建的个人主页，自动部署至 GitHub Pages，每日同步知乎文章。

## 技术栈

- **框架**: Next.js 15 (App Router) + TypeScript
- **样式**: Tailwind CSS v4
- **部署**: GitHub Pages（静态导出）
- **爬虫**: Python + GitHub Actions 定时任务

## 本地开发

```bash
npm install
npm run dev
```

## 部署到 GitHub Pages

### 1. 创建仓库

在 GitHub 创建名为 `<你的用户名>.github.io` 的仓库，推送代码。

### 2. 配置 GitHub Pages

进入仓库 **Settings → Pages**，将 Source 设置为 **GitHub Actions**。

### 3. 配置知乎 Cookie（爬虫必须）

1. 浏览器登录知乎，按 F12 打开开发者工具
2. Network 选项卡 → 刷新页面 → 找到对 `www.zhihu.com` 的请求
3. 复制请求头中的 `Cookie` 字段完整内容
4. 进入 GitHub 仓库 **Settings → Secrets and variables → Actions**
5. 新建 secret，名称填 `ZHIHU_COOKIE`，值粘贴刚才复制的 Cookie

### 4. 手动触发首次爬取

进入 **Actions → Scrape Zhihu Articles → Run workflow**，手动运行一次，之后每天 10:00（北京时间）自动运行。

## 目录结构

```
├── .github/workflows/
│   ├── deploy.yml        # 构建并部署到 GitHub Pages
│   └── scrape.yml        # 每日定时爬取知乎文章
├── data/
│   └── articles.json     # 爬虫自动更新的文章数据
├── scripts/
│   └── scrape_zhihu.py   # 知乎爬虫脚本
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # 页面组件
│   └── lib/resume.ts     # 简历静态数据
└── requirements.txt      # Python 依赖
```

## 更新简历内容

编辑 `src/lib/resume.ts` 文件即可更新个人信息、实习经历和技能。
