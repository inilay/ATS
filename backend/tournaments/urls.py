from django.urls import path
from .views import TournamentUpdateApiView, TournamentsAPIList, TournamentAPIView, TournamentCreateView, BracketAPIView, BracketCreateView, AllBracketAPIView, TournamentDeleteAPIView, BracketUpdateAPIView, GamesApiView


urlpatterns = [
    path('api/v1/tournament/<str:link>/', TournamentAPIView.as_view()),
    path('api/v1/edit_tournament/<str:link>/', TournamentUpdateApiView.as_view()),
    path('api/v1/delete_tournament/<str:link>/', TournamentDeleteAPIView.as_view()),
    path('api/v1/tournaments/', TournamentsAPIList.as_view()),
    path('api/v1/games/', GamesApiView.as_view()),
    path('api/v1/create_tournament/', TournamentCreateView.as_view()),
    path('api/v1/bracket/<int:id>/', BracketAPIView.as_view()),
    path('api/v1/create_bracket/', BracketCreateView.as_view()),
    path('api/v1/tournament_brackets/<int:tournament_id>/', AllBracketAPIView.as_view(), name='tournament_brackets'),
    path('api/v1/update_bracket/', BracketUpdateAPIView.as_view())
]