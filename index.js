'use strict';
let fs = require('fs'),
  ytdl = require('ytdl-core'),
  http = require('http'),
  ffmpeg = require('fluent-ffmpeg'),
  proc = undefined;
let options = {
  quality: 'highest',
  downloadURL: true,
  filter: 'audioonly'
}

let video = ytdl('https://www.youtube.com/watch?v=rId6PKlDXeU', options);



video.on('info', (info, format) => {
  fs.stat('./musics', (err, stats) => {
    if (err) {
      fs.mkdirSync('./musics');
    }
    createSong('./musics/' + info.title, video, 320);
  });
})


function createSong(title, stream, bitrate) {
  new ffmpeg(stream)
    .audioBitrate(bitrate)
    .saveToFile(title + '.mp3')
}
