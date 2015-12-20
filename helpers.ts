/// <reference path="./typings/tsd.d.ts" />

import * as express from "express";
import * as FactorioData from "./src/factorio_data";

function packUrl(_packName:string):string {
    "use strict";

    return "/pack/" + _packName;
}

function findTitle(_packName:string, name:string):string {
    "use strict";

    return FactorioData.getPack(_packName).findTitle(name);
}

function findCraftableByName(_packName:string, name:string):any {
    "use strict";

    return FactorioData.getPack(_packName).findCraftableByName(name);
}

function getImgUrl(_packName:string, type:string, name:string):string {
    "use strict";

    return packUrl(_packName) + "/icon/" + type + "/" + name + ".png";
}

function embedImg(_packName:string, type:string, name:string, clazz?:string):string {
    "use strict";

    if (clazz) {
        return "<img class=\"" + clazz + "\" src=\"" + getImgUrl(_packName, type, name) + "\"/>";
    } else {
        return "<img src=\"" + getImgUrl(_packName, type, name) + "\"/>";
    }
}

function recipeCategoryUrl(_packName:string, cat:string):string {
    "use strict";

    return packUrl(_packName) + "/recipecat/" + cat;
}

function itemCount(_packName:string, count:string|number, type:string, name:string):string {
    "use strict";

    return "<div class=\"item-count\">" + count + "x " + embedImg(_packName, type, name) + "</div>";
    // return "<div class=\"item-count\">" + app.locals.embedImg(type, name) + "<div>" + count + "</div></div>";
}

function itemGroupImage(_packName:string, group:string):string {
    "use strict";

    if (FactorioData.getPack(_packName).data["item-subgroup"][group]) {
        return packUrl(_packName) + "/icon/item-group/" + FactorioData.getPack(_packName).data["item-subgroup"][group].group + ".png";
    }
}

function recipeByName(_packName:string, name:string):any {
    "use strict";

    return FactorioData.getPack(_packName).data.recipe[name];
}

function popoverAnchorStart(_packName:string, name:string, type?:string):string {
    "use strict";

    let craftable:any = FactorioData.getPack(_packName).findCraftableByName(name);
    type = type || craftable.type;
    return "<a href=\"" + packUrl(_packName) + "/i/" + type + "/" + craftable.name + "\" title=\"" + craftable.title + "\" data-trigger=\"hover\" data-item-type=\"" + type + "\" data-item-name=\"" + name + "\">";
}

function embedItemPopover(_packName:string, name:string, type?:string):string {
    "use strict";

    let craftable:any = FactorioData.getPack(_packName).findCraftableByName(name);
    type = type || craftable.type;
    return popoverAnchorStart(_packName, name, type) + embedImg(_packName, type, name) + "</a>";
}

function itemUrl(_packName:string, type:string, name:string):string {
    "use strict";

    return packUrl(_packName) + "/i/" + type + "/" + name;
}

module.exports = function (req:express.Request, res:express.Response, next:Function):void {
    res.locals.findTitle = function (name:string):string {
        return findTitle(res.locals.modpack, name);
    };
    res.locals.findCraftableByName = function (name:string):any {
        return findCraftableByName(res.locals.modpack, name);
    };
    res.locals.getImgUrl = function (type:string, name:string):string {
        return getImgUrl(res.locals.modpack, type, name);
    };
    res.locals.embedImg = function (type:string, name:string, clazz?:string):string {
        return embedImg(res.locals.modpack, type, name, clazz);
    };
    res.locals.recipeCategoryUrl = function (cat:string):string {
        return recipeCategoryUrl(res.locals.modpack, cat);
    };
    res.locals.itemCount = function (count:string, type:string, name:string):string {
        return itemCount(res.locals.modpack, count, type, name);
    };
    res.locals.itemGroupImage = function (group:string):string {
        return itemGroupImage(res.locals.modpack, group);
    };
    res.locals.recipeByName = function (name:string):any {
        return recipeByName(res.locals.modpack, name);
    };
    res.locals.popoverAnchorStart = function (name:string, type?:string):string {
        return popoverAnchorStart(res.locals.modpack, name, type);
    };
    res.locals.embedItemPopover = function (name:string, type?:string):string {
        return embedItemPopover(res.locals.modpack, name, type);
    };
    res.locals.itemUrl = function (type:string, name:string):string {
        return itemUrl(res.locals.modpack, type, name);
    };

    next();
};
