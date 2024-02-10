import * as e from "express";
import path from "path";
import fs from "fs";

import * as logging from "./logging";
import { secure } from "./access";
import Handlebars from "handlebars";
import { publishedfile } from "./cynthia-communicate";
import { CynthiaPluginManifestItem, CynthiaPluginRepoItem } from "./interfaces";
import axios from "axios";


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
function fetchplin() {
    const plino = (() => {
        try {
        return JSON.parse(fs.readFileSync(path.join(__dirname, "../generated/CynthiaPluginIndex.json"), "utf8"));} catch {
        return [];}})();
    if (fs.existsSync(path.join(__dirname, "../generated/CynthiaPluginIndex.json"))) fs.unlinkSync(path.join(__dirname, "../generated/CynthiaPluginIndex.json"));
    axios({
        method: "get",
        url: "https://raw.githubusercontent.com/CynthiaWebsiteEngine/Plugins/2/index.json",
        responseType: "stream"
    }).then((response) => {
        response.data.pipe(fs.createWriteStream(path.join(__dirname, "../generated/CynthiaPluginIndex.json")));
    }).catch(() => {
        fs.writeFileSync(path.join(__dirname, "../generated/CynthiaPluginIndex.json"), JSON.stringify(plino));
    });
}
setInterval(fetchplin, 60 * 60 * 1000);
fetchplin();
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
            return hb.dashboard({ stats });
            // return (Handlebars.compile(fs.readFileSync(
            //     path.join(__dirname, "../assets/handlebars/dashboard/overview.handlebars"),
            //     "utf8",
            // )))({ stats });
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
            });
            // return (Handlebars.compile(fs.readFileSync(
            //     path.join(__dirname, "../assets/handlebars/dashboard/publications.handlebars"),
            //     "utf8",
            // )))({ publications });
        }
        )(),
        "pages-editor": (() => {
            return `Hi, this will one day be an editor! <span id="whatamiediting"></span>`;
        })(),
        "plugins": (() => {
            const cynmploc = path.join(__dirname, "../../../cynthiapluginmanifest.json");
            const pluginlist = [];
            if (fs.existsSync(cynmploc)) {
                const t = fs.readFileSync(cynmploc, "utf8");
                const s: Array<CynthiaPluginManifestItem> = JSON.parse(t);
                for (const pl of s) {
                    pluginlist.push(pl.id);
                }
                ;
            }
            console.log(pluginlist);
            const plugins = [];
            for (const pl of pluginlist) {
                if (pl === "cynthia-dash") {
                    plugins.push(
                        {
                            name: "cynthia-dash",
                            description: "The Cynthia Dashboard you are looking at right now!",
                            version: (() => {
                                try {
                                    return JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json"), "utf8")).version.toString();
                                } catch (e) {
                                    return "Unknown";
                                }
                            })(),
                            thumbnail: "/assets/png/cynthia_tbgs.png",
                            author: "Strawmelonjuice"
                        },
                    )
                    continue
                }
                console.log(`Fetching info about ${pl} from the index... ${path.join(__dirname, `../../${pl}/package.json`)}`)
                    try {
                        const pida: Array<CynthiaPluginRepoItem> = (JSON.parse(fs.readFileSync(path.join(__dirname, "../generated/CynthiaPluginIndex.json"), "utf8")));
                        for (const p of pida) {
                            if (p.id === pl) {
                                console.log("Match!");
                                plugins.push({
                                    name: pl,
                                    description: p.description,
                                    version: (() => {
                                        try {
                                            return JSON.parse(fs.readFileSync(path.join(__dirname, `../../${p.id}/package.json`), "utf8")).version.toString();
                                        } catch (e) {
                                            return "Unknown";
                                        }
                                    })(),
                                    thumbnail: p.thumbnail,
                                    author: p.author,
                                })
                            }
                        }
                    }
                    catch {
                        plugins.push({
                            name: pl,
                            description: "No description available.",
                            version: (() => {
                                try {
                                    return JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json"), "utf8")).version.toString();
                                } catch (e) {
                                    return "Unknown";
                                }
                            })(),
                            thumbnail: "/assets/png/cynthia.png",
                            author: "Unknown",
                        })
                    }
            }
            return hb.plugins({ plugins, cynplmlocation: cynmploc });
            // return (Handlebars.compile(fs.readFileSync(
            //     path.join(__dirname, "../assets/handlebars/dashboard/plugins.handlebars"),
            //     "utf8",
            // )))({ plugins, cynplmlocation: cynmploc });
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