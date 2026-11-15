from playwright.sync_api import sync_playwright
import sys
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome'); errs=[]
    pg=b.new_page(viewport={'width':390,'height':844}); pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None); ev=pg.evaluate
    for t in sys.argv[1:]:
        pg.goto('about:blank'); pg.goto('file:///home/claude/game/build/Cams_Adventure.html'); pg.wait_for_timeout(800); ev(f"sessionStorage.setItem('cam_warp','{t}')"); pg.reload(); pg.wait_for_timeout(1500)
        ev("pressed.a=true"); pg.wait_for_timeout(6000)
        print(t,ev("JSON.stringify([S.chapter,S.clock,!!S.title,!!S.dlg,S.dlg&&S.dlg.text,!!S.mini,S.cut,S.fade,sessionStorage.getItem('cam_warp'),location.hash])"),errs)
    b.close()
