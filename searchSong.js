const Scraper = require("youtube-search-scraper").default;
const youtube = new Scraper();

async function searchSong(songName, authorsArray, duration) {
    let songLink = ""; 
    let authors = authorsArray.join(" ");

    await youtube.search(songName + " " + authors).then(results => {
        for (let song of results.videos) {
            if (song.duration <= duration + 60000) {
                songLink = song.link;
                break;
            }
        }
    });
    return songLink;
}

module.exports = { searchSong };
