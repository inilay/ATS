from django.db.models.query import QuerySet
from django.shortcuts import get_object_or_404
from django.http import Http404
from .models import Tournament, Bracket
from .filters import TournamentFilter


def get_brackets_for_tournamnet(tournament:Tournament, **kwargs) -> QuerySet[Bracket]:
    return tournament.brackets.all()

def tournaments_list(*, filters=None) -> QuerySet[Tournament]:
    filter = filters or {}
    query_set = Tournament.objects.select_related('owner').all()
    return TournamentFilter(filter, query_set).qs

def game_list(*, filters=None) -> list:
    game_list = Tournament.objects.distinct().values_list('game', flat=True)
    print(game_list)
    return game_list