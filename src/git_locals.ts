var git = require('git-rev-sync');

var gitShort = git.short();

function addLocals(req, res, next) {
    res.locals.git_short = gitShort;
    next();
}

export = addLocals