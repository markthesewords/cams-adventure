import os
from playwright.sync_api import sync_playwright
PH=bool(os.environ.get('PHONE'))
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome'); pg=b.new_page(viewport=({'width':390,'height':844} if PH else {'width':1280,'height':720}),has_touch=PH,is_mobile=PH)
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html#nap'); pg.wait_for_timeout(900); ev=pg.evaluate; press=pg.keyboard.press; press('z')
    sfx='_ph' if PH else ''
    def shot(n): pg.screenshot(path=f'/tmp/shots/gl_{n}{sfx}.png')
    pg.wait_for_timeout(2500); shot('cut_dialog')
    for _ in range(40):
        if ev("S.dlg&&!S.dlg.choices?1:0"): press('z')
        elif ev("S.lock===0&&S.fade<0.05&&!S.mini&&!S.dlg"): break
        pg.wait_for_timeout(250)
    pg.wait_for_timeout(500); shot('home_goal'); print(ev("JSON.stringify({goal:S.goal,t:S.targets,bars:S.bars,n:goalThings().length})"))
    pg.keyboard.down('ArrowRight'); pg.wait_for_timeout(1500); pg.keyboard.up('ArrowRight'); pg.wait_for_timeout(300); shot('home_edge')
    for goal,t,pos in [("Climb up on a bar stool for breakfast.",['stool0','stool1'],(404,150)),("Go play with your toys by the TV.",['toys'],(440,340)),("Follow Dad!",['slider','sliderOpen'],(408,90)),("Find Dad",['npc:nick'],(340,110)),("Wake up Vinny",['npc:vinny'],(430,300))]:
        ev(f"(()=>{{ P.x={pos[0]}; P.y={pos[1]}; S.snapCam=true; setGoal({goal!r},{t!r}); }})()"); pg.wait_for_timeout(700); shot('t_'+t[0].replace(':','_'))
    ev("void (async()=>{ S.cut=true; await say('Dad','Testing the bars.'); S.cut=false; })()"); pg.wait_for_timeout(900); shot('bars'); pg.keyboard.down('ArrowLeft'); pg.wait_for_timeout(300); shot('bars_ping'); pg.keyboard.up('ArrowLeft'); press('z'); pg.wait_for_timeout(250); shot('back')
    ev("void pickOuting()"); pg.wait_for_timeout(900); press('ArrowDown'); press('ArrowDown'); press('z')
    for i in range(60):
        if ev("S.dlg&&!S.dlg.choices?1:0"): press('z')
        if ev("S.map==='park'&&S.lock===0&&S.fade<0.05&&!S.dlg"): break
        pg.wait_for_timeout(300)
    pg.wait_for_timeout(600); shot('park'); print(ev("JSON.stringify({goal:S.goal,n:goalThings().length,map:S.map})"))
    print(errs); b.close()
