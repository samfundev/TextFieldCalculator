const lastVisit = JSON.parse(localStorage.getItem("lastVisit") ?? "null");
const update = 1760245980778; // Timestamp of last update

localStorage.setItem("lastVisit", Date.now().toString());

if (lastVisit && lastVisit < update) {
	Toastify({
		text: "TCF now supports doing calculations with dates and durations. Click here to learn more.",
		destination: "/documentation",
		duration: 5000,
		close: true,
		gravity: "bottom",
		position: "right",
		stopOnFocus: true,
		style: {
			fontSize: "16px",
		}
	}).showToast();
}