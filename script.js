function createPlayer(name) {
	const entry = document.createElement("li");
	entry.className = "list-entry";
	entry.innerHTML = name;

	const speedPar = document.createElement("p");
	speedPar.innerHTML = "0";

	entry.appendChild(speedPar);
	return entry;
}

function handleNewEntry(itemsList, playersList, inputField) {
	if (inputField.value == "") {
		window.alert("No has introducido ningún nombre dentro de la casilla");
		return;
	}
	itemsList.appendChild(createPlayer(inputField.value));
	playersList.push(inputField.value);
	localStorage.setItem(itemsList.id, JSON.stringify(playersList));
	inputField.value = "";
}

function resetPlayers(itemsList, playerList, LSKey) {
	while (itemsList.childNodes.length > 0) itemsList.removeChild(itemsList.firstChild);
	while (playerList.length > 0) playerList.pop();
	window.localStorage.removeItem(LSKey);
}

const c1List = document.querySelector("ul#c1-list-items");
const c1PlayerList = JSON.parse(localStorage.getItem(c1List.id)) || [];
const c1AddPlayerBtn = document.querySelector("section#c1-list-mod-ctrls>button");
const c1NamePlayerField = document.querySelector("section#c1-list-mod-ctrls>input");

const c2List = document.querySelector("ul#c2-list-items");
const c2PlayerList = JSON.parse(localStorage.getItem(c2List.id)) || [];
const c2AddPlayerBtn = document.querySelector("section#c2-list-mod-ctrls>button");
const c2NamePlayerField = document.querySelector("section#c2-list-mod-ctrls>input");

const eraseC1ListBtn = document.querySelector("button#erase-c1");
const eraseC2ListBtn = document.querySelector("button#erase-c2");
const eraseAllBtn = document.querySelector("button#erase-all");

for (const player of c1PlayerList) c1List.appendChild(createPlayer(player));
for (const player of c2PlayerList) c2List.appendChild(createPlayer(player));

window.addEventListener("keydown", e => {
	if (e.key !== "Enter") return;
	if (document.activeElement === c1NamePlayerField) handleNewEntry(c1List, c1PlayerList, c1NamePlayerField);
	if (document.activeElement === c2NamePlayerField) handleNewEntry(c2List, c2PlayerList, c2NamePlayerField);
});

c1AddPlayerBtn.addEventListener("click", () => { handleNewEntry(c1List, c1PlayerList, c1NamePlayerField); })
c2AddPlayerBtn.addEventListener("click", () => { handleNewEntry(c2List, c2PlayerList, c2NamePlayerField); })

eraseC1ListBtn.addEventListener("click", () => {
	if (!window.confirm("¿Seguro que quieres borrar los jugadores de C1?")) return;
	localStorage.removeItem("c1-player-list");
	resetPlayers(c1List, c1PlayerList, c1List.id);
});

eraseC2ListBtn.addEventListener("click", () => {
	if (!window.confirm("¿Seguro que quieres borrar los jugadores de C2?")) return;
	localStorage.removeItem("c2-player-list");
	resetPlayers(c2List, c2PlayerList, c2List.id);
});

eraseAllBtn.addEventListener("click", () => {
	if (!window.confirm("¿Seguro que quieres borrar todos los jugadores?")) return;
	localStorage.removeItem("c1-player-list");
	resetPlayers(c1List, c1PlayerList, c1List.id);
	localStorage.removeItem("c2-player-list");
	resetPlayers(c2List, c2PlayerList, c2List.id);
});
