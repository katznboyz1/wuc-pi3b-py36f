#!/bin/bash
cd /home/pi/wuc-pi3b-py36f
sudo gunicorn3 --workers 2 --threads 2 --bind 0.0.0.0:80 wsgi:app