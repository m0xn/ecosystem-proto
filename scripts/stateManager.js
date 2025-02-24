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
	mimesis: document.querySelector("button#mimesis"),
	finishTurn: document.querySelector("button#finish-turn"),
	nextCycle: document.querySelector("button#next-cycle"),
	cancelSelection: document.querySelector("button#cancel-selection"),
	exoticBtn: document.querySelector("button#exotic-specie"),
	freeRollBtn: document.querySelector("button#free-roll")
}

const stateElementDict = {
	"preCycle": {
		startCycle: uiElements.startCycle,
		eraseC1: uiElements.eraseC1,
		eraseC2: uiElements.eraseC2,
		eraseAll: uiElements.eraseAll,
		addC1Player: uiElements.addC1Player,
		addC2Player: uiElements.addC2Player,
	},
	"c1PlayerSelect": {},
	"c2PlayerSelect": {},
	"playerRoll": {
		finishRoll: uiElements.finishRoll,
		speedAmp: uiElements.speedAmp,
		coop: uiElements.coop,
		speedNerf: uiElements.speedNerf,
		mimesis: uiElements.mimesis,
		cancelSelection: uiElements.cancelSelection,
		exoticBtn: uiElements.exoticBtn
	},
	"finalResults": {
		nextCycle: uiElements.nextCycle
	},
	"tie-break": {},
	"freeRoll": {},
	"debug": {}
};

document.addEventListener("change-state", () => {
	for (const el of Object.values(stateElementDict[stateManager.state])) {
		if (el === uiElements.finishRoll) continue;
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
		this.savedState = null;
		this.savedStateInfo = {
			turnBtnDisabled: false,
			prevSelectedPlayer: null
		};
		this.selectedInDebug = false;
	}

	changeState(state) {
		if (!Object.keys(stateElementDict).some(st => st === state)) throw new Error(`Cannot change state machine state to ${state}`);
		this.state = state;
		document.dispatchEvent(changeStateEv);
	}

	saveState() {
		this.savedState = this.state;
		this.savedStateInfo.turnBtnDisabled = uiElements.finishTurn.disabled
		this.savedStateInfo.prevSelectedPlayer = playersManager.lastSelected;
	}
}

export const stateManager = new StateManager();
stateManager.changeState("preCycle");
