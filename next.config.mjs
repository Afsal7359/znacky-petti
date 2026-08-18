/** @type {import('next').NextConfig} */
const supabaseHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co').hostname
  } catch {
    return 'placeholder.supabase.co'
  }
})()

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: supabaseHost },
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'commons.wikimedia.org' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
}

export default nextConfig
