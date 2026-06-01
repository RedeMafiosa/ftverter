const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const outputDir = path.join(__dirname, "output");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

// CONVERTER
app.post("/convert", (req, res) => {
    const { url, format } = req.body;

    if (!url) return res.status(400).json({ error: "sem url" });

    const fileName = `file_${Date.now()}.${format}`;
    const filePath = path.join(outputDir, fileName);

    const cmd =
        format === "mp3"
            ? `yt-dlp -x --audio-format mp3 -o "${filePath}" "${url}"`
            : `yt-dlp -o "${filePath}" "${url}"`;

    exec(cmd, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "erro conversão" });
        }

        const downloadUrl = `https://${req.headers.host}/download/${fileName}`;
        res.json({ download: downloadUrl });
    });
});

// DOWNLOAD
app.get("/download/:file", (req, res) => {
    const file = path.join(outputDir, req.params.file);
    res.download(file);
});

app.listen(process.env.PORT || 3000, () => {
    console.log("🔥 servidor a correr");
});
