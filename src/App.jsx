import { useEffect, useRef, useState } from "react";
import {
  bookingLevels,
  carePlans,
  caseStudy,
  contact,
  demos,
  faqs,
  featuredProject,
  packages,
  quotedSeparately,
  startingPrice,
  steps,
} from "./siteContent";

const CASE_PATH = featuredProject.caseUrl;

const pageMeta = {
  home: {
    title: "Websites for NYC Small Businesses from $198 | Site by Amin",
    description:
      "Clear, mobile-friendly websites for NYC salons, barbershops, cafes, local services, and education programs. One-time packages from $198. Optional care from $78/month. No calls needed.",
    canonical: "https://sitebyamin.com/",
  },
  case: {
    title: "Chess & Truck Case Study | Site by Amin",
    description:
      "How Amin designed and built the Chess & Truck website for kids' chess programs in NYC: pages, forms, Stripe checkout, email, launch controls, SEO, and deployment.",
    canonical: "https://sitebyamin.com/work/chess-and-truck",
  },
};

const normalizePath = (path) => (path.length > 1 ? path.replace(/\/+$/, "") : path);

function setMeta(route) {
  const meta = pageMeta[route];
  document.title = meta.title;
  document.querySelector('meta[name="description"]')?.setAttribute("content", meta.description);
  document.querySelector('link[rel="canonical"]')?.setAttribute("href", meta.canonical);
  document.querySelector('meta[property="og:url"]')?.setAttribute("content", meta.canonical);
  document.querySelector('meta[property="og:title"]')?.setAttribute("content", meta.title);
  document.querySelector('meta[property="og:description"]')?.setAttribute("content", meta.description);
}

