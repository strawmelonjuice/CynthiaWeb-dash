import * as e from "express";
import path from "path";
import fs from "fs";

import logging from "../logging";
import {secure} from "./access"
export default (req: e.Request, res: e.Response) => {
    res.send(secure(fs.readFileSync(path.join(__dirname, "../../web/index.html"), 'utf8'), req.session));
}