import { playersManager, playersUpdateEv, disablePlayerEntry, nameToId } from "./playersManager.js";
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

const MINITERS = 15;
const MAXITERS = 25;

const SPEEDBOOST = { "c1": 6, "c2": 6 };
const SPEEDNERF = { "c1": -2, "c2": -3 };

function handleSpeedMod(speedMod) {
	playersManager.lastSelected.speed += speedMod;
	document.dispatchEvent(playersUpdateEv);
	disableButtons();
}

const deselectLastPlayer = () => {
	playersManager.lastSelected.selected = false;
	document.dispatchEvent(playersUpdateEv);
};

const setNextTieBreakPlayer = player => {
	playersManager.lastSelected = player;
	playersManager.lastSelected.selected = true;
	playersManager.lastSelected.cooperation = false;
	playersManager.lastSelected.speed = 0;
	document.dispatchEvent(playersUpdateEv);
}

const clamp = (val, min, max = null) => val < min ? min : val > max && max ? max : val;

function rollDice(dice, interval = 125) {
	cancelSelectionBtn.disabled = true;
	finishTurnBtn.disabled = true;
	const iters = clamp(MAXITERS - playersManager.playersInGame.length * 2, MINITERS);
	let completedIters = 0;
	dice.rolling = true;

	return new Promise((resolve, _) => {
		const rollingAnimID = setInterval(() => {
			let rolledNumber = Math.ceil(Math.random() * 6);
			if (completedIters === iters - 1) {
				dice.rolling = false;
				dice.value = rolledNumber;
				dice.rolled = true;
				dice.el.style = "opacity: 65%;";
				resolve(dice.value);
				if (dice.el.id == "left-dice" && rightDice.rolled || dice.el.id == "right-dice" && leftDice.rolled) diceRolled = true;
				clearInterval(rollingAnimID);
			}
			dice.el.src = `sprites/dice${rolledNumber}.png`;
			completedIters++;
		}, interval);
	})
}

let matchingSpeeds = [];

function checkForTie() {
	let c1Players = playersManager.playersInGame.filter(pl => pl.group === "c1" && pl.speed > 0).toSorted((prev, curr) => prev.speed - curr.speed);
	let c2Players = playersManager.playersInGame.filter(pl => pl.group === "c2" && pl.speed > 0).toSorted((prev, curr) => prev.speed - curr.speed);

	return new Promise(async (resolve, _) => {
		for (const player of c2Players) {
			matchingSpeeds = c2Players.filter(pl => pl.speed === player.speed);
			if (matchingSpeeds.length > 1 && c1Players.filter(pl => pl.speed < player.speed).length < matchingSpeeds.length) {
				const header = document.createElement("h2");
				header.innerHTML = "¡Desempate!";

				const playersPar = document.createElement("p");
				for (let i = 0; i < matchingSpeeds.length; i++) {
					playersPar.innerHTML += i < matchingSpeeds.length - 1
						? `${matchingSpeeds[i].name} VS `
						: `${matchingSpeeds[i].name}`;
				}

				tieBreakHeader.appendChild(header);
				tieBreakHeader.appendChild(playersPar);
				tieBreakHeader.style.opacity = "100%";

				setNextTieBreakPlayer(matchingSpeeds[0]);

				stateManager.changeState("tie-break");
				if (!finishTurnBtn.disabled) finishTurnBtn.disabled = true;
				document.dispatchEvent(playersUpdateEv);
				resetDices();

				await new Promise((resolve, _) => {
					document.addEventListener("finish-tie", () => {
						deselectLastPlayer();

						tieBreakHeader.style.opacity = "0%";
						while (tieBreakHeader.childNodes.length > 0) tieBreakHeader.removeChild(tieBreakHeader.firstChild);

						resolve();
					});
				});

				c2Players = c2Players.filter(pl => pl.speed !== player.speed);
				continue;
			}

			const prey = c1Players.find(pl => pl.speed < player.speed);
			if (prey) {
				c1Players = c1Players.filter(pl => pl !== prey);
				c2Players = c2Players.filter(pl => pl !== player);
			}
		}

		resolve();
	});
}

function newHandleTieBreak() {
	const newIdx = matchingSpeeds.indexOf(playersManager.lastSelected) + 1;
	if (newIdx > matchingSpeeds.length - 1) {
		if (matchingSpeeds.every(pl => pl.speed === matchingSpeeds[0].speed)) {
			deselectLastPlayer();

			setNextTieBreakPlayer(matchingSpeeds[0]);

			stateManager.changeState("tie-break");
			document.dispatchEvent(playersUpdateEv);
			resetDices();
			return;
		}
		document.dispatchEvent(finishTieEv);
		return;
	}
	deselectLastPlayer();

	const nextPlayer = matchingSpeeds[newIdx];
	setNextTieBreakPlayer(nextPlayer);
	document.dispatchEvent(playersUpdateEv);

	resetDices();
	stateManager.changeState("tie-break");
}

const buttonsText = {
	coop: {
		c1: "Cooperación",
		c2: "Caza en grupo"
	},
	speedAmp: {
		c1: "Huida rápida",
		c2: "Ataque rápido"
	},
	speedNerf: {
		c1: "Herida",
		c2: "Herida"
	}
}

