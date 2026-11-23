import FilterPanel from './FilterPanel'
import './FilterSidebar.css'

export default function FilterSidebar({ activeCount, onClear, ...panel }) {
  return (
    <aside className="fside" aria-label="Filters">
      <div className="fside__head">
        <h2>Filters</h2>
        {activeCount > 0 && <button onClick={onClear} className="fside__clear">Clear all ({activeCount})</button>}
      </div>
      <FilterPanel {...panel} />
    </aside>
  )
}
