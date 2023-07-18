// Pings backend to check if it's feeling OK.

function ping_backend() {
  fetch('https://veliebm.pythonanywhere.com/ping')
    .then(response => {
      if (response.ok) {
        update_text("backend says hi")
      } else {
        update_text("backend is shy")
      }
    })
}

function update_text(message) {
  let textContainer = document.getElementById("textContainer")
  let newText = document.createElement("div")
  newText.innerText = message
  textContainer.appendChild(newText)
}

let button = document.getElementById("button");
button.addEventListener("click", ping_backend);
console.log("Script loaded.")
