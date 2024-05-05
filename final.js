require("dotenv").config();
const express = require("express");
const path = require("path");

const { getSongData } = require("./getSong.js");
const { searchSong } = require("./searchSong.js");
const { downloadFromYoutube } = require("./downloadSong.js");
const { getAlbumData } = require("./getAlbum.js");
const { getPlaylistData } = require("./getPlaylist.js");

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "views")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

async function convertSong(trackId){
    const songData = await getSongData(trackId);
    const url = await searchSong(songData.name, songData.artists[0].name, songData.duration_ms);
    console.log("Download: " + url);
    return downloadFromYoutube(url);
    

}
async function convertAlbum(albumId){
    const albumTrackIds = await getAlbumData(albumId);
    return albumTrackIds;

}

async function convertPlaylist(playlistId){
    const playlistTrackIds = await getPlaylistData(playlistId);
    return playlistTrackIds;
}

app.get("/album/:albumId", async (req, res)=>{
    const {albumId} = req.params;
    const albumTrackIds = await convertAlbum(albumId);
    res.json(albumTrackIds);
});

app.get("/playlist/:playlistId",async (req,res) =>{
    const {playlistId} = req.params;
    const playlistTrackIds = await convertPlaylist(playlistId);
    res.json(playlistTrackIds);
});

app.get("/song/:trackId",async(req, res) =>{
    const {trackId} = req.params;
    res.json([trackId]);
})

app.get("/download/:trackId", async (req, res) => {
    const { trackId } = req.params;
    const songData = await getSongData(trackId);
    const url = await searchSong(songData.name, songData.artists[0].name, songData.duration_ms);
    console.log("Download: " + url);
    const stream = downloadFromYoutube(url);
    stream.pipe(res);
});

app.listen(port);
console.log("Server started at http://localhost:" + port);
