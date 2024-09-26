from django.http import HttpResponse, HttpResponseNotAllowed
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.shortcuts import render, redirect
from django import forms

from django.contrib import messages
from django.contrib.auth import login, authenticate, logout as auth_logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import myCustomUser  # Ensure you import your custom user model
from .models import friend  # Ensure you import your custom user model
from django.db.models import Q
import json
import pyotp
from io import BytesIO
import base64
from django.core.files import File
from PIL import Image
# from django.contrib.auth.hashers import make_password
import qrcode
import hvac
# from cryptography.fernet import Fernet
# from django.conf import settings
# from .forms import Verify2FAForm

# def get_vault_secret(path, key):
#     """
#     Fetch a secret from HashiCorp Vault.
#     """
#     # replace settings.VAULT_URL and settings.VAULT_TOKEN with your Vault address and token, respectively.
#     client = hvac.Client(url=settings.VAULT_URL, token=settings.VAULT_TOKEN)
#     secret = client.secrets.kv.v2.read_secret_version(path=path)
#     return secret['data'][key]

# Create your views here.
# class Verify2FAForm(forms.Form):
#     token = forms.CharField(max_length=6, label="Enter the 6-digit code from your Google Authenticator", validators=[RegexValidator(r'^\d{6}$')])

@login_required
def setup_2fa(request):
    user = myCustomUser.objects.get(username=request.user.username)
    
    if not user.two_fa_key:
        # Generate a new key for the user and hash it using make_password
        raw_key = pyotp.random_base32()
        encrypted_key = cipher.encrypt(raw_key.encode())  # Encrypt the raw key
        user.two_fa_key = encrypted_key  # Store encrypted key in the database
        user.save()
     else:
        # Decrypt the existing key
        encrypted_key = user.two_fa_key
        raw_key = cipher.decrypt(encrypted_key).decode()  # Decrypt to get the raw key
    # Generate a QR code for Google Authenticator
    totp = pyotp.TOTP(raw_key)
    qr_url = totp.provisioning_uri(user.username, issuer_name="PongGame")
    qr = qrcode.make(qr_url)
    
    # Save the QR code image in memory
    buffer = BytesIO()
    qr.save(buffer, format="PNG")
    buffer.seek(0)

    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        # Respond with the QR code image for an Ajax request
        return HttpResponse(buffer, content_type="image/png")

    # If it's a normal request, render the 2FA setup template
    return render(request, 'bootstrap/setup_2fa.html')
    
@login_required
def verify_2fa(request):
    user = myCustomUser.objects.get(username=request.user.username)

    if request.method == "POST":
        form = Verify2FAForm(request.POST)
        if form.is_valid():
            token = form.cleaned_data['token']
            totp = pyotp.TOTP(request.user.two_fa_key)
            if totp.verify(token):
                messages.success(request, "2FA setup successful!")
                return redirect('profile')  # Redirect to the user's profile or another page
            else:
                messages.error(request, "Invalid token. Please try again.")
    else:
        form = Verify2FAForm()

    return render(request, 'verify_2fa.html', {'form': form})

def index(request):
    return render(request,"bootstrap/home.html")

def home(request):
    if  request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return render(request, 'bootstrap/homeb.html')
    return render(request,"bootstrap/home.html")

def navbar(request):
    return render(request,"bootstrap/nav.html")

def team(request):
    if  request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return render(request, 'bootstrap/teamb.html')
    return render(request, 'bootstrap/team.html')
    
def game(request):
    if  request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return render(request, 'bootstrap/gameb.html')
    return render(request, 'bootstrap/game.html')

def login_view(request):
    if  request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return render(request, 'bootstrap/loginb.html')
    return render(request, 'bootstrap/login.html')

def signup(request):
    if  request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return render(request, 'bootstrap/signupb.html')
    return render(request, 'bootstrap/signup.html')

def profile(request):
    if  request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return render(request, 'bootstrap/profileb.html')
    return render(request, 'bootstrap/profile.html')

def setting(request):
    if  request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return render(request, 'bootstrap/settingsb.html')
    return render(request, 'bootstrap/settings.html')

def userlist(request):
    # print(search)
    if request.method == "GET":
        query = request.GET.get('search')
        # friends = friend.objects.filter(user=current_user).values_list('friend', flat=True)
        if query:
            print("user:"+query+":")
            # users = myCustomUser.objects.filter(
            #     Q(username__iregex=rf'^{query}') & 
            #     ~Q(id=current_user.id) & 
            #     ~Q(id__in=friends)
            # )
            users = myCustomUser.objects.filter(Q(username__iregex=rf'^{query}'))

            return render(request, 'bootstrap/friends.html', {'friends': users})
        users = myCustomUser.objects.all()
        return render(request, 'bootstrap/friends.html',{'friends': users})
        # return render(request, 'bootstrap/ajax_search.html', {'users': users})

# class Verify2FAForm(forms.Form):
#     token = forms.CharField(max_length=6, label="Enter the 6-digit code from your Google Authenticator")

# def loginEndPoint(request):
#     if request.method == "POST":
#         body = json.loads(request.body)
#         username = body.get('username')
#         password = body.get('password')
#         return HttpResponseRedirect(reverse("home"))

#         # return render(request, 'bootstrap/home.html')
#     else:
#         return render(request, 'bootstrap/login.html')


