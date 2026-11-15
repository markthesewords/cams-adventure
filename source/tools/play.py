import sys, json
from playwright.sync_api import sync_playwright
logs=[]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome')
    pg=b.new_page(viewport={'width':1280,'height':720})
    pg.on('console',lambda m:logs.append(m.type+': '+m.text)); pg.on('pageerror',lambda e:logs.append('PAGEERR '+str(e)))
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html'); pg.wait_for_timeout(700)
    pg.evaluate("localStorage.clear()")
    ev=pg.evaluate
    def st(tag): print(tag, ev("JSON.stringify({ch:S.chapter,goal:S.goal,dlg:S.dlg&&S.dlg.text.slice(0,40),lock:S.lock,x:Math.round(P.x),y:Math.round(P.y),inv:S.inv,noise:S.noiseV})"))
    def shot(n): pg.screenshot(path=f'/tmp/shots/{n}.png')
    def settle(maxs=30, until="S.lock===0"):
        pg.wait_for_timeout(350)
        for _ in range(int(maxs*4)):
            if ev("S.dlg?1:0"):
                if ev("S.dlg.choices?1:0"): return 'choice'
                pg.keyboard.press('z')
            elif ev(until): return 'ok'
            pg.wait_for_timeout(250)
        return 'timeout'
    def go(pts):
        for tx,ty in pts:
            for _ in range(120):
                x,y=ev("[P.x,P.y]")
                if abs(x-tx)<3 and abs(y-ty)<3: break
                ks=[]
                if x<tx-2: ks.append('ArrowRight')
                elif x>tx+2: ks.append('ArrowLeft')
                if y<ty-2: ks.append('ArrowDown')
                elif y>ty+2: ks.append('ArrowUp')
                for k in ks: pg.keyboard.down(k)
                pg.wait_for_timeout(90)
                for k in ks: pg.keyboard.up(k)
            else: print('STUCK going to',tx,ty,'at',ev("[Math.round(P.x),Math.round(P.y)]"))
    def face(k): pg.keyboard.press(k); pg.wait_for_timeout(80)
    ev('S.fast=true'); pg.keyboard.press('z'); print(settle(30,"S.flags.stage===0")); st('ch1'); shot('n1_dark')
    pg.keyboard.press('z'); print(settle(20,"S.flags.stage===2")); st('noise on'); shot('n2_noise')
    pg.keyboard.press('z'); print(settle(40,"S.chapter===2&&S.lock===0")); st('ch2'); shot('n3_cam')
    go([(120,124),(120,204),(270,204),(440,210),(452,300),(460,298)]); face('ArrowRight'); shot('n4_living'); pg.keyboard.press('z'); pg.wait_for_timeout(600); shot('n5_vinny'); print(settle()); st('vinny')
    go([(452,300),(452,172),(404,172),(404,124),(345,124),(338,94)]); face('ArrowUp'); shot('n6_kitchen'); pg.keyboard.press('z'); pg.wait_for_timeout(2500); shot('n7_dad'); print(settle()); st('dad')
    go([(345,124),(378,124),(414,124),(414,78),(404,78)]); face('ArrowLeft'); pg.keyboard.press('z'); r=settle(); st('bfast '+r); shot('n8_bfast')
    seq=[2,1,1,1]
    for k in seq:
        pg.wait_for_timeout(700)
        if ev("S.dlg&&S.dlg.choices?1:0"):
            for _ in range(k): pg.keyboard.press('ArrowDown'); pg.wait_for_timeout(70)
            pg.keyboard.press('z'); r=settle(30,"S.lock===0")
    st('after '+r); settle(); pg.wait_for_timeout(800); shot('n9_free')
    seen=set()
    for _ in range(140):
        pg.wait_for_timeout(500)
        d=json.loads(ev("JSON.stringify({lock:S.lock,foc:!!S.camFocus,vis:NPC.vinny.visible,ghost:!!NPC.vinny.ghost,open:!hidden.has('sliderOpen'),lie:!!NPC.vinny.lie})"))
        if d['foc'] and d['open'] and 'o' not in seen: seen.add('o'); shot('v1_open')
        if d['ghost'] and 'g' not in seen: seen.add('g'); shot('v2_out')
        if d['lie'] and d['lock']==0: break
    print('vinny scene',sorted(seen),d)
    go([(414,150),(452,170),(452,330),(482,340)]); face('ArrowDown'); pg.keyboard.press('z'); pg.wait_for_timeout(500)
    keys={'0':'ArrowUp','1':'ArrowRight','2':'ArrowDown','3':'ArrowLeft'}; shotm=0
    for _ in range(400):
        if ev("S.dlg?1:0"): pg.keyboard.press('z')
        elif ev("S.mini?1:0"):
            if ev("S.mini.phase")=='play':
                if not shotm: shot('m1_dj'); shotm=1
                k=ev("String(S.mini.seq[S.mini.pos])"); pg.keyboard.press(keys[k])
        elif ev("S.flags.dadOut&&S.lock===0"): break
        pg.wait_for_timeout(200)
    st('dad out'); shot('m2_dadout')
    go([(452,330),(452,170),(412,150),(410,58)]); face('ArrowUp'); pg.keyboard.press('z')
    took=0
    for _ in range(400):
        if ev("S.dlg?1:0"): pg.keyboard.press('z')
        if ev("P.carry?1:0") and took==0: shot('m3_carry'); took=1
        if ev("(S.extra||[]).some(e=>e.id==='tvglow')") and took<2 and ev("S.dlg?1:0"): shot('m4_cookie'); took=2
        if ev("S.chapter===3&&S.lock===0"): break
        pg.wait_for_timeout(250)
    st('ch3'); shot('m5_930')
    pg.keyboard.down('Shift'); go([(120,124),(120,204),(300,206)]); pg.keyboard.up('Shift')
    pg.wait_for_timeout(2500); shot('m6_lick'); r=settle(20); shot('m7_choice'); st('outing '+r)
    pg.wait_for_timeout(700)
    for _ in range(3): pg.keyboard.press('ArrowDown'); pg.wait_for_timeout(100)
    pg.keyboard.press('z'); pg.wait_for_timeout(800); print(settle(15)); st('end')
    print(ev("localStorage.getItem('camAdventure_v2')"))
    b.close()
print('\n'.join(logs[-10:]))
