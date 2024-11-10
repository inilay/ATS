from .models import (
    Bracket,
    Tournament,
    Round,
    Match,
    MatchParticipantInfo,
    SEBracketSettings,
    RRBracketSettings,
    SWBracketSettings,
    GroupBracketSettings,
)
from .utils import clear_participants, model_update
from profiles.models import CustomUser
from django.utils.text import slugify
import math
from django.shortcuts import get_object_or_404
from django.db.models.query import QuerySet
from django.db.models import Prefetch, Q
import operator
from functools import reduce


def create_sw_bracket(
    bracket: Bracket, participants: list, number_of_rounds: int | None
):
    participants_cnt = len(participants)
    p_in_m = bracket.participant_in_match

    if number_of_rounds is None:
        number_of_rounds = math.ceil(math.log(participants_cnt, p_in_m))

    # missing_participant_cnt = p_in_m - (participants_cnt % p_in_m)
    # print('missing_participant_cnt', missing_participant_cnt)

    if participants_cnt % p_in_m > 0:
        for _ in range(p_in_m - (participants_cnt % p_in_m)):
            participants.append("---")

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
            match = Match(
                round=_round, serial_number=match_serial_number_cnt, state_id=1
            )
            unsaved_matches.append(match)
            if i == 0:
                for p in range(p_in_m):
                    print("m*p_in_m+p", m * p_in_m + p)
                    matches_info.append(
                        MatchParticipantInfo(
                            match=match,
                            participant_score=0,
                            participant=participants[m * p_in_m + p],
                        )
                    )
            else:
                for _ in range(p_in_m):
                    matches_info.append(
                        MatchParticipantInfo(
                            match=match, participant_score=0, participant="TBO"
                        )
                    )

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
        participants = participants + ["---"]
        # смешаем начало на 1
        start = 1
    else:
        start = 0

    permutations = list(range(participants_cnt))
    mid = participants_cnt // 2
    match_serial_number_cnt = 0

    # Создаем раунды
    for number in range(participants_cnt - 1):
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
            match = Match(round=r, serial_number=match_serial_number_cnt, state_id=1)
            unsaved_matches.append(match)
            if j == 0 and i % 2 == 1:
                t2 = participants[l1[j]]
                t1 = participants[l2[j]]
            else:
                t1 = participants[l1[j]]
                t2 = participants[l2[j]]
            matches_info.append(
                MatchParticipantInfo(match=match, participant_score=0, participant=t1)
            )
            matches_info.append(
                MatchParticipantInfo(match=match, participant_score=0, participant=t2)
            )
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


