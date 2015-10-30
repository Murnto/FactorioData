import ConfigData = require('./config_data');
import fs = require('fs');

module FactorioData {
    var packs = {};
    export var packInfos = [];

    function loadPacks() {
        var PACK_DIR = 'public/pack';

        var dirs = fs.readdirSync(PACK_DIR);
        for (var i in dirs) {
            var dir = dirs[i];
            var stats = fs.lstatSync(PACK_DIR + '/' + dir);

            if (stats.isDirectory() && dir != '.git') {
                var pack = loadPack(dir, dir);
                packInfos.push(pack.info);
            }
        }

        for (var i in dirs) {
            var dir = dirs[i];
            var stats = fs.lstatSync(PACK_DIR + '/' + dir);

            if (stats.isFile() && dir.indexOf('.') === -1) {
                var content = fs.readFileSync(PACK_DIR + '/' + dir, 'utf8').trim();
                packs[dir] = packs[content];
                console.log('Map', dir, 'to', content);
            }
        }
    }

    function loadPack(packid, name) {
        var pack = new ConfigData(packid, name, 'public/pack/' + packid);
        packs[packid] = pack;
        return pack;
    }

    export function getPack(pack):ConfigData {
        return packs[pack];
    }

    loadPacks();
}

export = FactorioData