/// <reference path="../typings/tsd.d.ts" />

var express = require('express');
var fs = require('fs');
var router = express.Router();
import FData = require('../src/factorio_data');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/find/:name', function(req, res, next) {
    var name = req.params.name;
    var results = [];

    var tmp = FData.getPack(res.locals.modpack).searchNameTitle(name);
    for (var t in tmp) {
        t = tmp[t];
        results.push({
            name: t.name,
            type: t.type,
            title: FData.getPack(res.locals.modpack).findTitle(t.name)
        });

        if (results.length > 100) {
            break;
        }
    }

    res.send(results);
    res.end();
});

router.get('/find/', function(req, res, next) {
    res.send([]);
    res.end();
});

router.get('/recipe/:name', function(req, res, next) {
    var name = req.params.name;
    res.send(FData.getPack(res.locals.modpack).data.recipe[name]);
    res.end();
});

router.get('/result/:name', function(req, res, next) {
    var name = req.params.name;

    var results = FData.getPack(res.locals.modpack).recipesWithResult(name);

    res.send(results);
    res.end();
});

router.get('/popup/:type/:name', function(req, res, next) {
    var name = req.params.name;
    var type = req.params.type;

    var item = FData.getPack(res.locals.modpack).data[type][name];
    var recipe = FData.getPack(res.locals.modpack).getFirstRecipeByResultWithIngredients(name);

    res.render('item_popup', {
        item: item,
        recipe: recipe
    })
});

module.exports.router = router;
