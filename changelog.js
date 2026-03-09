const lastSeen = JSON.parse(localStorage.getItem("lastSeen") ?? "null");
const update = 1773085468389; // Timestamp of last update

localStorage.setItem("lastSeen", Date.now().toString());

const beenHereBefore = localStorage.getItem("content") !== null;

if ((lastSeen && lastSeen < update) || (!lastSeen && beenHereBefore)) {
	Toastify({
		text: "Fixed the new documentation page, which has better pages to explain existing features and also covers new features like dates and durations. Click here to see the documentation.",
		destination: "documentation",
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