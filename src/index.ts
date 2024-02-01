import * as e from "express";
import * as c from "./interfaces";
import path from "path";
import fs from "fs";
import chalk from "chalk";

import {publishedfile} from "./cynthia-communicate";
//
//console.log(publishedfile.get());

const pkgself = (() => {
    const t = fs.readFileSync(path.join(__dirname, "../package.json"), "utf8");
    return JSON.parse(t);
})();
import config from "./config";
import {panic, tell} from "./logging";
import express from "express";
import * as page from "./page";
import {authpage, secure} from "./access";
import apis from "./apis";
import session from "express-session";

const app = express();
const sessionoptions: session.SessionOptions = {
    secret: config.settings.session_secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: "auto",
    },
};
if (config.production) {
    app.set("trust proxy", 1);
    // @ts-expect-error
    sessionoptions.cookie.secure = true;
}
app.use(session(sessionoptions));

switch (process.argv[2]) {
    case "serve": {
        app.get("/", page.home);
        app.get("/authorize", (req: c.Request, res: e.Response) => {
            if (secure("logincheck", req.session) === "logincheck") {
                res.redirect("/");
            } else {
                res.send(authpage);
            }
        });
        app.use("/assets", express.static(path.join(__dirname, "../assets")));
        app.use(
            "/generated",
            express.static(path.join(__dirname, "../generated")),
        );
        {
            if (!fs.existsSync(path.join(__dirname, "../node_modules/axios/dist/axios.js"))) {
                panic("Could not find dependency: Axios is missing.");
            }
            app.use(
                "/axios",
                express.static(path.join(__dirname, "../node_modules/axios/dist/")),
            );
        }
        app.use(express.json());
        app.get("/api/*", apis.get);
        app.get("/dashboard-fetch/*", page.dashes);
        app.post("/api/*", apis.post);
        app.listen(config.settings.port, config.settings.address, () => {
            tell.info(
                `👋 Cynthia-Dash v${pkgself.version} is active! Visit ${chalk.green(
                    `http://${config.settings.address}:${config.settings.port}/`,
                )} (or a custom adress if you have bound one) to access it!`,
            );
        });
    }
        break;
}
