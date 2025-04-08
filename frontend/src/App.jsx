import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import GameMenu from './components/GameMenu'
import EightQueens from './pages/EightQueens'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/" element={<GameMenu />} />
      <Route path='/eightqueens' element={<EightQueens />} />
     </Routes>
  )
}

export default App
