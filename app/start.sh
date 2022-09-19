#!/bin/sh
set -e
/opt/import-meta-env --example /opt/.env.example --output "/var/www/**"
nginx -g "daemon off;"
