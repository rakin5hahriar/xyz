import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

export default function Redirect() {
  const { code } = useParams()
  const [error, setError] = useState('')
  const api = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

  useEffect(() => {
    const redirect = async () => {
      try {
        // Call backend API to get the original URL and track the click
        const response = await axios.get(`${api}/api/urls/redirect/${code}`)
        if (response.data.originalUrl) {
          // Redirect to the original URL
          window.location.href = response.data.originalUrl
        }
      } catch (error) {
        console.error('Redirect error:', error)
        setError('Short URL not found')
      }
    }

    if (code) {
      redirect()
    }
  }, [code, api])

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded shadow text-center">
        <h2 className="text-2xl font-semibold mb-4 text-red-600">Error</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.href = '/'} 
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Go to Homepage
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded shadow text-center">
      <h2 className="text-2xl font-semibold mb-4">Redirecting...</h2>
      <p>Please wait while we redirect you to the original URL.</p>
      <div className="mt-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
      </div>
    </div>
  )
}
