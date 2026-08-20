import { pageMetadata, renderPage } from '@/lib/render-page'

export const revalidate = 60

export const generateMetadata = () => pageMetadata('faq')

export default function Page() {
  return renderPage('faq')
}
