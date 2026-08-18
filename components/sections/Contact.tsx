'use client'

import { useState } from 'react'
import SectionHead from '@/components/SectionHead'
import {
  CheckIcon,
  ClockIcon,
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  SendIcon,
  WhatsAppIcon,
} from '@/components/Icons'
import { createClient } from '@/lib/supabase/client'
import type { Section, SiteSettings } from '@/lib/types'
import { waLink } from '@/lib/utils'

export default function Contact({
  section,
  settings,
}: {
  section?: Section
  settings: SiteSettings
}) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle')

  function update(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('saving')
    try {
      const supabase = createClient()
      const { error } = await supabase.from('contact_messages').insert({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
      })
      if (error) throw error
      setStatus('done')
      setForm({ name: '', phone: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="contact" id="contact">
      <div className="container">
        <SectionHead section={section} />

        <div className="contact-shell reveal">
          <div className="contact-info">
            <h3>Contact Details</h3>
            <p>Reach out any way that&apos;s easiest — we usually reply within a few hours.</p>

            {settings.phone ? (
              <div className="c-item">
                <span className="ic">
                  <PhoneIcon />
                </span>
                <span>
                  <strong>Phone</strong>
                  <a href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}</a>
                </span>
              </div>
            ) : null}
            {settings.email ? (
              <div className="c-item">
                <span className="ic">
                  <MailIcon />
                </span>
                <span>
                  <strong>Email</strong>
                  <a href={`mailto:${settings.email}`}>{settings.email}</a>
                </span>
              </div>
            ) : null}
            {settings.address ? (
              <div className="c-item">
                <span className="ic">
                  <PinIcon />
                </span>
                <span>
                  <strong>Address</strong>
                  <span>{settings.address}</span>
                </span>
              </div>
            ) : null}
            {settings.business_hours ? (
              <div className="c-item">
                <span className="ic">
                  <ClockIcon />
                </span>
                <span>
                  <strong>Hours</strong>
                  <span>{settings.business_hours}</span>
                </span>
              </div>
            ) : null}

            <div className="contact-social">
              {settings.instagram_url ? (
                <a href={settings.instagram_url} target="_blank" rel="noopener" aria-label="Instagram">
                  <InstagramIcon />
                </a>
              ) : null}
              {settings.facebook_url ? (
                <a href={settings.facebook_url} target="_blank" rel="noopener" aria-label="Facebook">
                  <FacebookIcon />
                </a>
              ) : null}
              <a
                href={waLink(settings.whatsapp_number, `Hi ${settings.brand_name}!`)}
                target="_blank"
                rel="noopener"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon />
              </a>
            </div>
          </div>

          <div className="contact-form-wrap">
            <h3>Send Us a Message</h3>
            <p>We save every message and get back to you — or just WhatsApp us for a faster reply.</p>

            <form onSubmit={submit}>
              <div className="form-row">
                <div className="field">
                  <label htmlFor="cfName">Name</label>
                  <input id="cfName" required placeholder="Your name" value={form.name} onChange={update('name')} />
                </div>
                <div className="field">
                  <label htmlFor="cfPhone">Phone</label>
                  <input
                    id="cfPhone"
                    type="tel"
                    placeholder="+91 00000 00000"
                    value={form.phone}
                    onChange={update('phone')}
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="cfEmail">Email</label>
                <input
                  id="cfEmail"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={update('email')}
                />
              </div>
              <div className="field">
                <label htmlFor="cfMessage">Message</label>
                <textarea
                  id="cfMessage"
                  required
                  placeholder="Tell us what you're craving..."
                  value={form.message}
                  onChange={update('message')}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={status === 'saving'}>
                <SendIcon />
                {status === 'saving' ? 'Sending…' : 'Send Message'}
              </button>
              <p className="form-note">We typically reply within a few hours during business days.</p>
              {status === 'done' ? (
                <div className="form-success">
                  <CheckIcon style={{ width: 18, height: 18 }} />
                  Thanks! Your message has reached our team.
                </div>
              ) : null}
              {status === 'error' ? (
                <div className="form-error">Could not send right now — please WhatsApp us instead.</div>
              ) : null}
            </form>

            {settings.map_embed_url ? (
              <div className="map-embed">
                <iframe
                  src={settings.map_embed_url}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${settings.brand_name} location map`}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