def create_se_bracket(
    bracket: Bracket, participants: list, settings: SEBracketSettings
) -> None:
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
            print("p", p)
    else:
        # для next_round_p = 1
        number_of_rounds = math.ceil(math.log(participants_cnt, p_in_m))
    # number_of_match_in_round = bracket.participant_in_match**(number_of_rounds-1)

    number_of_match_in_round = 1

    print("participants", participants)
    print("number_of_rounds", number_of_rounds)
    print("number_of_match_in_round", number_of_match_in_round)

    rounds = []
    unsaved_matches = []
    matches_info = []

    # Не правильно работает дополнение для next_round_p > 1
    missing_participant_cnt = (
        (p_in_m) ** number_of_rounds
    ) // next_round_p - participants_cnt

    print("missing_participant_cnt", missing_participant_cnt)

    if missing_participant_cnt > 0:
        where_insert_cnt = participants_cnt // 2
        for _ in range(missing_participant_cnt):
            participants.insert(where_insert_cnt, "---")
            where_insert_cnt = where_insert_cnt + 1

    # match_cnt_in_round = 1
    

    # for r in range(number_of_rounds-1):
    #     match_cnt_in_round = match_cnt_in_round * (p_in_m // next_round_p)
    #     match_serial_number_cnt =  match_serial_number_cnt + match_cnt_in_round

    # print("match_serial_number_sum", match_serial_number_cnt)

    # Создаем раунды
    for number in range(number_of_rounds - 1, -1, -1):
        rounds.append(Round(bracket=bracket, serial_number=number))
    Round.objects.bulk_create(rounds)

    # Заполняем раунды матчами с последнего по первый
    for r in range(number_of_rounds):
        match_serial_number_cnt = number_of_match_in_round
        for m in range(number_of_match_in_round):
            match = Match(
                round=rounds[r], serial_number=match_serial_number_cnt, state_id=1
            )
            unsaved_matches.append(match)
            # Для первого
            if r == number_of_rounds - 1:
                for p in range(p_in_m):
                    print("m*p_in_m+p", m * p_in_m + p)
                    matches_info.append(
                        MatchParticipantInfo(
                            match=match,
                            participant_score=0,
                            participant=participants[m * p_in_m + p],
                        )
                    )
            # Для остальных
            else:
                for _ in range(p_in_m):
                    matches_info.append(
                        MatchParticipantInfo(
                            match=match, participant_score=0, participant="---"
                        )
                    )
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

    print("participants", participants)
    print("number_of_rounds_w", number_of_rounds_w)
    print("number_of_rounds_l", number_of_rounds_l)

    missing_participant_cnt = ((p_in_m) ** (number_of_rounds_w - 1)) // (
        p_in_m // 2
    ) - participants_cnt

    print("missing_participant_cnt", missing_participant_cnt)

    if missing_participant_cnt > 0:
        for _ in range(missing_participant_cnt):
            participants.append("---")

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

    Round.objects.bulk_create(rounds_l + rounds_w)

    number_of_match_in_round_l = 1
    match_serial_number_cnt = 0
    flag_l = False

    # Заполняем нижнию сетку с последнего по первый
    for r in range(number_of_rounds_l):
        for m in range(number_of_match_in_round_l):
            match = Match(
                round=rounds_l[r], serial_number=match_serial_number_cnt, state_id=1
            )
            unsaved_matches.append(match)
            for _ in range(bracket.participant_in_match):
                matches_info.append(
                    MatchParticipantInfo(
                        match=match, participant_score=0, participant="---"
                    )
                )
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
            match = Match(
                round=rounds_w[r], serial_number=match_serial_number_cnt, state_id=1
            )
            unsaved_matches.append(match)
            # Для первого
            if r == number_of_rounds_w - 1:
                for p in range(bracket.participant_in_match):
                    matches_info.append(
                        MatchParticipantInfo(
                            match=match,
                            participant_score=0,
                            participant=participants[m * p_in_m + p],
                        )
                    )
            # Для остальных
            else:
                for _ in range(bracket.participant_in_match):
                    matches_info.append(
                        MatchParticipantInfo(
                            match=match, participant_score=0, participant=""
                        )
                    )
            # Уменьшаем серийный номер матча
            match_serial_number_cnt = match_serial_number_cnt - 1

        # Увеличиваем количество матчей раунде
        if flag_l:
            number_of_match_in_round_w = number_of_match_in_round_w * 2
        else:
            flag_l = True

    Match.objects.bulk_create(unsaved_matches)
    MatchParticipantInfo.objects.bulk_create(matches_info)


def create_bracket(
    bracket_type: int,
    tournament: Tournament,
    participant_in_match: int,
    participants: list,
    advances_to_next: int = 2,
    points_loss: int = 0,
    points_draw: int = 0,
    points_victory: int = 0,
    number_of_rounds: int = 0,
) -> Bracket:
    if bracket_type in [1, 5, 9]:
        bracket = Bracket.objects.create(
            tournament=tournament,
            bracket_type_id=bracket_type,
            participant_in_match=participant_in_match,
        )
        settings = SEBracketSettings.objects.create(
            bracket=bracket, advances_to_next=advances_to_next
        )
        create_se_bracket(bracket, participants, settings)
    elif bracket_type in [2, 6, 10]:
        bracket = Bracket.objects.create(
            tournament=tournament,
            bracket_type_id=bracket_type,
            participant_in_match=participant_in_match,
        )
        create_de_bracket(bracket, participants)
    elif bracket_type in [3, 7, 11]:
        bracket = Bracket.objects.create(
            tournament=tournament,
            bracket_type_id=bracket_type,
            participant_in_match=participant_in_match,
        )
        settings = RRBracketSettings.objects.create(
            bracket=bracket,
            points_per_loss=points_loss,
            points_per_draw=points_draw,
            points_per_victory=points_victory,
        )
        create_rr_bracket(bracket, participants)
    elif bracket_type in [4, 8, 12]:
        bracket = Bracket.objects.create(
            tournament=tournament,
            bracket_type_id=bracket_type,
            participant_in_match=participant_in_match,
        )
        settings = SWBracketSettings.objects.create(
            bracket=bracket,
            points_per_loss=points_loss,
            points_per_draw=points_draw,
            points_per_victory=points_victory,
        )
        create_sw_bracket(bracket, participants, number_of_rounds)

    return bracket


