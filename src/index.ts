import * as e from "express";

const path = require("path");
const fs = require("fs");
const pkgself = JSON.parse(fs.readFileSync("./package.json"))
const https = require("https");
const express = require("express");
const app = express();
switch (process.argv[2]) {
    case "serve": {
        const port = process.argv[3];

        app.get("/*", (req: e.Request, res: e.Response) => {
            res.send("Hello!");
        });
        app.listen(port, () => {
            console.log(`Cynthia-dash v${pkgself.version} is active!`)
        });
    }
        break;
}