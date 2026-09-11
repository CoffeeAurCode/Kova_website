import { Link } from 'react-router-dom'
import '../styles/editorial-pages.css'

type LegalKind = 'privacy' | 'terms' | 'refund' | 'service'

const privacySections = [
  ['1. Data we collect', 'We collect your name, phone number, date of birth, gender and city to provide ticketing services. We only collect what is necessary to perform our service. Your phone number is used to sign you in via a one-time password.'],
  ['2. Use of contacts', "If you choose to use the Friends feature, we ask permission to access your contacts. Before that permission is requested, the app explains what happens.\n\nWhat actually happens: your contacts' phone numbers are sent to our servers so we can check which of them are already registered on Entrava. Contact names stay on your device. We do not store your address book, and we do not share it with venues, advertisers or anyone else. The check is only ever run against numbers already in your phone.\n\nYou can decline, and Entrava works normally without it."],
  ['3. Sharing plans with friends', 'After a successful booking, you can choose whether accepted Entrava friends may see that you are going to the event. This is off by default and controlled separately for each booking. Friends see your name and the public event details only. They never see your booking ID, QR code, guest names, ticket type, price or payment status. You can turn sharing off, and the plan stops appearing after the event date.'],
  ['4. Push notifications', 'If you allow notifications, we store a device notification token so Entrava can tell you when your venue KYC is approved, when you receive a friend request, or when a friend accepts your request. You can turn notifications off in your phone settings. We remove the token from your account when you log out on that device.'],
  ['5. Your rights', 'Under the DPDPA 2023 you have the right to access, correct or erase your data, and to withdraw consent at any time. You can delete your account from inside the app (Profile > Delete Account) or request deletion at entrava.app/delete-account.'],
  ['6. Data sharing', 'We share your name and booking details with the venue you booked with, so they can verify your entry. Payments are processed by Razorpay, who receive the payment information needed to complete the transaction. Booking alerts may be sent over WhatsApp, and account or social alerts may be sent as app notifications when you allow them. We do not sell your personal data.'],
  ['7. Data retention', 'When you delete your account, your personal details are erased. Booking records are retained in an anonymised form because they are financial records tied to payments already made, and venues need them for their guest lists.'],
  ['8. Children', 'Entrava is strictly for users aged 18 and over. We do not knowingly collect data from anyone under 18.'],
]

const pages: Record<LegalKind, { eyebrow: string; title: string; intro: string; sections: string[][] }> = {
  privacy: {
    eyebrow: 'Your information',
    title: 'Privacy Policy',
    intro: 'How Entrava uses and protects the information needed to run bookings, friendships and venue accounts.',
    sections: privacySections,
  },
  terms: {
    eyebrow: 'Using Entrava',
    title: 'Terms and Conditions',
    intro: 'The rules that apply when guests, venues and promoters use Entrava.',
    sections: [
      ['1. Entrava is a marketplace', 'Entrava connects guests with independent nightlife venues and promoters. The venue runs the event and controls admission, capacity, dress code and on-site service.'],
      ['2. Booking and payment', 'The full price and Entrava platform fee are shown before payment. You must provide accurate booking details and use a payment method you are authorised to use.'],
      ['3. Age and admission', 'Entrava is for people aged 18 or over. A booking does not override a venue\'s legal age checks, identification requirements, dress code or safety rules.'],
      ['4. Friends and split payments', 'Only add people you know. Each participant is responsible for their own share. A split booking is confirmed only when all required shares are paid before the deadline shown in the app.'],
      ['5. Acceptable content', 'Venue event names, descriptions and images must be accurate, lawful and appropriate. Users can report an event or block a venue in the app. We review reports and may remove content or accounts that break these rules.'],
      ['6. Governing law', 'These terms are governed by the laws of India. Courts in Mumbai, Maharashtra have jurisdiction.'],
    ],
  },
  refund: {
    eyebrow: 'Cancellations and returns',
    title: 'Refund and Cancellation Policy',
    intro: 'What happens when a booking is cancelled, a split expires or an event does not go ahead.',
    sections: [
      ['Guest cancellation', 'Bookings are final once payment is confirmed unless the event page clearly states otherwise. The 3% Entrava platform fee is non-refundable except where required by law.'],
      ['Event cancellation', 'If the venue or promoter cancels the event, eligible guests receive a refund of the ticket amount to the original payment method. Bank and payment-network processing times may apply.'],
      ['Incomplete split booking', 'If all required split-payment shares are not paid before the deadline shown in the app, the booking is cancelled and captured shares are automatically sent for refund.'],
      ['Payment or QR problem', 'Contact entrava.app@gmail.com with the booking ID. Do not share an OTP, card PIN or full card details. We will check the Razorpay payment record and booking status.'],
      ['Refund timing', 'Approved refunds are returned through Razorpay to the original payment method. The final credit time depends on the issuing bank or card network.'],
    ],
  },
  service: {
    eyebrow: 'What we deliver',
    title: 'Service Delivery Policy',
    intro: 'Entrava provides digital booking and venue-entry services. No physical product is shipped.',
    sections: [
      ['Digital delivery', 'After a successful payment, the booking appears in My Bookings. The entry QR is generated when the booking is fully confirmed. For split payments, that means every required participant has paid.'],
      ['Cash-at-venue bookings', 'Where offered, the guest pays the Entrava platform fee online and pays the remaining venue amount at the door. The app shows both amounts before confirmation.'],
      ['Venue responsibility', 'The venue is responsible for running the event and checking entry. Entrava provides the booking record and QR verification tools.'],
      ['Support', 'For a missing booking, payment mismatch or QR issue, email entrava.app@gmail.com or call +91 87792 27628.'],
    ],
  },
}

export default function LegalPage({ kind }: { kind: LegalKind }) {
  const page = pages[kind]
  return (
    <main className="ep-page legal-page">
      <header className="legal-hero">
        <p className="legal-eyebrow">{page.eyebrow}</p>
        <h1>{page.title}</h1>
        <p className="legal-intro">{page.intro}</p>
        <p className="legal-updated">Last updated 11 September 2026</p>
      </header>

      <div className="legal-layout">
        <aside className="legal-index" aria-label="Legal pages">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/refund-policy">Refunds</Link>
          <Link to="/service-delivery">Service delivery</Link>
        </aside>

        <article className="legal-copy">
          {page.sections.map(([heading, body]) => (
            <section key={heading}>
              <h2>{heading}</h2>
              <p>{body}</p>
            </section>
          ))}
          <section>
            <h2>Contact and complaints</h2>
            <p>Aarav Sanghvi is Entrava's Grievance Officer. Email <a href="mailto:entrava.app@gmail.com">entrava.app@gmail.com</a> or call <a href="tel:+918779227628">+91 87792 27628</a>.</p>
          </section>
        </article>
      </div>
    </main>
  )
}
