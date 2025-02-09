from django.shortcuts import get_object_or_404
from profiles.models import CustomUser, Profile
from tournaments.models import Tournament


def create_subscription(validated_data: dict, user: CustomUser) -> None:
    tournament = get_object_or_404(Tournament, id=validated_data.get("tournament_id"))
    user.profile.subscriptions.add(tournament)

    return None

def delete_subscription(validated_data: dict, user: CustomUser) -> None:
    tournament = get_object_or_404(Tournament, id=validated_data.get("tournament_id"))
    user.profile.subscriptions.remove(tournament)

    return None