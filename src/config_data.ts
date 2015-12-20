/// <reference path="../typings/tsd.d.ts" />

import {augmentData} from "./data_augmentation";
import {CategoryData} from "./category_data";

import * as async from "async";
import * as fs from "fs";
import * as ini from "ini";

let ENTITY_TYPES:string[] = [
    "item",
    "capsule",
    "fluid",
    "tool",
    "gun",
    "ammo",
    "armor",
    "mining-tool",
    "module",
    "blueprint",
    "deconstruction-item",
    "repair-tool",
];

export interface IConfigInfo {
    name: string;
    version: string;
    title: string;
    description: string;
    mods: Array<string>;
}

export class ConfigData {
    public packid:string;
    public packName:string;
    public packPath:string;
    public data:any;
    public info:IConfigInfo;
    public locale:any;
    public craftCatMap:any;
    public recipeTechUnlock:any = {};
    public catdata:any;

    constructor(packid:string, packName:string, packPath:string) {
        this.packid = packid;
        this.packName = packName;
        this.packPath = packPath;

        let that:ConfigData = this;
        async.parallel([
            function (cb:Function):void {
                that.info = JSON.parse(<any> fs.readFileSync(that.packPath + "/info.json"));
                cb();
            },
            function (cb:Function):void {
                that.data = JSON.parse(<any> fs.readFileSync(that.packPath + "/out"));
                cb();
            },
            function (cb:Function):void {
                that.locale = ini.parse(<any> fs.readFileSync(that.packPath + "/localedump.cfg", "utf8"));
                cb();
            },
        ], function ():void {
            augmentData(that);
            that.catdata = new CategoryData(that.data);

            if (that.packid !== that.info.name) {
                console.log("Config pack id != info name (" + that.packid + " != " + that.info.name + ")");
            }

            console.log("Loaded", that.packName);
        });
    }

    public recipesWithResult(name:string):any[] {
        let keysRecipe:string[] = Object.keys(this.data.recipe);
        let results:any[] = [];

        for (let i:number = 0; i < keysRecipe.length; i++) {
            let r:any = this.data.recipe[keysRecipe[i]];
            if (r.category === "recycling") {
                continue;
            }
            if (r.result === name) {
                results.push(r);
            } else if (r.results) {
                for (let resIdx:number = 0; resIdx < r.results.length; resIdx++) {
                    let result:any = r.results[resIdx];

                    if (result.name === name) {
                        results.push(r);
                        break;
                    }
                }
            }
        }

        return results;
    }

    public recipesWithIngredient(name:string):any[] {
        let keysRecipe:string[] = Object.keys(this.data.recipe);
        let results:any = [];

        for (let i:number = 0; i < keysRecipe.length; i++) {
            let r:any = this.data.recipe[keysRecipe[i]];
            for (let j:number = 0; j < r.ingredients.length; j++) {
                let ing:any = r.ingredients[j];
                if (ing.name === name) {
                    results.push(r);
                }
            }
        }

        return results;
    }

    public findByName(name:string):any {
        let keysData:string[] = Object.keys(this.data);
        let result:any = [];

        for (let i:number = 0; i < keysData.length; i++) {
            let key:string = keysData[i];
            if (this.data[key][name]) {
                result.push(this.data[key][name]);
            }
        }

        return result;
    }

    public findCraftableByName(name:string):any {
        for (let typeidx:number = 0; typeidx < ENTITY_TYPES.length; typeidx++) {
            let entityType:string = ENTITY_TYPES[typeidx];

            if (this.data[entityType] && this.data[entityType][name]) {
                return this.data[entityType][name];
            }
        }
        return name;
    }

    public getFirstRecipeByResultWithIngredients(name:string):any {
        let recipes:any = this.recipesWithResult(name);
        if (!recipes) {
            return undefined;
        }
        for (let i:number = 0; i < recipes.length; i++) {
            let r:any = recipes[i];
            if (Object.keys(r.ingredients).length) {
                return r;
            }
        }
        return recipes[0];
    }

    public findTitle(name:string):string {
        let title:string = this._lookupTitleByName(name);
        if (title !== name) {
            return title;
        }

        let tsplit:string[] = title.split("-");
        let localeNum:string = tsplit[tsplit.length - 1];
        /* tslint:disable */
        // (ab)using == to check if number
        if (<any>localeNum * 1 == <any>localeNum) { // check if this is a technology level name
            /* tslint:enable */
            tsplit.splice(tsplit.length - 1, 1);
            title = tsplit.join("-");
            return this._lookupTitleByName(title) + " " + localeNum;
        }
        return name;
    }

    /**
     * Search entities by name or title
     * @param name or title
     * @returns {Array}
     */
    public searchEntities(name:string):any[] {
        let results:any[] = [];
        name = name.toLowerCase();
        for (let typeidx:number = 0; typeidx < ENTITY_TYPES.length; typeidx++) {
            let entityType:string = ENTITY_TYPES[typeidx];
            if (!this.data[entityType]) {
                continue;
            }

            for (let entName in this.data[entityType]) {
                if (!this.data[entityType].hasOwnProperty(entName)) {
                    continue;
                }
                let entityDef:any = this.data[entityType][entName];

                if (entityDef.name.indexOf(name) !== -1
                    || entityDef.title.toLowerCase().indexOf(name) !== -1) {
                    results.push(entityDef);
                }
            }
        }
        return results;
    }

    private _lookupTitleByName(name:string):string {
        return this.locale["entity-name"][name] || this.locale["item-name"][name] || this.locale["fluid-name"][name] || this.locale["recipe-name"][name] || this.locale["technology-name"][name] || this.locale["equipment-name"][name] || this.locale["tile-name"][name] || name;
    }

}
