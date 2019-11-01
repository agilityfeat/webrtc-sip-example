#!/bin/bash
sudo apt update && sudo apt -y upgrade
sudo apt install -y python python-pip
sudo pip install boto3