import Home from './Home'
import './App.css'
import { ThemeProvider } from './ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <Home />
      </div>
    </ThemeProvider>
  )
}

export default App
