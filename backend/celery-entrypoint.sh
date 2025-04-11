#!/bin/sh
celery -A automatic_tournament_system worker -l info --concurrency 1 -E
celery -A automatic_tournament_system beat -l info