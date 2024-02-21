import {Cynthia} from "./cynthia-communicate";

const tell = {
    log(_: number, tit: string, msg: string) {
        Cynthia.sendlog(1, `${tit} ${msg}`);
    },
    warn(msg: string) {
        Cynthia.sendlog(15, msg);
    },
    error(msg: string) {
        Cynthia.sendlog(5, msg);
    },
    info(msg: string) {
        Cynthia.sendlog(10, msg);
    },
    silly(msg: string) {
        Cynthia.sendlog(88, msg);
    },
    fatal(msg: string) {
        Cynthia.sendlog(5000, msg);
    },
};
export default tell;

export function panic(p: string) {
    tell.fatal(p);
    process.exit(1);
}