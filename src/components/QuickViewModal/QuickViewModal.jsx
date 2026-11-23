import { products } from '../../data/products'
import { useUI } from '../../context/UIContext'
import Drawer from '../Drawer/Drawer'
import ProductDetail from '../ProductDetail/ProductDetail'
import './QuickViewModal.css'

export default function QuickViewModal() {
  const { quickViewId, closeQuickView } = useUI()
  const product = products.find((p) => p.id === quickViewId)
  return (
    <Drawer open={Boolean(product)} onClose={closeQuickView} side="center" title="Quick view" hideHead className="qv">
      {product && (
        <div className="qv__body">
          <ProductDetail key={product.id} product={product} compact onAdded={closeQuickView} />
        </div>
      )}
    </Drawer>
  )
}
