#!/bin/bash

if [[ -e $HOME/Desktop ]]; then
	DESKTOP_DIR=$HOME/Desktop
else
	DESKTOP_DIR=$HOME/Escritorio
fi

if [[ -e $DESKTOP_DIR/sim-app.desktop ]]; then
	echo "You have already installed the application in your desktop directory"
	exit
fi

if [[ ! -e ~/.icons ]]; then
	echo "Creating ~/.icons folder..."
fi

echo "[Desktop Entry]" > $DESKTOP_DIR/sim-app.desktop
echo "Type=Application" >> $DESKTOP_DIR/sim-app.desktop
echo "Comment=Aplicación para resolver la depredación en la simulación del ecosistema" >> $DESKTOP_DIR/sim-app.desktop
echo "Terminal=false" >> $DESKTOP_DIR/sim-app.desktop
echo "Icon=$PWD/sprites/leafsprite.png" >> $DESKTOP_DIR/sim-app.desktop
echo "Exec=$PWD/start.sh" $PWD >> $DESKTOP_DIR/sim-app.desktop # Pass a reference to THIS directory to prevent the python server from opening in another dir

chmod 775 $DESKTOP_DIR/sim-app.desktop
