/// <reference path="../typings/tsd.d.ts" />

import * as express from "express";
import * as path from "path";
import * as FData from "../src/factorio_data";

let router:express.Router = express.Router();

router.get("/recipes.js", function (req:express.Request, res:express.Response, next:Function):void {
    let recps:any = FData.getPack(res.locals.modpack).data.recipe;
    let out:any = {};

    for (let id in recps) {
        if (!recps.hasOwnProperty(id)) {
            continue;
        }

        let r:any = recps[id];
        let ratioId:string = id.replace(/-/g, "_");
        let obj:any = {
            category: r.category !== undefined ? r.category : "crafting",
            id: ratioId,
            ingredients: [],
            name: r.title,
            resultCount: null,
            speed: r.energy_required !== undefined ? 1 / r.energy_required : 2,
        };
        for (let i:number = 0; i < r.results.length; i++) {
            let result:any = r.results[i];

            if (result.name === id) {
                obj.resultCount = result.amount !== undefined ? result.amount : 1.0;
                break;
            }
        }
        for (let i:number = 0; i < r.ingredients.length; i++) {
            let ingd:any = r.ingredients[i];

            if (ingd.name === undefined) {
                obj.ingredients.push([ingd[1].replace(/-/g, "_"), ingd[2]]);
            } else {
                obj.ingredients.push([ingd.name.replace(/-/g, "_"), ingd.amount]);
            }
        }

        if (obj.resultCount !== null) {
            out[ratioId] = obj;
        }
    }

    res.send("recipes = " + JSON.stringify(out));
    res.end();
});

router.get("/resources.js", function (req:express.Request, res:express.Response, next:Function):void {
    let resources:any = FData.getPack(res.locals.modpack).data.resource;
    let fluid:any = FData.getPack(res.locals.modpack).data.fluid;
    let out:any = {};

    for (let id in resources) {
        if (!resources.hasOwnProperty(id)) {
            continue;
        }

        let r:any = resources[id];
        let ratioId:string = id.replace(/-/g, "_");

        let obj:any = {
            category: r.category,
            id: ratioId,
            name: r.title,
        };

        if (r.minable !== undefined) {
            obj.miningTime = r.minable.mining_time;
            obj.hardness = r.minable.hardness;
            obj.category = r.category !== undefined ? r.category : "basic-solid"; // fixme likely not technically correct
        }

        out[ratioId] = obj;
    }

    for (let id in fluid) {
        if (!fluid.hasOwnProperty(id)) {
            continue;
        }

        let r:any = fluid[id];
        let ratioId:string = id.replace(/-/g, "_");

        out[ratioId] = {
            category: "fluid",
            id: ratioId,
            name: r.title,
        };
    }

    res.send("resources = " + JSON.stringify(out));
    res.end();
});

router.get("/factories.js", function (req:express.Request, res:express.Response, next:Function):void {
    let assemblingMachines:any = FData.getPack(res.locals.modpack).data["assembling-machine"];
    let furnaces:any = FData.getPack(res.locals.modpack).data.furnace;
    let miningDrills:any = FData.getPack(res.locals.modpack).data["mining-drill"];
    let out:any = {};

    for (let id in furnaces) {
        if (!furnaces.hasOwnProperty(id)) {
            continue;
        }

        let r:any = furnaces[id];
        let ratioId:string = id.replace(/-/g, "_");

        out[ratioId] = {
            categories: r.crafting_categories,
            id: ratioId,
            ingredientCount: 1,
            name: r.title,
            speed: r.crafting_speed,
        };
    }

    for (let id in assemblingMachines) {
        if (!assemblingMachines.hasOwnProperty(id)) {
            continue;
        }

        let r:any = assemblingMachines[id];
        let ratioId:string = id.replace(/-/g, "_");

        out[ratioId] = {
            categories: r.crafting_categories,
            id: ratioId,
            ingredientCount: r.ingredient_count,
            name: r.title,
            speed: r.crafting_speed,
        };
    }

    for (let id in miningDrills) {
        if (!miningDrills.hasOwnProperty(id)) {
            continue;
        }

        let r:any = miningDrills[id];
        let ratioId:string = id.replace(/-/g, "_");

        out[ratioId] = {
            categories: r.resource_categories,
            id: ratioId,
            miningPower: r.mining_power,
            miningSpeed: r.mining_speed,
            name: r.title,
            speed: "calculate",
        };
    }

    res.send("factories = " + JSON.stringify(out));
    res.end();
});

router.get("/", function (req:express.Request, res:express.Response, next:Function):void {
    res.render("factoratio");
});

router.use(express.static(path.join(__dirname, "..", "../factoratio")));

export = router;
