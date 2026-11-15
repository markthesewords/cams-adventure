import sys
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome'); errs=[]
    for mode in sys.argv[1:] or ['idle','hold','tap']:
        pg=b.new_page(viewport={'width':1280,'height':720}); pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('file:///home/claude/game/build/Cams_Adventure.html#bsmt'); pg.wait_for_timeout(900); pg.keyboard.press('z')
        for _ in range(160):
            if pg.evaluate('S.dlg?1:0'): pg.keyboard.press('z')
            elif pg.evaluate('S.lock===0&&S.fade<0.05&&!S.mini&&!S.dlg'): break
            pg.wait_for_timeout(250)
        pg.evaluate("S.cut=true; S.fade=0; window._r=null; void slideBig().then(r=>{window._r={score:r.score,dist:r.dist,stars:r.stars,total:r.total,t:r.rideT,air:r.airTotal,perf:r.perfect,humps:r.humps}; })")
        i=0; down=False
        while not pg.evaluate("!!window._r") and i<700:
            want = mode=='hold' or (mode=='tap' and (i//6)%2==0)
            if want!=down:
                (pg.keyboard.down if want else pg.keyboard.up)('z'); down=want
            if mode in('hold','idle') and i in (25,45,70,110,160,230): pg.screenshot(path=f'/tmp/shots/bg_{mode}_{i}.png')
            pg.wait_for_timeout(100); i+=1
        pg.screenshot(path=f'/tmp/shots/bg_{mode}_end.png')
        print(mode, pg.evaluate("JSON.stringify(window._r)"), pg.evaluate("S.mini&&S.mini.G?JSON.stringify({ph:S.mini.G.phase,x:S.mini.G.x|0,y:S.mini.G.y|0,gnd:S.mini.G.gnd,v:S.mini.G.v|0,vx:S.mini.G.vx|0,vy:S.mini.G.vy|0,c:S.mini.G.charge,h:S.mini.G.humps}):'-'")); pg.close()
    print(errs); b.close()
