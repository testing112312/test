from django.http import HttpResponse, HttpResponseNotAllowed
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.shortcuts import render, redirect
from django import forms

from django.contrib import messages
from django.contrib.auth import authenticate, logout as auth_logout
from django.http import JsonResponse
from .models import myCustomUser 
from .models import friend  
from django.db.models import Q
import json
import requests
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from social_django.utils import load_strategy
from social_django.models import UserSocialAuth
from bootstrap.backends import Intra42OAuth2, loginProcess
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt


from cryptography.fernet import Fernet
from cryptography.fernet import InvalidToken
from django.conf import settings
import pyotp
from io import BytesIO
import base64
from django.core.files import File
from PIL import Image
# from django.contrib.auth.hashers import make_password
import qrcode
import logging
import hvac

# def get_vault_secret(path, key):
#     """
#     Fetch a secret from HashiCorp Vault.
#     """
#     # replace settings.VAULT_URL and settings.VAULT_TOKEN with your Vault address and token, respectively.
#     client = hvac.Client(url=settings.VAULT_URL, token=settings.VAULT_TOKEN)
#     secret = client.secrets.kv.v2.read_secret_version(path=path)
#     return secret['data'][key]

# Initialize the logger
# logger = logging.getLogger(__name__)
auth_logger = logging.getLogger('auth_logger') #change to this to save in web container file/home/app/web/logs

# Assume you have set your encryption key in your environment or settings
# encryption_key = settings.ENCRYPTION_KEY  # A key generated using Fernet.generate_key()
encryption_key = 'iCMb0Shx5xDjOJTvS-TkzjlK3xpPW3k_JC7_sTZImmY='
cipher = Fernet(encryption_key)

@login_required
def setup_2fa(request):
    user = myCustomUser.objects.get(username=request.user.username)
    if user.bool_two_fa == True:
        user.bool_two_fa = False
        user.save()
        return redirect('setting')
    else:
        user.bool_two_fa = True
    user.save()
    if not user.two_fa_key:
        # Generate a new key for the user and change to bytes with encode()
        raw_key = pyotp.random_base32()
        encrypted_key = cipher.encrypt(raw_key.encode())  # Encrypt the raw key must be in bytes for cipher
        encrypted_key_str = base64.urlsafe_b64encode(encrypted_key).decode() #to save as string
        # logger.debug("Encrypted key from user as string: %s", encrypted_key_str)
        user.two_fa_key = encrypted_key_str  # Store encrypted key in the database
        user.save()
    else:
        # Decrypt the existing key
        encrypted_key = user.two_fa_key
        # logger.debug("Encrypted key from old user as string: %s", encrypted_key)
        encrypted_key_bytes = base64.urlsafe_b64decode(encrypted_key)
        # logger.debug("encrypted key in bytes for use by cipher: %s", encrypted_key_bytes)
        try:
            raw_key = cipher.decrypt(encrypted_key_bytes).decode()  # Decrypt to get the raw key. Use decode to get raw key as string
            # logger.debug("Decrypted rawkey as string for totp: %s", raw_key)
        except InvalidToken:
            auth_logger.error("Decryption failed: %s", e)
            return redirect('setting')
    # Generate a QR code for Google Authenticator
    totp = pyotp.TOTP(raw_key)
    qr_url = totp.provisioning_uri(user.username, issuer_name="PongGame")
    try:
        qr = qrcode.make(qr_url)
    except Exception as e:
        # Log the error for debugging
        auth_logger.error("QR Code generation error: %s", e)
        messages.error(request, "Failed to generate QR code. Please try again.")
        return redirect('setup_2fa')
    # Save the QR code image in memory
    buffer = BytesIO()
    qr.save(buffer, format="PNG")
    buffer.seek(0)
    qr_base64 = base64.b64encode(buffer.getvalue()).decode()
    
    request.session['setup_2fa'] = "true"
    # Pass the base64-encoded image to the template
    return render(request, 'bootstrap/setup_2fab.html', {'qr_code': qr_base64})
    

