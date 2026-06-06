async function startConversion() {

    const url = document.getElementById("urlInput").value;
    const file = document.getElementById("fileInput").files[0];
    const format = document.getElementById("format").value;

    const status = document.getElementById("status");
    const bar = document.getElementById("bar");
    const downloadBtn = document.getElementById("downloadBtn");

    status.innerHTML = "A enviar...";

    const formData = new FormData();
    formData.append("format", format);

    if (url) formData.append("url", url);
    if (file) formData.append("file", file);

    try {

        // fake progress suave até 90%
        let progress = 0;
        const interval = setInterval(() => {
            if (progress < 90) {
                progress += 5;
                bar.style.width = progress + "%";
                status.innerHTML = progress + "%";
            }
        }, 400);

        const res = await fetch("/convert", {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        clearInterval(interval);

        bar.style.width = "100%";
        status.innerHTML = "Concluído ✔";

        downloadBtn.style.display = "inline-block";

        downloadBtn.onclick = () => {
            const link = document.createElement("a");
            link.href = data.download;
            link.download = "ficheiro." + format;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

    } catch (err) {
        console.error(err);
        status.innerHTML = "Erro na conversão";
    }
}
