from pathlib import Path
from PIL import Image, ImageDraw
from playwright.sync_api import sync_playwright
import base64, re, json, math

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'tests'/'screens-v18'
OUT.mkdir(exist_ok=True)

# deterministic visual-only park crop mirroring current v1.18 createWorld composition
W,H=960,540
world_left,world_top=2520,2730
im=Image.new('RGB',(W,H),(99,168,107)); d=ImageDraw.Draw(im)
# low-contrast grass variations
for i in range(190):
    x=(17+i*73+(i%5)*11)%W; y=(29+i*131+(i%7)*9)%H
    c=[(91,159,100),(108,175,114),(115,181,121),(87,151,96)][i%4]
    if i%3==0:
        d.rectangle((x,y,x+1,y+4),fill=c); d.rectangle((x+2,y+2,x+3,y+4),fill=c)
    else: d.rectangle((x,y,x+2,y+1),fill=c)
# very subtle grass patches
for i in range(20):
    x=(83+i*181)%W;y=(51+i*137)%H
    c=(110,177,115) if i%3 else (82,151,91)
    d.rectangle((x,y,x+24+(i%4)*4,y+8+(i%3)*3),fill=c)

def snap4(v): return round(v/4)*4
# paths: translate world coords into crop
samples=[]
for xw in range(300,5701,64):
    yw=snap4(3000+math.sin(xw/650)*108+math.sin(xw/245)*16)
    # deterministic small jitter proxy
    ej=snap4(((xw*17)%11)-5)
    xs=xw-world_left; ys=yw-world_top
    if -140<xs<W+140: samples.append((xs,ys,ej))
def polygon_h(half,extra=0):
    return [(x,snap4(y-half-ej-extra)) for x,y,ej in samples]+[(x,snap4(y+half+ej+extra)) for x,y,ej in reversed(samples)]
if samples:
    d.polygon(polygon_h(51),fill=(142,116,86)); d.polygon(polygon_h(39),fill=(183,154,114))
    for i,p in enumerate(samples[1:-1:3],1):
        x,y,_=p; d.rectangle((x-11,y-15+(i%4)*9,x+11,y-12+(i%4)*9),fill=(194,167,128))

samplesv=[]
for yw in range(360,5641,64):
    xw=snap4(3000+math.sin(yw/720+1.15)*84+math.sin(yw/270)*13)
    ej=snap4(((yw*13)%11)-5)
    xs=xw-world_left; ys=yw-world_top
    if -140<ys<H+140: samplesv.append((xs,ys,ej))
def polygon_v(half,extra=0):
    return [(snap4(x-half-ej-extra),y) for x,y,ej in samplesv]+[(snap4(x+half+ej+extra),y) for x,y,ej in reversed(samplesv)]
if samplesv:
    d.polygon(polygon_v(45),fill=(128,107,83)); d.polygon(polygon_v(33),fill=(170,145,111))
    for i,p in enumerate(samplesv[1:-1:3],1):
        x,y,_=p; d.rectangle((x-15+(i%4)*9,y-11,x-12+(i%4)*9,y+11),fill=(194,167,128))

# small octagonal center plaza
cx,cy=3000-world_left,3000-world_top
def oct_pts(rx,ry):
    return [(cx-rx,cy-round(ry*.55)),(cx-round(rx*.58),cy-ry),(cx+round(rx*.58),cy-ry),(cx+rx,cy-round(ry*.55)),(cx+rx,cy+round(ry*.55)),(cx+round(rx*.58),cy+ry),(cx-round(rx*.58),cy+ry),(cx-rx,cy+round(ry*.55))]
d.polygon(oct_pts(78,60),fill=(118,106,87)); d.polygon(oct_pts(69,51),fill=(145,128,106))
# paw motif, deliberately subdued
paw=(141,118,89)
d.rectangle((cx-15,cy+5,cx+15,cy+23),fill=paw)
for ox,oy in [(-28,-20),(-11,-29),(8,-28),(24,-17)]: d.rectangle((cx+ox,cy+oy,cx+ox+9,cy+oy+9),fill=paw)

