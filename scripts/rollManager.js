import { playersManager, playersUpdateEv } from "./playersManager.js";
import { stateManager } from "./stateManager.js";

export let diceRolled = false;

class Dice {
	constructor(el) {
		this.value = 0;
		this.el = el;
		this.rolling = false;
		this.rolled = false;
	}
}

const MINITERS = 10;
const MAXITERS = 40;

function handleSpeedMod(speedMod) {
	playersManager.lastSelected.speed += speedMod;
	document.dispatchEvent(playersUpdateEv);
	disableButtons();
}

function rollDice(dice, interval = 100) {
	const iters = MAXITERS - playersManager.playersInGame.length * 2 > MINITERS
		? MAXITERS - playersManager.playersInGame.length * 2
		: MINITERS;
	let completedIters = 0;
	dice.rolling = true;

	return new Promise((resolve, _) => {
		const rollingAnimID = setInterval(() => {
			const rolledNumber = Math.floor(Math.random() * 6) + 1;
			if (completedIters == iters - 1) {
				dice.rolling = false;
				dice.value = rolledNumber;
				dice.rolled = true;
				resolve(dice.value);
				if (dice.el.id == "left-dice" && rightDice.rolled
					|| dice.el.id == "right-dice" && leftDice.rolled) {
					document.dispatchEvent(finishRollEv);
					diceRolled = true;
				}
				clearInterval(rollingAnimID);
			}
			dice.el.src = `sprites/dice${rolledNumber}.png`;
			completedIters++;
		}, interval);
	})
}

// TODO: change the name of the speed amplifier card to something else when C2 players are rolling
const diceSprites = [
	"sprites/dice1.png",
	"sprites/dice2.png",
	"sprites/dice3.png",
	"sprites/dice4.png",
	"sprites/dice5.png",
	"sprites/dice6.png",
];

const finishRollEv = new Event("finish-roll");
document.addEventListener("finish-roll", () => {
	finishRollBtn.disabled = false;
});

const SPEEDBOOST = 6;
const SPEEDNERF = -2;

const speedAmpBtn = document.querySelector("button#speed-amp");
const speedNerfBtn = document.querySelector("button#speed-nerf");
const coopBtn = document.querySelector("button#coop");

const finishRollBtn = document.querySelector("button#finish-roll");
const finishTurnBtn = document.querySelector("button#finish-turn");

const leftDice = new Dice(document.querySelector("img#left-dice"));
const rightDice = new Dice(document.querySelector("img#right-dice"));

leftDice.el.addEventListener("click", async () => {
	if (stateManager.state !== "playerRoll" || leftDice.rolled || leftDice.rolling) return;
	const diceRes = await rollDice(leftDice);
	playersManager.lastSelected.speed += diceRes;
	document.dispatchEvent(playersUpdateEv);
});

rightDice.el.addEventListener("click", async () => {
	if (stateManager.state !== "playerRoll" || rightDice.rolled || rightDice.rolling) return;
	const diceRes = await rollDice(rightDice);
	playersManager.lastSelected.speed += diceRes;
	document.dispatchEvent(playersUpdateEv);
});

const disableButtons = () => {
	speedAmpBtn.disabled = true;
	speedNerfBtn.disabled = true;
	coopBtn.disabled = true;
}

speedAmpBtn.addEventListener("click", () => { handleSpeedMod(SPEEDBOOST); });
speedNerfBtn.addEventListener("click", () => { handleSpeedMod(SPEEDNERF); });
coopBtn.addEventListener("click", () => {
	playersManager.lastSelected.cooperation = true;
	disableButtons();
});

const resetDices = () => {
	leftDice.rolled = false;
	rightDice.rolled = false;
	diceRolled = false;
}

finishRollBtn.addEventListener("click", () => {
	const playersInGroup = playersManager.players.filter(pl => pl.group === playersManager.lastSelected.group);
	const playersInGame = playersManager.playersInGame.filter(pl => pl.group === playersManager.lastSelected.group);
	if (playersInGroup.length !== playersInGame.length) stateManager.changeState(`${playersManager.lastSelected.group}PlayerSelect`);
	else {
		if (playersManager.lastSelected.group == "c1") stateManager.changeState("c2PlayerSelect");
		else stateManager.changeState("finalResults");
	}
	resetDices();
});

finishTurnBtn.addEventListener("click", () => {
	if (playersManager.lastSelected.group === "c1") stateManager.changeState("c2PlayerSelect");
	else stateManager.changeState("finalResults");
	resetDices();
});
