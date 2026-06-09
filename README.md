<div align="center">

# 🌻 aislinnyang.com

**我做 AI 产品增长，顺手把个人网站和日常在用的工具开源了。**

[![Live](https://img.shields.io/badge/live-aislinnyang.com-F38020?style=flat-square&logo=cloudflare&logoColor=white)](https://aislinnyang.com)
[![Built with Claude Code](https://img.shields.io/badge/built%20with-Claude%20Code-D97757?style=flat-square&logo=anthropic&logoColor=white)](https://claude.com/claude-code)
[![License: MIT](https://img.shields.io/badge/license-MIT-111111?style=flat-square)](LICENSE)

中文 · [English](README.en.md)

<a href="https://aislinnyang.com"><img src="docs/home.png" width="760" alt="aislinnyang.com 首页"></a>

</div>

> 网站不是一个成就展示页。它想回答的是：**这个人在生活里、在工作中，到底是什么样子。** 怎么想事情、在做什么、在纠结什么、想过成什么样的生活。

我做增长，不写产品代码，但要用的工具基本自己动手，用 Claude Code "vibe" 出来。这个网站（`site/`）就是这么来的：纯手写 HTML / CSS / JS，丢在 Cloudflare Pages 上。而我最想分享的是 `skills/`，我每天真正拿来做增长的那些 Agent Skills。

## 目录结构

```
aislinnyang/
├── site/       # aislinnyang.com 网站源码（静态站，Cloudflare Pages）
│   ├── index.html      首页
│   ├── about.html      关于
│   ├── cooking.html    /cooking · 我做饭的编辑式图墙
│   ├── welcome.html    第一次访问的 onboarding
│   ├── script.js / style.css
│   ├── assets/         图片、字体、PDF 简历等
│   └── CLAUDE.md       这个站的 Claude Code 上下文（怎么写、什么调性）
└── skills/     # Agent Skills 集合（整理中）
```

## 本地预览

`site/` 是纯静态站，随便起个静态服务器就能看：

```bash
cd site
python3 -m http.server 8000
# 打开 http://localhost:8000
```

部署用的是 Cloudflare（`site/wrangler.jsonc`）。

## Skills

`skills/` 目录收录我自己每天在用的 Agent Skills，遵循 [Agent Skills 开放标准](https://docs.claude.com/en/docs/claude-code/skills)，可以在 Claude Code 等 Agent 里直接加载。这部分还在整理，详见 [`skills/README.md`](skills/README.md)。

## License

[MIT](LICENSE) · 自由使用 / 修改 / 再分发。网站里的文字、照片和个人内容版权归我所有，代码结构随便拿去参考。

---

<div align="center">

By [**Yixin Yang (Aislinn)**](https://aislinnyang.com) · 做 AI 产品增长 / 出海 / 偶尔 vibe coding 🌻

</div>