const finishRollEv = new Event("finish-roll");
const finishTieEv = new Event("finish-tie");
document.addEventListener("finish-roll", () => {
	if (stateManager.state === "tie-break") return;
	finishRollBtn.disabled = false;
	finishTurnBtn.disabled = false;
	playersManager.lastSelected.speed = clamp(playersManager.lastSelected.speed, 0);
	playersManager.lastSelected.selected = false;
	disablePlayerEntry(document.querySelector(`li#${nameToId(playersManager.lastSelected.name)}`));
	document.dispatchEvent(playersUpdateEv);
});

const speedAmpBtn = document.querySelector("button#speed-amp");
const speedNerfBtn = document.querySelector("button#speed-nerf");
const coopBtn = document.querySelector("button#coop");
const mimesisBtn = document.querySelector("button#mimesis");

const tieBreakHeader = document.querySelector("section#tie-break");

document.addEventListener("change-state", () => {
	if (stateManager.state !== "playerRoll") return;
	if (playersManager.lastSelected.exotic || playersManager.lastSelected.group === "c2") exoticSpecieBtn.disabled = true;
	const group = playersManager.lastSelected.group;
	speedAmpBtn.innerHTML = buttonsText.speedAmp[group];
	coopBtn.innerHTML = buttonsText.coop[group];
	speedNerfBtn.innerHTML = buttonsText.speedNerf[group];
	if (playersManager.lastSelected.group === "c2") mimesisBtn.disabled = true;
});

const finishRollBtn = document.querySelector("button#finish-roll");
const finishTurnBtn = document.querySelector("button#finish-turn");
finishTurnBtn.disabled = true; // Prevent the button from being enabled on load
const cancelSelectionBtn = document.querySelector("button#cancel-selection");
const exoticSpecieBtn = document.querySelector("button#exotic-specie");

const leftDice = new Dice(document.querySelector("img#left-dice"));
const rightDice = new Dice(document.querySelector("img#right-dice"));

leftDice.el.addEventListener("click", async () => {
	if (stateManager.state !== "playerRoll" && stateManager.state !== "tie-break" || leftDice.rolled || leftDice.rolling) return;
	const diceRes = await rollDice(leftDice);
	playersManager.lastSelected.speed += diceRes;
	document.dispatchEvent(playersUpdateEv);
	if (rightDice.rolled) {
		document.dispatchEvent(finishRollEv);
		if (stateManager.state === "tie-break") newHandleTieBreak();
	}
});

rightDice.el.addEventListener("click", async () => {
	if (stateManager.state !== "playerRoll" && stateManager.state !== "tie-break" || rightDice.rolled || rightDice.rolling) return;
	const diceRes = await rollDice(rightDice);
	playersManager.lastSelected.speed += diceRes;
	document.dispatchEvent(playersUpdateEv);
	if (leftDice.rolled) {
		document.dispatchEvent(finishRollEv);
		if (stateManager.state === "tie-break") newHandleTieBreak();
	}
});

const disableButtons = () => {
	speedAmpBtn.disabled = true;
	speedNerfBtn.disabled = true;
	coopBtn.disabled = true;
	mimesisBtn.disabled = true;
}

speedAmpBtn.addEventListener("click", () => { handleSpeedMod(SPEEDBOOST[playersManager.lastSelected.group]); });
speedNerfBtn.addEventListener("click", () => { handleSpeedMod(SPEEDNERF[playersManager.lastSelected.group]); });
coopBtn.addEventListener("click", () => {
	playersManager.lastSelected.cooperation = true;
	document.dispatchEvent(playersUpdateEv);
	disableButtons();
});
mimesisBtn.addEventListener("click", () => {
	playersManager.lastSelected.mimesis = true;
	disableButtons();
});
exoticSpecieBtn.addEventListener("click", () => {
	playersManager.lastSelected.exotic = true;
	playersManager.lastSelected.speed += 4;
	document.querySelector(`li#${nameToId(playersManager.lastSelected.name)}`).className = "exotic-list-entry";
	document.dispatchEvent(playersUpdateEv);
	exoticSpecieBtn.disabled = true;
});

export const resetDices = () => {
	leftDice.el.style = "";
	rightDice.el.style = "";
	leftDice.rolled = false;
	rightDice.rolled = false;
	diceRolled = false;
}

finishRollBtn.addEventListener("click", async () => {
	const playersInGroup = playersManager.players.filter(pl => pl.group === playersManager.lastSelected.group);
	const playersInGame = playersManager.playersInGame.filter(pl => pl.group === playersManager.lastSelected.group);
	if (playersInGroup.length !== playersInGame.length) stateManager.changeState(`${playersManager.lastSelected.group}PlayerSelect`);
	else {
		if (playersManager.lastSelected.group == "c1") {
			stateManager.changeState("c2PlayerSelect");
		} else {
			playersManager.lastSelected.selected = false;
			document.dispatchEvent(playersUpdateEv);
			await checkForTie();
			stateManager.changeState("finalResults");
		}
	}
	resetDices();
});

finishTurnBtn.addEventListener("click", async () => {
	finishTurnBtn.disabled = true;
	if (playersManager.lastSelected.group === "c1") stateManager.changeState("c2PlayerSelect");
	else {
		playersManager.lastSelected.selected = false;
		document.dispatchEvent(playersUpdateEv);
		await checkForTie();
		stateManager.changeState("finalResults");
	}
	resetDices();
});

cancelSelectionBtn.addEventListener("click", () => {
	playersManager.lastSelected.selected = false;
	document.dispatchEvent(playersUpdateEv);
	playersManager.playersInGame.pop();
	stateManager.changeState(`${playersManager.lastSelected.group}PlayerSelect`);
});
