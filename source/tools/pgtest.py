import sys, os, json
from playwright.sync_api import sync_playwright
MODE=sys.argv[1] if len(sys.argv)>1 else 'big'; SMART=(len(sys.argv)<3 or sys.argv[2]!='idle'); PH=bool(os.environ.get('PHONE')); MODE2=sys.argv[2] if len(sys.argv)>2 else ''
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome'); pg=b.new_page(viewport=({'width':390,'height':844} if PH else {'width':1280,'height':720}),has_touch=PH,is_mobile=PH)
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html#park'); pg.wait_for_timeout(900); ev=pg.evaluate; pg.keyboard.press('z'); pg.wait_for_timeout(600)
    kd=pg.keyboard.down; ku=pg.keyboard.up; held=set(); n=[0]
    def hold(k,on):
        if on and k not in held: kd(k); held.add(k)
        if not on and k in held: ku(k); held.discard(k)
    def rel():
        for k in list(held): hold(k,False)
    def shot(name): pg.screenshot(path=f'/tmp/shots/pg_{name}.png')
    for _ in range(60):
        if ev("S.dlg?1:0"): pg.keyboard.press('z')
        elif ev("S.lock===0&&S.fade<0.05&&!S.mini"): break
        pg.wait_for_timeout(250)
    ev("void H.p_struct()"); pg.wait_for_timeout(1200)
    st=lambda: ev("(()=>{const m=S.mini; if(!m) return null; if(!m.pg) return {other:1}; const G=m.G; return {x:G.x,y:G.y,gnd:G.gnd,st:G.st,zone:G.zone&&G.zone.id,stars:PGS.got.size,done:G.done}})()")
    def until(cond,keys,maxs=14,jump=None,tag=''):
        for k in keys: hold(k,True)
        for i in range(int(maxs*40)):
            s=st()
            if s is None or s.get('other'): break
            if cond(s): break
            if jump and jump(s): kd('z'); pg.wait_for_timeout(190); ku('z')
            pg.wait_for_timeout(25)
        else: print('TIMEOUT',tag,s)
        rel(); return st()
    def rideBig():
        i=0
        while True:
            s=ev("(()=>{const m=S.mini; if(!m||!m.slideBig) return null; const G=m.G; return {ph:G.phase,x:G.x,gnd:G.gnd,vy:G.vy,sl:m.slope(G.x),sp:Math.hypot(G.vx,G.vy),done:G.done,score:G.score,air:G.airTotal,perf:G.perfect,stars:G.stars,dist:G.dist,t:G.rideT}})()")
            if s is None: break
            if s['done']: print('BIG',json.dumps({k:(round(v,1) if isinstance(v,float) else v) for k,v in s.items()})); break
            want = (MODE2=='hold') or (SMART and s['ph']=='ride' and ((s['gnd'] and s['sl']>0.06) or ((not s['gnd']) and s['vy']>30 and s['sl']>0.02)))
            hold('z',bool(want)); i+=1
            if i in (30,110,200,300,420,520,640): shot(f'big{i}')
            pg.wait_for_timeout(16)
        rel(); shot('big_end'); pg.wait_for_timeout(800)
    def rideCurly():
        i=0
        while True:
            s=ev("(()=>{const m=S.mini; if(!m||!m.slideCurly) return null; const G=m.G; const zi=G.z/m.SL; let tgt=null; for(const q of m.items){ if(q.got||q.i<zi+1) continue; if(q.i>zi+14) break; if(q.t!=='leaf'){ tgt=q.x; break; } } return {ph:G.phase,px:G.px,tgt,done:G.done,score:G.score,stars:G.stars,total:G.total,bumps:G.bumps,boosts:G.boosts,t:G.rideT,c:m.segs[Math.min(m.segs.length-1,Math.floor(zi))].c}})()")
            if s is None: break
            if s['done']: print('CURLY',json.dumps({k:(round(v,2) if isinstance(v,float) else v) for k,v in s.items()})); break
            if SMART and s['ph']=='ride':
                t=s['tgt'] if s['tgt'] is not None else 0; d=t-s['px']+s['c']*0.12
                hold('ArrowRight',d>0.06); hold('ArrowLeft',d<-0.06)
            i+=1
            if i in (40,150,260,380,500,640): shot(f'curly{i}')
            pg.wait_for_timeout(16)
        rel(); shot('curly_end'); pg.wait_for_timeout(800)
    shot('start')
    climbSteps=lambda s: s['gnd'] and s['x']>58 and s['y']>216.5 and s['x']<150
    if MODE in ('big','all'):
        print(until(lambda s:s['x']>=300,['ArrowRight'],jump=climbSteps,tag='to deckB')); shot('deckB')
        ev("0"); 
        print(until(lambda s:abs(s['x']-498)<3,['ArrowRight'],tag='bridge')); shot('towerF')
        print(until(lambda s:s['y']<=168.5,['ArrowUp'],tag='ladder1')); print(until(lambda s:abs(s['x']-522)<3,['ArrowRight'],tag='f2'))
        print(until(lambda s:s['y']<=120.5,['ArrowUp'],tag='ladder2')); print(until(lambda s:s['zone']=='big',['ArrowRight'],tag='door')); shot('door'); pg.keyboard.press('z'); pg.wait_for_timeout(700)
        rideBig(); pg.wait_for_timeout(900); shot('after_big'); print(st())
    if MODE in ('curly','all'):
        cur=st()
        print(until(lambda s:abs(s['x']-342)<3,['ArrowLeft' if cur['x']>342 else 'ArrowRight'],maxs=20,tag='to ladder28')); print(until(lambda s:s['y']<=216.5,['ArrowUp'],tag='up28'))
        print(until(lambda s:abs(s['x']-366)<3,['ArrowRight'],tag='to pole')); print(until(lambda s:s['y']<=168.5,['ArrowUp'],tag='pole up')); shot('pole')
        print(until(lambda s:abs(s['x']-330)<3,['ArrowLeft'],tag='to ladder27')); print(until(lambda s:s['y']<=120.5,['ArrowUp'],tag='up27'))
        print(until(lambda s:s['zone']=='curly',['ArrowRight'],tag='door c')); shot('door_c'); pg.keyboard.press('z'); pg.wait_for_timeout(700)
        rideCurly(); pg.wait_for_timeout(900); shot('after_curly'); print(st())
    if MODE=='bars':
        print(until(lambda s:s['x']>=160 and s['y']<=216.5,['ArrowRight'],jump=climbSteps,tag='deckA')); print(until(lambda s:abs(s['x']-165)<3,['ArrowRight'],tag='net x'))
        print(until(lambda s:s['y']<=168.5,['ArrowUp'],tag='net')); shot('net')
        print(until(lambda s:s['st']=='hang',['ArrowRight'],jump=lambda s:s['gnd'] and s['x']>196,tag='grab')); shot('hang0'); hold('ArrowRight',True); pg.wait_for_timeout(1800); shot('hang1')
        print(until(lambda s:s['st']!='hang' and s['gnd'],['ArrowRight'],tag='deckD')); shot('deckD')
        print(until(lambda s:s['y']>=264,['ArrowDown'],maxs=6,tag='pole/drop')); print(until(lambda s:abs(s['x']-462)<4,['ArrowRight'],tag='to pad')); pg.wait_for_timeout(500); shot('bounce'); pg.wait_for_timeout(1200); print(st())
        print(until(lambda s:abs(s['x']-270)<4,['ArrowLeft'],maxs=20,jump=lambda s:s['gnd'] and s['y']>263 and False,tag='left')); 
    if MODE=='all':
        print(until(lambda s:s['zone']=='exit',['ArrowLeft'],maxs=40,tag='exit')); pg.keyboard.press('z'); pg.wait_for_timeout(1500); shot('card'); pg.keyboard.press('z'); pg.wait_for_timeout(1500); shot('board')
        for _ in range(6): pg.keyboard.press('z'); pg.wait_for_timeout(700)
        shot('back'); print(ev("JSON.stringify([META.ach,META.best,!!S.mini])"))
    print('errs',errs); b.close()
