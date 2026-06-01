async function startConversion() {
    const url = document.getElementById("urlInput").value.trim();
    const format = document.getElementById("format").value;

    const bar = document.getElementById("bar");
    const status = document.getElementById("status");
    const downloadBtn = document.getElementById("downloadBtn");

    if (!url) {
        alert("Cola um link do YouTube!");
        return;
    }

    let progress = 0;
    bar.style.width = "0%";
    downloadBtn.style.display = "none";

    const fakeProgress = setInterval(() => {
        progress += 3;
        bar.style.width = progress + "%";

        if (progress < 40) status.innerText = "A analisar vídeo...";
        else if (progress < 80) status.innerText = "A converter...";
        else status.innerText = "A finalizar...";

        if (progress >= 100) clearInterval(fakeProgress);
    }, 80);

    try {
        const res = await fetch("https://TEU-BACKEND.onrender.com/convert", {
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

    } catch (err) {
        status.innerText = "Erro no servidor";
        console.log(err);
    }
}