import { useCallback, useEffect, useRef, useState } from "react";
import {
  bookingLevels,
  carePlans,
  careTerms,
  caseStudy,
  contact,
  demos,
  faqs,
  featuredProject,
  moreFaqs,
  packageBase,
  packages,
  paymentMethods,
  quotedSeparately,
  quotedSeparatelyNote,
  startingPrice,
  steps,
} from "./siteContent";
import { routeForPath, routes } from "./seo";

const CASE_PATH = featuredProject.caseUrl;
const emptySelection = { package: "", care: "", project: "" };
const selectionLabels = { package: "Package", care: "Care plan", project: "Example you liked" };

// Runtime safety net for client-side changes. The prerendered HTML already has these.
function setMeta(route) {
  const meta = routes[route];
  document.title = meta.title;
  document.querySelector('meta[name="description"]')?.setAttribute("content", meta.description);
  document.querySelector('link[rel="canonical"]')?.setAttribute("href", meta.canonical);
}

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Scrolls so the top of the form sits just under the sticky header, then moves
// focus to the form itself (not an input) so phones don't open the keyboard.
function goToForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const header = document.querySelector(".site-header");
  const offset = (header ? header.getBoundingClientRect().height : 0) + 12;
  const top = form.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(top, 0), behavior: prefersReducedMotion() ? "auto" : "smooth" });
  form.focus({ preventScroll: true });
  if (window.location.hash !== "#contact") window.history.replaceState(null, "", "#contact");
}

