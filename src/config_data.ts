/// <reference path="../typings/tsd.d.ts" />

var augmentData = require('./data_augmentation').augmentData;
var CategoryData = require('./category_data').CategoryData;

var async = require("async");
var fs = require("fs");
var ini = require('ini');
var THINGS = [
    'item',
    'capsule',
    'fluid',
    'gun',
    'ammo',
    'armor',
    'mining-tool',
    'module',
    'blueprint',
    'deconstruction-item',
    'repair-tool'
];

interface ConfigInfo {
    name: string;
    version: string;
    title: string;
    description: string;
    mods: Array<string>;
}

class ConfigData {
    data:any;
    info:ConfigInfo;
    locale:any;
    craftCatMap:any;
    recipeTechUnlock:any = {};
    catdata:any;

    constructor(public packid:string, public packName:string, public packPath:string) {
        var that = this;
        async.parallel([
            function (cb) {
                that.info = JSON.parse(fs.readFileSync(that.packPath + '/info.json'));
                cb();
            },
            function (cb) {
                that.data = JSON.parse(fs.readFileSync(that.packPath + '/out'));
                cb();
            },
            function (cb) {
                that.locale = ini.parse(fs.readFileSync(that.packPath + '/localedump.cfg', 'utf8'));
                cb();
            }
        ], function () {
            augmentData(that);
            that.catdata = new CategoryData(that.data);

            if (that.packid != that.info.name) {
                console.log('Config pack id != info name (' + that.packid + ' != ' + that.info.name + ')');
            }

            console.log("Loaded", that.packName);
        });
    }

    recipesWithResult(name) {
        var keysRecipe = Object.keys(this.data.recipe);
        var results = [];

        for (var i = 0; i < keysRecipe.length; i++) {
            var r = this.data.recipe[keysRecipe[i]];
            if (r.category == 'recycling') {
                continue;
            }
            if (r.result == name) {
                results.push(r);
            } else if (r.results) {
                for (var result in r.results) {
                    result = r.results[result];
                    if (result.name == name) {
                        results.push(r);
                        break;
                    }
                }
            }
        }

        return results;
    }

    recipesWithIngredient(name) {
        var keysRecipe = Object.keys(this.data.recipe);
        var results = [];

        for (var i = 0; i < keysRecipe.length; i++) {
            var r = this.data.recipe[keysRecipe[i]];
            for (var j = 0; j < r.ingredients.length; j++) {
                var ing = r.ingredients[j];
                if (ing.name == name) {
                    results.push(r);
                }
            }
        }

        return results;
    }

    findByName(name) {
        var keysData = Object.keys(this.data);
        var result = [];

        for (var i = 0; i < keysData.length; i++) {
            var key = keysData[i];
            if (this.data[key][name]) {
                result.push(this.data[key][name]);
            }
        }

        return result;
    }

    findCraftableByName(name) {
        for (var c in THINGS) {
            if (this.data[THINGS[c]][name]) {
                return this.data[THINGS[c]][name]
            }
        }
        return name;
    }

    getFirstRecipeByResultWithIngredients(name) {
        var recipes = this.recipesWithResult(name);
        if (!recipes) {
            return undefined;
        }
        for (var i = 0; i < recipes.length; i++) {
            var r = recipes[i];
            if (Object.keys(r.ingredients).length) {
                return r;
            }
        }
        return recipes[0];
    }

    _lookupTitleByName(name) {
        return this.locale['entity-name'][name] || this.locale['item-name'][name] || this.locale['fluid-name'][name] || this.locale['recipe-name'][name] || this.locale['technology-name'][name] || this.locale['equipment-name'][name] || this.locale['tile-name'][name] || name;
    }

    findTitle(name) {
        var title = this._lookupTitleByName(name);
        if (title !== name) {
            return title;
        }

        title = title.split('-');
        var localeNum = title[title.length - 1];
        if (localeNum * 1 == localeNum) {
            title.splice(title.length - 1, 1);
            title = title.join('-');
            return this._lookupTitleByName(title) + ' ' + localeNum;
        }
        return title;
    }

    searchNameTitle(name) {
        var results = [];
        name = name.toLowerCase();
        for (var k in THINGS) {
            k = THINGS[k];
            for (var i in this.data[k]) {
                i = this.data[k][i];
                if (i.name.indexOf(name) !== -1) {
                    results.push(i);
                }
            }
        }
        return results;
    }

}

export = ConfigData