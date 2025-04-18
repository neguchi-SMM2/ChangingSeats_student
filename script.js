const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let seatNumber = null;

navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
  .then((stream) => {
    video.srcObject = stream;
    video.setAttribute("playsinline", true);
    requestAnimationFrame(scanQRCode);
  });

function scanQRCode() {
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, canvas.width, canvas.height);
    if (code) {
      seatNumber = parseInt(code.data);
      if (!isNaN(seatNumber) && seatNumber >= 1 && seatNumber <= 40) {
        document.getElementById("seat-info").textContent = `読み取った席番号：${seatNumber}`;
        document.getElementById("form-container").style.display = "block";
        video.style.display = "none";
        return;
      }
    }
  }
  requestAnimationFrame(scanQRCode);
}

document.getElementById("seatForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const number = document.getElementById("number").value;

  const response = await fetch("https://your-server-url.onrender.com/api/seat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ seat: seatNumber, name, number })
  });

  if (response.ok) {
    alert("送信完了しました！");
  } else {
    alert("送信に失敗しました");
  }
});
