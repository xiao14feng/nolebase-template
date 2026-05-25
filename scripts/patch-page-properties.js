// Patch @nolebase/vitepress-plugin-page-properties to handle Chinese-named markdown files
// Run after `pnpm install` or when node_modules is refreshed.
// Usage: node scripts/patch-page-properties.js

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const files = [
  {
    // Patch 1: normalizeAsMarkdownPath — decode URL, add .md for clean URLs
    // Patch 2: load hook — fallback to precomputed data from docsMetadata.json
    path: resolve(root, 'node_modules/@nolebase/vitepress-plugin-page-properties/dist/vite/index.mjs'),
    patch(old) {
      let result = old
      // Fix normalizeAsMarkdownPath
      result = result.replace(
        `function normalizeAsMarkdownPath(url) {\n  let toMarkdownFilePath = url.split("?")[0];\n  if (toMarkdownFilePath.startsWith("/"))\n    toMarkdownFilePath = toMarkdownFilePath.slice(1);\n  if (toMarkdownFilePath.endsWith("/")) {\n    toMarkdownFilePath += "index.md";\n  } else {\n    if (extname(toMarkdownFilePath) === ".html") {\n      toMarkdownFilePath = toMarkdownFilePath.replace(/^(.+?)(\.html)?$/s, "$1.md");\n    }\n  }\n  return toMarkdownFilePath;\n}`,
        `function normalizeAsMarkdownPath(url) {\n  let toMarkdownFilePath = url.split("?")[0];\n  try { toMarkdownFilePath = decodeURIComponent(toMarkdownFilePath); } catch (e) {}\n  if (toMarkdownFilePath.startsWith("/"))\n    toMarkdownFilePath = toMarkdownFilePath.slice(1);\n  if (toMarkdownFilePath.endsWith("/")) {\n    toMarkdownFilePath += "index.md";\n  } else {\n    if (extname(toMarkdownFilePath) === ".html") {\n      toMarkdownFilePath = toMarkdownFilePath.replace(/^(.+?)(\.html)?$/s, "$1.md");\n    } else if (!extname(toMarkdownFilePath)) {\n      toMarkdownFilePath += ".md";\n    }\n  }\n  return toMarkdownFilePath;\n}`
      )
      // Fix load hook — merge precomputed data from docsMetadata.json
      result = result.replace(
        `    load(id) {\n      if (id !== ResolvedVirtualModuleId)\n        return null;\n      return \`export default \${JSON.stringify(data)}\`;\n    },`,
        `    load(id) {\n      if (id !== ResolvedVirtualModuleId)\n        return null;\n      try {\n        const metadataPath = join(_config.root, ".vitepress/docsMetadata.json");\n        const metadata = JSON.parse(readFileSync(metadataPath, "utf-8"));\n        if (metadata.pageProperties) {\n          for (const [filePath, props] of Object.entries(metadata.pageProperties)) {\n            const key = normalizeWithRelative(_config.root, join(_config.root, filePath));\n            if (!data[key])\n              data[key] = props;\n          }\n        }\n      } catch (e) {\n      }\n      return \`export default \${JSON.stringify(data)}\`;\n    },`
      )
      return result
    }
  },
  {
    path: resolve(root, 'node_modules/@nolebase/vitepress-plugin-page-properties/dist/vite/index.cjs'),
    patch(old) {
      let result = old
      // Fix normalizeAsMarkdownPath
      result = result.replace(
        `function normalizeAsMarkdownPath(url) {\n  let toMarkdownFilePath = url.split("?")[0];\n  if (toMarkdownFilePath.startsWith("/"))\n    toMarkdownFilePath = toMarkdownFilePath.slice(1);\n  if (toMarkdownFilePath.endsWith("/")) {\n    toMarkdownFilePath += "index.md";\n  } else {\n    if (node_path.extname(toMarkdownFilePath) === ".html") {\n      toMarkdownFilePath = toMarkdownFilePath.replace(/^(.+?)(\.html)?$/s, "$1.md");\n    }\n  }\n  return toMarkdownFilePath;\n}`,
        `function normalizeAsMarkdownPath(url) {\n  let toMarkdownFilePath = url.split("?")[0];\n  try { toMarkdownFilePath = decodeURIComponent(toMarkdownFilePath); } catch (e) {}\n  if (toMarkdownFilePath.startsWith("/"))\n    toMarkdownFilePath = toMarkdownFilePath.slice(1);\n  if (toMarkdownFilePath.endsWith("/")) {\n    toMarkdownFilePath += "index.md";\n  } else {\n    if (node_path.extname(toMarkdownFilePath) === ".html") {\n      toMarkdownFilePath = toMarkdownFilePath.replace(/^(.+?)(\.html)?$/s, "$1.md");\n    } else if (!node_path.extname(toMarkdownFilePath)) {\n      toMarkdownFilePath += ".md";\n    }\n  }\n  return toMarkdownFilePath;\n}`
      )
      // Fix load hook in CJS
      result = result.replace(
        `    load(id) {\n      if (id !== ResolvedVirtualModuleId)\n        return null;\n      return \`export default \${JSON.stringify(data)}\`;\n    },`,
        `    load(id) {\n      if (id !== ResolvedVirtualModuleId)\n        return null;\n      try {\n        const metadataPath = node_path.join(_config.root, ".vitepress/docsMetadata.json");\n        const metadata = JSON.parse(node_fs.readFileSync(metadataPath, "utf-8"));\n        if (metadata.pageProperties) {\n          for (const [filePath, props] of Object.entries(metadata.pageProperties)) {\n            const key = normalizeWithRelative(_config.root, node_path.join(_config.root, filePath));\n            if (!data[key])\n              data[key] = props;\n          }\n        }\n      } catch (e) {\n      }\n      return \`export default \${JSON.stringify(data)}\`;\n    },`
      )
      return result
    }
  }
]

let patched = 0
for (const { path, patch } of files) {
  try {
    const content = readFileSync(path, 'utf-8')
    const patchedContent = patch(content)
    if (content === patchedContent) {
      console.log(`Already patched: ${path}`)
    } else {
      writeFileSync(path, patchedContent, 'utf-8')
      console.log(`Patched: ${path}`)
    }
    patched++
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.log(`Skipped (not found): ${path}`)
    } else {
      console.error(`Error patching ${path}:`, e.message)
    }
  }
}

if (patched === files.length) {
  console.log('All files patched successfully!')
} else {
  console.log(`Patched ${patched}/${files.length} files.`)
}
