# django
Learning Django

Install:
```
pip install django
pip install django-admin
```

To start a new project in django:
```
django-admin startproject <name>
```

To make subpages/app in projects:
```
python manage.py startapp <name>
```

To make sessions work:
```
python manage.py migrate
```

to run:
```
python  manage.py runserver
```    


### files given to us

- main
  - manage.py: used for excution of commands
  - setting.py: used for configs
  - urls.py: table of context paths
- app
  - urls.py  //NEED TO CREATE FOR EACH  NEW APP && LINK TO MAIN 
  - views.py  // where you handle requests and create functions
  - model.py // where you create database structure & communication
  - template/ // you create this folder to store template code for the page
  - static/   // you create this folder to store the static files like js,css and more
  ## there is more !!!
