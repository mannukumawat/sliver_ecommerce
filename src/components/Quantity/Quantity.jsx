import { Minus, Plus } from 'lucide-react'
import './Quantity.css'

export default function Quantity({ value, onChange, min = 1, max = 10, label = 'Quantity' }) {
  return (
    <div className="qty" role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Decrease quantity"><Minus size={15} /></button>
      <output aria-live="polite">{value}</output>
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity"><Plus size={15} /></button>
    </div>
  )
}
