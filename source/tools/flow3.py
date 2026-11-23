from playwright.sync_api import sync_playwright
import json
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome'); errs=[]
    pg=b.new_page(viewport={'width':390,'height':844}); pg.on('pageerror',lambda e:errs.append(str(e))); ev=pg.evaluate
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html'); pg.wait_for_timeout(1200)
    ev("(()=>{ S.title=false; S.chapter=2; S.clock='7:00 AM'; S.flags={ch1done:true,metDad:true}; for(const k of ['nick','grace','vinny']) NPC[k].visible=true; NPC.nick.x=tx(22); NPC.nick.y=ty(5); NPC.grace.x=tx(22); NPC.grace.y=ty(4); P.x=OBJ.stool0.x+10; P.y=OBJ.stool0.y+24; P.sheet=camSheet(); S.cut=true; S.fade=0; window.__d=0; breakfast(OBJ.stool0).then(()=>{ S.cut=false; window.__d=1; }).catch(e=>window.__e=String(e)); })()")
    seen=set(); picks=0; n=0
    for i in range(700):
        s=json.loads(ev("JSON.stringify({d:S.dlg?S.dlg.text:null,ch:S.dlg&&S.dlg.choices,clk:S.clock,mini:!!S.mini,walk:!!(S.mini&&S.mini.G&&S.mini.G.phase),e:window.__e||null,d2:window.__d,tl:document.getElementById('tl').dataset.at})"))
        if s['d'] and s['d'] not in seen: seen.add(s['d']); print('DLG',s['d'][:70],s['ch'] or '','tl',s['tl'])
        if s['ch']:
            pg.wait_for_timeout(700); ev("S.dlg.sel=%d; pressed.a=true"%(0 if picks<2 else 5)); picks+=1; pg.wait_for_timeout(900)
        elif s['d']: ev("pressed.a=true")
        elif s['mini']:
            if 'walk' not in seen and s['walk']: seen.add('walk'); print('walk game on, tl',s['tl']); pg.locator('#c').screenshot(path='/tmp/shots/fl_walk.png')
            ev("pressed.a=true")
        if s['d2']==1: print('done',s); break
        if s['e']: print('ERR',s['e']); break
        pg.wait_for_timeout(200)
    print('final',ev("JSON.stringify({clk:S.clock,ch:S.chapter,pt:S.pt,tl:document.getElementById('tl').innerText.replace(/\\n/g,' '),P:[P.x|0,P.y|0],vin:[NPC.vinny.x|0,NPC.vinny.y|0]})"),errs[:3]); pg.locator('#c').screenshot(path='/tmp/shots/fl_home.png'); b.close()
