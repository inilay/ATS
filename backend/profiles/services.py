import json
import os

import firebase_admin
from django.shortcuts import get_object_or_404
from dotenv import load_dotenv
from firebase_admin import credentials, messaging
from rest_framework.exceptions import ValidationError as RestValidationError

from profiles.models import CustomUser, PushToken
from tournaments.models import Tournament

load_dotenv()

CREDENTIALS = os.getenv("CREDENTIALS")


def create_subscription(validated_data: dict, user: CustomUser) -> None:
    tournament = get_object_or_404(Tournament, id=validated_data.get("tournament_id"))
    user.profile.subscriptions.add(tournament)

    return None


def create_push_token(validated_data: dict, user: CustomUser) -> PushToken:
    push_token = PushToken.objects.create(token=validated_data.get("token"), profile=user.profile)

    return push_token


def delete_subscription(validated_data: dict, user: CustomUser) -> None:
    tournament = get_object_or_404(Tournament, id=validated_data.get("tournament_id"))
    user.profile.subscriptions.remove(tournament)

    return None


def create_user(validated_data: dict):
    if CustomUser.objects.filter(username=validated_data.get("username")).exists():
        raise RestValidationError(detail={"error": "User with the same name already exists"})
    elif CustomUser.objects.filter(email=validated_data.get("email")).exists():
        raise RestValidationError(detail={"error": "User with the same email already exists"})
    print("after exception check")
    user = CustomUser.objects.create(username=validated_data["username"], email=validated_data["email"])

    user.set_password(validated_data["password"])
    user.save()
    # send_email_for_verify(user)

    return user


cred = credentials.Certificate(json.loads(CREDENTIALS))
firebase_admin.initialize_app(cred)


def send_push_notification():
    message = messaging.Message(
        notification=messaging.Notification(title="Test title", body="Some info"),
        token="eNALodY3FtcwPelPfGcEag:APA91bFh5xDEn03b9M0buZY8Jus2mAiwdWJtrkJBCW_--e1oe9ACQvmI-Xg93NlWexfW64wrJqQNumS61ZR-4FF6W0W0LXyyaE3g5Go-86XN-MICzDKi4kI",
    )
    result = messaging.send(message)
    print("result", result)
