import { pageMetadata, renderPage } from '@/lib/render-page'

export const revalidate = 60

export const generateMetadata = () => pageMetadata('wholesale')

export default function Page() {
  return renderPage('wholesale')
}
