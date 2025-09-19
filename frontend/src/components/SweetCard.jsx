import React, { useState } from 'react'

export default function SweetCard({ sweet, onPurchase, busy=false }) {
  const [qty, setQty] = useState(1)
  const disabled = sweet.quantity === 0 || busy
  return (
    <div className="card">
      <div>
        <div style={{fontWeight:'bold', fontSize:18}}>{sweet.name}</div>
        <div>Category: <span className="badge">{sweet.category}</span></div>
        <div>Price: ₹{sweet.price.toFixed(2)}</div>
        <div>In stock: {sweet.quantity}</div>
      </div>
      <div>
        <input type="number" min="1" value={qty} onChange={e=>setQty(parseInt(e.target.value||1))} style={{width:80}}/>
        <button disabled={disabled} onClick={()=>onPurchase(sweet.id, qty)} style={{marginLeft:8}}>Purchase</button>
      </div>
    </div>
  )
}
