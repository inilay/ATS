# Generated by Django 4.1.2 on 2024-09-08 10:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tournaments', '0003_match_start_time'),
    ]

    operations = [
        migrations.AlterField(
            model_name='match',
            name='start_time',
            field=models.DateTimeField(null=True),
        ),
    ]