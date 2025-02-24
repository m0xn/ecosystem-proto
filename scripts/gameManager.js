import { stateManager } from "./stateManager.js";
import { playersManager, playersUpdateEv } from "./playersManager.js";
import { resetDices } from "./rollManager.js";

const startCycleBtn = document.querySelector("button#start-cycle");
const freeRollBtn = document.querySelector("button#free-roll");
const finishTurnBtn = document.querySelector("button#finish-turn");

export const freeRollAllowedStates = ["preCycle", "c1PlayerSelect", "c2PlayerSelect", "freeRoll"];
const debugModeAllowedStates = ["preCycle", "c1PlayerSelect", "c2PlayerSelect", "debug"];


startCycleBtn.addEventListener("click", () => {
	if (playersManager.players.filter(pl => pl.group === "c1").length < 1 || playersManager.players.filter(pl => pl.group === "c2").length < 1) {
		window.alert("No puedes empezar una partida si no tienes al menos un jugador de cada nivel trófico");
		return;
	}
	stateManager.changeState("c1PlayerSelect");
});

freeRollBtn.addEventListener("click", () => {
	resetDices();
	const freeRollMode = stateManager.state === "freeRoll"
	if (!freeRollMode) stateManager.saveState();

	stateManager.changeState(freeRollMode ? stateManager.savedState : "freeRoll");
	finishTurnBtn.disabled = freeRollMode ? stateManager.savedStateInfo.turnBtnDisabled : true;
	freeRollBtn.innerHTML = freeRollMode ? "Tirada libre" : "Restaurar estado";
});

document.addEventListener("keydown", e => {
	if (!debugModeAllowedStates.includes(stateManager.state)) return;

	if (e.shiftKey && e.key === "D") {
		const debugMode = stateManager.state === "debug";
		if (!debugMode) stateManager.saveState();

		stateManager.changeState(debugMode ? stateManager.savedState : "debug");
		finishTurnBtn.disabled = debugMode ? stateManager.savedStateInfo.turnBtnDisabled : true;
		document.body.style.cursor = debugMode ? "" : "cell";

		if (debugMode
			&& playersManager.lastSelected === stateManager.savedStateInfo.prevSelectedPlayer
			&& !playersManager.playersInGame.includes(playersManager.lastSelected)
			&& stateManager.savedState.includes("PlayerSelect")
			|| !playersManager.lastSelected
		) return;

		playersManager.lastSelected.selected = false;
		document.dispatchEvent(playersUpdateEv);
	}
});

document.addEventListener("players-update", () => {
	if (!stateManager.state.includes("PlayerSelect") || stateManager.selectedInDebug) return;
	stateManager.changeState("playerRoll");
});
