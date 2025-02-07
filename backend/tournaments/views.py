from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from django.shortcuts import get_object_or_404

from .models import Tournament, Bracket
from .utils import inline_serializer, get_object
from .serializer import TournamentSerializer, BracketSerializer, AllBracketSerealizer, GetAllBracketsSerializer
from .selectors import tournaments_list, get_brackets_for_tournamnet, game_list
from .services.generation_services import create_tournament, create_bracket
from .services.update_services import create_moderator, delete_moderator, update_bracket, update_tournament
from .permissions import IsTournamenOwnerOrReadOnly, IsBracketOwnerOrReadOnly, AuthMixin
from .pagination import get_paginated_response, LimitOffsetPagination


class TournamentsAPIList(APIView):
    class Pagination(LimitOffsetPagination):
        default_limit = 12
        default_offset = 0
        
    class FilterSerializer(serializers.Serializer):
        title = serializers.CharField(required=False)
        game = serializers.CharField(required=False)

    class OutputSerializer(serializers.ModelSerializer):
        class Meta:
            model = Tournament
            fields = "__all__"
    
    def get(self, request):

        # Make sure the filters are valid, if passed
        filters_serializer = self.FilterSerializer(data=request.query_params)
        filters_serializer.is_valid(raise_exception=True)
        tournaments = tournaments_list(filters=filters_serializer.validated_data)

        return get_paginated_response(
            pagination_class=self.Pagination,
            serializer_class=self.OutputSerializer,
            queryset=tournaments,
            request=request,
            view=self
        )

class GamesApiView(APIView):
    
    def get(self, requet):
        games = game_list()
        return Response(games)

class TournamentAPIView(APIView): 
  
    class OutputSerializer(serializers.ModelSerializer):
        owner = serializers.StringRelatedField(required=False)
        start_time = serializers.DateTimeField(format='%Y-%m-%dT%H:%M')
        moderators = serializers.StringRelatedField(many=True)

        class Meta:
            model = Tournament
            fields = "__all__"  
        
    def get(self, request, link):
        tournament = get_object(Tournament, link=link)
        serializer = self.OutputSerializer(tournament, context={'request': request})
        return Response(serializer.data)

class TournamentCreateView(APIView):
    permission_classes = (IsAuthenticated, )

    class InputSerializer(serializers.Serializer):
        # tournament
        title = serializers.CharField()
        content = serializers.CharField(default=None)
        participants = serializers.CharField()
        poster = serializers.ImageField(use_url=True, default=None)
        game = serializers.CharField()
        start_time = serializers.DateTimeField()
        private = serializers.BooleanField()
        # bracket 
        advances_to_next = serializers.IntegerField()
        participant_in_match = serializers.IntegerField()
        bracket_type = serializers.IntegerField()
        points_victory = serializers.IntegerField(required=False)
        points_loss = serializers.IntegerField(required=False)
        points_draw = serializers.IntegerField(required=False)
        number_of_rounds = serializers.IntegerField(default=None)
        # group bracket
        tournament_type = serializers.IntegerField(required=False)
        group_type = serializers.IntegerField(required=False)
        participant_in_group = serializers.IntegerField(required=False)
        advance_from_group = serializers.IntegerField(required=False)

    @transaction.atomic
    def post(self, request):
        serializer = self.InputSerializer(data=request.data)

        print('raw data', request.data)
        if not serializer.is_valid():
            print(serializer.errors)
        
        print('serializer.validated_data', serializer.validated_data)
        
        tournament = create_tournament(**serializer.validated_data, user=request.user,)

        return Response(status=status.HTTP_201_CREATED)

class TournamentDeleteAPIView(APIView):
    permission_classes = ((IsTournamenOwnerOrReadOnly|IsAdminUser),)

    @transaction.atomic
    def delete(self, request, link, *args, **kwargs):
        tournament = get_object(Tournament, link=link)
        self.check_object_permissions(request, tournament)
        tournament.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)

