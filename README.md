# Happening

Know what's happening around you, so there's nothing to miss.

Happening is a place to discover upcoming events in your city: hackathons, cultural programs, social gatherings, social welfare work and more. It is not a booking platform. It helps people, especially those new to a city, find things to do and meet people.

This is a front-end prototype built with plain HTML, CSS and JavaScript. There is nothing to install or build. Open `index.html` in a browser, or host the folder on GitHub Pages.

## Pages

| Page | What it does |
| --- | --- |
| `index.html` | Home: hero, what Happening does, upcoming events, categories, how it works, get started |
| `events.html` | Browse events with search and filters (city, date, free or paid, category) |
| `event.html?id=...` | Event details: photos, fee, interested, good vibes, share, reminder, organiser contact, more events in the same city |
| `login.html` | Sign up (organiser or just browsing) and log in |
| `create.html` | Organisers create an event (title, description, photos, fee, contact) |
| `my-events.html` | Organisers see and delete the events they listed |

## Project structure

```
index.html, events.html, event.html, login.html, create.html, my-events.html

css/
  base.css         design tokens, reset, typography
  layout.css       navbar, reminders panel, footer
  components.css   buttons, pills, event cards, panels, toast
  home.css         home page only
  events.css       events and event detail pages
  forms.css        login, create and my events pages

js/
  data.js          categories, cities, sample events
  store.js         localStorage: preferences, events, demo accounts
  helpers.js       escaping, formatting, URL params, toast, clipboard
  components.js    icons, event card, empty state
  layout.js        builds the navbar and footer on every page
  home.js, events.js, event.js, create.js, my-events.js, login.js   one per page
```

Scripts are loaded in this order on every page: `data`, `store`, `helpers`, `components`, `layout`, then the page's own script. They share one `window.Happening` object.

## Limits of the prototype

- Data is stored in the browser's localStorage, so events created by organisers are visible only on that device.
- Accounts are a demo. Passwords are salted and hashed in the browser, but nothing is sent to a server. Do not use a real password.
- Reminders appear in the bell panel. They do not send phone or email notifications.
- Interested and good vibes counts are per device on top of the sample numbers.

## Roadmap

- A database and real accounts, so events are shared between everyone
- Push or email notifications for reminders
- Comments on events (the "Good vibes" button is a placeholder name for the like feature)
- Moderation and reporting
- Location-based discovery

## Hosting

GitHub Pages: Settings, Pages, deploy from the `main` branch, root folder.
