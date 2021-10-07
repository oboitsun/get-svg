window.AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext();

function drawBuffer(width, height, context, buffer) {
    var data = buffer.getChannelData(0);
    var step = Math.ceil(data.length / width);
    var amp = height / 2;
    for (var i = 0; i < width; i += 0.5) {
        var min = 1.0;
        var max = -1.0;
        for (var j = 0; j < step; j++) {
            var datum = data[(i * step) + j];
            if (datum < min)
                min = datum;
            if (datum > max)
                max = datum;
        }
        // console.log((max - min) * amp);
        // if ((max - min) * amp > 100) {
        //     context.fillStyle = "#FF0000";
        // }
        // else if ((max - min) * amp < 20) {
        //     context.fillStyle = "#000000";
        // }
        // else {
        //     context.fillStyle = "#FFDD00";
        // }
        // console.log('hsl(' + Math.round((max - min) * amp) + ', 100 %, 50 %)');
        context.fillStyle = 'hsl(' + Math.max(1, Math.round((max - min) * amp)) * 1.76 + ', 70%, 46%)';
        context.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
    }
}

function initAudio() {
    var audioRequest = new XMLHttpRequest();
    audioRequest.open("GET", "sounds/Discoteque.mp3", true);
    audioRequest.responseType = "arraybuffer";
    audioRequest.onload = function () {
        audioContext.decodeAudioData(audioRequest.response,
            function (buffer) {
                var canvas = document.getElementById("view1");
                drawBuffer(canvas.width, canvas.height, canvas.getContext('2d'), buffer);
            });
    }
    audioRequest.send();
}

window.addEventListener('load', initAudio);
