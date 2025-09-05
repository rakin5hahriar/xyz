import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import AnalyticsOverview from './pages/AnalyticsOverview'
import Redirect from './pages/Redirect'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
          <Route path="/analytics" element={isAuthenticated ? <AnalyticsOverview /> : <Navigate to="/login" />} />
          <Route path="/analytics/:id" element={<Analytics />} />
          {/* Catch-all route for short codes - should match patterns like /XuBnMiug */}
          <Route path="/:code" element={<Redirect />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