# @login_required
def verify_2fa(request):
    if request.method == "POST":

        setup_2fa = request.session.get('setup_2fa')
        user_id = request.session.get('pre_2fa_user_id')
        backend = request.session.get('auth_backend')
        
        if setup_2fa == "true":
            user = myCustomUser.objects.get(username=request.user.username)
        elif user_id and backend:
            user = myCustomUser.objects.get(id=user_id)
        else:
            return redirect('login')
                     
        token = request.POST.get('2fa_code')
        # Check if the token is missing or empty
        if not token:
            messages.error(request, "Please enter the 2FA code.")
            return render(request, 'bootstrap/verify_2fab.html')
            
        # Validate the token format: must be 6 digits
        if not token.isdigit() or len(token) != 6:
            messages.error(request, "Invalid token format. Please enter a 6-digit code.")
            return render(request, 'bootstrap/verify_2fab.html')

        # Decrypt the user's stored two_fa_key before using it for verification
        encrypted_key = user.two_fa_key
        # logger.debug("Encrypted key from user database as string: %s", encrypted_key)
        # Ensure the length of the base64 string is a multiple of 4 by adding padding
        auth_logger.debug("cipher: %s", cipher)
        try:
            encrypted_key_bytes = base64.urlsafe_b64decode(encrypted_key)
            # logger.debug("encrypted key in bytes for use by cipher: %s", encrypted_key_bytes)
            decrypted_key = cipher.decrypt(encrypted_key_bytes).decode()
            # logger.debug("Decrypted key as string for totp: %s", decrypted_key)
        except InvalidToken as e:
            auth_logger.error("Decryption failed: %s", e)
            messages.error(request, "Decryption failed. Please contact support.")
            return render(request, 'bootstrap/verify_2fab.html')
        # Verify the token using pyotp
        totp = pyotp.TOTP(decrypted_key)
        auth_logger.debug("totp: %s", totp)
        expected_token = totp.now()
        auth_logger.debug("Expected token: %s", expected_token)

        if totp.verify(token):
            auth_logger.debug("2FA verification successful!")
            # Clear the session variable
            if user_id:
                del request.session['pre_2fa_user_id']
                del request.session['auth_backend']
                loginProcess(request, user, backend)
            return redirect('home')
        else:
            auth_logger.debug("Invalid token. Please try again.")
    return render(request, 'bootstrap/verify_2fab.html')

@csrf_exempt
def auth_required(func):
    def wrapper(request, *args, **kwargs):
        # Check permissions manually
        if not IsAuthenticated().has_permission(request, None):
            return HttpResponse(
                "Unauthorized access. Please log in.",
                status=401
            )
        return func(request, *args, **kwargs)
    return wrapper

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

def friend_profile(request):
    username = request.GET.get('username')
    user = myCustomUser.objects.get(username=username)
    if not user:
        return redirect('home')
    if  request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return render(request, 'bootstrap/friend_profileb.html', {'friend': user})
    return render(request, 'bootstrap/friend_profile.html', { 'friend': user})

# def setting(request):
#     if  request.headers.get('X-Requested-With') == 'XMLHttpRequest':
#         return render(request, 'bootstrap/settingsb.html')
#     return render(request, 'bootstrap/settings.html')

@login_required
def setting(request):
    # Handle AJAX requests to render the settings page dynamically
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return render(request, 'bootstrap/settingsb.html')
    # Render the regular settings page
    return render(request, 'bootstrap/settings.html')


# @login_required
# def setting(request):
#     user = myCustomUser.objects.get(username=request.user.username)

#     if request.method == "POST":
#         # Check if the 2FA checkbox is checked in the submitted form
#         enable_2fa = request.POST.get('two_fa', None)

#         # If the checkbox is checked, enable 2FA, otherwise disable it
#         user.bool_two_fa = bool(enable_2fa)
#         user.save()
#         # # If the 2FA checkbox is checked and user doesn't have a 2FA key
#         # if enable_2fa and not user.two_fa_key:
#         #     return redirect('setup_2fa')

#         # Handle other form fields (e.g., email, password updates, etc.
#         # Redirect to settings page after saving the changes
#         return redirect('setting')

#     # Handle AJAX requests and normal requests differently
#     if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
#         return render(request, 'bootstrap/settingsb.html')

#     # Render the regular settings page
#     return render(request, 'bootstrap/settings.html', {'user': user})

