import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

function CreateForm({ onCreated }){
  const [originalUrl, setOriginalUrl] = useState('')
  const [customCode, setCustomCode] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const api = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
  const token = localStorage.getItem('token')

  const submit = async (e) => {
    e.preventDefault()
    setMsg('')
    setLoading(true)
    try {
      const res = await axios.post(api + '/api/urls', { originalUrl, customCode }, { headers: { Authorization: 'Bearer ' + token } })
      setOriginalUrl('')
      setCustomCode('')
      // Show frontend URL instead of backend URL
      const frontendShortUrl = `${window.location.origin}/${res.data.shortCode}`
      setMsg('Created: ' + frontendShortUrl)
      onCreated()
    } catch (e) {
      setMsg(e.response?.data?.message || 'Create failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Shorten Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">URLs</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Create short, memorable links that are easy to share. Track clicks and 
          analyze your audience with detailed analytics.
        </p>
      </div>

      {/* URL Shortener Form */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-3">Enter your long URL</label>
        </div>
        {msg && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${msg.includes('Created') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {msg}
          </div>
        )}
        <form onSubmit={submit} className="flex gap-4">
          <div className="flex-1">
            <input 
              value={originalUrl} 
              onChange={e=>setOriginalUrl(e.target.value)} 
              placeholder="https://example.com/very-long-url" 
              className="w-full p-4 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Shortening...' : 'Shorten URL'}
          </button>
        </form>
        {customCode && (
          <div className="mt-4">
            <input 
              value={customCode} 
              onChange={e=>setCustomCode(e.target.value)} 
              placeholder="custom-code (optional)" 
              className="w-full p-3 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Easy to Use</h3>
          <p className="text-gray-600">
            Simply paste your long URL and get 
            a short link in seconds.
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Analytics</h3>
          <p className="text-gray-600">
            Track clicks and analyze your 
            audience with detailed insights.
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure</h3>
          <p className="text-gray-600">
            Your links are protected and safe to 
            share anywhere.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard(){
  const [urls, setUrls] = useState([])
  const [copiedId, setCopiedId] = useState(null)
  const [showUrls, setShowUrls] = useState(false)
  const api = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
  const token = localStorage.getItem('token')

  const copyToClipboard = async (shortUrl, id) => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const load = async () => {
    try {
      const res = await axios.get(api + '/api/urls', { headers: { Authorization: 'Bearer ' + token } })
      setUrls(res.data)
      if (res.data.length > 0) {
        setShowUrls(true)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(()=>{ load() }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <CreateForm onCreated={() => { load(); setShowUrls(true); }} />
      
      {showUrls && (
        <div className="max-w-4xl mx-auto px-6 pb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your URLs</h2>
              <button 
                onClick={() => setShowUrls(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              {urls.length === 0 && (
                <div className="text-center text-gray-600 py-8">No URLs yet</div>
              )}
              {urls.map(u => {
                const shortUrl = `${window.location.origin}/${u.shortCode}`
                return (
                  <div key={u._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div 
                          className="font-medium text-blue-600 cursor-pointer hover:text-blue-700 truncate" 
                          onClick={() => copyToClipboard(shortUrl, u._id)}
                        >
                          {shortUrl}
                          {copiedId === u._id && <span className="ml-2 text-green-600 text-sm">✓ Copied!</span>}
                        </div>
                        <div className="text-sm text-gray-500 truncate mt-1">{u.originalUrl}</div>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <button 
                          onClick={() => copyToClipboard(shortUrl, u._id)}
                          className="text-gray-500 hover:text-gray-700 text-sm px-3 py-1 rounded-lg hover:bg-gray-100"
                        >
                          {copiedId === u._id ? '✓ Copied' : 'Copy'}
                        </button>
                        <a 
                          className="text-blue-600 hover:text-blue-700 text-sm px-3 py-1 rounded-lg hover:bg-blue-50" 
                          href={shortUrl} 
                          target="_blank" 
                          rel="noreferrer"
                        >
                          Open
                        </a>
                        <Link 
                          className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg transition-colors" 
                          to={`/analytics/${u._id}`}
                        >
                          Analytics
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
