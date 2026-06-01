const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const OUTPUT_DIR = path.join(__dirname, "output");
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

// 🔥 CONVERTER
app.post("/convert", (req, res) => {
    const { url, format } = req.body;

    if (!url) return res.status(400).json({ error: "sem url" });

    const fileName = `file_${Date.now()}.${format}`;
    const outputPath = path.join(OUTPUT_DIR, fileName);

    const cmd =
        format === "mp3"
            ? `yt-dlp -x --audio-format mp3 -o "${outputPath}" "${url}"`
            : `yt-dlp -o "${outputPath}" "${url}"`;

    exec(cmd, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "erro conversão" });
        }

        const downloadUrl = `https://${req.headers.host}/download/${fileName}`;

        res.json({ download: downloadUrl });
    });
});

// 🔥 download
app.get("/download/:file", (req, res) => {
    const file = path.join(OUTPUT_DIR, req.params.file);
    res.download(file);
});

app.listen(3000, () => {
    console.log("🔥 servidor a correr");
});