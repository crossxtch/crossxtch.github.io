# lazahata

Static site for the **lazahata** project. The homepage is an in-browser
EPUB/TXT/MOBI/FB2 → `.xtch` converter. **yomu** and **Cookbook** (a macOS
app) have their own pages.

- Converter: `/`
- yomu: `/crossxtch/` — flash an Xteink X3 or X4 from Chrome or Edge. https://github.com/crossxtch/yomu-se
- Cookbook: `/cookbook/` — https://github.com/yibeilahei/cookbook

This Next.js app **exports a static site** — no server, no uploads. The
converter runs entirely in the browser. The yomu page flashes firmware
over USB from the browser. `npm run dev` and `npm run build` download the
latest X3 and X4 firmware into `public/firmware/`.

## Develop

```bash
npm install
npm run dev
```

Open http://localhost:3000

```bash
npm test
```

## Build a static site

```bash
npm run build
```

Output is written to `out/`. Preview it with:

```bash
npm start
```
