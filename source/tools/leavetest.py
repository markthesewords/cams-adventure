from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome'); pg=b.new_page(viewport={'width':1280,'height':720})
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html#nap'); pg.wait_for_timeout(900); ev=pg.evaluate; press=pg.keyboard.press; press('z')
    def settle():
        for _ in range(80):
            if ev("S.dlg&&!S.dlg.choices?1:0"): press('z')
            elif ev("S.lock===0&&S.fade<0.05&&!S.mini&&!S.dlg"): return
            pg.wait_for_timeout(250)
    settle(); pg.evaluate("window._clip={}; setInterval(()=>{ for(const k of ['grace','nick']){ const e=NPC[k]; if(e.visible&&e.path&&e.path.length&&!boxFree(e.x,e.y,4,2)){ const key=k+'@'+Math.round(e.x/16)+','+Math.round(e.y/16); window._clip[key]=(window._clip[key]||0)+1; } } },50)")
    for which,idx in (('park',2),('walk',0)):
        ev("void pickOuting()"); pg.wait_for_timeout(900)
        for _ in range(idx): press('ArrowDown'); pg.wait_for_timeout(100)
        press('z'); pg.wait_for_timeout(700)
        for i in range(40):
            if ev("S.dlg&&!S.dlg.choices?1:0"): press('z')
            if ev("P.carry?1:0") and i%6==5: pg.screenshot(path=f'/tmp/shots/lv_{which}_{i}.png')
            if ev("S.fade>0.9"): break
            pg.wait_for_timeout(300)
        print(which,'left', ev("JSON.stringify({carry:!!P.carry,fade:S.fade,map:S.map})"))
        if which=='walk': break
        pg.wait_for_timeout(3500); settle(); print('in park',ev("JSON.stringify({carry:!!P.carry,map:S.map,x:P.x,y:P.y,lock:S.lock})"))
        ev("S.flags.parkDone=true"); pg.wait_for_timeout(1800); pg.screenshot(path='/tmp/shots/lv_back0.png'); pg.wait_for_timeout(1200); pg.screenshot(path='/tmp/shots/lv_back1.png')
        settle(); print('home',ev("JSON.stringify({carry:!!P.carry,map:S.map,x:Math.round(P.x),y:Math.round(P.y),goal:S.goal})"))
        pg.wait_for_timeout(9000); pg.screenshot(path='/tmp/shots/lv_back2.png'); settle()
    print('CLIP',ev('JSON.stringify(window._clip)'),errs); b.close()
