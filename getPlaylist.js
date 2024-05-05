const fetch = require("node-fetch");
const exp = require("constants");
const path = require("path");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const TRACK_REGEX = /^https:\/\/open\.spotify\.com\/track\/(?<trackId>\w{22})/;

const fetchToken = async () => {
    const token = new Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64");

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

    const json = await res.json();
    return json.access_token;
};

const fetchPlaylist = async (playlistId, token) =>
    fetch("https://api.spotify.com/v1/playlists/" + playlistId, {
        headers: {
            Authorization: "Bearer " + token
        }
    }).then(res => res.json());

async function getPlaylistData (playlistId){
    const token = await fetchToken();
    const playlist = await fetchPlaylist(playlistId, token);
    
    const playlistTracks = playlist["tracks"]["items"];
    
    const playlistTracksIds = [];
    
    playlistTracks.forEach(playlistData => {
        playlistTracksIds.push(playlistData["track"].id);
    });    
    return playlistTracksIds;
    
}

module.exports = { getPlaylistData };


