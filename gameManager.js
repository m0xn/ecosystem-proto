import { stateManager } from "./stateManager.js";
import { playersManager } from "./playersManager.js"

const startCycleBtn = document.querySelector("button#start-cycle");

startCycleBtn.addEventListener("click", () => {
	stateManager.changeState("playerSelect");
})

document.addEventListener("players-update", () => {
	if (stateManager.state !== "playerSelect") return;
	console.log(`The select player was ${playersManager.lastSelected.name}`);
	stateManager.changeState("playerRoll");
});
