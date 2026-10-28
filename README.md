# Site by Amin

Sales website for Site by Amin, a website customization service for small businesses.

## What this project is

React + Vite site for Site by Amin, a one-person web design service for NYC small businesses.

Pages:

- `/` - home: hero, featured Chess & Truck project, demo concepts, pricing and care plans, process, about, FAQ, contact form
- `/work/chess-and-truck` - Chess & Truck case study (rewritten to `index.html` in `vercel.json`)

All public copy and prices live in `src/siteContent.js`. Screenshots of real projects live in `public/work/`.
The social preview `public/sitebyamin-og.png` is rendered from `public/og-preview.html` at 1200x630.

## Local development

```powershell
npm.cmd install
npm.cmd run dev
```

If you want to test the contact form function locally, use `vercel dev` instead of plain Vite dev.

## Production build

```powershell
npm.cmd run build
```

## Deploy

This project is ready for Vercel.

Suggested flow:

1. Create an empty GitHub repository named `premium-websites-nyc`
2. Push this project to `main`
3. Import the repository into Vercel
4. Keep deploying future changes through `git push`

## Contact form env vars

Add these variables in Vercel before using the form in production:

- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL`
- `CONTACT_TO_EMAIL` (optional, defaults to `amin2002abrorov@gmail.com`)

Suggested setup:

- `CONTACT_FROM_EMAIL`: a verified sender such as `Site by Amin <hello@sitebyamin.com>`
- `CONTACT_TO_EMAIL`: `amin2002abrorov@gmail.com`

## Contact used on the site

- WhatsApp: `+1 332 345 0632`
- Instagram: `@sitebyamin`
- Email: `amin2002abrorov@gmail.com`
