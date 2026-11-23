from playwright.sync_api import sync_playwright
import json
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome'); errs=[]
    ctx=b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True,device_scale_factor=2); pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e))); ev=pg.evaluate
    def shot(n): pg.locator('#c').screenshot(path='/tmp/shots/fl_'+n+'.png')
    def drive(stop,maxi=300,tag=''):
        seen=set()
        for i in range(maxi):
            s=json.loads(ev("JSON.stringify({d:S.dlg?S.dlg.text:null,ch:S.dlg&&S.dlg.choices?S.dlg.choices:null,goal:S.goal,clk:S.clock,mini:!!S.mini,cut:!!S.cut,fade:S.fade})"))
            if s['d'] and s['d'] not in seen: seen.add(s['d']); print(tag,'DLG',s['d'],s['ch'] or '')
            if s['d']: ev("pressed.a=true")
            elif s['mini']: ev("pressed.a=true")
            if ev(stop): return s
            pg.wait_for_timeout(250)
        return 'TIMEOUT '+json.dumps(s)
    # A: home from the morning walk (resume path)
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html'); pg.wait_for_timeout(1200)
    ev("void (S.title=false, S.chapter=2, S.flags={ch1done:true,ch2done:true,metDad:true,amWalk:true,outings:1}, S.cut=true, S.fade=1, walkHome(null).then(()=>{S.cut=false; window.__a=1}))")
    print('A',drive("window.__a===1",tag='A')); shot('walkhome'); print('tl',ev("document.getElementById('tl').innerText"))
    # B: the afternoon pick, then home and the thumps (stub the outing itself)
    ev("window.parkOuting=async()=>{ await fadeTo(1,300); setMap('house'); return {}; }; window.__b=0; S.cut=true; S.fade=1; resumePmOut().then(()=>window.__b=1)")
    print('B',drive("window.__b===1&&!S.dlg&&S.goal.indexOf('Daddy')>=0",tag='B')); shot('pmback'); print('state',ev("JSON.stringify({clk:S.clock,ch:S.chapter,ps:S.flags.pmStage,goal:S.goal,pt:S.pt,tl:document.getElementById('tl').innerText})"))
    # C: Mom's replay menu at pmStage 4, say Not right now
    ev("window.__c=0; S.cut=true; runHandler('npc_grace',NPC.grace).then?0:0; setTimeout(()=>window.__c=1,100)")
    for i in range(20):
        if ev("S.dlg&&S.dlg.choices?1:0"): print('C choices',ev("JSON.stringify(S.dlg.choices)")); ev("S.dlg.sel=3; pressed.a=true"); break
        if ev("S.dlg?1:0"): ev("pressed.a=true")
        pg.wait_for_timeout(250)
    print(errs); b.close()
