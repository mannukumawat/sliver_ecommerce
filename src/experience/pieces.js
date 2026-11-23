import { categories } from '../data/categories'
import { products } from '../data/products'

// Scroll map: 0 .. HERO_END = zoom-through hero, SEL0 .. 1 = piece selector.
export const HERO_END = 0.3
export const SEL0 = 0.36

const MODEL = { rings: 'ring', necklaces: 'necklace', earrings: 'earrings', bracelets: 'bracelet', anklets: 'anklet', sets: 'set' }

// representative product per piece, chosen to match the 3D model
const REP = { rings: 'halo-cluster-ring', necklaces: 'cluster-pendant-necklace', earrings: 'oxidised-jhumka-earrings', bracelets: 'diamond-wrap-bracelet', anklets: 'silver-payal-anklet', sets: 'pearl-gift-set' }

export const PIECES = categories.map((c) => {
  const list = products.filter((p) => p.category === c.slug)
  return {
    slug: c.slug,
    name: c.name,
    blurb: c.blurb,
    model: MODEL[c.slug],
    count: list.length,
    newCount: list.filter((p) => p.isNew).length,
    from: Math.min(...list.map((p) => p.price)),
    rep: list.find((p) => p.slug === REP[c.slug]) || list[0],
  }
})

export const clamp01 = (x) => Math.min(1, Math.max(0, x))
export const smooth = (a, b, x) => { const k = clamp01((x - a) / (b - a)); return k * k * (3 - 2 * k) }

// dwell on each piece, then move quickly to the next
export const snapIdx = (x) => { const i = Math.floor(x); return i + smooth(0.28, 0.72, x - i) }
