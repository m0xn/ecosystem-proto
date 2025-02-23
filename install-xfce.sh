#!/bin/bash

[ -e $HOME/Desktop ] && DESKTOP_DIR=$HOME/Desktop || DESKTOP_DIR=$HOME/Escritorio

if [[ -e $DESKTOP_DIR/sim-app.desktop ]]; then
	echo "Ya tienes la aplicación instalada en el escritorio"
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
echo "Exec=$PWD/start" $PWD >> $DESKTOP_DIR/sim-app.desktop # Pass a reference to THIS directory to prevent the python server from opening in another dir

chmod 775 $DESKTOP_DIR/sim-app.desktop
