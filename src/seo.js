// Per-page metadata. Used by the app at runtime and by scripts/prerender.mjs,
// which writes it into the static HTML for each route.

const SITE = "https://sitebyamin.com";

export const routes = {
  home: {
    path: "/",
    title: "Websites for NYC Small Businesses from $198 | Site by Amin",
    description:
      "Clear, mobile-friendly websites for NYC salons, barbershops, cafes, local services, and education programs. One-time packages from $198. Optional care from $78/month. No calls needed.",
    canonical: `${SITE}/`,
    image: `${SITE}/sitebyamin-og.png`,
    imageAlt: "Site by Amin: websites for NYC small businesses from $198, with the Chess & Truck website shown on a laptop and phone",
  },
  case: {
    path: "/work/chess-and-truck",
    title: "Chess & Truck Case Study | Site by Amin",
    description:
      "How Amin designed and built the Chess & Truck website for kids' chess programs in NYC. Published, with registration and payments prepared for when programs open.",
    canonical: `${SITE}/work/chess-and-truck`,
    image: `${SITE}/og-chess-and-truck.png`,
    imageAlt: "Chess & Truck case study by Site by Amin, with the website shown on a laptop and phone",
  },
};

export const routeForPath = (path) => {
  const clean = path.length > 1 ? path.replace(/\/+$/, "") : path;
  return clean === routes.case.path ? "case" : "home";
};
