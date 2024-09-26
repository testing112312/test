"""
URL configuration for navi project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.urls import path, include
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("home", views.home, name="home"),
    path("navbar", views.navbar, name="navbar"),
    path("team", views.team, name="team"),
    path("game", views.game, name="game"),
    path("login", views.login_view, name="login"),
    path("signup", views.signup, name="signup"),
    path("setting", views.setting, name="setting"),
    path("profile", views.profile, name="profile"),
    path("friend_profile", views.friend_profile, name="friend_profile"),
    path("profilev2/", views.profilev2, name="profilev2"),
    path("setup_2fa", views.setup_2fa, name="setup_2fa"),
    path("verify_2fa", views.verify_2fa, name="verify_2fa"),
    path('auth/callback/', views.callback, name='callback'),

    path("userlist/", views.userlist, name="userlist"),
    path("addfriend/", views.addfriend, name="addfriend"),
    path("removefriend/", views.removefriend, name="removefriend"),
    path("friendslist/", views.friendslist, name="friendslist"),
    path("match_history/", views.match_history, name="match_history"),
    path("pendingfriendlist/", views.pendingfriendlist, name="pendingfriendlist"),
    # path("userlist/<str:search>", views.userlist, name="userlist"),
    path('loginEndPoint/', views.loginEndPoint, name='loginEndPoint'),
    path('logout_view/', views.logout_view, name='logout_view'),
    path('register_view/', views.register_view, name='register_view'),
    path('UpdateProfile/', views.UpdateProfile, name='UpdateProfile'),
    path('DeleteProfile/', views.DeleteProfile, name='DeleteProfile'),
    path('GetEmail/', views.GetEmail, name='GetEmail'),
    path('GetUsername/', views.GetUsername, name='GetUsername'),
    path('GetWins/', views.GetWins, name='GetWins'),
    path('GetLosses/', views.GetLosses, name='GetLosses'),
    path('UpdateWins/', views.UpdateWins, name='UpdateWins'),
    path('UpdateLosses/', views.UpdateLosses, name='UpdateLosses'),
    path('UpdateImage/', views.UpdateImage, name='UpdateImage'),
]
