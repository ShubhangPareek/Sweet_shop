import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api.js'
import { useAuth } from '../auth.jsx'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    setErr('')
    try {
      const r = await api.post('/api/auth/login', {email, password})
      login(r.data.access_token, r.data.role)
      navigate('/')
    } catch (e) {
      setErr(e.response?.data?.detail || 'Login failed')
    }
  }

  return (<div>
    <h2>Login</h2>
    <form onSubmit={handleSubmit}>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      {err && <div style={{color:'crimson'}}>{err}</div>}
      <button>Login</button>
    </form>
  </div>)
}
