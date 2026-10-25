/* ==========================================================================
   components.js
   HTML builders shared by several pages: icons, event card, empty state.
   ========================================================================== */

(function (H) {
  "use strict";

  /* Icons (inline SVG, they inherit the text colour) --------------------- */

  H.icons = {
    search:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    bell:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 21h4"/></svg>',
    star:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2 3 6.5 7 .8-5.2 4.8 1.4 7L12 17.6 5.8 21l1.4-7L2 9.3l7-.8z"/></svg>',
    spark:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2c1 5 4 8 9 10-5 2-8 5-9 10-1-5-4-8-9-10 5-2 8-5 9-10z"/></svg>',
    share:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4m0-11-6.8 4"/></svg>',
    pin:
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    users:
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.5 3-6 6.5-6s6.5 2.500 6.500 6"/><path d="M16 4.500a3.500 3.500 0 0 1 0 7"/><path d="M18 14.500c2 .8 3.500 2.700 3.500 5.500"/></svg>',
    megaphone:
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11v3a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z"/><path d="M15.500 8.500a5 5 0 0 1 0 7"/><path d="M18.500 5.500a9 9 0 0 1 0 13"/></svg>'
  };

  /* Event card ----------------------------------------------------------- */

  /** A clickable card that links to event.html. */
  H.eventCard = function (event) {
    var feeClass = event.fee ? "pill-paid" : "pill-free";

    return (
      '<a class="event-card" href="event.html?id=' + encodeURIComponent(event.id) + '">' +
        '<div class="event-cover" style="background-image:' + H.coverBackground(event) + '">' +
          '<div class="date-stub">' +
            "<strong>" + new Date(event.start).getDate() + "</strong>" +
            "<span>" + H.fmt.month(event.start) + "</span>" +
          "</div>" +
          '<span class="category-tag">' + H.esc(event.category) + "</span>" +
        "</div>" +
        '<div class="event-body">' +
          "<h3>" + H.esc(event.title) + "</h3>" +
          '<div class="event-meta">' + H.fmt.day(event.start) + " · " + H.fmt.time(event.start) + "</div>" +
          '<div class="event-meta">' + H.esc(event.area) + ", " + H.esc(event.city) + "</div>" +
          '<div class="event-foot">' +
            '<span class="pill ' + feeClass + '">' + H.fmt.fee(event) + "</span>" +
            '<span class="event-meta">' + H.interestedCount(event) + " interested</span>" +
          "</div>" +
        "</div>" +
      "</a>"
    );
  };

  /** Dashed box shown when a list has nothing in it. */
  H.emptyState = function (title, text, buttonHtml) {
    return (
      '<div class="empty-state"><strong>' + H.esc(title) + "</strong>" +
      H.esc(text) +
      (buttonHtml ? "<br>" + buttonHtml : "") +
      "</div>"
    );
  };
})((window.Happening = window.Happening || {}));
