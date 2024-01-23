function authtry() {
	const submitbutton = document.forms["login"]["submitbutton"];
	submitbutton.innerHTML = `<div style="background-image: url('/assets/svg/spinner.svg'); background-repeat: no-repeat; background-size: cover;" class="pl-max pr-max relative h-10 w-10"></div>`;
	submitbutton.setAttribute("disabled", "");

	document.getElementById("Aaa1").innerText = `Checking credentials...`;
	if (
		document.forms["login"]["username"].value === "" ||
		document.forms["login"]["username"].value === ""
	) {
		//        Shouldn't be necessary.
	}

	function c(a) {
		if (a.Ok === true) {
			submitbutton.innerHTML = `<div style="background-image: url('/assets/svg/check.svg'); background-repeat: no-repeat; background-size: cover;" class="pl-max pr-max relative h-10 w-10"></div>`;
			document.getElementById("Aaa1").innerText =
				`Login successful, you will be forwarded now.`;
			setTimeout(() => {
				window.location.replace("/");
			}, 2400);
		} else {
			submitbutton.innerHTML = `<div style="background-image: url('/assets/svg/red_x.svg'); background-repeat: no-repeat; background-size: cover;" class="pl-max pr-max relative h-10 w-10"></div>`;
			document.getElementById("Aaa1").innerText =
				`Something went wrong. Did you enter the correct credentials?`;
			setTimeout(() => {
				submitbutton.innerText = "Authorize";
				submitbutton.removeAttribute("disabled");
			}, 2400);
		}
	}
	$.ajax({
		type: "POST",
		url: "/api/auth",
		data: JSON.stringify({
			username: document.forms["login"]["username"].value,
			password: document.forms["login"]["password"].value,
		}),
		success: c,
		contentType: "application/json",
		dataType: "json",
	});
}

