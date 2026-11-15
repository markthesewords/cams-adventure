import sys, json
from playwright.sync_api import sync_playwright
logs=[]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome')
    pg=b.new_page(viewport={'width':1280,'height':720})
    pg.on('pageerror',lambda e:logs.append('PAGEERR '+str(e)))
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html'); pg.wait_for_timeout(700)
    pg.evaluate("localStorage.clear(); localStorage.setItem('camAdventure_meta',JSON.stringify({ach:{},best:{},name:'TESTER',id:'testdevice1'}))"); pg.reload(); pg.wait_for_timeout(700)
    ev=pg.evaluate
    def st(tag): print(tag, ev("JSON.stringify({ch:S.chapter,goal:S.goal,dlg:S.dlg&&S.dlg.text.slice(0,40),lock:S.lock,x:Math.round(P.x),y:Math.round(P.y),sheet:P.sheet})"))
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
            for _ in range(140):
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
    def pick(n):
        pg.wait_for_timeout(600)
        for _ in range(n): pg.keyboard.press('ArrowDown'); pg.wait_for_timeout(70)
        pg.keyboard.press('z')
    ev('S.fast=true'); pg.keyboard.press('z'); print(settle(30,"S.flags.stage===0")); shot('h1_crib')
    pg.keyboard.press('z'); print(settle(20,"S.flags.stage===2"))
    pg.keyboard.press('z'); print(settle(40,"S.chapter===2&&S.lock===0")); st('ch2'); shot('h2_room')
    # outfit change with Grace still in the room / or whoever
    go([(60,122)]); face('ArrowDown'); pg.keyboard.press('z'); pg.wait_for_timeout(1200); shot('h3_picker'); pg.keyboard.press('ArrowRight'); pg.wait_for_timeout(200); pg.keyboard.press('z')
    for i in range(60):
        pg.wait_for_timeout(300)
        if ev("P.carry?1:0") and i%6==0: shot('h3b_dress')
        if ev("S.dlg?1:0"): pg.keyboard.press('z')
        if ev("S.lock===0&&!S.mini"): break
    st('dressed')
    go([(120,124),(120,204),(270,204),(440,210),(452,300),(460,298)]); face('ArrowRight'); pg.keyboard.press('z'); print(settle()); st('vinny')
    go([(452,300),(452,172),(404,172),(404,124),(345,124),(338,94)]); face('ArrowUp'); pg.keyboard.press('z'); print(settle()); st('dad')
    # try to walk through Grace
    go([(345,96)]); pg.keyboard.down('ArrowRight'); pg.wait_for_timeout(900); pg.keyboard.up('ArrowRight'); st('pushed at grace (grace x=%s)'%ev("Math.round(NPC.grace.x)")); shot('h4_block')
    go([(345,124),(378,124),(414,124),(414,78),(404,78)]); face('ArrowLeft'); pg.keyboard.press('z'); r=settle(); st('bfast '+r); shot('h5_food')
    for k in [0,1,2,2,3]:
        pick(k)
        if k==3:
            pg.wait_for_timeout(1250); shot('h6_toss'); pg.wait_for_timeout(1500); shot('h6b_chase')
        r=settle(30,"S.lock===0")
    shot('h7_cup')
    for k in [0,1,0,1,0]:
        if ev("S.dlg&&S.dlg.choices?1:0"): pick(k); r=settle(40,"S.lock===0")
    st('after eating '+r); shot('h8_down')
    seen=set()
    for _ in range(260):
        pg.wait_for_timeout(400)
        if ev("S.dlg?1:0"):
            if 'say' not in seen: seen.add('say'); shot('h9_nick_says')
            pg.keyboard.press('z')
        if ev("S.cleaning") and 'cl' not in seen: seen.add('cl'); pg.wait_for_timeout(2500); shot('h8b_clean')
        if ev("S.flags.nickPoop") and ev("S.lock===0"): break
    st('nick in bathroom'); shot('h10_free')
    # bathroom door
    go([(452,206),(170,204),(168,192)]); face('ArrowUp'); pg.keyboard.press('z'); pg.wait_for_timeout(900); shot('h11_poop'); print(settle())
    # chest climb
    go([(300,204),(320,330),(326,330)]); face('ArrowRight'); pg.keyboard.press('z'); pg.wait_for_timeout(1800); shot('h12_chest'); r=settle(10); pick(0); pg.wait_for_timeout(700); shot('h13_jump'); pg.wait_for_timeout(1400); shot('h13b_crawl'); print(settle()); st('chest done')
    # DJ
    go([(452,300),(452,330),(482,338)]); face('ArrowDown'); shot('h14_toy_north'); pg.keyboard.press('z'); pg.wait_for_timeout(500)
    keys={'0':'ArrowUp','1':'ArrowRight','2':'ArrowDown','3':'ArrowLeft'}
    for _ in range(500):
        if ev("S.dlg?1:0"): pg.keyboard.press('z')
        elif ev("S.mini&&S.mini.seq?1:0"):
            if ev("S.mini.phase")=='play':
                k=ev("String(S.mini.seq[S.mini.pos])"); pg.keyboard.press(keys[k])
        elif ev("S.flags.dadOut&&S.lock===0"): break
        pg.wait_for_timeout(200)
    st('dad out')
    go([(452,330),(452,170),(412,150),(410,58)]); face('ArrowUp'); pg.keyboard.press('z')
    took=set()
    for i in range(500):
        if ev("S.dlg?1:0"): pg.keyboard.press('z')
        if ev("S.mini&&!S.mini.seq?1:0"):
            if ev("P.running?1:0") and 'run' not in took: took.add('run'); shot('h15_tvrun')
            if ev("NPC.nick.zBias>=90") and 'sit' not in took: took.add('sit'); pg.wait_for_timeout(600); shot('h16_tvsit')
            if ev("S.dlg?0:1") and ev("S.fade<0.1") and ev("NPC.nick.zBias>=90?0:1") and 'pick' not in took and ev("S.chapter===3?1:0"): took.add('pick'); shot('h17_pick930'); pg.keyboard.press('z')
        if ev("S.chapter===3&&S.lock===0"): break
        pg.wait_for_timeout(250)
    st('ch3 '+str(sorted(took))); shot('h18_930')
    b.close()
print('\n'.join(logs[-10:]))
