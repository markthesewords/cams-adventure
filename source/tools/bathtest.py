from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome'); pg=b.new_page(viewport={'width':1280,'height':720}); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html'); pg.wait_for_timeout(600); ev=pg.evaluate
    # jump straight to "breakfast just ended", Cam in the living room
    ev("""(async()=>{ S.title=false; S.titleRes&&S.titleRes(); })()"""); pg.wait_for_timeout(300)
    ev("""(()=>{ S.fast=true; S.lock=0; S.dlg=null; S.fade=0;S.fadeTarget=0; S.fadeText=null; S.chapter=2; S.clock='7:00 AM'; S.light='day'; S.flags={ch1done:true,metDad:true,vinnyAwake:true,ch2done:true,stage:9}; S.bounds=null; S.noCollide=false; cribFront(false); P.lying=false; P.sheet=camSheet();
      P.x=tx(27); P.y=ty(14); for(const k in NPC) NPC[k].visible=true; NPC.nick.x=tx(20)+6; NPC.nick.y=ty(4); NPC.grace.x=tx(22); NPC.grace.y=ty(4); NPC.vinny.x=tx(27); NPC.vinny.y=ty(16); doors.cam=true; noise(0,0.1); vinnyRoutine(); })()""")
    seen=set()
    for i in range(400):
        pg.wait_for_timeout(300)
        if ev("S.dlg?1:0"):
            if ev("S.dlg.name")=='Dad' and 'd' not in seen: seen.add('d'); pg.wait_for_timeout(500); pg.screenshot(path='/tmp/shots/b1_says.png')
            pg.keyboard.press('z')
        if ev("NPC.nick.x<tx(13)&&NPC.nick.y<ty(9)") and 'in' not in seen: seen.add('in'); pg.wait_for_timeout(1500); pg.screenshot(path='/tmp/shots/b2_toilet.png')
        if ev("S.flags.nickPoop&&S.lock===0"): break
    print(seen, ev("JSON.stringify([S.goal,doors.bath,S.lock,Math.round(S.cam.x)])"))
    ev("P.x=tx(10); P.y=ty(11)+6; P.dir='up'"); pg.wait_for_timeout(400); pg.keyboard.press('z'); pg.wait_for_timeout(1300); pg.screenshot(path='/tmp/shots/b3_poop.png'); print(ev("S.dlg&&S.dlg.text"))
    print(errs); b.close()
