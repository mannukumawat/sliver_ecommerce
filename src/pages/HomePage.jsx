import { useEffect, useRef, useState } from 'react'
import EditorialHero from './home/EditorialHero'
import ScrollExperience from '../experience/ScrollExperience'
import HorizontalChapter from '../experience/HorizontalChapter'
import '../experience/horizontal.css'
import { webglOK } from '../three/HeroExperience'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { Bestsellers, BrandStory, Categories, Editorial, NewArrivals, Testimonials, TrustStrip } from './home/Sections'
import Newsletter from '../components/Newsletter/Newsletter'
import './home/Home.css'

export default function HomePage() {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const scrollHero = webglOK() && !reduced
  const [atelierOpen, setAtelierOpen] = useState(false)
  const atelier = useRef(null)
  useEffect(() => {
    if (atelierOpen) atelier.current?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' })
  }, [atelierOpen, reduced])
  return (
    <>
      <EditorialHero onExplore={scrollHero ? () => setAtelierOpen(true) : undefined} />
      {scrollHero && atelierOpen && <div ref={atelier}><ScrollExperience /></div>}
      {scrollHero && <HorizontalChapter />}
      <TrustStrip />
      <Categories />
      <NewArrivals />
      <Bestsellers />
      <Editorial />
      <BrandStory />
      <Testimonials />
      <Newsletter />
    </>
  )
}
