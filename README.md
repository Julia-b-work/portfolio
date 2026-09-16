# Portfolio — Julia Barrios

Personal portfolio website for Julia Barrios, a Computer Engineering student
at UFSCar. Built as a lightweight single-page site with a small Node.js backend
for the contact form.

**Live site:** [https://portfolio-6rx8.onrender.com](https://portfolio-6rx8.onrender.com)

## Features

- Single-page portfolio: Home, About, Projects, and Contact sections
- Responsive dark theme
- Contact form with server-side validation and email alerts via SendGrid
- Contact submissions persisted to disk (`messages.json`)
- Zero runtime dependencies — the server uses only Node.js built-ins

## Tech stack

| Layer    | Technology                                    |
| -------- | --------------------------------------------- |
| Frontend | HTML5, CSS3, vanilla JavaScript (XHR)         |
| Backend  | Node.js (built-in `http`, `fs`, `path`, `https`) |
| Email    | SendGrid Web API v3                           |
| Hosting  | Render (free tier)                            |

## Getting started

Requirements: [Node.js](https://nodejs.org) 18 or later.

```bash
git clone https://github.com/Julia-b-work/portfolio.git
cd portfolio
node server.js
```

Open [http://localhost:3000](http://localhost:3000).

## Configuration

The contact form's email alerts are configured via environment variables:

| Variable           | Description                              |
| ------------------ | ---------------------------------------- |
| `SENDGRID_API_KEY` | SendGrid API key used to send email alerts |
| `TO_EMAIL`         | Address that receives contact messages    |
| `FROM_EMAIL`       | Address shown as the sender                |
| `PORT`             | Port the server listens on (default `3000`) |

Without `SENDGRID_API_KEY`, messages are still saved to `messages.json` but no
email is sent.

## Project structure

```
portfolio/
├── index.html        # Single-page site markup
├── style.css         # Dark theme styling
├── script.js         # Contact form submission + smooth scrolling
├── server.js         # Static file server + /contact endpoint + SendGrid
├── package.json      # Node runtime metadata (start script)
└── messages.json     # Saved contact form submissions (gitignored)
```

## Deployment

The site is deployed on Render as a web service. Configuration:

- **Build command:** `npm install`
- **Start command:** `npm start`
- **Environment variables:** as listed in [Configuration](#configuration)

The `messages.json` log is stored on Render's ephemeral filesystem and does not
persist across redeploys; email delivery is unaffected.

## Contact

Julia Barrios — [GitHub](https://github.com/Julia-b-work)
