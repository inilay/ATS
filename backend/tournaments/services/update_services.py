from profiles.models import Profile
from tournaments.orm_functions import JsonGroupArray
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
from django.utils.text import slugify
from django.shortcuts import get_object_or_404
from django.db.models.query import QuerySet
from django.db.models import Prefetch, Q, Count, F, OuterRef, Subquery, Max, Min
import operator
import math
from functools import reduce


def create_moderator(validated_data: dict) -> Profile:
    username = validated_data.get("username")
    tournament_id = validated_data.get("tournament_id")

    profile = get_object_or_404(Profile.objects.select_related('user'), user__username=username)
    tournament = get_object_or_404(Tournament, id=tournament_id)
    tournament.moderators.add(profile)

    return profile


def delete_moderator(validated_data: dict) -> None:
    username = validated_data.get("username")
    tournament_id = validated_data.get("tournament_id")

    profile = get_object_or_404(Profile.objects.select_related('user'), user__username=username)
    tournament = get_object_or_404(Tournament, id=tournament_id)
    tournament.moderators.remove(profile)

    return None


def update_tournament(*, tournament: Tournament, data) -> Tournament:
    non_side_effect_fields = ["content", "poster", "game", "start_time"]
    tournament, has_update = model_update(
        instance=tournament, fields=non_side_effect_fields, data=data
    )

    if tournament.title != data["title"]:
        tournament.title = data["title"]
        tournament.link = slugify(data["title"])
        tournament.full_clean()
        tournament.save(update_fields=["title", "link"])

    return tournament


def set_match_participant_info(match_results: dict, info: QuerySet[MatchParticipantInfo]):
    for index, i in enumerate(info):
        i.participant_score = match_results[index].get("score")
        i.participant = match_results[index].get("participant")
    MatchParticipantInfo.objects.bulk_update(info, ["participant_score", "participant"])


def update_match_participant_info(
    match_results: dict, info: QuerySet[MatchParticipantInfo]
):

    for i in info:
        match_result = match_results.get(f"{i.id}")
        if match_result is not None:
            i.participant_score = match_result.get("score")
            i.participant = match_result.get("participant")
            i.participant_result_id = match_result.get("participant_result", 1)

    MatchParticipantInfo.objects.bulk_update(info, ["participant_score", "participant", "participant_result_id"])

def reset_match_participant_info(mathes: QuerySet[Match], left_border: int, right_border: int):
    info = []
    for m in mathes:
        for i in m.info.all()[left_border:right_border]:
            i.participant_score = 0
            i.participant = '---'
            info.append(i)

    MatchParticipantInfo.objects.bulk_update(info, ["participant_score", "participant"])


def reset_match_participant_info_for_low_bracket(mathes: QuerySet[Match], p_i_m: int, advances_to_next: int, is_special: list[bool], prev_serial_number: int) -> None:
    info = []
    prev_math_serial_number = prev_serial_number
    for i, m in enumerate(mathes):
        print('match id', m.id)
        if is_special[i]: 
            print('special')
            match_participant_info_l = ((prev_math_serial_number-1)*advances_to_next) % (p_i_m)
        else:
            match_participant_info_l = advances_to_next
        print('prev_math_serial_number', prev_math_serial_number)
        print('match_participant_info_l', match_participant_info_l)
        match_participant_info_r = match_participant_info_l + advances_to_next
        for i in m.info.all()[match_participant_info_l:match_participant_info_r]:
            i.participant_score = 0
            i.participant = '---'
            info.append(i)
        prev_math_serial_number = m.serial_number

    MatchParticipantInfo.objects.bulk_update(info, ["participant_score", "participant"])


def reset_match_participant_info_for_low_bracket_from_hight(mathes: QuerySet[Match], p_i_m: int, advances_to_next: int, is_special: list[bool], prev_serial_number: int, round_cnt: int, start_round: int) -> None:
    info = []
    prev_math_serial_number = prev_serial_number
    for i, m in enumerate(mathes):
        start_round += 2
        print('start_round', start_round)
        if start_round >= round_cnt - 3:
            print('match id', m.id)
            if is_special[i]: 
                print('special')
                match_participant_info_l = ((prev_math_serial_number-1)*advances_to_next) % (p_i_m)
            else:
                match_participant_info_l = advances_to_next
            print('prev_math_serial_number', prev_math_serial_number)
            print('match_participant_info_l', match_participant_info_l)
            match_participant_info_r = match_participant_info_l + advances_to_next
            for i in m.info.all()[match_participant_info_l:match_participant_info_r]:
                i.participant_score = 0
                i.participant = '---'
                info.append(i)
            prev_math_serial_number = m.serial_number
        else:
            for i in m.info.all():
                i.participant_score = 0
                i.participant = '---'
                info.append(i)
        prev_math_serial_number = m.serial_number

    MatchParticipantInfo.objects.bulk_update(info, ["participant_score", "participant"])
    

def sort_participant_by_score(match_results: dict, reverse=True):
    return sorted(match_results.keys(), key=lambda x:match_results.get(x).get("score"), reverse=reverse)

def get_last_top_round(round_cnt: int) -> int:
    print('round_cnt', round_cnt)
    round_table = {5: 4, 8: 6, 11: 8, 14: 10, 17: 12, 20: 14, 23: 16}
    return round_table[round_cnt]

