from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome'); errs=[]
    pg=b.new_page(viewport={'width':390,'height':844}); pg.on('pageerror',lambda e:errs.append(str(e))); ev=pg.evaluate
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html'); pg.wait_for_timeout(1200)
    print(ev("ARCADE.map(a=>a.id).join(',')"), ev("DEV_LIST.filter(d=>/diaper/.test(d.id)).length"), ev("typeof diaperGame"))
    # play the 5:30 scene straight through and make sure it reaches free play with no mini game
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html#ch1'); pg.wait_for_timeout(1200); pg.keyboard.press('z')
    mini=False
    for i in range(240):
        if ev("S.mini&&S.mini.full?1:0"): mini=True
        if ev("S.dlg?1:0"): ev("pressed.a=true")
        if ev("S.chapter>=2||(!S.cut&&!S.dlg&&S.fade<0.05&&S.lock===0&&!S.title&&S.goal)?1:0") and i>20: break
        pg.wait_for_timeout(250)
    print('reached',ev("JSON.stringify({ch:S.chapter,goal:S.goal,clock:S.clock})"),'mini seen:',mini,errs); b.close()
