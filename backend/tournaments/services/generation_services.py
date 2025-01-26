from ..models import (
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
from ..utils import clear_participants, model_update
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
    number_of_match_in_round = math.ceil(participants_cnt / p_in_m)

    # if participants_cnt % 2 == 1:
    #     participants = participants + ['---']

    # O(log(n))
    for i in range(number_of_rounds):
        _round = Round(bracket=bracket, serial_number=i)
        rounds.append(_round)
        # O(n / 2)
        for m in range(number_of_match_in_round):
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
    p_cnt = len(participants)
    # p_in_m work from 2 to 8
    p_in_m = bracket.participant_in_match
    # next_round_p work from 1 to 4
    next_round_p = settings.advances_to_next
    # коэффицент показывающий отношение выбывших и прошедших участников в одном матче
    multiplicity_factor = p_in_m / next_round_p

    number_of_rounds = 1
    remaining_p_cnt = p_cnt
    # O(log(n))
    while remaining_p_cnt > p_in_m:
        print('remaining_p_cnt', remaining_p_cnt)
        number_of_rounds = number_of_rounds + 1
        remaining_p_cnt = remaining_p_cnt / multiplicity_factor
        

    # if next_round_p != 1:
    #     number_of_rounds = 1
    #     remaining_p_cnt = p_cnt
    #     while remaining_p_cnt > p_in_m:
    #         number_of_rounds = number_of_rounds + 1
    #         remaining_p_cnt = remaining_p_cnt / multiplicity_factor
    # else:
    #     # для next_round_p = 1
    #     number_of_rounds = math.ceil(math.log(p_cnt, p_in_m))
    #     print('number_of_rounds old', number_of_rounds)
    # number_of_match_in_round = bracket.participant_in_match**(number_of_rounds-1)

    number_of_match_in_round = 1
    
    print("p_in_m", p_in_m)
    print("next_round_p", next_round_p)
    print("participants", participants)
    print("number_of_rounds", number_of_rounds)
    print("number_of_match_in_round", number_of_match_in_round)

    rounds = []
    unsaved_matches = []
    matches_info = []

    # Не правильно работает дополнение для next_round_p > 1
    # print('participant count', (p_in_m**number_of_rounds) // next_round_p)
    missing_p_cnt = ((p_in_m**number_of_rounds) // next_round_p)  - p_cnt
    # missing_p_cnt = ((p_in_m // next_round_p) ** (number_of_rounds ))  - p_cnt

    print("missing_participant_cnt", missing_p_cnt)

    # Добавить диаграмму
    if missing_p_cnt > 0:
        where_insert_cnt = p_cnt // 2
        for _ in range(missing_p_cnt): # O(n)
            participants.insert(where_insert_cnt, "---")
            where_insert_cnt = where_insert_cnt + 1

    
    print("participants", participants)

    # match_cnt_in_round = 1
    

    # for r in range(number_of_rounds-1):
    #     match_cnt_in_round = match_cnt_in_round * (p_in_m // next_round_p)
    #     match_serial_number_cnt =  match_serial_number_cnt + match_cnt_in_round

    # print("match_serial_number_sum", match_serial_number_cnt)

    # Создаем раунды O(log(n))
    for number in range(number_of_rounds - 1, -1, -1):
        rounds.append(Round(bracket=bracket, serial_number=number))
    Round.objects.bulk_create(rounds)

    # Заполняем раунды матчами с последнего по первый O(nlog(n))
    for r in range(number_of_rounds): # O(log(n))
        match_serial_number_cnt = number_of_match_in_round
        for m in range(number_of_match_in_round): # O(n)
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

    next_round_p = p_in_m // 2
    print()

    number_of_rounds_w = math.ceil(math.log(len(participants), p_in_m)) + next_round_p
    number_of_rounds_l = (math.ceil(math.log(len(participants), p_in_m)) - 1) * 2

    print("participants", participants, len(participants))
    print("number_of_rounds_w", number_of_rounds_w)
    print("number_of_rounds_l", number_of_rounds_l)

    missing_participant_cnt = ((p_in_m) ** (number_of_rounds_w - 1)) // (
        p_in_m // 2
    ) - participants_cnt

    print("missing_participant_cnt", missing_participant_cnt)

    if missing_participant_cnt > 0:
        for _ in range(missing_participant_cnt):
            participants.append("---")

    print("participants", participants)

    _number_of_rounds_l = number_of_rounds_l
    l_start = 1
    while _number_of_rounds_l != 1:
        l_start += 2
        _number_of_rounds_l -= 1

    _number_of_rounds_w = number_of_rounds_w
    w_start = 0
    while _number_of_rounds_w != 1:
        w_start += 2
        _number_of_rounds_w -= 1

    unsaved_matches = []
    matches_info = []

    rounds_l = []
    rounds_w = []


    # Создаем раунды  для нижней сетки, номера нечетные
    for number in range(l_start, -1, -2):
        rounds_l.append(Round(bracket=bracket, serial_number=number))
     

    # Создаем раунды для верхней сетки, номера четные
    for number in range(w_start, -1, -2):
        rounds_w.append(Round(bracket=bracket, serial_number=number))


    Round.objects.bulk_create(rounds_l + rounds_w)

    number_of_match_in_round_l = 1
    match_serial_number_cnt = 0
    flag_l = False

    # Заполняем нижнию сетку с последнего по первый
    for r in range(number_of_rounds_l):
        match_serial_number_cnt = number_of_match_in_round_l
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
            match_serial_number_cnt = match_serial_number_cnt - 1

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
        match_serial_number_cnt = number_of_match_in_round_w
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
                            match=match, participant_score=0, participant="---"
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

