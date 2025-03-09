import json
import os

import firebase_admin
from celery import shared_task
from django.db.models import Prefetch
from django.utils import timezone
from dotenv import load_dotenv
from firebase_admin import credentials, messaging

from automatic_tournament_system.celery import app
from profiles.models import Profile, PushToken
from tournaments.models import Tournament, TournamentNotification

load_dotenv()
CREDENTIALS = os.getenv("CREDENTIALS")

cred = credentials.Certificate(json.loads(CREDENTIALS))
firebase_admin.initialize_app(cred)


@shared_task(ignore_result=True)
def celery_send_push_notification(title: str, body: str, token: str):
    message = messaging.Message(
        notification=messaging.Notification(title=title, body=body, image="http://localhost:3000/logo192.png"),
        token=token,
    )
    try:
        messaging.send(message)
    except firebase_admin.exceptions.FirebaseError as e:
        if e.code == "NOT_FOUND":
            PushToken.objects.filter(token=token).delete()


@shared_task(ignore_result=True)
def celery_send_tournament_notificataion(tournamnt_id: int):
    tournament = Tournament.objects.prefetch_related(
        Prefetch("followers", queryset=Profile.objects.prefetch_related("push_tokens").all())
    ).get(id=tournamnt_id)

    title = f"{tournament.title}"
    body = f"{tournament.title} tournament has started!"

    for follower in tournament.followers.all():
        for token in follower.push_tokens.all():
            celery_send_push_notification.delay(title, body, token.token)


@app.on_after_finalize.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(28800.0, celery_add_tournaments_notification.s(), name="add every 8 hours")


@shared_task(ignore_result=True)
def celery_add_tournaments_notification():
    now = timezone.now()
    minimum_start_time = now + timezone.timedelta(hours=24)
    notifications = TournamentNotification.objects.select_related("tournament").filter(
        in_queue=False, tournament__start_time__lte=minimum_start_time
    )

    for notification in notifications:
        task = celery_send_tournament_notificataion.apply_async(
            args=(notification.tournament.id,), eta=notification.tournament.start_time
        )
        notification.task_id = task.id
        notification.in_queue = True

    TournamentNotification.objects.bulk_update(notifications, ["task_id", "in_queue"])
