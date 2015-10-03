'use strict';
let fs = require('fs'),
  ytdl = require('ytdl-core'),
  ffmpeg = require('fluent-ffmpeg'),
  cheerio = require('cheerio'),
  request = require('request'),
  numVideos = 0;

function createSong(path, title, stream, bitrate, cb) {
  let x = new ffmpeg(stream)
    .audioBitrate(bitrate)
    .saveToFile(path + title + '.mp3')
    .on('error', function(err) {
      console.log('An error occurred: ' + err.message);
    })
    .on('end', function() {
      numVideos--;
      if (!numVideos) {
        cb('done');
      }
    })
}


function checkTypeAndPopulate(id, cb) {
  if (!id) cb("You must pass an id to ytmp3!", null);
  let variable = [],
    youtubeString = 'https://www.youtube.com/watch?v=';
  if (id.constructor === Array) {
    variable = id.map((val) => youtubeString + val);
  } else if (id.constructor === Object) {
    for (var key in id)
      if (id.hasOwnProperty(key)) {
        variable.push(youtubeString + id[key]);
      }
  } else {
    variable.push(youtubeString + id);
  }
  cb(null, variable);
}


exports.videoDownload = (ytID, path, cb) => {
  let _vid,
    options = {
      quality: 'highest',
      downloadURL: true,
      filter: 'audioonly'
    };
  checkTypeAndPopulate(ytID, (err, data) => {
    if (err) throw err;
    _vid = data;
  })
  let streams = _vid.forEach((val) => {
    numVideos++;
    let _stream = ytdl(val, options);
    _stream
      .on('info', (info, format) => {
        fs.stat(path, (err, stats) => {
          if (err) {
            fs.mkdirSync(path);
          }
          createSong(path, info.title, _stream, 192, cb);
        });
      })
      .on('error', (err) => console.log(err));

  })
};

exports.playlistDownload = (plID, path, cb) => {
  let url = 'http://www.youtube.com/playlist?list=' + plID;
  request(url, (err, res, html) => {
    let $ = cheerio.load(html),
      videos = $('tr[data-video-id]'),
      idVideos = [];
    for (let vid in videos)
      if (videos.hasOwnProperty(vid) && videos[vid].attribs) {
        idVideos.push(videos[vid].attribs['data-video-id']);
      }
    this.videoDownload(idVideos, path, cb);
  })
}
