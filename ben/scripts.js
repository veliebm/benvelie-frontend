const ben = document.querySelector("img.ben");

const timer = document.querySelector(".time")
const counter = document.querySelector(".count")
const discord = document.querySelector(".discord")

let pressAudio = new Audio("ben/assets/grab.mp3")
let releaseAudio = new Audio("ben/assets/release.mp3")
pressAudio.volume = .15
releaseAudio.volume = .15

function count(clicked) {
  let clicks = localStorage.getItem("clicks")
  if (clicks == null) {
    clicks = 0
  }
  if (clicked) {
    clicks++
  }
  counter.innerText = `you have clicked ben ${clicks} times :)`
  localStorage.setItem("clicks", clicks)
}

count(false)

let audioCount = 0
const maxAudios = 8

function play(audio) {
  if (audioCount < maxAudios) {
    audioCount++
    let tmp = audio.cloneNode();
    tmp.addEventListener('ended', e => { audioCount-- })
    tmp.volume = 0.1
    tmp.play()
  }
}

function press(e) {
  e.preventDefault()
  play(pressAudio)
  ben.classList.add("press")
  count(true)
  document.title = "ben"
}

function release(e) {
  e.preventDefault()
  play(releaseAudio)
  ben.classList.remove("press")
}

function observing(real) {
  let secs = localStorage.getItem("secs")

  if (secs == null) {
    secs = 0
  }
  if (document.hasFocus()) {
    if (real)
      secs++
    timer.innerText = `you have observed ben for ${secs} seconds`
  }
  localStorage.setItem("secs", secs)
}

observing(false)

setInterval(() => observing(true), 1000)

ben.addEventListener("touchstart", press)
ben.addEventListener("touchend", release)

ben.addEventListener("mousedown", press)
ben.addEventListener("mouseup", release)

timer.addEventListener("click", e => {
  localStorage.removeItem("secs")
  timer.innerText = ""
})

counter.addEventListener("click", e => {
  localStorage.removeItem("clicks")
  counter.innerText = ""
})