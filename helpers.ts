/// <reference path="./typings/tsd.d.ts" />

import FactorioData = require('./src/factorio_data');

function packUrl(_pack_name_) {
    return '/pack/' + _pack_name_;
}

function findTitle(_pack_name_, name) {
    return FactorioData.getPack(_pack_name_).findTitle(name);
}
function findCraftableByName(_pack_name_, name) {
    return FactorioData.getPack(_pack_name_).findCraftableByName(name);
}
function getImgUrl(_pack_name_, type, name) {
    return packUrl(_pack_name_) + "/icon/" + type + "/" + name + ".png";
}
function embedImg(_pack_name_, type, name, clazz?) {
    if (clazz) {
        return "<img class=\"" + clazz + "\" src=\"" + getImgUrl(_pack_name_, type, name) + "\"/>";
    } else {
        return "<img src=\"" + getImgUrl(_pack_name_, type, name) + "\"/>";
    }
}
function recipeCategoryUrl(_pack_name_, cat) {
    return packUrl(_pack_name_) + "/recipecat/" + cat;
}
function itemCount(_pack_name_, count, type, name) {
    return "<div class=\"item-count\">" + count + "x " + embedImg(_pack_name_, type, name) + "</div>";
    //return "<div class=\"item-count\">" + app.locals.embedImg(type, name) + "<div>" + count + "</div></div>";
}
function itemGroupImage(_pack_name_, group) {
    if (FactorioData.getPack(_pack_name_).data['item-subgroup'][group]) {
        return packUrl(_pack_name_) + '/icon/item-group/' + FactorioData.getPack(_pack_name_).data['item-subgroup'][group].group + ".png";
    }
}
function recipeByName(_pack_name_, name) {
    return FactorioData.getPack(_pack_name_).data.recipe[name];
}
function popoverAnchorStart(_pack_name_, name, type?) {
    var craftable = FactorioData.getPack(_pack_name_).findCraftableByName(name);
    type = type || craftable.type;
    return '<a href="' + packUrl(_pack_name_) + '/i/' + type + '/' + craftable.name + '" title="' + craftable.title + '" data-trigger="hover" data-item-type="' + type + '" data-item-name="' + name + '">';
}
function embedItemPopover(_pack_name_, name, type?) {
    var craftable = FactorioData.getPack(_pack_name_).findCraftableByName(name);
    type = type || craftable.type;
    return popoverAnchorStart(_pack_name_, name, type) + embedImg(_pack_name_, type, name) + '</a>';
}
function itemUrl(_pack_name_, type, name) {
    return packUrl(_pack_name_) + '/i/' + type + '/' + name;
}

module.exports = function(req, res, next){
    res.locals.findTitle = function (name) {
        return findTitle(res.locals.modpack, name);
    };
    res.locals.findCraftableByName = function (name) {
        return findCraftableByName(res.locals.modpack, name);
    };
    res.locals.getImgUrl = function (type, name) {
        return getImgUrl(res.locals.modpack, type, name);
    };
    res.locals.embedImg = function (type, name, clazz?) {
        return embedImg(res.locals.modpack, type, name, clazz);
    };
    res.locals.recipeCategoryUrl = function (cat) {
        return recipeCategoryUrl(res.locals.modpack, cat);
    };
    res.locals.itemCount = function (count, type, name) {
        return itemCount(res.locals.modpack, count, type, name);
    };
    res.locals.itemGroupImage = function (group) {
        return itemGroupImage(res.locals.modpack, group);
    };
    res.locals.recipeByName = function (name) {
        return recipeByName(res.locals.modpack, name);
    };
    res.locals.popoverAnchorStart = function (name, type?) {
        return popoverAnchorStart(res.locals.modpack, name, type);
    };
    res.locals.embedItemPopover = function (name, type?) {
        return embedItemPopover(res.locals.modpack, name, type);
    };
    res.locals.itemUrl = function (type, name) {
        return itemUrl(res.locals.modpack, type, name);
    };

    next();
};