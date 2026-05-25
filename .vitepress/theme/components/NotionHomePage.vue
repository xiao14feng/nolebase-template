<script setup lang="ts">
import { ref, computed } from 'vue'
import { creators } from '../../creators'
import { siteName, siteDescription, githubRepoLink, discordLink } from '../../../metadata'
import { sidebar, pageProperties } from '../../docsMetadata.json'

interface ArticleItem {
  text: string
  link: string
  lastUpdated?: number
}

// 展平 sidebar 获取所有笔记
const articles = computed(() => {
  const list: ArticleItem[] = []
  for (const section of sidebar) {
    if (section.items) {
      for (const item of section.items) {
        if (item.link) list.push(item)
        if (item.items) {
          for (const sub of item.items) {
            if (sub.link) list.push(sub)
          }
        }
      }
    }
  }
  return list
})

// 按时间排序
const sortedArticles = computed(() => {
  return [...articles.value].sort((a, b) => (b.lastUpdated || 0) - (a.lastUpdated || 0))
})

// 按日期分组
const dateNoteMap = computed(() => {
  const map: Record<string, ArticleItem[]> = {}
  for (const article of articles.value) {
    if (article.lastUpdated) {
      const d = new Date(article.lastUpdated)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      if (!map[key]) map[key] = []
      map[key].push(article)
    }
  }
  return map
})

// 统计概览
const noteCount = computed(() => articles.value.length)

const totalWordCount = computed(() => {
  if (!pageProperties) return 0
  return Object.values(pageProperties).reduce((sum: number, p: any) => sum + (p.wordsCount || 0), 0)
})

// ===== 日历状态 =====
const today = new Date()
const currentYear = ref(today.getFullYear())
const currentMonth = ref(today.getMonth())
const selectedDate = ref<string | null>(null)

const weekDays = ['日', '一', '二', '三', '四', '五', '六']

// 获取有笔记的日期
const noteDates = computed(() => new Set(Object.keys(dateNoteMap.value)))

// 选中日期的笔记
const previewArticles = computed(() => {
  if (!selectedDate.value) return []
  return dateNoteMap.value[selectedDate.value] || []
})

// 获取特定日期的笔记数
function getNoteCount(dateStr: string): number {
  return dateNoteMap.value[dateStr]?.length || 0
}

// 获取圆点颜色
function getDotClass(dateStr: string): string {
  const count = getNoteCount(dateStr)
  if (count >= 4) return 'dot-many'
  if (count >= 3) return 'dot-3'
  if (count >= 2) return 'dot-2'
  return 'dot-1'
}

// 格式化日期
function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-')
  return `${y}年${parseInt(m)}月${parseInt(d)}日`
}

// 生成日历格
const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev = new Date(year, month, 0).getDate()
  const days: { day: number, dateStr: string, isOther: boolean }[] = []

  // 上月填充
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrev - i
    const m = month === 0 ? 11 : month - 1
    const y = month === 0 ? year - 1 : year
    days.push({ day: d, dateStr: `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`, isOther: true })
  }

  // 当前月
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    days.push({ day: d, dateStr, isOther: false })
  }

  // 下月补齐
  const total = days.length
  const remaining = Math.ceil(total / 7) * 7 - total
  for (let d = 1; d <= remaining; d++) {
    const m = month === 11 ? 0 : month + 1
    const y = month === 11 ? year + 1 : year
    days.push({ day: d, dateStr: `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`, isOther: true })
  }

  return days
})

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
  selectedDate.value = null
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
  selectedDate.value = null
}

function toggleDate(dateStr: string) {
  if (selectedDate.value === dateStr) {
    selectedDate.value = null
  } else {
    selectedDate.value = dateStr
  }
}

function isToday(dateStr: string): boolean {
  const d = new Date()
  const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  return dateStr === key
}

const links = [
  { icon: '📖', label: '开始阅读', link: '/笔记/index' },
  { icon: '⭐', label: 'GitHub', link: githubRepoLink, external: true },
  { icon: '💬', label: 'Discord', link: discordLink, external: true },
  { icon: '🔍', label: '搜索文档', link: '/?search=1' },
]

