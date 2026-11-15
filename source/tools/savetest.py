import json
from playwright.sync_api import sync_playwright
FULL={'ch':6,'pt':'yard','inv':['monkey'],'flags':{'ch1done':True,'ch2done':True,'dj':True,'outings':2,'lastOut':'park','gotMom':True,'pmStage':6,'bs':{'guitar':True,'cube':True,'bed':True},'bsReady':True,'bsDone':True,'yard':True,'outfit':'play'}}
CASES=[(FULL,l) for l in ['Continue: the backyard','Emory is here','The drums','The basement','After lunch','Lunch','1:30 PM (nap is over)','Home after the outing','9:30 AM','7:00 AM']]
CASES+=[({'ch':5,'pt':'bs','inv':['monkey'],'flags':{'ch1done':True,'ch2done':True,'dj':True,'outings':1,'gotMom':True,'pmStage':6,'bs':{'guitar':True},'outfit':'play'}},'Continue: the basement (1 of 3 toys)'),
        ({'ch':4,'pt':'lunch','inv':['monkey'],'flags':{'ch1done':True,'ch2done':True,'dj':True,'outings':1,'gotMom':True,'pmStage':2,'outfit':'play'}},'Continue: lunch'),
        ({'ch':3,'pt':'home','inv':['monkey'],'flags':{'ch1done':True,'ch2done':True,'dj':True,'outings':1,'lastOut':'cub','didCub':True,'gotMom':True,'outfit':'play'}},'Continue: back from Cub Foods')]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome')
    for k,(sv,label) in enumerate(CASES):
        ctx=b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True,device_scale_factor=2); pg=ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:150])); ev=pg.evaluate
        pg.add_init_script("if(!sessionStorage.getItem('seeded')){ sessionStorage.setItem('seeded','1'); localStorage.setItem('camAdventure_v2',%s); }"%json.dumps(json.dumps(sv)))
        pg.goto('file:///home/claude/game/build/Cams_Adventure.html'); pg.wait_for_timeout(1300); sub=ev("S.titleSub"); ev("pressed.a=true"); pg.wait_for_timeout(1200)
        ev("S.dlg.sel=0; pressed.a=true"); pg.wait_for_timeout(1200)
        ch=ev("S.dlg&&S.dlg.choices")
        if not ch or label not in ch: print('MISSING',label,ch,sub); ctx.close(); continue
        if k in (0,10): pg.screenshot(path=f'/tmp/shots/sv_menu{k}.png')
        ev(f"S.dlg.sel={ch.index(label)}; pressed.a=true"); 
        for i in range(40):
            pg.wait_for_timeout(500)
            if ev("S.dlg&&!S.dlg.choices?1:0"): ev("pressed.a=true")
            if ev("document.body.dataset.mode")=='walk' and i>6: break
        st=ev("JSON.stringify([S.chapter,S.clock,document.body.dataset.mode,(S.goal||'').slice(0,34),Math.round(P.x),Math.round(P.y),!!S.mini,S.fade,(loadSave()||{}).pt])")
        free=ev("(()=>{ try{ return typeof blocked==='function'?!blocked(P.x,P.y):'?' }catch(e){ return 'err' } })()")
        pg.screenshot(path=f'/tmp/shots/sv_{k}.png'); print(f'{k:2} [{sub}] {label} ->',st,errs); ctx.close()
    b.close()
