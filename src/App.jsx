import { useEffect, useMemo, useRef, useState } from "react";
import {
  addOns,
  demos,
  faqs,
  packages,
  proofItems,
  reasons,
  steps,
} from "./siteContent";

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

function App() {
  const [formState, setFormState] = useState(initialFormState);
  const [submitState, setSubmitState] = useState({ status: "idle", message: "" });
  const [showMobileBookbar, setShowMobileBookbar] = useState(false);
  const heroActionsRef = useRef(null);
  const year = new Date().getFullYear();
  const whatsappNumber = "13323450632";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;
  const phoneLabel = "+1 332 345 0632";
  const instagramLink = "https://instagram.com/aminjon0603";
  const email = "amin2002abrorov@gmail.com";

  const submitHint = useMemo(() => {
    if (submitState.status === "loading") {
      return "Sending your request to Site by Amin...";
    }

    if (submitState.status === "success" || submitState.status === "error") {
      return submitState.message;
    }

    if (formState.websiteType || formState.preferredPackage) {
      return "Your request is sent directly to Site by Amin. I reply by email or message, not by phone call.";
    }

    return "Send a few details and I will recommend the best website option for your business. Email or message works best.";
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
          "Thanks. Your request was sent successfully. I will reply by email or message as soon as I review it.",
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
    <div className="sales-page">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="site-header">
        <div className="container header-row">
          <a className="brand" href="#top" aria-label="Site by Amin home">
            <span className="brand-mark">SA</span>
            <span className="brand-copy">
              <strong>Site by Amin</strong>
              <small>Premium websites for local service businesses</small>
            </span>
          </a>

          <nav className="site-nav" aria-label="Primary">
            <a href="#demos">Demos</a>
            <a href="#pricing">Pricing</a>
            <a href="#contact">Contact</a>
          </nav>

          <a className="btn btn-primary btn-header" href={whatsappLink} target="_blank" rel="noreferrer">
            Send a message
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="container hero-layout">
            <div className="hero-copy">
              <span className="eyebrow">Site by Amin</span>
              <h1>Premium websites for local service businesses</h1>
              <p className="hero-text">
                Choose a polished website system, get it customized to your brand, and launch in
                days starting at $399. Built for dental clinics, barbershops, spas, coaches, and
                personal brands that need to look trustworthy and ready to book.
              </p>

              <div className="hero-actions" ref={heroActionsRef}>
                <a className="btn btn-secondary" href="#demos">
                  View Live Demos
                </a>
                <a className="btn btn-primary" href="#contact">
                  Get Your Version
                </a>
              </div>

              <div className="trust-line">
                <span>Starting at $399</span>
                <span>4 live demos</span>
                <span>Mobile-ready</span>
                <span>Customized to your brand</span>
              </div>
            </div>

            <aside className="hero-panel">
              <div className="signal-card">
                <span className="panel-label">What you get</span>
                <strong>Launched in days, not weeks</strong>
                <p>
                  These are premium website systems with strong structure already in place. I
                  customize the branding, content, services, and contact flow so your site feels
                  built for your business instead of looking like a generic template.
                </p>
              </div>

              <div className="preview-grid" aria-label="Preview of industries served">
                <article className="preview-card preview-dental">
                  <span>Dental</span>
                  <strong>Trust-first, clean, premium</strong>
                </article>
                <article className="preview-card preview-barber">
                  <span>Barber</span>
                  <strong>Sharp, editorial, booking-ready</strong>
                </article>
                <article className="preview-card preview-spa">
                  <span>Spa</span>
                  <strong>Soft luxury and elevated wellness</strong>
                </article>
                <article className="preview-card preview-expert">
                  <span>Experts</span>
                  <strong>Authority, clarity, personal brand</strong>
                </article>
              </div>

              <div className="contact-strip">
                <a href={whatsappLink} target="_blank" rel="noreferrer">
                  <span className="contact-link-label">WhatsApp / Telegram</span>
                  <strong className="contact-link-value">{phoneLabel}</strong>
                </a>
                <a href={instagramLink} target="_blank" rel="noreferrer">
                  <span className="contact-link-label">Instagram</span>
                  <strong className="contact-link-value">@aminjon0603</strong>
                </a>
                <a href={`mailto:${email}`}>
                  <span className="contact-link-label">Email</span>
                  <strong className="contact-link-value">{email}</strong>
                </a>
              </div>
            </aside>
          </div>
        </section>

        <section className="section section-proof">
          <div className="container proof-layout">
            <div className="section-copy">
              <span className="eyebrow">Proof and trust</span>
              <h2>Built from live demos and launch-ready systems</h2>
              <p>
                This is not a vague promise of custom design sometime later. The concepts are
                already live, mobile-ready, and structured to help local service businesses look
                polished fast.
              </p>
            </div>

            <div className="proof-grid">
              {proofItems.map((item) => (
                <article className="proof-card" key={item.title}>
                  <span className="proof-label">{item.label}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container intro-layout">
            <div className="section-copy">
              <span className="eyebrow">A faster way to launch a premium website</span>
              <h2>A faster way to launch a premium website</h2>
            </div>

            <div className="intro-content">
              <p className="intro-lead">
                Building from scratch takes time, costs more, and usually turns into a long chain
                of revisions, delays, and polite suffering.
              </p>
              <p>
                I use high-end pre-built website frameworks and customize them to fit your
                business, brand, services, and contact flow so you can launch faster without
                sacrificing quality.
              </p>
              <p>
                This is ideal for local businesses that want a strong online presence without
                waiting weeks for a fully custom build.
              </p>
            </div>

            <div className="intro-benefits">
              <article className="benefit-card">
                <span className="mini-label">Speed</span>
                <strong>Fast turnaround</strong>
                <p>Get a premium website customized and launched in days, not weeks.</p>
              </article>
              <article className="benefit-card">
                <span className="mini-label">Clarity</span>
                <strong>Proven layout systems</strong>
                <p>
                  These structures are already built around clarity, trust, and conversion-friendly
                  structure.
                </p>
              </article>
              <article className="benefit-card">
                <span className="mini-label">Fit</span>
                <strong>Customized to your brand</strong>
                <p>Your colors, services, copy, and contact flow replace the placeholder content.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section section-demos" id="demos">
          <div className="container demos-layout">
            <div className="section-copy section-copy-wide">
              <span className="eyebrow">Website concepts ready to be customized</span>
              <h2>Website concepts ready to be customized</h2>
              <p>
                Choose a website style that fits your business. I&apos;ll adapt it to your brand,
                content, and goals.
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
                    <img src={demo.previewImage} alt={demo.previewAlt} loading="lazy" />
                    <span className="demo-shot-badge">Live preview</span>
                  </a>

                  <h3>{demo.title}</h3>
                  <p>{demo.text}</p>
                  <div className="demo-meta">
                    <div className="demo-meta-row">
                      <span className="demo-meta-label">Best for</span>
                      <span className="demo-meta-value">{demo.bestFor}</span>
                    </div>
                    <div className="demo-meta-row">
                      <span className="demo-meta-label">Includes</span>
                      <span className="demo-meta-value">{demo.includes}</span>
                    </div>
                    <div className="demo-meta-row">
                      <span className="demo-meta-label">Delivery</span>
                      <span className="demo-meta-value">{demo.delivery}</span>
                    </div>
                  </div>
                  <div className="demo-actions">
                    <a className="btn btn-secondary" href={demo.demoUrl} target="_blank" rel="noreferrer">
                      View Live Demo
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
          </div>
        </section>

        <section className="section">
          <div className="container process-layout">
            <div className="section-copy">
              <span className="eyebrow">How it works</span>
              <h2>How it works</h2>
            </div>

            <div className="step-grid">
              {steps.map((step) => (
                <article className="process-card" key={step.step}>
                  <span className="step-pill">{step.step}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>

            <p className="process-note">
              No long development cycle. No bloated process. Just a premium website customized
              for your business and launched fast. Humanity occasionally stumbles into efficiency.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container reasons-layout">
            <div className="section-copy">
              <span className="eyebrow">Why choose this over a full custom build?</span>
              <h2>Why choose this over a full custom build?</h2>
            </div>

            <div className="reason-grid">
              {reasons.map((reason) => (
                <article className="reason-card" key={reason.title}>
                  <h3>{reason.title}</h3>
                  <p>{reason.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-pricing" id="pricing">
          <div className="container pricing-layout">
            <div className="section-copy section-copy-wide">
              <span className="eyebrow">Simple pricing</span>
              <h2>Simple pricing</h2>
              <p>Choose the level of customization that fits your business.</p>
            </div>

            <div className="pricing-grid">
              {packages.map((pkg) => (
                <article className={`pricing-card ${pkg.tone}`} key={pkg.name}>
                  <span className="pricing-label">{pkg.label}</span>
                  <h3>{pkg.name}</h3>
                  <div className="pricing-price">{pkg.price}</div>
                  <p className="pricing-audience">{pkg.audience}</p>
                  <div className="pricing-list">
                    {pkg.included.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => jumpToContact("", pkg.name)}
                  >
                    {pkg.cta}
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container split-detail-layout">
            <article className="detail-card">
              <span className="eyebrow">Optional add-ons</span>
              <h2>Optional add-ons</h2>
              <p>
                Need more than the core setup? Additional services are available depending on the
                project.
              </p>
              <div className="detail-pill-grid">
                {addOns.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>

            <article className="detail-card detail-card-contrast">
              <span className="eyebrow eyebrow-contrast">About Site by Amin</span>
              <h2>Built for businesses that want to look premium without moving slowly</h2>
              <p>
                I help local service businesses launch premium websites using high-end pre-built
                frameworks customized to their brand.
              </p>
              <p>
                This approach works especially well for businesses that need a professional online
                presence fast without dragging through a long custom design process.
              </p>
              <p>
                Whether you&apos;re a dental clinic, spa, barbershop, tutor, or personal brand,
                the goal is the same: make your business look polished, trustworthy, and easy to
                contact.
              </p>
            </article>
          </div>
        </section>

        <section className="section">
          <div className="container cta-panel">
            <div className="cta-copy">
              <span className="eyebrow eyebrow-contrast">Ready to launch your version?</span>
              <h2>Ready to launch your version?</h2>
              <p>
                Choose a demo, send your business details, and I&apos;ll customize it into a
                website that fits your brand and helps you present your business professionally.
              </p>
              <div className="cta-actions">
                <a className="btn btn-primary" href={whatsappLink} target="_blank" rel="noreferrer">
                  Send a Message
                </a>
                <a className="btn btn-secondary" href="#contact">
                  Get Your Version
                </a>
              </div>
              <small>Available for NYC businesses and selected remote clients</small>
            </div>
          </div>
        </section>

        <section className="section section-faq">
          <div className="container faq-layout">
            <div className="section-copy">
              <span className="eyebrow">FAQ</span>
              <h2>Questions clients usually ask before getting started</h2>
              <p>
                A few fast answers about timelines, content, revisions, and how the process works.
              </p>
            </div>

            <div className="faq-grid">
              {faqs.map((item) => (
                <article className="faq-card" key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="contact">
          <div className="container contact-layout">
            <div className="section-copy">
              <span className="eyebrow">Tell me about your business</span>
              <h2>Tell me about your business</h2>
              <p>
                Send a few details and I&apos;ll recommend the best website option for your business.
              </p>
            </div>

            <div className="contact-grid">
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="field-grid">
                  <label className="field">
                    <span>Business name</span>
                    <input
                      name="businessName"
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
                      placeholder="Dental, spa, barber, coach..."
                      required
                    />
                  </label>

                  <label className="field">
                    <span>Current website</span>
                    <input
                      name="currentWebsite"
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
                        <option key={pkg.name} value={pkg.name}>
                          {pkg.name}
                        </option>
                      ))}
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
                  {submitState.status === "loading" ? "Sending..." : "Request My Website"}
                </button>
                <small className={`submit-hint submit-${submitState.status}`}>{submitHint}</small>
              </form>

              <aside className="contact-card">
                <span className="panel-label">Direct contact</span>
                <h3>Prefer to message directly?</h3>
                <p>
                  If you already know which website system you want, send a message on WhatsApp,
                  Instagram, or email and I&apos;ll point you to the right option fast.
                </p>
                <p className="contact-note">
                  I don&apos;t answer phone calls. The best way to reach me is by email or message.
                </p>
                <div className="direct-links">
                  <a href={whatsappLink} target="_blank" rel="noreferrer">
                    <span className="contact-link-label">WhatsApp / Telegram</span>
                    <strong className="contact-link-value">{phoneLabel}</strong>
                  </a>
                  <a href={instagramLink} target="_blank" rel="noreferrer">
                    <span className="contact-link-label">Instagram</span>
                    <strong className="contact-link-value">@aminjon0603</strong>
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
            Site by Amin builds premium websites for local service businesses. Fast, polished, and
            designed to help you launch with confidence.
          </div>
          <div className="footer-links">
            <a href="#demos">View Demos</a>
            <a href="#pricing">Pricing</a>
            <a href="#contact">Contact</a>
            <a href={whatsappLink} target="_blank" rel="noreferrer">
              Send a Message
            </a>
          </div>
          <div className="footer-meta">&copy; {year} Site by Amin</div>
        </div>
      </footer>

      <div className={`mobile-bookbar ${showMobileBookbar ? "is-visible" : ""}`}>
        <a className="btn btn-primary" href="#contact">
          Get Your Version
        </a>
      </div>
    </div>
  );
}

export default App;
