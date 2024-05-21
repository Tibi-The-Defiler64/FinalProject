const YTDlpWrap = require("yt-dlp-wrap").default;
const ffmpeg = require("fluent-ffmpeg");
const MemoryStream = require("memorystream");
const ytDlpWrap = new YTDlpWrap("/usr/bin/yt-dlp");

//funkcija kreira mp3 stream
const downloadFromYoutube = url => {
    //stvaranje instance klase MemoryStream()
    const stream = new MemoryStream();
    //pozivanje yt-dlp metode za skidanje pjesme i stavljanje u oblik streama
    //taj se stream onda stavlja u varijablu stream
    ytDlpWrap.execStream([url, "-x"]).pipe(stream);
    //streamu se konfigurira format u mp3 i vraća se stream
    return ffmpeg()
        .input(stream)
        .noVideo()
        .toFormat("mp3");
};

module.exports = { downloadFromYoutube };
