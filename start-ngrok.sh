#!/bin/bash
set -e

NGROK_LOG="/tmp/ngrok.log"
URL_FILE="/home/julia_main/portfolio/public_url.txt"

pkill -f "ngrok http" 2>/dev/null || true
sleep 1

nohup ngrok http 3000 --log=stdout > "$NGROK_LOG" 2>&1 &

for i in $(seq 1 15); do
  sleep 1
  URL=$(curl -s http://127.0.0.1:4040/api/tunnels 2>/dev/null | \
    node -e "var d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{var t=JSON.parse(d);console.log((t.tunnels[0]||{}).public_url||'')})" 2>/dev/null)
  if [ -n "$URL" ]; then
    echo "$URL" > "$URL_FILE"
    echo "Site online: $URL"
    exit 0
  fi
done

echo "Erro ao iniciar ngrok" >&2
exit 1
