import * as e from "express";
import path from "path";
import fs from "fs";
// Originally created for this module but yk what ignoring the errors is easier.
// import * as c from "./interfaces";
import {authorization, secure} from "./access";
import * as host from "./cynthia-communicate";
import config from "./config";

export default {
    get: (req: e.Request, res: e.Response) => {
        res.type("json");
        res.set('Cache-Control', 'no-store')
        switch (req.params[0]) {
            case "signout":
                // @ts-expect-error
                if (req.session.user_id !== undefined) {
                    req.session.destroy((_) => {
                    });
                }
                return res.redirect("/");
            case "GeneralSiteInfoPoll": {
                let displayname = ""
            //                @ts-expect-error
                if (req.session.user_id !== undefined) {
                    //                @ts-expect-error
                    displayname = config.users[(req.session.user_id - 1)].displayname;
                } else {
                    displayname = "unset"
                };
                let username = ""
            //                @ts-expect-error
                if (req.session.user_id !== undefined) {
                    //                @ts-expect-error
                    username = config.users[(req.session.user_id - 1)].username;
                } else {
                    username = "unset"
                };
                if (username === undefined) username = "unset";
                return res.send(JSON.stringify({
                    displayname,
                        parentnodeadress:
                            JSON.parse(host.get("parentnodeadress")),
                        username
                    }
                ))
                    ;
            }
        }
        return res.send(
            secure(
                fs.readFileSync(path.join(__dirname, "../assets/html/index.html"), "utf8"),
                req.session,
            ),
        );
    },
    post: (req: e.Request, res: e.Response) => {
        res.type("json");
        res.set('Cache-Control', 'no-store')
        switch (req.params[0]) {
            case "auth": {
                // @ts-expect-error
                if (req.session.user_id !== undefined) {
                    return res.send(JSON.stringify({Ok: true}));
                }
                const ok = authorization({
                    username: req.body.username,
                    password: req.body.password,
                });
                const OK = !(ok === false);
                if (OK) {
                    if (req.protocol === 'http' && config.production) {
                        console.log("Unable to login? Set 'production' to false in 'config.json' if you use HTTP instead of HTTPS.")
                    }
                    // @ts-expect-error
                    req.session.user_id = ok;
                }
                req.session.save();
                return res.send(JSON.stringify({Ok: OK, re: ok}));
            }
            case "plugin.remove": {
                console.log("Removing plugin")
                host.Cynthia.sendcommand("plugin", "remove", [req.body.plugin]);
            }
        }
    },
};
