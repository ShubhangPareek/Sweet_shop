import React, { useEffect, useState } from 'react'
import { useAuth } from '../auth.jsx'
import { withAuth } from '../api.js'

export default function Admin(){
  const { token, role } = useAuth()
  const api = withAuth(token)
  const [form, setForm] = useState({name:'', category:'', price:'', quantity:''})
  const [list, setList] = useState([])
  const [err, setErr] = useState('')

  async function load(){
    try {
      const r = await api.get('/api/sweets')
      setList(r.data)
    } catch(e) {
      setErr(e.response?.data?.detail || 'Load failed')
    }
  }

  async function addSweet(e){
    e.preventDefault()
    try {
      await api.post('/api/sweets', {
        name: form.name, category: form.category,
        price: Number(form.price || 0), quantity: Number(form.quantity || 0)
      })
      setForm({name:'', category:'', price:'', quantity:''})
      await load()
    } catch (e) {
      alert(e.response?.data?.detail || 'Add failed')
    }
  }

  async function updateSweet(s){
    const price = Number(prompt('New price', s.price))
    if(Number.isNaN(price)) return
    try {
      await api.put(`/api/sweets/${s.id}`, {price})
      await load()
    } catch (e) {
      alert(e.response?.data?.detail || 'Update failed')
    }
  }

  async function restock(s){
    const qty = Number(prompt('Restock quantity', 1))
    if(Number.isNaN(qty) || qty <= 0) return
    try {
      await api.post(`/api/sweets/${s.id}/restock`, {quantity: qty})
      await load()
    } catch (e) {
      alert(e.response?.data?.detail || 'Restock failed')
    }
  }

  async function delSweet(s){
    if(!confirm(`Delete ${s.name}?`)) return
    try {
      await api.delete(`/api/sweets/${s.id}`)
      await load()
    } catch (e) {
      alert(e.response?.data?.detail || 'Delete failed')
    }
  }

  useEffect(()=>{ load() }, [])

  if(role !== 'admin'){
    return <div><h2>Admin</h2><p>Admins only.</p></div>
  }

  return (<div>
    <h2>Admin</h2>
    <form onSubmit={addSweet}>
      <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
      <input placeholder="Category" value={form.category} onChange={e=>setForm({...form, category:e.target.value})}/>
      <input type="number" step="0.01" placeholder="Price" value={form.price} onChange={e=>setForm({...form, price:e.target.value})}/>
      <input type="number" placeholder="Quantity" value={form.quantity} onChange={e=>setForm({...form, quantity:e.target.value})}/>
      <button>Add Sweet</button>
    </form>

    <table className="table">
      <thead><tr><th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Qty</th><th>Actions</th></tr></thead>
      <tbody>
        {list.map(s => (
          <tr key={s.id}>
            <td>{s.id}</td>
            <td>{s.name}</td>
            <td>{s.category}</td>
            <td>₹{s.price.toFixed(2)}</td>
            <td>{s.quantity}</td>
            <td style={{display:'flex', gap:8}}>
              <button onClick={()=>updateSweet(s)}>Edit Price</button>
              <button onClick={()=>restock(s)}>Restock</button>
              <button onClick={()=>delSweet(s)} style={{background:'#fdd'}}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>)
}
