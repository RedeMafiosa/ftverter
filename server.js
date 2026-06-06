const express = require("express");
const path = require("path");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const ytdl = require("ytdl-core");
const fs = require("fs");

const app = express();

ffmpeg.setFfmpegPath(ffmpegPath);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/outputs", express.static(path.join(__dirname, "outputs")));

const upload = multer({ dest: "uploads/" });

// HOME
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// CONVERTER PAGE
app.get("/converter", (req, res) => {
    res.sendFile(path.join(__dirname, "public/converter.html"));
});

// CONVERT REAL
app.post("/convert", upload.single("file"), async (req, res) => {

    try {
        const { url, format } = req.body;
        const file = req.file;

        const outputName = `output-${Date.now()}.${format}`;
        const outputPath = path.join(__dirname, "outputs", outputName);

        // =========================
        // YOUTUBE DOWNLOAD
        // =========================
     if (url && ytdl.validateURL(url)) {

    const outputName = `output-${Date.now()}.${format}`;
    const outputPath = path.join(__dirname, "outputs", outputName);

    const stream = ytdl(url, {
        quality: "highestaudio",
        filter: "audioonly"
    });

    let proc = ffmpeg(stream)
        .audioBitrate(192)
        .toFormat(format)
        .save(outputPath);

    // progresso REAL do ffmpeg
    proc.on("progress", (p) => {
        console.log(`Progresso: ${p.targetSize || 0}kb`);
    });

    proc.on("end", () => {
        return res.json({
            download: `/outputs/${outputName}`
        });
    });

    proc.on("error", (err) => {
        console.log(err);
        return res.status(500).json({
            error: "Erro na conversão YouTube"
        });
    });

    return;
}

        // =========================
        // FILE UPLOAD
        // =========================
        if (file) {

            ffmpeg(file.path)
                .toFormat(format)
                .on("end", () => {

                    fs.unlinkSync(file.path); // limpar upload

                    return res.json({
                        download: `/outputs/${outputName}`
                    });
                })
                .on("error", (err) => {
                    console.log(err);
                    return res.status(500).json({ error: "Erro conversão ficheiro" });
                })
                .save(outputPath);

            return;
        }

        return res.status(400).json({ error: "Nada enviado" });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Erro no servidor" });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Servidor online na porta " + PORT);
});
