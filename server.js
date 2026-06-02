const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

app.use(express.static(__dirname));

app.get("/", (req,res)=>{
    res.sendFile(
        path.join(__dirname,"index.html")
    );
});

app.get("/converter",(req,res)=>{
    res.sendFile(
        path.join(__dirname,"converter.html")
    );
});

app.post("/convert",(req,res)=>{

    const {url,format}=req.body;

    console.log(url,format);

    res.json({
        download:"#"
    });

});

app.listen(
    process.env.PORT || 3000,
    ()=>{
        console.log("Servidor online");
    }
);
