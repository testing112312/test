# Generated by Django 5.1 on 2024-09-21 22:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bootstrap', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='mycustomuser',
            name='avatar',
            field=models.ImageField(blank=True, null=True, upload_to='avatars/'),
        ),
        migrations.AddField(
            model_name='mycustomuser',
            name='bool_two_fa',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='mycustomuser',
            name='m_history',
            field=models.TextField(default=''),
        ),
        migrations.DeleteModel(
            name='GameRecord',
        ),
    ]
