import { Footer, Hero, Page, RowList, Section } from '../components'
import { profile } from '../data/profile'
import { republic } from '../data/republic'

export function About() {
  return (
    <Page>
      <Hero eyebrow={profile.title} title={profile.name} tagline={profile.tagline}>
        {profile.bio}
      </Hero>

      <Section title="城里">
        <RowList
          items={republic.districts.map((item) => ({
            name: item.name,
            description: item.tagline,
            href: item.path,
            external: false,
          }))}
        />
      </Section>

      <Footer left={`© ${new Date().getFullYear()} ${profile.name}`} />
    </Page>
  )
}
