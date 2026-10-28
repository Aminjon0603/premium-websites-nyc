// Public copy for sitebyamin.com. Keep every claim here verifiable:
// no invented results, reviews, revision counts, refunds, or free hosting.

export const contact = {
  email: "amin2002abrorov@gmail.com",
  whatsappNumber: "13323450632",
  whatsappLink: "https://wa.me/13323450632",
  phoneLabel: "+1 332 345 0632",
  instagramLink: "https://www.instagram.com/sitebyamin/",
  instagramHandle: "@sitebyamin",
};

export const startingPrice = "$198";

// Shown in the pricing section. Payment is only taken after the demo and an agreed quote.
export const paymentMethods = [
  { name: "PayPal", value: "amincr335@gmail.com", note: "Send to this email" },
  { name: "Zelle", value: "(347) 876-7407", note: "Recipient: Mukhammadamin Abrorov" },
];

export const featuredProject = {
  id: "chess-and-truck",
  name: "Chess & Truck",
  url: "https://www.chessandtruck.com/",
  caseUrl: "/work/chess-and-truck",
  summary: "A multi-page website for kids' chess programs in New York City.",
  status: "Website developed and published. Program registration is opening soon.",
  formContext: "Chess & Truck (real project)",
  facts: [
    ["Client", "Chess & Truck, New York City"],
    ["Business", "Chess camps, tournaments, lessons, and after-school programs for kids"],
    ["My role", "Website design and development, integrations, testing, and deployment"],
  ],
  // Short, business-facing points for the homepage. Technical detail lives on the case page.
  benefits: [
    "Each of the four programs has its own page",
    "Easy to read and use on a phone",
    "Registration and payments ready, locked until programs open",
  ],
  images: {
    desktop: "/work/chess-truck-home-desktop.webp",
    mobile: "/work/chess-truck-home-mobile.webp",
    programsDesktop: "/work/chess-truck-programs-desktop.webp",
    programsMobile: "/work/chess-truck-programs-mobile.webp",
    campsDesktop: "/work/chess-truck-camps-desktop.webp",
  },
};

// Details for the Chess & Truck case page. Checked against the project's code
// (chess-and-truck-site) and the live site on 2026-10-27.
export const caseStudy = {
  task: "Parents should be able to compare four programs and get in touch quickly. The site also had to be ready for registration and payments, without letting anyone pay before programs open.",
  role: "I designed and built the site, set up the integrations, and handled testing and deployment. Chess & Truck runs the programs and supplied the program details and much of the homepage wording.",
  work: [
    {
      title: "Pages and design",
      items: [
        "Multi-page site: Home, Camps, Tournaments, Private Lessons, After-School, About, FAQ, and Contact",
        "Terms, Privacy, and other utility pages",
        "Responsive layout with a mobile menu",
        "Animations that turn off for visitors who prefer reduced motion",
      ],
    },
    {
      title: "Forms and email",
      items: [
        "Contact form with validation and clear error states",
        "Resend for contact emails and payment emails",
      ],
    },
    {
      title: "Payments and launch control",
      items: [
        "Server API routes on Vercel",
        "Stripe Checkout, a webhook, and a payment status check, prepared for when programs open",
        "A launch gate that blocks registration and payments until a program is approved and open",
      ],
    },
    {
      title: "Notify-me list",
      items: [
        "Supabase-based sign-up list with email confirmation, unsubscribe links, and access protection",
        "Prepared and tested, but not switched on for visitors yet",
      ],
    },
    {
      title: "Search and sharing",
      items: ["Page titles and descriptions", "sitemap.xml, robots.txt, and canonical links", "Social preview images"],
    },
    {
      title: "Launch and quality",
      items: [
        "Domain setup and publishing through GitHub and Vercel",
        "Automated tests for validation, launch rules, security, and the notify list",
        "Build checks and a launch-readiness script before any program opens",
      ],
    },
  ],
  features: [
    {
      title: "Four programs on one page",
      text: "Each has a card, a status label, and its own page.",
      image: "/work/chess-truck-programs-desktop.webp",
      alt: "Chess & Truck homepage section listing four programs: Chess Camps, Chess Tournaments, Private Chess Lessons, and After-School Programs",
    },
    {
      title: "No made-up details",
      text: "Dates and prices that aren't announced yet say so.",
      image: "/work/chess-truck-camps-desktop.webp",
      alt: "Chess & Truck camps page with a Registration Opening Soon label and a camp details panel",
    },
  ],
  result:
    "Registration, payments, and the notify-me list stay switched off until programs open. The first camp hasn't happened yet, so there are no results to report.",
  pricingNote:
    "Custom work like payments, databases, and email automation is quoted separately. It isn't included in Premium ($498).",
};

