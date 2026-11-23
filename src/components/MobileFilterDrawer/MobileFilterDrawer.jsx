import Drawer from '../Drawer/Drawer'
import FilterPanel from '../FilterSidebar/FilterPanel'
import Button from '../Button/Button'
import './MobileFilterDrawer.css'

export default function MobileFilterDrawer({ open, onClose, total, activeCount, onClear, ...panel }) {
  return (
    <Drawer open={open} onClose={onClose} side="bottom" title="Filters" className="mfd">
      <div className="mfd__body"><FilterPanel {...panel} /></div>
      <div className="mfd__foot">
        <Button variant="secondary" onClick={onClear} disabled={!activeCount}>Clear all</Button>
        <Button onClick={onClose}>Show {total} {total === 1 ? 'piece' : 'pieces'}</Button>
      </div>
    </Drawer>
  )
}
