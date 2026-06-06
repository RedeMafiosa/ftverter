const express = require("express");
const path = require("path");

const app = express();

// para JSON
app.use(express.json());

// SERVIR FRONTEND CORRETAMENTE
app.use(express.static(path.join(__dirname, "public")));

// HOME
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// CONVERTER PAGE
app.get("/converter", (req, res) => {
    res.sendFile(path.join(__dirname, "public/converter.html"));
});

// API (ainda fake por agora)
app.post("/convert", (req, res) => {

    const { url, format } = req.body;

    console.log("URL:", url);
    console.log("FORMAT:", format);

    res.json({
        download: "#"
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Servidor online na porta " + PORT);
});
