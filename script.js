async function startConversion() {

    const url =
    document.getElementById("urlInput").value;

    const format =
    document.getElementById("format").value;

    const status =
    document.getElementById("status");

    if(!url){
        alert("Cole um link.");
        return;
    }

    status.innerHTML="A converter...";

    try{

        const resposta =
        await fetch("/convert",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                url:url,
                format:format
            })
        });

        const dados =
        await resposta.json();

        status.innerHTML=
        "Concluído:<br><a href='"+
        dados.download+
        "' target='_blank'>DOWNLOAD</a>";

    }catch(e){

        status.innerHTML=
        "Erro na conversão.";

    }
}
