const Scraper = require("youtube-search-scraper").default;
const youtube = new Scraper();

async function searchSong(songName, author, duration) {
    let songLink = "";

    await youtube.search(songName + " " + author).then(results => {
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
