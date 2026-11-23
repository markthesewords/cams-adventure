import time
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--autoplay-policy=no-user-gesture-required']); errs=[]
    ctx=b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True,device_scale_factor=2); pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)[:200])); pg.on('console',lambda m:errs.append(m.text[:200]) if m.type=='error' else None); ev=pg.evaluate; cdp=ctx.new_cdp_session(pg)
    def tap(x,y): cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y,'id':0}]}); pg.wait_for_timeout(60); cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]}); pg.wait_for_timeout(200)
    def cv(x,y): r=ev("(()=>{const r=document.getElementById('c').getBoundingClientRect(); return [r.left,r.top,r.width,r.height,VW,VH]})()"); return (r[0]+x/r[4]*r[2], r[1]+y/r[5]*r[3])
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html'); pg.wait_for_timeout(1200); tap(200,600); pg.wait_for_timeout(900)
    r=ev("S.dlg.rects[0]"); tap(*cv(r[0]+r[2]/2,r[1]+r[3]/2)); t0=time.time(); stamps={}; shots=set(); taps=0
    while time.time()-t0<70:
        pg.wait_for_timeout(150)
        st=ev("JSON.stringify([!!S.auto, S.mini?(S.mini.slideBig?'slide':S.mini.G&&S.mini.G.reqs?'cub':S.mini.drums?'drums':S.mini.G&&S.mini.G.hearts?'couch':'other'):null, DR.on, DR.w>0.05, document.body.dataset.mode, DM.on, (S.goal||'')])")
        import json; a,m,on,rip,mode,mus,goal=json.loads(st)
        if m and m not in stamps: stamps[m]=round(time.time()-t0,1)
        if m and on and not rip and m not in shots and time.time()-t0-stamps[m]>1.2: shots.add(m); pg.screenshot(path=f'/tmp/shots/d2_{m}.png'); print(m,'auto',a,'mode',mode,'music',mus)
        if a and taps<6: tap(200,300); taps+=1   # player taps must be ignored
        if ev("S.dlg?1:0"): ev("pressed.a=true")
        if 'Call for Mama' in goal: break
    print('stamps',stamps,'first goal at',round(time.time()-t0,1),'auto now',ev("!!S.auto"),'music',ev("DM.on"),'dreamclass',ev("document.body.classList.contains('dream')"),errs); b.close()
