import * as e from "express";
import path from "path";
import fs from "fs";

import * as logging from "./logging";
import { secure } from "./access";
import Handlebars from "handlebars";
import { publishedfile } from "./cynthia-communicate";


export function home(req: e.Request, res: e.Response) {
    logging.debuglog("Serving dashboard home page.");
    return res.send(
        secure(
            fs.readFileSync(
                path.join(__dirname, "../assets/html/index.html"),
                "utf8"
            ), req.session));
}


const hb = {
    publications: Handlebars.compile(fs.readFileSync(
        path.join(__dirname, "../assets/handlebars/dashboard/publications.handlebars"),
        "utf8",
    )),
    plugins: Handlebars.compile(fs.readFileSync(
        path.join(__dirname, "../assets/handlebars/dashboard/plugins.handlebars"),
        "utf8",
    )),
    dashboard: Handlebars.compile(fs.readFileSync(
        path.join(__dirname, "../assets/handlebars/dashboard/overview.handlebars"),
        "utf8",
    )),
}

export function dashes(req: e.Request, res: e.Response) {
    const y = {
        "dashboard": (() => {
            const stats = {
                publications: {
                    total: ((publishedfile.get()).length),
                    posts: ((publishedfile.get()).filter((p) => (p.type === "post")).length),
                    pages: ((publishedfile.get()).filter((p) => (p.type === "page")).length),
                    postlists: (((publishedfile.get()).length) - (((publishedfile.get()).filter((p) => (p.type === "post")).length) + ((publishedfile.get()).filter((p) => (p.type === "page")).length))),
                }
            };
            // return hb.dashboard({ stats });
            return (Handlebars.compile(fs.readFileSync(
                path.join(__dirname, "../assets/handlebars/dashboard/overview.handlebars"),
                "utf8",
            )))({ stats });
        })(),
        "pages": (() => {
            const publications = [];
            for (const publication of publishedfile.get()) {
                const short = ((): string => {
                    if (publication.short !== undefined && publication.short !== "") {
                        return publication.short;
                    }
                    return publication.title;
                })();
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
                publications.push({
                    id: publication.id,
                    postkind: kindinfo[0],
                    postkindbg: kindinfo[1],
                    title: publication.title,
                    short: short,
                });
            
        }
            return hb.publications({
                publications
            });}
        )(),
        "pages-editor": (() => {
            return `Hi, this will one day be an editor! <span id="whatamiediting"></span>`;
        })(),
        "plugins": (() => {
            const plugins = [
                { name: "example 0", description: "sijdouihd", version: "203.1.12", thumbnail: "/assets/png/cynthia.png", author: "doppelganger" },
                { name: "example 1", description: "wwdddd", version: "203.1.12", thumbnail: "/assets/png/cynthia.png", author: "doppelganger" },
                { name: "Homes", description: "Must. Build, home. ", version: "5.21.1", thumbnail: "/assets/png/home.png", author: "Homebuilder" },
                { name: "example 2", description: "jwnhiuwhhiuh", version: "203.1.12", thumbnail: "/assets/png/cynthia.png", author: "Unknown" }];
            return hb.plugins({plugins});
        })(),
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