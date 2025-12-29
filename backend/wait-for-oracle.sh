#!/bin/sh
# wait-for-oracle.sh

set -e

host="$DB_HOST"
port="$DB_PORT"

echo "Waiting for Oracle at $host:$port..."

# Use netcat to check connectivity
until nc -z "$host" "$port"; do
  echo "Oracle is unavailable - sleeping 5s..."
  sleep 5
done

echo "Oracle is up - starting NestJS"
exec node dist/main.js
