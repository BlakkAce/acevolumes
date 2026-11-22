#!/usr/bin/env python3
"""Dense content planner: ~39 posts/day across 6 channels.

Split (weekday): X 9 · Threads 7 · Pinterest 8 · Instagram 6 · Facebook 4 · LinkedIn 5 = 39
Weekend: LinkedIn 3 -> 37/day.
All times UTC. US-facing day: 12:00-04:00+ UTC (7am-11pm ET).
Reads draft/approved posts from the studio DB, re-times them onto the grid,
synthesizes fresh posts from the verified-facts bank when pools run dry,
regenerates docs/social-calendar.{json,md}, and emits a cap-aware queue list.
"""
import json, subprocess, sys
from datetime import datetime, timedelta, timezone
from collections import defaultdict

DB = "postgresql://neondb_owner:npg_TN5MoLiqFc4f@ep-soft-mud-b8xs8bgg-pooler.c-14.us-east-1.aws.neon.tech/neondb?sslmode=require"
CAL_JSON = "docs/social-calendar.json"
CAL_MD = "docs/social-calendar.md"

DAYPARTS = {
    "x":         [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22],
    "threads":   [5, 7, 9, 11, 13, 15, 17, 19, 21, 23],
    "instagram": [14, 17, 20, 23, 2, 5],
    "pinterest": [14, 16, 18, 20, 22, 0, 2, 4],
    "facebook":  [16, 19, 22, 1],
    "linkedin":  [13, 15, 17, 19, 21],
}
WEEKDAY_SPLIT = {"x": 12, "threads": 10, "pinterest": 8, "instagram": 6, "facebook": 4, "linkedin": 5}
WEEKEND_SPLIT = dict(WEEKDAY_SPLIT, linkedin=3)
CHANNEL_CAP = 10  # Buffer free plan: max 10 unsent posts queued per channel

# Verified studio facts only (content.ts / offer / proof band)
FACTS = {
    "projects": [
        ("Instafiloans", "a loan-pipeline portal borrowers actually finish", "instafiloans.com"),
        ("HCMG Loans", "a mortgage site that turns rate-shoppers into applicants", "hcmgloans.com"),
        ("Excel Realty", "a real-estate team site with listings that sell themselves", "teamerm.com"),
        ("The Tab Team", "a service site that books tabs while you sleep", "thetabteam.org"),
        ("TrueTerra Oils", "an e-commerce store where the product story does the selling", "trueterraoils.com"),
        ("Top Trading Discounts", "a deals site built for repeat visits", "toptradingdiscounts.com"),
        ("J Sam Smith", "a personal brand site that sounds like the person", "jsamsmith.com"),
    ],
    "services": [
        "websites that load in under 2 seconds",
        "web apps that automate the busywork",
        "booking systems that fill calendars",
        "e-commerce stores built to convert",
        "SEO that gets you found (and cited by AI assistants)",
        "dashboards that show your numbers at a glance",
        "automation that replies before you're awake",
        "landing pages engineered for one decision",
    ],
    "proof": [
        "100+ websites built since 2016",
        "sub-2-second pages on every build",
        "zero third-party scripts on every build",
        "we pride in delivering the very best",
        "first preview in 10 days or less",
    ],
}
BANK = {
    "x": [
        "Need {svc}? That's what we build. Digital systems that make results easier.",
        "{proj}: we built {thing}. See it live: {url}",
        "{proof}. That's the AceVolumes standard.",
        "Your website should be your best employee. Ours work 24/7.",
        "Slow site? Every second of load time costs you visitors. We build sub-2-second pages.",
        "Stop paying for five tools that don't talk. One system, built around your workflow.",
    ],
    "threads": [
        "We built {thing} for {proj}. Real project, live site: {url}",
        "{proof} — and we're just getting started.",
        "Need {svc}? Let's talk. We reply ASAP.",
        "A website is not a brochure. It should book, sell, or capture — every single day.",
    ],
    "instagram": [
        "{proj}: {thing}. Built by AceVolumes.\n\nDigital systems that make results easier. Link in bio.",
        "{proof}.\n\nNeed a website that works as hard as you do? We reply ASAP.\n\n#WebDesign #DigitalSystems",
        "Need {svc}?\n\nThat's what we do — and we pride in delivering the very best.\n\n#AceVolumes #WebDevelopment",
    ],
    "facebook": [
        "{proj}: {thing}. See it: {url}\n\nDigital systems that make results easier — websites, web apps, automation.",
        "{proof}. Need one? Message us — we reply ASAP.",
        "Need {svc}? AceVolumes builds digital systems that make results easier. Message us any time.",
    ],
    "linkedin": [
        "{proj}: {thing}.\n\nBuilt by AceVolumes. Digital systems that make results easier.",
        "{proof}. If your website isn't pulling its weight, it's a liability, not an asset.",
        "Most small businesses don't need more tools. They need one system that actually fits their workflow. That's what we build.",
    ],
    "pinterest": [
        "{proj}: {thing}. Pin this for when you need a website that actually converts. {url}\n\nSave this.",
        "{proof}. Pin this. Save this.\n\n#WebDesign #SmallBusiness",
        "Need {svc}? Pin this reminder — AceVolumes builds digital systems that make results easier. Save this.\n\n#BusinessTips #WebDesign",
    ],
}

