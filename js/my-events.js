/* ==========================================================================
   my-events.js
   Organiser page listing the events they have created, with a delete button.
   ========================================================================== */

(function (H) {
  "use strict";

  var gate = document.getElementById("gate");
  var content = document.getElementById("content");
  var list = document.getElementById("my-events");
  var banner = document.getElementById("published-banner");

  /** Id of the event waiting for a second click to confirm deletion. */
  var pendingDeleteId = "";

  function render() {
    var events = H.events.mine();

    if (!events.length) {
      list.innerHTML = H.emptyState(
        "You have not listed anything yet",
        "Create your first event and people nearby will see it.",
        '<a class="btn btn-primary" href="create.html">Create event</a>'
      );
      return;
    }

    list.innerHTML = events
      .map(function (event) {
        var confirming = pendingDeleteId === event.id;
        return (
          '<div class="event-with-actions">' +
            H.eventCard(event) +
            '<div class="event-actions">' +
              '<a class="btn" href="event.html?id=' + encodeURIComponent(event.id) + '">View</a>' +
              '<button class="btn btn-danger" type="button" data-delete="' + H.esc(event.id) + '">' +
                (confirming ? "Click again to delete" : "Delete") +
              "</button>" +
            "</div>" +
          "</div>"
        );
      })
      .join("");
  }

  list.addEventListener("click", function (click) {
    var button = click.target.closest("[data-delete]");
    if (!button) {
      return;
    }

    var id = button.dataset.delete;
    if (pendingDeleteId === id) {
      H.events.remove(id);
      pendingDeleteId = "";
      H.toast("Event deleted");
    } else {
      pendingDeleteId = id;
    }
    render();
  });

  if (H.auth.isOrganiser()) {
    gate.hidden = true;
    content.hidden = false;
    banner.hidden = H.param("published") !== "1";
    render();
  }
})((window.Happening = window.Happening || {}));
