import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

function CreateForm({ onCreated }){
  const [originalUrl, setOriginalUrl] = useState('')
  const [customCode, setCustomCode] = useState('')
  const [msg, setMsg] = useState('')
  const api = import.meta.env.VITE_API_BASE || 'http://localhost:3000'
  const token = localStorage.getItem('token')

  const submit = async (e) => {
    e.preventDefault()
    setMsg('')
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
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h3 className="font-semibold mb-2">Create short URL</h3>
      {msg && <div className="text-sm mb-2">{msg}</div>}
      <form onSubmit={submit} className="grid grid-cols-1 gap-2 md:grid-cols-3">
        <input value={originalUrl} onChange={e=>setOriginalUrl(e.target.value)} placeholder="https://example.com" className="col-span-2 p-2 border rounded" />
        <input value={customCode} onChange={e=>setCustomCode(e.target.value)} placeholder="custom (optional)" className="p-2 border rounded" />
        <div className="col-span-3 text-right">
          <button className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded">Create</button>
        </div>
      </form>
    </div>
  )
}

export default function Dashboard(){
  const [urls, setUrls] = useState([])
  const [copiedId, setCopiedId] = useState(null)
  const api = import.meta.env.VITE_API_BASE || 'http://localhost:3000'
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
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(()=>{ load() }, [])

  return (
    <div>
      <CreateForm onCreated={load} />
      <div className="space-y-4">
        {urls.length === 0 && <div className="text-center text-gray-600">No URLs yet</div>}
        {urls.map(u => {
          const shortUrl = `${window.location.origin}/${u.shortCode}`
          return (
            <div key={u._id} className="bg-white p-4 rounded shadow flex items-center justify-between">
              <div className="flex-1">
                <div className="font-medium text-indigo-600 cursor-pointer hover:underline" onClick={() => copyToClipboard(shortUrl, u._id)}>
                  {shortUrl}
                  {copiedId === u._id && <span className="ml-2 text-green-600 text-sm">✓ Copied!</span>}
                </div>
                <div className="text-sm text-gray-600">{u.originalUrl}</div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => copyToClipboard(shortUrl, u._id)}
                  className="text-gray-500 text-sm hover:text-gray-700"
                >
                  {copiedId === u._id ? '✓ Copied' : 'Copy'}
                </button>
                <a className="text-indigo-600 text-sm" href={shortUrl} target="_blank" rel="noreferrer">Open</a>
                <Link className="text-sm bg-gray-100 px-3 py-1 rounded" to={`/analytics/${u._id}`}>Analytics</Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
