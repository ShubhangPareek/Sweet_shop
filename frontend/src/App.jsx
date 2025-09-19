import React from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Admin from './pages/Admin.jsx'
import NotFound from './pages/NotFound.jsx'
import { AuthProvider, useAuth } from './auth.jsx'
import ThemeToggle from "./components/ThemeToggle";

function Nav() {
  const { token, role, logout } = useAuth()
  const navigate = useNavigate()
  return (
    <div className="nav container">
      <div style={{display:'flex', gap:16}}>
        <Link to="/">Sweets</Link>
        {role === 'admin' && <Link to="/admin">Admin</Link>}
      </div>
      <div style={{display:'flex', gap:12}}>
        {!token && <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>}
        {token && <>
          <span className="badge">Role: {role}</span>
          <button onClick={()=>{ logout(); navigate('/login') }}>Logout</button>
        </>}
      </div>
    </div>
  )
}

export default function App(){
  return (
    <AuthProvider>
      <div style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
          <ThemeToggle />
        </div>
        <Nav/>
        <div className="container">
          <Routes>
            <Route path="/" element={<Dashboard/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/admin" element={<Admin/>} />
            <Route path="*" element={<NotFound/>} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  )
}
