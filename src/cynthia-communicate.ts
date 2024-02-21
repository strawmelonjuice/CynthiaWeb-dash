import qs from "qs";
import path from "path";
import {
	PublishedFileObject,
	PostPageObject,
	EngineEnvFile,
} from "./interfaces";
import fs from "fs";
import { load as loadYAML } from "js-yaml";
import { jsonc } from "jsonc";
import chalk from "chalk";
import axios from "axios";



export function getengineenv(): EngineEnvFile {
	const data: EngineEnvFile = {
		PORT: 0,
		STYLESHEET_CACHE_LIFETIME: 0,
		JAVASCRIPT_CACHE_LIFETIME: 0,
		EXTERNAL_CACHE_LIFETIME: 0,
		SERVED_CACHE_LIFETIME: 0,
	};
	if (fs.existsSync(path.join("../../.env"))) {
		const t = fs.readFileSync(path.join("../../.env"), "utf8");
		for (const line of t.split("\n")) {
			if (line.startsWith("#")) continue;
			if (line === "") continue;
			let p = false;

			for (const v of line.split("=")) {
				if (v === undefined || v === "") p = true;
			}

			if (p) continue;

			const key = line.split("=")[0].toUpperCase();
			data[key] = line.split("=")[1];
		}
	} else {
		console.error("No .env file found. Cynthia needs one.");
		process.exit(1);
	}
	return data;
}

import config from "./config";

export function get(id: string): string {
	switch (id) {
		case "parentnodeadress":
			if ("" === config.settings.properties.homesite) {
				return JSON.stringify(`http://localhost:${getengineenv().PORT}/`);
			}
			return JSON.stringify(config.settings.properties.homesite);
	}
}

export class cynthiadashinterfaceapi {
	iad: string;
	passkey: string;

	constructor() {
		this.iad = `${JSON.parse(get("parentnodeadress"))}/dashapi/`.replaceAll(
			"//dashapi/",
			"/dashapi/",
		);
		this.passkey = config.passkey;
	}

	sendcommand(command: string, subcommand: string, args: string[]) {
		const reqdata = {
			command,
			subcommand,
			params: JSON.stringify(args),
			passkey: this.passkey,
		};
		const options = {
			method: "POST",
			headers: { "content-type": "application/x-www-form-urlencoded" },
			data: qs.stringify(reqdata),
			url: this.iad,
		};
		axios(options).catch((response) => {
			console.error(response);
			console.log(
				"CynthiaDash cannot communicate with CynthiaEngine instance.",
			);
		});
	}

	// biome-ignore lint/suspicious/noConfusingVoidType: Void is genuine.
sendlog(logtype: string | number, msg: string): number | void {
		const reqdata = {
			command: "log",
			subcommand: (function tologfunctioncode() {
				if (typeof logtype === "number") return logtype;
				switch (logtype) {
					case "error":
						return 12;
					case "warn":
						return 15;
					case "info":
						return 10;
					case "debug":
						return 0;
				}
			})(),
			params: chalk.reset(msg),
			passkey: this.passkey,
		};
		const options = {
			method: "POST",
			headers: { "content-type": "application/x-www-form-urlencoded" },
			data: qs.stringify(reqdata),
			url: this.iad,
		};
		let l = 1;
		axios(options)
			.then(() => {
				if (logtype === 666) {
					l = 0;
				}
			})
			.catch((response) => {
				if (logtype === 666) {
					l = 1;
				} else {
					console.error(response);
					console.log("CynthiaDash could not log on CynthiaEngine instance.");
				}
			});
		if (logtype === 666) {
			return l;
		}
	}
}

// @ts-ignore
export const Cynthia = new cynthiadashinterfaceapi();

//import tell from "./logging";
const tell = console;
export const publishedfile = {
	set: (s: PublishedFileObject) => {},
	get: (): PublishedFileObject => {
		let k: PublishedFileObject;
		if (fs.existsSync(path.join("../../cynthiaFiles/published.jsonc"))) {
			try {
				k = jsonc.parse(
					fs.readFileSync(
						path.join("../../cynthiaFiles/published.jsonc"),
						"utf8",
					),
				);
			} catch (e) {
				tell.error(
					`Couldn't read ${chalk.yellowBright.bold(
						path.join("../../cynthiaFiles/published.jsonc"),
					)}! CynthiaDash is crashing.`,
				);
				process.exit(0);
			}
		} else if (fs.existsSync(path.join("../../cynthiaFiles/published.yaml"))) {
			try {
				k = loadYAML(
					fs.readFileSync(
						path.join("../../cynthiaFiles/published.yaml"),
						"utf8",
					),
				) as PublishedFileObject;
			} catch (e) {
				tell.error(
					`Couldn't read ${chalk.yellowBright.bold(
						path.join("../../cynthiaFiles/published.yaml"),
					)}! CynthiaDash is crashing.`,
				);
				process.exit(0);
			}
		} else {
			tell.error(
				`No ${chalk.yellowBright.bold(
					path.join("../../cynthiaFiles/published.jsonc"),
				)} or ${chalk.yellowBright.bold(
					path.join("../../cynthiaFiles/published.jsonc"),
				)} found. CynthiaDash is crashing.`,
			);
			process.exit(0);
		}
		return k;
	},
};
