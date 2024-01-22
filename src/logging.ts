import fs from "fs";
import path from "path";
import tslog from "tslog";
import chalk from "chalk";

const verbose = require("./config").verbose;
const stripAnsiCodes = (str: string) =>
    str.replace(
        // biome-ignore lint/suspicious/noControlCharactersInRegex:
        /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
        "",
    );

class logging {
    logfile: string;

    constructor(logfile: string) {
        this.logfile = logfile;
        this.info(`🖊 Logging to "${logfilename}".`);
    }

    logtofile(cat: string, msg: string) {
        fs.writeFileSync(
            this.logfile,
            `\n[${cat} ${new Date().toLocaleTimeString()}] ${msg}`,
            {flag: "a"},
        );
    }

    connsola2(chalkedname: string, message: string) {
        const chalkednames = `[Cynthia-Dash] ${chalkedname}`
        const i = 45;
        let spaces = "\t\t\t";
        if (!(stripAnsiCodes(chalkednames).length > i)) {
            const numberofspaces = i - stripAnsiCodes(chalkednames).length;
            spaces = " ".repeat(numberofspaces)
        };
        console.log(chalkednames + spaces + message);
    }

    log(_errorlevel: number, name: string, content: string) {
        this.logtofile(name, content);
        this.connsola2(`[${name}]`, content);
    }

    warn(content: string) {
        this.logtofile("WARN", content);
        this.connsola2(`[${chalk.hex("#c25700")("WARN")}]`, content);
    }

    error(content: string) {
        this.logtofile("ERROR", content);
        this.connsola2(`[${chalk.redBright("ERROR")}]`, chalk.bgBlack.red(content));
    }

    info(content: string) {
        this.logtofile("INFO", content);
        this.connsola2(`[${chalk.hex("#6699ff")("INFO")}]`, content);
    }

    silly(content: string) {
        this.logtofile("SILLY", content);
        this.connsola2(`[${chalk.white("SILLY :3")}]`, chalk.bgBlack.red(content));
    }

    fatal(content: string) {
        this.logtofile("FATAL", content);
        this.connsola2(`[${chalk.bgBlack.red("FATAL")}]`, content);
    }
}

let logfilename: string;
let starttime: Date;
{
    starttime = new Date(Date.now());
    logfilename = path.join(__dirname, `../logs/log_${starttime.getDate()}-${starttime.getMonth()}-${starttime.getFullYear()}.log`);
}
if (!fs.existsSync("./logs")) {
    fs.mkdirSync("./logs");
}
let lt;
if (verbose) lt = new tslog.Logger();
else lt = new logging(logfilename);
export const tell = lt;
if (verbose) {
    tell.info("Verbose logging is ON.");
}
let _debuglog_;

const debuglog_ = _debuglog_;

export function debuglog(string: string) {
    if (verbose) {
        console.log("DEBUG:", string);
    }
}
export default tell