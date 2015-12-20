/// <reference path="../typings/tsd.d.ts" />

import * as express from "express";
import git = require("git-rev-sync");

let gitShort:string = git.short();

function addLocals(req:express.Request, res:express.Response, next:Function):void {
    "use strict";

    res.locals.git_short = gitShort;
    next();
}

export = addLocals;
