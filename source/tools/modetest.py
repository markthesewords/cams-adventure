from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome'); errs=[]
    ctx=b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True,device_scale_factor=2); pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html#bsmt'); pg.wait_for_timeout(1200); cdp=ctx.new_cdp_session(pg); ev=pg.evaluate
    def touch(kind,pts): cdp.send('Input.dispatchTouchEvent',{'type':kind,'touchPoints':[{'x':x,'y':y,'id':i} for (i,x,y) in pts]})
    def tap(x,y): touch('touchStart',[(0,x,y)]); pg.wait_for_timeout(70); touch('touchEnd',[]); pg.wait_for_timeout(200)
    def shot(n): pg.screenshot(path=f'/tmp/shots/md_{n}.png')
    def cv(x,y): r=ev("(()=>{const r=document.getElementById('c').getBoundingClientRect(); return [r.left,r.top,r.width,r.height,VW,VH]})()"); return (r[0]+x/r[4]*r[2], r[1]+y/r[5]*r[3])
    mode=lambda: ev("document.body.dataset.mode")
    print('title mode',mode()); shot('title'); tap(200,600); pg.wait_for_timeout(2500); print('intro mode',mode()); shot('story')
    x0=ev("P.x"); touch('touchStart',[(0,200,300)]); pg.wait_for_timeout(60); touch('touchMove',[(0,260,300)]); pg.wait_for_timeout(400); touch('touchEnd',[]); print('stick ignored in story:',ev("K.right")==False)
    seen=set()
    for i in range(200):
        m=mode(); 
        if m=='talk' and 'talk' not in seen: pg.wait_for_timeout(700); shot('talk')
        seen.add(m)
        if m=='talk': tap(200,650)
        if m=='walk': break
        pg.wait_for_timeout(200)
    pg.wait_for_timeout(250); shot('handback'); print('modes seen',seen,'turn',ev("S.t-S.turnT<1.5"))
    pg.wait_for_timeout(1800); shot('walk')
    # choices: tap the second option
    ev("window._c=null; void choose('Which one?',['Apple','Banana','Cherry']).then(v=>window._c=v)"); pg.wait_for_timeout(900); print('mode',mode()); shot('pick')
    r=ev("S.dlg.rects[1]"); tap(*cv(r[0]+r[2]/2,r[1]+r[3]/2)); pg.wait_for_timeout(300); print('picked',ev("window._c"),'(want 1)')
    # stray tap on a choice screen does nothing
    ev("window._c=null; void choose('Again?',['Yes','No']).then(v=>window._c=v)"); pg.wait_for_timeout(900); tap(*cv(20,40)); pg.wait_for_timeout(300); print('stray tap chose:',ev("window._c")); r=ev("S.dlg.rects[0]"); tap(*cv(r[0]+5,r[1]+5)); pg.wait_for_timeout(300)
    # cube by touch only
    ev("void runHandler('bs_cube')"); pg.wait_for_timeout(1500); print('cube mode',mode()); shot('cube')
    W,H=ev("VW"),ev("VH"); cx,cy=W/2,H/2+15; fw=min(150,W-40); fh=min(92,H-88)
    f0=ev("S.mini.G.face"); tap(*cv(W-8,cy)); print('turn',f0,'->',ev("S.mini.G.face")); tap(*cv(cx,cy)); pg.wait_for_timeout(500); print('playing',ev("JSON.stringify([S.mini.G.mode,S.mini.G.face])"))
    for i in range(12):
        s=ev("(()=>{const G=S.mini.G; if(G.mode!=='play'||G.face!==1) return null; return ['circle','square','triangle','star'].indexOf(G.st.order[G.st.i])})()")
        if s is None: break
        tap(*cv(cx+[-fw*0.22,fw*0.22][s%2], cy+[-fh*0.2,fh*0.12][s>>1])); pg.wait_for_timeout(200)
    print('sorter by taps ->',ev("JSON.stringify(S.mini.G.done)"),'bonks',ev("S.mini.G.bonks"))
    print(errs); b.close()
