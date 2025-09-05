import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

export default function Redirect() {
  const { code } = useParams()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const api = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

  useEffect(() => {
    const redirect = async () => {
      try {
        setLoading(true)
        // Get the original URL from backend without triggering click tracking
        const response = await axios.get(`${api}/api/urls/info/${code}`)
        if (response.data.originalUrl) {
          // Now redirect to the backend route that will track the click and redirect
          window.location.href = `${api}/${code}`
        } else {
          setError('Short URL not found')
        }
      } catch (error) {
        console.error('Redirect error:', error)
        setError('Short URL not found')
      } finally {
        setLoading(false)
      }
    }

    if (code) {
      redirect()
    }
  }, [code, api])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">URL Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.href = '/'} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Redirecting...</h2>
          <p className="text-gray-600 mb-6">Please wait while we redirect you to the original URL.</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
