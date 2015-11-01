/// <reference path="../typings/tsd.d.ts" />

var express = require('express');
var path = require('path');
var router = express.Router();
import FData = require('../src/factorio_data');

router.get('/recipes.js', function (req, res, next) {
    var recps = FData.getPack(res.locals.modpack).data.recipe;
    var out = {};

    for (var id in recps) {
        var r = recps[id];
        var ratio_id = id.replace(/-/g, '_');
        var obj = {
            id: ratio_id,
            name: r.title,
            category: r.category !== undefined ? r.category : 'crafting',
            ingredients: [],
            speed: r.energy_required !== undefined ? 1 / r.energy_required : 2,
            resultCount: null
        };
        for (var i = 0; i < r.results.length; i++) {
            var result = r.results[i];

            if (result.name == id) {
                obj.resultCount = result.amount !== undefined ? result.amount : 1.0;
                break;
            }
        }
        for (var i = 0; i < r.ingredients.length; i++) {
            var ingd = r.ingredients[i];

            if (ingd.name == undefined) {
                obj.ingredients.push([ingd[1].replace(/-/g, '_'), ingd[2]])
            } else {
                obj.ingredients.push([ingd.name.replace(/-/g, '_'), ingd.amount])
            }
        }

        if (obj.resultCount !== null) {
            out[ratio_id] = obj;
        }
    }

    res.send('recipes = ' + JSON.stringify(out));
    res.end();
});

router.get('/resources.js', function (req, res, next) {
    var resources = FData.getPack(res.locals.modpack).data.resource;
    var fluid = FData.getPack(res.locals.modpack).data.fluid;
    var out = {};

    for (var id in resources) {
        var r = resources[id];
        var ratio_id = id.replace(/-/g, '_');

        var obj = {
            id: ratio_id,
            name: r.title,
            category: r.category
        };

        if (r.minable !== undefined) {
            obj['miningTime'] = r.minable.mining_time;
            obj['hardness'] = r.minable.hardness;
            obj['category'] = r.category !== undefined ? r.category : 'basic-solid'; // FIXME likely not technically correct
        }

        out[ratio_id] = obj;
    }

    for (var id in fluid) {
        var r = fluid[id];
        var ratio_id = id.replace(/-/g, '_');

        out[ratio_id] = {
            id: ratio_id,
            name: r.title,
            category: 'fluid'
        };
    }

    res.send('resources = ' + JSON.stringify(out));
    res.end();
});

router.get('/factories.js', function (req, res, next) {
    var assemblingMachines = FData.getPack(res.locals.modpack).data['assembling-machine'];
    var furnaces = FData.getPack(res.locals.modpack).data['furnace'];
    var miningDrills = FData.getPack(res.locals.modpack).data['mining-drill'];
    var out = {};

    for (var id in furnaces) {
        var r = furnaces[id];
        var ratio_id = id.replace(/-/g, '_');

        out[ratio_id] = {
            id: ratio_id,
            name: r.title,
            categories: r.crafting_categories,
            speed: r.crafting_speed,
            ingredientCount: 1
        };
    }

    for (var id in assemblingMachines) {
        var r = assemblingMachines[id];
        var ratio_id = id.replace(/-/g, '_');

        out[ratio_id] = {
            id: ratio_id,
            name: r.title,
            categories: r.crafting_categories,
            speed: r.crafting_speed,
            ingredientCount: r.ingredient_count,
        };
    }

    for (var id in miningDrills) {
        var r = miningDrills[id];
        var ratio_id = id.replace(/-/g, '_');

        out[ratio_id] = {
            id: ratio_id,
            name: r.title,
            categories: r.resource_categories,
            miningPower: r.mining_power,
            miningSpeed: r.mining_speed,
            speed: 'calculate',
        };
    }

    res.send('factories = ' + JSON.stringify(out));
    res.end();
});

router.get('/', function (req, res, next) {
    res.render('factoratio')
});

router.use(express.static(path.join(__dirname, '../factoratio')));

export = router;
