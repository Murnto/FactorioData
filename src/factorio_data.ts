import {ConfigData, IConfigInfo} from "./config_data";
import * as fs from "fs";

let PACK_DIR:string = "public/pack";

module FactorioData {
    "use strict";

    let packs:{[index: string]: ConfigData} = {};
    export let packInfos:IConfigInfo[] = [];

    function loadPacks():void {
        let dirs:string[] = fs.readdirSync(PACK_DIR);
        for (let i in dirs) {
            if (!dirs.hasOwnProperty(i)) {
                continue;
            }

            let dir:string = dirs[i];
            let stats:fs.Stats = fs.lstatSync(PACK_DIR + "/" + dir);

            if (stats.isDirectory() && dir !== ".git") {
                let pack:ConfigData = loadPack(dir, dir);

                packInfos.push(pack.info);
            }
        }

        for (let i in dirs) {
            if (!dirs.hasOwnProperty(i)) {
                continue;
            }

            let dir:string = dirs[i];
            let stats:fs.Stats = fs.lstatSync(PACK_DIR + "/" + dir);

            if (stats.isFile() && dir.indexOf(".") === -1) { // perform linking of packs (eg. default)
                let content:string = fs.readFileSync(PACK_DIR + "/" + dir, "utf8").trim();
                packs[dir] = packs[content];

                console.log("Map", dir, "to", content);
            }
        }
    }

    function loadPack(packid:string, name:string):ConfigData {
        let pack:ConfigData = new ConfigData(packid, name, PACK_DIR + "/" + packid);
        packs[packid] = pack;
        return pack;
    }

    export function getPack(pack:string):ConfigData {
        return packs[pack];
    }

    loadPacks();
}

export = FactorioData
