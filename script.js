async function startConversion() {

    const url =
    document.getElementById("urlInput").value;

    const file =
    document.getElementById("fileInput").files[0];

    const format =
    document.getElementById("format").value;

    const status =
    document.getElementById("status");

    const bar =
    document.getElementById("bar");

    const downloadBtn =
    document.getElementById("downloadBtn");

    if(!url && !file){

        alert(
            "Cole um link ou escolha um ficheiro."
        );

        return;

    }

    status.innerHTML =
    "A converter...";

    bar.style.width = "0%";

    let progress = 0;

    const fakeProgress =
    setInterval(()=>{

        if(progress < 90){

            progress += 10;

            bar.style.width =
            progress + "%";

            status.innerHTML =
            progress + "%";

        }

    },500);

    try{

        const formData =
        new FormData();

        formData.append(
            "format",
            format
        );

        if(url){

            formData.append(
                "url",
                url
            );

        }

        if(file){

            formData.append(
                "file",
                file
            );

        }

        const resposta =
        await fetch(
            "/convert",
            {
                method:"POST",
                body:formData
            }
        );

        const dados =
        await resposta.json();

        clearInterval(
            fakeProgress
        );

        bar.style.width =
        "100%";

        status.innerHTML =
        "Conversão concluída ✔";

        downloadBtn.style.display =
        "inline-block";

        downloadBtn.onclick =
        ()=>{

            window.open(
                dados.download,
                "_blank"
            );

        };

    }catch(e){

        clearInterval(
            fakeProgress
        );

        status.innerHTML =
        "Erro na conversão.";

    }

}
