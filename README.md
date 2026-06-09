<div align="center">

# 🌻 aislinnyang.com

**个人网站源码 · 加上我每天在用的 Agent Skills**

[![Live](https://img.shields.io/badge/live-aislinnyang.com-F38020?style=flat-square&logo=cloudflare&logoColor=white)](https://aislinnyang.com)
[![Built with Claude Code](https://img.shields.io/badge/built%20with-Claude%20Code-D97757?style=flat-square&logo=anthropic&logoColor=white)](https://claude.com/claude-code)
[![License: MIT](https://img.shields.io/badge/license-MIT-111111?style=flat-square)](LICENSE)

中文 · [English](README.en.md)

<a href="https://aislinnyang.com"><img src="site/assets/home.png" width="760" alt="aislinnyang.com 首页"></a>

</div>

> 我是苏西，也可以叫我 **Aislinn**。两年 AI 产品增长，尤其擅长 GTM、SEO/GEO、产品冷启动；做过 AI 音乐、视频、虚拟陪伴，做过甲方也待过乙方。
>
> 这是我 vibe coding 出来的个人网站，里面是我个人思想的精华（其实不是，欢迎大家阅读 🌻）。

仓库里就两块：网站源码在 `site/`，我每天用来做增长的 Agent Skills 在 `skills/`。

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
