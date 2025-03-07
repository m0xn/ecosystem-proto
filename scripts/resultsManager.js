import { stateManager } from "./stateManager.js";
import { playersManager, nameToId } from "./playersManager.js";
import { resetDices } from "./rollManager.js";

const capturesList = document.querySelector("ul#captures-list");
const savedList = document.querySelector("ul#saved-list");
const hungerList = document.querySelector("ul#hunger-list");
const hiddenList = document.querySelector("ul#hidden-list");

const nextCycleBtn = document.querySelector("button#next-cycle");

document.addEventListener("change-state", async () => {
	if (stateManager.state !== "finalResults") return;
	let c1Players = playersManager.playersInGame.filter(pl => pl.group === "c1" && pl.speed > 0 && !pl.mimesis).sort((prev, curr) => prev.speed - curr.speed);
	const c2Players = playersManager.playersInGame.filter(pl => pl.group === "c2" && pl.speed > 0).sort((prev, curr) => prev.speed - curr.speed);

	const hungry = [];

	for (const player of c2Players.toSorted((prev, curr) => prev.speed - curr.speed)) {
		const prey = c1Players.find(pl => pl.speed < player.speed);
		if (!prey) {
			hungry.push(player);
			continue;
		}
		const predatorEntry = playersManager.createPlayerEntry(player);
		predatorEntry.className = "c2-entry";

		const preyEntry = playersManager.createPlayerEntry(prey, true);
		preyEntry.className = prey.exotic ? "c1-exotic-entry" : "c1-entry";

		capturesList.appendChild(predatorEntry);
		capturesList.appendChild(preyEntry);
		c1Players = c1Players.filter(pl => pl !== prey);
	}

	c1Players
		.reverse()
		.forEach(pl => { savedList.appendChild(playersManager.createPlayerEntry(pl)); });
	hungry.forEach(pl => { hungerList.appendChild(playersManager.createPlayerEntry(pl)); });
	playersManager.playersInGame.filter(pl => pl.mimesis).forEach(pl => { hiddenList.appendChild(playersManager.createPlayerEntry(pl)); });
});

nextCycleBtn.addEventListener("click", () => {
	playersManager.playersInGame = [];
	playersManager.players.forEach(pl => {
		pl.speed = 0;
		pl.cooperation = false;
		const entry = document.querySelector(`li#${nameToId(pl.name)}`);
		const speedPar = document.querySelector(`li#${nameToId(pl.name)}>p`);
		speedPar.innerHTML = 0;
		if (entry.style) {
			entry.style = "";
			speedPar.style = "";
		}
	});

	while (capturesList.childNodes.length > 0) capturesList.removeChild(capturesList.firstChild);
	while (savedList.childNodes.length > 0) savedList.removeChild(savedList.firstChild);
	while (hungerList.childNodes.length > 0) hungerList.removeChild(hungerList.firstChild);
	while (hiddenList.childNodes.length > 0) hiddenList.removeChild(hiddenList.firstChild);

	resetDices();
	window.localStorage.setItem("players", JSON.stringify(playersManager.players));
	stateManager.changeState("preCycle");
});
