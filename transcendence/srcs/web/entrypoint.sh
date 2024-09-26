#!/bin/sh

# Check if the DATABASE environment variable is set to "postgres"
if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."
    # Loop until PostgreSQL is reachable at the specified host and port
    while ! nc -z $SQL_HOST $SQL_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

# USE IN DEV ONLY
# # Flush the database (clear all data without prompting)
# python manage.py flush --no-input
# # Apply database migrations
# python manage.py migrate

echo "collect static"
python manage.py makemigrations bootstrap
python manage.py migrate
python manage.py collectstatic --no-input
python manage.py createsuperuser --noinput

# Execute any additional commands passed to the script via the command line or CMD in dockerfile
exec "$@"