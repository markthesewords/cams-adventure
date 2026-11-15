import time
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome'); errs=[]
    ctx=b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True,device_scale_factor=2); pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e))); ev=pg.evaluate; cdp=ctx.new_cdp_session(pg)
    def touch(kind,pts): cdp.send('Input.dispatchTouchEvent',{'type':kind,'touchPoints':[{'x':x,'y':y,'id':i} for (i,x,y) in pts]})
    def tap(x,y): touch('touchStart',[(0,x,y)]); pg.wait_for_timeout(70); touch('touchEnd',[]); pg.wait_for_timeout(220)
    def cvp(x,y): r=ev("(()=>{const r=document.getElementById('c').getBoundingClientRect(); return [r.left,r.top,r.width,r.height,VW,VH]})()"); return (r[0]+x/r[4]*r[2], r[1]+y/r[5]*r[3])
    def shot(n): pg.screenshot(path=f'/tmp/shots/dr_{n}.png')
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html'); pg.wait_for_timeout(1200); tap(200,600); pg.wait_for_timeout(900)
    r=ev("S.dlg.rects[0]"); tap(*cvp(r[0]+r[2]/2,r[1]+r[3]/2)); t0=time.time()
    def until(cond,ms=30000,step=100):
        t=time.time()
        while (time.time()-t)*1000<ms:
            if ev(cond): return True
            pg.wait_for_timeout(step)
        return False
    pg.wait_for_timeout(3600); shot('1sleep'); until("DR.w>0.45"); shot('2ripple'); print('ripple at',round(time.time()-t0,1))
    until("!!(S.mini&&S.mini.slideBig)&&DR.w<0.05"); print('slide at',round(time.time()-t0,1),ev("DR.on")); touch('touchStart',[(0,200,300)]); pg.wait_for_timeout(2500); shot('3slide')
    until("!!(S.mini&&S.mini.G&&S.mini.G.reqs)&&DR.w<0.05",40000); touch('touchEnd',[]); print('cub at',round(time.time()-t0,1)); shot('4cub')
    for i in range(400):
        st=ev("(()=>{const m=S.mini,G=m&&m.G; if(!G||!G.reqs) return 'x'; if(G.talk){ pressed.a=true; return 't'; } if(G.guide){ pressed[G.guide.it.side?'right':'left']=true; return 'g'; } const it=G.items.find(x=>x.state==='on'&&x.kind==='mom'&&G.reqs.includes(x.id)&&x.p>0.8&&x.p<0.9); if(it){ pressed[it.side?'right':'left']=true; return 'grab'; } return '.'})()")
        if st=='x': break
        if i==25: shot('5cubplay')
        pg.wait_for_timeout(120)
    print('cub done at',round(time.time()-t0,1))
    until("!!(S.mini&&S.mini.drums)&&DR.w<0.05"); print('drums at',round(time.time()-t0,1)); shot('6drums')
    for k in ['down','left','down','left']: ev(f"pressed.{k}=true"); pg.wait_for_timeout(350)
    until("!!(S.mini&&S.mini.G&&S.mini.G.hearts)&&DR.w<0.05"); pg.wait_for_timeout(2200); shot("6bcouch"); print("couch at",round(time.time()-t0,1))
    until("!S.mini&&DR.w<0.05"); print('back in bed at',round(time.time()-t0,1),ev("DR.on"),ev("document.body.className")); shot('7bed')
    for i in range(100):
        if ev("S.dlg?1:0"): tap(200,650)
        if 'Call for Mama' in (ev("S.goal")or''): break
        pg.wait_for_timeout(200)
    print("goal at",round(time.time()-t0,1),ev("S.goal"),errs, ev("JSON.stringify([!!S.dlg,S.lock,S.cut,S.flags.stage,P.lying,S.fade,document.body.dataset.mode,TS,!!S.mini,S.dlg&&S.dlg.text])")); shot("8awake"); b.close()
