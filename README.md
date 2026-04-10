# Site by Amin

Sales website for Site by Amin, a premium website customization service for local service businesses.

## What this project is

This is a React + Vite landing page used to sell customized premium website systems for:

- dental clinics
- premium barbershops
- spa and wellness brands
- coaches, tutors, and experts

The site includes:

- hero and value proposition
- trust and proof section
- live demo cards
- process and pricing sections
- FAQ section
- contact form with a Vercel function endpoint
- custom OG preview for `sitebyamin.com`
- Vercel-ready production setup

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

- WhatsApp / Telegram: `+1 332 345 0632`
- Instagram: `@aminjon0603`
- Email: `amin2002abrorov@gmail.com`
