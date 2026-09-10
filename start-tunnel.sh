#!/bin/bash
URL_FILE="/home/julia_main/portfolio/public_url.txt"

ssh -o StrictHostKeyChecking=no \
    -o ServerAliveInterval=60 \
    -o ServerAliveCountMax=3 \
    -o ExitOnForwardFailure=yes \
    -R 80:localhost:3000 \
    localhost.run 2>&1 | while read line; do
  echo "$line"
  if echo "$line" | grep -q "lhr.life"; then
    echo "$line" | grep -oP 'https://[a-z0-9]+\.lhr\.life' > "$URL_FILE"
  fi
done
