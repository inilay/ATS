from .brackets import RoundRobin, SingleEl, DoubleEl, Swiss, MultiStage
from .models import Bracket, Tournament, Round, Match, MatchParticipantInfo
from .utils import clear_participants 
from typing import Any, Dict, List, Tuple
from profiles.models import Profile, CustomUser
from django.db import models
from django.utils.text import slugify
import math


def model_update(*, instance, fields: List[str], data: Dict[str, Any], auto_updated_at=True) -> Tuple:

    has_updated = False
    m2m_data = {}
    update_fields = []

    model_fields = {field.name: field for field in instance._meta.get_fields()}

    for field in fields:
        # Skip if a field is not present in the actual data
        if field not in data:
            continue

        # If field is not an actual model field, raise an error
        model_field = model_fields.get(field)

        assert model_field is not None, f"{field} is not part of {instance.__class__.__name__} fields."

        # If we have m2m field, handle differently
        if isinstance(model_field, models.ManyToManyField):
            m2m_data[field] = data[field]
            continue

        if getattr(instance, field) != data[field]:
            has_updated = True
            update_fields.append(field)
            setattr(instance, field, data[field])

    # Perform an update only if any of the fields were actually changed
    if has_updated:
        if auto_updated_at:
            # We want to take care of the `updated_at` field,
            # Only if the models has that field
            # And if no value for updated_at has been provided
            if "updated_at" in model_fields and "updated_at" not in update_fields:
                update_fields.append("updated_at")
                instance.updated_at = timezone.now()  # type: ignore

        instance.full_clean()
        instance.save(update_fields=update_fields)

    for field_name, value in m2m_data.items():
        related_manager = getattr(instance, field_name)
        related_manager.set(value)

        has_updated = True

    return instance, has_updated


