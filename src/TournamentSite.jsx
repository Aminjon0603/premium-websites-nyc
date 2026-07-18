import { useEffect, useMemo, useRef, useState } from "react";
import {
  aboutCards,
  contactEmails,
  contactNumbers,
  faqItems,
  featuredTournament,
  heroStats,
  policyItems,
  scheduleItems,
  sectionOptions,
  serviceLevels,
} from "./siteContent";

const registrationInitialState = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  additionalEmails: "",
  acceptSms: false,
  playerFirstName: "",
  playerLastName: "",
  playerGrade: "",
  schoolName: "",
  section: "",
  serviceLevel: "",
  uscfId: "",
  parentName: "",
  parentEmail: "",
  parentPhone: "",
  emergencyName: "",
  emergencyPhone: "",
  medicalInfo: "",
};

const contactInitialState = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const splitAdditionalEmails = (value) =>
  value
    .split(/[,\n;]+/)
    .map((item) => item.trim())
    .filter(Boolean);

function TournamentSite() {
  const [registrationState, setRegistrationState] = useState(registrationInitialState);
  const [registrationErrors, setRegistrationErrors] = useState({});
  const [paymentState, setPaymentState] = useState({ status: "idle", message: "", details: null });
  const [contactState, setContactState] = useState(contactInitialState);
  const [contactSubmitState, setContactSubmitState] = useState({ status: "idle", message: "" });
  const paymentStatusChecked = useRef(false);
  const year = new Date().getFullYear();

  const selectedServiceLevel = useMemo(
    () => serviceLevels.find((item) => item.id === registrationState.serviceLevel) || null,
    [registrationState.serviceLevel]
  );

  useEffect(() => {
    if (paymentStatusChecked.current) {
      return;
    }

    const currentUrl = new URL(window.location.href);
    const payment = currentUrl.searchParams.get("payment");
    const sessionId = currentUrl.searchParams.get("session_id");

    if (!payment) {
      return;
    }

    paymentStatusChecked.current = true;

    if (payment === "cancel") {
      setPaymentState({
        status: "cancelled",
        message: "Checkout was cancelled. Your form is still here, so you can continue whenever you are ready.",
        details: null,
      });
      return;
    }

    if (payment === "success" && sessionId) {
      setPaymentState({ status: "loading", message: "", details: null });
      fetch("/api/checkout-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })
        .then(async (response) => {
          const payload = await response.json().catch(() => ({}));

          if (!response.ok || payload.status !== "paid") {
            throw new Error(payload.error || "Payment confirmation could not be verified yet.");
          }

          setPaymentState({ status: "success", message: payload.message || "", details: payload });
          setRegistrationState(registrationInitialState);
          setRegistrationErrors({});
        })
        .catch((error) => {
          setPaymentState({
            status: "error",
            message:
              error instanceof Error
                ? error.message
                : "Payment confirmation could not be verified yet.",
            details: null,
          });
        });
    }
  }, []);

  const updateRegistrationField = ({ target }) => {
    const { name, type, checked, value } = target;
    const nextValue = type === "checkbox" ? checked : value;

    setRegistrationState((current) => {
      const next = { ...current, [name]: nextValue };
      if (name === "section" && value !== "Open") {
        next.uscfId = "";
      }
      return next;
    });

    setRegistrationErrors((current) => {
      const next = { ...current };
      delete next[name];
      if (name === "section" && value !== "Open") {
        delete next.uscfId;
      }
      return next;
    });

    if (paymentState.status !== "idle") {
      setPaymentState({ status: "idle", message: "", details: null });
    }
  };

  const updateContactField = ({ target }) => {
    const { name, value } = target;
    setContactState((current) => ({ ...current, [name]: value }));
    if (contactSubmitState.status !== "idle") {
      setContactSubmitState({ status: "idle", message: "" });
    }
  };

  const scrollToRegister = () =>
    document.getElementById("register")?.scrollIntoView({ behavior: "smooth", block: "start" });

  const validateRegistration = () => {
    const errors = {};
    const extraEmails = splitAdditionalEmails(registrationState.additionalEmails);

    if (!registrationState.firstName.trim()) errors.firstName = "First name is required.";
    if (!registrationState.lastName.trim()) errors.lastName = "Last name is required.";
    if (!registrationState.phone.trim()) errors.phone = "Phone is required.";
    if (!registrationState.email.trim()) errors.email = "Email is required.";
    if (registrationState.email && !isValidEmail(registrationState.email.trim())) {
      errors.email = "Enter a valid email address.";
    }
    if (extraEmails.some((email) => !isValidEmail(email))) {
      errors.additionalEmails = "One or more additional email addresses are invalid.";
    }
    if (!registrationState.acceptSms) errors.acceptSms = "You must accept the terms.";
    if (!registrationState.playerFirstName.trim()) errors.playerFirstName = "Required.";
    if (!registrationState.playerLastName.trim()) errors.playerLastName = "Required.";
    if (!registrationState.playerGrade.trim()) errors.playerGrade = "Required.";
    if (!registrationState.section) errors.section = "Choose a section.";
    if (!registrationState.serviceLevel) errors.serviceLevel = "Choose a service level.";
    if (registrationState.section === "Open" && !registrationState.uscfId.trim()) {
      errors.uscfId = "USCF ID is required for Open.";
    }
    if (!registrationState.parentName.trim()) errors.parentName = "Required.";
    if (!registrationState.parentEmail.trim()) errors.parentEmail = "Required.";
    if (registrationState.parentEmail && !isValidEmail(registrationState.parentEmail.trim())) {
      errors.parentEmail = "Enter a valid parent email address.";
    }
    if (!registrationState.parentPhone.trim()) errors.parentPhone = "Required.";
    if (!registrationState.emergencyName.trim()) errors.emergencyName = "Required.";
    if (!registrationState.emergencyPhone.trim()) errors.emergencyPhone = "Required.";
    if (!registrationState.medicalInfo.trim()) errors.medicalInfo = "Medical info is required.";

    setRegistrationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegistrationSubmit = async (event) => {
    event.preventDefault();

    if (!validateRegistration()) {
      setPaymentState({
        status: "error",
        message: "Please fix the highlighted fields before continuing to payment.",
        details: null,
      });
      return;
    }

    setPaymentState({ status: "loading", message: "", details: null });

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationState),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok || !payload.url) {
        throw new Error(payload.error || "Stripe checkout could not be created.");
      }

      window.location.assign(payload.url);
    } catch (error) {
      setPaymentState({
        status: "error",
        message:
          error instanceof Error ? error.message : "Stripe checkout could not be created.",
        details: null,
      });
    }
  };

  const handleContactSubmit = async (event) => {
    event.preventDefault();
    setContactSubmitState({ status: "loading", message: "" });

    try {
      const response = await fetch("/api/tournament-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactState),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || "Your message could not be sent right now.");
      }

      setContactSubmitState({ status: "success", message: payload.message || "Message sent." });
      setContactState(contactInitialState);
    } catch (error) {
      setContactSubmitState({
        status: "error",
        message:
          error instanceof Error ? error.message : "Your message could not be sent right now.",
      });
    }
  };

  return (
    <div className="tournament-page">
      <div className="page-glow page-glow-a" />
      <div className="page-glow page-glow-b" />

      <header className="site-header">
        <div className="container header-row">
          <a className="brand" href="#home" aria-label="CHESS AND TRUCK home">
            <span className="brand-badge">CT</span>
            <span className="brand-copy">
              <strong>{featuredTournament.brand}</strong>
              <small>NYC chess tournaments</small>
            </span>
          </a>

          <nav className="site-nav" aria-label="Primary">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#events">Events &amp; Tournaments</a>
            <a href="#faq">FAQ</a>
            <a href="#contact">Contact</a>
          </nav>

          <button type="button" className="btn btn-primary header-cta" onClick={scrollToRegister}>
            Register
          </button>
        </div>
      </header>

      <main id="home">
        <section className="hero-section">
          <div className="container hero-layout">
            <div className="hero-copy">
              <span className="eyebrow">New York City Tournament Series</span>
              <h1>{featuredTournament.title}</h1>
              <p className="hero-text">{featuredTournament.subtitle}</p>

              <div className="hero-actions">
                <button type="button" className="btn btn-primary" onClick={scrollToRegister}>
                  Register for the Tournament
                </button>
                <a className="btn btn-secondary" href="#events">
                  Explore Event Details
                </a>
              </div>

              <div className="hero-stat-row">
                {heroStats.map((item) => (
                  <article className="hero-stat" key={item.value}>
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </article>
                ))}
              </div>
            </div>

            <aside className="hero-panel">
              <div>
                <span className="panel-label">Featured Event</span>
                <h2>{featuredTournament.title}</h2>
                <p>
                  {featuredTournament.formatLabel}. {featuredTournament.scheduleLabel}.{" "}
                  {featuredTournament.pricingLabel}.
                </p>
              </div>

              <div className="event-chip-grid">
                <span>{featuredTournament.city}</span>
                <span>{featuredTournament.scheduleLabel}</span>
                <span>Open and Beginner sections</span>
                <span>Secure Stripe payment</span>
              </div>

              <div className="board-preview" aria-hidden="true">
                <div className="board-grid" />
                <div className="piece piece-king">K</div>
                <div className="piece piece-knight">N</div>
                <div className="piece piece-rook">R</div>
              </div>
            </aside>
          </div>
        </section>

        <section className="section" id="events">
          <div className="container split-layout">
            <div className="section-heading">
              <span className="eyebrow">Events &amp; Tournaments</span>
              <h2>One clear event page, one confident registration path</h2>
              <p>
                The site answers the questions families have before signing up: which section fits,
                what is required, who to contact, and how payment works.
              </p>
            </div>

            <div className="content-stack">
              <article className="feature-panel">
                <span className="mini-label">Tournament focus</span>
                <h3>Chess &amp; Truck Tournament</h3>
                <p>
                  A sharp, parent-friendly tournament layout with straightforward details, a clean
                  registration form, and a Stripe-powered checkout that feels trustworthy from the
                  first click.
                </p>
              </article>

              <div className="section-card-grid">
                {sectionOptions.map((item) => (
                  <article className="section-card" key={item.id}>
                    <span className="section-badge">{item.badge}</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <ul>
                      {item.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>

              <div className="timeline-grid">
                {scheduleItems.map((item) => (
                  <article className="timeline-card" key={item.title}>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>

              <article className="policy-panel">
                <span className="mini-label">Registration Notes</span>
                <h3>Policies shown before payment</h3>
                <ul>
                  {policyItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="section" id="about">
          <div className="container split-layout">
            <div className="section-heading">
              <span className="eyebrow">About</span>
              <h2>Designed around chess seriousness and family clarity</h2>
              <p>
                Instead of copying another academy site, this concept uses the strong ideas that
                work for tournament businesses and reshapes them around your own name, offer,
                contacts, and registration logic.
              </p>
            </div>

            <div className="about-grid">
              {aboutCards.map((card) => (
                <article className="about-card" key={card.title}>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-registration" id="register">
          <div className="container registration-layout">
            <div className="section-heading section-heading-wide">
              <span className="eyebrow">Chess &amp; Truck Tournament Registration Form</span>
              <h2>Register once, then continue to secure payment</h2>
              <p>
                Please provide player and parent information. You will choose the tournament section
                and service level in this form before being redirected to Stripe checkout.
              </p>
            </div>

            <div className="registration-grid">
              <form className="registration-form" onSubmit={handleRegistrationSubmit} noValidate>
                <section className="form-section">
                  <div className="form-section-heading">
                    <span className="step-number">01</span>
                    <div>
                      <h3>Contact Information</h3>
                      <p>Primary booking details for the family submitting the registration.</p>
                    </div>
                  </div>

                  <div className="field-grid">
                    <label className="field">
                      <span>First Name *</span>
                      <input name="firstName" value={registrationState.firstName} onChange={updateRegistrationField} placeholder="First name" />
                      {registrationErrors.firstName ? <small className="field-error">{registrationErrors.firstName}</small> : null}
                    </label>
                    <label className="field">
                      <span>Last Name *</span>
                      <input name="lastName" value={registrationState.lastName} onChange={updateRegistrationField} placeholder="Last name" />
                      {registrationErrors.lastName ? <small className="field-error">{registrationErrors.lastName}</small> : null}
                    </label>
                    <label className="field">
                      <span>Phone *</span>
                      <input name="phone" value={registrationState.phone} onChange={updateRegistrationField} placeholder="United States (+1)" />
                      {registrationErrors.phone ? <small className="field-error">{registrationErrors.phone}</small> : null}
                    </label>
                    <label className="field">
                      <span>Email *</span>
                      <input name="email" type="email" value={registrationState.email} onChange={updateRegistrationField} placeholder="you@example.com" />
                      {registrationErrors.email ? <small className="field-error">{registrationErrors.email}</small> : null}
                    </label>
                    <label className="field field-wide">
                      <span>Additional Email Addresses</span>
                      <input name="additionalEmails" value={registrationState.additionalEmails} onChange={updateRegistrationField} placeholder="Use commas to add additional email addresses" />
                      {registrationErrors.additionalEmails ? <small className="field-error">{registrationErrors.additionalEmails}</small> : null}
                    </label>
                    <label className="checkbox-field field-wide">
                      <input name="acceptSms" type="checkbox" checked={registrationState.acceptSms} onChange={updateRegistrationField} />
                      <span>I accept the Terms of Service and Privacy Policy, and agree to receive transactional or informational SMS communications regarding reminders, customer care, and related updates.</span>
                    </label>
                    {registrationErrors.acceptSms ? <small className="field-error field-wide">{registrationErrors.acceptSms}</small> : null}
                  </div>
                </section>

                <section className="form-section">
                  <div className="form-section-heading">
                    <span className="step-number">02</span>
                    <div>
                      <h3>Player Information</h3>
                      <p>Choose the right section and tournament service level for the player.</p>
                    </div>
                  </div>

                  <div className="field-grid">
                    <label className="field">
                      <span>Player First Name *</span>
                      <input name="playerFirstName" value={registrationState.playerFirstName} onChange={updateRegistrationField} placeholder="Player first name" />
                      {registrationErrors.playerFirstName ? <small className="field-error">{registrationErrors.playerFirstName}</small> : null}
                    </label>
                    <label className="field">
                      <span>Player Last Name *</span>
                      <input name="playerLastName" value={registrationState.playerLastName} onChange={updateRegistrationField} placeholder="Player last name" />
                      {registrationErrors.playerLastName ? <small className="field-error">{registrationErrors.playerLastName}</small> : null}
                    </label>
                    <label className="field">
                      <span>Player Grade *</span>
                      <input name="playerGrade" value={registrationState.playerGrade} onChange={updateRegistrationField} placeholder="Grade" />
                      {registrationErrors.playerGrade ? <small className="field-error">{registrationErrors.playerGrade}</small> : null}
                    </label>
                    <label className="field">
                      <span>School Name</span>
                      <input name="schoolName" value={registrationState.schoolName} onChange={updateRegistrationField} placeholder="Used for team scoring" />
                    </label>
                    <label className="field">
                      <span>Section *</span>
                      <select name="section" value={registrationState.section} onChange={updateRegistrationField}>
                        <option value="">Select section</option>
                        <option value="Open">Open</option>
                        <option value="Beginner">Beginner</option>
                      </select>
                      {registrationErrors.section ? <small className="field-error">{registrationErrors.section}</small> : null}
                    </label>
                    <label className="field">
                      <span>Select Your Service Level *</span>
                      <select name="serviceLevel" value={registrationState.serviceLevel} onChange={updateRegistrationField}>
                        <option value="">Select service level</option>
                        {serviceLevels.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.label} - {formatCurrency(item.amount)}
                          </option>
                        ))}
                      </select>
                      {registrationErrors.serviceLevel ? <small className="field-error">{registrationErrors.serviceLevel}</small> : null}
                    </label>
                    <label className="field field-wide">
                      <span>USCF ID</span>
                      <input name="uscfId" value={registrationState.uscfId} onChange={updateRegistrationField} placeholder="Required for Open section only" />
                      <small className="field-note">
                        Players without an active USCF ID cannot play in Open. Leave blank if
                        playing Beginner. Join or renew at{" "}
                        <a href="https://new.uschess.org/" target="_blank" rel="noreferrer">uschess.org</a>.
                      </small>
                      {registrationErrors.uscfId ? <small className="field-error">{registrationErrors.uscfId}</small> : null}
                    </label>
                  </div>
                </section>

                <section className="form-section">
                  <div className="form-section-heading">
                    <span className="step-number">03</span>
                    <div>
                      <h3>Parent / Guardian Information</h3>
                      <p>The primary adult contact for tournament communications.</p>
                    </div>
                  </div>

                  <div className="field-grid">
                    <label className="field">
                      <span>Parent / Guardian Name *</span>
                      <input name="parentName" value={registrationState.parentName} onChange={updateRegistrationField} placeholder="Parent / Guardian name" />
                      {registrationErrors.parentName ? <small className="field-error">{registrationErrors.parentName}</small> : null}
                    </label>
                    <label className="field">
                      <span>Parent Email *</span>
                      <input name="parentEmail" type="email" value={registrationState.parentEmail} onChange={updateRegistrationField} placeholder="parent@example.com" />
                      {registrationErrors.parentEmail ? <small className="field-error">{registrationErrors.parentEmail}</small> : null}
                    </label>
                    <label className="field">
                      <span>Parent Phone *</span>
                      <input name="parentPhone" value={registrationState.parentPhone} onChange={updateRegistrationField} placeholder="+1 ..." />
                      {registrationErrors.parentPhone ? <small className="field-error">{registrationErrors.parentPhone}</small> : null}
                    </label>
                  </div>
                </section>

                <section className="form-section">
                  <div className="form-section-heading">
                    <span className="step-number">04</span>
                    <div>
                      <h3>Emergency Contact</h3>
                      <p>Backup contact details for tournament-day communication.</p>
                    </div>
                  </div>

                  <div className="field-grid">
                    <label className="field">
                      <span>Emergency Contact Name *</span>
                      <input name="emergencyName" value={registrationState.emergencyName} onChange={updateRegistrationField} placeholder="Emergency contact name" />
                      {registrationErrors.emergencyName ? <small className="field-error">{registrationErrors.emergencyName}</small> : null}
                    </label>
                    <label className="field">
                      <span>Emergency Contact Phone *</span>
                      <input name="emergencyPhone" value={registrationState.emergencyPhone} onChange={updateRegistrationField} placeholder="+1 ..." />
                      {registrationErrors.emergencyPhone ? <small className="field-error">{registrationErrors.emergencyPhone}</small> : null}
                    </label>
                  </div>
                </section>

                <section className="form-section">
                  <div className="form-section-heading">
                    <span className="step-number">05</span>
                    <div>
                      <h3>Medical Information</h3>
                      <p>Allergies, medical conditions, medications, or anything staff should know.</p>
                    </div>
                  </div>

                  <div className="field-grid">
                    <label className="field field-wide">
                      <span>Medical Information *</span>
                      <textarea name="medicalInfo" value={registrationState.medicalInfo} onChange={updateRegistrationField} rows="4" placeholder="Allergies, medical conditions, medications" />
                      {registrationErrors.medicalInfo ? <small className="field-error">{registrationErrors.medicalInfo}</small> : null}
                    </label>
                  </div>
                </section>

                <button type="submit" className="btn btn-primary btn-full" disabled={paymentState.status === "loading"}>
                  {paymentState.status === "loading" ? "Preparing Checkout..." : "Continue to Secure Payment"}
                </button>

                <small className={`submit-hint submit-${paymentState.status}`} aria-live="polite">
                  {paymentState.status === "success" && paymentState.details
                    ? `Payment confirmed for ${paymentState.details.playerName}. A Stripe receipt was sent to ${paymentState.details.customerEmail}.`
                    : paymentState.status === "cancelled"
                      ? paymentState.message
                      : paymentState.status === "error"
                        ? paymentState.message
                        : paymentState.status === "loading"
                          ? "Preparing secure Stripe checkout..."
                          : "Complete the form, then continue to secure payment with Stripe."}
                </small>
              </form>

              <aside className="summary-column">
                <article className="summary-card">
                  <span className="panel-label">Registration Summary</span>
                  <h3>{featuredTournament.title}</h3>
                  <p>
                    {featuredTournament.city}. {featuredTournament.scheduleLabel}. Stripe handles
                    the final payment step.
                  </p>

                  <div className="summary-list">
                    <div>
                      <span>Section</span>
                      <strong>{registrationState.section || "Choose a section"}</strong>
                    </div>
                    <div>
                      <span>Service level</span>
                      <strong>{selectedServiceLevel?.label || "Select service level"}</strong>
                    </div>
                    <div>
                      <span>Player</span>
                      <strong>
                        {registrationState.playerFirstName || registrationState.playerLastName
                          ? `${registrationState.playerFirstName} ${registrationState.playerLastName}`.trim()
                          : "Player details pending"}
                      </strong>
                    </div>
                    <div>
                      <span>Total</span>
                      <strong>{selectedServiceLevel ? formatCurrency(selectedServiceLevel.amount) : "$0"}</strong>
                    </div>
                  </div>
                </article>

                <article className="summary-card summary-card-accent">
                  <span className="panel-label">Service Levels</span>
                  <div className="service-level-stack">
                    {serviceLevels.map((item) => (
                      <article className="service-level-card" key={item.id}>
                        <div>
                          <h4>{item.label}</h4>
                          <p>{item.description}</p>
                        </div>
                        <strong>{formatCurrency(item.amount)}</strong>
                      </article>
                    ))}
                  </div>
                </article>
              </aside>
            </div>
          </div>
        </section>

        <section className="section" id="faq">
          <div className="container split-layout">
            <div className="section-heading">
              <span className="eyebrow">FAQ</span>
              <h2>Key answers before families commit</h2>
              <p>
                This section carries the practical information that usually prevents last-minute
                confusion during registration and payment.
              </p>
            </div>

            <div className="faq-grid">
              {faqItems.map((item) => (
                <article className="faq-card" key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-contact" id="contact">
          <div className="container split-layout">
            <div className="section-heading">
              <span className="eyebrow">Contact</span>
              <h2>Talk to the tournament team directly</h2>
              <p>
                Families can register online, but it still helps to keep a direct-contact layer for
                section questions, support, or operational follow-up.
              </p>
            </div>

            <div className="contact-grid">
              <div className="contact-stack">
                <article className="contact-panel">
                  <span className="panel-label">Phone / WhatsApp</span>
                  <div className="contact-link-grid">
                    {contactNumbers.map((item) => (
                      <a href={item.href} key={item.display} target="_blank" rel="noreferrer">
                        <span>{item.label}</span>
                        <strong>{item.display}</strong>
                      </a>
                    ))}
                  </div>
                </article>

                <article className="contact-panel">
                  <span className="panel-label">Email</span>
                  <div className="contact-link-grid">
                    {contactEmails.map((item) => (
                      <a href={item.href} key={item.display}>
                        <span>{item.label}</span>
                        <strong>{item.display}</strong>
                      </a>
                    ))}
                  </div>
                </article>
              </div>

              <form className="contact-form" onSubmit={handleContactSubmit}>
                <span className="panel-label">General Questions</span>
                <h3>Send a message</h3>
                <p>Use this form for logistics, eligibility questions, or pre-registration support.</p>

                <label className="field">
                  <span>Name *</span>
                  <input name="name" value={contactState.name} onChange={updateContactField} placeholder="Your name" required />
                </label>
                <label className="field">
                  <span>Email *</span>
                  <input name="email" type="email" value={contactState.email} onChange={updateContactField} placeholder="you@example.com" required />
                </label>
                <label className="field">
                  <span>Phone</span>
                  <input name="phone" value={contactState.phone} onChange={updateContactField} placeholder="+1 ..." />
                </label>
                <label className="field">
                  <span>Message *</span>
                  <textarea name="message" value={contactState.message} onChange={updateContactField} rows="5" placeholder="Ask about sections, schedule, tournament fit, or support" required />
                </label>

                <button type="submit" className="btn btn-primary btn-full" disabled={contactSubmitState.status === "loading"}>
                  {contactSubmitState.status === "loading" ? "Sending..." : "Send Message"}
                </button>

                <small className={`submit-hint submit-${contactSubmitState.status}`} aria-live="polite">
                  {contactSubmitState.status === "idle"
                    ? "Messages are routed to the tournament email team."
                    : contactSubmitState.message}
                </small>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-row">
          <p>
            {featuredTournament.brand} is a New York City chess tournament concept with a premium
            registration flow, practical event structure, and Stripe-ready payment experience.
          </p>
          <div className="footer-links">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#events">Events</a>
            <a href="#faq">FAQ</a>
            <a href="#contact">Contact</a>
          </div>
          <small>&copy; {year} {featuredTournament.brand}</small>
        </div>
      </footer>
    </div>
  );
}

export default TournamentSite;
