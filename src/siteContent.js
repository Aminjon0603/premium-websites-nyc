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

export const featuredProject = {
  id: "chess-and-truck",
  name: "Chess & Truck",
  url: "https://www.chessandtruck.com/",
  caseUrl: "/work/chess-and-truck",
  summary: "A multi-page website for kids' chess programs in New York City.",
  status: "Website developed and published. Program registration is opening soon.",
  formContext: "Project like Chess & Truck",
  facts: [
    ["Client", "Chess & Truck, New York City"],
    ["Business", "Chess camps, tournaments, lessons, and after-school programs for kids"],
    ["My role", "Website design and development, integrations, testing, and deployment"],
    ["Status", "Published. Registration opening soon"],
  ],
  highlights: [
    "Separate pages for Camps, Tournaments, Private Lessons, and After-School",
    "Phone-friendly layout and menu, with motion that respects reduced-motion settings",
    "Stripe checkout and email confirmations, built and locked until programs open",
    "Search basics: sitemap, canonical links, and social previews",
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
  task: [
    "Chess & Truck runs chess programs for kids in New York City. Parents need to understand four different programs quickly, find answers to common questions, and get in touch.",
    "The site also had to be ready to take registrations and payments once programs open, without letting anyone register or pay before then.",
  ],
  role: [
    "I designed and built the website, set up the integrations, wrote the tests, and handled deployment and the domain.",
    "Chess & Truck runs the programs. Program details and much of the homepage wording come from the Chess & Truck team.",
  ],
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
        "Stripe Checkout, a webhook, and a payment status check",
        "A launch gate that blocks registration and payments until a program is approved and open",
      ],
    },
    {
      title: "Notify-me list",
      items: [
        "Supabase-based sign-up list with email confirmation, unsubscribe links, and access protection",
        "Built and tested, but not switched on for visitors yet",
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
      title: "Four programs, one clear homepage",
      text: "Each program gets its own card, status label, and page, so parents can go straight to the one they care about.",
      image: "/work/chess-truck-programs-desktop.webp",
      alt: "Chess & Truck homepage section listing four programs: Chess Camps, Chess Tournaments, Private Chess Lessons, and After-School Programs",
    },
    {
      title: "Honest program pages",
      text: "Program pages show what is planned and what is not announced yet, instead of placeholder dates or prices.",
      image: "/work/chess-truck-camps-desktop.webp",
      alt: "Chess & Truck camps page with a Registration Opening Soon label and a camp details panel",
    },
  ],
  result: [
    "The website is developed and published at chessandtruck.com.",
    "Registration, payments, and the notify-me list stay switched off until Chess & Truck opens its programs. The first camp has not happened yet, so there are no sign-up or sales numbers to report.",
  ],
  pricingNote:
    "A project like this is custom work. Payments, databases, and email automation are quoted after we talk about what you need. They are not part of a fixed package.",
};

export const demos = [
  {
    id: "salon",
    label: "Demo concept",
    business: "Beauty salon",
    title: "Simple Everyday Salon",
    problem: "Puts prices, hours, and a booking button on the first screen, so clients don't have to call to ask.",
    features: ["Service menu with prices", "Hours and location up front", "Booking and call buttons"],
    demoUrl: "https://simple-everyday-salon.vercel.app/",
    desktop: "/work/salon-desktop.webp",
    mobile: "/work/salon-mobile.webp",
    alt: "Homepage of the Simple Everyday Salon demo website",
    formContext: "Salon website (like the salon demo)",
  },
  {
    id: "barber",
    label: "Demo concept",
    business: "Barbershop",
    title: "Neighborhood barbershop",
    problem: "Shows the storefront, services, and daily hours, so walk-in customers know what to expect.",
    features: ["Storefront photo gallery", "Services list", "Call and directions buttons", "English and Spanish versions"],
    demoUrl: "https://mq-barber-shop.vercel.app/",
    desktop: "/work/barber-desktop.webp",
    mobile: "/work/barber-mobile.webp",
    alt: "Homepage of the barbershop demo website with storefront photos",
    formContext: "Barbershop website (like the barbershop demo)",
  },
  {
    id: "spa",
    label: "Demo concept",
    business: "Spa and wellness",
    title: "Luxury spa",
    problem: "Gives a calm, premium first impression and a short path to directions or an inquiry.",
    features: ["Service highlights", "Space and story sections", "Visit and inquiry buttons"],
    demoUrl: "https://luxury-spa-demo.vercel.app/",
    desktop: "/work/spa-desktop.webp",
    mobile: "/work/spa-mobile.webp",
    alt: "Homepage of the luxury spa demo website",
    formContext: "Spa or wellness website (like the spa demo)",
  },
];

