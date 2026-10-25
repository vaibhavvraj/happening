/* ==========================================================================
   home.js
   Fills the dynamic parts of index.html: hero tickets, category tiles,
   upcoming events and the "Get started" links.
   ========================================================================== */

(function (H) {
  "use strict";

  /** Three sample events shown as tilted tickets in the hero. */
  function renderHeroTickets() {
    var target = document.getElementById("hero-tickets");
    var picks = H.events.upcoming().slice(0, 3);

    target.innerHTML = picks
      .map(function (event) {
        return (
          '<a class="ticket" href="event.html?id=' + encodeURIComponent(event.id) + '">' +
            '<div class="date-stub">' +
              "<strong>" + new Date(event.start).getDate() + "</strong>" +
              "<span>" + H.fmt.month(event.start) + "</span>" +
            "</div>" +
            "<h3>" + H.esc(event.title) + "</h3>" +
            '<span class="event-meta">' + H.esc(event.area) + ", " + H.esc(event.city) + "</span>" +
            '<span class="event-meta">' + H.fmt.time(event.start) + " · " + H.fmt.fee(event) + "</span>" +
          "</a>"
        );
      })
      .join("");
  }

  /** One tile per category, linking to the filtered events page. */
  function renderCategories() {
    var target = document.getElementById("category-grid");

    target.innerHTML = Object.keys(H.CATEGORIES)
      .map(function (name) {
        var category = H.CATEGORIES[name];
        return (
          '<a class="category-tile" href="events.html?cat=' + encodeURIComponent(name) + '" ' +
            'style="background-image:' + category.gradient + '">' +
            "<h3>" + H.esc(name) + "</h3>" +
            "<p>" + H.esc(category.blurb) + "</p>" +
          "</a>"
        );
      })
      .join("");
  }

  /** The next three events, as regular cards. */
  function renderUpcoming() {
    var target = document.getElementById("upcoming-grid");
    var picks = H.events.upcoming().slice(0, 3);
    target.innerHTML = picks.map(H.eventCard).join("");
  }

  /** Logged-in visitors skip the sign up page. */
  function adjustLinksForUser() {
    var user = H.auth.current();
    if (!user) {
      return;
    }

    var organiserLink = document.getElementById("start-organiser");
    var browseLink = document.getElementById("start-browse");
    var heroOrganiserLink = document.getElementById("hero-organiser");

    if (user.role === "organiser") {
      organiserLink.href = "create.html";
      organiserLink.textContent = "Create an event";
      heroOrganiserLink.href = "create.html";
      heroOrganiserLink.textContent = "Create an event";
    }
    browseLink.href = "events.html";
  }

  /** Icons in the three feature cards. */
  function renderFeatureIcons() {
    document.getElementById("icon-find").innerHTML = H.icons.pin;
    document.getElementById("icon-save").innerHTML = H.icons.bell;
    document.getElementById("icon-organise").innerHTML = H.icons.megaphone;
  }

  renderFeatureIcons();
  renderHeroTickets();
  renderCategories();
  renderUpcoming();
  adjustLinksForUser();
})((window.Happening = window.Happening || {}));
