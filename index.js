// canvas and index text
const indexText = document.getElementById("index");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let radius;

resize(window.innerWidth);
window.onresize = event => {
  resize(event.currentTarget.innerWidth);
  draw();
};

// array
let timeout = 10;
let a = [];
let curr = [];
let ratio = 1;
let globalNum = 100;
let customReady = false;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function resize(width) {
  width = width > 496 ? width / 3 : width / 2.5;
  canvas.width = width;
  canvas.height = width;
  radius = width / 2;
}

function draw() {
  if (curr) {
    ctx.clearRect(0, 0, radius * 2, radius * 2);
    let last = 0;
    for (let i = 1; i <= curr.length; i++) {
      let rad = i * (2 * Math.PI) / curr.length;
      let color = "hsla(" + curr[i - 1] * ratio + ", 100%, 50%, 1.0)";
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius, last, rad, false);
      last = rad;
      ctx.lineTo(
        radius + radius * Math.cos(rad),
        radius + radius * Math.sin(rad)
      );
      ctx.fill();
      ctx.stroke();
    }
  }
}

function custom() {
  if (customReady) {
    a = JSON.parse(document.getElementById("custom").value);
    run();
  }
}

function check(val) {
  const errorEl = document.getElementById("error");
  try {
    JSON.parse(val);
    customReady = true;
    errorEl.innerHTML = "";
  } catch (e) {
    errorEl.innerHTML = e;
  }
}

function changeSpeed(speed) {
  console.log(speed);
  timeout = 500 / speed;
}

function run() {
  let arrMax = Math.max(a[0].reduce((a, b) => Math.max(a, b)));
  ratio = 360 / arrMax;
  asyncloop(
    i => !a[i + 1],
    i => {
      curr = a[i];
      window.requestAnimationFrame(draw);
      indexText.innerHTML = i + 1;
    }
  );
}

function insertion() {
  a = [];
  for (var i = 1; i < curr.length; i++) {
    var tmp = curr[i];
    for (var j = i - 1; j >= 0 && curr[j] > tmp; j--) {
      curr[j + 1] = curr[j];
      if (curr.length < 200) a.push([...curr]);
    }
    if (curr.length >= 200) a.push([...curr]);
    curr[j + 1] = tmp;
  }
  console.log(a);
  run();
}

function inPlaceRadix() {
  a = [];
  var k = Math.max.apply(
    null,
    curr.map(function(i) {
      return Math.ceil(Math.log(i) / Math.log(2));
    })
  );

  for (var d = 0; d < k; ++d) {
    for (var i = 0, p = 0, b = 1 << d, n = curr.length; i < n; ++i) {
      var o = curr[i];
      if ((o & b) == 0) {
        curr.splice(p++, 0, curr.splice(i, 1)[0]);
      }
      a.push([...curr]);
    }
  }
  run();
}

function asyncloop(end, f) {
  (function loop(i) {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        f(i);
        resolve();
      }, timeout);
    }).then(() => end(i) || loop(i + 1));
  })(0);
}

function generate(num) {
  if (num) {
    globalNum = num;
  }
  curr = [];
  for (var i = 0; i < globalNum; i++) {
    curr.push(getRandomInt(0, 500));
  }
}
timeout = 0;
generate(20);
inPlaceRadix();
window.requestAnimationFrame(draw);
timeout = 10;
