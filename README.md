# PLO website (merged)

The look and evergreen text come from the old (2023) PLO site. Current information (dates, fees, payment links,
results, team, centres, photos) comes from `PLO-website`. It is plain HTML, CSS and JS with no build step.

- **Live site:** https://plo-india.github.io/PLO-site/
- **This repo:** https://github.com/plo-india/PLO-site (public; GitHub Pages publishes `main` automatically)
- **Hall ticket & results portal:** https://github.com/plo-india/plo-portal (private; see its README)

Every push to `main` goes live within a minute or two. Never commit student data (registration lists, marks,
anything with names or dates of birth) here: everything in this repo is public.

## Run locally

From inside this folder:

    python3 -m http.server 8767

Then open http://localhost:8767/

## Pages

| Menu                          | File                | What to update                                                            |
| ----------------------------- | ------------------- | ------------------------------------------------------------------------- |
| Home                          | `index.html`        | Welcome text, registration note, timeline                                 |
| Participate → Registration    | `registration.html` | Dates, fees, payment links, documents                                     |
| Participate → Eligibility     | `eligibility.html`  | "IOL 2026" direct-entry year                                              |
| Participate → Centres         | `centres.html`      | Centre table rows (`<tr class="centre-item">`)                            |
| Participate → FAQs            | `faq.html`          | Questions (copy a `.card` block)                                          |
| Resources                     | `resources.html`    | Problem rows (`<tr class="level-color level-color-04" data-year="2019">`) |
| In the Past → Results Archive | `previous.html`     | Year pills and `year-panel` blocks                                        |
| What is? → PLO / IOL / APLO   | `olympiad.html`     | IOL host and dates, APLO month                                            |
| What is? → Linguistics        | `linguistics.html`  |                                                                           |
| What is? → Team               | `team.html`         | Team member cards                                                         |
| Results                       | `results.html`      | Round 1 results when announced                                            |

The navbar, announcement strip and footer are repeated at the top and bottom of every page. If you change one,
change it on all pages.

## Each new cycle

1. `js/site.js`: update the `DATES` block at the top. This drives the announcement strip on every page.
2. `index.html`: update the `data-date` and text of each `timeline-event`. Finished events fade out
   automatically and the next one is highlighted.
3. `registration.html`, `faq.html`: update fees and the `payments.iiit.ac.in/plo20XX/...` links.
4. `previous.html`: add a year pill (`data-year`) and its `year-panel` blocks with ids like `2027-iol`,
   `2027-camp` and `2027-plo`.

## Hall tickets and results

The website has no student data. Hall tickets and results live in the private portal
(`plo-india/plo-portal`). Once the portal is live, put its address in `PORTAL_URL` at the top of `js/site.js`.

The site then checks the portal on every page load:

- A **Sign in** tab appears in the navbar corner of every page. It leads to the portal's single sign-in,
  where students use their roll number and date of birth and see everything that's been released.
- While an admin has **Open hall tickets** on: the announcement strip says "Hall tickets … are out!" and a
  highlighted notice appears on the home page and the Centres page.
- While **Release results** is on: the strip announces the results (results take priority), and notices appear
  on the home page and the Results page, where the "results will be announced…" text is hidden.

Every link goes to the same sign-in page. Turning a switch off reverts the site on the next page load. If
`PORTAL_URL` is empty or the portal can't be reached, the site simply shows its normal content, with no Sign in
tab.

The notices are plain HTML marked `hidden` with `data-portal-show="hall_tickets"` or `"results"` (the tab uses
`"portal"`); edit their text in the HTML like anything else. Admins don't sign in here: they use the portal's
own admin address.

## Social links

Facebook, Instagram, X (Twitter), LinkedIn and email links appear twice on every page: in the footer and in
the floating icons at the bottom right (`<div class="social">`). Update both if a link changes.

## Images

`images/` also holds a few files that no page uses yet: the two IIIT logos (`IIIT_Hyderabad.jpg`,
`iithimages.jpg`) and the AI illustrations (`index.jpg`, `image copy.png`, `image copy 2.png`).

## Styling

- `css/theme.css` is the old site's stylesheet: Bootstrap 4.6.1 with the hand-drawn borders and the Neucha and
  Cabin Sketch fonts. Don't edit it.
- `css/site.css` holds the site-specific pieces: timeline, highlights, carousel frame, medals and difficulty
  colours.
- Useful classes: `text-highlight yellow|red|blue|green|pink`, `badge medal gold|silver|bronze|hm|solution`,
  `badge saffron|green` (team names), and `level-color-00` … `level-color-10` (problem rows, green → red).

## Moving to an IIIT domain

The site can move from `plo-india.github.io/PLO-site/` to an IIIT address at any time. All links inside the
site are relative, so nothing in the HTML needs to change. Pick one of these:

### Option A: keep GitHub Pages, add an IIIT subdomain (recommended)

Best for a subdomain such as `plo.iiit.ac.in`. GitHub keeps hosting it, so pushing to `main` still publishes it.

1. Ask IIIT's IT/DNS team to add a **CNAME** record: `plo.iiit.ac.in` → `plo-india.github.io`.
2. In the `plo-india` organization, go to **Settings → Pages → Add a domain** and verify `plo.iiit.ac.in`
   (IT adds one extra TXT record). This stops anyone else's GitHub account from claiming the domain.
3. In this repo, go to **Settings → Pages → Custom domain**, enter `plo.iiit.ac.in` and save. GitHub commits a
   `CNAME` file to `main`; keep that file.
4. Once the HTTPS certificate is ready (up to a day), tick **Enforce HTTPS**.

GitHub Pages can't serve a sub-path like `ltrc.iiit.ac.in/plo`. For that, use option B.

### Option B: host the files on an IIIT web server

For an address like `ltrc.iiit.ac.in/plo/`.

1. Ask the server admins for a folder served at that address.
2. Copy this repo's files into it (everything except `.git`), or `git clone` the repo there and `git pull` after
   each update.
3. Turn off GitHub Pages (repo **Settings → Pages**) or leave a note on it pointing to the new address, so there
   aren't two live copies drifting apart.

### After either move

- Set `PLO_SITE_URL` on the portal server to the new address (see the `plo-portal` README).
- Update the link everywhere it's been shared: Facebook, Instagram, X, LinkedIn bios, email signatures, and
  posters.
- Put the new address at the top of this README.