// Fades sections in as they scroll into view. Anything already on screen, and
// everything when JS or motion is unavailable, stays visible.
function useReveal(routeKey) {
  useEffect(() => {
    const items = [...document.querySelectorAll(".reveal")];

    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-in"));
      return undefined;
    }

    items.forEach((item) => {
      if (item.getBoundingClientRect().top < window.innerHeight) item.classList.add("is-in");
    });
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

    items.filter((item) => !item.classList.contains("is-in")).forEach((item) => observer.observe(item));
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

function DeviceShots({ desktop, mobile, alt, title, priority = false, className = "", onZoom }) {
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
      {onZoom ? (
        <button
          type="button"
          className="zoom-button"
          onClick={() =>
            onZoom({
              title,
              images: [
                { label: "Desktop", src: desktop, alt },
                ...(mobile ? [{ label: "Phone", src: mobile, alt: `${title} on a phone` }] : []),
              ],
            })
          }
        >
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
            <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="m10.5 10.5 3 3M5 7h4M7 5v4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          View larger<span className="sr-only">: {title} screenshots</span>
        </button>
      ) : null}
    </div>
  );
}

// Accessible screenshot viewer built on <dialog>: Esc and the Close button
// close it, focus stays inside while open and returns to the trigger after.
function LightboxContent({ data, onClose }) {
  // On phones, open on the phone screenshot when there is one.
  const [index, setIndex] = useState(() => (data.images.length > 1 && window.innerWidth < 600 ? 1 : 0));
  const [zoomed, setZoomed] = useState(false);
  const image = data.images[index];

  return (
    <div className="lightbox-inner">
      <div className="lightbox-bar">
        <h2 id="lightbox-title">{data.title}</h2>
        <div className="lightbox-controls">
          {data.images.length > 1 ? (
            <div className="segmented" role="group" aria-label="Screenshot size">
              {data.images.map((item, i) => (
                <button
                  type="button"
                  key={item.label}
                  aria-pressed={i === index}
                  onClick={() => {
                    setIndex(i);
                    setZoomed(false);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ) : null}
          <button type="button" className="lightbox-btn" aria-pressed={zoomed} onClick={() => setZoomed((z) => !z)}>
            {zoomed ? "Fit to screen" : "Zoom in"}
          </button>
          <button type="button" className="lightbox-btn" onClick={onClose} autoFocus>
            Close
          </button>
        </div>
      </div>
      <div className={`lightbox-stage ${zoomed ? "is-zoomed" : ""} ${image.label === "Phone" ? "is-phone" : ""}`}>
        <img src={image.src} alt={image.alt} />
      </div>
    </div>
  );
}

function Lightbox({ data, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (data && dialog && !dialog.open) dialog.showModal();
    if (!data && dialog?.open) dialog.close();
  }, [data]);

  return (
    <dialog
      ref={dialogRef}
      className="lightbox"
      aria-labelledby="lightbox-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      {data ? <LightboxContent key={data.title} data={data} onClose={onClose} /> : null}
    </dialog>
  );
}

function CopyButton({ value, label }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button type="button" className="copy-button" onClick={copy}>
      {copied ? "Copied" : "Copy"}
      <span className="sr-only"> {label}</span>
      <span className="sr-only" aria-live="polite">
        {copied ? `${label} copied` : ""}
      </span>
    </button>
  );
}

function PaymentBlock() {
  return (
    <div className="payment reveal" aria-labelledby="payment-title">
      <div className="payment-intro">
        <p className="label">How to pay</p>
        <h3 id="payment-title">PayPal or Zelle</h3>
        <p>For the 50% deposit, after the free demo and an agreed quote.</p>
      </div>
      <ul className="payment-list">
        {paymentMethods.map((method) => (
          <li key={method.name}>
            <div>
              <span className="payment-name">{method.name}</span>
              <strong>{method.value}</strong>
              <span className="payment-note">{method.note}</span>
            </div>
            <CopyButton value={method.value} label={`${method.name} ${method.value}`} />
          </li>
        ))}
      </ul>
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

function ContactSection({ selection, setSelection }) {
  const [form, setForm] = useState({ businessName: "", email: "", need: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const businessRef = useRef(null);
  const emailRef = useRef(null);
  const needRef = useRef(null);
  const successRef = useRef(null);
  const fieldRefs = { businessName: businessRef, email: emailRef, need: needRef };
  const chosen = Object.entries(selection).filter(([, value]) => value);

  useEffect(() => {
    if (status.state === "success") successRef.current?.focus();
  }, [status.state]);

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
          preferredPackage: selection.package,
          carePlan: selection.care,
          exampleProject: selection.project,
          websiteType: chosen.map(([, value]) => value).join(" + ") || "Not specified",
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
      setSelection(emptySelection);
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
          <p className="lede">Three short fields. I'll reply by email with a package and price.</p>
        </div>

        {/* No "reveal" on these two panels: they swap after load, when useReveal
            is no longer watching, so a new one would stay at opacity 0. */}
        {status.state === "success" ? (
          <div id="contact-form" className="form-panel form-success" role="status" tabIndex={-1} ref={successRef}>
            <p className="label">Request sent</p>
            <h3>Thank you.</h3>
            <p>{status.message}</p>
            <button type="button" className="btn btn-ghost" onClick={() => setStatus({ state: "idle", message: "" })}>
              Send another request
            </button>
          </div>
        ) : (
          <form
            id="contact-form"
            className="form-panel"
            onSubmit={handleSubmit}
            noValidate
            tabIndex={-1}
            aria-labelledby="contact-title"
            aria-busy={status.state === "loading"}
          >
            {chosen.length ? (
              <div className="selection">
                <p className="label">Attached to your request</p>
                <ul>
                  {chosen.map(([key, value]) => (
                    <li key={key}>
                      <span>
                        <small>{selectionLabels[key]}</small>
                        {value}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelection((current) => ({ ...current, [key]: "" }))}
                        aria-label={`Remove ${value} from request`}
                      >
                        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
                          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
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
                rows="4"
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

        <div className="direct-links reveal">
          <p className="label">Prefer to message? No call needed.</p>
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
    </section>
  );
}

function HomePage({ selection, setSelection, onZoom }) {
  const heroActionsRef = useRef(null);
  const [showBar, setShowBar] = useState(false);

  const choose = (key, value) => {
    setSelection((current) => ({ ...current, [key]: value }));
    // Wait for the chip to render so the scroll lands on the final layout.
    window.requestAnimationFrame(() => window.requestAnimationFrame(goToForm));
  };

  useEffect(() => {
    const hero = heroActionsRef.current;
    const contactSection = document.getElementById("contact");
    if (!hero || !contactSection || !("IntersectionObserver" in window)) return undefined;

    let heroVisible = true;
    let contactVisible = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === hero) heroVisible = entry.isIntersecting;
        if (entry.target === contactSection) contactVisible = entry.isIntersecting;
      });
      setShowBar(!heroVisible && !contactVisible);
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
                Clear websites for NYC <em>small businesses.</em>
              </h1>
              <p className="lede hero-lede">
                I'm Amin. I design and build sites for salons, barbershops, cafes, and local services, all by message.
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
                title="Chess & Truck homepage"
                priority
                onZoom={onZoom}
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

          <div className="project-row">
            <div className="project-media reveal">
              <DeviceShots
                desktop={featuredProject.images.programsDesktop}
                mobile={featuredProject.images.programsMobile}
                alt="Chess & Truck programs section showing four programs, each marked Registration Opening Soon"
                title="Chess & Truck programs"
                onZoom={onZoom}
              />
            </div>
            <div className="project-copy reveal">
              <h2 id="featured-title" className="display-lg">
                Chess &amp; <em>Truck</em>
              </h2>
              <p className="lede">{featuredProject.summary} I designed and built it.</p>
              <ol className="benefits">
                {featuredProject.benefits.map((benefit, i) => (
                  <li key={benefit}>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <strong>{benefit}</strong>
                  </li>
                ))}
              </ol>
              <p className="status-line">
                <span aria-hidden="true" /> {featuredProject.status}
              </p>
              <div className="button-row">
                <a className="btn btn-primary" href={CASE_PATH}>
                  Read the case study <ArrowIcon />
                </a>
                <ExternalLink href={featuredProject.url} className="btn btn-ghost">
                  Visit the live site <ArrowIcon external />
                </ExternalLink>
              </div>
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
            <p>Concepts I built to show what your site could look like. Not client projects, but all live.</p>
          </div>

          <ol className="work-list">
            {demos.map((demo, index) => (
              <li className="project-row work-item reveal" key={demo.id}>
                <div className="project-media">
                  <DeviceShots desktop={demo.desktop} mobile={demo.mobile} alt={demo.alt} title={`${demo.title} demo`} onZoom={onZoom} />
                </div>
                <div className="project-copy">
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
                    <button type="button" className="btn btn-link" onClick={() => choose("project", demo.formContext)}>
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
            <p>Pick the size that fits today. Domain and hosting fees are paid separately.</p>
          </div>

          <div className="package-base reveal">
            <p className="label">Every package</p>
            <ul>
              {packageBase.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
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
                {pkg.addsLabel ? <p className="adds-label">{pkg.addsLabel}</p> : null}
                <ul className="check-list">
                  {pkg.adds.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {pkg.notIncluded ? <p className="price-excluded">{pkg.notIncluded}</p> : null}
                <p className="price-timing">{pkg.timing}</p>
                <button
                  type="button"
                  className={`btn ${pkg.recommended ? "btn-primary" : "btn-outline"} btn-block`}
                  aria-pressed={selection.package === `${pkg.label} (${pkg.price})`}
                  onClick={() => choose("package", `${pkg.label} (${pkg.price})`)}
                >
                  {selection.package === `${pkg.label} (${pkg.price})` ? `${pkg.label} selected` : `Ask about ${pkg.label}`}
                </button>
              </article>
            ))}
          </div>

          <div className="care reveal" aria-labelledby="care-title">
            <div className="care-intro">
              <p className="label">Optional add-on</p>
              <h3 id="care-title">Website care</h3>
              <p>Optional. Add a plan to any package if you'd rather hand off updates.</p>
              <p className="care-terms">{careTerms}</p>
            </div>
            {carePlans.map((plan) => {
              const value = `${plan.label} (${plan.price}${plan.period})`;
              return (
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
                  <button type="button" className="btn btn-link" aria-pressed={selection.care === value} onClick={() => choose("care", value)}>
                    {selection.care === value ? `${plan.label} added` : `Add ${plan.label} to my request`} <ArrowIcon />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="extras reveal">
            <p className="extras-note">{quotedSeparatelyNote}</p>
            <details className="extras-details">
              <summary>Booking options and extra costs</summary>
              <div className="pricing-extras">
                <div className="extras-block">
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
                <div className="extras-block">
                  <h3>Quoted separately</h3>
                  <ul className="dash-list">
                    {quotedSeparately.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </details>
          </div>

          <PaymentBlock />
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
            <p>No calls needed. Everything stays in one message thread.</p>
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
              I live in New York and build websites for small businesses here. I'm not an agency: the person you
              message is the one who designs your site and writes the code.
            </p>
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
            <details className="more-faqs">
              <summary>More questions</summary>
              {moreFaqs.map((item) => (
                <div className="more-faq" key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </div>
              ))}
            </details>
          </div>
        </div>
      </section>

      <ContactSection selection={selection} setSelection={setSelection} />

      <div className={`mobile-bar ${showBar ? "is-visible" : ""}`} aria-hidden={!showBar}>
        <a className="btn btn-primary btn-block" href="#contact" tabIndex={showBar ? 0 : -1}>
          Start a project, from {startingPrice}
        </a>
      </div>
    </>
  );
}

function CasePage({ onZoom }) {
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
            title="Chess & Truck homepage"
            priority
            onZoom={onZoom}
          />
        </div>
      </header>

      <section className="section case-section" aria-labelledby="case-task">
        <div className="container case-row reveal">
          <SectionIndex number="01" label="Task and role" />
          <div>
            <h2 id="case-task" className="display-sm">
              Four programs, explained for busy parents.
            </h2>
            <p>{caseStudy.task}</p>
            <p>{caseStudy.role}</p>
          </div>
        </div>
      </section>

      <section className="section case-section" aria-labelledby="case-features">
        <div className="container">
          <div className="case-row reveal">
            <SectionIndex number="02" label="Screens" />
            <h2 id="case-features" className="display-sm">
              What parents see.
            </h2>
          </div>
          <div className="feature-list">
            {caseStudy.features.map((feature) => (
              <figure className="feature reveal" key={feature.title}>
                <DeviceShots desktop={feature.image} alt={feature.alt} title={feature.title} onZoom={onZoom} />
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
                <h3>Built for phones</h3>
                <p>Readable text and a simple menu.</p>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="section case-section" aria-labelledby="case-result">
        <div className="container case-row reveal">
          <SectionIndex number="03" label="Status" />
          <div>
            <h2 id="case-result" className="display-sm">
              Where it stands
            </h2>
            <p>{caseStudy.result}</p>
            <p className="note">{caseStudy.pricingNote}</p>
            <details className="tech-details">
              <summary>Technical details</summary>
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
            </details>
          </div>
        </div>
      </section>

      <section className="section case-cta" aria-labelledby="case-cta-title">
        <div className="container reveal">
          <h2 id="case-cta-title" className="display-lg">
            Need something <em>like this?</em>
          </h2>
          <p className="lede">Tell me what you need, and I'll reply with a quote.</p>
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

function App({ path = "/" }) {
  const route = routeForPath(path);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selection, setSelection] = useState(emptySelection);
  const [lightbox, setLightbox] = useState(null);
  const closeLightbox = useCallback(() => setLightbox(null), []);

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

  // Read ?interest= from the case page link, then land on the form. Runs after
  // the first paint so the prerendered markup hydrates without a mismatch.
  useEffect(() => {
    const interest = new URLSearchParams(window.location.search).get("interest");
    const hash = window.location.hash;
    if (window.location.search) {
      window.history.replaceState(null, "", `${window.location.pathname}${hash}`);
    }
    // Not cancelled on cleanup: in dev StrictMode the second run no longer sees the query.
    window.requestAnimationFrame(() => {
      if (interest === featuredProject.id) {
        setSelection((current) => ({ ...current, project: featuredProject.formContext }));
      }
      if (hash === "#contact") window.requestAnimationFrame(goToForm);
      else if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    });
  }, []);

  // Every in-page link to #contact lands on the start of the form, not the section intro.
  useEffect(() => {
    if (route !== "home") return undefined;
    const onClick = (event) => {
      const link = event.target.closest?.('a[href="#contact"]');
      if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey) return;
      event.preventDefault();
      window.requestAnimationFrame(goToForm);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [route]);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header onHome={route === "home"} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main id="main-content">
        {route === "case" ? (
          <CasePage onZoom={setLightbox} />
        ) : (
          <HomePage selection={selection} setSelection={setSelection} onZoom={setLightbox} />
        )}
      </main>
      <Footer onHome={route === "home"} />
      <Lightbox data={lightbox} onClose={closeLightbox} />
    </>
  );
}

export default App;
