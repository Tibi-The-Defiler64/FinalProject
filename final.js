require("dotenv").config();
const express = require("express");
const path = require("path");

const { getSongData } = require("./getSong.js");
const { searchSong } = require("./searchSong.js");
const { downloadFromYoutube } = require("./downloadSong.js");

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "views")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.htmls"));
});

app.get("/click/:trackId", async (req, res) => {
    const { trackId } = req.params;
    const songData = await getSongData(trackId);
    const url = await searchSong(songData.name, songData.artists[0].name, songData.duration_ms);

    console.log("Download: " + url);
    const stream = downloadFromYoutube(url);
    stream.pipe(res);
});

app.listen(port);
console.log("Server started at http://localhost:" + port);
