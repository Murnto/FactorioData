import ConfigData = require('./config_data');
import fs = require('fs');

var PACK_DIR = 'public/pack';

module FactorioData {
    var packs = {};
    export var packInfos = [];

    function loadPacks():void {
        var dirs = fs.readdirSync(PACK_DIR);
        for (var i in dirs) {
            var dir = dirs[i];
            var stats = fs.lstatSync(PACK_DIR + '/' + dir);

            if (stats.isDirectory() && dir != '.git') {
                var pack = loadPack(dir, dir);

                packInfos.push(pack.info);
            } else if (stats.isFile() && dir.indexOf('.') === -1) { // perform linking of packs (eg. default)
                var content = fs.readFileSync(PACK_DIR + '/' + dir, 'utf8').trim();
                packs[dir] = packs[content];

                console.log('Map', dir, 'to', content);
            }
        }
    }

    function loadPack(packid, name):ConfigData {
        var pack = new ConfigData(packid, name, PACK_DIR + '/' + packid);
        packs[packid] = pack;
        return pack;
    }

    export function getPack(pack):ConfigData {
        return packs[pack];
    }

    loadPacks();
}

export = FactorioData