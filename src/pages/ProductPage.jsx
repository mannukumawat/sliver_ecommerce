import { useParams } from 'react-router-dom'
import { getProduct, related } from '../data/products'
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs'
import ProductDetail from '../components/ProductDetail/ProductDetail'
import ProductGrid from '../components/ProductGrid/ProductGrid'
import NotFoundPage from './NotFoundPage'
import { categories } from '../data/categories'

export default function ProductPage() {
  const { slug } = useParams()
  const product = getProduct(slug)
  if (!product) return <NotFoundPage />
  const cat = categories.find((c) => c.slug === product.category)
  return (
    <>
      <div className="container">
        <Breadcrumbs trail={[
          { label: 'Home', to: '/' },
          { label: 'Collection', to: '/collection' },
          { label: cat.name, to: `/collection?category=${cat.slug}` },
          { label: product.name },
        ]} />
        <div style={{ paddingBottom: 'clamp(48px, 7vw, 96px)' }}>
          <ProductDetail key={product.id} product={product} />
        </div>
      </div>
      <section className="section section--tint" aria-labelledby="rel">
        <div className="container">
          <div className="section-head"><div><p className="eyebrow">You may also like</p><h2 id="rel">Related pieces</h2></div></div>
          <ProductGrid products={related(product)} />
        </div>
      </section>
    </>
  )
}
