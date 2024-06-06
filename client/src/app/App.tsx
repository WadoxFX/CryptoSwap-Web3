import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import SideBar from '../components/sidebar/SideBar'
import Header from '../components/header/Header'
import ContextProvider from '../components/ContextProvider'

const App = () => (
  <BrowserRouter>
    <ContextProvider>
      <main>
        <div className="container">
          <Header />
          <Routes>
            <Route index element={<Dashboard />} />
          </Routes>
        </div>
        <SideBar />
      </main>
    </ContextProvider>
  </BrowserRouter>
)

export default App
