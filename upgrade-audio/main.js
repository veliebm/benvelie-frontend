"use strict";
/**
 * A script to process an audio file with various audio effects:
 * downsampling, bandpass filtering, compression, distortion, and echo.
 * The processed audio can be played and downloaded.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Converts an AudioBuffer to a WAVE format Blob.
 * @param buffer - The input audio buffer to be converted to WAVE format.
 * @param length - The number of samples to include in the output WAVE file.
 * @returns - A Blob representing the audio data in WAVE format.
 */
function bufferToWave(buffer, length) {
    const wavBuffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(wavBuffer);
    function writeString(view, offset, str) {
        for (let i = 0; i < str.length; i++) {
            view.setUint8(offset + i, str.charCodeAt(i));
        }
    }
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    writeString(view, 0, "RIFF");
    view.setUint32(4, 32 + length * 2, true);
    writeString(view, 8, "WAVE");
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, "data");
    view.setUint32(40, length * 2, true);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
        view.setInt16(44 + i * 2, channelData[i] * 0x7fff, true);
    }
    return new Blob([view], { type: "audio/wav" });
}
/**
 * Generates a distortion curve for a given amount of distortion.
 * @param amount - The amount of distortion.
 * @returns - The generated distortion curve.
 */
function generateDistortionCurve(amount) {
    const samples = 44100;
    const curve = new Float32Array(samples);
    const deg = Math.PI / 180;
    const x = 2 * amount * deg;
    for (let i = 0; i < samples; ++i) {
        const t = (i * 2) / samples - 1;
        curve[i] = ((3 + x) * t * 20 * deg) / (Math.PI + x * Math.abs(t));
    }
    return curve;
}
/**
 * Applies downsampling to an audio buffer.
 * @param audioBuffer - The input audio buffer.
 * @returns - The downsampled audio buffer.
 */
function applyDownsampling(audioBuffer) {
    return __awaiter(this, void 0, void 0, function* () {
        const offlineCtx = new OfflineAudioContext(1, audioBuffer.duration * 8000, 8000);
        const offlineSource = offlineCtx.createBufferSource();
        offlineSource.buffer = audioBuffer;
        offlineSource.connect(offlineCtx.destination);
        offlineSource.start();
        const renderedBuffer = yield offlineCtx.startRendering();
        return renderedBuffer;
    });
}
/**
 * Applies a bandpass filter to the audio processing chain.
 * @param audioContext - The audio context.
 * @param lastNode - The previous node in the processing chain.
 * @returns - The bandpass filter node.
 */
function applyBandPassFilter(audioContext, lastNode) {
    const filter = audioContext.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1000;
    filter.Q.value = 0.7;
    lastNode.connect(filter);
    return filter;
}
/**
 * Applies compression to the audio processing chain.
 * @param audioContext - The audio context.
 * @param lastNode - The previous node in the processing chain.
 * @returns - The dynamics compressor node.
 */
function applyCompression(audioContext, lastNode) {
    const compressor = audioContext.createDynamicsCompressor();
    compressor.threshold.value = -24;
    compressor.knee.value = 30;
    compressor.ratio.value = 12;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.25;
    lastNode.connect(compressor);
    return compressor;
}
/**
 * Applies distortion to the audio processing chain.
 * @param audioContext - The audio context.
 * @param lastNode - The previous node in the processing chain.
 * @returns - The wave shaper node.
 */
function applyDistortion(audioContext, lastNode) {
    const waveshaper = audioContext.createWaveShaper();
    waveshaper.curve = generateDistortionCurve(400);
    lastNode.connect(waveshaper);
    return waveshaper;
}
/**
 * Applies an echo effect to the audio processing chain.
 * @param audioContext - The audio context.
 * @param lastNode - The previous node in the processing chain.
 * @returns - The delay node.
 */
function applyEcho(audioContext, lastNode) {
    const delay = audioContext.createDelay(2);
    const feedback = audioContext.createGain();
    delay.delayTime.value = 0.1;
    feedback.gain.value = 0.3;
    lastNode.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    return delay;
}
document.addEventListener("DOMContentLoaded", () => {
    const audioInput = document.getElementById("audio-input");
    const bandPassFilter = document.getElementById("band-pass-filter");
    const compression = document.getElementById("compression");
    const downsample = document.getElementById("downsample");
    const distortion = document.getElementById("distortion");
    const echo = document.getElementById("echo");
    const processButton = document.getElementById("process");
    const status = document.getElementById("status");
    const downloadButton = document.getElementById("download");
    let audioBuffer;
    audioInput.addEventListener("change", (e) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!file)
            return;
        const audioContext = new AudioContext();
        const arrayBuffer = yield file.arrayBuffer();
        audioBuffer = yield audioContext.decodeAudioData(arrayBuffer);
    }));
    audioInput.addEventListener("change", (e) => __awaiter(void 0, void 0, void 0, function* () {
        // Audio file input handling
    }));
    processButton.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        if (!audioBuffer) {
            status.textContent = "Please select an audio file first.";
            return;
        }
        const audioContext = new AudioContext();
        if (downsample.checked) {
            audioBuffer = yield applyDownsampling(audioBuffer);
        }
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        let lastNode = source;
        if (bandPassFilter.checked) {
            lastNode = applyBandPassFilter(audioContext, lastNode);
        }
        if (compression.checked) {
            lastNode = applyCompression(audioContext, lastNode);
        }
        if (distortion.checked) {
            lastNode = applyDistortion(audioContext, lastNode);
        }
        if (echo.checked) {
            lastNode = applyEcho(audioContext, lastNode);
        }
        lastNode.connect(audioContext.destination);
        source.start();
        // Wait for processing to complete
        yield new Promise((resolve) => setTimeout(resolve, audioBuffer.duration * 1000));
        status.textContent = "Processing complete.";
        downloadButton.hidden = false;
    }));
    downloadButton.addEventListener("click", () => {
        const audioContext = new AudioContext();
        const audioBufferToWavBlob = bufferToWave(audioBuffer, audioBuffer.length);
        const url = URL.createObjectURL(audioBufferToWavBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "distorted-audio.wav";
        link.click();
        URL.revokeObjectURL(url);
    });
});
