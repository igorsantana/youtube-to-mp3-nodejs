'use strict';
let svv = require('./lib/index');
// svv(['rId6PKlDXeU', 'sXzDu071RdQ','1N8BYNMMjqU'], './musics/');
// svv('zvCBSSwgtg4', './musics/')
svv.playlistDownload('PLnaSPks1YwbDsiOWbuOTi-B2yezM0t1tW', './musics/', (data) => console.log(data));
console.log(svv);
