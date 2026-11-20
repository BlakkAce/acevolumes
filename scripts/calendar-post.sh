#!/usr/bin/env bash
# Chat-side calendar executor: post approved calendar slots to Buffer.
# Usage: calendar-post.sh <id> [id...]     (keys come from /home/user/buffer-keys.env)
set -euo pipefail
ENV_FILE="${BUFFER_KEYS_ENV:-/home/user/buffer-keys.env}"
[ -f "$ENV_FILE" ] || { echo "MISSING KEYS: create $ENV_FILE with BUFFER_KEY_1=... and BUFFER_KEY_2=..."; exit 2; }
source "$ENV_FILE"
CAL="$(dirname "$0")/../docs/social-calendar.json"
DB="${DATABASE_URL:?set DATABASE_URL}"
POSTED=0; FAILED=0
for ID in "$@"; do
  ROW=$(python3 - "$CAL" "$ID" <<'PY'
import json, sys
cal = json.load(open(sys.argv[1]))
slot = next((s for s in cal["slots"] if str(s["id"]) == sys.argv[2]), None)
if not slot: print("NOTFOUND"); sys.exit(0)
print(json.dumps(slot))
PY
)
  [ "$ROW" = "NOTFOUND" ] && { echo "id $ID: not in calendar"; FAILED=$((FAILED+1)); continue; }
  PLATFORM=$(echo "$ROW" | python3 -c "import json,sys; print(json.load(sys.stdin)['platform'])")
  CHANNEL=$(echo "$ROW" | python3 -c "import json,sys; print(json.load(sys.stdin)['channelId'])")
  ACCT=$(echo "$ROW" | python3 -c "import json,sys; print(json.load(sys.stdin)['account'])")
  DUE=$(echo "$ROW" | python3 -c "import json,sys; print(json.load(sys.stdin)['scheduledFor'])")
  TEXT=$(echo "$ROW" | python3 -c "import json,sys,base64; print(base64.b64encode(json.load(sys.stdin)['content'].encode()).decode())")
  KEYVAR="BUFFER_KEY_$ACCT"; KEY="${!KEYVAR}"
  [ -n "$KEY" ] || { echo "id $ID: no key for account $ACCT"; FAILED=$((FAILED+1)); continue; }
  RES=$(curl -s -X POST "https://api.buffer.com" -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" -d @- <<GQL
{"query":"mutation(\$input: CreatePostInput!) { createPost(input: \$input) { ... on PostActionSuccess { post { id dueAt } } ... on MutationError { message } } }","variables":{"input":{"text":"$(echo "$ROW" | python3 -c "import json,sys; print(json.load(sys.stdin)['content'].replace(chr(34),chr(92)+chr(34)).replace(chr(10),chr(92)+'n'))")","channelId":"$CHANNEL","schedulingType":"automatic","mode":"customScheduled","dueAt":"$DUE"}}}
GQL
)
  OK=$(echo "$RES" | python3 -c "import json,sys; d=json.load(sys.stdin); print('yes' if d.get('data',{}).get('createPost',{}).get('post') else 'no')" 2>/dev/null || echo no)
  if [ "$OK" = "yes" ]; then
    psql "$DB" -c "UPDATE posts SET status='buffered', error=null WHERE id=$ID;" >/dev/null
    python3 - "$CAL" "$ID" <<'PY'
import json, sys
cal = json.load(open(sys.argv[1]))
for s in cal["slots"]:
    if str(s["id"]) == sys.argv[2]: s["status"] = "posted"
json.dump(cal, open(sys.argv[1], "w"), indent=1, ensure_ascii=False)
PY
    echo "id $ID ($PLATFORM): POSTED to Buffer for $DUE"; POSTED=$((POSTED+1))
  else
    MSG=$(echo "$RES" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('data',{}).get('createPost',{}).get('message') or d.get('errors',[{}])[0].get('message','unknown'))" 2>/dev/null || echo "$RES")
    echo "id $ID ($PLATFORM): FAILED — $MSG"; FAILED=$((FAILED+1))
  fi
done
echo "== done: $POSTED posted, $FAILED failed =="
