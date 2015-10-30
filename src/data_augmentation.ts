import ConfigData = require('config_data');

export function augmentData(cfgd:ConfigData) {
    preProcessData(cfgd);
    unifyRecipeResults(cfgd);
    unifyRecipeIngredients(cfgd);
    //export var keysData = Object.keys(data);
    //export var keysRecipe = Object.keys(data.recipe);
    //export var keysAssem = Object.keys(data['assembling-machine']);
    //export var keysFurn = Object.keys(data.furnace);
    //export var keysItem = Object.keys(data.item);
    //export var keysFluid = Object.keys(data.fluid);
    cfgd.craftCatMap = mapAssemblers(cfgd);
    mapRecipeCatAssemblers(cfgd, cfgd.craftCatMap);
    attachLocaleToData(cfgd);
    augmentTech(cfgd);
    //keysData.splice(keysData.indexOf('autoplace-control'), 1);
    //keysData.splice(keysData.indexOf('noise-layer'), 1);
    //keysData.splice(keysData.indexOf('recipe'), 1);
    //keysData.splice(keysData.indexOf('noise_layer'), 1);
}

function preProcessData(cfgd) {
    var data = cfgd.data;
    _preProcessData(data.technology, 'prerequisites');
    _preProcessData(data.technology, 'effects');
    _preProcessData(data.technology, 'unit', 'ingredients');
    _preProcessData(data.recipe, 'ingredients');
    _preProcessData(data.recipe, 'results');
    _preProcessData(data['mining-drill'], 'resource_categories');
    _preProcessData(data['assembling-machine'], 'crafting_categories');
    _preProcessData(data['furnace'], 'crafting_categories');
}

function _preProcessData(obj, ...keys) {
    var objKeys = Object.keys(obj);
    for (var i = 0; i < objKeys.length; i++) {
        var item = obj[objKeys[i]];
        for (var j = 0; j < keys.length - 1 && item; j++) {
            item = item[keys[j]];
        }
        if (item[keys[keys.length - 1]]) {
            if (typeof item[keys[keys.length - 1]] === 'string') {
                item[keys[keys.length - 1]] = [item[keys[keys.length - 1]]];
            } else {
                item[keys[keys.length - 1]] = covertToList(item[keys[keys.length - 1]]);
            }
        }
    }
}

function unifyRecipeResults(cfgd) {
    var data = cfgd.data;
    var recipeKeys = Object.keys(data.recipe);
    for (var i = 0; i < recipeKeys.length; i++) {
        var r = data.recipe[recipeKeys[i]];
        if (r.result) {
            r.results = [
                {
                    amount: r.result_count,
                    name: r.result,
                    type: cfgd.findCraftableByName(r.result).type
                }
            ];

            delete r.result;
            delete r.result_count;
        } else if (r.results) {
            var rslts = [];

            for (var j = 0; j < r.results.length; j++) {
                var rslt = r.results[j];

                if (rslt["1"]) {
                    rslts.push({
                        name: rslt["1"],
                        amount: rslt["2"],
                        type: cfgd.findCraftableByName(rslt["1"]).type
                    })
                } else {
                    rslts.push(rslt)
                }
            }

            r.results = rslts;
        }
    }
}

function unifyRecipeIngredients(cfgd) {
    var data = cfgd.data;
    var recipeKeys = Object.keys(data.recipe);
    for (var i = 0; i < recipeKeys.length; i++) {
        var r = data.recipe[recipeKeys[i]];

        if (r.ingredients.length && r.ingredients[0]["1"]) {
            var ingds = [];

            for (var j = 0; j < r.ingredients.length; j++) {
                var ing = r.ingredients[j];

                if (ing["1"]) {
                    ingds.push({
                        name: ing["1"],
                        amount: ing["2"],
                        type: cfgd.findCraftableByName(ing["1"]).type
                    })
                } else {
                    ingds.push(ing)
                }
            }

            r.ingredients = ingds;
        }
    }
}

function augmentTech(cfgd) {
    var data = cfgd.data;
    var techKeys = Object.keys(data.technology);
    var recipeKeys = Object.keys(data.recipe);

    for (var key in techKeys) {
        data.technology[techKeys[key]].allows = [];
    }

    for (var key in recipeKeys) {
        data.recipe[recipeKeys[key]].unlock_by = [];
    }

    for (var key in techKeys) {
        var tech = data.technology[techKeys[key]];

        for (var i = 0; tech.effects && i < tech.effects.length; i++) {
            var effect = tech.effects[i];

            if (effect.type == "unlock-recipe") {
                cfgd.recipeTechUnlock[effect.recipe] = tech.name;
                if (data.recipe[effect.recipe]) { // some tech unlock non-existent recipes
                    data.recipe[effect.recipe].unlock_by.push(tech.name);
                }
            }
        }

        for (var i = 0 ; tech.prerequisites && i < tech.prerequisites.length; i++) {
            var prereq = tech.prerequisites[i];
            data.technology[prereq].allows.push(tech.name);
        }
    }
}

function mapAssemblers(cfgd) {
    var data = cfgd.data;
    var keysAssem = Object.keys(data['assembling-machine']);
    var keysFurn = Object.keys(data.furnace);
    var result = {};

    function work(crafter) {
        var ccKeys = Object.keys(crafter.crafting_categories);
        for (var ci = 0; ci < ccKeys.length; ci++) {
            var cat = crafter.crafting_categories[ccKeys[ci]];
            if (!result[cat]) {
                result[cat] = [crafter];
            } else {
                result[cat].push(crafter);
            }
        }
    }

    for (var i = 0; i < keysAssem.length; i++) {
        var assem = data['assembling-machine'][keysAssem[i]];
        work(assem);
    }

    for (var i = 0; i < keysFurn.length; i++) {
        var assem = data['furnace'][keysFurn[i]];
        work(assem);
    }

    //console.log(result);

    return result;
}

function mapRecipeCatAssemblers(cfgd, craftCatMap) {
    var data = cfgd.data;
    var keysRecipe = Object.keys(data.recipe);
    var results = [];

    for (var i = 0; i < keysRecipe.length; i++) {
        var r = data.recipe[keysRecipe[i]];
        r.assemblerMap = craftCatMap[r.category];
    }

    return results;
}

function attachLocaleToData(cfgd):void {
    var data = cfgd.data;

    var keysData = Object.keys(data);

    for (var i = 0; i < keysData.length; i++) {
        var key = keysData[i];
        var keys = Object.keys(data[key]);
        for (var j = 0; j < keys.length; j++) {
            var item = data[key][keys[j]];
            item.name = item.name.toLowerCase();
            item.title = cfgd.findTitle(item.name);
        }
    }
}

export function covertToList(someData) {
    var keys = Object.keys(someData);
    var result = [];

    for (var i = 0; i < keys.length; i++) {
        result.push(someData[keys[i]]);
    }

    return result;
}