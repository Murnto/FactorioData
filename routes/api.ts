/// <reference path="../typings/tsd.d.ts" />

import * as express from "express";

export let router:express.Router = express.Router();
import FData = require("../src/factorio_data");

/* GET home page. */
router.get("/", function (req:express.Request, res:express.Response, next:Function):void {
    res.render("index", {title: "Express"});
});

router.get("/find/:name", function (req:express.Request, res:express.Response, next:Function):void {
    let name:string = req.params.name;
    let results:any = [];

    let tmp:any = FData.getPack(res.locals.modpack).searchEntities(name);
    for (let t in tmp) {
        if (!tmp.hasOwnProperty(t)) {
            continue;
        }

        t = tmp[t];
        results.push({
            name: t.name,
            title: FData.getPack(res.locals.modpack).findTitle(t.name),
            type: t.type,
        });

        if (results.length > 100) {
            break;
        }
    }

    res.send(results);
    res.end();
});

router.get("/find/", function (req:express.Request, res:express.Response, next:Function):void {
    res.send([]);
    res.end();
});

router.get("/recipe/:name", function (req:express.Request, res:express.Response, next:Function):void {
    let name:string = req.params.name;
    res.send(FData.getPack(res.locals.modpack).data.recipe[name]);
    res.end();
});

router.get("/result/:name", function (req:express.Request, res:express.Response, next:Function):void {
    let name:string = req.params.name;

    let results:any[] = FData.getPack(res.locals.modpack).recipesWithResult(name);

    res.send(results);
    res.end();
});

router.get("/popup/:type/:name", function (req:express.Request, res:express.Response, next:Function):void {
    let name:string = req.params.name;
    let type:string = req.params.type;

    let item:any = FData.getPack(res.locals.modpack).data[type][name];
    let recipe:any = FData.getPack(res.locals.modpack).getFirstRecipeByResultWithIngredients(name);

    res.render("item_popup", {
        item: item,
        recipe: recipe,
    });
});
