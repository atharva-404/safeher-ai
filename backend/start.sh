#!/usr/bin/env bash
# Exit immediately if any command fails
set -e

echo "Running database migrations..."
python manage.py migrate

echo "Starting Gunicorn server..."
gunicorn safeher_ai.wsgi:application --bind 0.0.0.0:$PORT
