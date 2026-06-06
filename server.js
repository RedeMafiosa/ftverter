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

const upload = multer({ dest: "uploads/" });

// memória temporária de downloads
const downloads = new Map();

/* =========================
   CONVERTER
========================= */
app.post("/convert", upload.single("file"), async (req, res) => {

    const { url, format } = req.body;
    const file = req.file;

    const id = Date.now().toString();
    const outputPath = path.join(__dirname, "uploads", `${id}.${format}`);

    const cleanup = () => {
        setTimeout(() => {
            if (fs.existsSync(outputPath)) {
                fs.unlinkSync(outputPath);
            }
            downloads.delete(id);
        }, 5 * 60 * 1000); // 5 minutos
    };

    try {

        // YOUTUBE
        if (url && ytdl.validateURL(url)) {

            const stream = ytdl(url, {
                filter: "audioonly",
                quality: "highestaudio"
            });

            ffmpeg(stream)
                .audioBitrate(192)
                .toFormat(format)
                .on("end", () => {

                    downloads.set(id, outputPath);
                    cleanup();

                    return res.json({ id });
                })
                .on("error", (err) => {
                    console.log(err);
                    return res.status(500).json({ error: "Erro conversão YouTube" });
                })
                .save(outputPath);

            return;
        }

        // FILE UPLOAD
        if (file) {

            ffmpeg(file.path)
                .toFormat(format)
                .on("end", () => {

                    fs.unlinkSync(file.path);

                    downloads.set(id, outputPath);
                    cleanup();

                    return res.json({ id });
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
        return res.status(500).json({ error: "Erro servidor" });
    }
});

/* =========================
   DOWNLOAD SEGURO POR ID
========================= */
app.get("/download/:id", (req, res) => {

    const id = req.params.id;
    const filePath = downloads.get(id);

    if (!filePath || !fs.existsSync(filePath)) {
        return res.status(404).send("Ficheiro não disponível ou expirado");
    }

    res.download(filePath, () => {

        // apagar depois de descarregar
        fs.unlink(filePath, () => {});
        downloads.delete(id);
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Servidor PRO online na porta " + PORT);
});
