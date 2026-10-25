/* ==========================================================================
   helpers.js
   Small shared utilities: escaping, date and fee formatting, URL params,
   toast messages and copy to clipboard.
   ========================================================================== */

(function (H) {
  "use strict";

  /** Escape text before putting it inside an HTML string. */
  H.esc = function (value) {
    var map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
      return map[char];
    });
  };

  /** Read one query-string value, e.g. ?city=Patna. */
  H.param = function (name) {
    return new URLSearchParams(window.location.search).get(name) || "";
  };

  /* Formatting ----------------------------------------------------------- */

  H.fmt = {
    day: function (timestamp) {
      return new Date(timestamp).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short"
      });
    },

    time: function (timestamp) {
      return new Date(timestamp)
        .toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true })
        .replace(" am", " AM")
        .replace(" pm", " PM");
    },

    month: function (timestamp) {
      return new Date(timestamp).toLocaleDateString("en-IN", { month: "short" });
    },

    fee: function (event) {
      return event.fee ? "₹" + event.fee : "Free";
    },

    /** "Starts in 5 hr" or "In 3 days". */
    countdown: function (event) {
      var ms = event.start - Date.now();
      if (ms < 0) {
        return "Started";
      }
      var hours = Math.round(ms / 3600000);
      if (hours < 24) {
        return "Starts in " + hours + " hr";
      }
      var days = Math.round(ms / H.DAY);
      return "In " + days + " day" + (days > 1 ? "s" : "");
    },

    reminder: function (when) {
      return when === "2h" ? "2 hours before" : "1 day before";
    }
  };

  /** Number of people interested, including this visitor's own tap. */
  H.interestedCount = function (event) {
    return event.interested + (H.prefs.isInterested(event.id) ? 1 : 0);
  };

  H.vibeCount = function (event) {
    return event.vibes + (H.prefs.hasVibe(event.id) ? 1 : 0);
  };

  /** CSS background for an event cover: first photo, or the category gradient. */
  H.coverBackground = function (event, photoIndex) {
    var photos = event.photos || [];
    if (photos.length) {
      return "url(" + photos[Math.min(photoIndex || 0, photos.length - 1)] + ")";
    }
    var category = H.CATEGORIES[event.category] || H.CATEGORIES["Social meetup"];
    return category.gradient;
  };

  /* Feedback ------------------------------------------------------------- */

  H.toast = function (message) {
    var node = document.createElement("div");
    node.className = "toast";
    node.setAttribute("role", "status");
    node.textContent = message;
    document.body.appendChild(node);
    setTimeout(function () {
      node.remove();
    }, 2400);
  };

  /** Copy text to the clipboard. Resolves to true or false. */
  H.copyText = function (text) {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      return Promise.resolve(false);
    }
    return navigator.clipboard.writeText(text).then(
      function () {
        return true;
      },
      function () {
        return false;
      }
    );
  };
})((window.Happening = window.Happening || {}));
