from .brackets import RoundRobin, SingleEl, DoubleEl, Swiss, MultiStage
from .models import Bracket, Tournament, Round, Match, MatchParticipantInfo, SEBracketSettings, RRBracketSettings, SWBracketSettings, GroupBracketSettings
from .utils import clear_participants 
from typing import Any, Dict, List, Tuple
from profiles.models import Profile, CustomUser
from django.db import models
from django.utils.text import slugify
import math
from django.utils import timezone


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


def create_sw_bracket(bracket: Bracket, participants: list, number_of_rounds: int | None):
    participants_cnt = len(participants)
    p_in_m = bracket.participant_in_match

    if number_of_rounds is None:
        number_of_rounds = math.ceil(math.log(participants_cnt, p_in_m))

    # missing_participant_cnt = p_in_m - (participants_cnt % p_in_m)
    # print('missing_participant_cnt', missing_participant_cnt)

    if participants_cnt % p_in_m > 0:
        for _ in range(p_in_m - (participants_cnt % p_in_m)):
            participants.append('---')

    rounds = []
    unsaved_matches = []
    matches_info = []

    match_serial_number_cnt = 0

    # if participants_cnt % 2 == 1: 
    #     participants = participants + ['---']

    # O(log(n))
    for i in range(number_of_rounds):
        _round = Round(bracket=bracket, serial_number=i)
        rounds.append(_round)
        # O(n / 2)
        for m in range(math.ceil(participants_cnt / p_in_m)):
            match = Match(round=_round, serial_number=match_serial_number_cnt, result_id=1)
            unsaved_matches.append(match)
            if  i == 0:
                for p in range(p_in_m):
                    print('m*p_in_m+p', m*p_in_m+p)
                    matches_info.append(MatchParticipantInfo(
                        match=match,
                        participant_scoore=0,
                        participant=participants[m*p_in_m+p]
                    ))
            else:
                for _ in range(p_in_m):
                    matches_info.append(MatchParticipantInfo(
                        match=match,
                        participant_scoore=0,
                        participant='TBO'
                    ))
              
            match_serial_number_cnt = match_serial_number_cnt + 1
    
    Round.objects.bulk_create(rounds)
    Match.objects.bulk_create(unsaved_matches)
    MatchParticipantInfo.objects.bulk_create(matches_info)

def create_rr_bracket(bracket: Bracket, participants: list):
    participants_cnt = len(participants)
    rounds = []
    unsaved_matches = []
    matches_info = []

    # всегда дополняем до четного
    if participants_cnt % 2 == 1: 
        participants = participants + ['---'] 
        # смешаем начало на 1
        start = 1 
    else:   
        start = 0

    permutations = list(range(participants_cnt))
    mid = participants_cnt // 2 
    match_serial_number_cnt = 0

    # Создаем раунды
    for number in range(participants_cnt-1):
        rounds.append(Round(bracket=bracket, serial_number=number))
    Round.objects.bulk_create(rounds)

    # O(n)
    for i, r in enumerate(rounds):
        l1 = permutations[:mid]
        l2 = permutations[mid:]
        # O(n/2)
        l2.reverse()
        # O(n/2)
        for j in range(start, mid):
            match = Match(round=r, serial_number=match_serial_number_cnt, result_id=1)
            unsaved_matches.append(match)
            if j == 0 and i % 2 == 1:
                t2 = participants[l1[j]]
                t1 = participants[l2[j]]
            else:
                t1 = participants[l1[j]]
                t2 = participants[l2[j]]
            matches_info.append(MatchParticipantInfo(
                        match=match,
                        participant_scoore=0,
                        participant=t1
                    ))
            matches_info.append(MatchParticipantInfo(
                    match=match,
                    participant_scoore=0,
                    participant=t2
                ))
            match_serial_number_cnt = match_serial_number_cnt + 1

        permutations = permutations[mid:-1] + permutations[:mid] + permutations[-1:]

    Match.objects.bulk_create(unsaved_matches)
    MatchParticipantInfo.objects.bulk_create(matches_info)


