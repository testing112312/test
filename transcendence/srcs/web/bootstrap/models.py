# users/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

class myCustomUser(AbstractUser):
    # Additional fields for myCustomUser
    two_fa_key = models.CharField(max_length=255, blank=True, null=True)  # 2FA key field
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)  # Avatar image field
    online = models.BooleanField(default=False)  # Logged in status
    wins = models.PositiveIntegerField(default=0)  # Number of wins
    losses = models.PositiveIntegerField(default=0)  # Number of losses
    m_history = models.TextField(default="WL")  # Match history
    bool_two_fa = models.BooleanField(default=False)  # Logged in status
    
    # Add related_name attributes to avoid conflicts
    groups = models.ManyToManyField(
        Group,
        related_name='mycustomuser_groups',  # Change this to a unique name
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='mycustomuser_permissions',  # Change this to a unique name
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )
    
    def __str__(self):
        return self.username

class friend(models.Model):
    user = models.ForeignKey(myCustomUser, on_delete=models.CASCADE, related_name='friends')  # User
    friend = models.ForeignKey(myCustomUser, on_delete=models.CASCADE, related_name='friend_of')  # Friend
    request_status = models.BooleanField(default=False)  # Friend request status
    class Meta:
        unique_together = ('user', 'friend')  # User and friend pair should be unique
    def __str__(self):
        return f"{self.user},  {self.friend},  {self.request_status }"
