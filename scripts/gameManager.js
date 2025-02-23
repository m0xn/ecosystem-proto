import { stateManager } from "./stateManager.js";
import { playersManager, playersUpdateEv } from "./playersManager.js";
import { resetDices } from "./rollManager.js";

const startCycleBtn = document.querySelector("button#start-cycle");
const freeRollBtn = document.querySelector("button#free-roll");
const finishTurnBtn = document.querySelector("button#finish-turn");

export const freeRollAvailableStates = ["preCycle", "c1PlayerSelect", "c2PlayerSelect", "freeRoll"];

startCycleBtn.addEventListener("click", () => {
	if (playersManager.players.filter(pl => pl.group === "c1").length < 1 || playersManager.players.filter(pl => pl.group === "c2").length < 1) {
		window.alert("No puedes empezar una partida si no tienes al menos un jugador de cada nivel trófico");
		return;
	}
	stateManager.changeState("c1PlayerSelect");
});

freeRollBtn.addEventListener("click", () => {
	resetDices();
	if (stateManager.state === "freeRoll") {
		stateManager.changeState(stateManager.savedState);
		finishTurnBtn.disabled = stateManager.savedFinishTurnState;
		freeRollBtn.innerHTML = "Tirada libre";
		return;
	}

	stateManager.saveState();
	finishTurnBtn.disabled = true;
	stateManager.changeState("freeRoll");
	freeRollBtn.innerHTML = "Restaurar estado";
});

document.addEventListener("keydown", e => {
	if (stateManager.state === "debug" && e.key === "Escape") {
		stateManager.changeState(stateManager.savedState);
		finishTurnBtn.disabled = stateManager.savedFinishTurnState;
		document.body.style.cursor = "";
		if (playersManager.lastSelected) {
			playersManager.lastSelected.selected = false;
			document.dispatchEvent(playersUpdateEv);
		}
	}

	if (e.shiftKey && e.key === "D" && stateManager.state !== "debug") {
		stateManager.saveState();
		finishTurnBtn.disabled = true;
		stateManager.changeState("debug");
		document.body.style.cursor = "cell";
	}
});

document.addEventListener("players-update", () => {
	if (!stateManager.state.includes("PlayerSelect")) return;
	stateManager.changeState("playerRoll");
});
