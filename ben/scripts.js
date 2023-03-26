"use strict";

const benPicture = document.querySelector("img.ben");
const backendIp = "https://veliebm.pythonanywhere.com";
const timer = document.querySelector(".time");
const globalTimer = document.querySelector(".globalTime");
const counter = document.querySelector(".count");
const globalCounter = document.querySelector(".globalCount");
const pressAudio = new Audio("ben/assets/grab.mp3");
const releaseAudio = new Audio("ben/assets/release.mp3");
let audioCount = 0;
const maxAudios = 8;

const count = (clicked) => {
  let clicks = localStorage.getItem("clicks") || 0;
  let clicksToSendToServer = localStorage.getItem("clicksToSendToServer") || 0;
  if (clicked) {
    clicks++;
    clicksToSendToServer++;
  }
  counter.innerText = `you have clicked ben ${clicks} times :)`;
  localStorage.setItem("clicks", clicks);
  localStorage.setItem("clicksToSendToServer", clicksToSendToServer);
};

const play = (audio) => {
  if (audioCount < maxAudios) {
    audioCount++;
    const tmp = audio.cloneNode();
    tmp.addEventListener('ended', () => { audioCount--; });
    tmp.volume = 0.1;
    tmp.play();
  }
};

const press = (e) => {
  e.preventDefault();
  play(pressAudio);
  benPicture.classList.add("press");
  count(true);
  document.title = "ben";
};

const release = (e) => {
  e.preventDefault();
  play(releaseAudio);
  benPicture.classList.remove("press");
};

const observing = async (real) => {
  let secs = localStorage.getItem("secs") || 0;
  if (document.hasFocus()) {
    if (real) secs++;
    timer.innerText = `you have observed ben for ${secs} seconds`;
  }
  localStorage.setItem("secs", secs);
  await syncWithServer();
};

const syncWithServer = async () => {
  let clicksToSendToServer = localStorage.getItem("clicksToSendToServer") || 0;
  localStorage.setItem("clicksToSendToServer", 0);
  const data = await sendAndReceiveCounts(clicksToSendToServer);
  console.log(data);
  const globalClicks = data["click_count"];
  const globalSecs = data["observation_time"];
  globalCounter.innerText = `everyone has clicked ben ${globalClicks} times >:)`;
  globalTimer.innerText = `everyone has observed ben for ${globalSecs} seconds`;
};

const sendAndReceiveCounts = async (clicksToSend) => {
  const response = await fetch(`${backendIp}/totals?click_count=${clicksToSend}`);
  const responseText = await response.text();
  console.log(responseText);
  return JSON.parse(responseText);
};

count(false);
setInterval(() => observing(true), 1000);
benPicture.addEventListener("touchstart", press);
benPicture.addEventListener("touchend", release);
benPicture.addEventListener("mousedown", press);
benPicture.addEventListener("mouseup", release);
timer.addEventListener("click", () => {
  localStorage.removeItem("secs");
  timer.innerText = "";
});
counter.addEventListener("click", () => {
  localStorage.removeItem("clicks");
  counter.innerText = "";
});