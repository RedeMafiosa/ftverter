async function startConversion() {
    const url = document.getElementById("urlInput").value;
    const format = document.getElementById("format").value;
    const status = document.getElementById("status");
    const downloadBtn = document.getElementById("downloadBtn");

    if (!url) {
        alert("Cola um link!");
        return;
    }

    status.innerText = "A enviar para servidor...";

    const res = await fetch("https://ftverter.onrender.com/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, format })
    });

    const data = await res.json();

    if (data.download) {
        status.innerText = "Concluído ✔";

        downloadBtn.style.display = "block";
        downloadBtn.onclick = () => {
            window.open(data.download, "_blank");
        };
    } else {
        status.innerText = "Erro na conversão ❌";
    }
}
