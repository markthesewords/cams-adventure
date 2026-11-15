from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome'); pg=b.new_page(viewport={'width':390,'height':844}); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); ev=pg.evaluate
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html#cub'); pg.wait_for_timeout(1500)
    ev("void (S.title=false,S.mini=null,S.dlg=null,window.__c='none',(async()=>{ await say('Mom','This is a long line that the player skips by pressing the button early.'); window.__c=await choose('Pick one',['First','Second','Third']); })())")
    pg.wait_for_timeout(300)
    for i in range(4): ev("pressed.a=true"); pg.wait_for_timeout(110)
    print('after mashing (should be none, choices showing):',ev("window.__c"),ev("!!(S.dlg&&S.dlg.choices)"))
    pg.wait_for_timeout(700); ev("pressed.down=true"); pg.wait_for_timeout(100); ev("pressed.a=true"); pg.wait_for_timeout(200); print('deliberate pick:',ev("window.__c"),errs); b.close()
