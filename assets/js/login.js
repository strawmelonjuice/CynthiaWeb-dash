function authtry() {
	const submitbutton = document.forms["login"]["submitbutton"];
	submitbutton.innerHTML = `<div style="background-image: url('/assets/svg/spinner.svg'); background-repeat: no-repeat; background-size: cover;" class="pl-max pr-max relative h-10 w-10"></div>`;
	submitbutton.setAttribute("disabled", "");
	setTimeout(() => {
		submitbutton.innerText = "Retry";
		submitbutton.removeAttribute("disabled");
	}, 9600);
	document.getElementById("Aaa1").innerText = `Checking credentials...`;

	if (
		document.forms["login"]["username"].value === "" ||
		document.forms["login"]["username"].value === ""
	) {
		//        Shouldn't be necessary.
	}

	function c(a) {
		if (a.data.Ok === true) {
			submitbutton.innerHTML = `<div style="background-image: url('/assets/svg/check.svg'); background-repeat: no-repeat; background-size: cover;" class="pl-max pr-max relative h-10 w-10"></div>`;
			document.getElementById("Aaa1").innerText =
				`Login successful, you will be forwarded now.`;
			setTimeout(() => {
				window.location.replace("/" + window.location.hash);
			}, 3000);
		} else {
			submitbutton.innerHTML = `<div style="background-image: url('/assets/svg/red_x.svg'); background-repeat: no-repeat; background-size: cover;" class="pl-max pr-max relative h-10 w-10"></div>`;
			document.getElementById("Aaa1").innerText =
				`Something went wrong. Did you enter the correct credentials?`;
			setTimeout(() => {
				submitbutton.innerText = "Authorize";
				submitbutton.removeAttribute("disabled");
			}, 3000);
		}
	}

	// timeout to allow spinner to show up

	setTimeout(() => {
		axios
			.post("/api/auth", {
				username: document.forms["login"]["username"].value,
				password: document.forms["login"]["password"].value,
			})
			.then(c)
			.catch(function (error) {
				console.log(error);
			});
	}, 500);
}
