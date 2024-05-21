


function downloadFile(uri, songData) {
    // kreiranje linka
    const link = document.createElement("a");
    link.target = "_blank";
    //definiranje naziva datoteke koja se skida
    link.download = songData["songName"]+" "+ songData["songArtists"];
    //lokacija na koju link vodi
    link.href = uri;
    //dodavanje linka na stranicu
    document.body.appendChild(link);
    //aktivacija linka, automatski se radi GET zahtjev na uri
    link.click();
    //uklanjanje linka
    document.body.removeChild(link);
    delete link;
}
function downloadYoutubeVideo(youtubeId, songName){
    // kreiranje linka
    const link = document.createElement("a");
    link.target = "_blank";
    //definiranje naziva datoteke koja se skida
    link.download = songName;
    //lokacija na koju link vodi
    link.href = "/download/"+youtubeId;
    //dodavanje linka na stranicu
    document.body.appendChild(link);
    //aktivacija linka, automatski se radi GET zahtjev na uri
    link.click();
    //uklanjanje linka
    document.body.removeChild(link);
    delete link;
}


// dohvaćanje podataka o pjesmi
async function fetchSongData (uri) {
    // uri = “/getName/”+trackId
    let data = await fetch(uri).then(response => response.json());
    // data je oblika {"songName":songData.name,"songArtists":artistList,"songDuration":songData.duration_ms
    return data;
}

// objekt s regexima za prepoznavanje poveznica
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
    },
    youtubeVideoV1: {
        regex: /^https:\/\/www\.youtube\.com\/watch\?v=(?<id>\w{11})/,
        endpoint: "youtubeVideo"
    },
    youtubeVideoV2: {
        regex: /^https:\/\/www\.youtu.be\.com\/(?<id>\w{11})/,
        endpoint: "youtubeVideo"
    }
};

// funkcija obrađuje unesenu poveznicu, vraća id pjesme
const getYoutubeLinks = async (spotifyLink) => {
    const type = Object.values(LINK_TYPES).find(({ regex }) => regex.test(spotifyLink)); //klasificiranje tipa poveznice
    if (!type) {
        return null;
    }
    const id = type.regex.exec(spotifyLink).groups.id; //ekstraktiranje id-a poveznice
    if (!id) {
        return null;
    }
    const uri =  "/" + type.endpoint + "/" + id; //kreiranje uri na serveru
    const response = await fetch(uri); // get request do uri-a
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
        if(links === null){       //slučaj da je link krivi
            alert('Invalid link');
            return;
        }
        if(!Array.isArray(links)){ //slučaj kad je u pitanju youtube video
            //pozivanje funkcije za skidanje audiozapisa YouTube videozapisa
            downloadYoutubeVideo(links["id"],links["name"]); 
        }
        else{                   //slučaj kad je u pitanju spotify pjesma, playlista, album
           
            links.forEach(async (trackId) => {
                //pozivanje funkcije za dohvaćanje podataka o pjesmi
                let sngData = await fetchSongData("/getName/"+trackId);
                // pretvaranje JSON objekta u string
                let sngDataJson = JSON.stringify(sngData); 
                //pozivanje funkcije za skidanje pjesme sa Spotify-a
                downloadFile(`/download/data?json=${encodeURIComponent(sngDataJson)}`,sngData)
            });
        }        
    });
})
