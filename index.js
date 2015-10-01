'use strict';
let fs = require('fs'),
  ytdl = require('ytdl-core'),
  ffmpeg = require('fluent-ffmpeg');

let options = {
  quality: 'highest',
  downloadURL: true,
  filter: 'audioonly'
}

// let video = ytdl('https://www.youtube.com/watch?v=rId6PKlDXeU', options);
//
//
//
// video.on('info', (info, format) => {
//   fs.stat('./musics', (err, stats) => {
//     if (err) {
//       fs.mkdirSync('./musics');
//     }
//     createSong('./musics/' + info.title, video, 320);
//   });
// })


function createSong(title, stream, bitrate) {
  new ffmpeg(stream)
    .audioBitrate(bitrate)
    .saveToFile(title + '.mp3')
}

function checkTypeAndPopulate(id, cb) {
  if (!id) cb("You must pass an id to ytmp3!", null);
  let variable;
  if (id.constructor === Array) {
    variable = id.map((val) => 'https://www.youtube.com/watch?v=' + val);
  } else if (id.constructor === Object) {
    variable = [];
    for (var key in id)
      if (id.hasOwnProperty(key)) {
        variable.push(id[key]);
      }
  } else {
    variable = [id];
  }
  cb(null, variable)
}


module.exports = function ytmp3(ytID, path, cb) {
  let _vid;
  checkTypeAndPopulate(ytID, (err, data) => {
    if (err) throw err;
    _vid = data;
  })
  console.log(_vid);

};
