import * as e from "express";
import path from "path";
import fs from "fs";

import logging from "./logging";
import {authorization, secure} from "./dashpages/access";

export default {
    get: (req: e.Request, res: e.Response) => {
        res.type("json");
        res.send(secure(fs.readFileSync(path.join(__dirname, "../web/index.html"), 'utf8')));
    },
    post: (req: e.Request, res: e.Response) => {
        res.type("json");
        switch (req.params[0]) {
            case 'auth':
                console.log(req.session.user_id);
                // @ts-ignore
                if (req.session.user_id != undefined) {
                    res.send(JSON.stringify({Ok: true}));
                    return;
                }
                const ok = authorization({username: req.body.username, password: req.body.password});
                const OK = (!(ok === false));
                if (OK) {

                    // @ts-ignore
                    req.session.user_id = ok;
                    // @ts-ignore
                    console.log(`Logged in as ${req.session.user_id}`);
                }
                req.session.save();
                res.send(JSON.stringify({Ok: OK, re: ok}));
                res.end()
        }

    }
}