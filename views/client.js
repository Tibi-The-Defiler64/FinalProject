function downloadFile(uri, name) {
    const link = document.createElement("a");
    link.target = "_blank";
    link.download = name;
    link.href = uri;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
}

const LINK_TYPES = {
    album: {
        regex: /^https:\/\/open\.spotify\.com\/album\/(?<id>\w{22})/,
        endpoint: "album"
    },
    track: {
        regex: /^https:\/\/open\.spotify\.com\/track\/(?<id>\w{22})/,
        endpoint: "song"
    },
    playlist: {
        regex: /^https:\/\/open\.spotify\.com\/playlist\/(?<id>\w{22})/,
        endpoint: "playlist"
    }
};


const getYoutubeLinks = async (spotifyLink) => {
    const type = Object.values(LINK_TYPES).find(({ regex }) => regex.test(spotifyLink));
    if (!type) {
        return null;
    }

    const id = type.regex.exec(spotifyLink).groups.id;
    if (!id) {
        return null;
    }

    const url =  "/" + type.endpoint + "/" + id;
    const response = await fetch(url);
    if(!response.ok){
        return null;
    }

    const x = await response.json();
    console.log(x);
    return x;
}
const gumb = document.getElementById("gumb");

gumb.addEventListener("click", async event => {
    event.preventDefault();
    const spotifyLink = document.getElementById("spotifyLink").value;
    getYoutubeLinks(spotifyLink).then(links =>{
        if(links === null){
            alert('Invalid link');
            return;
        }
        links.forEach(trackId => {
            downloadFile("/download/"+trackId,"test.mp3");    
        });
    });

})



/*gumb.addEventListener("click", event => {
    event.preventDefault();
    //getYoutubeLinks();

    const spotifyLink = document.getElementById("spotifyLink").value;
    const regex = /\/track\/(.+)/;
    const match = spotifyLink.match(regex);
    const trackId = match[1];
    downloadFile("/click/" + trackId, "test.mp3");
});*/
