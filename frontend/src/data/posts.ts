export type Post = {
  slug: string
  title: string
  date: string
  excerpt: string
  paragraphs: string[]
}

// 新帖子：在 frontend/src/posts/ 放一个 .md
// ---
// title: 标题
// date: 2026.10.04
// excerpt: 列表上的一行
// ---
//
// 正文。空行分段。

function field(block: string, key: string) {
  const matched = block.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'))
  return matched?.[1]?.trim() ?? ''
}

function loadPosts(): Post[] {
  const files = import.meta.glob('../posts/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
  })

  return Object.entries(files)
    .map(([path, raw]) => {
      const source = raw as string
      const slug = path.split('/').pop()?.replace(/\.md$/, '') ?? path
      const matched = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
      const meta = matched?.[1] ?? ''
      const body = (matched?.[2] ?? source).trim()
      const paragraphs = body
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
      const title = field(meta, 'title') || slug
      const excerpt = field(meta, 'excerpt') || paragraphs[0] || ''
      return {
        slug,
        title,
        date: field(meta, 'date'),
        excerpt,
        paragraphs,
      }
    })
    .sort((a, b) => b.date.localeCompare(a.date))
}

export const posts = loadPosts()
