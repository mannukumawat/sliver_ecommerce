// Demo catalogue. Photos: Unsplash (see docs/IMAGE_CREDITS.md). Names, prices and copy are sample content.
const photo = (slug, n) => `/images/products/${slug}-${n}.jpg`

const P = (n, slug, name, category, price, mrp, style, colour, extra = {}) => ({
  id: n, slug, name, category, price, mrp, style, colour,
  art: { photos: [photo(slug, 1), photo(slug, 2)] },
  rating: Math.round((4 + ((n * 7) % 10) / 10) * 10) / 10,
  material: 'Silver-toned jewellery (demo content)',
  ...extra,
})

export const products = [
  P(1, 'halo-cluster-ring', 'Halo Cluster Ring', 'rings', 3299, 3999, 'Statement', 'Silver', { isNew: true, bestseller: true, desc: 'A cushion of tiny stones circling a bright centre, set on a slim pave band.', size: 'Sizes 6-10' }),
  P(2, 'crossover-band-ring', 'Crossover Band Ring', 'rings', 2499, null, 'Contemporary', 'Silver', { isNew: true, desc: 'Two pave bands crossing over each other, a modern take on stacking.', size: 'Sizes 6-10' }),
  P(3, 'flower-cluster-ring', 'Flower Cluster Ring', 'rings', 3799, 4499, 'Statement', 'Silver', { bestseller: true, desc: 'Two flower-shaped clusters lit by tiny stones, for evenings that deserve it.', size: 'Sizes 6-10' }),
  P(4, 'night-solitaire-ring', 'Night Solitaire Ring', 'rings', 2899, null, 'Classic', 'Silver', { desc: 'A square-set centre stone with a split, stone-lined band.', size: 'Sizes 6-10' }),
  P(5, 'cluster-pendant-necklace', 'Cluster Pendant Necklace', 'necklaces', 2899, 3499, 'Classic', 'Silver', { isNew: true, bestseller: true, desc: 'A square cluster of stones on a fine box chain with a lobster clasp.', size: 'Chain 18 in + 2 in extender' }),
  P(6, 'heart-charm-necklace', 'Heart Charm Necklace', 'necklaces', 1799, 2199, 'Minimal', 'Silver', { bestseller: true, desc: 'Five tiny hearts spaced along a delicate paper-clip chain.', size: 'Chain 16 in + 2 in extender' }),
  P(7, 'tree-of-life-pendant', 'Tree of Life Pendant', 'necklaces', 1999, null, 'Classic', 'Silver', { desc: 'A cut-out tree of life in a polished circle, hung from a fine chain.', size: 'Chain 18 in + 2 in extender' }),
  P(8, 'open-heart-pendant', 'Open Heart Pendant', 'necklaces', 3499, null, 'Statement', 'Silver', { isNew: true, desc: 'An open heart outline set with a line of small stones.', size: 'Chain 18 in + 2 in extender' }),
  P(9, 'silver-hoop-earrings', 'Silver Hoop Earrings', 'earrings', 1299, 1599, 'Minimal', 'Silver', { bestseller: true, desc: 'Lightweight everyday huggies with a smooth, mirror finish.', size: 'Diameter 20 mm' }),
  P(10, 'laurel-crystal-earrings', 'Laurel Crystal Earrings', 'earrings', 2199, 2599, 'Statement', 'Silver', { isNew: true, bestseller: true, desc: 'Wreath-shaped studs made of tiny marquise-cut stones.', size: 'Diameter 28 mm' }),
  P(11, 'oxidised-jhumka-earrings', 'Oxidised Jhumka Earrings', 'earrings', 1999, 2499, 'Classic', 'Silver', { bestseller: true, desc: 'Domed jhumkas in oxidised silver with a gold-tone band and pearl drops.', size: 'Drop length 40 mm' }),
  P(12, 'aqua-halo-earrings', 'Aqua Halo Earrings', 'earrings', 3799, 4499, 'Statement', 'Blue', { desc: 'Large aqua-blue stones framed by a beaded silver halo.', size: 'Drop length 30 mm' }),
  P(13, 'cable-chain-bracelet', 'Cable Chain Bracelet', 'bracelets', 1899, 2299, 'Classic', 'Silver', { bestseller: true, desc: 'A bold cable chain with a polished finish and a secure clasp.', size: 'Length 7 in + 1 in extender' }),
  P(14, 'diamond-wrap-bracelet', 'Diamond Wrap Bracelet', 'bracelets', 4299, 4999, 'Statement', 'Silver', { isNew: true, desc: 'A coiled, stone-lined cuff that wraps the wrist twice.', size: 'Adjustable' }),
  P(15, 'aqua-heart-bracelet', 'Aqua Heart Bracelet', 'bracelets', 2299, null, 'Contemporary', 'Blue', { desc: 'A heart-cut aqua stone between round stones on a fine chain.', size: 'Length 7 in' }),
  P(16, 'layered-charm-bracelets', 'Layered Charm Bracelets', 'bracelets', 2799, null, 'Minimal', 'Silver', { isNew: true, desc: 'Three slim chain bracelets with tiny charms, made for layering.', size: 'Length 6.5-7.5 in' }),
  P(17, 'silver-payal-anklet', 'Silver Payal Anklet', 'anklets', 1999, 2399, 'Classic', 'Silver', { bestseller: true, desc: 'A traditional payal with tiny bells, in oxidised silver.', size: 'Length 9.5 in + 1.5 in extender' }),
  P(18, 'classic-silver-anklet', 'Classic Silver Anklet', 'anklets', 1599, null, 'Minimal', 'Silver', { isNew: true, desc: 'A light chain anklet with a little charm cluster at the clasp.', size: 'Length 9 in + 1.5 in extender' }),
  P(19, 'charm-payal-anklet', 'Charm Payal Anklet', 'anklets', 2199, null, 'Contemporary', 'Silver', { desc: 'Charms and beads along a silver chain, worn as a pair or alone.', size: 'Length 9.5 in + 1 in extender' }),
  P(20, 'black-bead-anklet', 'Black Bead Anklet', 'anklets', 1399, 1699, 'Minimal', 'Silver', { desc: 'Black beads strung on a silver chain; a quiet everyday anklet.', size: 'Length 9 in + 1.5 in extender' }),
  P(21, 'emerald-crystal-set', 'Emerald Crystal Set', 'sets', 5499, 6499, 'Statement', 'Green', { isNew: true, desc: 'A crystal necklace with emerald-green drops and matching earrings.', size: 'Necklace 16 in + 3 in; drop 35 mm' }),
  P(22, 'turquoise-choker-set', 'Turquoise Choker Set', 'sets', 4599, 5399, 'Classic', 'Blue', { isNew: true, bestseller: true, desc: 'An oxidised-silver choker with turquoise panels and pearl drops, plus earrings.', size: 'Choker 12 in + 3 in; drop 30 mm' }),
  P(23, 'pink-pearl-set', 'Pink Pearl Set', 'sets', 3999, null, 'Contemporary', 'Pink', { desc: 'Pink freshwater-style pearls as a strand with matching studs.', size: 'Strand 17 in; stud 8 mm' }),
  P(24, 'pearl-gift-set', 'Pearl Gift Set', 'sets', 3999, 4799, 'Classic', 'Pearl', { bestseller: true, desc: 'A graduated pearl strand with a stone-set clasp, in a gift box.', size: 'Strand 17 in' }),
]

