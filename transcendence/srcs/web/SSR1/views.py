from django.http import HttpResponse, HttpResponseNotAllowed
from django.shortcuts import render
import logging

# Create your views here.
def index(request):
    return render(request,"SSR/home.html")

def home(request):
    if  request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return render(request, 'SSR/homeb.html')
    return render(request,"SSR/home.html")

def team(request):
    if  request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return render(request, 'SSR/teamb.html')
    return render(request, 'SSR/team.html')
def game(request):
    if  request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return render(request, 'SSR/gameb.html')
    return render(request, 'SSR/game.html')

def login(request):
    if  request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return render(request, 'SSR/loginb.html')
    return render(request, 'SSR/login.html')

def signup(request):
    if  request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return render(request, 'SSR/signupb.html')
    return render(request, 'SSR/signup.html')

logger = logging.getLogger(__name__)

def test_function(request):
    logger.debug('This is a debug message')
    logger.info('This is an info message')
    logger.warning('This is a warning message')
    logger.error('This is an error message')
    logger.critical('This is a critical message')
    return HttpResponse("Logging test completed")