'use strict';
let Yt = require('./lib/index'),
  teste = new Yt();
teste.playlistDownload('PLnaSPks1YwbBzxhos17Hg758Y_EB8Nzbk', './musics/');


teste
  .on('download', (title) => console.log('Download: ' + title))
  .on('conversion', (title) => console.log('Conversion: ' + title))
  .on('error',(err)=> console.log(err))
  .on('finished', () => console.log('Everything is over now'));
