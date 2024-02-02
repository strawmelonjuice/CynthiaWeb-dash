import path from "path";
import fs from "fs";
import passwordgenerator from "generate-password";
import tell from "./logging";

let config = {
    enabled: true,
    settings: {
        port: 3001,
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

    tell.info(
        `config.json file found! Loading config${((a) => {
            let b = JSON.parse(a);
            if (b.verbose === true) return (": \n" + JSON.stringify(b));
            return "...";
        })(t)}`,
    );
    config = JSON.parse(t);
} else {
    console.log("No config.json file found. Generating a clean config...");
    fs.writeFileSync(configfile, JSON.stringify(config));
}
export default config;