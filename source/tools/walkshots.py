import sys
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome'); pg=b.new_page(viewport={'width':1280,'height':720})
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html#walk'); pg.wait_for_timeout(600); ev=pg.evaluate; press=pg.keyboard.press
    press('z')
    for _ in range(40):
        if ev("S.mini&&S.mini.G?1:0"): break
        if ev("S.dlg?1:0"): press('z')
        pg.wait_for_timeout(200)
    pg.wait_for_timeout(2600)
    ev("S.mini.G.scroll=260"); pg.wait_for_timeout(700); pg.screenshot(path='/tmp/shots/w1.png')
    ev("(()=>{const G=S.mini.G; const t=G.tg.find(t=>['car','truck','bus'].includes(t.kind)&&t.state==='wait'); G.scroll=t.d-(WALK.X+30)-18;})()"); pg.wait_for_timeout(300); pg.screenshot(path='/tmp/shots/w2.png')
    ev("(()=>{const G=S.mini.G; const e=G.world.els.find(e=>e.corner); G.scroll=e.d-(WALK.X+30)-4;})()"); pg.wait_for_timeout(900); pg.screenshot(path='/tmp/shots/w3.png'); pg.wait_for_timeout(1500)
    ev("(()=>{const G=S.mini.G; G.score=5000; for(const e of G.world.els) e.turned=true; const e=G.world.els.find(e=>e.tag==='ryan'); G.scroll=e.d+30-(WALK.X+30); G.stage=3;})()")
    n=0
    for i in range(200):
        if ev("S.dlg?1:0"):
            pg.wait_for_timeout(500); pg.screenshot(path=f'/tmp/shots/w_ryan{n}.png'); n+=1; press('z'); pg.wait_for_timeout(250); press('z')
        if ev("S.mini&&S.mini.G&&S.mini.G.phase==='camwalk'?1:0"): break
        pg.wait_for_timeout(150)
    pg.keyboard.down('ArrowRight'); pg.wait_for_timeout(1500); pg.screenshot(path='/tmp/shots/w_camwalk.png'); pg.keyboard.up('ArrowRight')
    print(errs, n); b.close()
