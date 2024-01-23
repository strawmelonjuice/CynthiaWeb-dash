function switchpages(to) {
    const navbutton= {
        dashboard: {mobile: document.getElementById("mobile-dashboard-nav"), desktop: document.getElementById("dashboard-nav"), location: "dashboard"},
        pages: {mobile: document.getElementById("mobile-pages-nav"), desktop: document.getElementById("pages-nav"), location: "pages"},
        plugins: {mobile: document.getElementById("mobile-plugins-nav"), desktop: document.getElementById("plugins-nav"), location: "plugins"},
        customisation: {mobile: document.getElementById("mobile-customisation-nav"), desktop: document.getElementById("customisation-nav"), location: "customisation"},
    };
    for (const d in navbutton) {
        const a = navbutton[d];
        for (const h of [a.mobile, a.desktop]) {h.setAttribute("onclick", `switchpages("${d}")`);}
        if (d === to) {
            a.mobile.setAttribute("class","bg-red-400 dark:bg-red-900 text-white block rounded-md px-3 py-2 text-base font-medium");
            a.desktop.setAttribute("class", "bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium");
            a.ariaCurrent = "page";
            axios.get('/dashboard-fetch/' + a.location)
  .then(function (response) {
      document.querySelector("main").innerHTML = response.data;
  })
  .catch(function (error) {
      document.querySelector("main").innerText = "There was an error loading this page."
      console.error(error);
  });
            
        } else {
            a.mobile.setAttribute("class","text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium");
            a.desktop.setAttribute("class", "text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium");
            a.ariaCurrent = "page";
        }
    }
}
switchpages("dashboard");

function mobileMenuToggle() {
    const mobilemenu = document.getElementById("mobile-menu");
    if (mobilemenu.classList.contains("hidden")) {
        mobilemenu.classList.remove("hidden")
        document.getElementById("btn-mobile-menu-open").classList.add("hidden")
        document.getElementById("btn-mobile-menu-close").classList.remove("hidden")
    } else {
        mobilemenu.classList.add("hidden")
        document.getElementById("btn-mobile-menu-open").classList.remove("hidden")
        document.getElementById("btn-mobile-menu-close").classList.add("hidden")
    }
}

mobileMenuToggle();
(document.getElementById("btn-mobile-menu")).setAttribute("onClick", "mobileMenuToggle()");

function userMenuToggle() {
    const userMenu = document.getElementById("user-menu");
    if (userMenu.classList.contains("hidden")) {
        userMenu.classList.remove("hidden")
    } else {
        userMenu.classList.add("hidden")
    }
}

userMenuToggle();
(document.getElementById("user-menu-button")).setAttribute("onClick", "userMenuToggle()");