def create_se_bracket(bracket: Bracket, participants: list):
    # log(player_in_match)total_players -  total number of rounds in the tournament 

    number_of_rounds = math.ceil(math.log(len(participants), bracket.participant_in_match))
    number_of_match_in_round = bracket.participant_in_match**(number_of_rounds-1)

    number_of_match_in_round = 1

    print('participants', participants)
    print('number_of_rounds', number_of_rounds)
    print('number_of_match_in_round', number_of_match_in_round)

    rounds = []
    unsaved_matches = []
    saved_matches = []
    matches_info = []

    # Создаем раунды
    for number in range(number_of_rounds, 0, -1):
        rounds.append(Round(bracket=bracket, serial_number=number))
    Round.objects.bulk_create(rounds)

    # Заполняем раунды матчами с последнего по первый
    for r in range(number_of_rounds-1, -1, -1):
        print('r', r)
        for m in range(number_of_match_in_round):
            # Для последнего раунда
            if r == number_of_rounds-1:
                unsaved_matches.append(Match(round=rounds[r], child=None, result_id=1))
                for p in range(bracket.participant_in_match):
                    matches_info.append(MatchParticipantInfo(
                        match=unsaved_matches[m],
                        participant_scoore=0,
                        participant=''
                    ))
            # Для первого
            elif r == 0:
                # Позиция child в массиве saved_matches, созданном на предыдущей итерации,
                # высчитывается как целая часть от деления номера матча в раунде на количество участников в матче
                unsaved_matches.append(Match(round=rounds[r], child=saved_matches[m//bracket.participant_in_match], result_id=1))
                for _ in range(bracket.participant_in_match):
                    matches_info.append(MatchParticipantInfo(
                        match=unsaved_matches[m],
                        participant_scoore=0,
                        participant=participants[m+p]
                    ))
            # Для остальных
            else:
                unsaved_matches.append(Match(round=rounds[r], child=saved_matches[m//bracket.participant_in_match], result_id=1))
                for _ in range(bracket.participant_in_match):
                    matches_info.append(MatchParticipantInfo(
                        match=unsaved_matches[m],
                        participant_scoore=0,
                        participant=''
                    ))
        # Увеличиваем количество матчей раунде
        number_of_match_in_round = number_of_match_in_round * bracket.participant_in_match
        # Сохраняем матчи
        saved_matches = Match.objects.bulk_create(unsaved_matches)
        unsaved_matches = []

    MatchParticipantInfo.objects.bulk_create(matches_info)
        
def create_de_bracket(bracket: Bracket, participants: list):
    # log(player_in_match)total_players -  total number of rounds in the tournament 

    number_of_rounds = math.ceil(math.log(len(participants), bracket.participant_in_match))
    number_of_match_in_round = bracket.participant_in_match**(number_of_rounds-1)

    number_of_match_in_round = 1

    print('participants', participants)
    print('number_of_rounds', number_of_rounds)
    print('number_of_match_in_round', number_of_match_in_round)

    rounds = []
    unsaved_matches = []
    saved_matches = []
    matches_info = []

    # Создаем раунды
    for number in range(number_of_rounds, 0, -1):
        rounds.append(Round(bracket=bracket, serial_number=number))
    Round.objects.bulk_create(rounds)

    # Заполняем раунды матчами с последнего по первый
    for r in range(number_of_rounds-1, -1, -1):
        print('r', r)
        for m in range(number_of_match_in_round):
            # Для последнего раунда
            if r == number_of_rounds-1:
                unsaved_matches.append(Match(round=rounds[r], child=None, result_id=1))
                for p in range(bracket.participant_in_match):
                    matches_info.append(MatchParticipantInfo(
                        match=unsaved_matches[m],
                        participant_scoore=0,
                        participant=''
                    ))
            # Для первого
            elif r == 0:
                # Позиция child в массиве saved_matches, созданном на предыдущей итерации,
                # высчитывается как целая часть от деления номера матча в раунде на количество участников в матче
                unsaved_matches.append(Match(round=rounds[r], child=saved_matches[m//bracket.participant_in_match], result_id=1))
                for _ in range(bracket.participant_in_match):
                    matches_info.append(MatchParticipantInfo(
                        match=unsaved_matches[m],
                        participant_scoore=0,
                        participant=participants[m+p]
                    ))
            # Для остальных
            else:
                unsaved_matches.append(Match(round=rounds[r], child=saved_matches[m//bracket.participant_in_match], result_id=1))
                for _ in range(bracket.participant_in_match):
                    matches_info.append(MatchParticipantInfo(
                        match=unsaved_matches[m],
                        participant_scoore=0,
                        participant=''
                    ))
        # Увеличиваем количество матчей раунде
        number_of_match_in_round = number_of_match_in_round * bracket.participant_in_match
        # Сохраняем матчи
        saved_matches = Match.objects.bulk_create(unsaved_matches)
        unsaved_matches = []

    MatchParticipantInfo.objects.bulk_create(matches_info)

    
    
    
        

def create_tournament(*, title: str, content: str,  poster, game: str, prize: float, start_time, bracket_type: str, user: CustomUser,
                    participants: str,
                    # creater_email, tournament_type: bool, secod_final: bool, points_victory: int, points_loss: int, points_draw: int,
                    # time_managment: bool, avg_game_time: int, max_games_number: int, break_between: int, mathes_same_time: int,
                    # compete_in_group: int, advance_from_group: int, group_type: str, groups_per_day: int, final_stage_time: bool
                    ) -> Tournament:
    
    link = slugify(title)
    
    tournament = Tournament.objects.create(title=title, content=content, poster=poster, link=link,
                                            game=game, prize=prize, start_time=start_time, owner=user.profile)
    
    bracket = Bracket.objects.create(tournament=tournament, bracket_type_id=1, participant_in_match=2)

    participants = clear_participants(participants)

    if bracket_type == 1:
        create_se_bracket(bracket, participants)
    else:
        create_de_bracket(bracket, participants)

    # if tournament_type == True:
    #         multi_stage = MultiStage(clear_participants(participants),
    #                                 {'compete_in_group': compete_in_group, 'advance_from_group': advance_from_group,
    #                                 'type': type, 'group_type': group_type,},
    #                                 {'time_managment': time_managment, 'start_time': start_time,
    #                                 'avg_game_time': avg_game_time, 'max_games_number': max_games_number,
    #                                 'break_between': break_between,'mathes_same_time': mathes_same_time,
    #                                 'groups_per_day': groups_per_day, 'final_stage_time': final_stage_time},
    #                                 {'win': points_victory, 'loss': points_loss, 'draw': points_draw},
    #                                 secod_final
    #                                 )
            
    #         brackets = multi_stage.create_multi_stage_brackets()
    #         tournament = Tournament.objects.create(title=title, content=content, participants=participants, poster=poster,
    #                                         game=game, prize=prize, start_time=start_time, owner=Profile.objects.get(user__email=creater_email))
           
    #         for i in brackets[0:-1]:
    #             Bracket.objects.create(tournament=tournament, bracket=i, final=False, type=group_type)
                
    #         Bracket.objects.create(tournament=tournament, bracket=brackets[-1], participants_from_group=advance_from_group, type=type)

    # else:
    #     if type == 'SE':
    #         single_el = SingleEl(clear_participants(participants),
    #                             {'time_managment': time_managment, 'start_time': start_time,
    #                             'avg_game_time': avg_game_time, 'max_games_number': max_games_number,
    #                             'break_between': break_between,'mathes_same_time': mathes_same_time},
    #                             secod_final)
            
    #         bracket = single_el.create_se_bracket()

    #     elif type == 'DE':
    #         double_el = DoubleEl(clear_participants(participants),
    #                             {'time_managment': time_managment, 'start_time': start_time,
    #                             'avg_game_time': avg_game_time, 'max_games_number': max_games_number,
    #                             'break_between': break_between,'mathes_same_time': mathes_same_time})
    #         bracket = double_el.create_de_bracket()

    #     elif type == 'RR':
    #         round_robin = RoundRobin(clear_participants(participants),
    #                                 {'win': points_victory, 'loss': points_loss,'draw': points_draw},
    #                                 {'time_managment': time_managment, 'start_time': start_time,
    #                                 'avg_game_time': avg_game_time, 'max_games_number': max_games_number,
    #                                 'break_between': break_between, 'mathes_same_time': mathes_same_time,})
    #         bracket = round_robin.create_round_robin_bracket()

    #     elif type == 'SW':
    #         swiss = Swiss(clear_participants(participants),
    #                     {'win': points_victory, 'loss': points_loss, 'draw': points_draw},
    #                     {'time_managment': time_managment, 'start_time': start_time,
    #                     'avg_game_time': avg_game_time, 'max_games_number': max_games_number,
    #                     'break_between': break_between,'mathes_same_time': mathes_same_time,})
    #         bracket = swiss.create_swiss_bracket()

    #     tournament = Tournament.objects.create(title=title, content=content, participants=participants, poster=poster,
    #                                         game=game, prize=prize, start_time=start_time, owner=Profile.objects.get(user__email=creater_email))
    #     Bracket.objects.create(tournament=tournament, bracket=bracket, type=type)
            
    # return tournament


def create_bracket(*, participants: str, type: str, secod_final: bool = False, points_victory: int, points_loss: int,  points_draw: int) -> dict:
    if type == 'RR':
        round_robin = RoundRobin(clear_participants(participants), {'win': points_victory, 'loss': points_loss, 'draw': points_draw})
        bracket = Bracket.objects.create(bracket=round_robin.create_round_robin_bracket(), type=type)
    elif type == 'DE':
        double_el = DoubleEl(clear_participants(participants))
        bracket = Bracket.objects.create(bracket=double_el.create_de_bracket(), type=type)
    elif type == 'SW':
        swiss = Swiss(clear_participants(participants), {'win': points_victory, 'loss': points_loss, 'draw': points_draw})
        bracket = Bracket.objects.create(bracket=swiss.create_swiss_bracket(), type=type)
    else:
        single_el = SingleEl(clear_participants(participants), {}, secod_final)
        bracket = Bracket.objects.create(bracket=single_el.create_se_bracket(), type=type)

    return bracket


def update_tournament(*, tournament:Tournament, data) -> Tournament:
    non_side_effect_fields = ["content", "poster", "game", "prize", "start_time"]
    tournament, has_update = model_update(instance=tournament, fields=non_side_effect_fields, data=data)
    
    if tournament.title != data['title']:
        tournament.title = data['title']
        tournament.link = slugify(data['title'])
        tournament.full_clean()
        tournament.save(update_fields=["title", "link"])

    return tournament


def update_bracket(*, bracket:Bracket, match, data) -> Bracket:
    # update none side-effect fields
    non_side_effect_fields = ["tournament", "participants_from_group", "final"] 
    bracket, has_update = model_update(instance=bracket, fields=non_side_effect_fields, data=data)

    # update bracket
    if bracket.final != True:
        MultiStage.set_match_score(match, bracket)
    else:
        if bracket.type == 'SE':
            SingleEl.set_match_score(match, bracket.bracket)
        elif bracket.type == 'RR':
            RoundRobin.set_match_score(match, bracket.bracket)
        elif bracket.type == 'DE':
            DoubleEl.set_match_score(match, bracket.bracket)
        elif bracket.type == 'SW':
            Swiss.set_match_score(match, bracket.bracket)
    
    bracket.full_clean()
    bracket.save(update_fields=["bracket"])

    return bracket

