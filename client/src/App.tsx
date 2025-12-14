import { Outlet } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-3">
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default App
