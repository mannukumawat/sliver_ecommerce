import Button from '../../components/Button/Button'
import FallbackHero from '../../three/FallbackHero'

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__inner container">
        <div className="hero__text">
          <p className="eyebrow hero__in" style={{ '--i': 0 }}>Silver jewellery, designed in India</p>
          <h1 id="hero-title" className="hero__title hero__in" style={{ '--i': 1 }}>
            Jewellery That Tells<br /><em>Your Story.</em>
          </h1>
          <p className="hero__copy hero__in" style={{ '--i': 2 }}>Pure Silver. Timeless You.</p>
          <div className="hero__cta hero__in" style={{ '--i': 3 }}>
            <Button to="/collection" size="lg">Explore Collection</Button>
            <Button to="/#story" variant="secondary" size="lg">Discover Our Story</Button>
          </div>
        </div>
        <div className="hero__visual hero__in" style={{ '--i': 2 }}>
          <div className="hero__frame">
            <FallbackHero tone="light" label="AURAVÉ silver pendant necklace with a blue stone" />
          </div>
          <p className="hero__tag">The Blue Stone Pendant<span>Demo piece</span></p>
        </div>
      </div>
    </section>
  )
}