# a
# b
# c
# d
# e
# f
# g
# h
# a1
# b1
# c1
# d1
# e1
# f1
# g1
# h1

def create_se_bracket(bracket: Bracket, participants: list, settings: SEBracketSettings) -> None:
    print("se")
    # log(player_in_match)total_players -  total number of rounds in the tournament 
    participants_cnt = len(participants)
    # p_in_m work from 2 to 8 
    p_in_m = bracket.participant_in_match
    # next_round_p work from 1 to 4
    next_round_p = settings.advances_to_next

    if next_round_p != 1:
        number_of_rounds = 1
        p = participants_cnt
        while p > p_in_m:
            number_of_rounds = number_of_rounds + 1
            p = p / (p_in_m / next_round_p)
            print('p', p)
    else:
        # для next_round_p = 1
        number_of_rounds = math.ceil(math.log(participants_cnt, p_in_m))
    # number_of_match_in_round = bracket.participant_in_match**(number_of_rounds-1)
    
    match_serial_number_cnt = participants_cnt - 1
    number_of_match_in_round = 1

    print('participants', participants)
    print('number_of_rounds', number_of_rounds)
    print('number_of_match_in_round', number_of_match_in_round)

    rounds = []
    unsaved_matches = []
    matches_info = []

    # Не правильно работает дополнение для next_round_p > 1
    missing_participant_cnt = ((p_in_m)**number_of_rounds) // next_round_p - participants_cnt

    print('missing_participant_cnt', missing_participant_cnt)

    if missing_participant_cnt > 0:
        where_insert_cnt = participants_cnt  // 2
        for _ in range(missing_participant_cnt):
            participants.insert(where_insert_cnt, '---')
            where_insert_cnt = where_insert_cnt + 1

    # Создаем раунды
    for number in range(number_of_rounds-1, -1, -1):
        rounds.append(Round(bracket=bracket, serial_number=number))
    Round.objects.bulk_create(rounds)

    # Заполняем раунды матчами с последнего по первый
    for r in range(number_of_rounds):
        for m in range(number_of_match_in_round):
            match = Match(round=rounds[r], serial_number=match_serial_number_cnt, result_id=1)
            unsaved_matches.append(match)
            # Для первого
            if r == number_of_rounds-1:
                for p in range(p_in_m):
                    print('m*p_in_m+p', m*p_in_m+p)
                    matches_info.append(MatchParticipantInfo(
                        match=match,
                        participant_scoore=0,
                        participant=participants[m*p_in_m+p]
                    ))
            # Для остальных
            else:
                for _ in range(p_in_m):
                    matches_info.append(MatchParticipantInfo(
                        match=match,
                        participant_scoore=0,
                        participant='---'
                    ))
            # Уменьшаем серийный номер матча
            match_serial_number_cnt = match_serial_number_cnt - 1
        # Увеличиваем количество матчей раунде
        number_of_match_in_round = number_of_match_in_round * (p_in_m // next_round_p)
        # Сохраняем матчи

    Match.objects.bulk_create(unsaved_matches)
    MatchParticipantInfo.objects.bulk_create(matches_info)


def create_de_bracket(bracket: Bracket, participants: list):
    # log(player_in_match)total_players -  total number of rounds in the tournament 
    p_in_m = bracket.participant_in_match
    participants_cnt = len(participants)
    
    number_of_rounds_w = math.ceil(math.log(len(participants), p_in_m)) + 1
    number_of_rounds_l = (math.ceil(math.log(len(participants), p_in_m)) - 1) * 2

    print('participants', participants)
    print('number_of_rounds_w', number_of_rounds_w)
    print('number_of_rounds_l', number_of_rounds_l)

    missing_participant_cnt = ((p_in_m)**(number_of_rounds_w-1)) // (p_in_m // 2) - participants_cnt

    print('missing_participant_cnt', missing_participant_cnt)

    if missing_participant_cnt > 0:
        for _ in range(missing_participant_cnt):
            participants.append('---')

    _number_of_rounds_l = number_of_rounds_l
    l_start = 1
    while _number_of_rounds_l != 1:
        l_start += p_in_m
        _number_of_rounds_l -= 1

    _number_of_rounds_w = number_of_rounds_w
    w_start = 0
    while _number_of_rounds_w != 1:
        w_start += p_in_m
        _number_of_rounds_w -= 1
    
    unsaved_matches = []
    matches_info = []

    rounds_l = []
    rounds_w = []

    # Создаем раунды  для нижней сетки, номера нечетные
    for number in range(l_start, -1, -p_in_m):
        rounds_l.append(Round(bracket=bracket, serial_number=number))

    # Создаем раунды для верхней сетки, номера четные
    for number in range(w_start, -1, -p_in_m):
        rounds_w.append(Round(bracket=bracket, serial_number=number))

    Round.objects.bulk_create(rounds_l+rounds_w)

    number_of_match_in_round_l = 1
    match_serial_number_cnt = 0
    flag_l = False

    # Заполняем нижнию сетку с последнего по первый
    for r in range(number_of_rounds_l):
        for m in range(number_of_match_in_round_l):
            match = Match(round=rounds_l[r], serial_number=match_serial_number_cnt, result_id=1)
            unsaved_matches.append(match)
            for _ in range(bracket.participant_in_match):
                matches_info.append(MatchParticipantInfo(
                    match=match,
                    participant_scoore=0,
                    participant='---'
                ))
            # Уменьшаем серийный номер матча
            match_serial_number_cnt = match_serial_number_cnt + 1

        if flag_l:
            # Увеличиваем количество матчей раунде
            number_of_match_in_round_l = number_of_match_in_round_l * 2
            flag_l = False
        else:
            flag_l = True
    
    number_of_match_in_round_w = 1
    match_serial_number_cnt = len(participants)
    flag_l = False

    # Заполняем верхнию сетку с последнего по первый
    for r in range(number_of_rounds_w):
        for m in range(number_of_match_in_round_w):
            match = Match(round=rounds_w[r], serial_number=match_serial_number_cnt, result_id=1)
            unsaved_matches.append(match)
            # Для первого
            if r == number_of_rounds_w-1:
                for p in range(bracket.participant_in_match):
                    matches_info.append(MatchParticipantInfo(
                        match=match,
                        participant_scoore=0,
                        participant=participants[m*p_in_m+p]
                    ))
            # Для остальных
            else:
                for _ in range(bracket.participant_in_match):
                    matches_info.append(MatchParticipantInfo(
                        match=match,
                        participant_scoore=0,
                        participant=''
                    ))
            # Уменьшаем серийный номер матча
            match_serial_number_cnt = match_serial_number_cnt - 1

        # Увеличиваем количество матчей раунде
        if flag_l:
            number_of_match_in_round_w = number_of_match_in_round_w * 2
        else:
            flag_l = True
            
    Match.objects.bulk_create(unsaved_matches)
    MatchParticipantInfo.objects.bulk_create(matches_info)


def create_bracket(bracket_type: int, tournament: Tournament, participant_in_match: int, participants: list,
                    advances_to_next: int=2, points_loss: int=0, points_draw: int=0, points_victory: int=0,
                    number_of_rounds: int=0

) -> Bracket:
    if bracket_type in [1, 5, 9]:
        bracket = Bracket.objects.create(tournament=tournament, bracket_type_id=bracket_type, participant_in_match=participant_in_match)
        settings = SEBracketSettings.objects.create(bracket=bracket, advances_to_next=advances_to_next)
        create_se_bracket(bracket, participants, settings)
    elif bracket_type in [2, 6, 10]:
        bracket = Bracket.objects.create(tournament=tournament, bracket_type_id=bracket_type, participant_in_match=participant_in_match)
        create_de_bracket(bracket, participants)
    elif bracket_type in [3, 7, 11]:
        bracket = Bracket.objects.create(tournament=tournament, bracket_type_id=bracket_type, participant_in_match=participant_in_match)
        settings = RRBracketSettings.objects.create(bracket=bracket, points_per_loss=points_loss,
                                                    points_per_draw=points_draw, points_per_victory=points_victory)
        create_rr_bracket(bracket, participants)
    elif bracket_type in [4, 8, 12]:
        bracket = Bracket.objects.create(tournament=tournament, bracket_type_id=bracket_type, participant_in_match=participant_in_match)
        settings = SWBracketSettings.objects.create(bracket=bracket, points_per_loss=points_loss,
                                                    points_per_draw=points_draw, points_per_victory=points_victory)
        create_sw_bracket(bracket, participants, number_of_rounds)

    return bracket


def create_tournament(*, title: str, content: str,  poster, game: str, prize: float, start_time, bracket_type: int, user: CustomUser,
                    participants: str, advances_to_next: int, participant_in_match, points_victory: int, points_loss: int, points_draw: int,
                    number_of_rounds: int, tournament_type: int,
                    participant_in_group: int, advance_from_group: int, group_type: int
                    ) -> Tournament:
    
    link = slugify(title)
    tournament = Tournament.objects.create(title=title, content=content, poster=poster, link=link,
                                            game=game, prize=prize, start_time=start_time, owner=user.profile)
    participants = clear_participants(participants)
    if tournament_type == 1:
        group_brackets = []
        start = 0
        end = participant_in_group

        number_of_group = math.ceil(len(participants) / participant_in_group)

        print('number_of_group', number_of_group)

        final_bracket = create_bracket(bracket_type, tournament, participant_in_match, ["---" for i in range(number_of_group*advance_from_group)],
             advances_to_next, points_loss, points_draw, points_victory, number_of_rounds)
        print('created final')

        missing_participants = participant_in_group * number_of_group - len(participants)

        for _ in range(missing_participants):
            participants.append('---')

        for i in range(number_of_group):
            print("group brackets", i)
            bracket = create_bracket(group_type, tournament, participant_in_match, participants[start:end], advances_to_next,
                points_loss, points_draw, points_victory, number_of_rounds)
            group_brackets.append(bracket)
            start += participant_in_group
            end += participant_in_group
        print('created group')

        group_settings = GroupBracketSettings.objects.create(final_bracket=final_bracket, participant_in_group=participant_in_group,
            advance_from_group=advance_from_group)
        group_settings.group_brackets.set(group_brackets)

    else:
        create_bracket(bracket_type, tournament, participant_in_match, participants, advances_to_next,
            points_loss, points_draw, points_victory, number_of_rounds)

    print('end m')
    return

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


# def create_bracket(*, participants: str, type: str, secod_final: bool = False, points_victory: int, points_loss: int,  points_draw: int) -> dict:
#     if type == 'RR':
#         round_robin = RoundRobin(clear_participants(participants), {'win': points_victory, 'loss': points_loss, 'draw': points_draw})
#         bracket = Bracket.objects.create(bracket=round_robin.create_round_robin_bracket(), type=type)
#     elif type == 'DE':
#         double_el = DoubleEl(clear_participants(participants))
#         bracket = Bracket.objects.create(bracket=double_el.create_de_bracket(), type=type)
#     elif type == 'SW':
#         swiss = Swiss(clear_participants(participants), {'win': points_victory, 'loss': points_loss, 'draw': points_draw})
#         bracket = Bracket.objects.create(bracket=swiss.create_swiss_bracket(), type=type)
#     else:
#         single_el = SingleEl(clear_participants(participants), {}, secod_final)
#         bracket = Bracket.objects.create(bracket=single_el.create_se_bracket(), type=type)

#     return bracket


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

