import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import GameMenu from './components/GameMenu'
import EightQueens from './pages/EightQueens'
import KnightsTour from './pages/KnightsTour'
import TicTacToe from './pages/TicTacToe'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/" element={<GameMenu />} />
      <Route path='/eightqueens' element={<EightQueens />} />
      <Route path='/knight' element={<KnightsTour />} />
      <Route path='/tictactoe' element={<TicTacToe />} />
    </Routes>
  )
}

export default App