@login_required
def match_history(request):
    username = request.GET.get('username')
    if not username:
        username = request.user.username
    user = myCustomUser.objects.get(username=username)
    return render(request, 'bootstrap/match_history.html', {'friend': user})

@login_required
def friendslist(request):
    friends = friend.objects.filter(Q(user=request.user) & Q(request_status=True))
    if friends is None:
        return JsonResponse({'error': 'No friends found'}, status=404)
    return render(request, 'bootstrap/pending.html', {'friends': friends})

@login_required
def addfriend(request):
    if request.method == "GET":
        user = request.user
        username = request.GET.get('username')
        friend_user = myCustomUser.objects.get(username=username)
        # Use the friend model class to access the objects manager
        if friend.objects.filter(user=user, friend=friend_user).exists():
            return JsonResponse({'error': 'Friend request already sent'}, status=400)
        
        # Create a new friend relationship
        try:
            if(friend.objects.filter(user=friend_user, friend=user).exists()):
                new_friend = friend.objects.create(user=user, friend=friend_user,request_status=True)
                user_friend = friend.objects.get(user=friend_user, friend=user)
                user_friend.request_status = True
                user_friend.save()
            else:
                new_friend = friend.objects.create(user=user, friend=friend_user)
            new_friend.save()
            return JsonResponse({'message': 'Friend request sent successfully'}, status=200)
        except ServerError:
            return JsonResponse({'error': 'Database or connection error'}, status=404)

@login_required
def removefriend(request):
    if request.method == "GET":
        user = request.user
        username = request.GET.get('username')
        friend_user = myCustomUser.objects.get(username=username)
        # Use the friend model class to access the objects manager
        if not friend.objects.filter(user=user, friend=friend_user).exists():
            return JsonResponse({'error': 'No Friend by that name exists '}, status=400)
        try:
            if (friend.objects.filter(user=user, friend=friend_user).exists()):
                friend_relationship = friend.objects.get(user=user, friend=friend_user)
                friend_relationship.delete()
            if (friend.objects.filter(user=friend_user, friend=user).exists()):
                user_friend = friend.objects.filter(user=friend_user, friend=user)
                user_friend.delete()
            return JsonResponse({'message': 'Unfriended successfully'}, status=200)
        except ServerError:
            return JsonResponse({'error': 'Database or connection error'}, status=404)
@login_required
def pendingfriendlist(request):
    if request.method == "GET":
        user = request.user
        # Use the friend model class to access the objects manager
        if not friend.objects.filter(user=user).exists() and not friend.objects.filter(friend=user).exists():
            return render(request, 'bootstrap/pending.html')
        try:
            sent = friend.objects.filter(
                    Q(user=user) & 
                    Q(request_status=False)
            )
            received = friend.objects.filter(
                    Q(friend=user) & 
                    Q(request_status=False)
            )
            return render(request, 'bootstrap/pending.html', {'friends': sent | received})
        except ServerError:
            return render(request, 'bootstrap/pending.html')
@login_required
def userlist(request):
    # print(search)
    if request.method == "GET":
        query = request.GET.get('search')
        sent = friend.objects.filter(user=request.user).values_list('friend', flat=True)
        received = friend.objects.filter(friend=request.user).values_list('user', flat=True)
        if query:
            print("user:"+query+":")
            users = myCustomUser.objects.filter(
                Q(username__iregex=rf'^{query}') & 
                ~Q(username=request.user.username) & 
                ~Q(id__in=sent) &
                ~Q(id__in=received)
            )
            return render(request, 'bootstrap/friends.html', {'friends': users, 'page': 'search'})
        users = myCustomUser.objects.filter(
                ~Q(username=request.user.username) & 
                ~Q(id__in=sent) &
                ~Q(id__in=received)

            )
        return render(request, 'bootstrap/friends.html',{'friends': users, 'page': 'search'})
        # return render(request, 'bootstrap/ajax_search.html', {'users': users})

