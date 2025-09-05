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
    <header className="bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <span className="font-bold text-xl text-gray-900">LinkShort</span>
        </Link>
        <div className="flex items-center gap-6">
          {isAuthenticated && (
            <>
              <Link 
                to="/analytics" 
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
              >
                URL Shortener
              </Link>
              <button 
                onClick={handleLogout} 
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
              >
                Logout
              </button>
            </>
          )}
          {!isAuthenticated && (
            <span className="text-gray-600 text-sm">URL Shortener</span>
          )}
        </div>
      </div>
    </header>
  )
}
