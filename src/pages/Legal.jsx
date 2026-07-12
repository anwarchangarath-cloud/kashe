import { Link } from 'react-router-dom'

// Lightweight legal/policy pages. Content is generic UAE-marketplace boilerplate for the
// demo — replace with lawyer-reviewed copy before launch.
function LegalShell({ title, updated, sections }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-serif text-4xl font-medium text-ink">{title}</h1>
      <p className="mt-2 text-sm text-ink-muted">Last updated: {updated}</p>
      <div className="mt-8 space-y-6">
        {sections.map((s) => (
          <section key={s.h}>
            <h2 className="font-serif text-xl font-medium text-ink">{s.h}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink">{s.p}</p>
          </section>
        ))}
      </div>
      <Link to="/" className="mt-10 inline-block text-sm text-brand hover:underline">← Back to home</Link>
    </div>
  )
}

export function Privacy() {
  return (
    <LegalShell
      title="Privacy Policy"
      updated="July 2026"
      sections={[
        { h: 'What we collect', p: 'To fulfil your orders we collect your name, mobile number, delivery address and order history. We do not sell your personal data.' },
        { h: 'How we use it', p: 'Your information is used to process orders, arrange delivery, provide support, and — with your consent — send offers. Payment details are handled by our payment providers and never stored by KASH.' },
        { h: 'Sharing', p: 'We share only what is necessary with delivery partners and payment processors to complete your order, and with authorities where required by UAE law.' },
        { h: 'Your rights', p: 'You can view, update or delete your data from your account, or by contacting support. Deleting your account removes your personal data, subject to records we must retain for tax and legal reasons.' },
        { h: 'Contact', p: 'Questions about privacy? Reach us at support@kash.ae.' },
      ]}
    />
  )
}

export function Terms() {
  return (
    <LegalShell
      title="Terms of Service"
      updated="July 2026"
      sections={[
        { h: 'Using KASH', p: 'By placing an order you confirm you are at least 18 and that the information you provide is accurate. Accounts are personal to you.' },
        { h: 'Orders & pricing', p: 'All prices are in AED and include VAT where applicable. We may correct pricing errors and cancel affected orders with a full refund. Stock is not guaranteed until an order is confirmed.' },
        { h: 'Delivery', p: 'We deliver within the United Arab Emirates. Estimated delivery dates are shown at checkout and are not guaranteed. Cash on delivery is available UAE-wide.' },
        { h: 'Cancellations', p: 'You may cancel before an order is shipped. Once shipped, our Returns & Refunds policy applies.' },
        { h: 'Liability', p: 'KASH is not liable for indirect losses. Nothing in these terms limits rights you have under UAE consumer law.' },
      ]}
    />
  )
}

export function Refunds() {
  return (
    <LegalShell
      title="Returns & Refunds"
      updated="July 2026"
      sections={[
        { h: '15-day returns', p: 'Most items can be returned within 15 days of delivery, unused and in original packaging. Some items (perishables, personal-care, final-sale) are non-returnable and are marked as such.' },
        { h: 'How to return', p: 'Start a return from your account under Returns, or contact support. We will arrange collection or a drop-off point.' },
        { h: 'Refunds', p: 'Once we receive and inspect the item, refunds are issued to your original payment method or store wallet within 3–5 business days. Delivery fees are non-refundable unless the item was faulty.' },
        { h: 'Faulty or wrong items', p: 'If an item arrives damaged or incorrect, contact us within 48 hours for a free replacement or full refund.' },
      ]}
    />
  )
}
