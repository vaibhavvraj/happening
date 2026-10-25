/* ==========================================================================
   event.js
   Event detail page (event.html?id=...): photos, facts, interested, good
   vibes, share, reminder, contact and more events in the same city.
   ========================================================================== */

(function (H) {
  "use strict";

  var root = document.getElementById("event-root");
  var event = H.events.find(H.param("id"));
  var photoIndex = 0;
  var shareFallbackText = "";

  /* Rendering ------------------------------------------------------------ */

  function thumbsHtml() {
    var photos = event.photos || [];
    if (photos.length < 2) {
      return "";
    }
    return (
      '<div class="thumbs">' +
      photos
        .map(function (photo, index) {
          return (
            '<button type="button" data-photo="' + index + '" aria-label="Photo ' + (index + 1) + '" ' +
            'aria-current="' + (index === photoIndex) + '" style="background-image:url(' + photo + ')"></button>'
          );
        })
        .join("") +
      "</div>"
    );
  }

  function reminderOptionsHtml() {
    var current = H.prefs.reminder(event.id);
    return (
      '<option value="">No reminder</option>' +
      '<option value="1d"' + (current === "1d" ? " selected" : "") + ">1 day before</option>" +
      '<option value="2h"' + (current === "2h" ? " selected" : "") + ">2 hours before</option>"
    );
  }

  function moreEventsHtml() {
    var others = H.events.inCity(event.city, event.id).slice(0, 6);
    var body = others.length
      ? '<div class="card-grid">' + others.map(H.eventCard).join("") + "</div>"
      : H.emptyState("This is the only event in " + event.city + " right now", "Check back soon.");

    return '<section class="more-events"><h2>More events in ' + H.esc(event.city) + "</h2>" + body + "</section>";
  }

  function render() {
    if (!event) {
      root.innerHTML = H.emptyState(
        "We could not find that event",
        "It may have been removed.",
        '<a class="btn btn-primary" href="events.html">Browse events</a>'
      );
      return;
    }

    document.title = event.title + " | Happening";

    var interested = H.prefs.isInterested(event.id);
    var vibe = H.prefs.hasVibe(event.id);
    var feeClass = event.fee ? "pill-paid" : "pill-free";

    root.innerHTML =
      '<a class="btn back-link" href="events.html">← All events</a>' +
      '<div class="detail-layout">' +
        "<div>" +
          '<div class="detail-image" style="background-image:' + H.coverBackground(event, photoIndex) + '">' +
            '<div class="date-stub"><strong>' + new Date(event.start).getDate() + "</strong><span>" + H.fmt.month(event.start) + "</span></div>" +
            '<span class="category-tag">' + H.esc(event.category) + "</span>" +
          "</div>" +
          thumbsHtml() +
          '<div class="detail-about"><h2>About this event</h2>' +
            '<p class="detail-description">' + H.esc(event.description) + "</p></div>" +
        "</div>" +
        '<aside class="panel detail-panel">' +
          "<h1>" + H.esc(event.title) + "</h1>" +
          '<ul class="facts">' +
            '<li><span class="label">When</span><span>' + H.fmt.day(event.start) + ", " + H.fmt.time(event.start) + "</span></li>" +
            '<li><span class="label">Where</span><span>' + H.esc(event.venue) + ", " + H.esc(event.area) + ", " + H.esc(event.city) + "</span></li>" +
            '<li><span class="label">Fee</span><span><span class="pill ' + feeClass + '">' + H.fmt.fee(event) + "</span>" +
              (event.fee ? ' <span class="hint">pay the organiser directly</span>' : "") + "</span></li>" +
            '<li><span class="label">By</span><span>' + H.esc(event.organiser.name) + "</span></li>" +
          "</ul>" +
          '<div class="action-row">' +
            '<button class="btn' + (interested ? " is-on" : "") + '" type="button" data-action="interested" aria-pressed="' + interested + '">' +
              H.icons.star + (interested ? "Interested" : "I am interested") + " · " + H.interestedCount(event) + "</button>" +
            '<button class="btn btn-vibe' + (vibe ? " is-on" : "") + '" type="button" data-action="vibe" aria-pressed="' + vibe + '">' +
              H.icons.spark + "Good vibes · " + H.vibeCount(event) + "</button>" +
            '<button class="btn" type="button" data-action="share">' + H.icons.share + "Share</button>" +
          "</div>" +
          (shareFallbackText
            ? '<div class="field"><label for="share-text">Copy this and send it</label><input id="share-text" readonly value="' + H.esc(shareFallbackText) + '"></div>'
            : "") +
          '<div class="field"><label for="reminder">Reminder</label><select id="reminder">' + reminderOptionsHtml() + "</select></div>" +
          '<div class="contact-box"><strong>Get more info</strong>' +
            '<span class="muted">Contact ' + H.esc(event.organiser.name) + " directly.</span>" +
            "<span><code>" + H.esc(event.organiser.phone) + "</code></span>" +
            "<span><code>" + H.esc(event.organiser.email) + "</code></span>" +
          "</div>" +
          '<div class="note-box">Comments are coming soon, so you will be able to ask questions here.</div>' +
        "</aside>" +
      "</div>" +
      moreEventsHtml();

    var shareField = document.getElementById("share-text");
    if (shareField) {
      shareField.focus();
      shareField.select();
    }
  }

  /* Actions -------------------------------------------------------------- */

  function shareText() {
    return event.title + " · " + H.fmt.day(event.start) + ", " + H.fmt.time(event.start) +
      " · " + event.area + ", " + event.city + " (via Happening)";
  }

  function share() {
    var text = shareText();
    var link = window.location.href;

    if (navigator.share) {
      navigator.share({ title: event.title, text: text, url: link }).catch(function () {
        /* the visitor closed the share sheet */
      });
      return;
    }

    H.copyText(text + " " + link).then(function (copied) {
      if (copied) {
        shareFallbackText = "";
        H.toast("Details copied");
      } else {
        shareFallbackText = text + " " + link;
      }
      render();
    });
  }

  root.addEventListener("click", function (click) {
    var photoButton = click.target.closest("[data-photo]");
    if (photoButton) {
      photoIndex = Number(photoButton.dataset.photo);
      render();
      return;
    }

    var button = click.target.closest("[data-action]");
    if (!button) {
      return;
    }

    switch (button.dataset.action) {
      case "interested":
        if (H.prefs.toggleInterested(event.id)) {
          H.toast("Saved to your interests");
        }
        render();
        break;
      case "vibe":
        H.prefs.toggleVibe(event.id);
        render();
        break;
      case "share":
        share();
        break;
    }
  });

  root.addEventListener("change", function (change) {
    if (change.target.id !== "reminder") {
      return;
    }
    H.prefs.setReminder(event.id, change.target.value);
    if (change.target.value) {
      H.toast("Reminder set: " + H.fmt.reminder(change.target.value));
    }
    H.refreshHeader();
    render();
  });

  render();
})((window.Happening = window.Happening || {}));
