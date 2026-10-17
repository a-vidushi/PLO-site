/* =========================================================
   PLO site script
   Navbar, dropdowns, carousel and FAQ collapse are handled by
   Bootstrap 4. This file only adds the page-specific bits.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initBanner();
  initTimeline();
  initHint();
  initResourcesTable();
  initResultsArchive();
  initCentreSearch();
  initPortal();
});

/* ---------------------------------------------------------
   Hall ticket & results portal (the private plo-portal backend).
   Put its address here once it's live, e.g. "https://plo-portal.iiit.ac.in".
   Leave it empty and the site never shows any hall ticket or results links.
--------------------------------------------------------- */
const PORTAL_URL = "";

/* Ask the portal what's been released, then update the page:
   - data-portal-show="portal" (the navbar "Sign in" tab) appears whenever the portal is reachable;
   - data-portal-show="hall_tickets|results" notices appear while that's released;
   - data-portal-hide="…" text disappears while that's released;
   - data-portal-href="/" links point at the portal's sign-in page.
   If the portal can't be reached, the page stays as it is. */
async function initPortal() {
  if (!PORTAL_URL) return;
  const base = PORTAL_URL.replace(/\/+$/, "");
  let status;
  try {
    const resp = await fetch(base + "/status.json", { cache: "no-store" });
    if (!resp.ok) return;
    status = await resp.json();
  } catch {
    return;
  }
  const isOpen = { portal: true, hall_tickets: !!status.hall_tickets_open, results: !!status.results_open };

  document.querySelectorAll("[data-portal-href]").forEach((a) => {
    a.href = base + a.dataset.portalHref;
  });
  document.querySelectorAll("[data-portal-show]").forEach((el) => {
    el.hidden = !isOpen[el.dataset.portalShow];
  });
  document.querySelectorAll("[data-portal-hide]").forEach((el) => {
    el.hidden = !!isOpen[el.dataset.portalHide];
  });

  // The announcement strip on every page takes over while either is open (results first).
  const text = document.getElementById("banner-text");
  const link = document.getElementById("banner-link");
  if (!text || !link) return;
  if (isOpen.results) {
    text.textContent = "PLO 2027 Round 1 results are out!";
    link.textContent = "Sign in to see yours →";
    link.href = base + "/";
  } else if (isOpen.hall_tickets) {
    text.textContent = "Hall tickets for PLO 2027 Round 1 are out!";
    link.textContent = "Sign in to download yours →";
    link.href = base + "/";
  }
}

/* Once the page has finished loading, fetch the remaining carousel
   photos in the background so each slide is ready when it rotates in. */
window.addEventListener("load", () => {
  document.querySelectorAll('.carousel-item img[loading="lazy"]').forEach((img) => {
    img.loading = "eager";
  });
});

/* ---------------------------------------------------------
   PLO 2026-2027 key dates. Update these each cycle.
--------------------------------------------------------- */
const DATES = {
  registrationStart: "2026-09-19",
  registrationEnd: "2026-10-31",
  round1: "2026-11-29",
  results: "2027-01-15",
  aploStart: "2027-03-01",
  aploEnd: "2027-04-30",
  campStart: "2027-05-01",
  campEnd: "2027-06-30",
  iolStart: "2027-07-01",
  iolEnd: "2027-07-28",
};

function day(s) {
  return new Date(s + "T00:00:00");
}

function today() {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
}

