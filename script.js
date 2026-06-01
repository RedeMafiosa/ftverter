async function startConversion() {
    const url = document.getElementById("urlInput").value;
    const format = document.getElementById("format").value;

    const status = document.getElementById("status");
    const bar = document.getElementById("bar");
    const downloadBtn = document.getElementById("downloadBtn");

    if (!url) {
        alert("Cola um link!");
        return;
    }

    let progress = 0;
    bar.style.width = "0%";
    downloadBtn.style.display = "none";

    const fake = setInterval(() => {
        progress += 3;
        bar.style.width = progress + "%";

        if (progress < 40) status.innerText = "A analisar...";
        else if (progress < 80) status.innerText = "A converter...";
        else status.innerText = "A finalizar...";

        if (progress >= 100) clearInterval(fake);
    }, 80);

    const res = await fetch("https://ftverterx.onrender.com/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, format })
    });

    const data = await res.json();

    if (data.download) {
        status.innerText = "✔ Concluído";

        downloadBtn.style.display = "block";
        downloadBtn.onclick = () => {
            window.open(data.download, "_blank");
        };
    } else {
        status.innerText = "Erro na conversão";
    }
}
