from django.db.models.query import QuerySet
from django.shortcuts import get_object_or_404
from django.db.models import Prefetch
from django.http import Http404
from .models import Tournament, Bracket, Round, Match, MatchParticipantInfo
from .filters import TournamentFilter


def get_brackets_for_tournamnet(tournament_id:int, **kwargs) -> QuerySet[Bracket]:
    brackets = Bracket.objects.prefetch_related(
            Prefetch('rounds', queryset=Round.objects.prefetch_related(
                Prefetch('matches', queryset=Match.objects.prefetch_related(
                    Prefetch('info', queryset=MatchParticipantInfo.objects.only('participant_scoore', 'participant'))
                ).all())
            ).all().order_by('serial_number'))
        ).filter(tournament_id=tournament_id)
        
    return brackets

def tournaments_list(*, filters=None) -> QuerySet[Tournament]:
    filter = filters or {}
    query_set = Tournament.objects.select_related('owner').all()
    return TournamentFilter(filter, query_set).qs

def game_list(*, filters=None) -> list:
    game_list = Tournament.objects.distinct().values_list('game', flat=True)
    print(game_list)
    return game_list