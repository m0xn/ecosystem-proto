class Dice {
	constructor(viewport, id) {
		this.value = 0;
		this.rolled = false;
		this.rolling = false;
		this.vp = viewport;
		this.id = id;
	}

	reset() { this.rolled = false }
}

class Player {
	constructor(name, biomass, childs) {
		this.name = name;
		this.biomass = biomass;
		this.childs = childs;
	}
}

const playerList = [];
for (let i = 0; i < 20; i++) {
	playerList.push(new Player(`user${i + 1}`, 15, 0));
}

const leftDice = new Dice(document.querySelector("img#left-dice-viewport"), "left");
const rightDice = new Dice(document.querySelector("img#right-dice-viewport"), "right");
const turnStateListener = document.querySelector("div#turn-state-listener");

const turnStateView = document.querySelector("p#turn-state-view");
const leftDiceResultView = document.querySelector("p#left-dice-result");
const rightDiceResultView = document.querySelector("p#right-dice-result");
const totalDiceResultView = document.querySelector("p#total-dice-result");

const resultsList = document.querySelector("section#results-list>ul");
const nextTurnButton = document.querySelector("button#next-turn");

const finishTurn = new Event("finishTurn");
let turnNumber = 0;
let turnFinished = true;

function startTurn() {
	turnStateView.innerHTML = "Waiting for dices to be rolled...";
	leftDice.vp.addEventListener("click", () => { rollDice(leftDice); });
	rightDice.vp.addEventListener("click", () => { rollDice(rightDice); });
	return new Promise((resolve, _) => {
		turnStateListener.addEventListener("finishTurn", () => {
			turnStateView.innerHTML = "Dices have been rolled!";
			leftDiceResultView.innerHTML = `Left dice:\t${leftDice.value}`;
			rightDiceResultView.innerHTML = `Right dice:\t${rightDice.value}`;
			totalDiceResultView.innerHTML = `Total value:\t${leftDice.value + rightDice.value}`;
			turnFinished = true;
			resolve(leftDice.value + rightDice.value);
		});
	})
}

nextTurnButton.addEventListener("click", async () => {
	if (!turnFinished) return;
	leftDice.reset();
	rightDice.reset();
	const result = await startTurn();
	const element = document.createElement("li");
	element.innerHTML = `Turn ${turnNumber}: ${result}`;
	resultsList.appendChild(element);
	turnNumber++;
});

function rollDice(dice, interval = 100) {
	if (dice.rolling || dice.rolled) return;

	const iters = Math.round(Math.random() * (50 - 20) + 20);
	let completedIntervals = 0;
	dice.rolling = true;

	const rollingAnimId = setInterval(() => {
		const rolledNumber = Math.floor(Math.random() * 6 + 1);
		if (completedIntervals == iters - 1) {
			dice.rolling = false;
			dice.value = rolledNumber;
			dice.rolled = true;
			if (dice.id == "left" && rightDice.rolled) turnStateListener.dispatchEvent(finishTurn);
			if (dice.id == "right" && leftDice.rolled) turnStateListener.dispatchEvent(finishTurn);
			clearInterval(rollingAnimId);
		}
		dice.vp.src = `dice${rolledNumber}.png`;
		completedIntervals++;
	}, interval);
}
