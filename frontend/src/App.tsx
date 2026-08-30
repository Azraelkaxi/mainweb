import './App.css'
import { profile, projects } from './data/profile'

function App() {
  return (
    <div className="page">
      <header className="nav">
        <a className="brand" href="/">
          {profile.name}
        </a>
        <a
          className="nav-link"
          href={profile.github}
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </header>

      <section className="hero">
        <p className="eyebrow">{profile.title}</p>
        <h1>{profile.name}</h1>
        <p className="tagline">{profile.tagline}</p>
        <p className="bio">{profile.bio}</p>
      </section>

      <section className="section" aria-labelledby="projects-title">
        <h2 id="projects-title" className="section-title">
          项目
        </h2>
        <ul className="project-list">
          {projects.map((project) => (
            <li key={project.name}>
              <a
                className="project"
                href={project.href}
                target="_blank"
                rel="noreferrer"
              >
                <span className="project-name">{project.name}</span>
                <p className="project-desc">{project.description}</p>
                <span className="project-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <footer className="footer">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <a href={profile.github} target="_blank" rel="noreferrer">
          github.com/{profile.githubHandle}
        </a>
      </footer>
    </div>
  )
}

export default App
