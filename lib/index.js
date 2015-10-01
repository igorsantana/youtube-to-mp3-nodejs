'use strict';
let fs = require('fs'),
  ytdl = require('ytdl-core'),
  ffmpeg = require('fluent-ffmpeg');

function createSong(path, title, stream, bitrate) {
  let x = new ffmpeg(stream)
    .audioBitrate(bitrate)
    .saveToFile(path + title + '.mp3')
    .on('error', function(err) {
      console.log('An error occurred: ' + err.message);
    })
    .on('end', function() {
      console.timeEnd(title);
      console.log('The file: (' + title + ') was successfully downloaded.');
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
  cb(null, variable)
}


module.exports = function ytmp3(ytID, path, cb) {
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
  let streams = _vid.map((val) => ytdl(val, options)).forEach((val) => {
    val.on('info', (info, format) => {
      console.time(info.title);
      fs.stat(path, (err, stats) => {
        if (err) {
          fs.mkdirSync(path);
        }
        createSong(path, info.title, val, 192);
      });
    })
  });
};
