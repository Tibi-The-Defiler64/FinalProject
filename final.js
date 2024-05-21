require("dotenv").config();
const express = require("express");
const path = require("path");
const ytext = require("youtube-ext");

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
    //dobivanje podataka iz uri
    const {albumId} = req.params;
    // dobivanje liste id-eva iz albuma
    const albumTrackIds = await getAlbumData(albumId);
    // slanje niza klijentu
    res.json(albumTrackIds);
});

app.get("/playlist/:playlistId",async (req,res) =>{
    //dobivanje podataka iz uri 
    const {playlistId} = req.params;
    // dobivanje liste id-eva iz playliste
    const playlistTrackIds = await getPlaylistData(playlistId);
    // slanje niza klijentu
    res.json(playlistTrackIds);
});

app.get("/song/:trackId",async(req, res) => {
    // dobivanje id pjesme iz resursa
    const {trackId} = req.params;
    // stavljanje id-a pjesme u niz i slanje niza klijentu 
    res.json([trackId]); 
})

app.get("/youtubeVideo/:youtubeId", async(req, res) => {
    //dobivanje podataka iz uri 
    const {youtubeId} = req.params;
    // dobivanje podataka o videozapisu
    const name = await ytext.videoInfo("https://www.youtube.com/watch?v="+youtubeId); 
    res.json({"name":name["title"], "id":youtubeId}) // odgovor u obliku objekta
});

// metapodatci pjesme
app.get("/getName/:trackId",async (req, res) => {
    //izvlačenje id pjesme iz resursa
    const { trackId } = req.params;
    //izvlačenje metapodataka o pjesmi
    const songData = await getSongData(trackId);
    //kreiranje niza s izvođačima
    const artistList = [];
    songData.artists.forEach(artistData => {
        artistList.push(artistData.name);
    });
    //slanje JSON objekta s podatcima klijentu 
    res.json({"songName":songData.name,"songArtists":artistList,"songDuration":songData.duration_ms})
});


app.get("/download/data",async (req,res) => {
    //dohvaćanje stringa iz zahtjeva
    const songData = req.query.json;
    //parsiranje stringa u JSON objekat
    const songDataJson = JSON.parse(songData);
    //dohvaćanje youtube poveznice na pjesmu 
    const url = await searchSong(songDataJson["songName"], songDataJson["songArtists"], songDataJson["songDuration"]);
    console.log("Download: " + url);
    console.log(songDataJson["songName"]);
    console.log(songDataJson["songArtists"]);
    //stvaranje streama pjesme 
    const stream = downloadFromYoutube(url);
    //slanje streama klijentu
    stream.pipe(res);
});
app.get("/download/:youtubeId", async (req, res) => {
    //dohvaćanje stringa iz zahtjeva
    const {youtubeId} = req.params;
    console.log(youtubeId);
    //stvaranje streama pjesme 
    const stream = downloadFromYoutube("https://www.youtube.com/watch?v="+youtubeId);
    //slanje streama klijentu
    stream.pipe(res);
});

app.listen(port);
process.on('uncaughtException', console.error)
console.log("Server started at http://localhost:" + port);
