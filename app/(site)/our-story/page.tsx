import { pageMetadata, renderPage } from '@/lib/render-page'

export const revalidate = 60

export const generateMetadata = () => pageMetadata('our-story')

export default function Page() {
  return renderPage('our-story')
}
