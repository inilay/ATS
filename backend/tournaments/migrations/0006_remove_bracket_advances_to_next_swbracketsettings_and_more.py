# Generated by Django 4.1.2 on 2024-09-21 13:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tournaments', '0005_bracket_advances_to_next_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='bracket',
            name='advances_to_next',
        ),
        migrations.CreateModel(
            name='SWBracketSettings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('points_per_loss', models.IntegerField(default=0)),
                ('points_per_draw', models.IntegerField(default=0)),
                ('points_per_victory', models.IntegerField(default=1)),
                ('bracket', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sw_settings', to='tournaments.bracket')),
            ],
        ),
        migrations.CreateModel(
            name='SEBracketSettings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('advances_to_next', models.IntegerField(default=1)),
                ('bracket', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='se_settings', to='tournaments.bracket')),
            ],
        ),
        migrations.CreateModel(
            name='RRBracketSettings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('points_per_loss', models.IntegerField(default=0)),
                ('points_per_draw', models.IntegerField(default=0)),
                ('points_per_victory', models.IntegerField(default=1)),
                ('bracket', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='rr_settings', to='tournaments.bracket')),
            ],
        ),
        migrations.CreateModel(
            name='GroupBracketSettings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('final_bracket', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='final_brackets', to='tournaments.tournament')),
                ('group_bracket', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='group_brackets', to='tournaments.tournament')),
            ],
        ),
    ]