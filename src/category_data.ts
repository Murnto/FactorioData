/// <reference path="./category_data_infos.ts" />

import {getCategories} from "./category_data_infos";

export class CategoryData {
    public CATEGORIES:any = getCategories();
    private actualCategories:any = [];

    constructor(rawData:any) {
        let keys:string[] = Object.keys(this.CATEGORIES);
        for (let i:number = 0; i < keys.length; i++) {
            let v:any = this.CATEGORIES[keys[i]];
            extractHeaders(v.info, v.headers = []);

            v.data = [];

            let data:any = rawData[keys[i]];
            let dkeys:string[] = Object.keys(data);
            for (let j:number = 0; j < dkeys.length; j++) {
                let d:any = data[dkeys[j]];

                if (d.icon && d.icon.indexOf("__Cursed-Exp__") === 0) {
                    continue;
                }

                let entry:any = [];
                v.data.push(entry);
                entry.name = d.name;
                entry.title = d.title;
                entry.type = d.type;
                extractData(d, v.info, entry);
            }

            if (v.headers.length > 0) {
                this.actualCategories.push({
                    "name": keys[i],
                    "title": v.name,
                    "icon_type": v.data[0].type,
                    "icon_name": v.data[0].name,
                });
            }
        }
    }
}

function extractHeaders(info:any, headers:string[]):void {
    "use strict";
    // console.log("extract", info, headers);
    let keys:string[] = Object.keys(info);
    for (let i:number = 0; i < keys.length; i++) {
        let k:string = keys[i];
        let obj:any = info[k];

        if (typeof obj === "object" && !Array.isArray(obj)) {
            extractHeaders(obj, headers);
        } else {
            let header:string;
            if (Array.isArray(obj)) {
                header = obj[0];
            } else {
                header = obj;
            }
            headers.push(header);
        }
    }
}

function round(value:number, decimals:number):number {
    "use strict";

    return Number(Math.round(<any> (value + "e" + decimals)) + "e-" + decimals);
}

function extractData(data:any, info:any, colData:any):void {
    "use strict";
    // console.log("extract", info, colData);
    let keys:string[] = Object.keys(info);
    for (let i:number = 0; i < keys.length; i++) {
        let k:string = keys[i];
        let obj:any = info[k];

        if (data === undefined) {
            colData.push("?");
        } else if (typeof obj === "object" && !Array.isArray(obj)) {
            extractData(data[k], obj, colData);
        } else {
            let colEntry:any;
            if (Array.isArray(obj)) {
                colEntry = obj[1](data[k]);
            } else {
                colEntry = data[k];
                if (colEntry * 1 === colEntry) {
                    colEntry = round(colEntry * 1, 2);
                }
            }
            colData.push(colEntry);
        }
    }
}

