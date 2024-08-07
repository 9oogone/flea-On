#!/bin/bash
pushd ../
docker build -f Dockerfile -t "qsc753969/fleaon_front:latest" .
