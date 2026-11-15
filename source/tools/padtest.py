from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome'); errs=[]
    ctx=b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True,device_scale_factor=2); pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html#bsmt'); pg.wait_for_timeout(1000); cdp=ctx.new_cdp_session(pg)
    def touch(kind,pts): cdp.send('Input.dispatchTouchEvent',{'type':kind,'touchPoints':[{'x':x,'y':y,'id':i} for (i,x,y) in pts]})
    def tap(x,y): touch('touchStart',[(0,x,y)]); pg.wait_for_timeout(70); touch('touchEnd',[]); pg.wait_for_timeout(180)
    tap(200,200)
    for i in range(160):
        if pg.evaluate("S.dlg?1:0"): tap(200,300)
        elif pg.evaluate("S.lock===0&&S.fade<0.05&&!S.mini&&!S.dlg"): break
        pg.wait_for_timeout(250)
    pg.evaluate("void runHandler('bs_cube')"); pg.wait_for_timeout(1500)
    r=pg.evaluate("(()=>{const r=document.getElementById('dpad').getBoundingClientRect(); const a=document.getElementById('ba').getBoundingClientRect(); return [r.left+r.width/2,r.top+r.height/2,r.width,a.left+a.width/2,a.top+a.height/2,document.body.className]})()"); print(r)
    cx,cy,w,ax,ay,_=r
    f0=pg.evaluate("S.mini.G.face"); tap(cx+w*0.33,cy); print('face',f0,'->',pg.evaluate("S.mini.G.face")); tap(cx+w*0.33,cy)   # to shape sorter (face 1)? 
    pg.evaluate("S.mini.G.face=1"); tap(ax,ay); pg.wait_for_timeout(400); print(pg.evaluate("JSON.stringify({m:S.mini.G.mode,f:S.mini.G.face,cur:S.mini.G.st&&S.mini.G.st.cur})"))
    tap(cx+w*0.33,cy); tap(cx,cy+w*0.33); print('cursor',pg.evaluate("S.mini.G.st.cur")); pg.wait_for_timeout(1700); pg.screenshot(path='/tmp/shots/pd_sort.png')
    pg.evaluate("(()=>{const G=S.mini.G; G.mode='hub'; G.face=2;})()"); tap(ax,ay); pg.wait_for_timeout(2600); tap(cx+w*0.33,cy); pg.screenshot(path='/tmp/shots/pd_doors.png')
    pg.evaluate("(()=>{const G=S.mini.G; G.mode='hub'; G.face=3;})()"); tap(ax,ay); pg.wait_for_timeout(2600); tap(cx,cy+w*0.33); pg.screenshot(path='/tmp/shots/pd_mix.png')
    pg.evaluate("S.mini.G.mode='hub'"); pg.wait_for_timeout(200); tap(pg.evaluate("document.getElementById('bb').getBoundingClientRect().left+30"),pg.evaluate("document.getElementById('bb').getBoundingClientRect().top+30")); pg.wait_for_timeout(1500)
    print('after leave',pg.evaluate("JSON.stringify([!!S.mini,document.body.className])")); pg.screenshot(path='/tmp/shots/pd_after.png')
    print(errs); b.close()
