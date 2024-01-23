import * as e from "express";
import path from "path";
import fs from "fs";

import * as logging from "./logging";
import {secure} from "./access";

export function home(req: e.Request, res: e.Response) {
    logging.debuglog("Serving dashboard home page.");
    return res.send(
        secure(
            fs.readFileSync(
                path.join(__dirname, "../assets/html/index.html"),
                "utf8",
            ),
            req.session,
        ),
    );
}

export function dashes(req: e.Request, res: e.Response) {
    const y = {
        "dashboard": fs.readFileSync(
            path.join(__dirname, "../assets/html/y1.html"),
            "utf8",
        ),
        "pages": fs.readFileSync(
            path.join(__dirname, "../assets/html/y2.html"),
            "utf8",
        ),
        "plugins": fs.readFileSync(
            path.join(__dirname, "../assets/html/y3.html"),
            "utf8",
        ),
        "customisation": fs.readFileSync(
            path.join(__dirname, "../assets/html/y4.html"),
            "utf8",
        ),
    };
    if (req.params[0] in y) {
        const id = req.params[0];
        return res.send(
			// @ts-expect-error
            secure(y[id],
                req.session,
            ),
        );
    }
}