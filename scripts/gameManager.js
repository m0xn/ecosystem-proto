import { stateManager } from "./stateManager.js";
import { playersManager, playersUpdateEv } from "./playersManager.js";

const startCycleBtn = document.querySelector("button#start-cycle");
const freeRollBtn = document.querySelector("button#free-roll");

startCycleBtn.addEventListener("click", () => {
	if (playersManager.players.filter(pl => pl.group === "c1").length < 1 || playersManager.players.filter(pl => pl.group === "c2").length < 1) {
		window.alert("No puedes empezar una partida si no tienes al menos un jugador de cada nivel trófico");
		return;
	}
	stateManager.changeState("c1PlayerSelect");
});

freeRollBtn.addEventListener("click", () => {
	if (stateManager.state === "freeRoll") {
		stateManager.changeState(stateManager.savedState);
		freeRollBtn.innerHTML = "Tirada libre";
		return;
	}

	stateManager.saveState();
	stateManager.changeState("freeRoll");
	freeRollBtn.innerHTML = "Restaurar estado";
});

document.addEventListener("keydown", e => {
	if (stateManager.state === "debug" && e.key === "Escape") {
		stateManager.changeState(stateManager.savedState);
		if (playersManager.lastSelected) {
			playersManager.lastSelected.selected = false;
			document.dispatchEvent(playersUpdateEv);
		}
	}

	if (e.shiftKey && e.key === "D" && stateManager.state !== "debug") {
		stateManager.saveState();
		stateManager.changeState("debug");
		console.log(stateManager);
	}
});

document.addEventListener("players-update", () => {
	if (!stateManager.state.includes("PlayerSelect")) return;
	stateManager.changeState("playerRoll");
});