// Fades sections in as they scroll into view. Content stays visible when
// JavaScript, IntersectionObserver, or motion is unavailable.
function useReveal(routeKey) {
  useEffect(() => {
    const items = [...document.querySelectorAll(".reveal")];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-in"));
      return undefined;
    }

    document.documentElement.classList.add("can-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [routeKey]);
}

function ArrowIcon({ external = false }) {
  return (
    <svg className="icon" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
      {external ? (
        <path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

function ExternalLink({ href, className = "", children }) {
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

function SectionIndex({ number, label }) {
  return (
    <p className="section-index">
      <span>({number})</span> {label}
    </p>
  );
}

function DeviceShots({ desktop, mobile, alt, priority = false, className = "" }) {
  const loading = priority ? "eager" : "lazy";

  return (
    <div className={`device-shots ${className}`.trim()}>
      <div className="browser-frame">
        <div className="browser-bar" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <img
          src={desktop}
          alt={alt}
          width="1440"
          height="900"
          loading={loading}
          decoding="async"
          fetchPriority={priority ? "high" : undefined}
        />
      </div>
      {mobile ? (
        <div className="phone-frame">
          <img src={mobile} alt="" width="780" height="1688" loading={loading} decoding="async" />
        </div>
      ) : null}
    </div>
  );
}

function Header({ onHome, menuOpen, setMenuOpen }) {
  const base = onHome ? "" : "/";
  const links = [
    ["Work", `${base}#work`],
    ["Pricing", `${base}#pricing`],
    ["Process", `${base}#process`],
    ["About", `${base}#about`],
    ["FAQ", `${base}#faq`],
  ];

  return (
    <header className="site-header">
      <div className="container header-row">
        <a className="brand" href={onHome ? "#top" : "/"}>
          Site by <em>Amin</em>
        </a>

        <nav className="site-nav" aria-label="Primary">
          {links.map(([label, href]) => (
            <a key={label} href={href}>
              {label}
            </a>
          ))}
        </nav>

        <a className="btn btn-primary btn-small header-cta" href={`${base}#contact`}>
          Start a project
        </a>

        <button
          type="button"
          className={`menu-toggle ${menuOpen ? "is-open" : ""}`}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>

      <nav id="mobile-menu" className={`mobile-menu ${menuOpen ? "is-open" : ""}`} aria-label="Mobile" hidden={!menuOpen}>
        {links.map(([label, href]) => (
          <a key={label} href={href} onClick={() => setMenuOpen(false)}>
            {label}
          </a>
        ))}
        <a className="btn btn-primary" href={`${base}#contact`} onClick={() => setMenuOpen(false)}>
          Start a project
        </a>
      </nav>
    </header>
  );
}

function Footer({ onHome }) {
  const base = onHome ? "" : "/";
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <a className="brand" href="/">
            Site by <em>Amin</em>
          </a>
          <p>Websites for small businesses in New York City.</p>
        </div>
        <nav aria-label="Footer">
          <a href={`${base}#work`}>Work</a>
          <a href={CASE_PATH}>Chess & Truck case study</a>
          <a href={`${base}#pricing`}>Pricing</a>
          <a href={`${base}#contact`}>Contact</a>
        </nav>
        <div className="footer-contact">
          <ExternalLink href={contact.whatsappLink}>WhatsApp {contact.phoneLabel}</ExternalLink>
          <ExternalLink href={contact.instagramLink}>Instagram {contact.instagramHandle}</ExternalLink>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </div>
      </div>
      <div className="container footer-meta">&copy; {year} Site by Amin. New York, NY.</div>
    </footer>
  );
}

function ContactSection({ interest, setInterest }) {
  const [form, setForm] = useState({ businessName: "", email: "", need: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const fieldRefs = { businessName: useRef(null), email: useRef(null), need: useRef(null) };

  const validate = (values) => {
    const next = {};
    if (!values.businessName.trim()) next.businessName = "Add your business name.";
    if (!values.email.trim()) next.email = "Add an email so I can reply.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) next.email = "This email doesn't look right.";
    if (!values.need.trim()) next.need = "Tell me a little about what you need.";
    return next;
  };

  const update = ({ target }) => {
    setForm((current) => ({ ...current, [target.name]: target.value }));
    if (errors[target.name]) setErrors((current) => ({ ...current, [target.name]: undefined }));
    if (status.state === "error") setStatus({ state: "idle", message: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status.state === "loading") return;

    const nextErrors = validate(form);
    setErrors(nextErrors);
    const firstInvalid = Object.keys(fieldRefs).find((key) => nextErrors[key]);
    if (firstInvalid) {
      fieldRefs[firstInvalid].current?.focus();
      return;
    }

    setStatus({ state: "loading", message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: form.businessName,
          email: form.email,
          notes: form.need,
          preferredPackage: interest,
          websiteType: interest || "Not specified",
        }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || "Your message didn't go through. Please try again, or email or WhatsApp me instead.");
      }

      setStatus({
        state: "success",
        message: payload.message || "Thanks, your request is in. I'll reply by email after I read it.",
      });
      setForm({ businessName: "", email: "", need: "" });
      setInterest("");
    } catch (error) {
      setStatus({
        state: "error",
        message:
          error instanceof TypeError || !(error instanceof Error)
            ? "Your message didn't go through. Please check your connection and try again, or email or WhatsApp me instead."
            : error.message,
      });
    }
  };

  const fieldProps = (name) => ({
    id: `field-${name}`,
    name,
    ref: fieldRefs[name],
    value: form[name],
    onChange: update,
    "aria-invalid": errors[name] ? "true" : undefined,
    "aria-describedby": errors[name] ? `error-${name}` : undefined,
  });

  return (
    <section className="section contact-section" id="contact" aria-labelledby="contact-title">
      <div className="container contact-grid">
        <div className="contact-intro reveal">
          <SectionIndex number="07" label="Contact" />
          <h2 id="contact-title" className="display-lg">
            Tell me about <em>your business.</em>
          </h2>
          <p className="lede">
            Three quick fields. I'll read it and reply by email with a suggested package, the price, and next
            steps. No call needed.
          </p>

          <div className="direct-links">
            <p className="label">Prefer to message?</p>
            <ExternalLink href={contact.whatsappLink} className="direct-link">
              <span>WhatsApp</span>
              <strong>{contact.phoneLabel}</strong>
            </ExternalLink>
            <ExternalLink href={contact.instagramLink} className="direct-link">
              <span>Instagram</span>
              <strong>{contact.instagramHandle}</strong>
            </ExternalLink>
            <a href={`mailto:${contact.email}`} className="direct-link">
              <span>Email</span>
              <strong>{contact.email}</strong>
            </a>
          </div>
        </div>

        {status.state === "success" ? (
          <div className="form-panel form-success reveal" role="status" tabIndex={-1} ref={(node) => node?.focus()}>
            <p className="label">Request sent</p>
            <h3>Thank you.</h3>
            <p>{status.message}</p>
            <button type="button" className="btn btn-ghost" onClick={() => setStatus({ state: "idle", message: "" })}>
              Send another request
            </button>
          </div>
        ) : (
          <form className="form-panel reveal" onSubmit={handleSubmit} noValidate aria-busy={status.state === "loading"}>
            {interest ? (
              <div className="interest-chip">
                <span>
                  <span className="label">Attached to your request</span>
                  <strong>{interest}</strong>
                </span>
                <button type="button" onClick={() => setInterest("")} aria-label={`Remove ${interest} from request`}>
                  Remove
                </button>
              </div>
            ) : null}

            <div className="field">
              <label htmlFor="field-businessName">Business name</label>
              <input {...fieldProps("businessName")} autoComplete="organization" placeholder="e.g. Maple Street Barbers" />
              {errors.businessName ? (
                <p className="field-error" id="error-businessName">
                  {errors.businessName}
                </p>
              ) : null}
            </div>

            <div className="field">
              <label htmlFor="field-email">Email</label>
              <input {...fieldProps("email")} type="email" autoComplete="email" inputMode="email" placeholder="you@example.com" />
              {errors.email ? (
                <p className="field-error" id="error-email">
                  {errors.email}
                </p>
              ) : null}
            </div>

            <div className="field">
              <label htmlFor="field-need">What do you need?</label>
              <textarea
                {...fieldProps("need")}
                rows="5"
                placeholder="What your business does, what the site should help with, and any site you like."
              />
              {errors.need ? (
                <p className="field-error" id="error-need">
                  {errors.need}
                </p>
              ) : null}
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={status.state === "loading"}>
              {status.state === "loading" ? "Sending..." : "Send my request"}
              {status.state === "loading" ? null : <ArrowIcon />}
            </button>

            <p className={`form-status ${status.state === "error" ? "is-error" : ""}`} role={status.state === "error" ? "alert" : "status"} aria-live="polite">
              {status.state === "loading" ? "Sending your request..." : status.message}
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

function HomePage({ interest, setInterest }) {
  const heroActionsRef = useRef(null);
  const [showBar, setShowBar] = useState(false);

  const requestSimilar = (label) => {
    setInterest(label);
    const section = document.getElementById("contact");
    section?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    window.setTimeout(() => document.getElementById("field-businessName")?.focus({ preventScroll: true }), 450);
  };

  useEffect(() => {
    const hero = heroActionsRef.current;
    const contactSection = document.getElementById("contact");
    if (!hero || !contactSection || !("IntersectionObserver" in window)) return undefined;

    let heroVisible = true;
    let contactVisible = false;
    const sync = () => setShowBar(!heroVisible && !contactVisible);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === hero) heroVisible = entry.isIntersecting;
        if (entry.target === contactSection) contactVisible = entry.isIntersecting;
      });
      sync();
    });
    observer.observe(hero);
    observer.observe(contactSection);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="container">
          <div className="hero-meta" aria-hidden="true">
            <span>Site by Amin</span>
            <span>Web design &amp; development</span>
            <span>New York City</span>
          </div>

          <div className="hero-grid">
            <div className="hero-copy">
              <h1 id="hero-title" className="display-xl">
                Websites that make your <em>small business</em> easy to choose.
              </h1>
              <p className="lede hero-lede">
                I'm Amin, a web designer in New York. I build clear, mobile-friendly sites for salons,
                barbershops, cafes, local services, and education programs, so customers can see what you
                offer and reach you in a tap.
              </p>
              <div className="hero-actions" ref={heroActionsRef}>
                <a className="btn btn-primary" href="#contact">
                  Tell me about your business <ArrowIcon />
                </a>
                <a className="btn btn-ghost" href="#work">
                  See my work
                </a>
              </div>
              <dl className="hero-facts">
                <div>
                  <dt>Websites from</dt>
                  <dd>{startingPrice} one-time</dd>
                </div>
                <div>
                  <dt>Process</dt>
                  <dd>All by message, no calls</dd>
                </div>
                <div>
                  <dt>Care after launch</dt>
                  <dd>Optional</dd>
                </div>
              </dl>
            </div>

            <figure className="hero-visual">
              <DeviceShots
                desktop={featuredProject.images.desktop}
                mobile={featuredProject.images.mobile}
                alt="Chess & Truck homepage on desktop and phone, a website built by Amin"
                priority
              />
              <figcaption>
                <span className="label">Featured project</span>
                <a href={CASE_PATH}>
                  Chess &amp; Truck, kids' chess programs in NYC <ArrowIcon />
                </a>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="section featured" id="work" aria-labelledby="featured-title">
        <div className="container">
          <div className="section-head reveal">
            <SectionIndex number="01" label="Featured project" />
            <p className="status-pill">
              <span aria-hidden="true" /> Real client project
            </p>
          </div>

          <div className="featured-grid">
            <div className="featured-copy reveal">
              <h2 id="featured-title" className="display-lg">
                Chess &amp; <em>Truck</em>
              </h2>
              <p className="lede">{featuredProject.summary}</p>
              <dl className="spec-table">
                {featuredProject.facts.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <ul className="check-list">
                {featuredProject.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="button-row">
                <a className="btn btn-primary" href={CASE_PATH}>
                  Read the case study <ArrowIcon />
                </a>
                <ExternalLink href={featuredProject.url} className="btn btn-ghost">
                  Visit the live site <ArrowIcon external />
                </ExternalLink>
              </div>
            </div>

            <div className="featured-media reveal">
              <DeviceShots
                desktop={featuredProject.images.programsDesktop}
                mobile={featuredProject.images.programsMobile}
                alt="Chess & Truck programs section showing four programs, each marked Registration Opening Soon"
              />
              <p className="media-note">{featuredProject.status}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section work" aria-labelledby="work-title">
        <div className="container">
          <div className="section-head reveal">
            <SectionIndex number="02" label="More examples" />
          </div>
          <div className="split-head reveal">
            <h2 id="work-title" className="display-md">
              Demo sites for <em>local businesses.</em>
            </h2>
            <p>
              These are concepts I designed and built to show what a site for your type of business could look
              like. They are not client projects. Click through, they're live.
            </p>
          </div>

          <ol className="work-list">
            {demos.map((demo, index) => (
              <li className="work-item reveal" key={demo.id}>
                <ExternalLink href={demo.demoUrl} className="work-media">
                  <DeviceShots desktop={demo.desktop} mobile={demo.mobile} alt={demo.alt} />
                </ExternalLink>
                <div className="work-copy">
                  <p className="work-kicker">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span className="tag">{demo.label}</span>
                    <span>{demo.business}</span>
                  </p>
                  <h3>{demo.title}</h3>
                  <p>{demo.problem}</p>
                  <ul className="inline-list">
                    {demo.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                  <div className="button-row">
                    <ExternalLink href={demo.demoUrl} className="btn btn-ghost btn-small">
                      View demo <ArrowIcon external />
                    </ExternalLink>
                    <button type="button" className="btn btn-link" onClick={() => requestSimilar(demo.formContext)}>
                      I want a site like this <ArrowIcon />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section pricing" id="pricing" aria-labelledby="pricing-title">
        <div className="container">
          <div className="section-head reveal">
            <SectionIndex number="03" label="Pricing" />
          </div>
          <div className="split-head reveal">
            <h2 id="pricing-title" className="display-md">
              One-time prices. <em>No surprises.</em>
            </h2>
            <p>
              Pick the size that fits today. Every site is designed around your business, works on phones, and
              comes with a written quote before any work starts.
            </p>
          </div>

          <div className="price-table reveal">
            {packages.map((pkg) => (
              <article className={`price-col ${pkg.recommended ? "is-recommended" : ""}`} key={pkg.label} aria-labelledby={`pkg-${pkg.label}`}>
                <div className="price-top">
                  <h3 id={`pkg-${pkg.label}`}>{pkg.label}</h3>
                  {pkg.recommended ? <span className="tag tag-gold">Fits most shops</span> : null}
                </div>
                <p className="price">
                  {pkg.price}
                  <span> one-time</span>
                </p>
                <p className="price-fit">{pkg.fit}</p>
                <p className="price-pages">{pkg.pages}</p>
                <ul className="check-list">
                  {pkg.included.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="price-timing">{pkg.timing}</p>
                <button
                  type="button"
                  className={`btn ${pkg.recommended ? "btn-primary" : "btn-outline"} btn-block`}
                  onClick={() => requestSimilar(`${pkg.label} package (${pkg.price})`)}
                >
                  Ask about {pkg.label}
                </button>
              </article>
            ))}
          </div>

          <div className="pricing-extras">
            <div className="extras-block reveal">
              <h3>Booking, three ways</h3>
              <ul className="booking-levels">
                {bookingLevels.map((level) => (
                  <li key={level.name}>
                    <div>
                      <strong>{level.name}</strong>
                      <span>{level.text}</span>
                    </div>
                    <em>{level.where}</em>
                  </li>
                ))}
              </ul>
            </div>
            <div className="extras-block reveal">
              <h3>Quoted separately</h3>
              <p>Not part of any fixed package. I price these after we talk.</p>
              <ul className="dash-list">
                {quotedSeparately.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="care reveal" aria-labelledby="care-title">
            <div className="care-intro">
              <p className="label">Add-on</p>
              <h3 id="care-title">Website care</h3>
              <p>
                Optional. Your site works without it. Choose a plan if you'd rather hand off updates after
                launch.
              </p>
            </div>
            {carePlans.map((plan) => (
              <div className="care-plan" key={plan.label}>
                <h4>{plan.label}</h4>
                <p className="price price-sm">
                  {plan.price}
                  <span>{plan.period}</span>
                </p>
                <ul className="check-list">
                  {plan.included.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <button type="button" className="btn btn-link" onClick={() => requestSimilar(`${plan.label} (${plan.price}${plan.period})`)}>
                  Ask about {plan.label} <ArrowIcon />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section process" id="process" aria-labelledby="process-title">
        <div className="container">
          <div className="section-head reveal">
            <SectionIndex number="04" label="Process" />
          </div>
          <div className="split-head reveal">
            <h2 id="process-title" className="display-md">
              Four steps, <em>all in writing.</em>
            </h2>
            <p>You can answer when it suits you, and every decision stays in one thread.</p>
          </div>
          <ol className="steps">
            {steps.map((step, index) => (
              <li className="reveal" key={step.title}>
                <span className="step-num">{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section about" id="about" aria-labelledby="about-title">
        <div className="container about-grid">
          <figure className="about-photo reveal">
            <img src="/amin-portrait.jpg" alt="Amin standing in Times Square at night" width="859" height="1280" loading="lazy" decoding="async" />
          </figure>
          <div className="about-copy reveal">
            <SectionIndex number="05" label="About" />
            <h2 id="about-title" className="display-md">
              Hi, I'm Amin. <em>You'll work with me directly.</em>
            </h2>
            <p className="lede">
              I live in New York and build websites for small businesses here. I'm not an agency. The person
              you message is the person who designs your site and writes the code.
            </p>
            <ul className="about-points">
              <li>
                <strong>Straight answers.</strong> You ask a question, I answer it. No account managers in between.
              </li>
              <li>
                <strong>Plain English.</strong> I explain what your site needs and what it doesn't.
              </li>
              <li>
                <strong>Clear scope.</strong> You know the price and what's included before I start.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section faq" id="faq" aria-labelledby="faq-title">
        <div className="container faq-grid">
          <div className="reveal">
            <SectionIndex number="06" label="FAQ" />
            <h2 id="faq-title" className="display-md">
              Questions, <em>answered.</em>
            </h2>
          </div>
          <div className="faq-list reveal">
            {faqs.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <ContactSection interest={interest} setInterest={setInterest} />

      <div className={`mobile-bar ${showBar ? "is-visible" : ""}`} aria-hidden={!showBar}>
        <a className="btn btn-primary btn-block" href="#contact" tabIndex={showBar ? 0 : -1}>
          Start a project, from {startingPrice}
        </a>
      </div>
    </>
  );
}

function CasePage() {
  const p = featuredProject;

  return (
    <article className="case" aria-labelledby="case-title">
      <header className="case-hero">
        <div className="container">
          <a className="back-link" href="/#work">
            <span aria-hidden="true">&larr;</span> All work
          </a>
          <div className="case-hero-grid">
            <div>
              <p className="section-index">
                <span>(Case study)</span> Real client project
              </p>
              <h1 id="case-title" className="display-xl">
                Chess &amp; <em>Truck</em>
              </h1>
              <p className="lede">{p.summary}</p>
            </div>
            <dl className="spec-table">
              {p.facts.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
              <div>
                <dt>Live site</dt>
                <dd>
                  <ExternalLink href={p.url}>chessandtruck.com</ExternalLink>
                </dd>
              </div>
            </dl>
          </div>
          <p className="status-banner">
            <span aria-hidden="true" /> {p.status}
          </p>
          <DeviceShots
            className="case-shots"
            desktop={p.images.desktop}
            mobile={p.images.mobile}
            alt="Chess & Truck homepage on desktop and phone"
            priority
          />
        </div>
      </header>

      <section className="section case-section" aria-labelledby="case-task">
        <div className="container case-row reveal">
          <SectionIndex number="01" label="The task" />
          <div>
            <h2 id="case-task" className="display-sm">
              Explain four programs to busy parents, and be ready for launch day.
            </h2>
            {caseStudy.task.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section case-section" aria-labelledby="case-role">
        <div className="container case-row reveal">
          <SectionIndex number="02" label="My role" />
          <div>
            <h2 id="case-role" className="display-sm">
              Design, development, integrations, testing, and deployment.
            </h2>
            {caseStudy.role.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section case-section" aria-labelledby="case-work">
        <div className="container case-row reveal">
          <SectionIndex number="03" label="What I built" />
          <div>
            <h2 id="case-work" className="display-sm">
              The work behind the pages.
            </h2>
            <div className="work-groups">
              {caseStudy.work.map((group) => (
                <div key={group.title}>
                  <h3>{group.title}</h3>
                  <ul className="dash-list">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section case-section" aria-labelledby="case-features">
        <div className="container">
          <div className="case-row reveal">
            <SectionIndex number="04" label="Key features" />
            <h2 id="case-features" className="display-sm">
              What parents see.
            </h2>
          </div>
          <div className="feature-list">
            {caseStudy.features.map((feature) => (
              <figure className="feature reveal" key={feature.title}>
                <DeviceShots desktop={feature.image} alt={feature.alt} />
                <figcaption>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </figcaption>
              </figure>
            ))}
            <figure className="feature feature-mobile reveal">
              <div className="phone-pair">
                <div className="phone-frame">
                  <img src={p.images.mobile} alt="Chess & Truck homepage on a phone" width="780" height="1688" loading="lazy" decoding="async" />
                </div>
                <div className="phone-frame">
                  <img src={p.images.programsMobile} alt="Chess & Truck program cards on a phone" width="780" height="1688" loading="lazy" decoding="async" />
                </div>
              </div>
              <figcaption>
                <h3>Built for phones first</h3>
                <p>Most parents check on a phone. Text, buttons, and the menu are sized for one-handed use.</p>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="section case-section" aria-labelledby="case-result">
        <div className="container case-row reveal">
          <SectionIndex number="05" label="Where it stands" />
          <div>
            <h2 id="case-result" className="display-sm">
              {p.status}
            </h2>
            {caseStudy.result.map((text) => (
              <p key={text}>{text}</p>
            ))}
            <p className="note">{caseStudy.pricingNote}</p>
          </div>
        </div>
      </section>

      <section className="section case-cta" aria-labelledby="case-cta-title">
        <div className="container reveal">
          <h2 id="case-cta-title" className="display-lg">
            Need something <em>like this?</em>
          </h2>
          <p className="lede">Tell me what your business needs. I'll reply with what it would take and a written quote.</p>
          <div className="button-row">
            <a className="btn btn-primary" href={`/?interest=${encodeURIComponent(p.id)}#contact`}>
              Tell me about your project <ArrowIcon />
            </a>
            <a className="btn btn-ghost" href="/#pricing">
              See package prices
            </a>
          </div>
        </div>
      </section>
    </article>
  );
}

function App() {
  const path = normalizePath(window.location.pathname);
  const route = path === CASE_PATH ? "case" : "home";
  const [menuOpen, setMenuOpen] = useState(false);
  const [interest, setInterest] = useState(() => {
    const value = new URLSearchParams(window.location.search).get("interest");
    return value === featuredProject.id ? featuredProject.formContext : "";
  });

  useReveal(route);

  useEffect(() => {
    setMeta(route);
  }, [route]);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => {
    // Drop the ?interest= param once it has been read, keeping the hash.
    if (window.location.search) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.hash}`);
    }
    if (window.location.hash) {
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView();
    }
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header onHome={route === "home"} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main id="main-content">
        {route === "case" ? <CasePage /> : <HomePage interest={interest} setInterest={setInterest} />}
      </main>
      <Footer onHome={route === "home"} />
    </>
  );
}

export default App;