function formatLinkDate(ts: number): string {
  const d = new Date(ts)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
</script>

<template>
  <div class="notion-page">
    <!-- 左侧主内容 -->
    <div class="notion-main">
      <!-- 页头 -->
      <div class="notion-header">
        <div class="page-icon">🍁</div>
        <h1 class="page-title">{{ siteName }}</h1>
        <p class="page-desc">{{ siteDescription }}</p>
      </div>

      <!-- 快捷链接 -->
      <div class="notion-block">
        <div class="block-icon">🔗</div>
        <div class="block-content">
          <span class="block-label">快速访问</span>
          <div class="link-grid">
            <a v-for="l in links" :key="l.label" :href="l.link" :target="l.external ? '_blank' : undefined" class="link-card">
              <span class="link-icon">{{ l.icon }}</span>
              <span class="link-label">{{ l.label }}</span>
            </a>
          </div>
        </div>
      </div>

      <!-- 最近更新 -->
      <div class="notion-block">
        <div class="block-icon">📌</div>
        <div class="block-content">
          <span class="block-label">最近更新</span>
          <a v-for="note in sortedArticles" :key="note.link" :href="note.link" class="note-row">
            <span class="note-bullet">•</span>
            <span class="note-title">{{ note.text }}</span>
            <span class="note-date">{{ formatLinkDate(note.lastUpdated!) }}</span>
          </a>
          <div v-if="!sortedArticles.length" class="empty-hint">还没有笔记</div>
        </div>
      </div>

      <!-- 概览 -->
      <div class="notion-block">
        <div class="block-icon">📊</div>
        <div class="block-content">
          <span class="block-label">概览</span>
          <div class="stats-row">
            <div class="stat-item">
              <span class="stat-value">{{ noteCount }}</span>
              <span class="stat-label">笔记</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ totalWordCount.toLocaleString() }}</span>
              <span class="stat-label">总字数</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ creators.length }}</span>
              <span class="stat-label">创作者</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 创作者 -->
      <div class="notion-block">
        <div class="block-icon">👤</div>
        <div class="block-content">
          <span class="block-label">创作者</span>
          <div v-for="c in creators" :key="c.name" class="creator-row">
            <img :src="c.avatar" :alt="c.name" class="creator-avatar">
            <div class="creator-info">
              <strong>{{ c.name }}</strong>
              <span class="creator-desc">{{ c.desc }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 页脚 -->
      <div class="notion-footer">
        <span class="footer-divider">————————————</span>
        <p class="footer-text">
          <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank">CC BY-SA 4.0</a>
          © 2022-PRESENT {{ siteName }} 的创作者们
        </p>
      </div>
    </div>

    <!-- 右侧日历 -->
    <div class="notion-sidebar">
      <div class="calendar-card">
        <div class="cal-header">
          <button class="cal-nav" @click="prevMonth">◀</button>
          <span class="cal-month">{{ currentYear }} 年 {{ currentMonth + 1 }} 月</span>
          <button class="cal-nav" @click="nextMonth">▶</button>
        </div>
        <div class="cal-weekdays">
          <span v-for="w in weekDays" :key="w">{{ w }}</span>
        </div>
        <div class="cal-grid">
          <div
            v-for="day in calendarDays"
            :key="day.dateStr"
            class="cal-day"
            :class="{
              'other-month': day.isOther,
              'is-today': isToday(day.dateStr),
              'is-active': selectedDate === day.dateStr && !day.isOther,
              'has-notes': !!getNoteCount(day.dateStr) && !day.isOther,
            }"
            @click="toggleDate(day.dateStr)"
          >
            <span class="cal-day-num">{{ day.day }}</span>
            <div v-if="getNoteCount(day.dateStr) && !day.isOther" class="cal-dot-row">
              <span v-for="i in Math.min(getNoteCount(day.dateStr), 3)" :key="i" class="cal-dot" :class="getDotClass(day.dateStr)" />
            </div>
          </div>
        </div>
        <div class="cal-legend">
          <span class="legend-label">笔记数：</span>
          <span class="legend-item"><span class="legend-dot dot-1" /> 1</span>
          <span class="legend-item"><span class="legend-dot dot-2" /> 2</span>
          <span class="legend-item"><span class="legend-dot dot-3" /> 3</span>
          <span class="legend-item"><span class="legend-dot dot-many" /> 4+</span>
        </div>
      </div>

      <!-- 预览卡片 -->
      <div v-if="previewArticles.length" class="preview-panel">
        <div class="preview-header">{{ formatDate(selectedDate!) }}</div>
        <a v-for="a in previewArticles" :key="a.link" :href="a.link" class="preview-card">
          <div class="preview-title">{{ a.text }}</div>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notion-page {
  width: 100%;
  display: flex;
  gap: 2.5rem;
  padding: 3rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", "Noto Sans SC", sans-serif;
  color: #37352f;
  line-height: 1.5;
}

.notion-main {
  flex: 1;
  min-width: 0;
}

