import { pageMetadata, renderPage } from '@/lib/render-page'

export const revalidate = 60

export const generateMetadata = () => pageMetadata('combos')

export default function Page() {
  return renderPage('combos')
}
