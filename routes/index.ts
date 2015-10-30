/// <reference path="../typings/tsd.d.ts" />

var express = require('express');
var router = express.Router();
import FData = require('../src/factorio_data');

router.get('/i/:type/:name', function (req, res, next) {
    var name = req.params.name;
    var type = req.params.type;

    res.render('item', {
        name: name,
        type: type,
        title: FData.getPack(res.locals.modpack).findTitle(name),
        recipes: FData.getPack(res.locals.modpack).recipesWithResult(name),
        uses: FData.getPack(res.locals.modpack).recipesWithIngredient(name)
    });
});

router.get('/recipecat/:name', function (req, res, next) {
    var name = req.params.name;

    res.render('assem_map', {
        name: name,
        title: name,
        assemMap: FData.getPack(res.locals.modpack).craftCatMap[name]
    });
});

router.get('/tech', function (req, res, next) {

    res.render('tech_list', {
        title: 'Technologies',
        technology: FData.getPack(res.locals.modpack).data.technology
    });
});

router.get('/tech/:name', function (req, res, next) {
    var name = req.params.name;

    var tech = FData.getPack(res.locals.modpack).data.technology[name];
    var prereqTitles = [];
    var allowsTitles = [];

    for (var prereq in tech.prerequisites) {
        prereq = tech.prerequisites[prereq];
        prereqTitles.push(FData.getPack(res.locals.modpack).data.technology[prereq].title || prereq)
    }

    for (var allow in tech.allows) {
        allow = tech.allows[allow];
        allowsTitles.push(FData.getPack(res.locals.modpack).data.technology[allow].title || allow)
    }

    res.render('technology', {
        name: name,
        title: tech.title || name,
        prereqTitles: prereqTitles,
        allowsTitles: allowsTitles,
        tech: tech
    });
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Factorio Data'});
});

module.exports = router;
