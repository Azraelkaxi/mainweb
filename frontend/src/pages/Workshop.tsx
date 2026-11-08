import { Hero, Page, RowList, Section } from '../components'
import { games } from '../data/games'
import { republic } from '../data/republic'

const workshop = republic.districts.find((district) => district.path === '/workshop')

export function Workshop() {
  if (!workshop) {
    throw new Error('Missing district for /workshop')
  }

  return (
    <Page>
      <Hero eyebrow={workshop.eyebrow} title={workshop.name} tagline={workshop.tagline}>
        {workshop.lead}
      </Hero>
      <Section title="局里">
        <RowList items={games.map((game) => ({ ...game, external: false }))} />
      </Section>
    </Page>
  )
}
