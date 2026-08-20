import { pageMetadata, renderPage } from '@/lib/render-page'

export const revalidate = 60

export const generateMetadata = () => pageMetadata('contact')

export default function Page() {
  return renderPage('contact')
}
