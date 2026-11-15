import sys
from playwright.sync_api import sync_playwright
PH=len(sys.argv)>1
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome'); errs=[]
    ctx=b.new_context(viewport=({'width':390,'height':844} if PH else {'width':1280,'height':720}),has_touch=PH,is_mobile=PH,device_scale_factor=2 if PH else 1); pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html#bsmt'); pg.wait_for_timeout(1000); cdp=ctx.new_cdp_session(pg); sfx='_ph' if PH else ''
    def tap(x,y):
        cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y,'id':0}]}); pg.wait_for_timeout(60); cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]}); pg.wait_for_timeout(120)
    go=(lambda: tap(200,200)) if PH else (lambda: pg.keyboard.press('z'))
    go()
    for i in range(160):
        if pg.evaluate("S.dlg?1:0"): go()
        elif pg.evaluate("S.lock===0&&S.fade<0.05&&!S.mini&&!S.dlg"): break
        pg.wait_for_timeout(250)
    pg.evaluate("S.cut=true; void drumGame().then(r=>{window._dr=1; S.mini=null; S.cut=false;})"); pg.wait_for_timeout(800); pg.screenshot(path=f'/tmp/shots/dk_0{sfx}.png')
    if PH:
        pos=pg.evaluate("(()=>{const r=document.getElementById('c').getBoundingClientRect(), W=VW,Hh=VH, s=Math.min(1.25,(W-12)/250,(Hh-52)/150), cx=W/2, cy=Hh*0.47, o={}; for(const k in S.mini.PADS){ const q=S.mini.PADS[k]; o[k]=[r.left+(cx+q.x*s)/W*r.width, r.top+(cy+q.y*s)/Hh*r.height]; } return o})()")
        h0=pg.evaluate("S.mini.G.hits")
        for k in ['snare','tom','floor','kick','hat','crash']:
            tap(*pos[k]); pg.wait_for_timeout(60); pg.screenshot(path=f'/tmp/shots/dk_{k}{sfx}.png') if k in('crash','snare') else None
        print('taps registered',pg.evaluate("S.mini.G.hits")-h0,'of 6', pg.evaluate("document.body.className"))
        r=pg.evaluate("(()=>{const r=document.getElementById('dpad').getBoundingClientRect(); return [r.left+r.width/2,r.top+r.height/2,r.width]})()"); h0=pg.evaluate("S.mini.G.hits"); tap(r[0]-r[2]*0.33,r[1]); tap(r[0],r[1]-r[2]*0.33); print('dpad hits',pg.evaluate("S.mini.G.hits")-h0)
    else:
        for k in ['ArrowLeft','ArrowUp','ArrowRight','ArrowDown','x','z']:
            pg.keyboard.press(k); pg.wait_for_timeout(90); pg.screenshot(path=f'/tmp/shots/dk_{k}.png'); pg.wait_for_timeout(300)
    print(errs); b.close()