def get_next_math_serial_number(serial_number: int, p_i_m: int, advances_to_next: int) -> int:
    flag = 1 if (serial_number % (p_i_m // advances_to_next)) > 0 else 0
    next_serial_number = serial_number // (p_i_m // advances_to_next) + flag
    return next_serial_number

def is_special_low_bracket_round(current_round: int, round_cnt: int) -> bool:
    return (current_round - 3) % 4 == 0 and current_round >= 3 and round_cnt - 1 != current_round

def is_special_top_bracket_round(current_round: int, round_cnt: int) -> bool:
    return (current_round - 2) % 4 == 0 and current_round >= 2
    
def is_narrowing_round(current_round: int, round_cnt: int) -> bool:
    return (current_round - 5) % 4 == 0 and current_round >= 5

def reflect_number(number, base=4) -> int:
    return base - number + 1

def get_low_bracket_math_serial_number_for_high(current_round: int, round_count: int, serial_number: int, p_i_m: int, advances_to_next: int) -> int:
    if current_round == 0:
        return serial_number // (p_i_m // advances_to_next) + serial_number % (p_i_m // advances_to_next)
    elif current_round == round_count - 3:
        return 1
    
    return serial_number

def get_low_bracket_math_serial_number(current_round: int, round_count: int, serial_number: int, p_i_m: int) -> int:
    if (current_round - 3) % 4 == 0 and current_round >= 3:
        return math.ceil(serial_number / 2)
    return serial_number

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

    match.start_time = data.get("start_time")

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
                next_serial_number = get_next_math_serial_number(cur_serial_number, bracket.participant_in_match, advances_to_next)
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
            next_matches.update(state_id=1)

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
            cur_serial_number = get_next_math_serial_number(match.serial_number, bracket.participant_in_match, advances_to_next)
            for round_number in range(match_cur_round_number+2, round_cnt):
                next_serial_number = get_next_math_serial_number(cur_serial_number, bracket.participant_in_match, advances_to_next)
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
            next_matches.update(state_id=1)

        # обновляем результаты текущего матча
        update_match_participant_info(match_results, match.info.all())
        if match_cur_round_number+1 != round_cnt:
            # обновляем результаты следующего матча
            sorted_participant_ids = sort_participant_by_score(match_results)
            next_match = Match.objects.prefetch_related(
                Prefetch('info', queryset=MatchParticipantInfo.objects.all().order_by('-id'))
            ).get(serial_number=get_next_math_serial_number(match.serial_number, bracket.participant_in_match, advances_to_next), 
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
            ).get(serial_number=get_next_math_serial_number(match.serial_number, bracket.participant_in_match, advances_to_next), 
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


def update_rr_bracket(data):
    print('data', data)
    match = (
        Match.objects.prefetch_related("info").get(id=data.get("match_id"))
    )
    print('match id', match.id)
    match_prev_state = match.state.name
    cur_match_state = data.get("state")
    match_results = data.get("match_results")

    print('match.state', match.state)
    print(match_prev_state, cur_match_state, match.state.id)

    # S
    if cur_match_state == "SCHEDULED":
        match.state_id=1
    # P
    else:
        match.state_id=2
    match.save()
    update_match_participant_info(match_results, match.info.all())
    
    
def update_de_bracket(data):
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
    advances_to_next = bracket.participant_in_match // 2

    print('match.state', match.state)
    print(match_prev_state, cur_match_state, match.state.id)
    match_cur_round_number = match.round.serial_number
    # Main bracket
    if match_cur_round_number % 2 == 0:
        # P -> S
        if match_prev_state == "PLAYED" and cur_match_state == "SCHEDULED":
            print('P -> S')
        
            round_cnt = bracket.rounds.count()
            order_by_param = '-id'

            if match_cur_round_number+2 == get_last_top_round(round_cnt):
                order_by_param = 'id'

            if match_cur_round_number+2 != round_cnt:
                # match_cnt = Match.objects.filter(round__bracket=bracket, round__serial_number=match.round.serial_number).count()
                # обновляем результаты следующего матча верхней сетки
                next_matches_predicates = [Q()]
                cur_serial_number = match.serial_number
                for round_number in range(match_cur_round_number+2, round_cnt, 2):
                    next_serial_number = get_next_math_serial_number(cur_serial_number, bracket.participant_in_match, advances_to_next)
                    next_matches_predicates.append(Q(Q(round__serial_number=round_number) & Q(serial_number=next_serial_number)))
                    cur_serial_number = next_serial_number

                next_matches = Match.objects.prefetch_related(
                    Prefetch('info', queryset=MatchParticipantInfo.objects.all().order_by(order_by_param))
                ).filter(reduce(operator.or_, next_matches_predicates), round__bracket=bracket)
                
                match_participant_info_l = ((match.serial_number-1)*advances_to_next) % (bracket.participant_in_match)
                match_participant_info_r = match_participant_info_l + advances_to_next

                reset_match_participant_info(next_matches, match_participant_info_l, match_participant_info_r)
                next_matches.update(state_id=1)

                # обновляем результаты следующего матча нижней сетки
                next_matches_predicates = [Q()]
                cur_serial_number = match.serial_number
                print('low bracket manupilation')

                low_bracket_round_serial_number = match_cur_round_number + 1

                # Первый раунд нижней сетки
                if low_bracket_round_serial_number == 1:
                    print('first low round')
                    first_low_bracket_matches = Match.objects.prefetch_related(
                        Prefetch('info', queryset=MatchParticipantInfo.objects.all().order_by('-id'))
                    ).filter(
                        round__serial_number=1,
                        serial_number=get_low_bracket_math_serial_number_for_high(match_cur_round_number, round_cnt, match.serial_number, bracket.participant_in_match, advances_to_next),
                        round__bracket=bracket
                    )
                    match_participant_info_l = ((match.serial_number-1)*advances_to_next) % (bracket.participant_in_match)
                    match_participant_info_r = match_participant_info_l + advances_to_next
                    reset_match_participant_info(first_low_bracket_matches, match_participant_info_l, match_participant_info_r)
                    first_low_bracket_matches.update(state_id=1)

                # следующий за раундом верхней сетки нижний раунд
                elif not is_narrowing_round(low_bracket_round_serial_number, round_cnt):
                    next_match = Match.objects.prefetch_related(
                        Prefetch('info', queryset=MatchParticipantInfo.objects.all().order_by('-id'))
                    ).filter(serial_number=get_low_bracket_math_serial_number_for_high(match_cur_round_number, round_cnt, cur_serial_number, bracket.participant_in_match, advances_to_next),
                        round__bracket=bracket, round__serial_number=low_bracket_round_serial_number
                    )
                    match_participant_info_l = 0
                    match_participant_info_r = match_participant_info_l + advances_to_next
                    reset_match_participant_info(next_match, match_participant_info_l, match_participant_info_r)
                    next_match.update(state_id=1)

                # последний раунд нижней сетки
                last_match = Match.objects.prefetch_related(
                        Prefetch('info', queryset=MatchParticipantInfo.objects.all().order_by('-id'))
                    ).filter(serial_number=1,
                        round__bracket=bracket, round__serial_number=round_cnt-1
                    )
                print('next_match', last_match) 
                match_participant_info_l = 0
                match_participant_info_r = match_participant_info_l + advances_to_next
                reset_match_participant_info(last_match, match_participant_info_l, match_participant_info_r)
                last_match.update(state_id=1)

                #  остальные раунды
                if round_cnt != low_bracket_round_serial_number + 1 and low_bracket_round_serial_number + 1 != get_last_top_round(round_cnt):
                    print('cicle', low_bracket_round_serial_number)
                    next_matches_predicates = [Q()] 
                    is_round_special = []
                    low_serial_number = get_low_bracket_math_serial_number_for_high(match_cur_round_number, round_cnt, cur_serial_number, bracket.participant_in_match, advances_to_next)
                    cur_serial_number = get_low_bracket_math_serial_number(low_bracket_round_serial_number, round_cnt, low_serial_number, bracket.participant_in_match)
                    
                    # if not is_special_top_bracket_round(low_bracket_round_serial_number-1, round_cnt):
                    #     print('!!cur_serial_number', cur_serial_number)
                    #     cur_serial_number = reflect_number(cur_serial_number, match_cnt)
                    #     print('!!cur_serial_number', cur_serial_number)

                    print('cur_serial_number', cur_serial_number)
                    for round_number in range(low_bracket_round_serial_number+2, round_cnt, 2):
                        next_matches_predicates.append(Q(Q(round__serial_number=round_number) & Q(serial_number=cur_serial_number)))
                        is_round_special.append(is_narrowing_round(round_number, round_cnt))
                        cur_serial_number = get_low_bracket_math_serial_number(round_number, round_cnt, cur_serial_number, bracket.participant_in_match)
                        # if not is_special_top_bracket_round(round_number-1, round_cnt):
                        #     print('!!!round_number', round_number)
                        #     cur_serial_number = reflect_number(cur_serial_number, match_cnt)
                    
                    next_matches = Match.objects.prefetch_related(
                        Prefetch('info', queryset=MatchParticipantInfo.objects.all().order_by('-id'))
                    ).filter(reduce(operator.or_, next_matches_predicates), round__bracket=bracket).order_by('-id')
                    print('next_matches', next_matches)
                    reset_match_participant_info_for_low_bracket_from_hight(next_matches, bracket.participant_in_match, advances_to_next, is_round_special, match.serial_number, round_cnt, low_bracket_round_serial_number)
                    next_matches.update(state_id=1)

                next_match = Match.objects.prefetch_related(
                        Prefetch('info', queryset=MatchParticipantInfo.objects.all().order_by('-id'))
                    ).filter(serial_number=1, round__bracket=bracket, round__serial_number=get_last_top_round(round_cnt))

                match_participant_info_l = 0
                match_participant_info_r = match_participant_info_l + advances_to_next
                reset_match_participant_info(next_match, match_participant_info_l, match_participant_info_r)
                next_match.update(state_id=1)
               
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
            order_by_param = '-id'

            if match_cur_round_number+2 == get_last_top_round(round_cnt):
                order_by_param = 'id'

            if not check_results(match_prev_res, list(map(int, match_cur_res))) and match_cur_round_number+2 != round_cnt:
                # обновляем результаты следующего матча верхней сетки
                next_matches_predicates = [Q()]
                cur_serial_number = match.serial_number
                for round_number in range(match_cur_round_number+2, round_cnt, 2):
                    next_serial_number = get_next_math_serial_number(cur_serial_number, bracket.participant_in_match, advances_to_next)
                    next_matches_predicates.append(Q(Q(round__serial_number=round_number) & Q(serial_number=next_serial_number)))
                    cur_serial_number = next_serial_number

                next_matches = Match.objects.prefetch_related(
                    Prefetch('info', queryset=MatchParticipantInfo.objects.all().order_by(order_by_param))
                ).filter(reduce(operator.or_, next_matches_predicates), round__bracket=bracket)

                match_participant_info_l = ((match.serial_number-1)*advances_to_next) % (bracket.participant_in_match)
                match_participant_info_r = match_participant_info_l + advances_to_next

                reset_match_participant_info(next_matches, match_participant_info_l, match_participant_info_r)
                next_matches.update(state_id=1)

                # обновляем результаты следующего матча нижней сетки
                next_matches_predicates = [Q()]
                cur_serial_number = match.serial_number
                print('low bracket manupilation')

                low_bracket_round_serial_number = match_cur_round_number + 1

                # Первый раунд нижней сетки
                if low_bracket_round_serial_number == 1:
                    print('first low round')
                    first_low_bracket_matches = Match.objects.prefetch_related(
                        Prefetch('info', queryset=MatchParticipantInfo.objects.all().order_by('-id'))
                    ).filter(
                        round__serial_number=1,
                        serial_number=get_low_bracket_math_serial_number_for_high(match_cur_round_number, round_cnt, match.serial_number, bracket.participant_in_match, advances_to_next),
                        round__bracket=bracket
                    )
                    match_participant_info_l = ((match.serial_number-1)*advances_to_next) % (bracket.participant_in_match)
                    match_participant_info_r = match_participant_info_l + advances_to_next
                    reset_match_participant_info(first_low_bracket_matches, match_participant_info_l, match_participant_info_r)
                    first_low_bracket_matches.update(state_id=1)

                # следующий за раундом верхней сетки нижний раунд
                elif not is_narrowing_round(low_bracket_round_serial_number, round_cnt):
                    next_match = Match.objects.prefetch_related(
                        Prefetch('info', queryset=MatchParticipantInfo.objects.all().order_by('-id'))
                    ).filter(serial_number=get_low_bracket_math_serial_number_for_high(match_cur_round_number, round_cnt, cur_serial_number, bracket.participant_in_match, advances_to_next),
                        round__bracket=bracket, round__serial_number=low_bracket_round_serial_number
                    )
                    match_participant_info_l = 0
                    match_participant_info_r = match_participant_info_l + advances_to_next
                    reset_match_participant_info(next_match, match_participant_info_l, match_participant_info_r)
                    next_match.update(state_id=1)

                # последний раунд нижней сетки
                # if low_bracket_round_serial_number + 1 != get_last_top_round(round_cnt):
                last_match = Match.objects.prefetch_related(
                        Prefetch('info', queryset=MatchParticipantInfo.objects.all().order_by('-id'))
                    ).filter(serial_number=1,
                        round__bracket=bracket, round__serial_number=round_cnt-1
                    )
                print('next_match', last_match) 
                match_participant_info_l = 0
                match_participant_info_r = match_participant_info_l + advances_to_next
                reset_match_participant_info(last_match, match_participant_info_l, match_participant_info_r)
                last_match.update(state_id=1)

                #  остальные раунды
                if round_cnt != low_bracket_round_serial_number + 1 and match_cur_round_number + 2 != get_last_top_round(round_cnt):
                    print('cicle', low_bracket_round_serial_number)
                    next_matches_predicates = [Q()] 
                    is_round_special = []
                    low_serial_number = get_low_bracket_math_serial_number_for_high(match_cur_round_number, round_cnt, cur_serial_number, bracket.participant_in_match, advances_to_next)
                    cur_serial_number = get_low_bracket_math_serial_number(low_bracket_round_serial_number, round_cnt, low_serial_number, bracket.participant_in_match)
                
                    print('cur_serial_number', cur_serial_number)
                    for round_number in range(low_bracket_round_serial_number+2, round_cnt, 2):
                        next_matches_predicates.append(Q(Q(round__serial_number=round_number) & Q(serial_number=cur_serial_number)))
                        is_round_special.append(is_narrowing_round(round_number, round_cnt))
                        next_serial_number = get_low_bracket_math_serial_number(round_number, round_cnt, cur_serial_number, bracket.participant_in_match)
                        cur_serial_number = next_serial_number
                    
                    next_matches = Match.objects.prefetch_related(
                        Prefetch('info', queryset=MatchParticipantInfo.objects.all().order_by('-id'))
                    ).filter(reduce(operator.or_, next_matches_predicates), round__bracket=bracket).order_by('-id')
                    print('next_matches', next_matches)
                    reset_match_participant_info_for_low_bracket_from_hight(next_matches, bracket.participant_in_match, advances_to_next, is_round_special, match.serial_number, round_cnt, low_bracket_round_serial_number)
                    next_matches.update(state_id=1)

                next_match = Match.objects.prefetch_related(
                        Prefetch('info', queryset=MatchParticipantInfo.objects.all().order_by('-id'))
                    ).filter(serial_number=1, round__bracket=bracket, round__serial_number=get_last_top_round(round_cnt))

                match_participant_info_l = 0
                match_participant_info_r = match_participant_info_l + advances_to_next
                reset_match_participant_info(next_match, match_participant_info_l, match_participant_info_r)
                next_match.update(state_id=1)

            # обновляем результаты текущего матча
            update_match_participant_info(match_results, match.info.all())
            if match_cur_round_number+2 != round_cnt:
                # обновляем результаты следующего матча верхней сетки
                sorted_participant_ids = sort_participant_by_score(match_results)

                next_match = Match.objects.prefetch_related(
                    Prefetch('info', queryset=MatchParticipantInfo.objects.all().order_by(order_by_param))
                ).get(serial_number=get_next_math_serial_number(match.serial_number, bracket.participant_in_match, advances_to_next), 
                                            round__bracket=bracket, round__serial_number=match.round.serial_number+2)

                match_participant_info_l = ((match.serial_number-1)*advances_to_next) % (bracket.participant_in_match)
                match_participant_info_r = match_participant_info_l + advances_to_next

                next_match_info_ids = [f"{id}" for id in next_match.info.values_list('id', flat=True)]

                next_match_results = dict(
                    zip(
                        next_match_info_ids[match_participant_info_l:match_participant_info_r][::-1], 
                        [{
                            'participant': match_results.get(sorted_participant_ids[i]).get('participant'),
                            'score': 0
                        } for i in range(advances_to_next)]
                    )
                )

                update_match_participant_info(next_match_results, next_match.info.all())

                # обновляем результаты следующего матча нижней сетки
                sorted_participant_ids = sort_participant_by_score(match_results, False)

                next_match = Match.objects.prefetch_related(
                    Prefetch('info', queryset=MatchParticipantInfo.objects.all().order_by('-id'))
                ).get(
                    serial_number=get_low_bracket_math_serial_number_for_high(match_cur_round_number, round_cnt, match.serial_number, bracket.participant_in_match, advances_to_next), 
                    round__bracket=bracket,
                    # check for prelast match in top bracket
                    round__serial_number=match.round.serial_number + (1 if match_cur_round_number != round_cnt - 4 else 3)
                )
 
                match_participant_info_l = 0
                match_participant_info_r = match_participant_info_l + advances_to_next

                next_match_info_ids = [f"{id}" for id in next_match.info.values_list('id', flat=True)]

                next_match_results = dict(
                    zip(
                        next_match_info_ids[match_participant_info_l:match_participant_info_r][::-1], 
                        [{
                            'participant': match_results.get(sorted_participant_ids[i]).get('participant'),
                            'score': 0
                        } for i in range(advances_to_next)]
                    )
                )

                update_match_participant_info(next_match_results, next_match.info.all())

            match.state_id=2
            match.save()
        # S -> P
        elif match_prev_state == "SCHEDULED" and cur_match_state == "PLAYED":
            # обновляем результаты текущего матча
            update_match_participant_info(match_results, match.info.all())

            round_cnt = bracket.rounds.count()
            match_cnt = Match.objects.filter(round__bracket=bracket, round__serial_number=match.round.serial_number).count()
            match_cur_round_number = match.round.serial_number

            order_by_param = '-id'

            print('match_cur_round_number', match_cur_round_number)
            print('get_last_top_round(round_cnt)', get_last_top_round(round_cnt))

            if match_cur_round_number+2 == get_last_top_round(round_cnt):
                order_by_param = 'id'

            if match_cur_round_number+2 != round_cnt:
                # обновляем результаты следующего матча верхней сетки
                sorted_participant_ids = sort_participant_by_score(match_results)
                print('match serial number', get_next_math_serial_number(match.serial_number, bracket.participant_in_match, advances_to_next))
                print('match.round.serial_number', match.round.serial_number)
                next_match = Match.objects.prefetch_related(
                    Prefetch('info', queryset=MatchParticipantInfo.objects.all().order_by(order_by_param))
                ).get(serial_number=get_next_math_serial_number(match.serial_number, bracket.participant_in_match, advances_to_next), 
                                            round__bracket=bracket, round__serial_number=match.round.serial_number+2)
                print('next_match', next_match)
                match_participant_info_l = ((match.serial_number-1)*advances_to_next) % (bracket.participant_in_match)
                match_participant_info_r = match_participant_info_l + advances_to_next

                next_match_info_ids = [f"{id}" for id in next_match.info.values_list('id', flat=True)]

                next_match_results = dict(
                    zip(
                        next_match_info_ids[match_participant_info_l:match_participant_info_r][::-1], 
                        [{
                            'participant': match_results.get(sorted_participant_ids[i]).get('participant'),
                            'score': 0
                        } for i in range(advances_to_next)]
                    )
                )

                update_match_participant_info(next_match_results, next_match.info.all())

                # обновляем результаты следующего матча нижней сетки
                sorted_participant_ids = sort_participant_by_score(match_results, False)
                print('low bracket')
                next_match_serial_number = get_low_bracket_math_serial_number_for_high(match_cur_round_number, round_cnt, match.serial_number, bracket.participant_in_match, advances_to_next)

                # if is_special_top_bracket_round(match_cur_round_number, round_cnt):
                #     next_match_serial_number = reflect_number(next_match_serial_number, match_cnt)
                
                next_match = Match.objects.prefetch_related(
                    Prefetch('info', queryset=MatchParticipantInfo.objects.all().order_by('-id'))
                ).get(
                    serial_number=next_match_serial_number, 
                    round__bracket=bracket,
                    # check for prelast match in top bracket
                    round__serial_number=match.round.serial_number + (1 if match_cur_round_number != round_cnt - 4 else 3)
                )
                
                if match_cur_round_number == 0:
                    match_participant_info_l = ((match.serial_number-1)*advances_to_next) % (bracket.participant_in_match)
                else:
                    match_participant_info_l = 0
                match_participant_info_r = match_participant_info_l + advances_to_next

                next_match_info_ids = [f"{id}" for id in next_match.info.values_list('id', flat=True)]

                next_match_results = dict(
                    zip(
                        next_match_info_ids[match_participant_info_l:match_participant_info_r][::-1], 
                        [{
                            'participant': match_results.get(sorted_participant_ids[i]).get('participant'),
                            'score': 0
                        } for i in range(advances_to_next)]
                    )
                )

                update_match_participant_info(next_match_results, next_match.info.all())

            match.state_id=2
            match.save()
        # S -> S
        else:
            match.state_id=1
            match.save()
        # elif match_prev_state == "SCHEDULED" and cur_match_state == "SCHEDULED":
            update_match_participant_info(match_results, match.info.all())
    else:
        # P -> S
        if match_prev_state == "PLAYED" and cur_match_state == "SCHEDULED":
            print('P -> S')
            round_cnt = bracket.rounds.count()
            match_cur_round_number = match.round.serial_number

            if round_cnt != match_cur_round_number + 1:
                next_matches_predicates = [Q()]
                is_round_special = []
                cur_serial_number = get_low_bracket_math_serial_number(match_cur_round_number, round_cnt, match.serial_number, bracket.participant_in_match)
                for round_number in range(match_cur_round_number+2, round_cnt, 2):
                    next_matches_predicates.append(Q(Q(round__serial_number=round_number) & Q(serial_number=cur_serial_number)))
                    is_round_special.append(is_narrowing_round(round_number, round_cnt))
                    next_serial_number = get_low_bracket_math_serial_number(round_number, round_cnt, cur_serial_number, bracket.participant_in_match)
                    cur_serial_number = next_serial_number
                
                next_matches = Match.objects.prefetch_related(
                    Prefetch('info', queryset=MatchParticipantInfo.objects.all().order_by('-id'))
                ).filter(reduce(operator.or_, next_matches_predicates), round__bracket=bracket).order_by('-id')
                reset_match_participant_info_for_low_bracket(next_matches, bracket.participant_in_match, advances_to_next, is_round_special, match.serial_number)
                next_matches.update(state_id=1)

            next_match = Match.objects.prefetch_related(
                    Prefetch('info', queryset=MatchParticipantInfo.objects.all().order_by('-id'))
                ).filter(serial_number=1, round__bracket=bracket, round__serial_number=get_last_top_round(round_cnt))

            match_participant_info_l = 0
            match_participant_info_r = match_participant_info_l + advances_to_next
            reset_match_participant_info(next_match, match_participant_info_l, match_participant_info_r)
            next_match.update(state_id=1)

            # обновляем результаты текущего матча
            update_match_participant_info(match_results, match.info.all())
            match.state_id=1
            match.save()

        # P -> P
        elif match_prev_state == "PLAYED" and cur_match_state == "PLAYED":
            print('P -> P')
            match_prev_res = match.info.order_by('-participant_score').values_list('id', flat=True)
            match_cur_res = sort_participant_by_score(match_results)

            round_cnt = bracket.rounds.count()
            match_cur_round_number = match.round.serial_number

            if not check_results(match_prev_res, list(map(int, match_cur_res))):
                if round_cnt != match_cur_round_number + 1:
                    next_matches_predicates = [Q()]
                    is_round_special = []
                    cur_serial_number = get_low_bracket_math_serial_number(match_cur_round_number, round_cnt, match.serial_number, bracket.participant_in_match)
                    for round_number in range(match_cur_round_number+2, round_cnt, 2):
                        next_matches_predicates.append(Q(Q(round__serial_number=round_number) & Q(serial_number=cur_serial_number)))
                        is_round_special.append(is_narrowing_round(round_number, round_cnt))
                        next_serial_number = get_low_bracket_math_serial_number(round_number, round_cnt, cur_serial_number, bracket.participant_in_match)
                        cur_serial_number = next_serial_number
                    
                    next_matches = Match.objects.prefetch_related(
                        Prefetch('info', queryset=MatchParticipantInfo.objects.all().order_by('-id'))
                    ).filter(reduce(operator.or_, next_matches_predicates), round__bracket=bracket).order_by('-id')
                    reset_match_participant_info_for_low_bracket(next_matches, bracket.participant_in_match, advances_to_next, is_round_special, match.serial_number)
                    next_matches.update(state_id=1)

                next_match = Match.objects.prefetch_related(
                        Prefetch('info', queryset=MatchParticipantInfo.objects.all().order_by('-id'))
                    ).filter(serial_number=1, round__bracket=bracket, round__serial_number=get_last_top_round(round_cnt))

                match_participant_info_l = 0
                match_participant_info_r = match_participant_info_l + advances_to_next
                reset_match_participant_info(next_match, match_participant_info_l, match_participant_info_r)
                next_match.update(state_id=1)

            # обновляем результаты текущего матча
            update_match_participant_info(match_results, match.info.all())
            if match_cur_round_number+1 == round_cnt or (match_cur_round_number+2==round_cnt and round_cnt==5):
                sorted_participant_ids = sort_participant_by_score(match_results)
                next_match = Match.objects.prefetch_related(
                    Prefetch('info', queryset=MatchParticipantInfo.objects.all().order_by('-id'))
                ).get(serial_number=1, round__bracket=bracket, round__serial_number=get_last_top_round(round_cnt))
                print('next_match', next_match)

                match_participant_info_l = 0
                match_participant_info_r = match_participant_info_l + advances_to_next

                next_match_info_ids = [f"{id}" for id in next_match.info.values_list('id', flat=True)]

                next_match_results = dict(
                    zip(
                        next_match_info_ids[match_participant_info_l:match_participant_info_r][::-1], 
                        [{
                            'participant': match_results.get(sorted_participant_ids[i]).get('participant'),
                            'score': 0
                        } for i in range(advances_to_next)]
                    )
                )

                update_match_participant_info(next_match_results, next_match.info.all())
            elif match_cur_round_number+1 != round_cnt:
                print('here')
                # обновляем результаты следующего матча
                sorted_participant_ids = sort_participant_by_score(match_results)
                print('match number', get_low_bracket_math_serial_number(match_cur_round_number, round_cnt, match.serial_number, bracket.participant_in_match))
                next_match = Match.objects.prefetch_related(
                    Prefetch('info', queryset=MatchParticipantInfo.objects.all().order_by('-id'))
                ).get(serial_number=get_low_bracket_math_serial_number(match_cur_round_number, round_cnt, match.serial_number, bracket.participant_in_match), 
                                            round__bracket=bracket, round__serial_number=match.round.serial_number+2)
                
                if is_special_low_bracket_round(match_cur_round_number, round_cnt):
                    match_participant_info_l = ((match.serial_number-1)*advances_to_next) % (bracket.participant_in_match)
                else:
                    match_participant_info_l = advances_to_next
                match_participant_info_r = match_participant_info_l + advances_to_next

                next_match_info_ids = [f"{id}" for id in next_match.info.values_list('id', flat=True)]

                next_match_results = dict(
                    zip(
                        next_match_info_ids[match_participant_info_l:match_participant_info_r][::-1], 
                        [{
                            'participant': match_results.get(sorted_participant_ids[i]).get('participant'),
                            'score': 0
                        } for i in range(advances_to_next)]
                    )
                )
                update_match_participant_info(next_match_results, next_match.info.all())

            match.state_id=2
            match.save()
        # S -> P
        elif match_prev_state == "SCHEDULED" and cur_match_state == "PLAYED":
            # обновляем результаты текущего матча
            update_match_participant_info(match_results, match.info.all())
            round_cnt = bracket.rounds.count()
            match_cur_round_number = match.round.serial_number
            print('match_cur_round_number', match_cur_round_number)
            if match_cur_round_number+1 == round_cnt or (match_cur_round_number+2==round_cnt and round_cnt==5):
                sorted_participant_ids = sort_participant_by_score(match_results)
                next_match = Match.objects.prefetch_related(
                    Prefetch('info', queryset=MatchParticipantInfo.objects.all().order_by('-id'))
                ).get(serial_number=1, round__bracket=bracket, round__serial_number=get_last_top_round(round_cnt))
                print('next_match', next_match)

                match_participant_info_l = 0
                match_participant_info_r = match_participant_info_l + advances_to_next

                next_match_info_ids = [f"{id}" for id in next_match.info.values_list('id', flat=True)]

                next_match_results = dict(
                    zip(
                        next_match_info_ids[match_participant_info_l:match_participant_info_r][::-1], 
                        [{
                            'participant': match_results.get(sorted_participant_ids[i]).get('participant'),
                            'score': 0
                        } for i in range(advances_to_next)]
                    )
                )

                update_match_participant_info(next_match_results, next_match.info.all())
            elif match_cur_round_number+1 != round_cnt:
                print('here')
                # обновляем результаты следующего матча
                sorted_participant_ids = sort_participant_by_score(match_results)
                print('match number', get_low_bracket_math_serial_number(match_cur_round_number, round_cnt, match.serial_number, bracket.participant_in_match))
                next_match = Match.objects.prefetch_related(
                    Prefetch('info', queryset=MatchParticipantInfo.objects.all().order_by('-id'))
                ).get(serial_number=get_low_bracket_math_serial_number(match_cur_round_number, round_cnt, match.serial_number, bracket.participant_in_match), 
                                            round__bracket=bracket, round__serial_number=match.round.serial_number+2)
                
                if is_special_low_bracket_round(match_cur_round_number, round_cnt):
                    match_participant_info_l = ((match.serial_number-1)*advances_to_next) % (bracket.participant_in_match)
                else:
                    match_participant_info_l = advances_to_next
                match_participant_info_r = match_participant_info_l + advances_to_next

                next_match_info_ids = [f"{id}" for id in next_match.info.values_list('id', flat=True)]

                next_match_results = dict(
                    zip(
                        next_match_info_ids[match_participant_info_l:match_participant_info_r][::-1], 
                        [{
                            'participant': match_results.get(sorted_participant_ids[i]).get('participant'),
                            'score': 0
                        } for i in range(advances_to_next)]
                    )
                )

                update_match_participant_info(next_match_results, next_match.info.all())
            # последний матч нижней сетки
            

            match.state_id=2
            match.save()

        # S -> S
        else:
            match.state_id=1
            match.save()
            update_match_participant_info(match_results, match.info.all())


def check_for_draw(match_results: dict) -> bool:
    results = list(match_results.values())
    print('results', results)
    max_scoore = results[0].get("score")
    for result in results:
        if result.get("score") != max_scoore:
            return False
    return True


def set_match_participant_results(match_results: dict, info: MatchParticipantInfo) -> None:
    print('match_results', match_results)
    print('sort_participant_by_score', sort_participant_by_score(match_results))
    if check_for_draw(match_results):
        for result in match_results.values():
            result['participant_result'] = 4
        print('match_results', match_results)
    else:
        winner_match_info_id = sort_participant_by_score(match_results)[0]
        for key in match_results.keys():
            if key == winner_match_info_id:
                match_results.get(key)['participant_result'] = 2
            else:
                match_results.get(key)['participant_result'] = 3
        print('match_results w - l', match_results)

    update_match_participant_info(match_results, info)



def update_sw_bracket(data):
    print('data', data)
    bracket = Bracket.objects.prefetch_related("sw_settings").get(id=data.get("bracket_id"))
    match = (
        Match.objects.select_related("round")
        .prefetch_related("info")
        .get(id=data.get("match_id"))
    )
    print('match id', match.id)
    match_prev_state = match.state.name
    cur_match_state = data.get("state")
    match_results = data.get("match_results")
    settings = bracket.sw_settings.first()

    print('match.state', match.state)
    print(match_prev_state, cur_match_state, match.state.id)
    set_match_participant_results(match_results, match.info.all())
    # S
    if cur_match_state == "SCHEDULED":
        match.state_id=1
    # P
    else:
        match.state_id=2
    match.save()
    # update_match_participant_info(match_results, match.info.all())

    # max_value = MatchParticipantInfo.objects.filter(match_id=OuterRef("match_id")).annotate(max_participant_score=Max('participant_score')).order_by('-max_participant_score').values('max_participant_score')

    # print(MatchParticipantInfo.objects.annotate(max_participant_score=Max('participant_score')).filter(match_id=1216, participant_score=Subquery(max_value)).values('participant_score'))
    # print(MatchParticipantInfo.objects.annotate(max_participant_score=Max('participant_score')).filter(match_id=1216, participant_score=F('max_participant_score')).values('participant_score').query)

    # winner = MatchParticipantInfo.objects.filter(
    #         participant_score=Subquery(max_value),
    #         match=OuterRef("pk"),
    #     ).annotate( 
    #         winner_count=Count('participant_score')
    #     ).values('participant')

    # print(Match.objects.filter(Q(round__bracket=bracket), state_id=2).annotate(winner=Subquery(winner)).values_list('winner', flat=True))
    # print(Match.objects.filter(Q(round__bracket=bracket), state_id=2).annotate(winner=Subquery(winner)).query)
    
    bracket_result = MatchParticipantInfo.objects.filter(Q(match__round__bracket=bracket), ~Q(participant='TBO')).values('participant').annotate(
                win=Count('participant_result', filter=Q(participant_result__id=2)),
                loss=Count('participant_result', filter=Q(participant_result__id=3)),
                draw=Count('participant_result', filter=Q(participant_result__id=4)),
                play_with=JsonGroupArray('participant', distinct=True),
                total = F('win')*settings.points_per_victory + F('loss')*settings.points_per_loss + F('draw')*settings.points_per_draw
            )
    
    print('bracket_result', bracket_result)

    # Все матчи в раунде сыграны
    if not Match.objects.filter(round__bracket=bracket, round=match.round, state_id=1).exists():
        bracket_result = sorted(bracket_result, key=lambda x:x.get("total"), reverse=True)
    
        print('bracket_result', bracket_result)

        next_round = [{'participant': p.get('participant'), 'score': 0} for p in bracket_result]

        print('next_round', next_round)
        round_cnt = bracket.rounds.count()
        next_round_serial_number = match.round.serial_number + 1
        if next_round_serial_number != round_cnt:
            next_matches = Match.objects.prefetch_related(
                Prefetch('info', queryset=MatchParticipantInfo.objects.all().order_by('id'))
                ).filter(round__bracket=bracket, round__serial_number=next_round_serial_number)
            for index, match in enumerate(next_matches):
                set_match_participant_info(
                    next_round[index*bracket.participant_in_match:index*bracket.participant_in_match+bracket.participant_in_match], 
                    match.info.all()
                )

            # MatchParticipantInfo.objects.filter(match__round__bracket=bracket).values('participant').annotate(
            #     Count('participant_result', filter=Q(participant_result__id=2))
            # )
        
        # for m in range(math.ceil(participants_cnt / p_in_m)):
        #     match = Match(
        #         round=_round, serial_number=match_serial_number_cnt, state_id=1
        #     )
        #     unsaved_matches.append(match)
        #     if i == 0:
        #         for p in range(p_in_m):
        #             print("m*p_in_m+p", m * p_in_m + p)
        #             matches_info.append(
        #                 MatchParticipantInfo(
        #                     match=match,
        #                     participant_score=0,
        #                     participant=participants[m * p_in_m + p],
        #                 )
        #             )
        #     else:
        #         for _ in range(p_in_m):
        #             matches_info.append(
        #                 MatchParticipantInfo(
        #                     match=match, participant_score=0, participant="TBO"
        #                 )
        #             )

    

def update_bracket(*, data: dict, bracket: Bracket) -> Bracket:
    print('find bracket')

    if bracket.bracket_type.name == "SE":
        update_se_bracket(data)
    elif bracket.bracket_type.name == 'DE':
        update_de_bracket(data)
    elif bracket.bracket_type.name == "RR":
        update_rr_bracket(data)
    elif bracket.bracket_type.name == 'SW':
        update_sw_bracket(data)

    return bracket