def create_tournament(
    *,
    title: str,
    content: str,
    poster,
    game: str,
    prize: float,
    start_time,
    bracket_type: int,
    user: CustomUser,
    participants: str,
    advances_to_next: int,
    participant_in_match,
    points_victory: int,
    points_loss: int,
    points_draw: int,
    number_of_rounds: int,
    tournament_type: int,
    participant_in_group: int,
    advance_from_group: int,
    group_type: int,
) -> Tournament:
    link = slugify(title)
    tournament = Tournament.objects.create(
        title=title,
        content=content,
        poster=poster,
        link=link,
        game=game,
        prize=prize,
        start_time=start_time,
        owner=user.profile,
    )
    participants = clear_participants(participants)
    if tournament_type == 1:
        group_brackets = []
        start = 0
        end = participant_in_group

        number_of_group = math.ceil(len(participants) / participant_in_group)

        print("number_of_group", number_of_group)

        final_bracket = create_bracket(
            bracket_type,
            tournament,
            participant_in_match,
            ["---" for i in range(number_of_group * advance_from_group)],
            advances_to_next,
            points_loss,
            points_draw,
            points_victory,
            number_of_rounds,
        )
        print("created final")

        missing_participants = participant_in_group * number_of_group - len(
            participants
        )

        for _ in range(missing_participants):
            participants.append("---")

        for i in range(number_of_group):
            print("group brackets", i)
            bracket = create_bracket(
                group_type,
                tournament,
                participant_in_match,
                participants[start:end],
                advances_to_next,
                points_loss,
                points_draw,
                points_victory,
                number_of_rounds,
            )
            group_brackets.append(bracket)
            start += participant_in_group
            end += participant_in_group
        print("created group")

        group_settings = GroupBracketSettings.objects.create(
            final_bracket=final_bracket,
            participant_in_group=participant_in_group,
            advance_from_group=advance_from_group,
        )
        group_settings.group_brackets.set(group_brackets)

    else:
        create_bracket(
            bracket_type,
            tournament,
            participant_in_match,
            participants,
            advances_to_next,
            points_loss,
            points_draw,
            points_victory,
            number_of_rounds,
        )

    print("end m")
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


def update_tournament(*, tournament: Tournament, data) -> Tournament:
    non_side_effect_fields = ["content", "poster", "game", "prize", "start_time"]
    tournament, has_update = model_update(
        instance=tournament, fields=non_side_effect_fields, data=data
    )

    if tournament.title != data["title"]:
        tournament.title = data["title"]
        tournament.link = slugify(data["title"])
        tournament.full_clean()
        tournament.save(update_fields=["title", "link"])

    return tournament


def update_match_participant_info(
    match_results: dict, info: QuerySet[MatchParticipantInfo]
):

    for i in info:
        match_result = match_results.get(f"{i.id}")
        if match_result is not None:
            i.participant_score = match_result.get("score")
            i.participant = match_result.get("participant")

    MatchParticipantInfo.objects.bulk_update(info, ["participant_score", "participant"])

def reset_match_participant_info(mathes: QuerySet[Match], left_border: int, right_border: int):
    info = []
    for m in mathes:
        for i in m.info.all()[left_border:right_border]:
            print('info', i)
            i.participant_score = 0
            i.participant = '---'
            info.append(i)

    MatchParticipantInfo.objects.bulk_update(info, ["participant_score", "participant"])

def sort_participant_by_score(match_results: dict):
    return sorted(match_results.keys(), key=lambda x:match_results.get(x).get("score"), reverse=True)

def get_next_math_serial_number(serial_number: int, p_i_m: int) -> int:
    flag = 1 if (serial_number % p_i_m) > 0 else 0
    next_serial_number = serial_number // p_i_m  + flag

    return next_serial_number

def check_results(prev: list, cur: list) -> bool:
    for i in range(len(prev)):
        if prev[i] != cur[i]:
            return False
    return True

