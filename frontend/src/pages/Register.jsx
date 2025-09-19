import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api.js'
import { useAuth } from '../auth.jsx'

export default function Register(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const [err, setErr] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    setErr('')
    try {
      const r = await api.post('/api/auth/register', {email, password, role})
      login(r.data.access_token, r.data.role)
      navigate('/')
    } catch (e) {
      setErr(e.response?.data?.detail || 'Register failed')
    }
  }

  return (<div>
    <h2>Register</h2>
    <form onSubmit={handleSubmit}>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <label>Role</label>
      <select value={role} onChange={e=>setRole(e.target.value)}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      {err && <div style={{color:'crimson'}}>{err}</div>}
      <button>Create account</button>
    </form>
  </div>)
}
