import config from "../config";
import path from "path";
import fs from "fs";

import {tell, debuglog} from "../logging";
import {SessionData} from "express-session";
export function secure (page: string, session: SessionData) {
    if (config.enabled) {
        if (session.user_id != undefined) {
            return page;
        }
    } else {
        return fs.readFileSync(path.join(__dirname, "../../static/html/disabled.html"), 'utf8');
    }
    return fs.readFileSync(path.join(__dirname, "../../static/html/noaccess.html"), 'utf8');
}
export const authpage = fs.readFileSync(path.join(__dirname, "../../static/html/login.html"), 'utf8');
export function authorization (c: {username: string, password: string}): false | number {
    for (const n in (config.users)) {
        const u: {username: string, password: string} = config.users[n];
        if (c.username === u.username) {
            if (c.password === u.password) {
                tell.log(0, "WebAUTH",  `Username \`${u.username}´ successfully logged in.`)
                
                return parseInt(n) + 1;
            } else {
                tell.log(0, "WebAUTH",  `Username \`${u.username}´ DOES exist, but password \`${c.password}´ does not match \`${u.password}´.`)
                return false;}
        }
    }
    tell.log(0, "WebAUTH",  `Username \`${c.username}´ does not exist.`)
    return false;
}
export default {page: secure, authorization};