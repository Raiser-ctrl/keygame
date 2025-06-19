let level = 1;
const maxLevel = 3;
let correctDoor = 0;
let timeLeft = 60;
let timerInterval;
let hearts = 3;

const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");

function switchScreen(from, to) {
  document.getElementById(from).classList.remove("active");
  document.getElementById(to).classList.add("active");
}

function startGame() {
  level = 1;
  timeLeft = 60;
  hearts = 3;
  switchScreen("screen_intro", "screen_game");
  setupLevel(level);
  updateHearts();
  startTimer();
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = `Time left: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame(false);
    }
  }, 1000);
}

function setupLevel(currentLevel) {
  document.getElementById("resultText").innerText = "";
  document.getElementById("timer").innerText = `Time left: ${timeLeft}s`;

  const totalDoors = 2 + currentLevel;
  correctDoor = Math.floor(Math.random() * totalDoors) + 1;

  const doorsContainer = document.getElementById("doors");
  doorsContainer.innerHTML = '';

  for (let i = 1; i <= totalDoors; i++) {
    const canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 200;
    canvas.style.borderRadius = "10px";
    canvas.style.boxShadow = "0 8px 16px rgba(0,0,0,0.3)";
    canvas.style.background = "#6d4c41";
    canvas.style.transition = "transform 0.2s";

    const ctx = canvas.getContext("2d");
    drawFancyDoor(ctx, i);

    canvas.onclick = () => handleClick(i, ctx);
    canvas.onmouseover = () => canvas.style.transform = "scale(1.05)";
    canvas.onmouseout = () => canvas.style.transform = "scale(1)";
    doorsContainer.appendChild(canvas);
  }
}

function drawFancyDoor(ctx, number) {
  ctx.clearRect(0, 0, 100, 200);
  ctx.fillStyle = "#4e342e";
  ctx.fillRect(0, 0, 100, 200);

  ctx.beginPath();
  ctx.arc(85, 100, 5, 0, Math.PI * 2);
  ctx.fillStyle = "#ffd54f";
  ctx.fill();

  ctx.fillStyle = "#fff";
  ctx.font = "bold 18px sans-serif";
  ctx.fillText(`Door ${number}`, 15, 190);
}

function handleClick(num, ctx) {
  clickSound.play();

  if (num === correctDoor) {
    drawKey(ctx);
    document.getElementById("resultText").innerText = "✅ Correct!";
    if (level < maxLevel) {
      level++;
      setTimeout(() => {
        setupLevel(level);
        document.getElementById("resultText").innerText = "";
      }, 700);
    } else {
      clearInterval(timerInterval);
      winSound.play();
      showResetButton();
    }
  } else {
    hearts--;
    updateHearts();
    timeLeft = Math.max(timeLeft - 5, 0);
    drawWrong(ctx);
    document.getElementById("resultText").innerText = "❌ Wrong! -1❤️ -5s";

    if (hearts <= 0) {
      clearInterval(timerInterval);
      setTimeout(() => endGame(false), 500);
    }
  }
}

function drawKey(ctx) {
  ctx.clearRect(0, 0, 100, 200);
  ctx.fillStyle = "#ffeb3b";
  ctx.beginPath();
  ctx.arc(50, 100, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(45, 100, 10, 50);
}

function drawWrong(ctx) {
  ctx.clearRect(0, 0, 100, 200);
  ctx.fillStyle = "#b71c1c";
  ctx.fillRect(0, 0, 100, 200);
}

function updateHearts() {
  const heartDisplay = document.getElementById("hearts");
  heartDisplay.innerText = "❤️".repeat(hearts) + "🖤".repeat(3 - hearts);
}
if (num === correctDoor) {
  drawKey(ctx);
  document.getElementById("resultText").innerText = "✅ Correct!";
  
  // Tambahkan nyawa setiap naik level (maksimal 3)
  if (hearts < 3) hearts++;

  if (level < maxLevel) {
    level++;
    setTimeout(() => {
      setupLevel(level);
      updateHearts();
      document.getElementById("resultText").innerText = "";
    }, 700);
  } else {
    clearInterval(timerInterval);
    winSound.play();
    showResetButton();
  }
}

function addHeart() {
  if (hearts < 3) {
    hearts++;
    updateHearts();
    document.getElementById("resultText").innerText = "❤️ Nyawa ditambah!";
    setTimeout(() => {
      document.getElementById("resultText").innerText = "";
    }, 1000);
  } else {
    document.getElementById("resultText").innerText = "❤️ Nyawa sudah penuh!";
    setTimeout(() => {
      document.getElementById("resultText").innerText = "";
    }, 1000);
  }
}

function endGame(won) {
  if (!won) {
    document.body.innerHTML = `
      <div style="background:black;width:100vw;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;color:white;text-align:center;">
        <img src="assets/jumpscare.jpg" style="max-width:100%;height:auto;animation:shake 0.5s infinite;">
        <h1 style="font-size:48px;margin-top:20px;">ARGHHHH!!</h1>
        <audio src="assets/scream.mp3" autoplay></audio>
    <button onclick="location.reload()" style="
  margin-top: 25px;
  padding: 15px 40px;
  font-size: 24px;
  background: linear-gradient(135deg, #ff1744, #d50000);
  color: white;
  border: none;
  border-radius: 50px;
  box-shadow: 0 0 20px rgba(255, 23, 68, 0.6);
  cursor: pointer;
  font-weight: bold;
  letter-spacing: 1px;
  transition: transform 0.3s ease;
"
onmouseover="this.style.transform='scale(1.1)'"
onmouseout="this.style.transform='scale(1)'"
>🔁 Main Lagi</button>

    `;
  }
}


function showResetButton() {
  document.getElementById("screen_game").innerHTML = `
    <h2>🎉 You Win!</h2>
    <button class="start-button" onclick="location.reload()">Play Again</button>
  `;
}

window.onload = () => {
  const params = new URLSearchParams(window.location.search);
  const msg = params.get("msg");
  if (msg) {
    switchScreen("screen_intro", "screen_game");
    document.getElementById("customMessage").value = msg;
  }
};
