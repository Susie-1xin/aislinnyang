# aislinnyang

[中文](README.md) · **English**

Source code for my personal site [aislinnyang.com](https://aislinnyang.com), plus a few of the Agent Skills I use day to day, open-sourced.

[![aislinnyang.com homepage](docs/home.png)](https://aislinnyang.com)

The site isn't an achievement showcase. It tries to answer one question: **what is this person actually like, in real life and at work?** How she thinks, what she's building, what she's overthinking, what kind of life she's trying to build. The stack is light: hand-written HTML / CSS / JS, deployed on Cloudflare Pages, mostly "vibe-coded" with Claude Code.

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

By [Yixin Yang (Aislinn)](https://aislinnyang.com) · growth for AI products · going global · occasionally vibe-coding.
