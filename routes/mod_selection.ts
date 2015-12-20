/// <reference path="../typings/tsd.d.ts" />

import * as express from "express";
import * as FData from "../src/factorio_data";
import {ConfigData} from "../src/config_data";

export let router:express.Router = express.Router();

router.get("/", function (req:express.Request, res:express.Response, next:Function):void {
    res.render("pack_list", {
        packInfos: FData.packInfos,
        title: "Configurations",
    });
});

router.get("/:pack", function (req:express.Request, res:express.Response, next:Function):void {
    let pack:string = req.params.pack;

    if (req.url.substr(-1) !== "/") {
        res.redirect(301, "/pack/" + pack + "/");
    } else {
        next();
    }
});

export function modSelection(req:express.Request, res:express.Response, next:Function):void {
    "use strict";

    let spl:string[] = req.url.split("/");
    let chosenPack:ConfigData;
    let typedPackId:string;

    if (spl.length > 1 && spl[1] === "pack") {
        typedPackId = spl[2];
        chosenPack = FData.getPack(spl[2]);
        if (!chosenPack) {
            next({
                extended_message: "Could not find pack \"" + spl[2] + "\"",
                message: "No such pack",
                status: 404,
            });
            return;
        } else {
            spl.splice(1, 2);
            if (spl[1] !== "icon") {
                req.url = spl.join("/");
            }
        }
    } else {
        typedPackId = "default";
        chosenPack = FData.getPack("default");
    }

    if (typedPackId !== chosenPack.info.name) {
        if (spl[1] === "icon") {
            req.url = "/pack/" + chosenPack.packid + spl.join("/");
        }
    }

    res.locals.modpack = chosenPack.packid;
    res.locals.modpack_title = chosenPack.info.title;
    next();
}
