import { playersManager } from "./playersManager.js";

const changeStateEv = new Event("change-state");
const uiElements = {
	startCycle: document.querySelector("button#start-cycle"),
	eraseC1: document.querySelector("button#erase-c1"),
	eraseC2: document.querySelector("button#erase-c2"),
	eraseAll: document.querySelector("button#erase-all"),
	addC1Player: document.querySelector("section#c1-list-mod-ctrls>button"),
	addC2Player: document.querySelector("section#c2-list-mod-ctrls>button"),
	finishRoll: document.querySelector("button#finish-roll"),
	speedAmp: document.querySelector("button#speed-amp"),
	coop: document.querySelector("button#coop"),
	speedNerf: document.querySelector("button#speed-nerf"),
	finishTurn: document.querySelector("button#finish-turn"),
	nextCycle: document.querySelector("button#next-cycle"),
	cancelSelection: document.querySelector("button#cancel-selection")
}

const stateElementDict = {
	"preCycle": {
		startCycle: uiElements.startCycle,
		eraseC1: uiElements.eraseC1,
		eraseC2: uiElements.eraseC2,
		eraseAll: uiElements.eraseAll,
		addC1Player: uiElements.addC1Player,
		addC2Player: uiElements.addC2Player
	},
	"c1PlayerSelect": {},
	"playerRoll": {
		finishRoll: uiElements.finishRoll,
		speedAmp: uiElements.speedAmp,
		coop: uiElements.coop,
		speedNerf: uiElements.speedNerf,
		finishTurn: uiElements.finishTurn,
		cancelSelection: uiElements.cancelSelection
	},
	"c2PlayerSelect": {},
	"finalResults": {
		nextCycle: uiElements.nextCycle
	},
	"tie-break": {}
};

document.addEventListener("change-state", () => {
	for (const el of Object.values(stateElementDict[stateManager.state])) {
		if (el === uiElements.finishRoll) continue;
		if (el === uiElements.finishTurn
			&& playersManager.playersInGame.filter(pl => pl.group === playersManager.lastSelected.group).length === 1) continue;
		el.disabled = false;
	}
	for (const group of Object.keys(stateElementDict).filter(st => st !== stateManager.state))
		for (const el of Object.values(stateElementDict[group])) {
			if (!el) continue;
			el.disabled = true;
		}
});

class StateManager {
	constructor() {
		this.state = null;
	}

	changeState(state) {
		if (!Object.keys(stateElementDict).some(st => st === state)) throw new Error(`Cannot change state machine state to ${state}`);
		this.state = state;
		document.dispatchEvent(changeStateEv);
	}
}

export const stateManager = new StateManager();
stateManager.changeState("preCycle");
