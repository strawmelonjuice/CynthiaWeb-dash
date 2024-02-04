import * as e from "express";
import path from "path";
import fs from "fs";

import * as logging from "./logging";
import {secure} from "./access";
import Handlebars from "handlebars";
import {publishedfile} from "./cynthia-communicate";

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
        "pages": (() => {
                const hb = Handlebars.compile(fs.readFileSync(
                    path.join(__dirname, "../assets/html/dashboard-pages.handlebars"),
                    "utf8",
                ));
                let publicationList = "";
                for (const publication of publishedfile.get()) {
                    const svg = fs.readFileSync(
                        path.join(__dirname, "../assets/svg/cynthia_tbg.svg"),
                        "utf8",
                    ).replaceAll("${publication.short}", (function (): string {
                        if (publication.short !== undefined && publication.short !== "") {
                            return publication.short;
                        }
                        return publication.title;
                    })());
                    const kindinfo = (() => {
                        switch (publication.type) {
                            case "post":
                                return ["Post", "bg-rose-600"];
                            case "page":
                                return ["Page", "bg-orange-700"];
                            default:
                                return ["Post list", "bg-emerald-600"];
                        }
                    })();
                    publicationList = publicationList + `<div onclick="window.location.assign('#pages-editor?id=${publication.id}')" class="cursor-pointer w-full border-amber-600 border-opacity-100 ${kindinfo[1]} p-4 text-blue-200 ring-rose-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-50">
                    <button class="font-bold bg-stone-400 bg-opacity-50 w-full pt-2 pb-0.5 rounded-t-lg">${kindinfo[0]}</button>
                    ${svg}
                <button class="font-bold bg-stone-400 bg-opacity-50 w-full pb-6 rounded-b-lg">${publication.title}</button></div>`;
                }
                return hb({
                    publicationList
                });
            }
        )
        (),
        "pages-editor": (() => {
            return `Hi, this will one day be an editor! <span id="whatamiediting"></span>`;
        })(),
        "plugins":
            fs.readFileSync(
                path.join(__dirname, "../assets/html/y3.html"),
                "utf8",
            ),
        "customisation":
            fs.readFileSync(
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