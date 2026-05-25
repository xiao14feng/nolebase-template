<script setup lang="ts">
import { creators } from '../../creators'
import { siteName, siteDescription, githubRepoLink, discordLink, targetDomain } from '../../../metadata'

const notes = [
  { title: '与芒格的对话 · 关于方法、行动与认可', link: '/笔记/AI对话总结/与芒格的对话', date: '2026-05-25' },
]
</script>

<template>
  <div class="wiki-page">
    <h1 class="wiki-title">{{ siteName }} 知识库</h1>
    <div class="wiki-breadcrumb">
      来自 <strong>{{ siteName }}</strong> &nbsp;·&nbsp;
      <a href="/">首页</a> &nbsp;·&nbsp;
      <a href="/toc">最近更新</a>
    </div>

    <div class="wiki-layout">
      <!-- 左侧导航 -->
      <aside class="wiki-sidebar">
        <div class="sb-section">
          <div class="sb-title">导航</div>
          <a href="/笔记/index" class="sb-link">
            <span class="sb-icon">📖</span> 开始阅读
          </a>
          <a :href="githubRepoLink" class="sb-link" target="_blank">
            <span class="sb-icon">⭐</span> GitHub
          </a>
          <a :href="discordLink" class="sb-link" target="_blank">
            <span class="sb-icon">💬</span> Discord
          </a>
        </div>

        <div class="sb-section">
          <div class="sb-title">最近笔记</div>
          <a
            v-for="note in notes"
            :key="note.title"
            :href="note.link"
            class="sb-link sb-note"
          >
            {{ note.title }}
          </a>
        </div>

        <div class="sb-section">
          <div class="sb-title">工具</div>
          <a href="/?search=1" class="sb-link" @click.prevent>
            <span class="sb-icon">🔍</span> 搜索文档
          </a>
          <a href="#" class="sb-link">
            <span class="sb-icon">📋</span> 页面大纲
          </a>
        </div>
      </aside>

      <!-- 主内容区 -->
      <main class="wiki-main">
        <!-- 信息框 -->
        <div class="wiki-infobox">
          <div class="infobox-title">{{ siteName }} 知识库</div>
          <div class="infobox-logo">
            <div class="logo-circle">晓</div>
          </div>
          <table>
            <tr><td>类型</td><td>个人知识库 / 博客</td></tr>
            <tr><td>语言</td><td>中文</td></tr>
            <tr><td>平台</td><td>VitePress · Obsidian</td></tr>
            <tr><td>词源</td><td>昆雅语 nólë（知识）+ base（基础）</td></tr>
            <tr><td>创作者</td><td v-text="creators.map(c => c.name).join(' · ')" /></tr>
            <tr><td>许可</td><td>CC BY-SA 4.0</td></tr>
            <tr><td>网址</td><td><a :href="targetDomain" target="_blank">{{ targetDomain.replace('https://', '') }}</a></td></tr>
          </table>
        </div>

        <p class="wiki-desc">
          「{{ siteName }}」是一个基于 <strong>Markdown</strong> + <strong>Obsidian</strong> + <strong>VitePress</strong> 的个人知识库与博客网站。
          以 {{ siteName }} 为名，读作 nole-base，取自意为「知识」的昆雅语 <i>nólë</i> 和意为「基础」的英文 <i>base</i>，
          即「知识库」。
        </p>

        <p class="wiki-desc">
          {{ siteDescription }}本站内容由创作者们维护，涉及到生活中各方面知识和内容，也不乏回忆和畅想。
          所有内容以 Markdown 编写，经由 VitePress 生成静态页面，用于记录、整理和分享知识。
        </p>

        <!-- 目录 -->
        <div class="wiki-toc">
          <div class="toc-title">目录 [<a href="#" @click.prevent="">隐藏</a>]</div>
          <ol>
            <li><a href="#features">内容特色</a></li>
            <li><a href="#tech">技术栈</a></li>
            <li><a href="#recent">最近更新</a></li>
            <li><a href="#contributors">创作者</a></li>
          </ol>
        </div>

        <h2 id="features" class="wiki-section-title">内容特色</h2>
        <p class="wiki-desc">
          多样的主题和内容 — 涉及到生活中各方面知识和内容，不乏回忆和畅想。
          所有笔记皆为 Markdown 格式，使用 Markdown 拓展语法（脚注、MathJax、双向链接、图片懒加载、内联链接预览等）
          编写和记录笔记，每一个页面都是 Markdown 文件。
        </p>

        <h2 id="tech" class="wiki-section-title">技术栈</h2>
        <p class="wiki-desc">
          <strong>VitePress</strong> — 基于 Vite 的强大静态文档页面生成器，
          提供了简单易用的主题和工具，生成了知识库的所有页面。
        </p>
        <p class="wiki-desc">
          <strong>Obsidian</strong> — 强大的知识库管理工具，支持花样繁多的插件和拓展，
          让知识管理变得更加简单。
        </p>

        <h2 id="recent" class="wiki-section-title">最近更新</h2>
        <div class="wiki-desc note-list">
          <div v-for="(note, i) in notes" :key="note.title" class="note-item">
            <a :href="note.link">{{ note.title }}</a>
            <span class="note-date">（{{ note.date }}）</span>
          </div>
        </div>

        <div id="contributors" class="wiki-contributors">
          <h3>创作者</h3>
          <div class="wiki-creator-list">
            <div v-for="c in creators" :key="c.name" class="creator-item">
              <img :src="c.avatar" :alt="c.name" class="creator-avatar">
              <div class="creator-info">
                <strong>{{ c.name }}</strong>
                <span class="creator-desc">{{ c.desc }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="wiki-license">
          除非另有声明，本网站内容采用
          <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank">CC BY-SA 4.0</a>
          许可协议进行授权。
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.wiki-page {
  font-family: "Noto Serif SC", "Source Han Serif SC", Georgia, "Times New Roman", serif;
  max-width: 960px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
  color: #222;
}

.wiki-title {
  font-size: 1.6rem;
  font-weight: 400;
  border-bottom: 1px solid #a2a9b1;
  padding-bottom: 0.2rem;
  margin-bottom: 0.3rem;
}

.wiki-breadcrumb {
  font-size: 0.78rem;
  color: #54595d;
  margin-bottom: 0.8rem;
}
.wiki-breadcrumb a {
  color: #0645ad;
  text-decoration: none;
}
.wiki-breadcrumb a:hover {
  text-decoration: underline;
}

/* 两栏布局 */
.wiki-layout {
  display: flex;
  gap: 0;
}

/* 左侧导航 */
.wiki-sidebar {
  width: 160px;
  flex-shrink: 0;
  font-size: 0.78rem;
  padding-top: 0.3rem;
}

.sb-section {
  margin-bottom: 0.6rem;
}

.sb-title {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #54595d;
  border-bottom: 1px solid #c8ccd1;
  padding: 0.25rem 0 0.15rem;
  margin-bottom: 0.2rem;
  letter-spacing: 0.04em;
}

.sb-link {
  display: block;
  padding: 0.2rem 0;
  color: #0645ad;
  text-decoration: none;
  line-height: 1.5;
}
.sb-link:hover {
  text-decoration: underline;
}
.sb-icon {
  margin-right: 3px;
}
.sb-note {
  padding: 0.15rem 0;
  font-size: 0.74rem;
  color: #0645ad;
  word-break: break-all;
}

/* 主内容 */
.wiki-main {
  flex: 1;
  min-width: 0;
  padding: 0 0 0 1.5rem;
}

.wiki-desc {
  font-size: 0.88rem;
  line-height: 1.75;
  margin-bottom: 0.6rem;
  color: #222;
}

.note-list {
  margin: 0.3rem 0;
}
.note-item {
  padding: 0.15rem 0;
}
.note-item a {
  color: #0645ad;
  text-decoration: none;
  font-size: 0.85rem;
}
.note-item a:hover {
  text-decoration: underline;
}
.note-date {
  font-size: 0.78rem;
  color: #888;
}

/* 信息框 */
.wiki-infobox {
  float: right;
  clear: right;
  width: 220px;
  margin: 0.3rem 0 0.6rem 1.2rem;
  background: #f8f9fa;
  border: 1px solid #a2a9b1;
  font-size: 0.78rem;
}

.infobox-title {
  background: #eaecf0;
  text-align: center;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.3rem 0.5rem;
  border-bottom: 1px solid #a2a9b1;
}

.infobox-logo {
  text-align: center;
  padding: 0.6rem;
}

.logo-circle {
  display: inline-flex;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8d6fc7, #4fc4d8);
  color: #fff;
  font-size: 1.3rem;
  align-items: center;
  justify-content: center;
}

.wiki-infobox table {
  width: 100%;
  border-collapse: collapse;
}

.wiki-infobox td {
  padding: 0.25rem 0.5rem;
  border-bottom: 1px solid #eaecf0;
  vertical-align: top;
}

.wiki-infobox td:first-child {
  font-weight: 600;
  color: #54595d;
  white-space: nowrap;
  width: 35%;
}

.wiki-infobox a {
  color: #0645ad;
  text-decoration: none;
}

/* 目录 */
.wiki-toc {
  background: #f8f9fa;
  border: 1px solid #a2a9b1;
  padding: 0.5rem 1rem;
  display: inline-block;
  margin: 0.8rem 0 1rem;
}

.toc-title {
  font-size: 0.82rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 0.3rem;
}

.toc-title a {
  color: #0645ad;
  text-decoration: none;
  font-weight: 400;
  font-size: 0.75rem;
}

.wiki-toc ol {
  margin: 0;
  padding-left: 1.5rem;
}

.wiki-toc li {
  font-size: 0.78rem;
  color: #0645ad;
  line-height: 1.6;
}

.wiki-toc li a {
  color: #0645ad;
  text-decoration: none;
}

.wiki-toc li a:hover {
  text-decoration: underline;
}

/* 小节标题 */
.wiki-section-title {
  font-size: 1rem;
  font-weight: 400;
  border-bottom: 1px solid #a2a9b1;
  margin: 1.2rem 0 0.4rem;
  padding-bottom: 0.15rem;
}

/* 创作者 */
.wiki-contributors {
  clear: both;
  border-top: 1px solid #a2a9b1;
  margin-top: 1.5rem;
  padding-top: 0.8rem;
}

.wiki-contributors h3 {
  font-size: 0.85rem;
  color: #54595d;
  font-weight: normal;
  margin-bottom: 0.6rem;
}

.wiki-creator-list {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.creator-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.creator-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.creator-info {
  display: flex;
  flex-direction: column;
}

.creator-info strong {
  font-size: 0.85rem;
}

.creator-desc {
  font-size: 0.75rem;
  color: #777;
}

/* 许可 */
.wiki-license {
  margin-top: 0.8rem;
  padding-top: 0.6rem;
  border-top: 1px solid #eaecf0;
  font-size: 0.75rem;
  color: #54595d;
}

.wiki-license a {
  color: #0645ad;
  text-decoration: none;
}

/* 响应式 */
@media (max-width: 768px) {
  .wiki-page {
    padding: 1rem;
  }
  .wiki-layout {
    flex-direction: column;
  }
  .wiki-sidebar {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1.5rem;
    margin-bottom: 0.8rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #a2a9b1;
  }
  .sb-section {
    margin-bottom: 0;
  }
  .wiki-main {
    padding: 0;
  }
  .wiki-infobox {
    float: none;
    width: 100%;
    margin: 0 0 0.8rem;
  }
}
</style>
