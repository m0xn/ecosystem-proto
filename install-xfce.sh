#!/bin/bash

if [[ ! -e ~/.icons ]]; then
	echo "Creating ~/.icons folder..."
fi

echo "[Desktop Entry]" > ~/Desktop/sim-app.desktop
echo "Type=Application" >> ~/Desktop/sim-app.desktop
echo "Comment=Aplicación para resolver la depredación en la simulación del ecosistema" >> ~/Desktop/sim-app.desktop
echo "Terminal=false" >> ~/Desktop/sim-app.desktop
echo "Icon=$PWD/sprites/leafsprite.png" >> ~/Desktop/sim-app.desktop
echo "Exec=$PWD/start.sh $PWD" >> ~/Desktop/sim-app.desktop # Pass a reference to THIS directory to prevent the python server from opening in another dir
