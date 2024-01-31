import path from "path";
import config from "./config";
import {PublishedFileObject, PostPageObject} from "./interfaces";
import fs from "fs";
import {load as loadYAML} from "js-yaml";
import tell from "./logging";
import {jsonc} from 'jsonc';
import chalk from "chalk";

export function get(id: string): string {
    switch (id) {
        case "parentnodeadress":
            if ("" === config.settings.properties.homesite) {
//                @todo:
//                  Read .env from hosting engine and base the adress on that. (or, even better: make cynthiaEngine log its last request url)
                return JSON.stringify("http://localhost:3000/");
            }
            return JSON.stringify(config.settings.properties.homesite);
    }
    return "";
}

export const publishedfile = {
    set: function (s: PublishedFileObject) {

    },
    get: function (): PublishedFileObject {
        let k: PublishedFileObject;
        if (fs.existsSync(path.join("../../cynthiaFiles/published.jsonc"))) {
            try {
                k = jsonc.parse(fs.readFileSync(path.join("../../cynthiaFiles/published.jsonc"), "utf8"));
            } catch (e) {
                tell.error(`Couldn't read ${chalk.yellowBright.bold(path.join("../../cynthiaFiles/published.jsonc"))}! CynthiaDash is crashing.`)
                process.exit(0);
            }
        } else if (fs.existsSync(path.join("../../cynthiaFiles/published.yaml"))) {
            try {
                k = loadYAML(fs.readFileSync(path.join("../../cynthiaFiles/published.yaml"), "utf8")) as PublishedFileObject;
            } catch (e) {
                tell.error(`Couldn't read ${chalk.yellowBright.bold(path.join("../../cynthiaFiles/published.yaml"))}! CynthiaDash is crashing.`)
                process.exit(0);
            }
        } else {
            tell.error(`No ${chalk.yellowBright.bold(path.join("../../cynthiaFiles/published.jsonc"))} or ${chalk.yellowBright.bold(path.join("../../cynthiaFiles/published.jsonc"))} found. CynthiaDash is crashing.`)
            process.exit(0);
        }
        return k;
    }
}