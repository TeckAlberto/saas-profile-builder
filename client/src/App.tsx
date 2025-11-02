import { useState /*, useEffect*/ } from 'react' // <--- Comentamos useEffect
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  // const [data, setData] = useState<string | null>(null) // <--- Comentamos esto

  // Example of fetching data from the backend
  /* // <--- Comentamos todo el bloque
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api')
        const text = await response.text()
        console.log('Data from backend:', text)
        setData(text)
      } catch (error) {
        console.error('Error fetching data from backend:', error)
      }
    }

    setData('Loading...')
    fetchData()
  }, [])
  */ // <--- Fin del bloque comentado

  return (
    // --- CAMBIO AQUÍ ---
    // Añade el data-testid al elemento raíz
    <main data-testid="app-root">
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </main> // <-- Cierra el <main>
  )
}

export default App
