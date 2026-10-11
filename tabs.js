import * as monaco from "monaco-editor";
import { editor } from "./v2.js";
import { CLOSE, $ } from "./utils.js";

// Handle tabs
const tabs = [];
const tabsElement = $(".tabs");
export function updateTabs() {
	tabsElement.innerHTML = "";

	for (const tab of tabs) {
		const tabElement = document.createElement("div");
		tabElement.textContent = getTabTitle(tab);
		tabElement.addEventListener("click", () => {
			switchTab(tab);
		})
		tabElement.addEventListener("auxclick", (e) => {
			if (e.button === 1) 
				closeElement.click();
		});
		const closeElement = document.createElement("button");
		closeElement.innerHTML = CLOSE;
		closeElement.addEventListener("click", (e) => {
			e.stopPropagation();
			const index = tabs.indexOf(tab);
			tabs.splice(index, 1);
			switchTab(tabs[Math.min(index, tabs.length - 1)])
		})
		tabElement.append(closeElement);

		const active = editor.getModel() === tab;
		if (active) tabElement.classList.add("active");

		tabsElement.append(tabElement)
	}

	localStorage.setItem("tabs", JSON.stringify(tabs.map(tab => tab.getValue())));
}

function getTabTitle(tabModel) {
	const title = tabModel.getValueInRange({ startLineNumber: 1, endLineNumber: 1, startColumn: 0, endColumn: 20 })
		.replace(/^#/, "")
		.trim();
	return title.length === 0 ? "Untitled" : title;
}

function switchTab(tabModel) {
	editor.setModel(tabModel);

	localStorage.setItem("activeTab", tabs.indexOf(tabModel));
}

$(".new-tab").addEventListener("click", () => {
	tabs.push(monaco.editor.createModel("", "math"));
	switchTab(tabs.at(-1))
})

// Migrate old content key to tabs storage
const oldContent = localStorage.getItem("content");
if (oldContent !== null) {
	localStorage.removeItem("content");
	localStorage.setItem("tabs", JSON.stringify([oldContent]));
}

export function loadTabs() {
	const storedTabs = JSON.parse(localStorage.getItem("tabs") || "[]");
	const activeTab = JSON.parse(localStorage.getItem("activeTab") || "null");
	if (storedTabs.length > 0) {
		tabs.push(...storedTabs.map(content => monaco.editor.createModel(content, "math")));
		switchTab(tabs.at(activeTab ?? -1));
	} else {
		$(".new-tab").click()
	}
}