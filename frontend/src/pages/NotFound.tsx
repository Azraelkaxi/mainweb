import { Hero, Page, RowList, Section } from '../components'

export function NotFound() {
  return (
    <Page>
      <Hero eyebrow="城外" title="没有这条路" tagline="坐标对不上任何一区。">
        回到国境里面。
      </Hero>
      <Section title="返回">
        <RowList
          items={[
            {
              name: '理想国',
              description: '国境之内',
              href: '/',
              external: false,
            },
          ]}
        />
      </Section>
    </Page>
  )
}