/* Announcement strip at the top of every page */
function initBanner() {
  const text = document.getElementById("banner-text");
  const link = document.getElementById("banner-link");
  if (!text || !link) return;

  const t = today();
  const d = Object.fromEntries(Object.entries(DATES).map(([k, v]) => [k, day(v)]));
  let msg, label, href;

  if (t < d.registrationStart) {
    msg = "PLO 2026-2027 Registration opens 19 September 2026!";
    label = "View Timeline →";
    href = "index.html#home-timeline";
  } else if (t <= d.registrationEnd) {
    msg = "PLO 2026-2027 Registration is OPEN — Last date 31 October 2026!";
    label = "Register Now →";
    href = "registration.html";
  } else if (t < d.results) {
    msg = "Round 1 registration is closed. Results will be announced on 15 January 2027.";
    label = "View Timeline →";
    href = "index.html#home-timeline";
  } else if (t < d.aploStart) {
    msg = "Round 1 Results are now LIVE! Check your scores and rankings.";
    label = "Check Results →";
    href = "results.html";
  } else if (t <= d.aploEnd) {
    msg = "Round 2 APLO is underway! Good luck to all participants.";
    label = "Learn More →";
    href = "olympiad.html#aplo";
  } else if (t <= d.campEnd) {
    msg = "Round 2 CAMP is underway in Hyderabad!";
    label = "Learn More →";
    href = "olympiad.html#plo";
  } else if (t <= d.iolEnd) {
    msg = "IOL 2027 is here! Best of luck to Team India!";
    label = "Learn More →";
    href = "olympiad.html#iol";
  } else {
    msg = "IOL 2027 has concluded. Stay tuned for results and updates!";
    label = "In the Past →";
    href = "previous.html";
  }

  text.textContent = msg;
  link.textContent = label;
  link.href = href;
}

/* Timeline: fade finished events, highlight the next one */
function initTimeline() {
  const events = document.querySelectorAll(".timeline-event[data-date]");
  const t = today();
  let nextFound = false;
  events.forEach((ev) => {
    if (day(ev.dataset.date) < t) {
      ev.classList.add("done");
    } else if (!nextFound) {
      ev.classList.add("now");
      nextFound = true;
    }
  });
}

/* Sample problem hint toggle */
function initHint() {
  const btn = document.getElementById("hint-btn");
  const hint = document.getElementById("hint");
  if (!btn || !hint) return;
  btn.addEventListener("click", () => {
    hint.classList.toggle("show");
    btn.textContent = hint.classList.contains("show") ? "Hide Hint" : "Click Here to view a Hint!";
  });
}

/* Resources: filter problems by year, as on the old site.
   The table filters as you type, once a full 4-digit year is entered.
   resources.html?year=2019 opens with that year already filled in. */
function initResourcesTable() {
  const table = document.getElementById("rsc-table");
  if (!table) return;
  const form = document.getElementById("rsc-search-form");
  const input = document.getElementById("rsc-search-value");
  const rows = Array.from(table.tBodies[0].rows);

  function apply() {
    const year = input.value.trim();
    rows.forEach((r) => {
      r.style.display = year.length !== 4 || r.dataset.year === year ? "" : "none";
    });
  }

  const fromUrl = new URLSearchParams(location.search).get("year");
  if (fromUrl) input.value = fromUrl;

  input.addEventListener("input", apply);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    apply();
  });
  apply();
}

/* In the Past: year pills + IOL / Camp / PLO tabs */
function initResultsArchive() {
  const years = document.querySelectorAll("[data-year]");
  const tabs = document.querySelectorAll("[data-tab]");
  if (!years.length || !tabs.length) return;

  let year = years[0].dataset.year;
  let tab = "iol";

  function render() {
    years.forEach((y) => y.classList.toggle("active", y.dataset.year === year));
    // Hide tabs this year has no data for
    let firstAvailable = null;
    tabs.forEach((b) => {
      const has = !!document.getElementById(`${year}-${b.dataset.tab}`);
      b.parentElement.style.display = has ? "" : "none";
      if (has && !firstAvailable) firstAvailable = b.dataset.tab;
    });
    if (!document.getElementById(`${year}-${tab}`)) tab = firstAvailable;
    tabs.forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
    document.querySelectorAll(".year-panel").forEach((p) => {
      p.classList.toggle("show", p.id === `${year}-${tab}`);
    });
    const title = document.getElementById("archive-year");
    if (title) title.textContent = year;
  }

  years.forEach((y) =>
    y.addEventListener("click", (e) => {
      e.preventDefault();
      year = y.dataset.year;
      render();
    }),
  );
  tabs.forEach((b) =>
    b.addEventListener("click", (e) => {
      e.preventDefault();
      tab = b.dataset.tab;
      render();
    }),
  );
  render();
}

/* Centres: filter by state / city / centre */
function initCentreSearch() {
  const input = document.getElementById("centreSearch");
  if (!input) return;
  const rows = document.querySelectorAll(".centre-item");
  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    rows.forEach((r) => {
      r.style.display = !q || r.textContent.toLowerCase().includes(q) ? "" : "none";
    });
  });
}
