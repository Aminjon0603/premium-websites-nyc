import { useEffect, useMemo, useRef, useState } from "react";
import { demos, faqs, maintenanceItems, packages, steps, testimonials, trustItems } from "./siteContent";

const initialFormState = {
  businessName: "",
  websiteType: "",
  currentWebsite: "",
  socialLink: "",
  services: "",
  preferredPackage: "",
  timeline: "",
  email: "",
  phone: "",
  notes: "",
};

function SectionCta({ text, buttonLabel, href = "#contact", className = "" }) {
  return (
    <div className={`section-cta ${className}`.trim()}>
      <p>{text}</p>
      <a className="btn btn-secondary" href={href}>
        {buttonLabel}
      </a>
    </div>
  );
}

function App() {
  const [formState, setFormState] = useState(initialFormState);
  const [submitState, setSubmitState] = useState({ status: "idle", message: "" });
  const [showMobileBookbar, setShowMobileBookbar] = useState(false);
  const heroActionsRef = useRef(null);
  const year = new Date().getFullYear();
  const whatsappNumber = "13323450632";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;
  const phoneLabel = "+1 332 345 0632";
  const instagramLink = "https://www.instagram.com/sitebyamin/";
  const email = "amin2002abrorov@gmail.com";
  const hasTestimonials = testimonials.length > 0;

  const submitHint = useMemo(() => {
    if (submitState.status === "loading") {
      return "Sending your project details...";
    }

    if (submitState.status === "success" || submitState.status === "error") {
      return submitState.message;
    }

    if (formState.websiteType || formState.preferredPackage) {
      return "Your request goes directly to Site by Amin. Reply comes by email or message.";
    }

    return "Send a few details and I will recommend the best option. Typical reply is within 1 business day.";
  }, [formState.preferredPackage, formState.websiteType, submitState.message, submitState.status]);

  const updateField = ({ target }) => {
    const { name, value } = target;
    setFormState((current) => ({ ...current, [name]: value }));

    if (submitState.status !== "idle") {
      setSubmitState({ status: "idle", message: "" });
    }
  };

  const jumpToContact = (websiteType = "", preferredPackage = "") => {
    setFormState((current) => ({
      ...current,
      websiteType: websiteType || current.websiteType,
      preferredPackage: preferredPackage || current.preferredPackage,
    }));

    if (submitState.status !== "idle") {
      setSubmitState({ status: "idle", message: "" });
    }

    const contactSection = document.getElementById("contact");
    contactSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitState({ status: "loading", message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || "The form could not be sent right now. Please use email or message instead.");
      }

      setSubmitState({
        status: "success",
        message:
          payload.message ||
          "Your request was sent. I will reply by email or message after I review it.",
      });
      setFormState(initialFormState);
    } catch (error) {
      setSubmitState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "The form could not be sent right now. Please use email or message instead.",
      });
    }
  };

  useEffect(() => {
    const heroActions = heroActionsRef.current;

    if (!heroActions) {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(max-width: 760px)");
    let observer;
    let removeFallback = () => {};

    const handleVisibilityMode = () => {
      if (!mediaQuery.matches) {
        setShowMobileBookbar(false);
        return;
      }

      if ("IntersectionObserver" in window) {
        observer?.disconnect();
        observer = new IntersectionObserver(
          ([entry]) => {
            setShowMobileBookbar(!entry.isIntersecting);
          },
          {
            threshold: 0.35,
            rootMargin: "0px 0px -84px 0px",
          }
        );

        observer.observe(heroActions);
        return;
      }

      const fallbackScroll = () => {
        setShowMobileBookbar(window.scrollY > 420);
      };

      fallbackScroll();
      window.addEventListener("scroll", fallbackScroll, { passive: true });
      removeFallback = () => window.removeEventListener("scroll", fallbackScroll);
    };

    handleVisibilityMode();

    const handleMediaChange = () => {
      removeFallback();
      observer?.disconnect();
      handleVisibilityMode();
    };

    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      removeFallback();
      observer?.disconnect();
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="sales-page">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />

        <header className="site-header">
          <div className="container header-row">
            <a className="brand" href="#top" aria-label="Site by Amin home">
              <span className="brand-mark">SA</span>
              <span className="brand-copy">
                <strong>Site by Amin</strong>
                <small>Custom websites for NYC businesses</small>
              </span>
            </a>

            <nav className="site-nav" aria-label="Primary">
              <a href="#demos">Portfolio</a>
              <a href="#pricing">Pricing</a>
              <a href="#faq">FAQ</a>
              <a href="#contact">Contact</a>
              <a className="nav-phone" href={whatsappLink} target="_blank" rel="noreferrer">
                {phoneLabel}
              </a>
            </nav>

            <a className="btn btn-primary btn-header" href="#contact">
              Start Your Project
            </a>
          </div>
        </header>

        <main id="main-content">
          <section className="hero-section" id="top" aria-labelledby="hero-title">
            <div className="container hero-layout">
              <div className="hero-copy">
                <span className="eyebrow">Site by Amin</span>
                <h1 id="hero-title">Websites That Help Local Businesses Get More Customers</h1>
                <p className="hero-text">
                  Custom websites for local businesses that need more calls and bookings — live in
                  3-5 days.
                </p>

                <div className="hero-actions" ref={heroActionsRef}>
                  <a className="btn btn-primary" href="#contact">
                    Start Your Project
                  </a>
                  <a className="btn btn-secondary" href="#demos">
                    View Live Demos
                  </a>
                </div>

                <p className="hero-microcopy">
                  Reply within 1 business day. Message-first. No phone tag.
                </p>

                <ul className="trust-line" aria-label="Quick highlights">
                  <li>Starting at $399</li>
                  <li>$149 to get started</li>
                  <li>Mobile-first</li>
                  <li>3-5 day turnaround</li>
                </ul>

                <p className="capacity-note">
                  I take on a limited number of new projects each month so every site gets real
                  attention.
                </p>
              </div>

              <aside className="hero-panel" aria-label="Value highlights">
                <div className="signal-card">
                  <span className="panel-label">What you get</span>
                  <strong>Make your business look credible before the first call.</strong>
                  <p>
                    Clear services. Stronger trust. A contact path that turns visitors into leads.
                  </p>
                </div>

                <div className="preview-grid" aria-label="Preview of outcomes">
                  <article className="preview-card preview-dental">
                    <span>Results</span>
                    <strong>More trust at first glance</strong>
                  </article>
                  <article className="preview-card preview-barber">
                    <span>Process</span>
                    <strong>Ready to launch in days</strong>
                  </article>
                  <article className="preview-card preview-spa">
                    <span>Conversion</span>
                    <strong>Clear path to contact</strong>
                  </article>
                  <article className="preview-card preview-expert">
                    <span>Support</span>
                    <strong>Support stays available</strong>
                  </article>
                </div>

                <div className="contact-strip">
                  <a href={whatsappLink} target="_blank" rel="noreferrer">
                    <span className="contact-link-label">WhatsApp / Telegram</span>
                    <strong className="contact-link-value">{phoneLabel}</strong>
                  </a>
                  <a href={instagramLink} target="_blank" rel="noreferrer">
                    <span className="contact-link-label">Instagram</span>
                    <strong className="contact-link-value">@sitebyamin</strong>
                  </a>
                  <a href={`mailto:${email}`}>
                    <span className="contact-link-label">Email</span>
                    <strong className="contact-link-value">{email}</strong>
                  </a>
                </div>
              </aside>
            </div>
          </section>

          <section className="section section-proof" aria-labelledby="why-title">
            <div className="container proof-layout">
              <div className="section-copy">
                <span className="eyebrow">Why Choose SiteByAmin</span>
                <h2 id="why-title">Why local businesses choose SiteByAmin.</h2>
              </div>

              <div className="proof-grid trust-grid">
                {trustItems.map((item) => (
                  <article className="proof-card trust-card" key={item.title}>
                    <span className="proof-label trust-icon">{item.icon}</span>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="section" aria-labelledby="process-title">
            <div className="container process-layout">
              <div className="section-copy">
                <span className="eyebrow">How It Works</span>
                <h2 id="process-title">A simple process from first message to launch.</h2>
              </div>

              <div className="step-grid timeline-grid">
                {steps.map((step) => (
                  <article className="process-card timeline-card" key={step.step}>
                    <span className="step-pill timeline-pill">{step.step}</span>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="section section-demos" id="demos" aria-labelledby="portfolio-title">
            <div className="container demos-layout">
              <div className="section-copy section-copy-wide">
                <span className="eyebrow">Portfolio</span>
                <h2 id="portfolio-title">Live website demos built for real businesses.</h2>
                <p className="section-microcopy">
                  Pick a direction, and I&rsquo;ll customize it around your business.
                </p>
              </div>

              <div className="demo-grid">
                {demos.map((demo) => (
                  <article className={`demo-card ${demo.theme}`} key={demo.id}>
                    <div className="demo-top">
                      <span className="demo-kicker">{demo.kicker}</span>
                      <span className="demo-delivery">{demo.delivery}</span>
                    </div>

                    <a
                      className="demo-shot"
                      href={demo.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${demo.title}`}
                    >
                      <img src={demo.previewImage} alt={demo.previewAlt} loading="lazy" decoding="async" />
                      <span className="demo-shot-badge">Live preview</span>
                    </a>

                    <div className="portfolio-copy">
                      <span className="portfolio-category">{demo.category}</span>
                      <h3>{demo.title}</h3>
                      <p>{demo.text}</p>
                    </div>

                    <dl className="demo-meta">
                      <div className="demo-meta-row">
                        <dt className="demo-meta-label">Best for</dt>
                        <dd className="demo-meta-value">{demo.bestFor}</dd>
                      </div>
                      <div className="demo-meta-row">
                        <dt className="demo-meta-label">Includes</dt>
                        <dd className="demo-meta-value">{demo.includes}</dd>
                      </div>
                    </dl>

                    <div className="demo-actions">
                      <a className="btn btn-secondary" href={demo.demoUrl} target="_blank" rel="noreferrer">
                        Live Preview
                      </a>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => jumpToContact(demo.formType)}
                      >
                        Customize This Website
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <SectionCta
                text="See a direction you like?"
                buttonLabel="Let's Build Your Website"
              />
            </div>
          </section>

          <section className="section section-pricing" id="pricing" aria-labelledby="pricing-title">
            <div className="container pricing-layout pricing-layout-stack">
              <div className="section-copy section-copy-wide">
                <span className="eyebrow">Pricing</span>
                <h2 id="pricing-title">Simple pricing for a faster launch.</h2>
                <p className="section-microcopy">
                  One-time pricing. Hosting and extra scope can be added if needed.
                </p>
              </div>

              <p className="pricing-intro-note">
                Every project starts with a short conversation about your business — not a generic
                template. The packages below just make pricing simple, not the process.
              </p>

              <div className="pricing-grid">
                {packages.map((pkg) => (
                  <article className={`pricing-card ${pkg.tone} ${pkg.featured ? "pricing-featured" : ""}`} key={pkg.label}>
                    <div className="pricing-header">
                      <span className="pricing-label">{pkg.label}</span>
                      {pkg.featured ? <span className="pricing-flag">Most popular</span> : null}
                    </div>
                    <h3>{pkg.label}</h3>
                    <div className="pricing-price">{pkg.price}</div>
                    <p className="price-context">{pkg.priceNote}</p>
                    <p className="pricing-audience">{pkg.audience}</p>
                    <ul className="pricing-list" aria-label={`${pkg.label} package details`}>
                      {pkg.included.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      className={`btn ${pkg.featured ? "btn-primary" : "btn-secondary"}`}
                      onClick={() => jumpToContact("", pkg.label)}
                    >
                      {pkg.cta}
                    </button>
                  </article>
                ))}
              </div>

              <div className="deposit-banner" role="note" aria-label="Deposit information">
                <strong>Start your project with a $149 deposit.</strong>
                <span>Reserve your spot, start right away, and pay the balance after approval.</span>
              </div>

              <p className="guarantee-note">
                Not happy with the design direction? I&rsquo;ll revise it until it&rsquo;s right, or
                refund your deposit before launch.
              </p>

              <article className="detail-card maintenance-card" aria-labelledby="maintenance-title">
                <div className="maintenance-copy">
                  <span className="eyebrow">Website Care</span>
                  <h2 id="maintenance-title">$99/month</h2>
                  <p className="section-microcopy">
                    For businesses that want updates handled for them.
                  </p>
                </div>
                <ul className="detail-pill-grid maintenance-list" aria-label="Maintenance plan includes">
                  {maintenanceItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <button type="button" className="btn btn-secondary" onClick={() => jumpToContact("", "Maintenance")}>
                  Ask About Website Care
                </button>
              </article>

              <SectionCta
                text="Need a site that works without a long agency timeline?"
                buttonLabel="Start Your Project"
              />
            </div>
          </section>

          {hasTestimonials ? (
            <section className="section section-testimonials" id="testimonials" aria-labelledby="testimonials-title">
              <div className="container testimonials-layout">
                <div className="section-copy">
                  <span className="eyebrow">Testimonials</span>
                  <h2 id="testimonials-title">What clients are saying.</h2>
                  <p>
                    Real feedback from local businesses I&rsquo;ve built websites for.
                  </p>
                </div>

                <div className="testimonial-grid">
                  {testimonials.map((item, index) => (
                    <article className="detail-card testimonial-card" key={`${item.name}-${index}`}>
                      <span className="proof-label">{item.tag}</span>
                      <blockquote className="testimonial-quote">{item.quote}</blockquote>
                      <footer className="testimonial-meta">
                        <strong>{item.name}</strong>
                        <span>{item.role}</span>
                      </footer>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          ) : null}

          <section className="section" aria-labelledby="about-title">
            <div className="container split-detail-layout about-layout">
              <article className="detail-card detail-card-contrast">
                <span className="eyebrow eyebrow-contrast">About Me</span>
                <h2 id="about-title">I build websites that make local businesses easier to trust.</h2>
                <p>
                  I help local businesses launch fast without looking cheap or generic.
                </p>
                <p>
                  The goal is simple: explain what you do, build trust fast, and make contact easy.
                </p>
                <a className="btn btn-secondary" href="#contact">
                  Start Your Project
                </a>
              </article>

              <aside className="detail-card about-photo-card" aria-label="Portrait of Amin">
                <span className="eyebrow">Portrait</span>
                <div className="photo-frame">
                  <img
                    className="about-photo"
                    src="/amin-portrait.jpg"
                    alt="Amin standing in Times Square at night"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </aside>
            </div>
          </section>

          <section className="section section-faq" id="faq" aria-labelledby="faq-title">
            <div className="container faq-layout">
              <div className="section-copy">
                <span className="eyebrow">FAQ</span>
                <h2 id="faq-title">Common questions before getting started.</h2>
                <p>Short answers. No surprises.</p>
              </div>

              <div className="faq-accordion">
                {faqs.map((item) => (
                  <details className="faq-item" key={item.question}>
                    <summary>{item.question}</summary>
                    <p>{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          <section className="section" aria-labelledby="final-cta-title">
            <div className="container">
              <div className="cta-panel final-cta">
                <div className="cta-copy">
                  <span className="eyebrow eyebrow-contrast">Ready to launch</span>
                  <h2 id="final-cta-title">Ready to grow your business online?</h2>
                  <p>
                    Send a few details and I will recommend the fastest way to launch.
                  </p>
                  <ul className="trust-line final-cta-pills" aria-label="Final call to action highlights">
                    <li>Starting at $399</li>
                    <li>$149 starts the project</li>
                    <li>3-5 day turnaround</li>
                  </ul>
                  <div className="cta-actions">
                    <a className="btn btn-primary" href="#contact">
                      Start Your Project
                    </a>
                    <a className="btn btn-secondary" href={whatsappLink} target="_blank" rel="noreferrer">
                      Message on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="section" id="contact" aria-labelledby="contact-title">
            <div className="container contact-layout">
              <div className="section-copy">
                <span className="eyebrow">Contact</span>
                <h2 id="contact-title">Tell me what you need.</h2>
                <p>Send a few details and I will recommend the best package.</p>
                <p className="section-microcopy">
                  Best for local businesses that need more trust, more inquiries, and a faster launch.
                </p>
              </div>

              <div className="contact-grid">
                <form
                  className="contact-form"
                  onSubmit={handleSubmit}
                  aria-busy={submitState.status === "loading"}
                  aria-label="Project inquiry form"
                >
                  <div className="field-grid">
                    <label className="field">
                      <span>Business name</span>
                      <input
                        name="businessName"
                        autoComplete="organization"
                        value={formState.businessName}
                        onChange={updateField}
                        placeholder="Your business name"
                        required
                      />
                    </label>

                    <label className="field">
                      <span>Website type</span>
                      <input
                        name="websiteType"
                        value={formState.websiteType}
                        onChange={updateField}
                        placeholder="Barber, salon, dentist, restaurant..."
                        required
                      />
                    </label>

                    <label className="field">
                      <span>Current website</span>
                      <input
                        name="currentWebsite"
                        type="url"
                        autoComplete="url"
                        inputMode="url"
                        value={formState.currentWebsite}
                        onChange={updateField}
                        placeholder="https://yourwebsite.com"
                      />
                    </label>

                    <label className="field">
                      <span>Social media</span>
                      <input
                        name="socialLink"
                        value={formState.socialLink}
                        onChange={updateField}
                        placeholder="Instagram, Facebook, or another profile"
                      />
                    </label>

                    <label className="field field-wide">
                      <span>Services</span>
                      <textarea
                        name="services"
                        value={formState.services}
                        onChange={updateField}
                        rows="3"
                        placeholder="List the main services you want on the site"
                      />
                    </label>

                    <label className="field">
                      <span>Preferred package</span>
                      <select name="preferredPackage" value={formState.preferredPackage} onChange={updateField}>
                        <option value="">Select package</option>
                        {packages.map((pkg) => (
                          <option key={pkg.label} value={pkg.label}>
                            {pkg.label}
                          </option>
                        ))}
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </label>

                    <label className="field">
                      <span>Timeline</span>
                      <input
                        name="timeline"
                        value={formState.timeline}
                        onChange={updateField}
                        placeholder="As soon as possible / this month / flexible"
                      />
                    </label>

                    <label className="field">
                      <span>Email</span>
                      <input
                        name="email"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        value={formState.email}
                        onChange={updateField}
                        placeholder="you@example.com"
                        required
                      />
                    </label>

                    <label className="field">
                      <span>Phone</span>
                      <input
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        inputMode="tel"
                        value={formState.phone}
                        onChange={updateField}
                        placeholder="+1 ..."
                      />
                    </label>

                    <label className="field field-wide">
                      <span>Notes</span>
                      <textarea
                        name="notes"
                        value={formState.notes}
                        onChange={updateField}
                        rows="4"
                        placeholder="Tell me what style you want, what business you run, or which demo you like most"
                      />
                    </label>
                  </div>

                  <button type="submit" className="btn btn-primary btn-full" disabled={submitState.status === "loading"}>
                    {submitState.status === "loading" ? "Sending..." : "Start My Project"}
                  </button>
                  <small
                    className={`submit-hint submit-${submitState.status}`}
                    role={submitState.status === "error" ? "alert" : "status"}
                    aria-live="polite"
                  >
                    {submitHint}
                  </small>
                </form>

                <aside className="contact-card">
                  <span className="panel-label">Direct contact</span>
                  <h3>Prefer to message?</h3>
                  <p>
                    Send a message on WhatsApp, Instagram, or email. I will point you to the fastest next step.
                  </p>
                  <p className="contact-note">
                    Reply is usually within 1 business day. Best by email or message.
                  </p>
                  <div className="direct-links">
                    <a href={whatsappLink} target="_blank" rel="noreferrer">
                      <span className="contact-link-label">WhatsApp / Telegram</span>
                      <strong className="contact-link-value">{phoneLabel}</strong>
                    </a>
                    <a href={instagramLink} target="_blank" rel="noreferrer">
                      <span className="contact-link-label">Instagram</span>
                      <strong className="contact-link-value">@sitebyamin</strong>
                    </a>
                    <a href={`mailto:${email}`}>
                      <span className="contact-link-label">Email</span>
                      <strong className="contact-link-value">{email}</strong>
                    </a>
                  </div>
                </aside>
              </div>
            </div>
          </section>
        </main>

        <footer className="site-footer">
          <div className="container footer-row">
            <div className="footer-bio">
              Custom websites for local businesses that need more trust, more inquiries, and a faster launch.
            </div>
            <nav className="footer-links" aria-label="Footer">
              <a href="#demos">Portfolio</a>
              <a href="#pricing">Pricing</a>
              <a href="#faq">FAQ</a>
              <a href="#contact">Contact</a>
              <a href={instagramLink} target="_blank" rel="noreferrer">
                Instagram
              </a>
              <a href={`mailto:${email}`}>Email</a>
            </nav>
            <div className="footer-meta">&copy; {year} Site by Amin</div>
          </div>
        </footer>

        <div className={`mobile-bookbar ${showMobileBookbar ? "is-visible" : ""}`}>
          <a className="btn btn-primary" href="#contact">
            Start Your Project
          </a>
        </div>
      </div>
    </>
  );
}

export default App;
