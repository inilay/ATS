# Generated by Django 4.1.2 on 2025-03-08 10:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0005_pushtoken'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pushtoken',
            name='profile',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='push_tokens', to='profiles.profile'),
        ),
    ]
