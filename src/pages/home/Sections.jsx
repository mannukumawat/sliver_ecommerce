import { Link } from 'react-router-dom'
import { ArrowRight, Gem, RotateCcw, ShieldCheck, Truck } from 'lucide-react'
import Button from '../../components/Button/Button'
import CategoryCard from '../../components/CategoryCard/CategoryCard'
import ProductGrid from '../../components/ProductGrid/ProductGrid'
import ProductImage from '../../components/ProductImage/ProductImage'
import Reveal from '../../components/Reveal/Reveal'
import Carousel from './Carousel'
import { categories } from '../../data/categories'
import { products } from '../../data/products'

const newArrivals = products.filter((p) => p.isNew).slice(0, 4)
const bestsellers = products.filter((p) => p.bestseller).slice(0, 8)

export function TrustStrip() {
  const items = [
    [Gem, '925 Sterling Silver', 'Demo copy; verify before launch'],
    [ShieldCheck, 'Secure Payments', 'Demo copy; checkout not connected'],
    [RotateCcw, 'Easy Returns', 'Placeholder policy'],
    [Truck, 'Complimentary Shipping', 'On orders above ₹1,999'],
  ]
  return (
    <section className="trust" aria-label="Our promises">
      <ul className="container trust__list">
        {items.map(([Icon, t, s]) => (
          <li key={t}><Icon size={24} strokeWidth={1.4} aria-hidden="true" /><div><strong>{t}</strong><span>{s}</span></div></li>
        ))}
      </ul>
    </section>
  )
}

export function Categories() {
  return (
    <section className="section" aria-labelledby="cat-title">
      <div className="container">
        <Reveal className="section-head">
          <div><p className="eyebrow">Shop by category</p><h2 id="cat-title">Find your piece</h2></div>
          <Link to="/collection" className="link-arrow">View all <ArrowRight size={15} /></Link>
        </Reveal>
        <ul className="cats">
          {categories.map((c, i) => (
            <li key={c.slug}><Reveal delay={(i % 3) * 80}><CategoryCard category={c} /></Reveal></li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function NewArrivals() {
  return (
    <section className="section section--tint" aria-labelledby="new-title">
      <div className="container">
        <Reveal className="section-head">
          <div><p className="eyebrow">Just in</p><h2 id="new-title">New Arrivals</h2></div>
          <Link to="/collection?new=1&sort=newest" className="link-arrow">Shop new <ArrowRight size={15} /></Link>
        </Reveal>
        <Reveal><ProductGrid products={newArrivals} /></Reveal>
      </div>
    </section>
  )
}

export function Bestsellers() {
  return (
    <section className="section" aria-labelledby="best-title">
      <div className="container">
        <Reveal className="section-head">
          <div><p className="eyebrow">Most loved</p><h2 id="best-title">Bestsellers</h2></div>
          <Link to="/collection" className="link-arrow">Shop all <ArrowRight size={15} /></Link>
        </Reveal>
        <Reveal><Carousel products={bestsellers} label="bestsellers" /></Reveal>
      </div>
    </section>
  )
}

export function Editorial() {
  return (
    <section className="edit" aria-labelledby="edit-title">
      <div className="edit__tiles" aria-hidden="true">
        <div><ProductImage art={{ photos: ['/images/story/pearl-pendant.jpg'] }} decorative /></div>
        <div><ProductImage art={{ photos: ['/images/story/bracelet-night.jpg'] }} decorative /></div>
      </div>
      <div className="edit__copy">
        <Reveal>
          <p className="eyebrow edit__eyebrow">The Campaign</p>
          <h2 id="edit-title">More Than Jewellery.<br />It&rsquo;s a Feeling.</h2>
          <p>Pieces that sit quietly on a quiet day and catch the light on a loud one. Find the ones that feel like yours.</p>
          <Button to="/collection" variant="light" size="lg">Explore Collections</Button>
        </Reveal>
      </div>
    </section>
  )
}

export function BrandStory() {
  const pillars = [
    ['Considered design', 'Clean lines and soft proportions, drawn to sit well with whatever you already wear.'],
    ['Careful craft', 'Each piece is finished, checked and polished before it leaves the studio. (Demo copy.)'],
    ['Everyday elegance', 'Light enough for a workday, refined enough for an evening out.'],
  ]
  return (
    <section className="section section--tint story" id="story" aria-labelledby="story-title">
      <div className="container story__grid">
        <Reveal className="story__img"><ProductImage art={{ photos: ['/images/story/jhumka.jpg'] }} name="Oxidised silver jhumka earrings" /></Reveal>
        <Reveal className="story__copy" delay={100}>
          <p className="eyebrow">Our story</p>
          <h2 id="story-title">Silver, made personal</h2>
          <p>AURAVÉ began with a simple idea: silver jewellery should feel as considered as it looks. We design small collections with a calm, modern eye, so every piece can be worn often and kept for a long time.</p>
          <p>Our focus is the details you notice up close: the weight of a chain, the curve of a band, the way a stone catches light.</p>
          <ul className="story__pillars" id="craft">
            {pillars.map(([t, d]) => <li key={t}><h3>{t}</h3><p>{d}</p></li>)}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

export function Testimonials() {
  const items = [
    ['A.', 'The finish is clean and the chain feels light. Exactly the kind of piece I wear every day.'],
    ['R.', 'Gift-ready packaging and a design that felt personal. It was a lovely thing to give.'],
    ['S.', 'The blue stone catches the light beautifully without being loud.'],
  ]
  return (
    <section className="section" aria-labelledby="tst-title">
      <div className="container">
        <Reveal className="section-head">
          <div><p className="eyebrow">Kind words</p><h2 id="tst-title">What people might say</h2></div>
          <p className="tst__demo">Demo testimonials: sample text, not real customer reviews.</p>
        </Reveal>
        <ul className="tst">
          {items.map(([n, q], i) => (
            <li key={n}><Reveal delay={i * 80}>
              <figure>
                <blockquote>“{q}”</blockquote>
                <figcaption><span aria-hidden="true">{n}</span> Sample customer · demo</figcaption>
              </figure>
            </Reveal></li>
          ))}
        </ul>
      </div>
    </section>
  )
}
