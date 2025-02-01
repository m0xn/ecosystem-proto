const changeStateEv = new Event("change-state");
const stateElementDict = {
	"preCycle": {
		startCycle: document.querySelector("button#start-cycle"),
		eraseC1: document.querySelector("button#erase-c1"),
		eraseC2: document.querySelector("button#erase-c2"),
		eraseAll: document.querySelector("button#erase-all"),
		addC1Player: document.querySelector("section#c1-list-mod-ctrls>button"),
		addC2Player: document.querySelector("section#c2-list-mod-ctrls>button")
	},
	"playerSelect": {},
	"playerRoll": {
		finishRoll: document.querySelector("button#finish-roll"),
		speedAmp: document.querySelector("button#speed-amp"),
		coop: document.querySelector("button#coop"),
		speedNerf: document.querySelector("button#speed-nerf"),
		finishTurn: document.querySelector("button#finish-turn")
	}
}

document.addEventListener("change-state", () => {
	for (const el of Object.values(stateElementDict[stateManager.state]))
		el.disabled = false;
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
