# Generated by Django 4.1.2 on 2024-08-09 18:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tournaments', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tournament',
            name='prize',
            field=models.FloatField(default=0),
        ),
    ]
