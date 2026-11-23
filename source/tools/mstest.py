import sys,time
from playwright.sync_api import sync_playwright
which=sys.argv[1:] 
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome'); errs=[]
    ctx=b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True,device_scale_factor=2); pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)[:200])); pg.on('console',lambda m:errs.append(m.text[:200]) if m.type=='error' else None); ev=pg.evaluate
    def shot(n): pg.screenshot(path=f'/tmp/shots/ms_{n}.png')
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html'); pg.wait_for_timeout(800); ev("sessionStorage.setItem('cam_warp','nap')"); pg.reload(); pg.wait_for_timeout(1500); ev("pressed.a=true")
    for i in range(80):
        m=ev("document.body.dataset.mode")
        if m=='walk' and not ev("S.cut"): break
        if m=='pick': ev("pressed.a=true")
        elif ev("S.dlg?1:0"): ev("pressed.a=true")
        pg.wait_for_timeout(300)
    ev('msFlags()'); print('ready',ev("JSON.stringify([S.chapter,msActive(),NPC.grace.visible,NPC.nick.visible,NPC.vinny.visible,NPC.vinny.lie,Math.round(NPC.vinny.x),Math.round(NPC.vinny.y),COUCH])"))
    print('bowl free',ev("JSON.stringify([boxFree(286,120,5,4)])"), 'pantry',ev("JSON.stringify([MS_PANTRY(),boxFree(...MS_PANTRY(),5,4)])"),'flee',ev("JSON.stringify(MS_FLEE.map(p=>boxFree(p[0],p[1],5,4)))"))
    def place(id):
        return ev("""(()=>{ const id='%s'; const s=msSpot(id); let best=null; for(const [dx,dy,dir] of [[0,14,'up'],[0,-12,'down'],[14,0,'left'],[-14,0,'right'],[0,22,'up'],[22,0,'left'],[-22,0,'right'],[0,-20,'down'],[0,30,'up']]){ const x=s[0]+dx,y=s[1]+dy; if(!boxFree(x,y,4,2)) continue; P.x=x;P.y=y;P.dir=dir; if(msNear(id,...probe())){ best=[x,y,dir]; break; } }
          if(!best){ // scan
            for(let y=s[1]-40;y<=s[1]+40&&!best;y+=2) for(let x=s[0]-40;x<=s[0]+40&&!best;x+=2){ if(!boxFree(x,y,4,2)) continue; for(const dir of ['up','down','left','right']){ P.x=x;P.y=y;P.dir=dir; if(msNear(id,...probe())){ best=[x,y,dir]; break; } } } }
          return best; })()""" % id)
    def run(id, drive=None, maxs=45):
        pos=place(id); print(id,'stand',pos)
        if not pos: return
        ev("S.snapCam=true"); pg.wait_for_timeout(300); shot(id+'_0'); ev("pressed.a=true"); t0=time.time(); k=0
        while time.time()-t0<maxs:
            pg.wait_for_timeout(250); k+=1
            if ev("S.dlg?1:0"): ev("pressed.a=true"); continue
            m=ev("MS.mode?MS.mode.id:null")
            if m and drive: drive(m,k)
            elif m in('books','glass','bowl'): ev("pressed.a=true")
            if k==8: shot(id+'_1')
            if ev("!!S.flags.ms['%s']"%id) and not ev("S.cut") and not m: break
        shot(id+'_2'); print('   done',ev("!!S.flags.ms['%s']"%id),round(time.time()-t0,1),'s cut',ev("S.cut"),'P',ev("JSON.stringify([Math.round(P.x),Math.round(P.y),P.visible,boxFree(P.x,P.y,4,2)])"),errs[-2:])
        pg.wait_for_timeout(2500)
    def d_tp(m,k): ev("K.down=%s; K.right=%s"%(('true','false') if (k//4)%2 else ('false','true')))
    def d_remote(m,k):
        if m=='remote':
            ev("K.down=false;K.right=false; if(!(P.x>384&&P.x<466&&P.y>290&&P.y<372)){ P.x=420; P.y=330; } pressed.a=true")
        elif m=='chase': ev("K.left=false")   # stand still: get caught
        elif m=='flip': pass
    def d_phone(m,k):
        if m=='chase':  # run away from Dad along free directions
            ev("(()=>{ const e=MS.mode.e; const dx=P.x-e.x, dy=P.y-e.y; K.b=true; K.left=dx<0; K.right=dx>=0; K.up=dy<0; K.down=dy>=0; })()")
        elif m=='flip':
            ev("(()=>{ const e=MS.mode.e; const p=findPath(P.x,P.y,e.x,e.y); const t=p&&p[0]?p[0]:[e.x,e.y]; const dx=t[0]-P.x, dy=t[1]-P.y; K.b=true; K.left=dx<-2; K.right=dx>2; K.up=dy<-2; K.down=dy>2; })()")
    todo=which or ['books','rocker','tp','glass','toybin','bowl','remote','phone','vinny']
    for id in todo:
        ev("for(const k in K) K[k]=false")
        if id=='vinny': ev("(()=>{const v=NPC.vinny; v.path=null; v.follow=false; v.x=COUCH[0]; v.y=COUCH[1]; v.lie=true; v.sleep=true; v.zBias=8; v.visible=true;})()")
        run(id, {'tp':d_tp,'remote':d_remote,'phone':d_phone}.get(id), 70 if id in('phone','remote') else 45)
    ev("for(const k in K) K[k]=false"); ev("pressed.list=true"); pg.wait_for_timeout(500); shot('list'); print('list',ev("S.menu"),ev("JSON.stringify([S.flags.ms,META.ach])")); print(errs); b.close()