def update_se_bracket(data):
    print('data', data)
    bracket = Bracket.objects.prefetch_related("se_settings").get(id=data.get("bracket_id"))
    match = (
        Match.objects.select_related("round")
        .prefetch_related("info")
        .get(id=data.get("match_id"))
    )
    print('match id', match.id)
    match_prev_state = match.state.name
    cur_match_state = data.get("state")
    match_results = data.get("match_results")
    advances_to_next = bracket.se_settings.first().advances_to_next

    print('match.state', match.state)
    print(match_prev_state, cur_match_state, match.state.id)

    
    # P -> S
    if match_prev_state == "PLAYED" and cur_match_state == "SCHEDULED":
        print('P -> S')
    
        round_cnt = bracket.rounds.count()
        match_cur_round_number = match.round.serial_number

        print('match_cur_round_number', match_cur_round_number)
        print('round_cnt', round_cnt)

        if match_cur_round_number+1 != round_cnt:
            next_matches_predicates = [Q()]
            cur_serial_number = match.serial_number
            for round_number in range(match_cur_round_number+1, round_cnt):
                next_serial_number = get_next_math_serial_number(cur_serial_number, bracket.participant_in_match)
                next_matches_predicates.append(Q(Q(round__serial_number=round_number) & Q(serial_number=next_serial_number)))
                cur_serial_number = next_serial_number

            next_matches = Match.objects.prefetch_related(
                Prefetch('info', queryset=MatchParticipantInfo.objects.all().order_by('-id'))
            ).filter(reduce(operator.or_, next_matches_predicates), round__bracket=bracket)
            
            print('round_cnt', round_cnt)
            print('match_cur_round_number', match_cur_round_number)
            print('next_matches_predicates', next_matches_predicates)
            print('next_matches', next_matches)

            match_participant_info_l = ((match.serial_number-1)*advances_to_next) % (bracket.participant_in_match)
            match_participant_info_r = match_participant_info_l + advances_to_next

            print('match_participant_info_l', match_participant_info_l)
            print('match_participant_info_r', match_participant_info_r)

            reset_match_participant_info(next_matches, match_participant_info_l, match_participant_info_r)

        # обновляем результаты текущего матча
        update_match_participant_info(match_results, match.info.all())
        match.state_id=1
        match.save()

    # P -> P
    elif match_prev_state == "PLAYED" and cur_match_state == "PLAYED":
        print('P -> P')
        match_prev_res = match.info.order_by('-participant_score').values_list('id', flat=True)
        match_cur_res = sort_participant_by_score(match_results)

        print('match_prev_res', match_prev_res)
        print('match_cur_res', match_cur_res)

        round_cnt = bracket.rounds.count()
        match_cur_round_number = match.round.serial_number

        if not check_results(match_prev_res, list(map(int, match_cur_res))) and round_cnt != match_cur_round_number+2 and match_cur_round_number+1 != round_cnt:
            
            next_matches_predicates = [Q()]
            cur_serial_number = get_next_math_serial_number(match.serial_number, bracket.participant_in_match)
            for round_number in range(match_cur_round_number+2, round_cnt):
                next_serial_number = get_next_math_serial_number(cur_serial_number, bracket.participant_in_match)
                next_matches_predicates.append(Q(Q(round__serial_number=round_number) & Q(serial_number=next_serial_number)))
                cur_serial_number = next_serial_number

            next_matches = Match.objects.prefetch_related(
                Prefetch('info', queryset=MatchParticipantInfo.objects.all().order_by('-id'))
            ).filter(reduce(operator.or_, next_matches_predicates), round__bracket=bracket)
            
            print('round_cnt', round_cnt)
            print('match_cur_round_number', match_cur_round_number)
            print('next_match_numbers', next_matches_predicates)
            print('next_matches', next_matches)

            match_participant_info_l = ((match.serial_number-1)*advances_to_next) % (bracket.participant_in_match)
            match_participant_info_r = match_participant_info_l + advances_to_next

            reset_match_participant_info(next_matches, match_participant_info_l, match_participant_info_r)

        # обновляем результаты текущего матча
        update_match_participant_info(match_results, match.info.all())
        if match_cur_round_number+1 != round_cnt:
            # обновляем результаты следующего матча
            sorted_participant_ids = sort_participant_by_score(match_results)
            next_match = Match.objects.prefetch_related(
                Prefetch('info', queryset=MatchParticipantInfo.objects.all().order_by('-id'))
            ).get(serial_number=get_next_math_serial_number(match.serial_number, bracket.participant_in_match), 
                                        round__bracket=bracket, round__serial_number=match.round.serial_number+1)
            
            match_participant_info_l = ((match.serial_number-1)*advances_to_next) % (bracket.participant_in_match)
            match_participant_info_r = match_participant_info_l + advances_to_next

            next_match_info_ids = [f"{id}" for id in next_match.info.values_list('id', flat=True)]

            print('match_participant_info_l', match_participant_info_l)
            print('match_participant_info_r', match_participant_info_r)

            next_match_results = dict(
                zip(
                    next_match_info_ids[match_participant_info_l:match_participant_info_r][::-1], 
                    [{
                        'participant': match_results.get(sorted_participant_ids[i]).get('participant'),
                        'score': 0
                    } for i in range(advances_to_next)]
                )
            )

            print('next_match_results', next_match_results)
            print('next_match_info_ids', next_match_info_ids)

            update_match_participant_info(next_match_results, next_match.info.all())

            print('next_match', next_match)
            print('sorted_participant_ids', sorted_participant_ids)

        match.state_id=2
        match.save()
    # S -> P
    elif match_prev_state == "SCHEDULED" and cur_match_state == "PLAYED":
        # обновляем результаты текущего матча
        update_match_participant_info(match_results, match.info.all())

        round_cnt = bracket.rounds.count()
        match_cur_round_number = match.round.serial_number

        if match_cur_round_number+1 != round_cnt:
            # обновляем результаты следующего матча
            sorted_participant_ids = sort_participant_by_score(match_results)
            next_match = Match.objects.prefetch_related(
                Prefetch('info', queryset=MatchParticipantInfo.objects.all().order_by('-id'))
            ).get(serial_number=get_next_math_serial_number(match.serial_number, bracket.participant_in_match), 
                                        round__bracket=bracket, round__serial_number=match.round.serial_number+1)
            
            print('match.serial_number-1', match.serial_number-advances_to_next)
            match_participant_info_l = ((match.serial_number-1)*advances_to_next) % (bracket.participant_in_match)
            match_participant_info_r = match_participant_info_l + advances_to_next

            next_match_info_ids = [f"{id}" for id in next_match.info.values_list('id', flat=True)]

            print('match_participant_info_l', match_participant_info_l)
            print('match_participant_info_r', match_participant_info_r)

            next_match_results = dict(
                zip(
                    next_match_info_ids[match_participant_info_l:match_participant_info_r][::-1], 
                    [{
                        'participant': match_results.get(sorted_participant_ids[i]).get('participant'),
                        'score': 0
                    } for i in range(advances_to_next)]
                )
            )

            print('next_match_results', next_match_results)
            print('next_match_info_ids', next_match_info_ids)

            update_match_participant_info(next_match_results, next_match.info.all())

            print('next_match', next_match)
            print('sorted_participant_ids', sorted_participant_ids)

        match.state_id=2
        match.save()
    # S -> S
    else:
        match.state_id=1
        match.save()
    # elif match_prev_state == "SCHEDULED" and cur_match_state == "SCHEDULED":
        update_match_participant_info(match_results, match.info.all())


def update_bracket(*, data: dict) -> Bracket:
    bracket = get_object_or_404(Bracket, id=data.get("bracket_id"))

    if bracket.bracket_type.name == "SE":
        update_se_bracket(data)

    # update none side-effect fields
    # non_side_effect_fields = ["tournament", "participants_from_group", "final"]
    # bracket, has_update = model_update(instance=bracket, fields=non_side_effect_fields, data=data)

    # # update bracket
    # if bracket.final != True:
    #     MultiStage.set_match_score(match, bracket)
    # else:
    #     if bracket.type == 'SE':
    #         SingleEl.set_match_score(match, bracket.bracket)
    #     elif bracket.type == 'RR':
    #         RoundRobin.set_match_score(match, bracket.bracket)
    #     elif bracket.type == 'DE':
    #         DoubleEl.set_match_score(match, bracket.bracket)
    #     elif bracket.type == 'SW':
    #         Swiss.set_match_score(match, bracket.bracket)

    # bracket.full_clean()
    # bracket.save(update_fields=["bracket"])

    return bracket
