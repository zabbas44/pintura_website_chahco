# Amjad Pintura

Premium multi-page website for a Barcelona-based paint and decoration company.

## Structure

- `public/` static assets like favicon and robots
- `pages/` HTML pages
- `assets/` shared CSS and JavaScript
- `server/` Express backend and contact form handler

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

3. Open:

```bash
http://localhost:3000
```

## Contact form

The form works in two modes:

- Default local mode: request payload is captured by the server and logged to the terminal.
- SMTP mode: set these environment variables to send real emails:

```bash
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
CONTACT_TO=example@amjadpintura.com
CONTACT_FROM="Amjad Pintura Website <no-reply@amjadpintura.com>"
```

## Pages

- `/`
- `/services`
- `/projects`
- `/about`
- `/contact`
