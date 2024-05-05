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

const gumb = document.getElementById("gumb");
gumb.addEventListener("click", event => {
    event.preventDefault();
    const spotifyLink = document.getElementById("spotifyLink").value;
    const regex = /\/track\/(.+)/;
    const match = spotifyLink.match(regex);
    const trackId = match[1];
    downloadFile("/click/" + trackId, "test.mp3");
});
