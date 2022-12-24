// Script to make and break misfortune cookies.

const FORTUNES = [
  "Abandon all hope immediately.",
  "Misfortune favors you a whole lot.",
  "By the time you're reading this, it's already too late.",
  "Jealousy doesn't open doors. It closes them. And it looks like all your doors are closed.",
  "You're going to get so much money - and then immediately lose it.",
  "A dream you will have will come true. Which dream? I dunno. Also, I meant nightmare."
];

let cookie_broken = false;

document.onkeydown = function (e) {
  e = e || window.event;
  if (e.key == " ") {
    if (!cookie_broken) {
      document.getElementById("cookie").classList.add("shake");
    }
  }
};

document.onkeyup = function (e) {
  e = e || window.event;
  if (e.key == " ") {
    if (!cookie_broken) {
      break_cookie();
    } else {
      get_new_cookie();
    }
  }
};

// Deletes unbroken cookie and replaces it with broken cookie.
function break_cookie() {
  document.getElementById("cookie").classList.remove("shake");
  document.getElementById("cookie").classList.add("invisible");
  cookie_broken = true;
  document.getElementById("broken cookie").classList.remove("invisible");
  document.getElementById("misfortune").textContent = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
  document.getElementById("message to user").textContent = "Your misfortune has been granted.";
}

// Deletes broken cookie and replaces it with new cookie.
function get_new_cookie() {
  document.getElementById("broken cookie").classList.add("invisible");
  document.getElementById("cookie").classList.remove("invisible");
  cookie_broken = false;
  document.getElementById("message to user").textContent = "Press the spacebar to break me open.";
}
