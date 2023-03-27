"use strict";

const benPicture = document.querySelector("img.ben") as HTMLImageElement;
const backendIp = "https://veliebm.pythonanywhere.com";
const timer = document.querySelector(".time") as HTMLDivElement;
const globalTimer = document.querySelector(".globalTime") as HTMLDivElement;
const counter = document.querySelector(".count") as HTMLDivElement;
const globalCounter = document.querySelector(".globalCount") as HTMLDivElement;
const pressAudio = new Audio("ben/assets/grab.mp3");
const releaseAudio = new Audio("ben/assets/release.mp3");
const maxAudios = 8;
let audioCount = 0;

const count = (clicked: boolean): void => {
  let clicks = localStorage.getItem("clicks") || "0";
  let clicksToSendToServer = localStorage.getItem("clicksToSendToServer") || "0";
  if (clicked) {
    clicks = (parseInt(clicks) + 1).toString();
    clicksToSendToServer = (parseInt(clicksToSendToServer) + 1).toString();
  }
  counter.innerText = `you have clicked ben ${clicks} times :)`;
  localStorage.setItem("clicks", clicks);
  localStorage.setItem("clicksToSendToServer", clicksToSendToServer);
};

const play = (audio: HTMLAudioElement): void => {
  if (audioCount < maxAudios) {
    audioCount++;
    const tmp = audio.cloneNode() as HTMLAudioElement;
    tmp.addEventListener("ended", () => {
      audioCount--;
    });
    tmp.volume = 0.1;
    tmp.play();
  }
};

const press = (e: Event): void => {
  e.preventDefault();
  play(pressAudio);
  benPicture.classList.add("press");
  count(true);
  document.title = "ben";
};

const release = (e: Event): void => {
  e.preventDefault();
  play(releaseAudio);
  benPicture.classList.remove("press");
};

const observing = async (): Promise<void> => {
  let secs = localStorage.getItem("secs") || "0";
  if (document.hasFocus()) {
    secs = (parseInt(secs) + 1).toString();
    timer.innerText = `you have observed ben for ${secs} seconds`;
  }
  localStorage.setItem("secs", secs);
  await syncWithServer();
};

const syncWithServer = async (): Promise<void> => {
  const clicksToSendToServer = localStorage.getItem("clicksToSendToServer") || "0";
  localStorage.setItem("clicksToSendToServer", "0");
  const globalData = await sendAndReceiveCounts(parseInt(clicksToSendToServer));
  console.log(globalData);
  globalCounter.innerText = `everyone has clicked ben ${globalData["click_count"]} times >:)`;
  globalTimer.innerText = `everyone has observed ben for ${globalData["observation_time"]} seconds`;
};

const sendAndReceiveCounts = async (clicksToSend: number): Promise<any> => {
  const response = await fetch(`${backendIp}/totals?click_count=${clicksToSend}`);
  const responseText = await response.text();
  console.log(responseText);
  return JSON.parse(responseText);
};

count(false);
setInterval(() => observing(), 1000);
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
