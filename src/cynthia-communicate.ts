import config from "./config"

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