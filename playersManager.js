import { stateManager } from "./stateManager.js";

const playersUpdateEv = new Event("players-update");

const uiElements = {
	"c1": {
		listItems: document.querySelector("ul#c1-list-items"),
		nameField: document.querySelector("section#c1-list-mod-ctrls>input"),
		addPlayerBtn: document.querySelector("section#c1-list-mod-ctrls>button")
	},
	"c2": {
		listItems: document.querySelector("ul#c2-list-items"),
		nameField: document.querySelector("section#c2-list-mod-ctrls>input"),
		addPlayerBtn: document.querySelector("section#c2-list-mod-ctrls>button")
	}
}

const removeC1PlayersBtn = document.querySelector("button#erase-c1");
const removeC2PlayersBtn = document.querySelector("button#erase-c2");
const removeAllPlayersBtn = document.querySelector("button#erase-all");

function handleUIPlayerAdd(group) {
	const nameField = uiElements[group].nameField;
	if (!nameField.value) {
		window.alert("No has introducido ningún nombre");
		return;
	}

	playersManager.addPlayer(nameField.value, group);
	nameField.value = "";
}

function handleGroupRemoval(group, msg) {
	if (!window.confirm(msg)) return;
	if (group == "all") {
		playersManager.players = [];
		window.localStorage.removeItem("players");
		while (uiElements.c1.listItems.childNodes.length > 0) uiElements.c1.listItems.removeChild(uiElements.c1.listItems.firstChild);
		while (uiElements.c2.listItems.childNodes.length > 0) uiElements.c2.listItems.removeChild(uiElements.c2.listItems.firstChild);
		return;
	}

	playersManager.players = playersManager.players.filter(pl => pl.group !== group);
	window.localStorage.setItem("players", JSON.stringify(playersManager.players));
	while (uiElements[group].listItems.childNodes.length > 0) uiElements[group].listItems.removeChild(uiElements[group].listItems.firstChild);
}

const nameToId = name => name.toLowerCase().replaceAll(" ", "-");

class Player {
	constructor(name, group) {
		this.name = name;
		this.group = group;
		this.selected = false;
		this.speed = 0;
		this.speedBonus = 0;
		this.cooperation = false;
	}
}

class PlayersManager {
	constructor() {
		this.players = JSON.parse(window.localStorage.getItem("players")) || [];
		this.lastSelected = null;
		this.lastRemoved = null;
		this.lastCreated = null;
	}

	addPlayer(name, group) {
		if (this.players.some(pl => pl.name === name)) {
			window.alert("No puedes añadir un nombre que ya está en la lista");
			return;
		}

		const player = new Player(name, group);
		this.lastCreated = player;
		this.players.push(player);
		window.localStorage.setItem("players", JSON.stringify(this.players));

		document.dispatchEvent(playersUpdateEv);
	}

	createPlayerEntry(player) {
		const entry = document.createElement("li");
		entry.className = "list-entry";
		entry.innerHTML = player.name;
		entry.id = nameToId(player.name);

		const speedText = document.createElement("p");
		speedText.innerHTML = player.speed;
		entry.appendChild(speedText);

		entry.addEventListener("click", () => { this.handlePlayerSelection(player); });
		entry.addEventListener("contextmenu", e => {
			e.preventDefault();
			this.handlePlayerDestruction(player);
		});
		return entry;
	}

	handlePlayerSelection(player) {
		if (stateManager.state !== "playerSelect") return;
		const prevSelected = this.players.find(pl => pl.selected);
		if (prevSelected && prevSelected !== player) {
			prevSelected.selected = false;
			document.querySelector(`li#${nameToId(prevSelected.name)}`).style = "";
		}

		player.selected = !player.selected;
		this.lastSelected = player;
		document.dispatchEvent(playersUpdateEv);
	}

	handlePlayerDestruction(player) {
		if (stateManager.state !== "preCycle") return;
		if (!window.confirm("¿Estás seguro de que quieres borrar a este jugador?")) return;
		this.players = this.players.filter(pl => pl !== player);
		this.lastRemoved = player;
		window.localStorage.setItem("players", JSON.stringify(this.players));
		document.dispatchEvent(playersUpdateEv);
	}

	setupPlayers() {
		this.players.forEach(pl => { pl.selected = false; });
		for (const player of this.players)
			uiElements[player.group].listItems.appendChild(this.createPlayerEntry(player));
	}
}

export const playersManager = new PlayersManager();
playersManager.setupPlayers();

document.addEventListener("players-update", () => {
	if (playersManager.lastCreated) {
		const player = playersManager.lastCreated;
		const playerEntry = playersManager.createPlayerEntry(playersManager.lastCreated);

		uiElements[player.group].listItems.appendChild(playerEntry);
		playersManager.lastCreated = null;
	}

	if (playersManager.lastSelected) {
		const bgColor = playersManager.lastSelected.selected
			? getComputedStyle(document.body).getPropertyValue(`--${playersManager.lastSelected.group}-player-panel-entry-selected`)
			: "";

		const playerEntry = document.querySelector(`li#${nameToId(playersManager.lastSelected.name)}`);
		playerEntry.style.background = bgColor;
	}

	if (playersManager.lastRemoved) {
		document.querySelector(`li#${nameToId(playersManager.lastRemoved.name)}`).remove();
		playersManager.lastRemoved = null;
	}
});

uiElements.c1.addPlayerBtn.addEventListener("click", () => { handleUIPlayerAdd("c1"); });
uiElements.c2.addPlayerBtn.addEventListener("click", () => { handleUIPlayerAdd("c2"); });

window.addEventListener("keydown", e => {
	if (e.key !== "Enter" || stateManager.state !== "preCycle") return;
	if (document.activeElement == uiElements.c1.nameField) handleUIPlayerAdd("c1");
	if (document.activeElement == uiElements.c2.nameField) handleUIPlayerAdd("c2");
});

removeC1PlayersBtn.addEventListener("click", () => { handleGroupRemoval("c1", "¿Estás seguro de que quieres eliminar a los jugadores de C1?"); });
removeC2PlayersBtn.addEventListener("click", () => { handleGroupRemoval("c2", "¿Estás seguro de que quieres eliminar a los jugadores de C2?"); });
removeAllPlayersBtn.addEventListener("click", () => { handleGroupRemoval("all", "¿Estás seguro de que quieres elminar a todos los jugdadores?"); });
