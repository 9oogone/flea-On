#!/bin/bash
pushd ../
docker build -f docker/Dockerfile -t "qsc753969/fleaonFront:latest" .
