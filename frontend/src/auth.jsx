import React, {createContext, useContext, useEffect, useState} from 'react'

const AuthCtx = createContext(null)

export function AuthProvider({children}){
  const [token, setToken] = useState(localStorage.getItem('token')||'')
  const [role, setRole] = useState(localStorage.getItem('role')||'')

  function login(tok, r){
    setToken(tok); setRole(r);
    localStorage.setItem('token', tok)
    localStorage.setItem('role', r)
  }

  function logout(){
    setToken(''); setRole('');
    localStorage.removeItem('token')
    localStorage.removeItem('role')
  }

  return <AuthCtx.Provider value={{token, role, login, logout}}>
    {children}
  </AuthCtx.Provider>
}

export function useAuth(){ return useContext(AuthCtx) }