export const demos = [
  {
    id: "salon",
    label: "Demo concept",
    business: "Beauty salon",
    title: "Maple & Main Salon",
    problem: "Prices, hours, and the phone number right on the first screen.",
    features: ["Service menu with prices", "Call-to-book button"],
    demoUrl: "https://simple-everyday-salon.vercel.app/",
    desktop: "/work/salon-desktop.webp",
    mobile: "/work/salon-mobile.webp",
    alt: "Homepage of the Maple & Main Salon demo website",
    formContext: "Maple & Main Salon demo",
  },
  {
    id: "barber",
    label: "Demo concept",
    business: "Barbershop",
    title: "Neighborhood barbershop",
    problem: "Walk-in customers see the shop, services, and hours before they come in.",
    features: ["Storefront photos", "English and Spanish"],
    demoUrl: "https://mq-barber-shop.vercel.app/",
    desktop: "/work/barber-desktop.webp",
    mobile: "/work/barber-mobile.webp",
    alt: "Homepage of the barbershop demo website with storefront photos",
    formContext: "Barbershop demo",
  },
  {
    id: "spa",
    label: "Demo concept",
    business: "Spa and wellness",
    title: "Luxury spa",
    problem: "A visual style study: a calm, warm look for a spa or wellness studio.",
    features: ["Treatment cards", "FAQ"],
    demoUrl: "https://luxury-spa-demo.vercel.app/",
    desktop: "/work/spa-desktop.webp",
    mobile: "/work/spa-mobile.webp",
    alt: "Homepage of the luxury spa demo website",
    formContext: "Luxury spa demo",
  },
];

// Included in every package.
export const packageBase = ["Mobile-friendly design", "Contact form", "Your logo, text, and photos", "Free demo first"];

// Each package lists only what it adds on top of the one before it.
export const packages = [
  {
    label: "Starter",
    price: "$198",
    fit: "What you do and how to reach you.",
    pages: "1 page",
    adds: ["Clean, simple design"],
    notIncluded: "Domain connection not included",
    timing: "Usually ready for review in 3-5 business days once I have your content.",
  },
  {
    label: "Business",
    price: "$298",
    fit: "Separate pages for services, about, and contact.",
    pages: "Up to 5 pages",
    addsLabel: "Everything in Starter, plus",
    adds: ["Custom design", "Lead form", "Basic SEO setup", "Domain connection"],
    timing: "Date confirmed once I see your content.",
    recommended: true,
  },
  {
    label: "Premium",
    price: "$498",
    fit: "A full service menu, catalog, or booking.",
    pages: "Up to 10 pages",
    addsLabel: "Everything in Business, plus",
    adds: [
      "Advanced custom design",
      "Link or embed your booking app, or a catalog page",
      "Basic analytics setup",
      "Priority support: faster turnaround on edits",
    ],
    timing: "Date confirmed once I see your content.",
  },
];

export const quotedSeparatelyNote =
  "Your own booking system, online payments, and other custom features are quoted separately. Domain and hosting fees go to the provider.";

export const quotedSeparately = [
  "Domain and hosting fees, paid to the provider",
  "Your own booking or registration system",
  "Online payments and checkout",
  "Customer accounts, databases, and email automation",
  "Other third-party integrations",
];

export const bookingLevels = [
  { name: "Link to your booking app", text: "A Book button that opens Booksy, Square, Vagaro, or similar.", where: "Premium" },
  { name: "Embedded booking widget", text: "Your booking service's widget shown on your page.", where: "Premium" },
  { name: "Your own booking system", text: "Custom calendar, rules, and payments built for you.", where: "Quoted separately" },
];

export const carePlans = [
  {
    label: "Basic Care",
    price: "$78",
    period: "/month",
    included: ["Small text and image updates", "Basic technical monitoring", "Monthly website check"],
  },
  {
    label: "Growth Care",
    price: "$138",
    period: "/month",
    included: [
      "Everything in Basic Care",
      "Regular updates and new sections",
      "Basic SEO and content help",
      "Priority support: faster turnaround on edits",
    ],
  },
];

export const careTerms = "Both plans: one edit request per day. Replies can take 24 hours or more.";

// The process also carries the free demo and 50% deposit terms, so FAQ doesn't repeat them.
export const steps = [
  { title: "Tell me about your business", text: "Use the form or send a message." },
  { title: "Get a free demo", text: "A rough first version, plus the price and what's included." },
  { title: "50% deposit, then the build", text: "You review it on your phone and send edits by message." },
  { title: "Launch", text: "We publish the site. Care is optional." },
];

export const faqs = [
  {
    question: "How much does a website cost?",
    answer: "Starter is $198, Business $298, and Premium $498, one-time. Custom features are quoted separately.",
  },
  {
    question: "Do I have to pay monthly?",
    answer: "No. Care plans are optional. You can ask for updates later without one.",
  },
  {
    question: "How long does it take?",
    answer: "A Starter site is usually ready for review in 3-5 business days once I have your content. For bigger sites, I'll give you a date before we start.",
  },
  {
    question: "Do we need to get on a call?",
    answer: "No. The whole project can happen by message or email. If you'd like a call, just ask.",
  },
  {
    question: "Do I need hosting and a domain?",
    answer: "Yes. If you have them, I'll connect them (Business and Premium). If not, I'll help you choose. Those fees go to the provider.",
  },
];

// Shown under "More questions". Each adds something not covered above.
export const moreFaqs = [
  {
    question: "Are the salon, barbershop, and spa sites real clients?",
    answer: "No. They are demo concepts. Chess & Truck is a real client project.",
  },
];
