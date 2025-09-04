import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Register(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()
  const api = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    try {
      const res = await axios.post(api + '/api/auth/register', { email, password })
      login(res.data.token)
      navigate('/')
    } catch (e) {
      setErr(e.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Create account</h2>
      <form onSubmit={submit} className="space-y-3">
        {err && <div className="text-red-600">{err}</div>}
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-2 border rounded" />
        <button className="w-full bg-indigo-600 text-white p-2 rounded">Register</button>
      </form>
      <p className="mt-3 text-sm">Already have an account? <Link to="/login" className="text-indigo-600">Login</Link></p>
    </div>
  )
}
