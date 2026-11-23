import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AnnouncementBar from '../components/AnnouncementBar/AnnouncementBar'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import CartDrawer from '../components/CartDrawer/CartDrawer'
import QuickViewModal from '../components/QuickViewModal/QuickViewModal'
import Toast from '../components/Toast/Toast'
import SmoothScroll from './SmoothScroll'
import CustomCursor from '../components/CustomCursor/CustomCursor'

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    const l = window.__lenis
    if (hash) {
      const t = setTimeout(() => {
        const el = document.getElementById(hash.slice(1))
        if (!el) return
        if (l) l.scrollTo(el, { offset: -80 })
        else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 80)
      return () => clearTimeout(t)
    }
    if (l) l.scrollTo(0, { immediate: true })
    else window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
}

export default function Layout() {
  const { pathname } = useLocation()
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <SmoothScroll />
      <CustomCursor />
      <ScrollManager />
      <AnnouncementBar />
      <Header />
      <main id="main" key={pathname} className="page-enter">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <QuickViewModal />
      <Toast />
    </>
  )
}
