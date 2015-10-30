/// <reference path="../typings/tsd.d.ts" />

var express = require('express');
var router = express.Router();
import FData = require('../src/factorio_data');

router.get('/:cat', function(req, res, next) {
    var catdata = FData.getPack(res.locals.modpack).catdata;
    var cat = req.params.cat;

    if (!catdata.CATEGORIES[cat]) {
        res.render('error', {
            error: 'No such category'
        });
        return;
    }

    var info = catdata.CATEGORIES[cat];

    res.render('itemcat/list', {
        title: info.name,
        cat: cat,
        headers: info.headers,
        columnData: info.data
    });
});

router.get('/', function(req, res, next) {
    var catdata = FData.getPack(res.locals.modpack).catdata;
    res.render('itemcat/index', {
        title: 'Item Categories',
        itemcats: catdata.actual_categories
    });
});

module.exports = router;
