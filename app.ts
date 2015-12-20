/// <reference path="typings/tsd.d.ts" />

import * as express from "express";
import * as path from "path";
import * as logger from "morgan";
// import * as favicon from "serve-favicon";

import * as modSelection from "./routes/mod_selection";
import * as routes from "./routes/index";
import * as itemCats from "./routes/itemcats";
import {router as api} from "./routes/api";
import * as factoratio from "./routes/factoratio";

let app:express.Application = express();
app.use(require("./helpers"));

// view engine setup
app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "jade");

// app.use(favicon(__dirname + "/public/favicon.ico"));
app.use(logger("dev"));

app.use(require("./src/git_locals"));
app.use("/pack", modSelection.router);
app.use(modSelection.modSelection);
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/", routes);
app.use("/api", api);
app.use("/itemcats", itemCats);
app.use("/factoratio", factoratio);

// catch 404 and forward to error handler
app.use(function (req:express.Request, res:express.Response, next:Function):void {
    let err:any = new Error("Not Found");
    err.status = 404;
    next(err);
});

// error handlers

let env:string = process.env.NODE_ENV || "development";
if (env === "development") {
    // cacher.noCaching = true
    app.locals.analytics = "";
} else {
    app.locals.analytics = "<script>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');ga('create', 'UA-63813475-1', 'auto');ga('send', 'pageview');</script>";
}

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
    app.use(function (err:any, req:express.Request, res:express.Response, next:Function):void {
        res.status(err.status || 500);
        res.render("error", {
            error: err,
            extended_message: err.extended_message,
            message: err.message,
            modpack: res.locals.modpack,
            modpack_title: res.locals.modpack_title,
            title: (err.status || 500) + ": " + err.message,
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err:any, req:express.Request, res:express.Response, next:Function):void {
    res.status(err.status || 500);
    res.render("error", {
        error: {},
        extended_message: err.extended_message,
        message: err.message,
        modpack: res.locals.modpack,
        modpack_title: res.locals.modpack_title,
        title: (err.status || 500) + ": " + err.message,
    });
});


module.exports = app;
