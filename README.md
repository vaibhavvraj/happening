# Happening

Know what's happening around you, so there's nothing to miss.

Happening is a place to discover upcoming events in your city: hackathons, cultural programs, social gatherings, social welfare work and more. It is not a booking platform. It helps people, especially those new to a city, find things to do and meet people.

## Prototype

`index.html` is a single-file, front-end-only prototype. Open it in a browser; there is nothing to install.

### Roles
- **Organiser**: create events (title, category, city, area, venue, date, time, fee, description, up to 4 photos, contact details) and see them under My events.
- **Just here to browse**: discover, save and share events.

### Features
- Search, plus filters for city, date (today, tomorrow, this week, weekend, next 30 days), free or paid, and category
- Interested button with a count
- "Good vibes" reaction (a placeholder for the like button; name still to be decided)
- Share (copies the event details)
- Reminders (1 day or 2 hours before), shown in an in-app bell panel
- Get more info: the organiser's contact details
- "More events in [city]" at the bottom of each event
- Light and dark themes

### Limits of the prototype
Data is stored in the browser's localStorage, so events created by organisers are visible only to that browser. Sample events are hard-coded. Reminders do not send phone or email notifications.

## Roadmap
- Database and organiser accounts, so events are shared between everyone
- Real notifications (push or email) for reminders
- Comments on events
- Event moderation and reporting
- Location-based discovery

## Hosting
To publish the prototype, enable GitHub Pages: Settings, Pages, deploy from the `main` branch root.