# View to handle user registration
def validate_user_data(username, email, password1, password2):
    if not username or not password1 or not password2:
        return 'Invalid request body'
    if not email:
        return 'Email is required'
    if password1 != password2:
        return 'Passwords do not match'
    if myCustomUser.objects.filter(username=username).exists():
        return 'Username is already taken'
    if myCustomUser.objects.filter(email=email).exists():
        return 'Email is already taken'
    if len(password1) < 8:
        return 'Password must be at least 8 characters long'
    if not any(char.isdigit() for char in password1):
        return 'Password must contain at least one digit'
    if not any(char.isupper() for char in password1):
        return 'Password must contain at least one uppercase letter'
    if not any(char.islower() for char in password1):
        return 'Password must contain at least one lowercase letter'
    if not any(char in ['$', '@', '#', '%', '!', '&', '*'] for char in password1):
        return 'Password must contain at least one special character'
    return None  # No errors

@csrf_exempt
def register_view(request):
    if request.method == 'POST':
        user_image = request.FILES.get('file')
        username = request.POST.get('username')
        email = request.POST.get('email')
        password1 = request.POST.get('password')
        password2 = request.POST.get('password1')

        # Validate user data
        # error = validate_user_data(username, email, password1, password2)
        # if error:
        # return render(request, 'bootstrap/signupb.html', {'message':error},status=400)
        #     return JsonResponse({"message": error}, status=400)

        user = myCustomUser.objects.create_user(username=username, email=email, password=password1)
        if user_image:
            user.avatar = user_image 
        user.save()

        # Send the avatar URL in the response
        return render(request, 'bootstrap/signupb.html', {'message':"User created successfully"},status=200)
    
    return render(request, 'bootstrap/signupb.html', {'message':"Invalid request method"},status=405)


# View to handle user login
def loginEndPoint(request):
    if request.method == "POST":
        if not request.body:
            return render(request,"bootstrap/loginb.html",{
                "message": 'Invalid request body'                
                },
                status=400
            )

        try:
            body = json.loads(request.body)
        except json.JSONDecodeError:
            return render(
                request, "bootstrap/loginb.html", {"message": 'Invalid JSON format'}, status=400
            )

        # Handle username/password login
        username = body.get('username')
        password = body.get('password')
        if username and password:
            user = authenticate(request, username=username, password=password)
            if user is not None and user.is_active:
                updateuser = myCustomUser.objects.get(username=username)
                # Check if the user has 2FA enabled
                if updateuser.bool_two_fa:
                    # Redirect to 2FA setup page if bool_two_fa is true
                    request.session['auth_backend'] = user.backend
                    request.session['pre_2fa_user_id'] = user.id
                    return redirect('verify_2fa')
                else:
                    # Log the user in
                    return loginProcess(request, user)
            else:
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

def callback(request):
    code = request.GET.get('code')
    if not code:
        return JsonResponse({"error": "Authorization code not provided"}, status=400)
    # Exchange the authorization code for an access token
    token_url = 'https://api.intra.42.fr/oauth/token'
    redirect_uri = "https://localhost/auth/callback/"
    data = {
        'grant_type': 'authorization_code',
        'client_id': settings.SOCIAL_AUTH_INTRA_42_KEY,
        'client_secret': settings.SOCIAL_AUTH_INTRA_42_SECRET,
        'code': code,
        'redirect_uri': redirect_uri,
    }

    token_response = requests.post(token_url, data=data)
    
    if token_response.status_code != 200:
        return JsonResponse({"error": "Failed to obtain access token"}, status=400) #TODO

    access_token = token_response.json().get("access_token")
    
    try:
        strategy = load_strategy(request)
        backend = Intra42OAuth2(strategy=strategy)
        user = backend.do_auth(access_token)
        
        if user and user.is_active:
            # updateuser = myCustomUser.objects.get(username=user.username)
            if user.bool_two_fa:
                # Redirect to 2FA setup page if bool_two_fa is true
                request.session['auth_backend'] = user.backend
                request.session['pre_2fa_user_id'] = user.id
                return render(request,"bootstrap/verify_2fa.html")
            else:
                # Log the user in
                return loginProcess(request, user)
    except Exception as e:
        return Response({"error": str(e)}, status=400)
    return redirect("home")

