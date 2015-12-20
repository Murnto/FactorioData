import {ConfigData} from "./config_data";

export function augmentData(cfgd:ConfigData):void {
    "use strict";

    preProcessData(cfgd);
    unifyRecipeResults(cfgd);
    unifyRecipeIngredients(cfgd);
    cfgd.craftCatMap = mapAssemblers(cfgd);
    mapRecipeCatAssemblers(cfgd, cfgd.craftCatMap);
    attachLocaleToData(cfgd);
    augmentTech(cfgd);
}

function preProcessData(cfgd:ConfigData):void {
    "use strict";

    let data:any = cfgd.data;

    _preProcessData(data.technology, "prerequisites");
    _preProcessData(data.technology, "effects");
    _preProcessData(data.technology, "unit", "ingredients");
    _preProcessData(data.recipe, "ingredients");
    _preProcessData(data.recipe, "results");
    _preProcessData(data["mining-drill"], "resource_categories");
    _preProcessData(data["assembling-machine"], "crafting_categories");
    _preProcessData(data.furnace, "crafting_categories");
}

function _preProcessData(obj:any, ...keys:string[]):void {
    "use strict";

    let objKeys:string[] = Object.keys(obj);
    for (let i:number = 0; i < objKeys.length; i++) {
        let item:any = obj[objKeys[i]];
        for (let j:number = 0; j < keys.length - 1 && item; j++) {
            item = item[keys[j]];
        }
        if (item[keys[keys.length - 1]]) {
            if (typeof item[keys[keys.length - 1]] === "string") {
                item[keys[keys.length - 1]] = [item[keys[keys.length - 1]]];
            } else {
                item[keys[keys.length - 1]] = covertToList(item[keys[keys.length - 1]]);
            }
        }
    }
}

function unifyRecipeResults(cfgd:ConfigData):void {
    "use strict";

    let data:any = cfgd.data;
    let recipeKeys:string[] = Object.keys(data.recipe);
    for (let i:number = 0; i < recipeKeys.length; i++) {
        let r:any = data.recipe[recipeKeys[i]];
        if (r.result) {
            r.results = [
                {
                    amount: r.result_count,
                    name: r.result,
                    type: cfgd.findCraftableByName(r.result).type,
                },
            ];

            delete r.result;
            delete r.result_count;
        } else if (r.results) {
            let rslts:any[] = [];

            for (let j:number = 0; j < r.results.length; j++) {
                let rslt:any = r.results[j];

                if (rslt["1"]) {
                    rslts.push({
                        amount: rslt["2"],
                        name: rslt["1"],
                        type: cfgd.findCraftableByName(rslt["1"]).type,
                    });
                } else {
                    rslts.push(rslt);
                }
            }

            r.results = rslts;
        }
    }
}

function unifyRecipeIngredients(cfgd:ConfigData):void {
    "use strict";

    let data:any = cfgd.data;
    let recipeKeys:string[] = Object.keys(data.recipe);
    for (let i:number = 0; i < recipeKeys.length; i++) {
        let r:any = data.recipe[recipeKeys[i]];

        if (r.ingredients.length && r.ingredients[0]["1"]) {
            let fixedIngredients:any[] = [];

            for (let j:number = 0; j < r.ingredients.length; j++) {
                let ingd:any = r.ingredients[j];

                if (ingd["1"]) {
                    fixedIngredients.push({
                        amount: ingd["2"],
                        name: ingd["1"],
                        type: cfgd.findCraftableByName(ingd["1"]).type,
                    });
                } else {
                    fixedIngredients.push(ingd);
                }
            }

            r.ingredients = fixedIngredients;
        }
    }
}

function augmentTech(cfgd:ConfigData):void {
    "use strict";

    let data:any = cfgd.data;
    let techKeys:string[] = Object.keys(data.technology);
    let recipeKeys:string[] = Object.keys(data.recipe);

    for (let keyIdx:number = 0; keyIdx < techKeys.length; keyIdx++) {
        data.technology[techKeys[keyIdx]].allows = [];
    }

    for (let keyIdx:number = 0; keyIdx < recipeKeys.length; keyIdx++) {
        data.recipe[recipeKeys[keyIdx]].unlock_by = [];
    }

    for (let keyIdx:number = 0; keyIdx < techKeys.length; keyIdx++) {
        let tech:any = data.technology[techKeys[keyIdx]];

        for (let i:number = 0; tech.effects && i < tech.effects.length; i++) {
            let effect:any = tech.effects[i];

            if (effect.type === "unlock-recipe") {
                cfgd.recipeTechUnlock[effect.recipe] = tech.name;
                if (data.recipe[effect.recipe]) { // some tech unlock non-existent recipes
                    data.recipe[effect.recipe].unlock_by.push(tech.name);
                }
            }
        }

        for (let i:number = 0; tech.prerequisites && i < tech.prerequisites.length; i++) {
            let prereq:any = tech.prerequisites[i];
            data.technology[prereq].allows.push(tech.name);
        }
    }
}

function mapAssemblers(cfgd:ConfigData):any {
    "use strict";

    let data:any = cfgd.data;
    let keysAssem:string[] = Object.keys(data["assembling-machine"]);
    let keysFurn:string[] = Object.keys(data.furnace);
    let result:any = {};

    function work(crafter:any):void {
        let ccKeys:string[] = Object.keys(crafter.crafting_categories);
        for (let ci:number = 0; ci < ccKeys.length; ci++) {
            let cat:any = crafter.crafting_categories[ccKeys[ci]];
            if (!result[cat]) {
                result[cat] = [crafter];
            } else {
                result[cat].push(crafter);
            }
        }
    }

    for (let i:number = 0; i < keysAssem.length; i++) {
        let assem:any = data["assembling-machine"][keysAssem[i]];
        work(assem);
    }

    for (let i:number = 0; i < keysFurn.length; i++) {
        let assem:any = data.furnace[keysFurn[i]];
        work(assem);
    }

    // console.log(result);

    return result;
}

function mapRecipeCatAssemblers(cfgd:ConfigData, craftCatMap:any):any[] {
    "use strict";

    let data:any = cfgd.data;
    let keysRecipe:string[] = Object.keys(data.recipe);
    let results:any[] = [];

    for (let i:number = 0; i < keysRecipe.length; i++) {
        let r:any = data.recipe[keysRecipe[i]];
        r.assemblerMap = craftCatMap[r.category];
    }

    return results;
}

function attachLocaleToData(cfgd:ConfigData):void {
    "use strict";

    let data:any = cfgd.data;

    let keysData:string[] = Object.keys(data);

    for (let i:number = 0; i < keysData.length; i++) {
        let key:string = keysData[i];
        let keys:string[] = Object.keys(data[key]);
        for (let j:number = 0; j < keys.length; j++) {
            let item:any = data[key][keys[j]];
            item.name = item.name.toLowerCase();
            item.title = cfgd.findTitle(item.name);
        }
    }
}

export function covertToList(someData:any):any[] {
    "use strict";

    let keys:string[] = Object.keys(someData);
    let result:any[] = [];

    for (let i:number = 0; i < keys.length; i++) {
        result.push(someData[keys[i]]);
    }

    return result;
}
