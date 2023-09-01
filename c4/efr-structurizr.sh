#!/bin/bash

# A script munkakönyvtárának meghatározása
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# A szolgáltatás portjának meghatározása
PORT=${1:-8080}

echo "Az Structurizr Lite elindult a ${SCRIPT_DIR} könyvtárban."
echo "A modell megtekintéséhez nyisd meg a http://localhost:${PORT} címet a böngésződben!"

docker run -it --rm -p ${PORT}:8080 -v ${SCRIPT_DIR}:/usr/local/structurizr structurizr/lite

echo "Structurizr Lite befejeződött."
