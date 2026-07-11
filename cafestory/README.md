# CafeStory — Premium Café Website

A production-ready, animated, luxury café website built with semantic HTML5, modern CSS and vanilla JavaScript, animated with GSAP + ScrollTrigger. No build step required — open and deploy as-is.

## Structure

```
cafestory/
├── index.html      Home — hero, featured menu, about preview, testimonials, CTA
├── menu.html        Menu — Coffee / Beverages / Desserts / Pizza / Pasta with tab filtering
├── about.html        About — brand story, values, team
├── gallery.html      Gallery — filterable masonry grid + custom lightbox
├── contact.html       Contact — reservation form, Google Map, phone, WhatsApp
├── css/
│   └── style.css      All design tokens + components (single stylesheet, no build)
├── js/
│   └── main.js         Shared behaviour: nav, cursor, GSAP reveals, tabs, lightbox, form
└── README.md
```

## Design concept

The site is built around a **"roast levels"** idea: sections alternate between
near-black *espresso* bands and warm *cream* bands as you scroll, echoing the
visual journey of a coffee roast. A bronze/brass metallic accent (never
orange) is used sparingly — on the scroll-progress bar (styled like a coffee
pour), the custom bean-shaped cursor, and hover states.

- **Display font:** Fraunces (luxury serif, used with restraint)
- **Body font:** Manrope (clean, modern sans-serif)
- **Palette:** Espresso `#150f0c`, Roast `#241812`, Cream `#f4ecdd`,
  Bronze `#b3894f`, Ember `#7c3f26`

## Features

- Fully responsive, mobile-first layout with a slide-in hamburger menu
- Sticky header that solidifies on scroll
- GSAP-powered hero text reveal, scroll-triggered section reveals, and subtle parallax
- Animated "roast" scroll-progress bar + custom bean cursor (desktop only)
- **Hero atmosphere:** floating coffee-bean particles, magnetic CTA buttons, and an
  endless brand marquee ticker beneath the hero
- Menu page with live category filtering (Coffee / Beverages / Desserts / Pizza / Pasta)
  — the home page's Featured Menu preview now includes one item from every category,
  including Pizza and Pasta
- **Order Online:** an "Add to Order" button on every menu item and the home page's
  featured cards, a persistent cart (stored in `localStorage`, so it survives page
  navigation), and checkout via a pre-filled WhatsApp message. There's no payment
  gateway wired up — swap the `cart-checkout` link for a real checkout flow (Razorpay,
  Stripe, etc.) when you're ready to take online payments
- **Live Table Availability:** a floor-plan style widget (full grid on the home page,
  a compact chip version on the contact page) showing which of 12 tables are
  available / occupied / reserved, with a lightweight simulation that shifts one
  table's status every few seconds so it always feels current. This is client-side
  demo data — connect it to your POS/reservation system's API for real-time accuracy
- Gallery with category filters and a fully custom lightbox (keyboard + click navigation)
- Client-side validated reservation form (front-end only — wire up a backend or a
  service like Formspree/Netlify Forms to receive submissions)
- Embedded Google Map for the Surat location
- Floating WhatsApp button with a pre-filled message, present on every page
- Lazy-loaded images throughout for fast page loads

## Before you deploy

1. **Images:** Currently uses Unsplash placeholder photography. Replace the `src`
   values in each HTML file with your own optimised photos (WebP recommended).
2. **Phone / WhatsApp / Email:** Search-and-replace `+919876543210` and
   `hello@cafestory.in` with your real contact details (found in each page's
   footer, contact page, and the floating WhatsApp button's `href`).
3. **Map:** The Google Maps embed currently searches "Surat, Gujarat, India".
   Replace the `src` of the `<iframe>` in `contact.html` with your exact
   address or Place ID for a pinpoint location.
4. **Form backend:** The reservation form validates client-side and shows a
   success message but does not send data anywhere. Connect it to your
   backend, or a form service (Formspree, Netlify Forms, Getform, etc.) by
   updating the `<form>` action/JS in `contact.html` / `js/main.js`.
5. **Social links:** Update the Instagram/Facebook URLs in each footer.

## Deployment

This is a static site — no build step. Deploy by:

- **Drag-and-drop:** Drop the `cafestory` folder onto Netlify, Vercel, or
  Cloudflare Pages.
- **GitHub Pages:** Push this folder to a repo and enable Pages on the `main` branch.
- **Any static host:** Upload the folder via FTP/S3/etc. — it's plain HTML/CSS/JS.

## Browser support

Modern evergreen browsers (Chrome, Edge, Safari, Firefox). Reduced-motion
preferences are respected; the custom cursor is automatically disabled on
touch devices.
