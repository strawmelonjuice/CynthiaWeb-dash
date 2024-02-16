import path from "path";
import fs from "fs";
import passwordgenerator from "generate-password";
import { configuration } from "./interfaces";



let config: configuration = {
    enabled: true,
    passkey: "// Do not change, this will be set automatically.",
    settings: {
        port: (() => {
            if (fs.existsSync(path.join("../../.env"))) {
                const t = fs.readFileSync(path.join("../../.env"), "utf8");
                for (const line of t.split("\n")) {

                    if (line.startsWith("#")) continue;
                    if (line === "") continue;
                    let p = false;

                    for (const v of line.split("=")) {
                        if (v === undefined || v === "") p = true;
                    };

                    if (p) continue;

                    const key = (line.split("=")[0]).toUpperCase();
                    if (key === "PORT") return parseInt(line.split("=")[1]) + 1;

                }
            }
            return 3001;
        })(),
        address: "localhost",
        verbose: false,
        session_secret: passwordgenerator.generate({
            length: 10,
            numbers: false,
        }),
        properties: {
            homesite: ""
        }
    },
    production: true,
    users: [
        {
            username: "cynthia",
            displayname: "Cynthia default account",
            password: passwordgenerator.generate({
                length: 13,
                numbers: true,
            }),
        },
    ],
};
const configfile = path.join(__dirname, "../config.json");
if (fs.existsSync(configfile)) {
    const t = fs.readFileSync(configfile, "utf8");

    console.info(
        `[Cynthia-Dash] [INFO]         config.json file found! Loading config${((a) => {
            const b = JSON.parse(a);
            if (b.verbose === true) return (`: \n${JSON.stringify(b)}`);
            return "...";
        })(t)}`,
    );
    config = JSON.parse(t);
} else {
    console.log("No config.json file found. Generating a clean config...");
    fs.writeFileSync(configfile, JSON.stringify(config));
}
config.passkey = process.argv[3];
export default config;