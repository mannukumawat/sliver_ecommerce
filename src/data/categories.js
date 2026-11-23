// art.photos = [card image, wide dark banner image]
export const categories = [
  { slug: 'rings', name: 'Rings', blurb: 'Stacked, solitaire, statement', art: { photos: ['/images/products/halo-cluster-ring-1.jpg', '/images/story/ring-night.jpg'] } },
  { slug: 'necklaces', name: 'Necklaces', blurb: 'Pendants & delicate chains', art: { photos: ['/images/products/cluster-pendant-necklace-1.jpg', '/images/story/necklace-night.jpg'] } },
  { slug: 'earrings', name: 'Earrings', blurb: 'Hoops, drops & studs', art: { photos: ['/images/story/jhumka.jpg', '/images/story/earrings-night.jpg'] } },
  { slug: 'bracelets', name: 'Bracelets', blurb: 'Chains & cuffs', art: { photos: ['/images/products/diamond-wrap-bracelet-1.jpg', '/images/story/bracelet-night.jpg'] } },
  { slug: 'anklets', name: 'Anklets', blurb: 'Light, everyday charm', art: { photos: ['/images/story/anklet.jpg', '/images/products/classic-silver-anklet-1.jpg'] } },
  { slug: 'sets', name: 'Sets', blurb: 'Matching, gift-ready', art: { photos: ['/images/story/set-turquoise.jpg', '/images/story/pearl-pendant.jpg'] } },
]

export const styles = ['Minimal', 'Classic', 'Statement', 'Contemporary']
export const colours = [
  { name: 'Silver', hex: '#cfd6e0' },
  { name: 'Blue', hex: '#3d9bb8' },
  { name: 'Pearl', hex: '#f4efe8' },
  { name: 'Green', hex: '#2f8f6b' },
  { name: 'Pink', hex: '#e4a9b0' },
]
export const priceRanges = [
  { id: 'u1500', label: 'Under ₹1,500', min: 0, max: 1499 },
  { id: '1500', label: '₹1,500 – ₹2,999', min: 1500, max: 2999 },
  { id: '3000', label: '₹3,000 – ₹4,999', min: 3000, max: 4999 },
  { id: '5000', label: '₹5,000 & above', min: 5000, max: Infinity },
]
