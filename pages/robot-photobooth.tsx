import ProductPageView from '../components/ProductPageView'
import { products } from '../data/products'
import { useLandingMarket } from '../hooks/useLandingMarket'

const robotProduct = products.find((p) => p.slug === 'robot-photobooth')!

/** Shared robot landing; market resolved from URL (/texas/products/robot-photobooth, etc.). */
export default function RobotPhotoboothLanding() {
  const market = useLandingMarket()
  return <ProductPageView product={robotProduct} marketId={market.id} />
}
