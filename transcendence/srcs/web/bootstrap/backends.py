from social_core.backends.oauth import BaseOAuth2
from django.contrib.auth import login
from django.shortcuts import redirect
from rest_framework_simplejwt.tokens import RefreshToken
from .models import myCustomUser 

class Intra42OAuth2(BaseOAuth2):
    """42 (Intra 42) OAuth2 authentication backend"""
    name = 'intra_42'
    AUTHORIZATION_URL = 'https://api.intra.42.fr/oauth/authorize'
    ACCESS_TOKEN_URL = 'https://api.intra.42.fr/oauth/token'
    ACCESS_TOKEN_METHOD = 'POST'
    USER_DATA_URL = 'https://api.intra.42.fr/v2/me'
    SCOPE_SEPARATOR = ' '
    EXTRA_DATA = [
        ('id', 'id'),
        ('expires_in', 'expires'),
    ]

    def get_user_details(self, response):
        """Return user details from 42 account"""
        return {
            'username': response.get('login'),
            'email': response.get('email') or '',
            'first_name': response.get('first_name'),
            'last_name': response.get('last_name'),
        }

    def get_user_id(self, details, response):
        """Return the unique user ID from the 42 response"""
        return response['id']

    def user_data(self, access_token, *args, **kwargs):
        """Fetch user data from 42's API"""
        return self.get_json(self.USER_DATA_URL, params={'access_token': access_token})


def loginProcess(request, user, backend = ""):
    if backend == "":
        login(request, user)
    else:
        login(request, user, backend=backend)
    updateuser = myCustomUser.objects.get(username=user.username)
    updateuser.online = True
    updateuser.save()
    RefreshToken.for_user(user)
    return redirect('home')