# RevOps Workflow Engine Landing Page

A single-page marketing site for RevOps/GTM workflow automation at `rev.teravictus.com`.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Deployment**: Vercel

## Quick Start

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Local Development

1. **Clone the repository**

```bash
git clone <repo-url>
cd revops
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values (the defaults should work for development).

4. **Run the development server**

```bash
npm run dev
```

5. **Open in browser**

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
revops/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx             # Main landing page
│   ├── globals.css          # Global styles
│   ├── sitemap.ts           # Dynamic sitemap
│   ├── robots.ts            # Robots.txt configuration
│   └── api/
│       └── contact/
│           └── route.ts     # Contact form API
├── components/
│   ├── Hero.tsx             # Hero section with CTAs
│   ├── Features.tsx         # 3 workflow features
│   ├── HowItWorks.tsx       # 3-step process
│   ├── WhoItsFor.tsx        # Target audience
│   ├── Trust.tsx            # Social proof
│   ├── Pricing.tsx          # Pricing hint
│   ├── ContactForm.tsx      # Contact form
│   └── Footer.tsx           # Footer
├── public/
│   └── favicon.svg          # Site favicon
├── .env.example             # Environment template
└── README.md                # This file
```

## Deploy to Vercel

### Option 1: Vercel CLI

1. **Install Vercel CLI**

```bash
npm i -g vercel
```

2. **Deploy**

```bash
vercel
```

3. **Set environment variables in Vercel dashboard**

Go to Project Settings → Environment Variables and add:
- `NEXT_PUBLIC_CALENDAR_URL` (required)
- `CONTACT_EMAIL` (required)
- Other optional variables as needed

4. **Configure custom domain**

In Vercel dashboard, add `rev.teravictus.com` as a custom domain.

### Option 2: GitHub Integration

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Configure environment variables
4. Deploy

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_CALENDAR_URL` | Yes | Google Calendar booking link |
| `CONTACT_EMAIL` | Yes | Fallback contact email |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics ID |
| `HUBSPOT_PORTAL_ID` | No | HubSpot portal ID |
| `HUBSPOT_FORM_ID` | No | HubSpot form ID |
| `PIPEDREAM_WEBHOOK_URL` | No | Pipedream webhook for automation |
| `SLACK_WEBHOOK_URL` | No | Slack webhook for notifications |
| `SENTRY_DSN` | No | Sentry error tracking |

## Integrations

### HubSpot

To enable HubSpot form submissions:
1. Set `HUBSPOT_PORTAL_ID` and `HUBSPOT_FORM_ID`
2. Uncomment the HubSpot section in `app/api/contact/route.ts`

### Slack Notifications

To enable Slack notifications for form submissions:
1. Create an incoming webhook in Slack
2. Set `SLACK_WEBHOOK_URL`
3. Uncomment the Slack section in `app/api/contact/route.ts`

### Pipedream

To connect to Pipedream workflows:
1. Create a webhook trigger in Pipedream
2. Set `PIPEDREAM_WEBHOOK_URL`
3. Uncomment the Pipedream section in `app/api/contact/route.ts`

---

## Founder Notes

### First 3 Experiments After Deploy

1. **Launch Apollo Sequence**
   - Create an Apollo sequence targeting RevOps leaders at Series A-B AI/DevTools companies
   - Link directly to `rev.teravictus.com` with UTM parameters
   - Track conversion via contact form submissions

2. **LinkedIn Cold Post**
   - Write a post about a specific RevOps pain point (e.g., lead routing chaos)
   - Target SF RevOps community with relevant hashtags
   - Include CTA to book 12-minute call
   - Consider boosting for initial reach

3. **Direct Outreach (50 messages)**
   - Identify 50 RevOps/Sales Ops leaders at target companies
   - Personalized outreach via LinkedIn or email
   - CTA: "12-minute call to see if we can help with [specific pain point]"
   - Track response rate and booking conversion

### Metrics to Track

- Page visits (Google Analytics)
- CTA clicks (book call button)
- Form submissions
- Call bookings → meetings held → pilots started

---

## License

Private - Teravictus
