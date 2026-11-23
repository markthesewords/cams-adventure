from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome'); errs=[]
    pg=b.new_page(viewport={'width':390,'height':844}); pg.on('pageerror',lambda e:errs.append(str(e))); ev=pg.evaluate
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html'); pg.wait_for_timeout(1200)
    ev("(()=>{S.title=false; S.chapter=3; S.light='day'; S.cut=true; for(const k in NPC) NPC[k].visible=false; P.sheet=camSheet(); P.visible=true; S.fade=0;})()")
    for clk,(x,y),n in [('8:00 AM',(20*16,90),'am_kitchen'),('8:00 AM',(6*16,80),'am_cam'),('5:30 PM',(24*16,360),'pm_living'),('5:30 PM',(4*16,360),'pm_bed'),('12:30 PM',(24*16,360),'noon_living')]:
        ev(f"(()=>{{S.clock='{clk}'; S.sunH=null; P.x={x}; P.y={y}; S.snapCam=true;}})()"); pg.wait_for_timeout(500)
        pg.locator('#c').screenshot(path=f'/tmp/shots/sun_{n}.png')
    print(errs); b.close()
