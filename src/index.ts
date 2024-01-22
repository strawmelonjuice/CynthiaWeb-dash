import * as e from "express";
import path from "path";
import fs from "fs";
import chalk from "chalk";

const pkgself = (() => {
    let t = fs.readFileSync(path.join(__dirname, "../package.json"), 'utf8');
    return JSON.parse(t)
})();
import config from "./config";
import {tell} from "./logging";
import express from "express";
import homepage from "./dashpages/homepage";
import {authpage, secure} from "./dashpages/access";
import apis from "./apis";
import session from 'express-session';

const app = express();
let sessionoptions: session.SessionOptions = {
    secret: config.settings.session_secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: "auto"
    }
}
if (config.production) {
    app.set('trust proxy', 1)
    // @ts-ignore
    sessionoptions.cookie.secure = true
}
app.use(session(sessionoptions));

switch (process.argv[2]) {
    case "serve": {
        app.get("/", homepage);
        app.get("/authorize", (req: e.Request, res: e.Response) => {
            if (secure("logincheck", req.session) == "logincheck") {
                res.redirect("/");
            } else {
                res.send(authpage)
            }
        });
        app.use('/static', express.static(path.join(__dirname, "../static")));
        app.use('/jquery', express.static(path.join(__dirname, "../node_modules/jquery/dist/jquery.min.js")));
        app.use('/axios', express.static(path.join(__dirname, "../node_modules/axios/dist/")));
        app.use(express.json());
        app.get("/api/*", apis.get);
        app.post("/api/*", apis.post);
        app.listen(config.settings.port, config.settings.address, () => {
            tell.info(`👋 Cynthia-Dash v${pkgself.version} is active! Visit ${chalk.green("http://" + config.settings.address + ":" + config.settings.port + "/")} (or a custom adress if you have bound one) to access it!`)
        });
    }
        break;
}