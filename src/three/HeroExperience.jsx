import { Component, lazy, Suspense, useEffect, useState } from 'react'
import { useInView } from '../hooks/useInView'
import { useMediaQuery } from '../hooks/useMediaQuery'
import FallbackHero from './FallbackHero'
import { Sparkle } from '../components/Logo/Logo'
import './HeroExperience.css'
import { webglOK } from './webgl'

export { webglOK } from './webgl'

const ExperienceScene = lazy(() => import('./ExperienceScene'))

class Boundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { this.props.onFail?.() }
  render() { return this.state.failed ? null : this.props.children }
}

/*
 * Cinematic 3D stage. Does not render the canvas until the section is near the
 * viewport, pauses the render loop when it leaves, honours reduced-motion, and
 * shows the static vector pendant as loader backdrop and as the failure fallback.
 */
export default function HeroExperience({ rig }) {
  const [near, nearIn] = useInView({ rootMargin: '300px 0px' })
  const [vis, visIn] = useInView({ rootMargin: '0px' }, false)
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const mobile = useMediaQuery('(max-width: 899px)')
  const [supported] = useState(webglOK)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [tabHidden, setTabHidden] = useState(false)

  useEffect(() => {
    const on = () => setTabHidden(document.hidden)
    document.addEventListener('visibilitychange', on)
    return () => document.removeEventListener('visibilitychange', on)
  }, [])

  const [shown, setShown] = useState(false)
  useEffect(() => { if (ready && visIn) { const t = setTimeout(() => setShown(true), 250); return () => clearTimeout(t) } }, [ready, visIn])

  const use3D = supported && !failed
  const showCanvas = use3D && nearIn

  return (
    <div className="stage" ref={(el) => { near.current = el; vis.current = el }}>
      <div className={`stage__fallback ${shown && use3D ? 'is-hidden' : ''}`}>
        <FallbackHero tone="dark" />
      </div>

      {showCanvas && (
        <div className={`stage__canvas ${shown ? 'is-ready' : ''}`}>
          <Boundary onFail={() => setFailed(true)}>
            <Suspense fallback={null}>
              <ExperienceScene active={visIn && !tabHidden} animate={!reduced} mobile={mobile} rig={rig} onReady={() => setReady(true)} onFail={() => setFailed(true)} />
            </Suspense>
          </Boundary>
        </div>
      )}

      {use3D && !shown && (
        <div className="stage__loader" role="status">
          <Sparkle size={22} /><span>Preparing the atelier…</span>
        </div>
      )}
      {!use3D && <p className="stage__note">Showing a still image: 3D is unavailable on this device.</p>}
      <div className="stage__vignette" aria-hidden="true" />
    </div>
  )
}
