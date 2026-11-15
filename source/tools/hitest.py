import json
from playwright.sync_api import sync_playwright
FULL={'ch':6,'pt':'yard','inv':['monkey'],'flags':{'ch1done':True,'ch2done':True,'dj':True,'outings':2,'lastOut':'park','gotMom':True,'pmStage':6,'bs':{'guitar':True,'cube':True,'bed':True},'bsReady':True,'bsDone':True,'yard':True,'outfit':'play'}}
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome'); pg=b.new_page(viewport={'width':390,'height':844}); ev=pg.evaluate
    pg.add_init_script("if(!sessionStorage.getItem('seeded')){ sessionStorage.setItem('seeded','1'); localStorage.setItem('camAdventure_v2',%s); }"%json.dumps(json.dumps(FULL)))
    def menu():
        pg.goto('about:blank'); pg.goto('file:///home/claude/game/build/Cams_Adventure.html'); pg.wait_for_timeout(1300); ev("pressed.a=true"); pg.wait_for_timeout(1200); ev("S.dlg.sel=0; pressed.a=true"); pg.wait_for_timeout(1200); return ev("S.dlg.choices")
    ch=menu(); ev(f"S.dlg.sel={ch.index('Lunch')}; pressed.a=true"); pg.wait_for_timeout(4000)
    print('after restarting at Lunch:',menu(), ev("S.titleSub")); b.close()
