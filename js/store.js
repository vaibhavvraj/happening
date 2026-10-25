/* ==========================================================================
   store.js
   Everything that is saved in the visitor's browser (localStorage):
     H.prefs  - interested, good vibes and reminders
     H.events - events created by organisers, plus the sample events
     H.auth   - demo sign up, log in and log out

   This is a front-end prototype. Data lives only on the visitor's device.
   A real version would replace this file with calls to a backend.
   ========================================================================== */

(function (H) {
  "use strict";

  var KEYS = {
    prefs: "happening.prefs",
    events: "happening.events",
    users: "happening.users",
    session: "happening.session"
  };

  /* Safe localStorage access --------------------------------------------- */

  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  /* Preferences: interested, vibes, reminders ---------------------------- */

  function loadPrefs() {
    var prefs = read(KEYS.prefs, {});
    prefs.interested = prefs.interested || {};
    prefs.vibes = prefs.vibes || {};
    prefs.reminders = prefs.reminders || {};
    return prefs;
  }

  function toggleFlag(group, id) {
    var prefs = loadPrefs();
    if (prefs[group][id]) {
      delete prefs[group][id];
    } else {
      prefs[group][id] = 1;
    }
    write(KEYS.prefs, prefs);
    return Boolean(prefs[group][id]);
  }

  H.prefs = {
    isInterested: function (id) {
      return Boolean(loadPrefs().interested[id]);
    },
    toggleInterested: function (id) {
      return toggleFlag("interested", id);
    },
    hasVibe: function (id) {
      return Boolean(loadPrefs().vibes[id]);
    },
    toggleVibe: function (id) {
      return toggleFlag("vibes", id);
    },
    reminder: function (id) {
      return loadPrefs().reminders[id] || "";
    },
    setReminder: function (id, when) {
      var prefs = loadPrefs();
      if (when) {
        prefs.reminders[id] = when;
      } else {
        delete prefs.reminders[id];
      }
      write(KEYS.prefs, prefs);
    },
    reminderIds: function () {
      return Object.keys(loadPrefs().reminders);
    }
  };

  /* Events --------------------------------------------------------------- */

  function createdEvents() {
    return read(KEYS.events, []);
  }

  H.events = {
    /** Every event: organiser-created first, then the samples. */
    all: function () {
      return createdEvents().concat(H.SEED_EVENTS);
    },

    find: function (id) {
      return H.events.all().filter(function (event) {
        return event.id === id;
      })[0];
    },

    /** Events that have not finished yet, soonest first. */
    upcoming: function () {
      var cutoff = Date.now() - 2 * 3600000;
      return H.events
        .all()
        .filter(function (event) {
          return event.start >= cutoff;
        })
        .sort(function (a, b) {
          return a.start - b.start;
        });
    },

    inCity: function (city, exceptId) {
      return H.events.upcoming().filter(function (event) {
        return event.city === city && event.id !== exceptId;
      });
    },

    /** Events created by the logged-in organiser. */
    mine: function () {
      var user = H.auth.current();
      if (!user) {
        return [];
      }
      return createdEvents()
        .filter(function (event) {
          return event.ownerEmail === user.email;
        })
        .sort(function (a, b) {
          return a.start - b.start;
        });
    },

    /** Returns false when the browser has no room left to save it. */
    add: function (event) {
      var list = createdEvents();
      list.unshift(event);
      return write(KEYS.events, list);
    },

    remove: function (id) {
      var list = createdEvents().filter(function (event) {
        return event.id !== id;
      });
      write(KEYS.events, list);
    }
  };

  /* Demo accounts -------------------------------------------------------- */

  function randomSalt() {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  /** SHA-256 of salt + password, as a hex string. */
  function hashPassword(password, salt) {
    if (!window.crypto || !window.crypto.subtle) {
      return Promise.reject(new Error("unsupported"));
    }
    var bytes = new TextEncoder().encode(salt + ":" + password);
    return window.crypto.subtle.digest("SHA-256", bytes).then(function (buffer) {
      return Array.prototype.map
        .call(new Uint8Array(buffer), function (byte) {
          return byte.toString(16).padStart(2, "0");
        })
        .join("");
    });
  }

  function publicUser(user) {
    return { name: user.name, email: user.email, role: user.role, city: user.city };
  }

  function unsupportedResult() {
    return { ok: false, error: "This browser cannot protect passwords here. Open the site over https." };
  }

  H.auth = {
    /** The logged-in user, or null. */
    current: function () {
      var email = read(KEYS.session, null);
      if (!email) {
        return null;
      }
      var match = read(KEYS.users, []).filter(function (user) {
        return user.email === email;
      })[0];
      return match ? publicUser(match) : null;
    },

    isOrganiser: function () {
      var user = H.auth.current();
      return Boolean(user && user.role === "organiser");
    },

    signUp: function (details) {
      var email = details.email.trim().toLowerCase();
      var users = read(KEYS.users, []);

      var taken = users.some(function (user) {
        return user.email === email;
      });
      if (taken) {
        return Promise.resolve({ ok: false, error: "An account with this email already exists. Try logging in." });
      }

      var salt = randomSalt();
      return hashPassword(details.password, salt).then(function (hash) {
        var user = {
          name: details.name.trim(),
          email: email,
          role: details.role,
          city: details.city,
          salt: salt,
          hash: hash
        };
        users.push(user);
        write(KEYS.users, users);
        write(KEYS.session, email);
        return { ok: true, user: publicUser(user) };
      }, unsupportedResult);
    },

    logIn: function (emailInput, password) {
      var email = emailInput.trim().toLowerCase();
      var user = read(KEYS.users, []).filter(function (item) {
        return item.email === email;
      })[0];

      var failure = { ok: false, error: "Email or password is not right." };
      if (!user) {
        return Promise.resolve(failure);
      }

      return hashPassword(password, user.salt).then(function (hash) {
        if (hash !== user.hash) {
          return failure;
        }
        write(KEYS.session, email);
        return { ok: true, user: publicUser(user) };
      }, unsupportedResult);
    },

    logOut: function () {
      try {
        localStorage.removeItem(KEYS.session);
      } catch (error) {
        /* nothing to clear */
      }
    }
  };
})((window.Happening = window.Happening || {}));
