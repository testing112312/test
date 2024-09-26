
# After running make 

run in terminal 
1. docker-compose exec web python manage.py makemigrations users
Then
2. docker-compose exec web python manage.py migrate  users

# Using the `MyCustomUser` Database Model

To interact with the `MyCustomUser` model in your Django application, you'll need to import it from the relevant app, which in this case is `users`.

### Importing the Model

You can import the `MyCustomUser` model using one of the following methods:

# Import the model directly
from users.models import MyCustomUser

# Import multiple models, such as MyCustomUser and GameRecord
from users.models import MyCustomUser, GameRecord

# Import within the same app using relative import
from .models import MyCustomUser, GameRecord

### Creating and Saving a User

To create a new user and save it to the database, you can use the following:

# Create a new user instance
user = MyCustomUser.objects.create_user(username=username, email=email, password=password1)

# Save the user to the database
user.save()

### Accessing and Manipulating User Data

Here are some examples of how you can access and manipulate data in the `MyCustomUser` model:

- **Retrieve a user by username**:

  user = MyCustomUser.objects.get(username=username)


- **Filter users by username**:

  users = MyCustomUser.objects.filter(username=username)


- **Delete a user by username**:

  MyCustomUser.objects.filter(username=username).delete()


- **Update a user's username**:

  MyCustomUser.objects.filter(username=username).update(username="new_username")


- **Retrieve all users**:

  all_users = MyCustomUser.objects.all()


- **Retrieve a user by ID**:

  user = MyCustomUser.objects.get(id=1)


- **Filter users by ID**:

  users = MyCustomUser.objects.filter(id=1)


- **Delete a user by ID**:

  MyCustomUser.objects.filter(id=1).delete()


- **Update a user's username by ID**:

  MyCustomUser.objects.filter(id=1).update(username="new_username")
