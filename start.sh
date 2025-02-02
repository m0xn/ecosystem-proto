#!/bin/bash
source ./venv/bin/activate
python -m http.server 8000 >/dev/null &
exo-open --launch WebBrowser localhost:8000
