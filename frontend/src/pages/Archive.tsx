import { Hero, Page, RowList, Section } from '../components'
import { posts } from '../data/posts'
import { republic } from '../data/republic'

const archive = republic.districts[1]

export function Archive() {
  return (
    <Page>
      <Hero eyebrow={archive.eyebrow} title={archive.name} tagline={archive.tagline}>
        {archive.lead}
      </Hero>
      <Section title="卷宗">
        {posts.length === 0 ? (
          <p className="bio">这一卷还空着。</p>
        ) : (
          <RowList
            items={posts.map((post) => ({
              name: post.title,
              description: [post.date, post.excerpt].filter(Boolean).join(' · '),
              href: `/archive/${post.slug}`,
              external: false,
            }))}
          />
        )}
      </Section>
    </Page>
  )
}
