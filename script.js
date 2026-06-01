async function startConversion() {
  const url = document.getElementById("urlInput").value;
  const format = document.getElementById("format").value;

  const status = document.getElementById("status");

  if (!url) {
    alert("Cola um link!");
    return;
  }

  status.innerText = "A enviar...";

  const res = await fetch("https://ftverter.onrender.com/convert", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: url,
      format: format
    })
  });

  const data = await res.json();

  if (data.download) {
    status.innerHTML = `<a href="${data.download}" target="_blank">⬇ Download</a>`;
  } else {
    status.innerText = "Erro na conversão";
  }
}
