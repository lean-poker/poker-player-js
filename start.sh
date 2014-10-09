#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR
if which nodejs &>/dev/null; then
    nodejs player_service.js &
else
    node player_service.js &
fi

echo $! > express.pid
