
function downloadFile(uri, songData) {
    const link = document.createElement("a");
    link.target = "_blank";
    link.download = songData["songName"];
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
}

async function fetchSongData (uri) {
    let data = await fetch(uri).then(response => response.json());
    return data;
        //downloadFile("/download/"+res,res["songName"]);
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

    return await response.json();
  
}
const submitLinkBtn = document.getElementById("submitLink");
const textInput = document.getElementById("spotifyLink");
const clearLinkBtn = document.getElementById("clearLink");
const homePage = document.getElementById("homePage");
const homePageElements = document.getElementById("homePage").getElementsByTagName("*");
const aboutPopUp = document.getElementById("aboutPopUp");
const aboutBtn = document.getElementById("aboutBtn");



homePage.addEventListener("click",(event)=>{
        if(event.target !== aboutPopUp && !aboutPopUp.contains(event.target) && event.target !== aboutBtn && (aboutPopUp.style.display === "flex")) {
            closeAbout();
        }
});

function clearInput(){
    document.getElementById("spotifyLink").value = "";
    clearLinkBtn.style.display = "none";
    submitLinkBtn.style.display = "none";
}

function activateAboutPopUp() {
    aboutPopUp.style.display = "flex";
    homePage.style.filter = "blur(10px)"
    for(let element of homePageElements){
        element.style.pointerEvents = "none";
    }
}

function closeAbout() {
    aboutPopUp.style.display = "none";
    homePage.style.filter = "none"
    for(let element of homePageElements) {
        element.style.pointerEvents = "auto";
    }
}


textInput.addEventListener("input", (event)=>{
    const currentValue = event.target.value;
    const regex = /(https:\/\/)/
    if(regex.test(currentValue)){
        submitLinkBtn.style.display = "block";
    }
    else{
        submitLinkBtn.style.display = "none";
    }
    if(currentValue!=""){
        clearLinkBtn.style.display = "block";
    }else{
        clearLinkBtn.style.display = "none";
    }


});

submitLinkBtn.addEventListener("click", async event => {
    event.preventDefault();
    const spotifyLink = document.getElementById("spotifyLink").value;
    getYoutubeLinks(spotifyLink).then(links => {
        if(links === null){
            alert('Invalid link');
            return;
        }
        links.forEach(async (trackId) => {
            let sngData = await fetchSongData("/getName/"+trackId);
            let sngDataJson = JSON.stringify(sngData);
            downloadFile(`/download/data?json=${encodeURIComponent(sngDataJson)}`,sngData)
        });
    });

})
