NAME = inception
composeLoc = -f ./srcs/docker-compose.yml

UNAME_S = $(shell uname -s)
ifeq ($(UNAME_S), Linux)
    dockerCMD = sudo docker compose
else
    dockerCMD = docker compose
endif

# volume: 
# 	mkdir -p ~/data
# 	mkdir -p ~/data/wp
# 	mkdir -p ~/data/db
# 	mkdir -p ~/data/php

all: up

up: 
	${dockerCMD} ${composeLoc} up -d

build:
	${dockerCMD} ${composeLoc} up --build -d

down: 
	${dockerCMD} ${composeLoc} down -v

semidown: 
	${dockerCMD} ${composeLoc} down

start: 
	${dockerCMD} ${composeLoc} start

stop: 
	${dockerCMD} ${composeLoc} stop

restart:
	${dockerCMD} ${composeLoc} restart

re: down rm prune build

ps: 
	sudo docker ps

status : 
	@docker ps

clean: down rm
	@docker rmi -f $$(docker images -qa)

prune:
	@docker image prune -f

rm:
	sudo rm -rf ./srcs/volumes/db/*
	sudo rm -rf ./srcs/volumes/es/*
	sudo rm -rf ./srcs/volumes/kb/*
	sudo rm -rf ./srcs/volumes/ls/*
	sudo rm -rf ./srcs/volumes/ls/.lock
	sudo rm -rf ./srcs/volumes/media/*
	sudo rm -rf ./srcs/volumes/static/*

fclean: clean
	@docker volume rm $$(docker volume ls -q)
