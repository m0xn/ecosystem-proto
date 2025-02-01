import { stateManager } from "./stateManager.js";
import { playersManager } from "./playersManager.js";

const startCycleBtn = document.querySelector("button#start-cycle");

startCycleBtn.addEventListener("click", () => {
	if (playersManager.players.filter(pl => pl.group === "c1").length < 1 || playersManager.players.filter(pl => pl.group === "c2").length < 1) {
		window.alert("No puedes empezar una partida si no tienes al menos un jugador de cada nivel trófico");
		return;
	}
	stateManager.changeState("c1PlayerSelect");
})

document.addEventListener("players-update", () => {
	if (!stateManager.state.includes("PlayerSelect")) return;
	stateManager.changeState("playerRoll");
});
