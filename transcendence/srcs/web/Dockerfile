###########
# BUILDER #
###########

# pull official base image
FROM python:3.11.4-slim-buster as builder

# set work directory
# this directory seems to be the standard to place files but it could technically be anything
WORKDIR /usr/src/app

# set environment variables
# prevents python from writing .pyc files to disc (python -B)
# .pyc files are cache files created to speed up loading of modules on subsequent runs
# they can clutter up a project during development, and also in docker, it may create more overhead or cause issues with file permissions
ENV PYTHONDONTWRITEBYTECODE 1
# prevents Python from buffering stdout and stderr (python -u)
# by default python buffers output to the terminal which can cause delays
# unbuffered output allows real-time logging
# good for interactive applications
ENV PYTHONUNBUFFERED 1

# install system dependencies
# install gcc to compile python packages (some include c extensions and require a c compiler)
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc

# lint
# flake8 is a linting tool for python - checks style and quality of python code
# ignore these error codes: E501 line lenghth, F401 unused imports

RUN pip install --upgrade pip
# RUN pip install flake8==6.0.0
COPY . /usr/src/app/
# RUN flake8 --ignore=E501,F401 .

# install python dependencies
# wheel packages (.whl) help speed up installation and reduce runtime dependencies needed in final Docker image
COPY ./requirements.txt .
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /usr/src/app/wheels -r requirements.txt


#########
# FINAL #
#########

# pull official base image
FROM python:3.11.4-slim-buster

EXPOSE 8000

# create directory for the app user
RUN mkdir -p /home/app

# create the app user
# create a new system group and user named app and add app to app group
# system is intended for running services or tasks rather than regular user login sessions
# by default Docker runs contianer processes as root inside container which is insecure
	# if an attacker gains access to container as root and manages to break out, they will also be root on Docker host
RUN addgroup --system app && adduser --system --group app

# create the appropriate directories
# we need ENV bc dockerfiles do not automatically get variables from .env file
ENV HOME=/home/app
ENV APP_HOME=/home/app/web
RUN mkdir $APP_HOME
RUN mkdir $APP_HOME/staticfiles &&\
	mkdir $APP_HOME/mediafiles &&\
	mkdir $APP_HOME/logs

WORKDIR $APP_HOME

# install dependencies
# copy over wheels from builder - everything else from builder is discarded
RUN apt-get update && apt-get install -y --no-install-recommends netcat
COPY --from=builder /usr/src/app/wheels /wheels
COPY --from=builder /usr/src/app/requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache /wheels/*

# copy entrypoint.prod.sh
COPY ./entrypoint.sh .
# remove Windows-style line endings from entrypoint.sh
# RUN sed -i 's/\r$//g'  ./entrypoint.sh

# copy project
COPY . $APP_HOME

# chown all the files to the app user
# RUN chown -R app:app $APP_HOME
RUN chown -R 1000:1000 $APP_HOME

RUN chmod +x $APP_HOME/entrypoint.sh
RUN chmod -R u+rw,g+rw,o+rw $APP_HOME

# change to the app user
USER 1000

RUN sed -i 's/\r$//g'  ./entrypoint.sh
RUN sed -i 's/\r$//g'  $APP_HOME/entrypoint.sh

# run entrypoint.prod.sh
# When you define both ENTRYPOINT and CMD in Dockerfile, DOcker will use ENTRYPOINT cmd and append anything from CMD to the end
ENTRYPOINT ["/home/app/web/entrypoint.sh"]

CMD ["gunicorn", "-w", "4", "navi.wsgi:application", "--bind", "0.0.0.0:8000", "--timeout", "120"]

# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]