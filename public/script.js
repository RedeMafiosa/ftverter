async function startConversion() {

    const url = document.getElementById("urlInput").value;
    const file = document.getElementById("fileInput").files[0];
    const format = document.getElementById("format").value;

    const status = document.getElementById("status");
    const bar = document.getElementById("bar");
    const downloadBtn = document.getElementById("downloadBtn");

    status.innerHTML = "A enviar...";
    bar.style.width = "0%";

    const formData = new FormData();
    formData.append("format", format);

    if (url) formData.append("url", url);
    if (file) formData.append("file", file);

    let progress = 0;

    const fake = setInterval(() => {
        if (progress < 90) {
            progress += Math.random() * 8;
            bar.style.width = progress + "%";
            status.innerHTML = "A converter... " + Math.floor(progress) + "%";
        }
    }, 400);

    try {

        const res = await fetch("/convert", {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        clearInterval(fake);

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

        clearInterval(fake);

        console.error(err);
        status.innerHTML = "Erro na conversão";
    }
}