class TournamentUpdateApiView(APIView):
    permission_classes = ((IsTournamenOwnerOrReadOnly|IsAdminUser),)

    class InputSerializer(serializers.Serializer):
        title = serializers.CharField()
        content = serializers.CharField()
        poster = serializers.ImageField(use_url=True, default=None)
        game = serializers.CharField()
        start_time = serializers.DateTimeField()
        creater_email = serializers.EmailField()

    @transaction.atomic
    def patch(self, request, link):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        tournament = get_object(Tournament, link=link)
        self.check_object_permissions(request, tournament)
        tournament = update_tournament(tournament=tournament, data=serializer.validated_data)

        return Response(data={'link': tournament.link}, status=status.HTTP_200_OK)

class BracketAPIView(APIView):
    class OutputSerializer(serializers.ModelSerializer):
        class Meta:
            model = Bracket
            fields = "__all__"

    def get(self, request, id):
        bracket = get_object(Bracket, id=id)
        serializer = self.OutputSerializer(bracket)
        print('bracket')
        return Response(serializer.data)

class BracketCreateView(APIView):

    class InputSerializer(serializers.Serializer):
        type = serializers.ChoiceField(choices=['SE', 'DE', 'RR', 'SW'])
        participants = serializers.CharField()
        secod_final = serializers.BooleanField(required=False)
        points_victory = serializers.IntegerField(required=False)
        points_loss = serializers.IntegerField(required=False)
        points_draw = serializers.IntegerField(required=False)

    @transaction.atomic
    def post(self, request):
        input_serializer = self.InputSerializer(data=request.data)
        input_serializer.is_valid(raise_exception=True)
        bracket = create_bracket(**input_serializer.validated_data)

        return Response(data={'id': bracket.id}, status=status.HTTP_201_CREATED)

class BracketUpdateAPIView(APIView):
    permission_classes = []

    class InputSerializer(serializers.Serializer):
        bracket_id = serializers.IntegerField()
        match_id = serializers.IntegerField()
        start_time = serializers.DateTimeField(required=False)
        state = serializers.CharField(required=False)

        match_results = serializers.DictField(child=inline_serializer(fields={
            'participant': serializers.CharField(),
            'score': serializers.IntegerField(),
        }))
        # match_results = inline_serializer(many=True, fields={
        #     'id' : serializers.IntegerField(),
        #     'participant': serializers.CharField(),
        #     'score': serializers.IntegerField(),
        # })

    @transaction.atomic
    def put(self, request):
        serializer = self.InputSerializer(data=request.data)

        print('data', request.data)
        if not serializer.is_valid():
            print(serializer.errors)
        print('serializer.validated_data', serializer.validated_data)
        # bracket = get_object(Bracket, id=id)
        # self.check_object_permissions(request, bracket)
        bracket = update_bracket(data=serializer.validated_data)
        print('bracket', bracket)
        serializer = GetAllBracketsSerializer(bracket)

        return Response(status=status.HTTP_200_OK, data=serializer.data)

class AllBracketAPIView(APIView): 

    def get(self, request, tournament_id):
        print("work")
        brackets = get_brackets_for_tournamnet(tournament_id=tournament_id)
        print('brackets', brackets)
        serializer = GetAllBracketsSerializer(brackets, many=True)

        return Response(status=status.HTTP_200_OK, data=serializer.data)
    
class CreateModeratorAPIView(APIView):

    class InputSerializer(serializers.Serializer):
        tournament_id = serializers.IntegerField()
        username = serializers.CharField()

    # class OutputSerializer(serializers.Serializer):
    #     user

    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(status=status.HTTP_400_BAD_REQUEST)
        moderator = create_moderator(serializer.validated_data)
        return Response(status=status.HTTP_201_CREATED)

class DeleteModeratorAPIView(APIView):
    class InputSerializer(serializers.Serializer):
        tournament_id = serializers.IntegerField()
        username = serializers.CharField()

    def delete(self, request):
        serializer = self.InputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(status=status.HTTP_400_BAD_REQUEST)
        delete_moderator(serializer.validated_data)
        return Response(status=status.HTTP_200_OK)
