/// <reference path="../typings/tsd.d.ts" />

var express = require('express');
export var router = express.Router();
import FData = require('../src/factorio_data');

router.get('/', function (req, res, next) {
    var defaultPack = FData.getPack('default');
    res.render('pack_list', {
        title: 'Configurations',
        modpack: defaultPack.packid,
        modpack_title: undefined,
        //modpack_title: defaultPack.info.title,
        packInfos: FData.packInfos
    });
});

router.get('/:pack', function (req, res, next) {
    var pack = req.params.pack;
    if (req.url.substr(-1) != '/') {
        res.redirect(301, '/pack/' + pack + '/')
    } else {
        next();
    }
});

export function modSelection(req, res, next) {
    var spl = req.url.split('/');
    var chosenPack;

    if (spl.length > 1 && spl[1] == 'pack') {
        chosenPack = FData.getPack(spl[2]);
        if (!chosenPack) {
            next({
                status: 404,
                extended_message: 'Could not find pack "' + spl[2] + '"',
                message: 'No such pack'
            });
            return;
        } else {
            spl.splice(1, 2);
            if (spl[1] !== 'icon') {
                req.url = spl.join('/');
            }
        }
    } else {
        chosenPack = FData.getPack('default');

        if (spl[1] == 'icon') {
            req.url = '/pack/' + chosenPack.packid + req.url;
        }
    }

    res.locals.modpack = chosenPack.packid;
    res.locals.modpack_title = chosenPack.info.title;
    next();
}