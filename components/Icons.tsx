import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export const WhatsAppIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.13-2.9-7C17.19 3.03 14.7 2 12.04 2Zm5.8 14.15c-.24.68-1.4 1.32-1.93 1.37-.5.05-1 .25-3.36-.7-2.84-1.13-4.66-4.02-4.8-4.21-.14-.19-1.15-1.53-1.15-2.92s.72-2.07.98-2.35c.25-.28.56-.34.75-.34h.53c.17 0 .4-.03.62.48.24.57.8 1.96.87 2.1.07.15.12.32.02.51-.09.19-.14.31-.28.48-.14.16-.29.36-.42.48-.14.14-.28.29-.13.56.16.28.7 1.16 1.51 1.88 1.04.93 1.92 1.22 2.19 1.36.28.14.44.12.6-.07.17-.19.71-.83.9-1.11.19-.28.38-.23.63-.14.26.09 1.64.77 1.92.91.28.14.47.21.53.33.07.12.07.68-.17 1.36Z" />
  </svg>
)

export const CartIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L22 8H6" />
    <circle cx="9" cy="21" r="1.4" />
    <circle cx="18" cy="21" r="1.4" />
  </svg>
)

export const CartPlusIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L22 8H6" />
    <circle cx="9" cy="21" r="1.4" />
    <circle cx="18" cy="21" r="1.4" />
    <path d="M12 6.5h5M14.5 4v5" />
  </svg>
)

export const CheckIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} strokeWidth={2.4} {...p}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

export const BagIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
)

export const LeafIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <path d="M11 20A7 7 0 0 1 4 13c0-4 3-8 8-11 5 3 8 7 8 11a7 7 0 0 1-7 7" />
    <path d="M11 20a7 7 0 0 1-7-7c0-1 .1-2 .3-3" />
  </svg>
)

export const TrophyIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <circle cx="12" cy="8" r="6" />
    <path d="m9 14-2 7 5-3 5 3-2-7" />
  </svg>
)

export const ShieldIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <path d="M12 2 4 5v6c0 5 3.4 8.7 8 11 4.6-2.3 8-6 8-11V5l-8-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

export const BoxIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <path d="M21 8 12 3 3 8l9 5 9-5Z" />
    <path d="M3 8v8l9 5 9-5V8" />
    <path d="M12 13v8" />
  </svg>
)

export const TruckIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <rect x="1" y="7" width="14" height="10" rx="1.5" />
    <path d="M15 10h4l3 3v4h-7z" />
    <circle cx="6" cy="19" r="1.6" />
    <circle cx="18" cy="19" r="1.6" />
  </svg>
)

export const SproutIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <path d="M12 22V11" />
    <path d="M12 11C12 7 9 4 5 4c0 4 3 7 7 7Z" />
    <path d="M12 13c0-3.3 2.7-6 6-6 0 3.3-2.7 6-6 6Z" />
  </svg>
)

export const KnifeIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <path d="M4 20 20 4" />
    <path d="M14 4h6v6c-3.5 0-6-2.5-6-6Z" />
    <path d="m8 16-4 4" />
  </svg>
)

export const FlameIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <path d="M12 2c1.5 4-2 5-2 8a4 4 0 0 0 8 0c0-1.2-.4-2.2-1-3 2 1.5 3 4 3 6a8 8 0 1 1-16 0C4 8 8.5 5 12 2Z" />
  </svg>
)

export const SpiceIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <path d="M9 3h6l-.6 4H9.6L9 3Z" />
    <path d="M8.5 7h7l1.2 12a2 2 0 0 1-2 2.2H9.3a2 2 0 0 1-2-2.2L8.5 7Z" />
    <path d="M10 12h.01M13 15h.01M11 17h.01" />
  </svg>
)

export const ClockIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
)

export const PhoneIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
  </svg>
)

export const MailIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m2 7 10 6 10-6" />
  </svg>
)

export const PinIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <path d="M12 2 4 5v6c0 5 3.4 8.7 8 11 4.6-2.3 8-6 8-11V5l-8-3Z" />
  </svg>
)

export const InstagramIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} strokeWidth={1.8} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" />
  </svg>
)

export const FacebookIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} strokeWidth={1.8} {...p}>
    <path d="M14 9h3V6h-3c-1.66 0-3 1.34-3 3v2H9v3h2v6h3v-6h3l1-3h-4V9c0-.55.45-1 1-1Z" />
  </svg>
)

export const YoutubeIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} strokeWidth={1.8} {...p}>
    <rect x="2" y="5" width="20" height="14" rx="4" />
    <path d="m10 9 5 3-5 3V9Z" />
  </svg>
)

export const ChevronLeft = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} strokeWidth={2.2} {...p}>
    <path d="m15 18-6-6 6-6" />
  </svg>
)

export const ChevronRight = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} strokeWidth={2.2} {...p}>
    <path d="m9 18 6-6-6-6" />
  </svg>
)

export const ChevronUp = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} strokeWidth={2.2} {...p}>
    <path d="m18 15-6-6-6 6" />
  </svg>
)

export const CloseIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
)

export const SendIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <path d="m22 2-7 20-4-9-9-4 20-7Z" />
    <path d="M22 2 11 13" />
  </svg>
)

export const SparkIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
  </svg>
)

export const TagIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <path d="M20.6 13.4 12 22l-9-9V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z" />
    <circle cx="7.5" cy="7.5" r="1.5" />
  </svg>
)

export const ArrowRight = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

const ICONS: Record<string, (p: P) => React.JSX.Element> = {
  leaf: LeafIcon,
  trophy: TrophyIcon,
  shield: ShieldIcon,
  box: BoxIcon,
  truck: TruckIcon,
  sprout: SproutIcon,
  knife: KnifeIcon,
  flame: FlameIcon,
  spice: SpiceIcon,
  clock: ClockIcon,
  bag: BagIcon,
  cart: CartIcon,
  spark: SparkIcon,
  tag: TagIcon,
  whatsapp: WhatsAppIcon,
}

export const ICON_KEYS = Object.keys(ICONS)

export function Icon({ name, ...rest }: { name: string } & P) {
  const Cmp = ICONS[name] ?? LeafIcon
  return <Cmp {...rest} />
}
