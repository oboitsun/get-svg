document.getElementById("fileinput").addEventListener(
  "change",
  async function (e) {
    let picker1 = document.getElementById("1");
    let picker2 = document.getElementById("2");
    let picker3 = document.getElementById("3");

    attr1 = picker1.getAttribute("data-current-color");
    attr2 = picker2.getAttribute("data-current-color");
    attr3 = picker3.getAttribute("data-current-color");

    var linGrad = document
      .createElement("canvas")
      .getContext("2d")
      .createLinearGradient(0, 0, 1500, 128);
    linGrad.addColorStop(0, attr1);
    linGrad.addColorStop(0.5, attr2);
    linGrad.addColorStop(1, attr3);

    let targetSVG = document.getElementById("svgs");

    // wavesurfer.load('./sounds/rampampam.mp3');

    if (this.files && this.files?.length) {
      for (let i in this.files) {
        createContainers(i);
        const wavesurfer = WaveSurfer.create({
          container: `#waveform_${i}`,
          waveColor: linGrad,
          progressColor: "transparent",
          cursorWidth: 0,
        });
        const name = this.files[i].name.replace(".mp3", "");
        if (this.files[i]) {
          var reader = new FileReader();

          reader.onload = function (evt) {
            // Create a Blob providing as first argument a typed array with the file buffer
            var blob = new window.Blob([new Uint8Array(evt.target.result)]);

            // Load the blob into Wavesurfer
            wavesurfer.loadBlob(blob);
            let canv = wavesurfer.loadBlob(blob);
          };

          reader.onerror = function (evt) {
            console.error("An error ocurred reading the file: ", evt);
          };

          // Read File as an ArrayBuffer
          reader.readAsArrayBuffer(this.files[i]);
        }

        setTimeout(function () {
          var svgNS = "http://www.w3.org/2000/svg";
          var xlinkNS = "http://www.w3.org/1999/xlink";
          let svg = document.createElement("svg");
          svg.id = `svg_${i}`;
          svg.setAttribute("width", "100vw");
          svg.setAttribute("height", 128);
          svg.setAttribute("xmlns", svgNS);
          svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");

          var imgSrc = wavesurfer.exportImage("image/png");
          //   console.log(imgSrc);
          //   document.getElementById("canvasImg").src = imgSrc;

          var svgimg = document.createElementNS(svgNS, "image");

          svgimg.setAttribute("id", `importedCanvas_${i}`);
          svgimg.setAttributeNS(xlinkNS, "xlink:href", imgSrc);

          svgimg.setAttribute("x", 0);
          svgimg.setAttribute("y", 0);
          svgimg.setAttribute("width", "100vw");
          svgimg.setAttribute("height", 128);

          svg.appendChild(svgimg);
          targetSVG.appendChild(svg);
          download(svg.outerHTML, `${name}`, "image/svg+xml");
          //   const canvas = document.getElementsByTagName("wave");

          //   var myRectangle = canvas.getSerializedSvg(true);
          //   console.log(myRectangle);
        }, 4000);
      }
    }

    var file = this.files[0];
  },
  false
);
function createContainers(i) {
  const container = document.createElement("div");
  container.id = `waveform_${i}`;

  document.body.appendChild(container);
}
function download(data, filename, type) {
  var file = new Blob([data], { type: type });
  if (window.navigator.msSaveOrOpenBlob)
    // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  else {
    // Others
    var a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}
