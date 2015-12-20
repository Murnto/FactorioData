/// <reference path="../typings/tsd.d.ts" />

import * as express from "express";
import * as FData from "../src/factorio_data";

let router:express.Router = express.Router();

router.get("/:cat", function (req:express.Request, res:express.Response, next:Function):void {
    let cat:string = req.params.cat;
    let catdata:any = FData.getPack(res.locals.modpack).catdata;

    if (!catdata.CATEGORIES[cat]) {
        res.render("error", {
            error: "No such category"
        });
        return;
    }

    let info:any = catdata.CATEGORIES[cat];

    res.render("itemcat/list", {
        cat: cat,
        columnData: info.data,
        headers: info.headers,
        title: info.name,
    });
});

router.get("/", function (req:express.Request, res:express.Response, next:Function):void {
    let catdata:any = FData.getPack(res.locals.modpack).catdata;
    res.render("itemcat/index", {
        itemcats: catdata.actualCategories,
        title: "Item Categories",
    });
});

export = router;
