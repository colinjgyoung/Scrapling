# Communication Signal Finder

A small, local-first tool for finding and qualifying public conversations relevant to Colin Young's Barcelona workplace-communication offer.

It deliberately does **not** scrape LinkedIn, automate a logged-in browser, send messages, connect with people, comment, or like posts. It generates targeted search links and helps a human decide which posts merit attention.

## Start

1. Download or clone the repository.
2. Open `lead-signal-finder/index.html` in Chrome, Edge, Firefox, or Safari.
3. No installation, API key, account connection, or command line is required.

All candidate data and the shortlist remain in the browser's local storage. Clearing browser storage removes the shortlist. Export a CSV if you want a portable copy.

## Recommended 15-minute workflow

1. Choose one audience and one pain area.
2. Open one English and one Spanish search.
3. Read the posts on LinkedIn or the public web. Do not collect a post merely because it mentions communication.
4. Paste a candidate only when it contains a problem, change, constraint, request, or meaningful discussion.
5. Qualify it and inspect the evidence and score breakdown.
6. Open the original post before acting.
7. Comment only when you have something useful to contribute. Do not use the first comment as a disguised sales pitch.

## Qualification model

The score is transparent and deterministic:

| Dimension | Maximum |
|---|---:|
| Explicit need or pain | 30 |
| Fit with the communication offer | 25 |
| Buyer or influencer role | 15 |
| Barcelona/Catalonia relevance | 10 |
| Recency | 10 |
| Openness to ideas, referrals or support | 10 |

Recruitment posts, job announcements, awards and similar content can receive an irrelevance penalty.

The labels mean:

- **Strong buyer signal:** evidence of a relevant need plus strong contextual fit.
- **Possible conversation signal:** relevant and worth opening, but not yet a sales opportunity.
- **Relevant topic, no clear need yet:** useful for insight or visibility, not outreach.
- **Weak signal:** insufficient evidence. Usually ignore it.

This is triage, not truth. A high score never replaces reading the original post.

## Scope of the offer

The tool prioritises:

- presentations and executive communication;
- communication in international teams;
- difficult conversations and feedback;
- meetings and facilitation;
- stakeholder communication, influencing and change;
- communication-development programmes delivered in English.

Direct corporate decision makers remain the primary audience. L&D/People teams, Operations/team leaders, and specialist training partners are included as separate discovery routes.

## Test

With Node.js installed, run:

```bash
node lead-signal-finder/tests/scoring.test.js
```

The optional browser smoke test uses Playwright:

```bash
node lead-signal-finder/tests/ui-smoke.js
```

The production tool itself has no runtime dependencies.