# View to handle user registration
@csrf_exempt  # This decorator is used to exempt the view from CSRF verification
def register_view(request):
    print("hi from register")
    if request.method == 'POST':
        if not request.body:
            return render(request,"bootstrap/signupb.html",{
                "message": 'Invalid request body'                
                },
                status=400
            )
        body = json.loads(request.body)
        username = body.get('username')
        email = body.get('email') # Hardcoded email for testing
        password1 = body.get('password')
        password2 = body.get('password1')
        print(":"+username + ":\n")
        print(":"+password1 + ":\n")
        if password1 != password2:
            return render(request,"bootstrap/signupb.html",{
                "message": 'Passwords do not match'                
                },
                status=400
            )
        if myCustomUser.objects.filter(username=username).exists():
            return render(request,"bootstrap/signupb.html",{
                "message": 'Username is already taken'                
                },
                status=400
            )         
        user = myCustomUser.objects.create_user(username=username, email=email, password=password1)
        user.save()
        return render(request,"bootstrap/signupb.html",{},status=200)         
    return render(request,"bootstrap/signupb.html",{
                "message": 'Invalid request method'                
                },
                status=405
            )         
# View to handle user login
@csrf_exempt
def loginEndPoint(request):
    if request.method == "POST":
        if not request.body:
            return render(request,"bootstrap/loginb.html",{
                "message": 'Invalid request body'                
                },
                status=400
            )
        # return JsonResponse({'error': 'Invalid request body'}, status=400)
        body = json.loads(request.body)
        username = body.get('username')
        password = body.get('password')
        print(":"+username + ":\n")
        print(":"+password + ":\n")
        user = authenticate(request,username=username, password=password)
        print ("hi")
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("home")) 
        else:
            print("Invalid user "+ "\n")
            return render(request,"bootstrap/loginb.html",{
                "message": 'Invalid credentials'                
                },
                status=401
            )
    return render(request,"bootstrap/loginb.html",{
                "message": 'Invalid request method'                
                },
                status=405
            )

def UpdateWins(request):
    if request.method == 'POST':
        if not request.body:
            return JsonResponse({'error': 'Invalid request body'}, status=400)
        body = json.loads(request.body)
        username = body.get('username')
        user = myCustomUser.objects.get(username=username)
        user.wins = user.wins + 1
        user.save()
        return JsonResponse({'message': 'Wins updated successfully'}, status=200)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

def UpdateLosses(request):
    if request.method == 'POST':
        if not request.body:
            return JsonResponse({'error': 'Invalid request body'}, status=400)
        body = json.loads(request.body)
        username = body.get('username')
        user = myCustomUser.objects.get(username=username)
        user.losses = user.losses + 1
        user.save()
        return JsonResponse({'message': 'Losses updated successfully'}, status=200)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

def GetWins(request):
    if request.method == 'GET':
        if not request.body:
            return JsonResponse({'error': 'Invalid request body'}, status=400)
        body = json.loads(request.body)
        username = body.get('username')
        user = myCustomUser.objects.get(username=username)
        return JsonResponse({'wins': user.wins}, status=200)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

def GetLosses(request):
    if request.method == 'GET':
        if not request.body:
            return JsonResponse({'error': 'Invalid request body'}, status=400)
        body = json.loads(request.body)
        username = body.get('username')
        user = myCustomUser.objects.get(username=username)
        return JsonResponse({'losses': user.losses}, status=200)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

def GetUsername(request):
    if request.method == 'GET':
        if not request.body:
            return JsonResponse({'error': 'Invalid request body'}, status=400)
        body = json.loads(request.body)
        username = body.get('username')
        user = myCustomUser.objects.get(username=username)
        return JsonResponse({'username': user.username}, status=200)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

def GetEmail(request):
    if request.method == 'GET':
        if not request.body:
            return JsonResponse({'error': 'Invalid request body'}, status=400)
        body = json.loads(request.body)
        username = body.get('username')
        user = myCustomUser.objects.get(username=username)
        return JsonResponse({'email': user.email}, status=200)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

def UpdateProfile(request):
    if request.method == 'POST':
        if not request.body:
            return JsonResponse({'error': 'Invalid request body'}, status=400)
        body = json.loads(request.body)
        
        # Extract data from the request
        username = body.get('username')
        new_username = body.get('new_username')
        email = body.get('email')
        password = body.get('password')
        new_password = body.get('new_password')

        if not (username and new_username and email and password and new_password):
            return JsonResponse({'error': 'Invalid request body'}, status=400)

        try:
            # Fetch the user object
            user = myCustomUser.objects.get(username=username)
            
            # Update the username if a new one is provided
            if new_username and new_username != user.username:
                if myCustomUser.objects.filter(username=new_username).exists():
                    return JsonResponse({'error': 'New username is already taken'}, status=400)
                user.username = new_username
            
            # Update the email if a new one is provided
            if email and email != user.email:
                if myCustomUser.objects.filter(email=email).exists():
                    return JsonResponse({'error': 'Email is already taken'}, status=400)
                user.email = email
            
            # Update the password if a new one is provided
            if new_password:
                if not user.check_password(password):
                    return JsonResponse({'error': 'Current password is incorrect'}, status=400)
                user.set_password(new_password)

            # Save the updated user object
            user.save()
            
            return JsonResponse({'message': 'Profile updated successfully'}, status=200)
        except myCustomUser.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

def DeleteProfile(request):
    if request.method == 'DELETE':
        if not request.body:
            return JsonResponse({'error': 'Invalid request body'}, status=400)
        body = json.loads(request.body)
        username = body.get('username')
        user = myCustomUser.objects.get(username=username)
        user.delete()
        return JsonResponse({'message': 'Profile deleted successfully'}, status=200)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

# View to handle user logout
@login_required
def logout_view(request):
    auth_logout(request)
    request.session.flush()
    return redirect('home')

Store Your Encryption Key in HashiCorp Vault:

# First, make sure you have your encryption key stored in HashiCorp Vault. For example, you can store it under a secret path like secret/django/encryption_key.

# Set VAULT_URL and VAULT_TOKEN as environment variables
# export VAULT_URL='https://vault.yourcompany.com'
# export VAULT_TOKEN='your-vault-token'
