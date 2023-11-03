#!/bin/zsh
rm -rf ./mesh-artifact
rm ./*.txt
aio api-mesh:run ./meshConfig.json --debug
rm -rf ./mesh-artifact
rm ./*.txt