def psql(sql):
    r = subprocess.run(["psql", DB, "-t", "-A", "-c", sql], capture_output=True, text=True, timeout=60)
    if r.returncode != 0:
        print("PSQL ERROR:", r.stderr[:300]); sys.exit(1)
    return r.stdout.strip()

# Reach engine: rotating tag sets per platform, tuned to 2026 platform rules.
# X: 1-2 inline tags (3+ = -17% reach, never lead with #). Threads: exactly 1 tag (platform limit).
# IG: 10 tags, small-account strategy (mix niche + mid-size). FB: 2. LI: 3. Pinterest: keywords already in caption.
TAGS = {
    "x": ["#webdesign #smallbusiness", "#ecommerce #webdesign", "#branding #digitalmarketing",
          "#SEO #webdesign", "#buildinpublic #smallbusiness", "#digitalmarketing #ecommerce",
          "#entrepreneurship #branding", "#smallbusiness #webdevelopment"],
    "threads": ["#WebDesign", "#Ecommerce", "#SmallBusiness", "#Branding", "#DigitalMarketing",
                "#Entrepreneurship", "#WebDevelopment", "#SmallBusinessTips"],
    "instagram": ["#webdesign", "#websitedesign", "#webdeveloper", "#webdevelopment", "#ecommercewebsite",
                  "#ecommerce", "#brandidentity", "#branding", "#smallbusinessmarketing", "#smallbusinessowner",
                  "#digitalmarketing", "#uxdesign", "#webdesigner", "#nigerianbusiness", "#lagosbusiness", "#website"],
    "facebook": ["#webdesign #smallbusiness", "#smallbusiness #webdevelopment", "#branding #digitalmarketing"],
    "linkedin": ["#WebDesign #DigitalMarketing #SmallBusiness", "#WebDevelopment #Branding #Entrepreneurship",
                 "#DigitalMarketing #WebDesign #SEO"],
}

def tag(platform, content, seed=None):
    import random
    random.seed(str(seed if seed is not None else content[:24]))
    body = content.rstrip()
    if "#" in body or platform not in TAGS:
        return body
    if platform == "x":
        t = TAGS["x"][random.randrange(len(TAGS["x"]))]
        if len(body) + len(t) + 2 <= 278:
            body = body + "\n\n" + t
        return body
    if platform == "instagram":
        bank = TAGS["instagram"]; off = random.randrange(6)
        return body + "\n\n" + " ".join(bank[(off + i) % len(bank)] for i in range(10))
    return body + "\n\n" + TAGS[platform][random.randrange(len(TAGS[platform]))]

def synth(platform):
    import random
    random.seed(platform + str(datetime.now().date()))
    kind = random.choice(["proj", "svc", "proof"])
    if kind == "proj":
        n, t, u = random.choice(FACTS["projects"])
        return BANK[platform][random.randrange(len(BANK[platform]))].format(proj=n, thing=t, url=u, svc=random.choice(FACTS["services"]), proof=random.choice(FACTS["proof"]))
    if kind == "svc":
        return BANK[platform][random.randrange(len(BANK[platform]))].format(proj=random.choice(FACTS["projects"])[0], thing=random.choice(FACTS["projects"])[1], url=random.choice(FACTS["projects"])[2], svc=random.choice(FACTS["services"]), proof=random.choice(FACTS["proof"]))
    return BANK[platform][random.randrange(len(BANK[platform]))].format(proj=random.choice(FACTS["projects"])[0], thing=random.choice(FACTS["projects"])[1], url=random.choice(FACTS["projects"])[2], svc=random.choice(FACTS["services"]), proof=random.choice(FACTS["proof"]))

now = datetime.now(timezone.utc)
today = now.date()

# 1. pools: approved first, then drafts by id
pools = defaultdict(list)
for line in psql("SELECT id || '|' || platform || '|' || status || '|' || replace(replace(content, chr(10), E'\\\\n'), chr(13), '') FROM posts WHERE status IN ('draft','approved') ORDER BY (status='approved') DESC, id").split("\n"):
    if not line: continue
    parts = line.split("|", 3)
    if len(parts) < 4: continue
    pid, platform, status, content = parts
    pools[platform].append({"id": int(pid), "status": status, "content": content.replace("\\n", chr(10))})

# 2. build the grid for 3 days (today-remainder, tomorrow, day after)
plan = []  # (datetime, platform, post, day_tag)
for day_offset, tag in ((0, "today"), (1, "tomorrow"), (2, "day-after")):
    d = today + timedelta(days=day_offset)
    split = WEEKDAY_SPLIT if d.weekday() < 5 else WEEKEND_SPLIT
    for platform, count in split.items():
        hours = sorted(DAYPARTS[platform])
        # take the LAST `count` hours for today (earliest have passed); full set otherwise
        if tag == "today":
            hours = [h for h in hours if now + timedelta(minutes=25) < datetime(d.year, d.month, d.day, h, tzinfo=timezone.utc)]
        else:
            hours = hours[:count]
        for h in hours:
            if not pools[platform]:
                content = tag(platform, synth(platform))
            else:
                content = pools[platform].pop(0)["content"]
            plan.append({"when": datetime(d.year, d.month, d.day, h, tzinfo=timezone.utc), "platform": platform, "content": content, "tag": tag})

