/* ==========================================================================
   create.js
   Create event page (organisers only): validates the form, shrinks photos
   and saves the event.
   ========================================================================== */

(function (H) {
  "use strict";

  var MAX_PHOTOS = 4;
  var MAX_PHOTO_SIZE = 900; // longest side in pixels

  var gate = document.getElementById("gate");
  var formArea = document.getElementById("form-area");
  var form = document.getElementById("event-form");
  var errorBox = document.getElementById("form-error");
  var previews = document.getElementById("photo-previews");

  var photos = [];

  /* Helpers -------------------------------------------------------------- */

  function field(id) {
    return document.getElementById(id);
  }

  function value(id) {
    return field(id).value.trim();
  }

  function isoDate(timestamp) {
    var date = new Date(timestamp);
    var month = String(date.getMonth() + 1).padStart(2, "0");
    var day = String(date.getDate()).padStart(2, "0");
    return date.getFullYear() + "-" + month + "-" + day;
  }

  function showError(message) {
    errorBox.textContent = message;
  }

  /** Scale an image down and return it as a small JPEG data URL. */
  function shrinkImage(file, done) {
    var reader = new FileReader();

    reader.onload = function () {
      var image = new Image();

      image.onload = function () {
        var scale = Math.min(1, MAX_PHOTO_SIZE / Math.max(image.width, image.height));
        var canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
        done(canvas.toDataURL("image/jpeg", 0.8));
      };

      image.onerror = function () {
        done(null);
      };
      image.src = reader.result;
    };

    reader.readAsDataURL(file);
  }

  function renderPreviews() {
    previews.innerHTML = photos
      .map(function (photo) {
        return '<div style="background-image:url(' + photo + ')"></div>';
      })
      .join("");
  }

  /* Form setup ----------------------------------------------------------- */

  function fillSelects() {
    field("category").innerHTML = Object.keys(H.CATEGORIES)
      .map(function (name) {
        return "<option>" + H.esc(name) + "</option>";
      })
      .join("");

    field("city").innerHTML = H.CITIES.map(function (name) {
      return "<option>" + H.esc(name) + "</option>";
    }).join("");
  }

  function setDefaults() {
    var user = H.auth.current();
    field("date").min = isoDate(H.TODAY);
    field("date").value = isoDate(H.TODAY + H.DAY);
    field("organiser-name").value = user.name;
    field("email").value = user.email;
  }

  /* Events --------------------------------------------------------------- */

  field("photos").addEventListener("change", function (event) {
    var files = Array.prototype.slice.call(event.target.files, 0, MAX_PHOTOS);
    var results = [];
    var finished = 0;

    if (!files.length) {
      return;
    }

    files.forEach(function (file, index) {
      shrinkImage(file, function (dataUrl) {
        results[index] = dataUrl;
        finished += 1;
        if (finished === files.length) {
          photos = results.filter(Boolean);
          renderPreviews();
        }
      });
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    showError("");

    var required = [
      ["title", "a title"],
      ["area", "an area"],
      ["venue", "a venue"],
      ["description", "a description"],
      ["organiser-name", "the organiser name"]
    ];
    for (var i = 0; i < required.length; i += 1) {
      if (!value(required[i][0])) {
        showError("Please add " + required[i][1] + ".");
        field(required[i][0]).focus();
        return;
      }
    }

    if (!value("phone") && !value("email")) {
      showError("Add a phone number or an email so people can reach you.");
      return;
    }

    var dateParts = value("date").split("-");
    var timeParts = value("time").split(":");
    if (dateParts.length < 3 || timeParts.length < 2) {
      showError("Pick a date and a start time.");
      return;
    }

    var start = new Date(
      Number(dateParts[0]),
      Number(dateParts[1]) - 1,
      Number(dateParts[2]),
      Number(timeParts[0]),
      Number(timeParts[1])
    ).getTime();

    if (start < Date.now()) {
      showError("The start time has already passed. Pick a later time.");
      return;
    }

    var newEvent = {
      id: "m" + Date.now(),
      ownerEmail: H.auth.current().email,
      title: value("title"),
      category: value("category"),
      city: value("city"),
      area: value("area"),
      venue: value("venue"),
      start: start,
      fee: Math.max(0, parseInt(value("fee"), 10) || 0),
      interested: 0,
      vibes: 0,
      photos: photos,
      description: value("description"),
      organiser: {
        name: value("organiser-name"),
        phone: value("phone") || "Not shared",
        email: value("email") || "Not shared"
      }
    };

    if (!H.events.add(newEvent)) {
      // Photos can fill the browser's storage. Try again without them.
      newEvent.photos = [];
      if (!H.events.add(newEvent)) {
        showError("Your browser has no room left to save this event.");
        return;
      }
      H.toast("Saved without photos because storage is full");
    }

    window.location.href = "my-events.html?published=1";
  });

  /* Start ---------------------------------------------------------------- */

  if (H.auth.isOrganiser()) {
    gate.hidden = true;
    formArea.hidden = false;
    fillSelects();
    setDefaults();
  }
})((window.Happening = window.Happening || {}));
