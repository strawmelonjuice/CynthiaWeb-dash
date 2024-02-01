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

setInterval(putpoll, 100);