#!/bin/bash
PYTHON_EXEC=python3
REPO_PATH=$(find ~ -type d -name "ecosystem-proto*" 2>/dev/null | head -n 1)

python3 -V >/dev/null
if [[ ! $? -eq 0 ]]; then
	echo "python3 not found... Trying with 'python'"
	python -V >/dev/null
	if [[ ! $? -eq 0 ]]; then
		echo "python not found... You must have Python ver.3 installed on your system to execute this script"
		return 1
	else
		PYTHON_EXEC=python
	fi
fi

$PYTHON_EXEC -m http.server -d $REPO_PATH & >/dev/null
exo-open --launch WebBrowser localhost:8000