# coherent little bench / lamp symbols around center
def bench(wx,wy,flip=False):
    x,y=wx-world_left,wy-world_top
    if not (-50<x<W+50 and -50<y<H+50): return
    d.rectangle((x-21,y-7,x+21,y-2),fill=(53,45,43)); d.rectangle((x-18,y-8,x+18,y-5),fill=(118,85,61))
    d.rectangle((x-17,y+1,x+17,y+6),fill=(53,45,43)); d.rectangle((x-15,y,x+15,y+3),fill=(118,85,61))
    d.rectangle((x-15,y+6,x-11,y+11),fill=(53,45,43)); d.rectangle((x+11,y+6,x+15,y+11),fill=(53,45,43))
def lamp(wx,wy):
    x,y=wx-world_left,wy-world_top
    if not (-30<x<W+30 and -60<y<H+60): return
    d.rectangle((x-2,y-14,x+2,y+17),fill=(48,47,52)); d.rectangle((x-5,y+17,x+5,y+20),fill=(48,47,52)); d.rectangle((x-6,y-22,x+6,y-13),fill=(48,47,52)); d.rectangle((x-4,y-20,x+4,y-15),fill=(233,215,124))
bench(2815,2830); bench(3185,3170)
lamp(3180,2820); lamp(2820,3180)
# modest flowers/rocks
for i in range(24):
    x=(57+i*149)%W; y=(91+i*101)%H
    if (x-cx)**2+(y-cy)**2<150**2: continue
    if i%3:
        d.rectangle((x,y,x+1,y+5),fill=(60,130,77)); d.rectangle((x-2,y-2,x+3,y+2),fill=(232,218,122) if i%2 else (232,224,207))
    else:
        d.rectangle((x-5,y-2,x+6,y+4),fill=(94,109,104)); d.rectangle((x-2,y-5,x+4,y),fill=(123,137,131))
