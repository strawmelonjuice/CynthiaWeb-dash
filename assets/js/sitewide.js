let GeneralSiteInfo;

function pullpoll() {
    axios.get("/api/GeneralSiteInfoPoll")
        .then(function (response) {
            GeneralSiteInfo = response.data;
            GeneralSiteInfo.client = {}
            putpoll();
        })
        .catch((error) => {
            console.error(error);
        })
}


pullpoll()
setInterval(pullpoll, 30000);
window.pollers = [
    () => {
        for (const a of (document.getElementsByClassName("refertohomesite"))) {
            a.setAttribute("href", GeneralSiteInfo.parentnodeadress);
        }
    }
]

function putpoll() {
    pollers.forEach((o) => {
        o();
    })
}

setTimeout(function () {
    setInterval(putpoll);
}, 80)

function getParams() {
    let s = {};
    if (window.location.hash.split("?")[1] === undefined) return s;
    const o = window.location.hash.split("?")[1].split("&");
    for (const x of o) {
        const p = x.split("=");
        const q = p[0];
        s[q] = p[1];
    }
    return s;
}