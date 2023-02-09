const benPicture = document.querySelector("img.ben");

const backendIp = "http://23.94.194.157:8000"

const timer = document.querySelector(".time")
const globalTimer = document.querySelector(".globalTime")
const counter = document.querySelector(".count")
const globalCounter = document.querySelector(".globalCount")

let pressAudio = new Audio("ben/assets/grab.mp3")
let releaseAudio = new Audio("ben/assets/release.mp3")
pressAudio.volume = .15
releaseAudio.volume = .15

function count(clicked) {
  let clicks = localStorage.getItem("clicks")
  let clicksToSendToServer = localStorage.getItem("clicksToSendToServer")
  if (clicks == null) {
    clicks = 0
  }
  if (clicked) {
    clicks++
  }
  if (clicksToSendToServer == null) {
    clicksToSendToServer = 0
  }
  if (clicksToSendToServer) {
    clicksToSendToServer++
  }
  counter.innerText = `you have clicked ben ${clicks} times :)`
  localStorage.setItem("clicks", clicks)
  localStorage.setItem("clicksToSendToServer", clicksToSendToServer)
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
  benPicture.classList.add("press")
  count(true)
  document.title = "ben"
}

function release(e) {
  e.preventDefault()
  play(releaseAudio)
  benPicture.classList.remove("press")
}

async function observing(real) {
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

  await syncWithServer()
}

async function syncWithServer() {
  let clicksToSendToServer = localStorage.getItem("clicksToSendToServer")
  localStorage.setItem("clicksToSendToServer", 0)

  data = await sendAndReceiveCounts(clicksToSendToServer)

  console.log(data)
  let globalClicks = data["click_count"]
  let globalSecs = data["observation_time"]

  globalCounter.innerText = `everyone has clicked ben ${globalClicks} times >:)`
  globalTimer.innerText = `everyone has observed ben for ${globalSecs} seconds`

}

async function sendAndReceiveCounts(clicksToSend) {
  return fetch(backendIp + "/totals?click_count=" + clicksToSend)
    .then(async (response) => {
      let responseText = await response.text()
      console.log(responseText)
      return JSON.parse(responseText)
    })
}

observing(false)

setInterval(() => observing(true), 1000)

benPicture.addEventListener("touchstart", press)
benPicture.addEventListener("touchend", release)

benPicture.addEventListener("mousedown", press)
benPicture.addEventListener("mouseup", release)

timer.addEventListener("click", e => {
  localStorage.removeItem("secs")
  timer.innerText = ""
})

counter.addEventListener("click", e => {
  localStorage.removeItem("clicks")
  counter.innerText = ""
})