export const getProduct = (slug) => allProducts().find((p) => p.slug === slug)
export const related = (p, n = 4) => {
  const all = allProducts()
  return [...all.filter((x) => x.category === p.category && x.id !== p.id), ...all.filter((x) => x.category !== p.category && x.id !== p.id)].slice(0, n)
}

// Admin-added products live in localStorage (demo, no server) and merge with the
// built-in catalogue everywhere the storefront reads products.
export const ADMIN_PRODUCTS_KEY = 'aurave-admin-products-v1'

export function readAdminProducts() {
  try {
    const raw = localStorage.getItem(ADMIN_PRODUCTS_KEY)
    const list = raw ? JSON.parse(raw) : []
    return Array.isArray(list) ? list : []
  } catch { return [] }
}

export function allProducts() {
  return [...products, ...readAdminProducts()]
}

export function saveAdminProduct(product) {
  const list = readAdminProducts()
  const next = [...list, product]
  try { localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(next)) } catch { /* ignore */ }
  try { window.dispatchEvent(new Event('aurave:products-changed')) } catch { /* ignore */ }
  return product
}

export function removeAdminProduct(id) {
  try { localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(readAdminProducts().filter((p) => p.id !== id))) } catch { /* ignore */ }
  try { window.dispatchEvent(new Event('aurave:products-changed')) } catch { /* ignore */ }
}
