import { type CSSProperties } from 'react'
import {
  ChevronLeft,
  Menu,
  HomeIcon,
  UsersIcon,
  TicketIcon,
  UserIcon,
  WalletIcon,
  CardIcon,
  CashIcon,
  InfoIcon,
  SignalIcon,
  WifiIcon,
} from './icons'
import '../../styles/phone-screens.css'

/* ============================================================================
   A real six-faced 3D box, not a picture of a phone.

   The landing page rotates this thing a full turn on its Y axis between every
   scene, so at some point in every flip the viewer is looking at the back panel
   and at the rails edge-on. A flat <img> would vanish there. Each face is a
   separate element with backface-visibility:hidden, positioned by
   `rotate to its orientation, then translateZ(half of the dimension it faces)`.
   ========================================================================== */

/* ---- status bar ---------------------------------------------------------- */
function StatusBar({ time }: { time: string }) {
  return (
    <div className="lp-sb">
      <span>{time}</span>
      <span className="lp-sb-icons">
        <SignalIcon />
        <WifiIcon />
        <i className="lp-batt">94</i>
      </span>
    </div>
  )
}

/* ---- screen 0 — discover ------------------------------------------------- */
function ScreenDiscover() {
  return (
    <>
      <StatusBar time="16:20" />
      <div className="lp-app">
        <div className="lp-appbar">
          <span className="lp-applogo">ENTRAVA</span>
          <span className="lp-appbar-right">
            <span className="lp-pill">Mumbai</span>
            <span className="lp-avatar">RS</span>
          </span>
        </div>

        <div className="lp-chips">
          <span className="lp-chip" data-active="true">All</span>
          <span className="lp-chip">Tonight</span>
          <span className="lp-chip">This Week</span>
        </div>

        <div className="lp-feed">
          <div className="lp-card">
            <div className="lp-card-img" />
            <div className="lp-card-body">
              <h4 className="lp-card-title">Cosy Box Friday</h4>
              <p className="lp-card-venue">Cosy Box</p>
              <div className="lp-card-row">
                <span className="lp-card-when">Fri 27 Mar · 9:30 PM – 1:30 AM</span>
                <span className="lp-card-from">
                  <small>FROM</small>
                  <b>₹3000</b>
                </span>
              </div>
              <div className="lp-card-foot">
                <span className="lp-area">Lower Parel</span>
                <span className="lp-select">SELECT</span>
              </div>
            </div>
          </div>
          <div className="lp-card-peek" />
        </div>
      </div>

      <div className="lp-tabs">
        <span className="lp-tab" data-active="true"><HomeIcon /></span>
        <span className="lp-tab">
          <UsersIcon />
          <i className="lp-badge">2</i>
        </span>
        <span className="lp-tab"><TicketIcon /></span>
        <span className="lp-tab"><UserIcon /></span>
        <i className="lp-home-ind" />
      </div>
    </>
  )
}

/* ---- screen 1 — pre-book ------------------------------------------------- */
function ScreenPreBook() {
  return (
    <>
      <StatusBar time="16:20" />
      <div className="lp-app">
        <div className="lp-nav-back">
          <ChevronLeft />
          <span>
            <h4 className="lp-nav-title">145 Kamla Mills</h4>
            <p className="lp-nav-sub">Select your option · Saturday at the Mill</p>
          </span>
        </div>

        <p className="lp-group-label">Entry Options</p>
        <div className="lp-opt">
          <span>
            <h5>Stag Entry</h5>
            <p>₹3000 fixed</p>
          </span>
          <span className="lp-opt-right">
            <span className="lp-spots">1 spot left</span>
          </span>
        </div>
        <div className="lp-opt">
          <span>
            <h5>Couple Entry</h5>
            <p>₹5000 fixed</p>
          </span>
          <span className="lp-opt-right">
            <span className="lp-spots">2 spots left</span>
          </span>
        </div>

        <div className="lp-gap" />
        <p className="lp-group-label">Tables</p>
        <div className="lp-opt">
          <span>
            <h5>Table for 10</h5>
            <p>Up to 10 guests</p>
          </span>
          <span className="lp-opt-right">
            <span className="lp-price">₹25,000</span>
          </span>
        </div>
        <div className="lp-opt">
          <span>
            <h5>VIP Table</h5>
            <p>Up to 16 guests</p>
          </span>
          <span className="lp-opt-right">
            <span className="lp-price">₹50,000</span>
          </span>
        </div>
      </div>
      <div className="lp-tabs lp-tabs--bare">
        <i className="lp-home-ind" />
      </div>
    </>
  )
}

