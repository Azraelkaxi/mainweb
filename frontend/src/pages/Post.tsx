import { useParams } from 'react-router-dom'
import { Hero, Page } from '../components'
import { posts } from '../data/posts'
import { NotFound } from './NotFound'

export function PostPage() {
  const { slug } = useParams()
  const post = posts.find((item) => item.slug === slug)
  if (!post) return <NotFound />

  return (
    <Page>
      <Hero eyebrow={post.date || '档案'} title={post.title} />
      <article className="prose">
        {post.paragraphs.map((paragraph, index) => (
          <p key={`${index}-${paragraph.slice(0, 12)}`}>{paragraph}</p>
        ))}
      </article>
    </Page>
  )
}
