from playwright.sync_api import sync_playwright
import json
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome'); errs=[]
    pg=b.new_page(viewport={'width':390,'height':844}); pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None); ev=pg.evaluate
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html'); pg.wait_for_timeout(1200)
    ev("(()=>{ window.parkOuting=async()=>{ await fadeTo(1,300); setMap('house'); return {}; }; window.__b=0; S.title=false; S.flags={ch1done:true,ch2done:true,amWalk:true,outings:1,gotMom:true}; S.cut=true; S.fade=1; resumePmOut().then(()=>window.__b=1).catch(e=>window.__e=String(e)); })()")
    for i in range(160):
        s=ev("JSON.stringify({d:S.dlg?S.dlg.text:null,ch:S.dlg&&S.dlg.choices,goal:S.goal,clk:S.clock,b:window.__b,e:window.__e||null,g:[NPC.grace.x|0,NPC.grace.y|0,!!NPC.grace.path],P:[P.x|0,P.y|0,!!P.carry],fade:S.fade.toFixed(1),mini:!!S.mini})")
        if i%8==0: print(s)
        if ev("S.dlg?1:0"): ev("pressed.a=true")
        if ev("window.__b===1&&!S.dlg&&S.goal.indexOf('Daddy')>=0"): print('DONE',s); break
        pg.wait_for_timeout(250)
    pg.screenshot(path='/tmp/shots/fl_pm.png'); print(errs[:5]); b.close()
