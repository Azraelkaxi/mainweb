import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Shell } from './components/Shell'
import { posts } from './data/posts'
import { About } from './pages/About'
import { Archive } from './pages/Archive'
import { Gomoku } from './pages/Gomoku'
import { Home } from './pages/Home'
import { Lamps } from './pages/Lamps'
import { Night } from './pages/Night'
import { NotFound } from './pages/NotFound'
import { PostPage } from './pages/Post'
import { Workshop } from './pages/Workshop'

function documentTitle(pathname: string) {
  if (pathname === '/') return '理想国 · Azraelkaxi'
  if (pathname.startsWith('/workshop/gomoku')) return '五子棋 · 理想国'
  if (pathname.startsWith('/workshop/lamps')) return '翻灯 · 理想国'
  if (pathname === '/workshop') return '工坊 · 理想国'
  if (pathname === '/archive') return '档案 · 理想国'
  if (pathname.startsWith('/archive/')) {
    const slug = decodeURIComponent(pathname.slice('/archive/'.length))
    const post = posts.find((item) => item.slug === slug)
    return post ? `${post.title} · 理想国` : '城外 · 理想国'
  }
  if (pathname === '/night') return '夜航 · 理想国'
  if (pathname === '/about') return '站长 · 理想国'
  return '城外 · 理想国'
}

function App() {
  const { pathname } = useLocation()

  useEffect(() => {
    document.title = documentTitle(pathname)
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workshop/gomoku" element={<Gomoku />} />
        <Route path="/workshop/lamps" element={<Lamps />} />
        <Route path="/workshop" element={<Workshop />} />
        <Route path="/archive/:slug" element={<PostPage />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/night" element={<Night />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Shell>
  )
}

export default App