.notion-sidebar {
  width: 250px;
  flex-shrink: 0;
}

/* 页头 */
.notion-header { margin-bottom: 2rem; }
.page-icon { font-size: 3rem; margin-bottom: 0.5rem; }
.page-title {
  font-size: 2.5rem; font-weight: 700; margin: 0 0 0.3rem;
  letter-spacing: -0.02em; line-height: 1.2;
}
.page-desc { font-size: 1rem; color: #787774; margin: 0; }

/* Notion 块 */
.notion-block {
  display: flex; gap: 0.5rem; padding: 0.4rem 0;
  margin-bottom: 0.3rem; border-radius: 4px; transition: background 0.15s;
}
.notion-block:hover { background: rgba(55, 53, 47, 0.03); }
.block-icon { width: 1.5rem; flex-shrink: 0; text-align: center; font-size: 1.1rem; padding-top: 0.1rem; }
.block-content { flex: 1; min-width: 0; }
.block-label {
  display: block; font-size: 0.85rem; font-weight: 600;
  color: #787774; margin-bottom: 0.5rem; letter-spacing: 0.03em;
}

/* 链接 */
.link-grid { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.link-card {
  display: inline-flex; align-items: center; gap: 0.4rem;
  padding: 0.45rem 0.8rem; border: 1px solid rgba(55, 53, 47, 0.13);
  border-radius: 4px; text-decoration: none; color: #37352f;
  font-size: 0.9rem; transition: background 0.15s;
}
.link-card:hover { background: rgba(55, 53, 47, 0.06); text-decoration: none; }
.link-icon { font-size: 1rem; }
.link-label { font-weight: 500; }

/* 笔记行 */
.note-row {
  display: flex; align-items: baseline; gap: 0.5rem;
  padding: 0.3rem 0; color: #37352f; text-decoration: none;
  border-bottom: 1px solid rgba(55, 53, 47, 0.06);
  transition: background 0.15s; border-radius: 2px;
}
.note-row:last-child { border-bottom: none; }
.note-row:hover { background: rgba(55, 53, 47, 0.04); text-decoration: none; }
.note-bullet { color: #787774; font-weight: bold; flex-shrink: 0; }
.note-title { flex: 1; font-size: 0.9rem; }
.note-date { font-size: 0.8rem; color: #787774; flex-shrink: 0; }
.empty-hint { color: #bbb; font-size: 0.85rem; padding: 0.3rem 0; }

/* 统计 */
.stats-row { display: flex; gap: 1.5rem; }
.stat-item { display: flex; flex-direction: column; gap: 0.15rem; }
.stat-value { font-size: 1.5rem; font-weight: 600; line-height: 1.2; }
.stat-label { font-size: 0.8rem; color: #787774; }

/* 创作者 */
.creator-row { display: flex; align-items: center; gap: 0.6rem; padding: 0.3rem 0; }
.creator-avatar { width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0; }
.creator-info { display: flex; flex-direction: column; gap: 0.05rem; }
.creator-info strong { font-size: 0.9rem; font-weight: 600; }
.creator-desc { font-size: 0.8rem; color: #787774; }

/* 页脚 */
.notion-footer { margin-top: 2rem; text-align: center; }
.footer-divider {
  display: block; color: #e9e9e7;
  font-size: 0.75rem; letter-spacing: 0.15em; margin-bottom: 0.5rem;
}
.footer-text { font-size: 0.8rem; color: #787774; margin: 0; }
.footer-text a {
  color: #37352f; text-decoration: underline;
  text-decoration-color: rgba(55, 53, 47, 0.2); text-underline-offset: 2px;
}
.footer-text a:hover { text-decoration-color: #37352f; }

/* ===== 日历 ===== */
.calendar-card {
  border: 1px solid rgba(55, 53, 47, 0.1);
  border-radius: 8px;
  padding: 0.9rem;
}

.cal-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 0.6rem;
}
.cal-month { font-size: 0.85rem; font-weight: 600; }
.cal-nav {
  background: none; border: 1px solid rgba(55, 53, 47, 0.13);
  border-radius: 4px; padding: 0.15rem 0.4rem; cursor: pointer;
  font-size: 0.75rem; color: #37352f; transition: background 0.15s;
  line-height: 1.2;
}
.cal-nav:hover { background: rgba(55, 53, 47, 0.06); }

.cal-weekdays {
  display: grid; grid-template-columns: repeat(7, 1fr);
  text-align: center; font-size: 0.65rem; color: #787774;
  font-weight: 600; margin-bottom: 0.2rem;
}

.cal-grid {
  display: grid; grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.cal-day {
  aspect-ratio: 1;
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; font-size: 0.75rem; border-radius: 6px;
  cursor: pointer; transition: background 0.15s; gap: 1px;
  position: relative;
}
.cal-day:hover { background: rgba(55, 53, 47, 0.06); }
.cal-day.other-month { color: #cdcdc9; }
.cal-day.is-today .cal-day-num {
  font-weight: 700;
  background: rgba(55, 53, 47, 0.08);
  border-radius: 50%;
  width: 22px; height: 22px;
  display: flex; align-items: center; justify-content: center;
}
.cal-day.is-active { background: rgba(55, 53, 47, 0.08); font-weight: 600; }
.cal-day.is-active:hover { background: rgba(55, 53, 47, 0.12); }

.cal-day-num { line-height: 1; z-index: 1; }

.cal-dot-row {
  display: flex; align-items: center; gap: 1.5px;
  height: 5px;
}
.cal-dot { width: 4px; height: 4px; border-radius: 50%; display: inline-block; }

.dot-1 { background: #8d6fc7; }
.dot-2 { background: #4fc4d8; }
.dot-3 { background: #e8a838; }
.dot-many { background: #d44c47; }

/* 图例 */
.cal-legend {
  display: flex; align-items: center; gap: 0.5rem;
  margin-top: 0.6rem; font-size: 0.65rem; color: #787774;
  flex-wrap: wrap;
}
.legend-label { margin-right: 0.1rem; }
.legend-item { display: flex; align-items: center; gap: 0.2rem; }
.legend-dot { width: 7px; height: 7px; border-radius: 2px; display: inline-block; }

/* 预览卡片 */
.preview-panel {
  margin-top: 0.8rem;
  display: flex; flex-direction: column; gap: 0.4rem;
}

.preview-header {
  font-size: 0.75rem;
  font-weight: 600;
  color: #787774;
  padding: 0.3rem 0.2rem;
}

.preview-card {
  display: block;
  padding: 0.5rem 0.6rem;
  border: 1px solid rgba(55, 53, 47, 0.1);
  border-radius: 6px;
  text-decoration: none;
  color: #37352f;
  transition: background 0.15s, border-color 0.15s;
}
.preview-card:hover {
  background: rgba(55, 53, 47, 0.03);
  border-color: rgba(55, 53, 47, 0.25);
  text-decoration: none;
}

.preview-title {
  font-size: 0.8rem;
  font-weight: 500;
}

/* 暗色模式 */
.dark .notion-page { color: rgba(255, 255, 255, 0.9); }

.dark .page-desc,
.dark .block-label,
.dark .note-date,
.dark .note-bullet,
.dark .stat-label,
.dark .creator-desc,
.dark .footer-text,
.dark .cal-weekdays,
.dark .preview-header,
.dark .legend-label,
.dark .legend-item {
  color: rgba(255, 255, 255, 0.55);
}

.dark .cal-day.other-month { color: rgba(255, 255, 255, 0.2); }
.dark .cal-nav { color: rgba(255, 255, 255, 0.8); }

.dark .notion-block:hover,
.dark .cal-day:hover { background: rgba(255, 255, 255, 0.03); }

.dark .link-card,
.dark .calendar-card,
.dark .preview-card {
  border-color: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.9);
}

.dark .link-card:hover,
.dark .preview-card:hover { background: rgba(255, 255, 255, 0.06); }

.dark .note-row {
  color: rgba(255, 255, 255, 0.9);
  border-bottom-color: rgba(255, 255, 255, 0.06);
}
.dark .note-row:hover { background: rgba(255, 255, 255, 0.04); }
.dark .stat-value { color: rgba(255, 255, 255, 0.9); }
.dark .footer-divider { color: rgba(255, 255, 255, 0.1); }
.dark .footer-text a { color: rgba(255, 255, 255, 0.9); text-decoration-color: rgba(255, 255, 255, 0.2); }
.dark .footer-text a:hover { text-decoration-color: rgba(255, 255, 255, 0.9); }

.dark .cal-day.is-today .cal-day-num { background: rgba(255, 255, 255, 0.15); }
.dark .cal-day.is-active { background: rgba(255, 255, 255, 0.1); }
.dark .cal-nav:hover { background: rgba(255, 255, 255, 0.06); }
</style>

<!-- 覆盖 VitePress 默认布局 -->
<style>
.VPDoc.has-aside .content-container,
.VPDoc:not(.has-sidebar) .content-container {
  max-width: none !important;
}
</style>
