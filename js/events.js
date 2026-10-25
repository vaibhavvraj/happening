/* ==========================================================================
   events.js
   Browse page: search, filters (city, date, price, category) and results.
   The page can be opened with ?cat=, ?city= or ?q= to start filtered.
   ========================================================================== */

(function (H) {
  "use strict";

  var DATE_OPTIONS = [
    ["any", "Any time"],
    ["today", "Today"],
    ["tomorrow", "Tomorrow"],
    ["week", "This week"],
    ["weekend", "This weekend"],
    ["month", "Next 30 days"]
  ];

  var PRICE_OPTIONS = [
    ["all", "All"],
    ["free", "Free"],
    ["paid", "Paid"]
  ];

  /* Current filter choices, seeded from the URL */
  var filters = {
    city: H.CITIES.indexOf(H.param("city")) >= 0 ? H.param("city") : "all",
    category: H.CATEGORIES[H.param("cat")] ? H.param("cat") : "all",
    when: "any",
    price: "all",
    query: H.param("q")
  };

  /* Filtering ------------------------------------------------------------ */

  function matchesDate(event) {
    var days = Math.floor((event.start - H.TODAY) / H.DAY);
    var weekday = new Date(event.start).getDay();

    switch (filters.when) {
      case "today":
        return days === 0;
      case "tomorrow":
        return days === 1;
      case "week":
        return days <= 6;
      case "weekend":
        return (weekday === 0 || weekday === 6) && days <= 7;
      case "month":
        return days <= 30;
      default:
        return true;
    }
  }

  function matchesSearch(event) {
    if (!filters.query) {
      return true;
    }
    var haystack = [event.title, event.description, event.area, event.city, event.venue, event.category]
      .join(" ")
      .toLowerCase();

    return filters.query
      .toLowerCase()
      .split(/\s+/)
      .every(function (word) {
        return !word || haystack.indexOf(word) >= 0;
      });
  }

  function matches(event) {
    if (filters.city !== "all" && event.city !== filters.city) {
      return false;
    }
    if (filters.category !== "all" && event.category !== filters.category) {
      return false;
    }
    if (filters.price === "free" && event.fee > 0) {
      return false;
    }
    if (filters.price === "paid" && !(event.fee > 0)) {
      return false;
    }
    return matchesDate(event) && matchesSearch(event);
  }

  /* Rendering ------------------------------------------------------------ */

  function optionsHtml(options, selected) {
    return options
      .map(function (option) {
        var isSelected = option[0] === selected ? " selected" : "";
        return '<option value="' + option[0] + '"' + isSelected + ">" + option[1] + "</option>";
      })
      .join("");
  }

  function renderControls() {
    var cityOptions = [["all", "All cities"]].concat(
      H.CITIES.map(function (city) {
        return [city, city];
      })
    );
    document.getElementById("city").innerHTML = optionsHtml(cityOptions, filters.city);
    document.getElementById("when").innerHTML = optionsHtml(DATE_OPTIONS, filters.when);
    document.getElementById("q").value = filters.query;
    renderPriceButtons();
    renderCategoryChips();
  }

  function renderPriceButtons() {
    document.getElementById("price").innerHTML = PRICE_OPTIONS.map(function (option) {
      var pressed = filters.price === option[0];
      return '<button type="button" data-price="' + option[0] + '" aria-pressed="' + pressed + '">' + option[1] + "</button>";
    }).join("");
  }

  function renderCategoryChips() {
    var names = ["all"].concat(Object.keys(H.CATEGORIES));
    document.getElementById("categories").innerHTML = names
      .map(function (name) {
        var label = name === "all" ? "Everything" : name;
        var pressed = filters.category === name;
        return '<button class="chip" type="button" data-category="' + H.esc(name) + '" aria-pressed="' + pressed + '">' + H.esc(label) + "</button>";
      })
      .join("");
  }

  function renderResults() {
    var results = H.events.upcoming().filter(matches);
    var place = filters.city !== "all" ? " in " + filters.city : "";

    document.getElementById("count").textContent =
      results.length + " event" + (results.length === 1 ? "" : "s") + place;

    document.getElementById("results").innerHTML = results.length
      ? results.map(H.eventCard).join("")
      : H.emptyState("Nothing matches yet", "Try another date or city, or clear the search.");
  }

  /* Events --------------------------------------------------------------- */

  document.getElementById("q").addEventListener("input", function (event) {
    filters.query = event.target.value.trim();
    renderResults();
  });

  document.getElementById("city").addEventListener("change", function (event) {
    filters.city = event.target.value;
    renderResults();
  });

  document.getElementById("when").addEventListener("change", function (event) {
    filters.when = event.target.value;
    renderResults();
  });

  document.getElementById("price").addEventListener("click", function (event) {
    var button = event.target.closest("[data-price]");
    if (button) {
      filters.price = button.dataset.price;
      renderPriceButtons();
      renderResults();
    }
  });

  document.getElementById("categories").addEventListener("click", function (event) {
    var button = event.target.closest("[data-category]");
    if (button) {
      filters.category = button.dataset.category;
      renderCategoryChips();
      renderResults();
    }
  });

  renderControls();
  renderResults();
})((window.Happening = window.Happening || {}));
