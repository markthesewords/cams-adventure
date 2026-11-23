from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--autoplay-policy=no-user-gesture-required']); errs=[]
    pg=b.new_page(viewport={'width':390,'height':844}); pg.on('pageerror',lambda e:errs.append(str(e))); ev=pg.evaluate
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html'); pg.wait_for_timeout(1500)
    ev("audioKick()"); pg.wait_for_timeout(1500); print('title',ev("MZ.cur"), ev("MZ.g&&MZ.g.gain.value.toFixed(3)"))
    ev("(()=>{S.title=false; S.chapter=1; S.flags.amMusic=false; S.clock='5:30 AM'})()"); pg.wait_for_timeout(2500); print('crib',ev("MZ.cur"))
    ev("(()=>{S.flags.amMusic=true; S.clock='7:00 AM'})()"); pg.wait_for_timeout(1500); print('am',ev("MZ.cur"),ev("uiMode()"),ev("MZ.g&&MZ.g.gain.value.toFixed(3)"))
    ev("(()=>{S.clock='2:00 PM'})()"); pg.wait_for_timeout(1500); print('pm',ev("MZ.cur"))
    ev("(()=>{setMap('park')})()"); pg.wait_for_timeout(1500); print('park',ev("MZ.cur"))
    ev("(()=>{setMap('house'); void treadGame(0)})()"); pg.wait_for_timeout(1500); print('tread',ev("MZ.cur"),ev("MZ.over"))
    ev("(()=>{S.mini=null; MZ.over=null; void drumGame({replay:true})})()"); pg.wait_for_timeout(2000); print('drums',ev("MZ.cur"))
    print(errs); b.close()
