import sys
from playwright.sync_api import sync_playwright
KM={'left':'ArrowLeft','up':'ArrowUp','right':'ArrowRight','down':'ArrowDown','a':'z','b':'x'}
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--autoplay-policy=no-user-gesture-required']); errs=[]
    for (si,di,li,label,maxs) in [(0,0,None,'sunny easy',45),(1,2,0,'shine hard 1min',70),(2,1,0,'brother med 1min',70)]:
        pg=b.new_page(viewport={'width':1280,'height':720}); pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('file:///home/claude/game/build/Cams_Adventure.html#drums'); pg.wait_for_timeout(1500); pg.keyboard.press('z'); pg.wait_for_timeout(900)
        ev=pg.evaluate; press=pg.keyboard.press
        print(label,'phase',ev("S.mini&&S.mini.G.phase"), ev("S.mini.G.menu&&S.mini.G.menu.title"))
        if si==0: pg.screenshot(path='/tmp/shots/sg_pick.png')
        for _ in range(si): press('ArrowDown'); pg.wait_for_timeout(120)
        pg.wait_for_timeout(300); press('z'); pg.wait_for_timeout(500)
        if si==1: pg.screenshot(path='/tmp/shots/sg_diff.png')
        for _ in range(di): press('ArrowDown'); pg.wait_for_timeout(120)
        press('z'); pg.wait_for_timeout(500)
        if li is not None:
            if si==1: pg.screenshot(path='/tmp/shots/sg_len.png')
            press('z')
        import time; t0=time.time(); n=0; shots=0
        while time.time()-t0<maxs+12:
            ph=ev("S.mini&&S.mini.drums?S.mini.G.phase:'x'")
            if ph in('end','x'): break
            if ph=='song':
                d=ev("(()=>{const G=S.mini.G, st=G.live?AC.currentTime-G.t0:G.pT-1.5; return G.notes.filter(n=>!n.hit&&!n.miss&&Math.abs(n.t-st)<0.07).map(n=>S.mini.PADS[n.p].key)})()")
                for k in d: press(KM[k]); n+=1
                if shots==0 and time.time()-t0>12: pg.screenshot(path=f'/tmp/shots/sg_song{si}.png'); shots=1
            pg.wait_for_timeout(20)
        print('  ',round(time.time()-t0,1),'s', ev("JSON.stringify({ph:S.mini.G.phase,live:S.mini.G.live,limit:S.mini.G.limit,notes:S.mini.G.notes.length,perf:S.mini.G.perfect,good:S.mini.G.good,miss:S.mini.G.miss,score:S.mini.G.score,label:S.mini.G.song,ac:AC&&AC.state})"))
        if si==0: pg.wait_for_timeout(800); pg.screenshot(path='/tmp/shots/sg_end.png')
        pg.close()
    print(errs); b.close()
