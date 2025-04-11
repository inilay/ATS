#!/bin/sh
celery -A automatic_tournament_system worker -l info
celery -A automatic_tournament_system beat -l info
