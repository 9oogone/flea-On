#!/bin/bash
pushd ../
docker build -f docker/Dockerfile -t "qsc753969/fleaon_front:latest" .
