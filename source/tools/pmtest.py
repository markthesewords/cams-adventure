import sys, json
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome'); pg=b.new_page(viewport={'width':1280,'height':720})
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html#nap'); pg.wait_for_timeout(600); pg.evaluate("localStorage.clear()")
    ev=pg.evaluate; press=pg.keyboard.press; press('z')
    pg.wait_for_timeout(500); pg.evaluate("window._clip={}; setInterval(()=>{ for(const k of ['grace','nick']){ const e=NPC[k]; if(e.visible&&e.path&&e.path.length&&!stepFree(e.x,e.y)&&P.carry!==e){ const key=k+'@'+Math.round(e.x/16)+','+Math.round(e.y/16); window._clip[key]=(window._clip[key]||0)+1; } } },50)")
    def shot(n): pg.screenshot(path=f'/tmp/shots/pm_{n}.png')
    def settle(maxs=60, until="S.lock===0&&S.fade<0.05"):
        pg.wait_for_timeout(350)
        for _ in range(int(maxs*4)):
            if ev("S.dlg?1:0"):
                if ev("S.dlg.choices?1:0"): return 'choice'
                press('z')
            elif ev(until): return 'ok'
            pg.wait_for_timeout(250)
        return 'timeout'
    def go(pts):
        for tx,ty in pts:
            for _ in range(160):
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
            else: print('STUCK',tx,ty,ev("[Math.round(P.x),Math.round(P.y)]"))
    def st(t): print(t, ev("JSON.stringify({ch:S.chapter,goal:S.goal,pm:S.flags.pmStage,lock:S.lock,x:Math.round(P.x),y:Math.round(P.y)})"))
    print(settle()); st('home')
    go([(312,206),(120,206),(120,124),(60,124),(40,90),(34,87)]); press('ArrowUp'); pg.wait_for_timeout(80); press('z'); pg.wait_for_timeout(6000); shot('nap_carry'); 
    for i in range(60):
        if ev("S.dlg?1:0"): press('z')
        if i==14: shot('nap_read')
        if ev("S.chapter===4&&S.flags.pmStage===0&&S.lock===0"): break
        pg.wait_for_timeout(400)
    st('ch4'); shot('wake')
    for i in range(4): press('z'); pg.wait_for_timeout(900)
    shot('yell'); print(settle(60,"S.flags.pmStage===2&&S.lock===0&&S.fade<0.05")); st('up'); pg.wait_for_timeout(9000)
    go([(120,124),(120,212),(330,214),(404,180),(404,124),(410,124)]); press('ArrowRight'); pg.wait_for_timeout(80); press('z'); pg.wait_for_timeout(5000); shot('lunch_carry')
    for i in range(300):
        if ev("S.dlg?1:0"):
            if ev("S.dlg.choices?1:0"):
                pg.wait_for_timeout(600); n=ev("window._lc=(window._lc||0)+1")
                if n==1: shot('lunch_menu')
                for _ in range({1:0,2:3,3:1,4:5}.get(n,5)): press('ArrowDown'); pg.wait_for_timeout(80)
                press('z')
                if n==2: pg.wait_for_timeout(1500); shot('lunch_toss')
                if n==3: pg.wait_for_timeout(500); shot('lunch_veg')
            else: press('z')
        if ev("S.flags.pmStage===4&&S.lock===0"): break
        if i==70: shot('lunch_mid')
        if ev("!!S.camFocus") and not getattr(sys,'_d',0): sys._d=1; pg.wait_for_timeout(1500); shot('door')
        pg.wait_for_timeout(300)
    st('find dad'); shot('snack')
    go([(452,318),(452,172),(404,172),(404,124),(345,124),(345,74),(300,74),(264,74)]); press('ArrowLeft'); pg.wait_for_timeout(80); press('z'); pg.wait_for_timeout(1500); shot('ohoh')
    for i in range(120):
        if ev("S.dlg?1:0"): press('z')
        if i==40: shot('stairs')
        if ev("S.flags.pmStage===6&&S.lock===0"): break
        pg.wait_for_timeout(300)
    st('end'); shot('end'); print('CLIP',ev('JSON.stringify(window._clip)')); print(ev("localStorage.getItem('camAdventure_v2')"), errs)
    b.close()
