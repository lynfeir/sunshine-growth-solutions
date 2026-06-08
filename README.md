# Sunshine Growth Solutions — Website

A warm, hand-crafted marketing site for **Sunshine Growth Solutions** by Tonya DiClemente —
business development, growth strategy, and proposal solutions for AEC firms.

Built as a fully static site (HTML + CSS + JS). No build step, no framework, no backend.
Deploys anywhere, loads instantly, and is fully responsive and accessible.

---

## Quick start

You can open `index.html` directly in a browser. To preview with a local server (recommended,
so the contact form's `fetch` works correctly):

```bash
# Python 3 (already installed on most systems)
python -m http.server 8080
# then visit http://localhost:8080
```

```bash
# or with Node
npx serve .
```

---

## File structure

```
.
├── index.html                # All page sections in one file
├── css/styles.css            # Boho/floral design system
├── js/main.js                # Nav, scroll reveals, scrollspy, stat counters, form
├── assets/
│   ├── favicon.svg           # Sun-and-leaf favicon
│   ├── og-image.png          # 1200x630 social-share image
│   └── og-image.html         # Editable HTML version of the OG image
├── scripts/generate_og.py    # Regenerates og-image.png with Pillow
├── robots.txt                # Allows all crawlers, links to sitemap
├── sitemap.xml               # Single homepage entry
├── .claude/launch.json       # Local preview server config
└── README.md
```

---

## Configuration checklist (15 minutes)

Everything that needs swapping is below. All placeholders are real, working values you can replace.

### 1. Contact form — connect it to email (required)

The form uses [Web3Forms](https://web3forms.com) — a free, no-account service that emails
form submissions directly to you. **It will not deliver mail until you add a key.**

1. Go to https://web3forms.com → enter your email → copy the **access key**.
2. Open `index.html`, find this line and paste your key:
   ```html
   <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY" />
   ```
3. That's it. Submissions will now arrive in your inbox.

Until then, the form will tell visitors to email you instead, so nothing is broken.

### 2. Contact info

In `index.html` and the JSON-LD block at the top, replace:

| Placeholder                              | Where it appears                          |
| ---------------------------------------- | ----------------------------------------- |
| `hello@sunshinegrowthsolutions.com`      | Contact section, footer, JSON-LD          |
| `(000) 000-0000` / `+1-000-000-0000`     | Contact section, footer, JSON-LD          |

### 3. Founder photo

The About section currently shows a "TD" monogram inside a styled arch frame. To use a real
portrait, edit the `.arch-photo` block in `index.html`:

```html
<div class="arch-photo" role="img" aria-label="Portrait of Tonya DiClemente">
  <img src="assets/tonya.jpg" alt="" style="width:100%;height:100%;object-fit:cover;" />
</div>
```

The arch shape, gold ring, and decorative flower will frame it automatically.

### 4. Stats and testimonials

Open `index.html` and search for the `<!-- ============ RESULTS / STATS + TESTIMONIALS -->`
section. Replace the placeholder numbers (`15+`, `$250M+`, `40+`, `95%`) and the three
testimonial quotes with real ones. There's a note at the bottom of that section that you
can delete once you do.

### 5. Domain

If your domain differs from `sunshinegrowthsolutions.com`, replace it in:
- `index.html` `<link rel="canonical">`, `og:url`, JSON-LD `url`
- `sitemap.xml`
- `robots.txt`

---

## Deploy

This is a static site — drop it anywhere.

| Host                  | How                                                                                      |
| --------------------- | ---------------------------------------------------------------------------------------- |
| **Netlify** (easiest) | Drag the project folder onto https://app.netlify.com/drop. Done.                         |
| **Vercel**            | `npm i -g vercel && vercel` from the project root.                                       |
| **Cloudflare Pages**  | Connect repo, leave build command blank, set output directory to `.`.                    |
| **GitHub Pages**      | Push to a repo, enable Pages on the `main` branch.                                       |
| **Any web host**      | Upload the folder contents to the public web root via SFTP.                              |

After deploy: set up the domain, then update the URLs in the meta tags above.

---

## Customizing the design

Open `css/styles.css` — every color and font is a CSS custom property at the top of the file
under `:root`. Examples:

```css
--cream:        #FCF6EA;   /* page background */
--sun:          #EBA63A;   /* primary gold accent */
--sun-deep:     #D5821F;   /* darker hover/CTA */
--terracotta:   #C0603A;
--sage-deep:    #5F6B43;
--font-display: "Fraunces", serif;
--font-body:    "Nunito Sans", sans-serif;
--font-script:  "Caveat", cursive;
```

Change any of these and the entire site updates.

---

## Regenerating the OG image

`assets/og-image.png` is what shows up when the site is shared on social media or in chat
apps. To regenerate after changing the headline or brand:

```bash
python -m pip install pillow      # one-time
python scripts/generate_og.py
```

The HTML version (`assets/og-image.html`) is included for reference and can be opened in
the browser to preview at 1200x630 before regenerating.

---

## What's already taken care of

- ✅ Semantic HTML, lang attribute, single `<h1>`, logical heading order
- ✅ Skip-to-content link, visible focus rings, ARIA labels on icon-only controls
- ✅ Mobile-first responsive (3 breakpoints: 1000 / 760 / 560)
- ✅ Mobile hamburger nav with full keyboard + Escape support
- ✅ Contact form: client-side validation, ARIA error announcements, honeypot,
      loading state, success/error messaging
- ✅ Prefers-reduced-motion respected — animations disable cleanly
- ✅ SEO: full meta, Open Graph, Twitter cards, JSON-LD, sitemap, robots.txt
- ✅ Favicon (SVG, scales perfectly on retina)
- ✅ Smooth scroll, scrollspy on nav links, animated stat counters
- ✅ No external JS dependencies — works offline after first load

---

## Browser support

Tested in current Chrome, Edge, Firefox, and Safari. Uses modern CSS (`color-mix`, `clamp`,
`grid auto-fit`), which is supported by all browsers from 2023 onward.

---

## Credits

Design and build: tailored boho/sunshine identity inspired by the warmth of the brand.
Fonts via Google Fonts (Fraunces, Nunito Sans, Caveat).

🌞 Built with sunshine for Tonya DiClemente.
