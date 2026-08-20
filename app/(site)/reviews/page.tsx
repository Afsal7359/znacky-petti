import { pageMetadata, renderPage } from '@/lib/render-page'

export const revalidate = 60

export const generateMetadata = () => pageMetadata('reviews')

export default function Page() {
  return renderPage('reviews')
}
