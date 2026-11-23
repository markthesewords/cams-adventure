from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome'); errs=[]
    ctx=b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True,device_scale_factor=2); pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e))); ev=pg.evaluate
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html#emory'); pg.wait_for_timeout(1200); pg.keyboard.press('z'); pg.wait_for_timeout(800)
    n=[0]; 
    def shot(t): pg.locator('#c').screenshot(path=f'/tmp/shots/fd_{n[0]:02d}_{t}.png'); n[0]+=1
    seen=set(); clips=[]
    for i in range(700):
        st=ev("JSON.stringify({d:S.dlg?S.dlg.text:null,m:MS.mode&&MS.mode.id,mini:!!S.mini,full:!!(S.mini&&S.mini.full),goal:S.goal,clk:S.clock})")
        import json; s=json.loads(st)
        if s['m']=='feedrace' and 'race' not in seen:
            seen.add('race'); shot('race0'); ev("(()=>{const q=findPath(P.x,P.y,468,152); walk(P,q||[[468,152]],62);})()")
        if s['m']=='feedrace' and i%4==0: shot('race')
        if s['mini'] and not s['full']:
            if 'sit' not in seen: seen.add('sit'); shot('sit')
            ev("pressed.a=true"); pg.wait_for_timeout(500); continue
        if s['full']:
            if 'board' not in seen: seen.add('board'); shot('board')
            ev("pressed.a=true"); pg.wait_for_timeout(400); continue
        if s['d']:
            t=s['d']
            if t not in seen: seen.add(t); shot('dlg'); print('DLG',t)
            ev("pressed.a=true")
        if s['goal'] and 'Follow Emory' in s['goal']: print('GOAL',s); shot('end'); break
        if i in (40,60,80): shot('walk')
        pg.wait_for_timeout(250)
    print('bests',ev("JSON.stringify(META.best)"),ev("S.clock"),errs); b.close()