@login_required
def UpdateImage(request):
    if request.method == 'POST':
        # Check if 'file' exists in the request
        if 'file' not in request.FILES:
            return JsonResponse({'error': 'No image file provided'}, status=400)

        image_file = request.FILES['file']  # Get the image file

        # Validate file type (optional, for checking if it's an image)
        if not image_file.content_type.startswith('image/'):
            return JsonResponse({'error': 'Uploaded file is not an image'}, status=400)

        # Fetch the current user
        user = request.user

        # Update user's image and save
        user.avatar = image_file
        user.save()

        return JsonResponse({'message': 'Profile image updated successfully'}, status=200)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)

def UpdateWins(request):
    if request.method == 'POST':
        if not request.body:
            return JsonResponse({'error': 'Invalid request body'}, status=400)
        body = json.loads(request.body)
        username = body.get('username')
        user = myCustomUser.objects.get(username=username)
        user.wins = user.wins + 1
        user.m_history = user.m_history + "W"
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
        user.m_history = user.m_history + "L"
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

@csrf_exempt
def UpdateProfile(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        new_password = request.POST.get('new_password')
        fa_bool = request.POST.get('fa_bool')
        file = request.FILES.get('file')

        print(f"Username: {username}, Password: {password}, New Password: {new_password},fa_bool: {fa_bool},file: {file}")

        if ( (password and not new_password )):
            return render(request,"bootstrap/settingsb.html",{
                "message": 'Invalid request method'},
                status=400)
        # and (fa_bool == True or fa_bool == False) and file ))or (password and not new_password):

        try:
            # Fetch the user object
            user = myCustomUser.objects.get(username=request.user.username)
            # Update the username if a new one is provided
            if fa_bool == "true":
                # if  user.bool_two_fa != fa_bool:
                user.bool_two_fa = True
            elif fa_bool == "false":
                user.bool_two_fa = False
            if file:
                user.avatar = file
            if  new_password:
                if user.has_usable_password() and not user.check_password(password):
                   return render(request,"bootstrap/settingsb.html",{
                    "message": 'Current password is incorrect'},
                    status=400)
                elif not user.has_usable_password() and password != "":
                    return render(request,"bootstrap/settingsb.html",{
                    "message": 'User does not have a password'},
                    status=400)
                user.set_password(new_password)
                user.save()
                return redirect('home')
            if fa_bool == True or fa_bool == False:
                if  user.bool_two_fa != fa_bool:
                    user.bool_two_fa = fa_bool
                user.save()
                return redirect('home')
            # Save the updated user object
            user.save()
            return render(request,"bootstrap/settingsb.html",{
                    "message": 'Profile updated successfully'},
                    status=200)
        except myCustomUser.DoesNotExist:
             return render(request,"bootstrap/settingsb.html",{
                    "message": 'User not found'},
                    status=404)
    return render(request,"bootstrap/settingsb.html",{
                    "message": 'Invalid request method'},
                    status=405)

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
    updateuser = myCustomUser.objects.get(username=request.user.username)
    updateuser.online = False
    updateuser.save()
    auth_logout(request)
    request.session.flush()
    return redirect('home')

@login_required   
def profilev2(request):
    user = request.user
    social_user = user.social_auth.get(provider='intra_42')
    access_token = social_user.extra_data['access_token']  # Fetch access token

    print("Profile view is being called!")
    print(social_user.extra_data)

    # username = social_user.extra_data.get('login', 'Unknown')
    # image_data = social_user.extra_data.get('image', {})
    # profile_picture = image_data.get('link', '/static/default.jpg')  # Check if this is the right key in the response

    # Fetch user data manually from 42 API
    response = requests.get(
        'https://api.intra.42.fr/v2/me',
        headers={'Authorization': f'Bearer {access_token}'}
    )

    if response.status_code == 200:
        # Log the full response to check the structure
        user_data = response.json()
        print(user_data)  # Check the structure of the returned data

        # Ensure these keys exist in the response, or handle missing data
        username = user_data.get('login', 'Unknown')
        image_data = user_data.get('image', {})

        profile_picture = image_data.get('link', '/static/default.jpg')  # Check if this is the right key in the response
    else:
        username = 'Unknown'
        profile_picture = 'default.jpg'

    
    return render(request, 'bootstrap/profilev2.html', {'username': username, 'profile_picture': profile_picture})