const YTDlpWrap = require("yt-dlp-wrap").default;
const ffmpeg = require("fluent-ffmpeg");
const MemoryStream = require("memorystream");
const ytDlpWrap = new YTDlpWrap("/usr/bin/yt-dlp");

const downloadFromYoutube = url => {
    const stream = new MemoryStream();
    ytDlpWrap.execStream([url, "-x"]).pipe(stream);

    return ffmpeg()
        .input(stream)
        .noVideo()
        .toFormat("mp3");
};

module.exports = { downloadFromYoutube };