export const packages = [
  {
    label: "Starter",
    price: "$198",
    fit: "You need one clear page that explains what you do and how to reach you.",
    pages: "1 page",
    included: ["Mobile-friendly design", "Contact form", "Your logo, text, and photos"],
    timing: "Usually ready for review in 3-5 business days once I have your content.",
  },
  {
    label: "Business",
    price: "$298",
    fit: "You want separate pages for services, about, and contact.",
    pages: "Up to 5 pages",
    included: ["Custom design", "Contact or lead form", "Basic SEO setup", "Domain connection", "Mobile-friendly design"],
    timing: "I'll give you a date once I see your pages and content.",
    recommended: true,
  },
  {
    label: "Premium",
    price: "$498",
    fit: "You have more to show, like a full service menu, a catalog, or a booking app.",
    pages: "Up to 10 pages",
    included: [
      "Advanced custom design",
      "Booking: link or embed the booking service you already use",
      "Or a catalog or menu page (no online checkout)",
      "Basic analytics setup",
      "Basic SEO setup",
      "Priority support",
    ],
    timing: "I'll give you a date once I see your pages and content.",
  },
];

export const quotedSeparately = [
  "Your own booking or registration system",
  "Online payments and checkout",
  "Customer accounts, databases, and email automation",
  "Other third-party integrations",
  "Domain and hosting fees, paid to the provider",
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
    included: ["Small content updates", "Text and image changes", "Basic technical monitoring", "Monthly website check"],
  },
  {
    label: "Growth Care",
    price: "$138",
    period: "/month",
    included: [
      "Everything in Basic Care",
      "Regular content updates",
      "New sections when needed",
      "Basic SEO and content help",
      "Priority support",
    ],
  },
];

export const steps = [
  {
    title: "Tell me about your business",
    text: "Fill out the short form or send a message. A few sentences are enough to start.",
  },
  {
    title: "Get a clear quote",
    text: "I suggest a package and confirm the price, what's included, and the timeline in writing.",
  },
  {
    title: "Review a live preview",
    text: "I design and build the site. You check it on your own phone and send edits by message.",
  },
  {
    title: "Launch",
    text: "We publish the site. Care plans are there if you want help afterward, but they're optional.",
  },
];

export const faqs = [
  {
    question: "How much does a website cost?",
    answer:
      "Starter is $198, Business is $298, and Premium is $498. These are one-time prices for the scope listed in each package. Custom features like payments or your own booking system are quoted separately.",
  },
  {
    question: "Do I have to pay monthly?",
    answer:
      "No. Care plans ($78/month or $138/month) are optional. You can buy a website without one and ask for updates later.",
  },
  {
    question: "How long does it take?",
    answer:
      "A Starter site is usually ready for review in 3-5 business days once I have your content. Bigger sites take longer, and I'll give you a date before we start.",
  },
  {
    question: "Do we need to get on a call?",
    answer: "No. The whole project can happen by message or email. If you'd like a call, just ask.",
  },
  {
    question: "Can you add online booking?",
    answer:
      "Premium can link to or embed the booking service you already use, like Booksy or Square. A custom booking system of your own is quoted separately.",
  },
  {
    question: "Do I need hosting and a domain?",
    answer:
      "Yes. A website needs a domain and hosting to stay online. If you already have them, I can connect everything. If not, I'll help you choose a setup. Those fees go to the provider.",
  },
  {
    question: "Are the salon, barbershop, and spa sites real clients?",
    answer:
      "No. They are demo concepts that show what I can build for those businesses. Chess & Truck is a real client project.",
  },
];
