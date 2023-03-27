"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const benPicture = document.querySelector("img.ben");
const backendIp = "https://veliebm.pythonanywhere.com";
const timer = document.querySelector(".time");
const globalTimer = document.querySelector(".globalTime");
const counter = document.querySelector(".count");
const globalCounter = document.querySelector(".globalCount");
const pressAudio = new Audio("ben/assets/grab.mp3");
const releaseAudio = new Audio("ben/assets/release.mp3");
const maxAudios = 8;
let audioCount = 0;
const count = () => {
    let clicks = localStorage.getItem("clicks") || "0";
    let clicksToSendToServer = localStorage.getItem("clicksToSendToServer") || "0";
    clicks = (parseInt(clicks) + 1).toString();
    clicksToSendToServer = (parseInt(clicksToSendToServer) + 1).toString();
    counter.innerText = getLocalCounterTextMessage(clicks);
    localStorage.setItem("clicks", clicks);
    localStorage.setItem("clicksToSendToServer", clicksToSendToServer);
};
const play = (audio) => {
    if (audioCount < maxAudios) {
        audioCount++;
        const tmp = audio.cloneNode();
        tmp.addEventListener("ended", () => {
            audioCount--;
        });
        tmp.volume = 0.1;
        tmp.play();
    }
};
const press = (e) => {
    e.preventDefault();
    play(pressAudio);
    benPicture.classList.add("press");
    count();
    document.title = "ben";
};
const release = (e) => {
    e.preventDefault();
    play(releaseAudio);
    benPicture.classList.remove("press");
};
const getLocalCounterTextMessage = (count) => {
    return `you have clicked ben ${count} times :)`;
};
const observing = () => __awaiter(void 0, void 0, void 0, function* () {
    let secs = localStorage.getItem("secs") || "0";
    if (document.hasFocus()) {
        secs = (parseInt(secs) + 1).toString();
        timer.innerText = `you have observed ben for ${secs} seconds`;
    }
    localStorage.setItem("secs", secs);
    yield syncWithServer();
});
const syncWithServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const clicksToSendToServer = localStorage.getItem("clicksToSendToServer") || "0";
    localStorage.setItem("clicksToSendToServer", "0");
    const globalData = yield sendAndReceiveCounts(parseInt(clicksToSendToServer));
    console.log(globalData);
    globalCounter.innerText = `everyone has clicked ben ${globalData["click_count"]} times >:)`;
    globalTimer.innerText = `everyone has observed ben for ${globalData["observation_time"]} seconds`;
});
const sendAndReceiveCounts = (clicksToSend) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`${backendIp}/totals?click_count=${clicksToSend}`);
    const responseText = yield response.text();
    console.log(responseText);
    return JSON.parse(responseText);
});
counter.innerText = getLocalCounterTextMessage(localStorage.getItem("clicks") || "0");
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
