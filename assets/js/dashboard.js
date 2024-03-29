function switchpages(toPageName) {
	//    console.log("To: " + toPageName)
	let to = toPageName;
	if (toPageName === "") to = "dashboard";
	const navbutton = {
		dashboard: {
			mobile: document.getElementById("mobile-dashboard-nav"),
			desktop: document.getElementById("dashboard-nav"),
			location: "dashboard",
			navigator: true,
		},
		pages: {
			mobile: document.getElementById("mobile-pages-nav"),
			desktop: document.getElementById("pages-nav"),
			location: "pages",
			navigator: true,
		},
		"pages-editor": {
			mobile: document.getElementById("mobile-pages-nav"),
			desktop: document.getElementById("pages-nav"),
			location: "pages-editor",
			navigator: false,
			f: () => {
				const g = document.getElementById("whatamiediting");
				if (getParams().new !== undefined) {
					g.innerText = "Creating a new publication!";
					return;
				}
				if (getParams().id === undefined) {
					g.innerText = "... with nothing open.";
					return;
				}
				if (getParams().id !== undefined) {
					g.innerHTML = `Editing <i><b>${getParams().id}</b></i>!`;
					return;
				}
			},
		},
		addplugin: {
			mobile: document.getElementById("mobile-plugins-nav"),
			desktop: document.getElementById("plugins-nav"),
			location: "addplugin",
			navigator: false,
		},
		plugins: {
			mobile: document.getElementById("mobile-plugins-nav"),
			desktop: document.getElementById("plugins-nav"),
			location: "plugins",
			navigator: true,
			f: () => {
				document.getElementById("plugin-remove-cynthia-dash").remove();
			}
		},
		customisation: {
			mobile: document.getElementById("mobile-customisation-nav"),
			desktop: document.getElementById("customisation-nav"),
			location: "customisation",
			navigator: true,
		},
	};
	for (const d in navbutton) {
		const a = navbutton[d];
		if (a.navigator) {
			for (const h of [a.mobile, a.desktop]) {
				h.setAttribute("onclick", `switchpages("${d}")`);
			}
		}
		if (d === to) {
			a.mobile.setAttribute(
				"class",
				"bg-red-400 dark:bg-red-900 text-white block rounded-md px-3 py-2 text-base font-medium",
			);
			a.desktop.setAttribute(
				"class",
				"bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium",
			);
			a.ariaCurrent = "page";
			axios
				.get(`/dashboard-fetch/${a.location}`)
				.then((response) => {
					document.querySelector("main").innerHTML = response.data;
					if (window.location.hash === "") window.location.hash = to;
					else {
						window.location.hash = window.location.hash.replace(
							window.location.hash.split("?")[0],
							to,
						);
					}
					window.displayedPage = to;
					if (a.f !== undefined) {
						a.f();
					}
				})
				.catch((error) => {
					document.querySelector("main").innerText =
						"There was an error loading this page.";
					console.error(error);
				});
		} else {
			if (a.navigator) {
				a.mobile.setAttribute(
					"class",
					"text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium",
				);
				a.desktop.setAttribute(
					"class",
					"text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium",
				);
				a.ariaCurrent = "none";
			}
		}
	}
}

function hashIsolated() {
	if (window.location.hash === "") return "";
	return window.location.hash.split("#")[1].split("?")[0];
}

setInterval(() => {
	if (
		window.displayedPage === undefined ||
		hashIsolated() !== window.displayedPage
	) {
		console.log("Automatically switching this page up.");
		switchpages(hashIsolated());
	}
}, 100);

function mobileMenuToggle() {
	const mobilemenu = document.getElementById("mobile-menu");
	if (mobilemenu.classList.contains("hidden")) {
		mobilemenu.classList.remove("hidden");
		document.getElementById("btn-mobile-menu-open").classList.add("hidden");
		document.getElementById("btn-mobile-menu-close").classList.remove("hidden");
	} else {
		mobilemenu.classList.add("hidden");
		document.getElementById("btn-mobile-menu-open").classList.remove("hidden");
		document.getElementById("btn-mobile-menu-close").classList.add("hidden");
	}
}

mobileMenuToggle();
document
	.getElementById("btn-mobile-menu")
	.setAttribute("onClick", "mobileMenuToggle()");

function userMenuToggle() {
	const userMenu = document.getElementById("user-menu");
	if (userMenu.classList.contains("hidden")) {
		userMenu.classList.remove("hidden");
	} else {
		userMenu.classList.add("hidden");
	}
}

userMenuToggle();
document
	.getElementById("user-menu-button")
	.setAttribute("onClick", "userMenuToggle()");

window.pollers.push(() => {
	{
		const f = document.getElementById("userimg");
		if (f == null || f !== undefined) {
			f.setAttribute("alt", GeneralSiteInfo.username);
		}
	}
	for (const a of document.getElementsByClassName("settodisplayname")) {
		a.innerText = GeneralSiteInfo.displayname;
	}
});

function LogOut() {
	localStorage.clear();
	window.location.assign("/api/signout");
}

const c = {
	plugins: {
		remove: (plugin) => {
			console.log(`${plugin} is being removed`);
			axios
				.post("/api/plugin.remove", {
					plugin: plugin,
				})
				.then((response) => {
					console.log(response.data);
				})
				.catch((error) => {
					console.error(error);
				});
			setTimeout(() => {
				switchpages("plugins")
			}, 800);
        },
	}
}