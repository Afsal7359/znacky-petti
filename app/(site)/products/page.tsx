import { pageMetadata, renderPage } from '@/lib/render-page'

export const revalidate = 60

export const generateMetadata = () => pageMetadata('products')

export default function Page() {
  return renderPage('products')
}
