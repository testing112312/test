#!/bin/sh

until pg_isready -h postgres -U dbuser; do
	echo "Waiting for PostgreSQL..."
	sleep 2
done

psql -h postgres -U dbuser -d djangodb -f /vault/init/vault-db.sql

echo "finished creating database"

vault server -config=/vault/config/vault-config.json
