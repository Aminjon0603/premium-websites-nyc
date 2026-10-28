import React from "react";
import ReactDOM from "react-dom/client";
import "./studio.css";
import App from "./App.jsx";

const root = document.getElementById("root");
const app = (
  <React.StrictMode>
    <App path={window.location.pathname} />
  </React.StrictMode>
);

// Pages are prerendered at build time (scripts/prerender.mjs), so hydrate when
// markup is already there and fall back to a fresh render in dev.
if (root.hasChildNodes()) {
  ReactDOM.hydrateRoot(root, app);
} else {
  ReactDOM.createRoot(root).render(app);
}
