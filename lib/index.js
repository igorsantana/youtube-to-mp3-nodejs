'use strict';
let fs = require('fs'),
  ytdl = require('ytdl-core'),
  ffmpeg = require('fluent-ffmpeg'),
  cheerio = require('cheerio'),
  request = require('request'),
  events = require('events'),
  numVideos = 0;

function checkTypeAndPopulate(id) {
  let self = this;
  if (!id) {
    self.emit('error', 'You must pass a id to YTTOMP3');
    return;
  }
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
  return variable;
}

function createSong(path, title, stream, bitrate) {
  let self = this;
  let x = new ffmpeg(stream)
    .audioBitrate(bitrate)
    .saveToFile(path + title + '.mp3')
    .on('error', (err) => self.emit('error', err))
    .on('end', function() {
      numVideos--;
      self.emit('conversion', title);
      if (!numVideos) {
        self.emit('finished');
        return;
      }
    })
}

function playlistDownload(plID, path) {
  let url = 'http://www.youtube.com/playlist?list=' + plID,
    self = this;
  request(url, (err, res, html) => {
    let $ = cheerio.load(html),
      videos = $('tr[data-video-id]'),
      idVideos = [];
    for (let vid in videos)
      if (videos.hasOwnProperty(vid) && videos[vid].attribs) {
        idVideos.push(videos[vid].attribs['data-video-id']);
      }
    self.videoDownload(idVideos, path);
  })
}

function videoDownload(ytID, path) {
  let _vid,
    options = {
      quality: 'highest',
      downloadURL: true,
      filter: 'audioonly'
    },
    self = this;
  _vid = checkTypeAndPopulate(ytID);
  let streams = _vid.forEach((val) => {
    numVideos++;
    let _stream = ytdl(val, options);
    _stream
      .on('info', (info, format) => {
        fs.stat(path, (err, stats) => {
          if (err) {
            fs.mkdirSync(path);
          }
          self.emit('download', info.title);
          self.createSong(path, info.title, _stream, 192);
        });
      })
      .on('error', (err) => {
        self.emit('error', err);
        numVideos--;
      });
  })
}

function YoutubeToMp3() {};
YoutubeToMp3.prototype = new events.EventEmitter
YoutubeToMp3.prototype.playlistDownload = playlistDownload;
YoutubeToMp3.prototype.videoDownload = videoDownload;
YoutubeToMp3.prototype.checkTypeAndPopulate = checkTypeAndPopulate;
YoutubeToMp3.prototype.createSong = createSong;
module.exports = YoutubeToMp3;
