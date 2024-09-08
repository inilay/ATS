from django.db import models
from django.urls import reverse

from django.utils.translation import gettext_lazy as _
from profiles.models import Profile
import random
import json


# class Tournament(models.Model):
#     title = models.CharField(max_length=255)
#     content = models.TextField()
#     slug = models.SlugField(max_length=255, unique=True)
#     participants = models.TextField()
#     poster = models.ImageField(upload_to='photos/media/%Y/%m/%d/', blank=True)
#     game = models.CharField(max_length=255)
#     prize = models.FloatField()
#     created_at = models.DateTimeField(auto_now_add=True)
#     owner = models.ForeignKey(Profile, related_name='tournaments', on_delete=models.CASCADE)
#     start_time = models.DateTimeField()
    
#     def save(self, *args, **kwargs):
#         self.slug = slugify(self.title)
#         # if not self.poster:
#         #     self.poster = f'tournament_def_{random.randint(1, 13)}.png'
#         super().save(*args, **kwargs)

#     def __str__(self):
#         return self.title
    
#     def get_absolute_url(self):
#         return reverse('tournament', kwargs={'slug': self.slug})


# class Bracket(models.Model):

#     tournament = models.ForeignKey('Tournament', related_name='brackets', on_delete=models.CASCADE, null=True)
#     bracket = models.JSONField(blank=True)
#     final = models.BooleanField(default=True)
#     participants_from_group = models.IntegerField(default=0)
    
#     class BracketType(models.TextChoices):
#         SINGLEELIMINATION = 'SE', _('Single elimination')
#         DOUBLEELIMINATION = 'DE', _('Double elimination')
#         ROUNDROBIN = 'RR', _('Round robin')
#         SWISS = 'SW', _('Swiss')

#     type = models.CharField(
#         max_length=255,
#         choices=BracketType.choices,
#         default=BracketType.SINGLEELIMINATION,
#     )

#     def __str__(self):
#         return self.type


class Tournament(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField(null=True)
    link = models.SlugField(max_length=255, unique=True)
    poster = models.ImageField(upload_to='photos/media/%Y/%m/%d/', blank=True)
    game = models.CharField(max_length=255)
    prize = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    start_time = models.DateTimeField()
    owner = models.ForeignKey(Profile, related_name='tournaments', on_delete=models.CASCADE)
    admins = models.ManyToManyField(Profile, related_name='administrated_tournaments')


class Bracket(models.Model):
    tournament = models.ForeignKey('Tournament', related_name='brackets', on_delete=models.CASCADE)
    bracket_type = models.ForeignKey('BracketType', related_name='brackets', on_delete=models.CASCADE)
    participant_in_match = models.IntegerField()
    

class BracketType(models.Model):
    name = models.CharField(max_length=255)


class Round(models.Model):
    bracket = models.ForeignKey('Bracket', related_name='rounds', on_delete=models.CASCADE)
    serial_number = models.IntegerField()
    

class Match(models.Model):
    round = models.ForeignKey('Round', related_name='matches', on_delete=models.CASCADE)
    result = models.ForeignKey('MatchResult', on_delete=models.CASCADE)
    start_time = models.DateTimeField(null=True)
    serial_number = models.IntegerField()
    

class MatchResult(models.Model):
    name = models.CharField(max_length=255)


class MatchParticipantInfo(models.Model):
    match = models.ForeignKey('Match', related_name='info', on_delete=models.CASCADE)
    participant_scoore = models.IntegerField()
    participant = models.CharField(max_length=255)