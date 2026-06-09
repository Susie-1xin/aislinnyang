<div align="center">

# 🌻 aislinnyang.com

**Personal site source · plus the Agent Skills I use every day**

[![Live](https://img.shields.io/badge/live-aislinnyang.com-F38020?style=flat-square&logo=cloudflare&logoColor=white)](https://aislinnyang.com)
[![Built with Claude Code](https://img.shields.io/badge/built%20with-Claude%20Code-D97757?style=flat-square&logo=anthropic&logoColor=white)](https://claude.com/claude-code)
[![License: MIT](https://img.shields.io/badge/license-MIT-111111?style=flat-square)](LICENSE)

[中文](README.md) · English

<a href="https://aislinnyang.com"><img src="docs/home.png" width="760" alt="aislinnyang.com homepage"></a>

</div>

> I'm Susie, also Aislinn. Two years in AI product growth, with a soft spot for GTM, SEO/GEO, and zero-to-one launches. I've worked on AI music, video, and virtual-companion products, on both the brand side and the agency side.
>
> This is my vibe-coded personal site. It holds the essence of my thinking (it does not, but you're welcome to read 🌻).

Two things live here: the site source in `site/`, and the Agent Skills I use every day to do growth in `skills/`.

## Layout

```
aislinnyang/
├── site/       # aislinnyang.com source (static site, Cloudflare Pages)
│   ├── index.html      home
│   ├── about.html      about
│   ├── cooking.html    /cooking · an editorial photo grid of my cooking
│   ├── welcome.html    first-visit onboarding
│   ├── script.js / style.css
│   ├── assets/         images, fonts, PDF résumés, etc.
│   └── CLAUDE.md       Claude Code context for the site (voice, tone, rules)
└── skills/     # Agent Skills collection (work in progress)
```

## Run the site locally

`site/` is a plain static site, so any static server works:

```bash
cd site
python3 -m http.server 8000
# open http://localhost:8000
```

Deployment is on Cloudflare (`site/wrangler.jsonc`).

## Skills

`skills/` collects the Agent Skills I use every day, following the [Agent Skills open standard](https://docs.claude.com/en/docs/claude-code/skills) so they load directly in Claude Code and other agents. Still being tidied up, see [`skills/README.md`](skills/README.md).

## License

[MIT](LICENSE) · free to use / modify / redistribute. The writing, photos, and personal content on the site are mine; the code and structure are yours to learn from.

---

<div align="center">

By [**Yixin Yang (Aislinn)**](https://aislinnyang.com) · growth for AI products · going global · occasionally vibe-coding 🌻

</div>
