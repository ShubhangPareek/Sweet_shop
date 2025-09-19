import React, { useEffect, useState } from 'react'
import { useAuth } from '../auth.jsx'
import { withAuth } from '../api.js'
import SweetCard from '../components/SweetCard.jsx'

export default function Dashboard(){
  const { token } = useAuth()
  const api = withAuth(token)
  const [list, setList] = useState([])
  const [busy, setBusy] = useState(false)
  const [q, setQ] = useState({name:'',category:'',minPrice:'',maxPrice:''})
  const [err, setErr] = useState('')

  async function loadAll(){
    setErr('')
    try {
      const r = await api.get('/api/sweets')
      setList(r.data)
    } catch (e) {
      setErr(e.response?.data?.detail || 'Load failed (login first?)')
    }
  }

  async function search(){
    const params = new URLSearchParams()
    if(q.name) params.append('name', q.name)
    if(q.category) params.append('category', q.category)
    if(q.minPrice) params.append('minPrice', q.minPrice)
    if(q.maxPrice) params.append('maxPrice', q.maxPrice)
    const url = '/api/sweets/search' + (params.toString()?`?${params.toString()}`:'')
    try {
      const r = await api.get(url)
      setList(r.data)
    } catch (e) {
      setErr(e.response?.data?.detail || 'Search failed')
    }
  }

  async function purchase(id, qty){
    try {
      setBusy(true)
      await api.post(`/api/sweets/${id}/purchase`, {quantity: qty})
      await loadAll()
    } catch (e) {
      alert(e.response?.data?.detail || 'Purchase failed')
    } finally {
      setBusy(false)
    }
  }

  useEffect(()=>{ loadAll() }, [])

  return (<div>
    <h2>All Sweets</h2>
    <div className="row">
      <input placeholder="Name contains..." value={q.name} onChange={e=>setQ({...q, name:e.target.value})}/>
      <input placeholder="Category..." value={q.category} onChange={e=>setQ({...q, category:e.target.value})}/>
      <input type="number" placeholder="Min price" value={q.minPrice} onChange={e=>setQ({...q, minPrice:e.target.value})}/>
      <input type="number" placeholder="Max price" value={q.maxPrice} onChange={e=>setQ({...q, maxPrice:e.target.value})}/>
      <button onClick={search}>Search</button>
      <button onClick={loadAll}>Reset</button>
    </div>
    {err && <div style={{color:'crimson'}}>{err}</div>}
    {list.map(s => <SweetCard key={s.id} sweet={s} onPurchase={purchase} busy={busy}/>)}
  </div>)
}
