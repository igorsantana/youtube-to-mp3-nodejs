'use strict';
let Yt = require('./lib/index'),
  teste = new Yt();
// teste.videoDownload(['rId6PKlDXeU', 'sXzDu071RdQ', '1N8BYNMMjqU'], './musics/', (data) => console.log(data));


teste
  .on('download', (title) => console.log('Download: ' + title))
  .on('conversion', (title) => console.log('Conversion: ' + title))
  .on('finished', () => console.log('Everything is over now'));
