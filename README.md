# PLO website (merged)

The look and evergreen text come from the old (2023) PLO site. Current information (dates, fees, payment links,
results, team, centres, photos) comes from `PLO-website`. It is plain HTML, CSS and JS with no build step.

## Run locally

    python3 -m http.server 8767 --directory plo-merged

Then open http://localhost:8767/

## Pages

| Menu                          | File                | What to update                                  |
| ----------------------------- | ------------------- | ----------------------------------------------- |
| Home                          | `index.html`        | Welcome text, fee cards, timeline dates         |
| Participate → Registration    | `registration.html` | Dates, fees, payment links, documents           |
| Participate → Eligibility     | `eligibility.html`  | "IOL 2026" direct-entry year                    |
| Participate → Centres         | `centres.html`      | Centre table rows (`<tr class="centre-item">`)  |
| Participate → FAQs            | `faq.html`          | Questions (copy a `.card` block)                |
| Resources                     | `resources.html`    | Problem rows (`<tr data-difficulty="easy">`)    |
| In the Past → Results Archive | `previous.html`     | Year pills and `year-panel` blocks              |
| What is? → PLO / IOL / APLO   | `olympiad.html`     | IOL host and dates, APLO month                  |
| What is? → Linguistics        | `linguistics.html`  |                                                 |
| What is? → Team               | `team.html`         | Team member cards                               |
| Results                       | `results.html`      | Round 1 results when announced                  |

The navbar, announcement strip and footer are repeated at the top and bottom of every page. If you change one,
change it on all pages.

## Each new cycle

1. `js/site.js`: update the `DATES` block at the top. This drives the announcement strip on every page.
2. `index.html`: update the `data-date` and text of each `timeline-event`. Finished events fade out
   automatically and the next one is highlighted.
3. `registration.html`, `faq.html`, `index.html`: update fees and the `payments.iiit.ac.in/plo20XX/...` links.
4. `previous.html`: add a year pill (`data-year`) and its `year-panel` blocks with ids like `2027-iol`,
   `2027-camp` and `2027-plo`.

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
  `badge saffron|green` (team names), and `level-easy|medium|hard|expert` (problem rows).
