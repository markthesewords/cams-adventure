from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome'); errs=[]
    pg=b.new_page(viewport={'width':390,'height':844}); pg.on('pageerror',lambda e:errs.append(str(e))); ev=pg.evaluate
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html#ch1'); pg.wait_for_timeout(1500)
    pass
    for i in range(260):
        pg.keyboard.press('z'); pg.wait_for_timeout(400)
        if ev("S.flags.stage===2&&!S.dlg&&!S.lock"): break
    print('stage',ev("S.flags.stage"))
    pg.keyboard.press('z')
    for t,n in [(1800,'walk'),(1700,'held'),(1600,'lying')]:
        pg.wait_for_timeout(t); pg.locator('#c').screenshot(path=f'/tmp/shots/mk_{n}.png'); print(n,ev("S.flags.monkeyHeld"),ev("P.lying"))
    pg.wait_for_timeout(6000); print('after',ev("S.chapter"),ev("MZ.cur"))
    print(errs); b.close()
