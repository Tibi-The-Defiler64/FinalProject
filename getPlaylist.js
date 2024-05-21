const fetch = require("node-fetch");
const exp = require("constants");
const path = require("path");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const TRACK_REGEX = /^https:\/\/open\.spotify\.com\/track\/(?<trackId>\w{22})/;

// zahtjev pristupnog tokena
const fetchToken = async () => {
    //kreiranje stringa baze 64
    const token = new Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64");
    // slanje POST zahtjeva s postavljenim parametrima
    const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        body: new URLSearchParams({
            grant_type: "client_credentials"
        }),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Basic " + token
        }
    });
    //parsiranje JSON-a
    const json = await res.json();
    //ekstrakcija pristupnog tokena
    return json.access_token;
};

// slanje GET zahtjeva za metapodatke o playlisti
const fetchPlaylist = async (playlistId, token) =>
    //slanje GET zahtjeva s postavljenim zaglavljem
    fetch("https://api.spotify.com/v1/playlists/" + playlistId, {
        headers: {
            Authorization: "Bearer " + token
        }
        //kada se dohvate podatci parsiranje u JSON
    }).then(res => res.json());

// vraća niz id-eva
async function getPlaylistData (playlistId){
    //dohvati pristupni token
    const token = await fetchToken();
    //dohvati metapodatke o playlisti
    const playlist = await fetchPlaylist(playlistId, token);
    //dohvati niz metapodataka pjesama
    const playlistTracks = playlist["tracks"]["items"];
    const playlistTracksIds = [];
    // izvlačenje id-eva pjesama iz metapodataka o pjesmama
    playlistTracks.forEach(playlistData => {
        playlistTracksIds.push(playlistData["track"].id);
    });    
    //vraćanje niza id-eva
    return playlistTracksIds;
}

module.exports = { getPlaylistData };


