'use strict';
let fs = require('fs'),
  ytdl = require('ytdl-core'),
  ffmpeg = require('fluent-ffmpeg');

function createSong(title, stream, bitrate) {
  new ffmpeg(stream)
    .audioBitrate(bitrate)
    .saveToFile(title + '.mp3')
}

function checkTypeAndPopulate(id, cb) {
  if (!id) cb("You must pass an id to ytmp3!", null);
  let variable = [];
  if (id.constructor === Array) {
    variable = id.map((val) => 'https://www.youtube.com/watch?v=' + val);
  } else if (id.constructor === Object) {
    for (var key in id)
      if (id.hasOwnProperty(key)) {
        variable.push(id[key]);
      }
  } else {
    variable.push(id);
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
      fs.stat(path, (err, stats) => {
        if (err) {
          fs.mkdirSync(path);
        }
        createSong(path + info.title, val, 320);
      });
    })
  });
};
