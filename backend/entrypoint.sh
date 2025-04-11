#!/bin/sh
python3 manage.py collectstatic --no-input


python3 manage.py makemigrations
python3 manage.py migrate

python3 manage.py loaddata static_table.json

# Start server

# python3 manage.py runserver 0.0.0.0:49088
gunicorn automatic_tournament_system.wsgi:application --bind 0.0.0.0:8000


celery -A automatic_tournament_system worker -l info
celery -A automatic_tournament_system beat -l info