/* ---- screen 2 — pay ------------------------------------------------------ */
function ScreenPay() {
  return (
    <>
      <StatusBar time="16:20" />
      <div className="lp-app">
        <div className="lp-nav-back">
          <ChevronLeft />
          <span>
            <h4 className="lp-nav-title">Cosy Box</h4>
            <p className="lp-nav-sub">Payment Method · Cosy Box Friday</p>
          </span>
        </div>

        <div className="lp-total">
          <small>Total Amount</small>
          <b>₹3090</b>
        </div>

        <div className="lp-pay" data-sel="true">
          <span className="lp-pay-ico"><WalletIcon /></span>
          <span className="lp-pay-txt">
            <h5>UPI <i className="lp-rec">Recommended</i></h5>
            <p>Pay full amount now. Direct entry.</p>
          </span>
        </div>
        <div className="lp-pay">
          <span className="lp-pay-ico"><CardIcon /></span>
          <span className="lp-pay-txt">
            <h5>Credit / Debit Card</h5>
            <p>Pay full amount now. Direct entry.</p>
          </span>
        </div>
        <div className="lp-pay">
          <span className="lp-pay-ico"><CashIcon /></span>
          <span className="lp-pay-txt">
            <h5>Cash at Doorstep <InfoIcon /></h5>
            <p>Pay ₹90 now. Pay ₹3000 at venue.</p>
          </span>
        </div>

        <p className="lp-disclaimer">
          Valid government-issued photo ID (Aadhaar, Passport, or Driving Licence) will be
          checked at the venue entrance. If you are below the legal age limit, the venue
          reserves the right to refuse entry, including for pre-paid bookings. Platform fees
          are non-refundable in such cases.
        </p>

        <div className="lp-paynow">PAY NOW</div>
      </div>
    </>
  )
}

/* ---- screen 3 — entry ---------------------------------------------------- */

/* The supplied production QR is inverted visually to match the light-on-black
   treatment in the approved finale reference. */
function ScreenEntry() {
  return (
    <>
      <StatusBar time="9:31" />
      <div className="lp-entry">
        <span className="lp-entry-menu"><Menu /></span>

        <div className="lp-qr-frame">
          <span /><span /><span /><span />
          <img src="/entrava-download-qr.jpeg" alt="Scan to download Entrava" />
        </div>

        <p className="lp-entry-h">SKIP THE CROWD OUTSIDE</p>
        <p className="lp-entry-p">WALK STRAIGHT IN</p>
      </div>
      <div className="lp-tabs lp-tabs--bare">
        <i className="lp-home-ind" />
      </div>
    </>
  )
}

const SCREENS = [ScreenDiscover, ScreenPreBook, ScreenPay, ScreenEntry]

/* ---- the handset --------------------------------------------------------- */
export default function Phone({ screen }: { screen: number }) {
  return (
    <div className="lp-phone">
      {/*
        A stack of rounded silhouettes forms the titanium chassis. Rectangular
        side faces used to poke past the rounded corners whenever the phone
        tilted, which created the detached "rod" visible in the old build.
        These slices preserve one continuous iPhone-shaped outline at every
        viewing angle.
      */}
      <div className="lp-chassis" aria-hidden="true">
        {Array.from({ length: 25 }, (_, i) => (
          <i key={i} style={{ '--phone-z': `${i - 12}px` } as CSSProperties} />
        ))}
      </div>

      <div className="lp-controls" aria-hidden="true">
        <i className="lp-side-control lp-side-control--action" />
        <i className="lp-side-control lp-side-control--up" />
        <i className="lp-side-control lp-side-control--down" />
        <i className="lp-side-control lp-side-control--power" />
      </div>

      {/* front: frame + screen */}
      <div className="lp-face lp-face-front">
        <div className="lp-screen">
          <div className="lp-island" />
          {SCREENS.map((S, i) => (
            <div className="lp-scr" data-on={i === screen} key={i} aria-hidden={i !== screen}>
              <S />
            </div>
          ))}
        </div>
      </div>

      {/* back: camera island + wordmark */}
      <div className="lp-face lp-face-back">
        <div className="lp-cam">
          <i className="lp-lens" />
          <i className="lp-lens" />
          <i className="lp-lens" />
          <i className="lp-flash" />
        </div>
        <span className="lp-back-mark">ENTRAVA</span>
        <span className="lp-back-foot">DESIGNED FOR THE NIGHT</span>
      </div>

    </div>
  )
}
