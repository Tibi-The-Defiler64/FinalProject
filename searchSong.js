const Scraper = require("youtube-search-scraper").default;
const youtube = new Scraper();


// vraća yt video
async function searchSong(songName, authorsArray, duration) {
    let songLink = ""; 
    // parsiranje niza izvođača u string
    let authors = authorsArray.join(" ");
    // pretraživanje za pjesmu pomoću youtube-search-scraper biblioteke
    await youtube.search(songName + " " + authors).then(results => {
        for (let song of results.videos) {
            // filtriranje videozapisa prema trajanju
            if (song.duration <= duration + 60000) {
                songLink = song.link;
                break;
            }
        }
    });
    //vraćanje poveznice na videozapis
    return songLink;
}

module.exports = { searchSong };
