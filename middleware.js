/**
 * Created by liboyuan on 16/8/11.
 */

const expressSession = require("express-session");

var sessionMiddleware = expressSession({
    name: "USER_INFO",
    secret: "20120916",
    store: new (require("connect-mongo")(expressSession))({
        url: "mongodb://localhost/sessions"
    }),
    resave: true,
    saveUninitialized: true
});

module.exports = sessionMiddleware;