# visible pet + small foes / gems to check priority
pet=Image.open(ROOT/'public/assets/players/jjigae.png').convert('RGBA')
# native logical size, source already 64x64: do not resize nonuniformly
im=im.convert('RGBA'); im.alpha_composite(pet,(W//2-32,H//2-32))
d=ImageDraw.Draw(im)
# subtle shadow under pet
d.ellipse((W//2-13,H//2+13,W//2+13,H//2+19),fill=(35,55,38,75))
# re-paste pet over shadow
im.alpha_composite(pet,(W//2-32,H//2-32))
# simple bright enemy bullets and XP gems for contrast
for x,y in [(590,260),(630,285),(670,315),(710,350)]:
    d.ellipse((x-5,y-5,x+5,y+5),fill=(55,22,26,255)); d.ellipse((x-3,y-3,x+3,y+3),fill=(247,93,75,255))
for x,y in [(410,345),(435,360),(395,380)]: d.polygon([(x,y-5),(x+5,y),(x,y+5),(x-5,y)],fill=(95,239,196,255))
MAP=OUT/'park-center-preview.png'; im.save(MAP)

def data_uri(path):
    p=Path(path); mime='image/png'
    return 'data:'+mime+';base64,'+base64.b64encode(p.read_bytes()).decode()

html=(ROOT/'public/index.html').read_text()
css=(ROOT/'public/styles.css').read_text()
# remove linked css and script tags; we'll inline css
html=re.sub(r'<link[^>]*styles\.css[^>]*>','',html)
html=re.sub(r'<script[^>]*>.*?</script>','',html,flags=re.S)
html=html.replace('</head>',f'<style>{css}</style></head>')
# absolute game background preview (test-only)
map_uri=data_uri(MAP)
extra=f'''<style>
#game-container::before{{content:"";position:absolute;width:min(100vw,calc(100vh * 16 / 9));aspect-ratio:16/9;height:auto;background:url({map_uri}) center/100% 100% no-repeat;image-rendering:pixelated;}}
</style>'''
html=html.replace('</head>',extra+'</head>')
uris={k:data_uri(ROOT/f'public/assets/players/{k}.png') for k in ['jjigae','mandu','gamja','gucci']}
# small inline script only to populate visuals / no game logic
script=f'''<script>
const URIS={json.dumps(uris)};
function fillPreviews(){{
 document.querySelector('#selected-char-preview').src=URIS.jjigae;
 document.querySelector('#pause-char-preview').src=URIS.jjigae;
 document.querySelector('#combat-player-portrait').src=URIS.jjigae;
 const order=['jjigae','mandu','gamja','gucci']; document.querySelectorAll('.char-thumb').forEach((e,i)=>e.src=URIS[order[i]]);
}}
fillPreviews();
</script>'''
html=html.replace('</body>',script+'</body>')

with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu'])
    results=[]
    for vw,vh in [(1366,768),(1920,1080),(2560,1440)]:
        page=browser.new_page(viewport={'width':vw,'height':vh},device_scale_factor=1)
        page.set_content(html,wait_until='domcontentloaded')
        page.wait_for_timeout(120)
        # Lobby
        fn=OUT/f'lobby-{vw}x{vh}.png'; page.screenshot(path=str(fn),full_page=True)
        # Validate intrinsic aspect preservation in lobby previews
        ratios=page.evaluate('''() => [...document.querySelectorAll('#selected-char-preview,.char-thumb,#pause-char-preview')].map(e=>({id:e.id||e.alt,nw:e.naturalWidth,nh:e.naturalHeight,w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height}))''')
        for r in ratios:
            if r['nw'] and r['nh'] and r['w'] and r['h']:
                assert abs((r['w']/r['h'])-(r['nw']/r['nh'])) < .03, r
        # Combat
        page.evaluate('''() => {document.querySelectorAll('.overlay').forEach(x=>x.classList.remove('show'));document.querySelector('#game-shell').classList.add('game-running');document.querySelector('#combat-hud').setAttribute('aria-hidden','false');document.querySelector('#combat-hp-fill').style.width='73%';document.querySelector('#combat-xp-fill').style.width='45%';document.querySelector('#combat-hp-text').textContent='73/100';document.querySelector('#combat-xp-text').textContent='9/20';document.querySelector('#combat-player-level').textContent='Lv.12';document.querySelector('#combat-time').textContent='07:42';document.querySelector('#combat-wave').textContent='WAVE 47';document.querySelector('#combat-kill').textContent='KILL 318';document.querySelector('#combat-build-slots').innerHTML='<span class="combat-build-slot" style="--slot:#d4aa62" data-tooltip="개이득">✚<b>3</b></span><span class="combat-build-slot" style="--slot:#c58d5c" data-tooltip="똥강아지">●<b>2</b></span><span class="combat-build-slot" style="--slot:#d9bd64" data-tooltip="자동 급식기">▤<b>2</b></span>'; }''')
        page.wait_for_timeout(80)
        fn2=OUT/f'combat-{vw}x{vh}.png'; page.screenshot(path=str(fn2),full_page=True)
        # bounding overlap/safe-area tests
        boxes=page.evaluate('''() => { const q=s=>{const r=document.querySelector(s).getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom}};return {player:q('.combat-player-hud'),run:q('.combat-run-hud'),build:q('.combat-build-hud'),audio:q('.audio-widget')}; }''')
        safe=min(boxes['player']['x'],vw-boxes['run']['right'],boxes['build']['x'],vw-boxes['audio']['right'],boxes['player']['y'],boxes['run']['y'],vh-boxes['build']['bottom'],vh-boxes['audio']['bottom'])
        assert safe>=11, (vw,vh,boxes)
        # no audio/build overlap
        a,b=boxes['audio'],boxes['build']; overlap=not(a['x']>=b['right'] or a['right']<=b['x'] or a['y']>=b['bottom'] or a['bottom']<=b['y'])
        assert not overlap,(vw,vh,a,b)
        results.append({'viewport':f'{vw}x{vh}','min_safe_margin':round(safe,1),'aspect_checks':len(ratios)})
        if vw==1920:
            # Choice
            page.evaluate('''() => {document.querySelector('#game-shell').classList.remove('game-running');document.querySelector('#levelup-screen').classList.add('show');document.querySelector('#levelup-choices').innerHTML='<button class="choice-card" data-type="offense"><div class="choice-top"><span class="icon">⚔</span><span class="choice-tag">기본 강화</span></div><b>공격력 증가</b><p class="choice-summary choice-upgrade">모든 공격 피해 +7%</p><p class="choice-detail">모든 공격 피해량이 7% 증가한다.</p><span class="level">현재 Lv.3 → Lv.4</span></button><button class="choice-card" data-type="survival"><div class="choice-top"><span class="icon">♥</span><span class="choice-tag">기본 강화</span></div><b>최대 체력 회복</b><p class="choice-summary choice-upgrade">최대 HP +14 · 즉시 회복</p><p class="choice-detail">최대 HP가 증가하고 체력을 회복한다.</p><span class="level">현재 Lv.1 → Lv.2</span></button><button class="choice-card exclusive-choice" data-type="exclusive"><div class="choice-top"><span class="icon">🐾</span><span class="choice-tag">캐릭터 전용</span></div><b>목청 폭발</b><p class="choice-summary choice-upgrade">소리탄 충격파 확률 추가</p><p class="choice-detail">소리탄 적중 시 일정 확률로 작은 충격파가 터진다.</p><span class="level">NEW</span></button>'; }''')
            page.wait_for_timeout(80); page.screenshot(path=str(OUT/'choice-1920x1080.png'),full_page=True)
            page.evaluate('''() => {document.querySelector('#levelup-screen').classList.remove('show');document.querySelector('#chest-screen').classList.add('show');document.querySelector('#chest-choices').innerHTML='<button class="choice-card" data-type="treasure"><div class="choice-top"><span class="icon">▤</span><span class="choice-tag">보물상자</span></div><b>자동 급식기</b><p class="choice-summary choice-upgrade">폭주 급식시간 해금</p><p class="choice-detail">급식기가 종료 직전 여러 방향으로 사료를 난사한다.</p><span class="level">현재 Lv.4 → Lv.5</span></button><button class="choice-card" data-type="treasure"><div class="choice-top"><span class="icon">///</span><span class="choice-tag">보물상자</span></div><b>발톱 슥삭</b><p class="choice-summary choice-upgrade">슥삭 대난동 · 8방향 + 마무리 원형베기</p><p class="choice-detail">일반탄 제거에 마지막 원형 베기가 추가된다.</p><span class="level">현재 Lv.4 → Lv.5</span></button><button class="choice-card" data-type="treasure"><div class="choice-top"><span class="icon">✣</span><span class="choice-tag">보물상자</span></div><b>발바닥 도장</b><p class="choice-summary choice-upgrade">우다다 발도장 · 빠른 생성 + 순차 폭발</p><p class="choice-detail">움직인 자리에 도장을 빠르게 남기고 쌓이면 연속 폭발한다.</p><span class="level">현재 Lv.4 → Lv.5</span></button>'; }''')
            page.wait_for_timeout(240); page.screenshot(path=str(OUT/'treasure-lv5-choice-1920x1080.png'),full_page=True)
            page.evaluate('''() => {document.querySelector('#chest-screen').classList.remove('show');document.querySelector('#levelup-screen').classList.add('show');}''')
            # Pause
            page.evaluate('''() => {document.querySelector('#levelup-screen').classList.remove('show');document.querySelector('#pause-screen').classList.add('show');document.querySelector('#pause-stat-grid').innerHTML='<div><small>공격력</small><b>38.4</b></div><div><small>이동속도</small><b>246</b></div><div><small>공격속도</small><b>1.08/s</b></div><div><small>HP</small><b>73 / 100</b></div>';document.querySelector('#pause-basic-upgrades').innerHTML='<span>공격력 ×4</span><span>공속 ×3</span>';document.querySelector('#pause-special-list').innerHTML='<div>✚ 개이득 <b>Lv.3</b></div>';document.querySelector('#pause-major-list').innerHTML='<div>● 똥강아지 <b>Lv.2</b></div>';document.querySelector('#pause-skill-list').innerHTML='<div>▤ 자동 급식기 <b>Lv.5</b></div><div>/// 발톱 슥삭 <b>Lv.4</b></div><div>⌁ 산책줄 휘리릭 <b>Lv.3</b></div>';  }''')
            page.wait_for_timeout(80); page.screenshot(path=str(OUT/'pause-1920x1080.png'),full_page=True)
            page.evaluate('''() => {document.querySelector('#pause-screen').classList.remove('show');document.querySelector('#run-complete-screen').classList.add('show');document.querySelector('#run-complete-stats').textContent='산책 15:48 · Lv.34 · 처치 1260';}''')
            page.wait_for_timeout(80); page.screenshot(path=str(OUT/'run-complete-1920x1080.png'),full_page=True)
        page.close()
    browser.close()

(OUT/'browser-results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
print(json.dumps(results,ensure_ascii=False,indent=2))
