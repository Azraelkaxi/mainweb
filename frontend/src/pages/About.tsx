import { Footer, Hero, Page, RowList, Section } from '../components'
import { profile, projects } from '../data/profile'

export function About() {
  return (
    <Page>
      <Hero
        eyebrow={profile.title}
        title={profile.name}
        tagline={profile.tagline}
      >
        {profile.bio}
      </Hero>

      <Section title="项目">
        <RowList
          items={projects.map((project) => ({ ...project, external: true }))}
        />
      </Section>

      <Footer
        left={`© ${new Date().getFullYear()} ${profile.name}`}
        right={
          <a href={profile.github} target="_blank" rel="noreferrer">
            github.com/{profile.githubHandle}
          </a>
        }
      />
    </Page>
  )
}
