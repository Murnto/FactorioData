/// <reference path="../typings/tsd.d.ts" />

import * as express from "express";
import * as FData from "../src/factorio_data";

let router:express.Router = express.Router();

router.get("/i/:type/:name", function (req:express.Request, res:express.Response, next:Function):void {
    let name:string = req.params.name;
    let type:string = req.params.type;

    res.render("item", {
        name: name,
        recipes: FData.getPack(res.locals.modpack).recipesWithResult(name),
        title: FData.getPack(res.locals.modpack).findTitle(name),
        type: type,
        uses: FData.getPack(res.locals.modpack).recipesWithIngredient(name),
    });
});

router.get("/recipecat/:name", function (req:express.Request, res:express.Response, next:Function):void {
    let name:string = req.params.name;

    res.render("assem_map", {
        assemMap: FData.getPack(res.locals.modpack).craftCatMap[name],
        name: name,
        title: name,
    });
});

router.get("/tech", function (req:express.Request, res:express.Response, next:Function):void {

    res.render("tech_list", {
        technology: FData.getPack(res.locals.modpack).data.technology,
        title: "Technologies",
    });
});

router.get("/tech/:name", function (req:express.Request, res:express.Response, next:Function):void {
    let name:string = req.params.name;

    let tech:any = FData.getPack(res.locals.modpack).data.technology[name];
    if (!tech) {
        return next();
    }

    let prereqTitles:any[] = [];
    let allowsTitles:any[] = [];

    for (let prereq in tech.prerequisites) {
        if (!tech.prerequisites.hasOwnProperty(prereq)) {
            continue;
        }

        prereq = tech.prerequisites[prereq];
        prereqTitles.push(FData.getPack(res.locals.modpack).data.technology[prereq].title &&
            FData.getPack(res.locals.modpack).data.technology[prereq].title || prereq);
    }

    for (let allow in tech.allows) {
        if (!tech.allows.hasOwnProperty(allow)) {
            continue;
        }

        allow = tech.allows[allow];
        allowsTitles.push(FData.getPack(res.locals.modpack).data.technology[allow] &&
            FData.getPack(res.locals.modpack).data.technology[allow].title || allow);
    }

    res.render("technology", {
        allowsTitles: allowsTitles,
        name: name,
        prereqTitles: prereqTitles,
        tech: tech,
        title: tech.title || name,
    });
});

/* GET home page. */
router.get("/", function (req:express.Request, res:express.Response, next:Function):void {
    res.render("index", {title: "Factorio Data"});
});

export = router;
