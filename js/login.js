/* ==========================================================================
   login.js
   Sign up and log in page. Open it with ?mode=signup and/or ?role=organiser
   to start on the right tab.

   Demo only: accounts are stored in this browser, not on a server.
   ========================================================================== */

(function (H) {
  "use strict";

  var form = document.getElementById("auth-form");
  var title = document.getElementById("auth-title");
  var submit = document.getElementById("auth-submit");
  var errorBox = document.getElementById("auth-error");
  var signupOnly = document.querySelectorAll("[data-signup-only]");
  var tabs = document.querySelectorAll("[data-mode]");

  var mode = H.param("mode") === "signup" || H.param("role") ? "signup" : "login";

  /* Where to go after signing in */
  function destinationFor(user) {
    return user.role === "organiser" ? "create.html" : "events.html";
  }

  /* Rendering ------------------------------------------------------------ */

  function renderMode() {
    var isSignup = mode === "signup";

    title.textContent = isSignup ? "Create your account" : "Welcome back";
    submit.textContent = isSignup ? "Sign up" : "Log in";
    errorBox.textContent = "";

    signupOnly.forEach(function (node) {
      node.hidden = !isSignup;
    });
    document.getElementById("name").required = isSignup;
    document.getElementById("password").autocomplete = isSignup ? "new-password" : "current-password";

    tabs.forEach(function (tab) {
      tab.setAttribute("aria-selected", String(tab.dataset.mode === mode));
    });
  }

  function preselectRole() {
    var role = H.param("role") === "organiser" ? "organiser" : "user";
    document.querySelector('input[name="role"][value="' + role + '"]').checked = true;
  }

  /* Events --------------------------------------------------------------- */

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      mode = tab.dataset.mode;
      renderMode();
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    errorBox.textContent = "";

    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    if (password.length < 6) {
      errorBox.textContent = "Use a password with at least 6 characters.";
      return;
    }

    var request;
    if (mode === "signup") {
      request = H.auth.signUp({
        name: document.getElementById("name").value,
        email: email,
        password: password,
        role: form.elements.role.value
      });
    } else {
      request = H.auth.logIn(email, password);
    }

    submit.disabled = true;
    request.then(function (result) {
      submit.disabled = false;
      if (!result.ok) {
        errorBox.textContent = result.error;
        return;
      }
      window.location.href = destinationFor(result.user);
    });
  });

  /* Start ---------------------------------------------------------------- */

  var existing = H.auth.current();
  if (existing) {
    window.location.href = destinationFor(existing);
  } else {
    preselectRole();
    renderMode();
  }
})((window.Happening = window.Happening || {}));
