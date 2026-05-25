# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A blog/note-taking website template based on Markdown + Obsidian + VitePress. Simplified from [nolebase](https://github.com/nolebase/nolebase/) for use as a template.

## Commands

```bash
pnpm install           # Install dependencies
pnpm docs:dev          # Start dev server (runs update + vitepress dev)
pnpm docs:build        # Production build (runs update + vitepress build)
pnpm docs:serve        # Serve the built site
pnpm update            # Manually run metadata generation script
```

- The `update` script (`scripts/update.ts`) must run before dev/build — it scans markdown files, generates sidebar structure, processes tags from frontmatter, and computes content hashes.
- No test framework is configured.

## Project Structure

```
.vitepress/
  config.ts              # VitePress config (nav, sidebar, markdown extensions, OG images)
  creators.ts            # Creator/contributor metadata (avatars, social links)
  docsMetadata.json      # Auto-generated sidebar tree & tag data (gitignored? generated)
  docsTagsAlias.json     # Manual tag alias mappings
  components.d.ts        # Auto-generated component types
  theme/
    index.ts             # Theme entry: registers plugins, components, giscus comments
    components/          # Vue components: HomePage, DocFooter, Share, TocList, AppContainer
  styles/
    main.css             # Global styles, font faces, responsive layout
    vars.css             # CSS custom properties (brand colors, badges, homepage)
metadata/
  index.ts               # Site metadata: name, description, GitHub/Discord links, domain
scripts/
  update.ts              # Pre-build script: scans笔记/ for .md files, builds sidebar & tags
  types/metadata.d.ts    # TypeScript types for metadata structures
vite.config.ts           # Vite plugins: UnoCSS, GitChangelog, PageProperties, etc.
uno.config.ts            # UnoCSS config with presetUno, presetAttributify, presetIcons
```

## Architecture

**Content**: All notes live under `笔记/` as Markdown files with frontmatter (tags, progress, etc.). The `update.ts` script scans this directory to auto-generate the sidebar tree and tag index.

**VitePress Config** (`.vitepress/config.ts`): Defines navigation, sidebar (from auto-generated metadata), search (local with tags/title in index), markdown extensions (footnotes, mathjax, bidirectional links, lazy images, inline link previews), and OG image generation at build end.

**Theme** (`.vitepress/theme/index.ts`): Extends the default VitePress theme with Nolebase plugins:
- Enhanced readabilities (layout switch, spotlight)
- Git changelog (file history + contributors per page)
- Inline link preview
- Page properties (tags, progress, word count, reading time)
- Highlight targeted heading
- Giscus comment system (GitHub Discussions-based)

**Nolebase Plugins**: The project heavily uses `@nolebase/*` plugins (v2.0.0-rc11) for enhanced Markdown and VitePress features. These are configured across `vite.config.ts` (build-time), `.vitepress/config.ts` (markdown-it), and `.vitepress/theme/index.ts` (client-side).

**Build Pipeline**:
1. `scripts/update.ts` runs → scans `笔记/**/*.md`, parses frontmatter, builds sidebar JSON, processes tags
2. VitePress builds the site → generates OG images, applies Vite plugins
3. Output goes to `.vitepress/dist/`

## Key Customizations

- **Site metadata**: Edit `metadata/index.ts` to change site name, description, GitHub/Discord links
- **Creators**: Edit `.vitepress/creators.ts` to add/remove contributors (shown in page footers)
- **Giscus comments**: Configured in `.vitepress/theme/index.ts` — search for `giscusTalk` to change repo, category, theme
- **Home page**: Edit `index.md` for hero section and features
- **Obsidian integration**: `.obsidian/` config files included; wikilinks disabled in favor of relative path markdown links for compatibility
