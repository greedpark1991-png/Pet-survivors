from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'tests'/'screens-v162';OUT.mkdir(exist_ok=True)
W,H=900,420
im=Image.new('RGB',(W,H),(31,37,33));d=ImageDraw.Draw(im)
# panels
d.rounded_rectangle((18,18,430,402),radius=12,fill=(42,48,44),outline=(95,105,96),width=2)
d.rounded_rectangle((450,18,882,402),radius=12,fill=(42,48,44),outline=(95,105,96),width=2)
d.text((36,32),'PLAYER / BULLET HITBOX CHECK',fill=(239,231,200))
# player image native 64x64, visible alpha bbox respected
pet=Image.open(ROOT/'public/assets/players/jjigae.png').convert('RGBA')
px,py=90,135
im=im.convert('RGBA');im.alpha_composite(pet,(px-32,py-32));d=ImageDraw.Draw(im)
# actual player circle center relative source (31,47) -> world sprite center offset (-1,+15), r7
pcx,pcy=px-1,py+15
for rr,col in [(7,(103,245,167,255))]:d.ellipse((pcx-rr,pcy-rr,pcx+rr,pcy+rr),outline=col,width=2)
d.text((44,190),'Jjigae native 64x64 / actual torso circle r=7',fill=(200,212,202))
# raid bullet visual and hit core
for idx,(label,vr,hr,col) in enumerate([('enemy',5,3.5,(255,100,119)),('boss',7,5,(201,117,255)),('TRUE',8,5.5,(255,107,79))]):
    x=95+idx*105;y=270
    d.ellipse((x-vr,y-vr,x+vr,y+vr),fill=(49,25,31),outline=col,width=2)
    d.ellipse((x-hr,y-hr,x+hr,y+hr),outline=(110,244,168),width=1)
    d.text((x-24,y+20),f'{label}\nV{vr} H{hr}',fill=(210,215,207))
# fairness corridor raid bullets centers 29 apart; green torso circle at center
x1,x2,y=260,289,345
for x in (x1,x2):
    d.ellipse((x-8,y-8,x+8,y+8),fill=(75,24,28),outline=(255,107,79),width=2)
    d.ellipse((x-5.5,y-5.5,x+5.5,y+5.5),outline=(255,235,150),width=1)
mid=(x1+x2)/2
d.ellipse((mid-7,y-7,mid+7,y+7),outline=(103,245,167),width=2)
d.text((36,370),'29px centers: torso circle has ~2px collision clearance',fill=(200,212,202))
# dash diagnostic
d.text((470,32),'GRAPE DASH READABILITY',fill=(239,231,200))
# dotted floor line
start=(535,180);target=(740,180);end=(792,180)
for x in range(start[0]+35,end[0]-15,25): d.rectangle((x,178,x+13,181),fill=(238,188,96,150))
# grape-like simple boss blob
for ox,oy in [(0,0),(-17,-9),(17,-9),(-12,14),(12,14),(0,-20)]: d.ellipse((start[0]+ox-15,start[1]+oy-15,start[0]+ox+15,start[1]+oy+15),fill=(116,62,132),outline=(51,35,56),width=2)
# player target
im.alpha_composite(pet,(target[0]-32,target[1]-32));d=ImageDraw.Draw(im)
# overshoot marker
d.line((target[0],145,target[0],215),fill=(90,160,110),width=1)
d.line((end[0],145,end[0],215),fill=(214,178,90),width=1)
d.text((700,125),'locked target',fill=(185,207,187));d.text((758,220),'+52px',fill=(234,202,127))
# afterimages toward end
for i,x in enumerate((620,680,735)):
    a=100-i*20
    d.ellipse((x-18,163,x+18,197),outline=(190,157,204,a),width=2)
d.text((470,260),'0.60s prep -> 0.22~0.28s straight rush',fill=(200,212,202))
d.text((470,286),'target locked at telegraph; no steering during dash',fill=(200,212,202))
d.text((470,312),'overshoot: +52px (P1), +60px (P2)',fill=(200,212,202))
d.text((470,338),'recovery: 0.38s / floor dotted line, no arrowhead',fill=(200,212,202))
im.save(OUT/'collision-dash-diagnostic.png')
print(OUT/'collision-dash-diagnostic.png')
