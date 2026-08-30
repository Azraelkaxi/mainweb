import { Route, Routes } from 'react-router-dom'
import { Shell } from './components/Shell'
import { About } from './pages/About'
import { Home } from './pages/Home'

function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Shell>
  )
}

export default App
