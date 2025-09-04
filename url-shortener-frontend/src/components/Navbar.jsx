import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar(){
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()
  
  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold text-indigo-600 text-lg">URL Shortener</Link>
        <nav className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <button onClick={()=>navigate('/')} className="text-sm">Dashboard</button>
              <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm">Login</Link>
              <Link to="/register" className="text-sm bg-indigo-600 text-white px-3 py-1 rounded">Sign up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
