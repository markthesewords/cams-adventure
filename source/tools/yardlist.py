import time, sys
from playwright.sync_api import sync_playwright
only=sys.argv[1:]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome'); errs=[]
    pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2); pg.on('pageerror',lambda e:errs.append(str(e)[:200])); pg.on('console',lambda m:errs.append(m.text[:200]) if m.type=='error' else None); ev=pg.evaluate
    def shot(n): pg.locator('#c').screenshot(path=f'/tmp/shots/yl_{n}.png')
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html'); pg.wait_for_timeout(800); ev("sessionStorage.setItem('cam_warp','yard')"); pg.reload(); pg.wait_for_timeout(1500); ev("pressed.a=true")
    for i in range(80):
        if ev("S.dlg?1:0"): ev("pressed.a=true")
        if ev("S.map==='yard'&&!S.cut&&!!S.tick") and i>8: break
        pg.wait_for_timeout(250)
    ev("S.flags.poop=true; S.flags.spout=true")
    print('start', ev("JSON.stringify([msListId(), msActive(), MS.props.map(p=>p.kind), NPC.grace.seated, NPC.ryan.visible])"))
    ev("P.x=400;P.y=560;S.snapCam=true"); pg.wait_for_timeout(400); shot('deck')
    def stand(id):
        return ev("""(()=>{ const id='%s'; const s=msSpot(id); for(let y=s[1]-30;y<=s[1]+30;y+=2) for(let x=s[0]-30;x<=s[0]+30;x+=2){ if(!boxFree(x,y,4,2)) continue; for(const d of ['up','down','left','right']){ P.x=x;P.y=y;P.dir=d; if(msNear(id,...probe())) return [x,y,d]; } } return null; })()""" % id)
    def run(id, drive=None, maxs=40):
        ev("for(const k in K) K[k]=false"); pos=stand(id); ev("S.snapCam=true"); print(id,'stand',pos)
        if not pos: return
        pg.wait_for_timeout(300); ev("pressed.a=true"); t0=time.time(); k=0
        while time.time()-t0<maxs:
            pg.wait_for_timeout(200); k+=1
            if ev("S.dlg?1:0"): ev("pressed.a=true"); continue
            m=ev("MS.mode?MS.mode.id:null")
            if drive and m: drive(m,k)
            if k==10: shot(id+'_1')
            if ev("!!msFlags()['%s']"%id) and not ev("S.cut") and not m: break
        shot(id+'_2'); print('   done',ev("!!msFlags()['%s']"%id),round(time.time()-t0,1),'cut',ev("S.cut"),errs[-2:]); pg.wait_for_timeout(1500)
    st={'held':0}
    def d_ball(m,k):
        if m=='throw':
            if ev("P.y>150"): ev("P.y=120")
            if st['held']<10: ev("K.a=true"); st['held']+=1
            else: ev("K.a=false"); st['held']=0
        elif m=='fetch':
            ev("(()=>{ const b=MS.props.find(q=>q.kind==='ball'); P.x=b.x; P.y=b.y+9; P.dir='up'; pressed.a=true; })()")
    def d_stick(m,k):
        if m=='stick': ev("(()=>{ const v=NPC.vinny; P.x=v.x; P.y=v.y+14; })()")
    ids=only or ['wrongway','hose','garden','dirt','ball','stick']
    for id in ids: run(id,{'ball':d_ball,'stick':d_stick}.get(id),60)
    for i in range(40):
        pg.wait_for_timeout(300)
        if ev("S.dlg?1:0"): shot('dinner'); ev("pressed.a=true")
        if ev("S.flags.dinner&&!S.cut"): break
    print('dinner',ev("S.flags.dinner"), 'list',ev("JSON.stringify(msFlags())"), errs); b.close()
