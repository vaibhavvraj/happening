/* ==========================================================================
   layout.js
   Builds the shared navbar and footer on every page, and wires up the
   mobile menu, the reminders panel and the log out button.

   Each page sets <body data-page="..."> so the matching nav link is highlighted.
   ========================================================================== */

(function (H) {
  "use strict";

  /* Navbar --------------------------------------------------------------- */

  function navLink(href, label, page, currentPage) {
    var current = page === currentPage ? ' aria-current="page"' : "";
    return '<a href="' + href + '"' + current + ">" + label + "</a>";
  }

  function navLinksHtml(currentPage) {
    var html =
      navLink("index.html", "Home", "home", currentPage) +
      navLink("events.html", "Events", "events", currentPage) +
      navLink("index.html#how-it-works", "How it works", "", currentPage);

    if (H.auth.isOrganiser()) {
      html +=
        navLink("create.html", "Create event", "create", currentPage) +
        navLink("my-events.html", "My events", "my-events", currentPage);
    }
    return html;
  }

  function accountHtml() {
    var user = H.auth.current();
    if (!user) {
      // "Sign up / " is hidden on very small screens, leaving "Log in".
      return '<a class="btn btn-primary" href="login.html"><span class="nav-login-extra">Sign up / </span>Log in</a>';
    }
    return (
      '<span class="nav-user">' +
        '<span class="nav-user-name">' + H.esc(user.name) + "</span>" +
        '<button class="btn" type="button" data-action="logout">Log out</button>' +
      "</span>"
    );
  }

  function reminderCount() {
    return H.prefs.reminderIds().filter(function (id) {
      return H.events.find(id);
    }).length;
  }

  function bellHtml() {
    var count = reminderCount();
    return (
      '<button class="btn" type="button" data-action="bell" aria-label="Reminders" aria-expanded="false">' +
        H.icons.bell +
        (count ? '<span class="badge">' + count + "</span>" : "") +
      "</button>"
    );
  }

  function renderHeader(currentPage) {
    var header = document.getElementById("site-header");
    if (!header) {
      return;
    }

    header.className = "site-header";
    header.innerHTML =
      '<div class="container navbar">' +
        '<a class="logo" href="index.html"><span class="logo-dot"></span>Happening</a>' +
        '<nav class="site-nav" id="site-nav" aria-label="Main">' + navLinksHtml(currentPage) + "</nav>" +
        '<div class="nav-actions">' + bellHtml() + accountHtml() + "</div>" +
        '<button class="btn nav-toggle" type="button" data-action="menu" aria-expanded="false" aria-controls="site-nav" aria-label="Menu">&#9776;</button>' +
      "</div>";
  }

  /* Reminders panel ------------------------------------------------------ */

  function remindersPanelHtml() {
    var events = H.prefs
      .reminderIds()
      .map(H.events.find)
      .filter(Boolean)
      .sort(function (a, b) {
        return a.start - b.start;
      });

    var items = events.length
      ? events
          .map(function (event) {
            return (
              '<a class="notif-item" href="event.html?id=' + encodeURIComponent(event.id) + '">' +
                "<strong>" + H.esc(event.title) + "</strong>" +
                '<span class="muted">' + H.fmt.countdown(event) +
                " · reminder " + H.fmt.reminder(H.prefs.reminder(event.id)) + "</span>" +
              "</a>"
            );
          })
          .join("")
      : '<p class="muted">No reminders yet. Open an event and choose a reminder.</p>';

    return (
      "<h2 style=\"font-size:1.1rem\">Reminders</h2>" + items +
      '<p class="hint">In this preview, reminders appear here. Phone and email alerts need the full version.</p>'
    );
  }

  function toggleRemindersPanel(button) {
    var existing = document.getElementById("notif-panel");
    if (existing) {
      existing.remove();
      button.setAttribute("aria-expanded", "false");
      return;
    }

    var panel = document.createElement("div");
    panel.id = "notif-panel";
    panel.className = "notif-panel";
    panel.innerHTML = remindersPanelHtml();
    document.getElementById("site-header").appendChild(panel);
    button.setAttribute("aria-expanded", "true");
  }

  /* Footer --------------------------------------------------------------- */

  function renderFooter() {
    var footer = document.getElementById("site-footer");
    if (!footer) {
      return;
    }

    footer.className = "site-footer";
    footer.innerHTML =
      '<div class="container footer-grid">' +
        '<div class="footer-brand">' +
          '<a class="logo" href="index.html"><span class="logo-dot"></span>Happening</a>' +
          "<p>Know what is happening around you, so there is nothing for you to miss.</p>" +
        "</div>" +
        '<div class="footer-col"><h3>Explore</h3>' +
          '<a href="events.html">All events</a>' +
          '<a href="events.html?cat=Hackathon">Hackathons</a>' +
          '<a href="events.html?cat=Cultural">Cultural programs</a>' +
          '<a href="events.html?cat=Welfare">Social welfare</a>' +
        "</div>" +
        '<div class="footer-col"><h3>For organisers</h3>' +
          '<a href="create.html">Create an event</a>' +
          '<a href="my-events.html">My events</a>' +
          '<a href="index.html#how-it-works">How it works</a>' +
        "</div>" +
        '<div class="footer-col"><h3>Account</h3>' +
          '<a href="login.html?mode=signup">Sign up</a>' +
          '<a href="login.html">Log in</a>' +
        "</div>" +
      "</div>" +
      '<div class="container footer-bottom">' +
        "© " + new Date().getFullYear() + " Happening. Happening lists events and does not sell tickets. Contact organisers directly to join." +
      "</div>";
  }

  /* Events (clicks) ------------------------------------------------------ */

  function handleClick(event) {
    var button = event.target.closest("[data-action]");
    var panel = document.getElementById("notif-panel");

    // Clicking anywhere outside the reminders panel closes it.
    if (panel && !panel.contains(event.target) && !(button && button.dataset.action === "bell")) {
      panel.remove();
      var bell = document.querySelector('[data-action="bell"]');
      if (bell) {
        bell.setAttribute("aria-expanded", "false");
      }
    }

    if (!button) {
      return;
    }

    switch (button.dataset.action) {
      case "menu":
        var nav = document.getElementById("site-nav");
        var open = nav.classList.toggle("is-open");
        button.setAttribute("aria-expanded", String(open));
        break;

      case "bell":
        toggleRemindersPanel(button);
        break;

      case "logout":
        H.auth.logOut();
        window.location.href = "index.html";
        break;
    }
  }

  /* Start ---------------------------------------------------------------- */

  function init() {
    var currentPage = document.body.dataset.page || "";
    renderHeader(currentPage);
    renderFooter();
    document.addEventListener("click", handleClick);
  }

  H.refreshHeader = function () {
    renderHeader(document.body.dataset.page || "");
  };

  init();
})((window.Happening = window.Happening || {}));
