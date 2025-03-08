import json
import os

import firebase_admin
from celery import shared_task
from django.db.models import Prefetch
from dotenv import load_dotenv
from firebase_admin import credentials, messaging

from profiles.models import Profile
from tournaments.models import Tournament

load_dotenv()
CREDENTIALS = os.getenv("CREDENTIALS")

cred = credentials.Certificate(json.loads(CREDENTIALS))
firebase_admin.initialize_app(cred)


@shared_task(ignore_result=True)
def celery_send_push_notification(title: str, body: str, token: str):
    message = messaging.Message(notification=messaging.Notification(title=title, body=body), token=token)
    result = messaging.send(message)
    print("result", result)


@shared_task(ignore_result=True)
def celery_send_tournament_notificataion(tournamnt_id: int):
    tournament = Tournament.objects.prefetch_related(
        Prefetch("followers", queryset=Profile.objects.prefetch_related("push_tokens").all())
    ).filter(id=tournamnt_id)

    title = f"{tournament.title}"
    body = f"{tournament.title} tournament has started!"

    for follower in tournament.followers.all():
        for token in follower.push_tokens.all():
            celery_send_push_notification.delay(title, body, token.token)
