/// <reference path="./category_data_infos.ts" />

var CATEGORIES = require('./category_data_infos');

export class CategoryData {
    actual_categories:any = [];

    constructor(raw_data:any) {
        var keys = Object.keys(CATEGORIES);
        for (var i = 0; i < keys.length; i++) {
            var v = CATEGORIES[keys[i]];
            extractHeaders(v.info, v.headers = []);

            v.data = [];

            var data = raw_data[keys[i]];
            var dkeys = Object.keys(data);
            for (var j = 0; j < dkeys.length; j++) {
                var d = data[dkeys[j]];

                if (d.icon && d.icon.indexOf('__Cursed-Exp__') === 0) {
                    continue;
                }

                var entry:any = [];
                v.data.push(entry);
                entry.name = d.name;
                entry.title = d.title;
                entry.type = d.type;
                extractData(d, v.info, entry);
            }

            if (v.headers.length > 0) {
                this.actual_categories.push({
                    'name': keys[i],
                    'title': v.name,
                    'icon_type': v.data[0].type,
                    'icon_name': v.data[0].name
                })
            }
        }
    }
}

function extractHeaders(info, headers) {
    //console.log('extract', info, headers);
    var keys = Object.keys(info);
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        var obj = info[k];

        if (typeof obj === 'object' && !Array.isArray(obj)) {
            extractHeaders(obj, headers);
        } else {
            var header;
            if (Array.isArray(obj)) {
                header = obj[0];
            } else {
                header = obj;
            }
            headers.push(header);
        }
    }
}

function round(value, decimals) {
    return Number(Math.round(<any> (value + 'e' + decimals)) + 'e-' + decimals);
}

function extractData(data, info, colData) {
    //console.log('extract', info, colData);
    var keys = Object.keys(info);
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        var obj = info[k];

        if (data === undefined) {
            colData.push('?');
        } else if (typeof obj === 'object' && !Array.isArray(obj)) {
            extractData(data[k], obj, colData);
        } else {
            var colEntry;
            if (Array.isArray(obj)) {
                colEntry = obj[1](data[k]);
            } else {
                colEntry = data[k];
                if (colEntry * 1 == colEntry) {
                    colEntry = round(colEntry * 1, 2);
                }
            }
            colData.push(colEntry);
        }
    }
}