# 3. consume pool entries for planned slots (re-time them), create the rest
used_ids = set()
queue_ids = []
queued_per_channel = defaultdict(int)
pool_by_content = {}
for platform, rows in pools.items():
    for r in rows:
        pool_by_content.setdefault(r["content"], []).append(r)

for item in plan:
    t, platform, content = item["when"], item["platform"], item["content"]
    cands = pool_by_content.get(content) or []
    row = next((r for r in cands if r["id"] not in used_ids), None)
    iso = t.isoformat()
    if row:
        used_ids.add(row["id"])
        psql(f"UPDATE posts SET scheduled_for = '{iso}' WHERE id = {row['id']}")
        pid, status = row["id"], row["status"]
    else:
        esc = content.replace("'", "''")
        pid = int(psql(f"INSERT INTO posts (platform, content, scheduled_for, status, created_by) VALUES ('{platform}', '{esc}', '{iso}', 'draft', 'dense-gen') RETURNING id").split("\n")[0])
        status = "draft"
    item.update(id=pid, status=status)
    # queue list: skip pinterest (no board yet), respect per-channel cap across tonight's queue
    if platform == "pinterest":
        continue
    if item["tag"] == "day-after":
        continue  # queued tomorrow per the daily ritual
    if queued_per_channel[platform] >= CHANNEL_CAP:
        continue  # cap: queued tomorrow morning
    queue_ids.append(pid)
    queued_per_channel[platform] += 1

# 4. calendar
CHANNELS = {"facebook": ("66148c5df1ac4a3c9404c724", "1"), "instagram": ("66148c22f1ac4a3c94037c95", "1"),
            "linkedin": ("6af53c2f62b70b94b001b4d8", "1"), "pinterest": ("6b0265bb8541f09ecb5da362", "2"),
            "threads": ("6af533a062b70b94b001597c", "2"), "x": ("6af5341562b70b94b0015cf2", "2")}
cal = []
for line in psql("SELECT id || '|' || platform || '|' || status || '|' || to_char(scheduled_for, 'YYYY-MM-DD\"T\"HH24:MI:SSZ') || '|' || replace(replace(content, chr(10), E'\\\\n'), chr(13), '') FROM posts WHERE scheduled_for >= now() - interval '1 day' AND status IN ('draft','approved','buffered') ORDER BY scheduled_for").split("\n"):
    if not line: continue
    parts = line.split("|", 4)
    if len(parts) < 5: continue
    pid, platform, status, when, content = parts
    content = content.replace("\\n", chr(10))
    ch, acct = CHANNELS[platform]
    cal.append({"id": int(pid), "platform": platform, "channelId": ch, "account": acct,
                "scheduledFor": when, "status": "posted" if status == "buffered" else status, "content": content})
json.dump({"updated": now.isoformat(), "note": "Chat-side calendar, ~39 posts/day. Statuses: draft/approved -> queued here by David -> posted (in Buffer). Executor: scripts/calendar-post.sh.", "slots": cal}, open(CAL_JSON, "w"), indent=1, ensure_ascii=False)

byday = defaultdict(list)
for c in cal: byday[c["scheduledFor"][:10]].append(c)
md = ["# AceVolumes — Social content calendar (chat-side, dense ~39/day)", "",
      "Split per day (UTC times, US-facing): X 9 · Threads 7 · Pinterest 8 · Instagram 6 · Facebook 4 · LinkedIn 5 (3 on weekends) ≈ 39.",
      "Ritual: each evening we queue tomorrow's grid. Buffer free plan caps 10 unsent per channel — high-volume channels finish queueing next morning.",
      "Pinterest waits for a board (create one in Pinterest, then we set PINTEREST_BOARD_ID).", "",
      "| Status: `draft/approved` = awaiting queue · `posted` = in Buffer's queue |", ""]
for day in sorted(byday):
    md.append(f"## {day}")
    md.append("")
    md.append("| IDs | Platform | UTC | Post (first 80 chars) | Status |")
    md.append("|---|---|---|---|---|")
    for c in sorted(byday[day], key=lambda x: x["scheduledFor"]):
        head = c["content"].split("\n")[0][:80].replace("|", "\\|")
        md.append(f"| {c['id']} | {c['platform']} | {c['scheduledFor'][11:16]} | {head} | {c['status']} |")
    md.append("")
open(CAL_MD, "w").write("\n".join(md))

print(f"planned {len(plan)} slots (today {sum(1 for i in plan if i['tag']=='today')}, tomorrow {sum(1 for i in plan if i['tag']=='tomorrow')}, day-after {sum(1 for i in plan if i['tag']=='day-after')})")
print("per-channel tonight queue:", dict(queued_per_channel), "| pinterest slots wait for board")
print("QUEUE_IDS:", " ".join(map(str, queue_ids)))
