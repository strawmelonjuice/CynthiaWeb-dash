let GeneralSiteInfo;

function pullpoll() {
    $.ajax({
        type: "GET",
        url: "/api/GeneralSiteInfoPoll",
        data: "",
        success: (data) => {
            GeneralSiteInfo = data;
            putpoll();
        },
        contentType: "application/json",
        dataType: "json",
    });
}

pullpoll()
setInterval(pullpoll, 30000);

function putpoll() {
    for (const a of (document.getElementsByClassName("refertohomesite"))) {
        a.setAttribute("href", GeneralSiteInfo.parentnodeadress);
    }
    {
        const f = document.getElementById("userimg");
        if (f !== undefined) {
            f.setAttribute("alt", GeneralSiteInfo.username)
        }
    }
    for (const a of (document.getElementsByClassName("settodisplayname"))) {
        a.innerText = GeneralSiteInfo.displayname;
    }
}

setInterval(putpoll, 100);