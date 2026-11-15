import json
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome'); pg=b.new_page(viewport={'width':1280,'height':720}); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html'); pg.wait_for_timeout(600); ev=pg.evaluate
    ev("S.title=false; S.titleRes&&S.titleRes()"); pg.wait_for_timeout(300)
    ev("(()=>{ S.lock=0; S.dlg=null; S.inv=['monkey']; S.flags={ch1done:true,ch2done:true,dj:true}; chapter3(); })()")
    def settle(maxs=30, until="S.lock===0"):
        pg.wait_for_timeout(350)
        for _ in range(int(maxs*4)):
            if ev("S.mini&&!S.dlg?1:0"): pg.keyboard.press('ArrowRight'); pg.wait_for_timeout(150); pg.keyboard.press('z')
            elif ev("S.dlg?1:0"):
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
            else: print('STUCK going to',tx,ty,'at',ev("[Math.round(P.x),Math.round(P.y)]"), ev("JSON.stringify([NPC.nick.x,NPC.nick.y,!!NPC.nick.path])"))
    print(settle(40)); print('after change', ev("JSON.stringify([P.x,P.y,NPC.nick.x,NPC.nick.y])"))
    # change clothes again at the table, then try to leave
    go([(60,122)]); pg.keyboard.press('ArrowDown'); pg.keyboard.press('z'); print(settle(40)); pg.wait_for_timeout(300)
    print('dressed', ev("JSON.stringify([Math.round(P.x),Math.round(P.y),Math.round(NPC.nick.x),Math.round(NPC.nick.y),NPC.grace.x,P.sheet])")); pg.screenshot(path='/tmp/shots/a0.png')
    pg.keyboard.down('Shift'); go([(120,126),(120,204),(300,208)]); pg.keyboard.up('Shift')
    r=settle(30); print('lick', r)
    if r=='choice':
        for _ in range(3): pg.keyboard.press('ArrowDown'); pg.wait_for_timeout(80)
        pg.keyboard.press('z')
    print(settle(10)); acts={}
    for i in range(150):
        pg.wait_for_timeout(1000)
        d=json.loads(ev("JSON.stringify({n:[Math.round(NPC.nick.x),Math.round(NPC.nick.y),NPC.nick.lastAct,NPC.nick.visible,!!NPC.nick.inBath,NPC.nick.away||''],g:[Math.round(NPC.grace.x),Math.round(NPC.grace.y),NPC.grace.lastAct,NPC.grace.visible,!!NPC.grace.inBath,NPC.grace.away||'']})"))
        for k in 'ng':
            key=k+':'+str(d[k][2])+('/bath' if d[k][4] else '')+('/'+d[k][5] if d[k][5] else '')
            if key not in acts: acts[key]=i; print(i,key,d[k]);
        if i in (20,60,100,140): pg.screenshot(path=f'/tmp/shots/a{i}.png')
    print(errs); b.close()
