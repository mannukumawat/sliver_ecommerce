// Text search over the catalogue: every word of the query must appear somewhere
// in the product's name, category, style, colour or description.
export function matchesQuery(product, query) {
  const words = String(query || '').trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (!words.length) return true
  const hay = `${product.name} ${product.category} ${product.style} ${product.colour} ${product.desc || ''}`.toLowerCase()
  return words.every((w) => hay.includes(w))
}
