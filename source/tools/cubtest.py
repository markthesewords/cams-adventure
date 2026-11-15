import sys, json, random
from playwright.sync_api import sync_playwright
mode=sys.argv[1] if len(sys.argv)>1 else 'good'; random.seed(int(sys.argv[2]) if len(sys.argv)>2 else 5)
base=sys.argv[3] if len(sys.argv)>3 else 'file:///home/claude/game/build/Cams_Adventure.html'
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome')
    phone=mode=='phone'
    vp={'width':1280,'height':720} if not phone else {'width':390,'height':844}
    c=b.new_context(viewport=vp,has_touch=phone,is_mobile=phone,device_scale_factor=2 if phone else 1); pg=c.new_page()
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto(base); pg.wait_for_timeout(500)
    done='true' if mode=='weee' else 'false'
    pg.evaluate("localStorage.clear(); localStorage.setItem('camAdventure_meta',JSON.stringify({ach:{},best:{},name:'BOT"+mode.upper()[:4]+"',id:'bot-"+mode+"-device',cubDone:"+done+"}))")
    pg.goto(base+'#cub'); pg.reload(); pg.wait_for_timeout(700)
    ev=pg.evaluate; press=pg.keyboard.press
    press('z'); shots=0; plan={}; seen=set()
    def shot(n):
        if n not in seen: seen.add(n); pg.screenshot(path=f'/tmp/shots/cub_{mode}_{n}.png')
    for i in range(12000):
        st=ev("""(()=>{ if(S.dlg) return {k:'dlg',ch:!!S.dlg.choices,text:S.dlg.text}; const m=S.mini; if(!m) return {k:'none',fade:S.fade,goal:S.goal};
          if(m.belt) return {k:'belt',xs:m.belt.filter(b=>!b.done).map(b=>b.x-VW/2)};
          if(!m.G) return {k:'card'}; const G=m.G; return {k:'game',phase:G.phase,aisle:G.aisle,score:G.score,look:G.mom.look,reqs:G.reqs,chain:G.chain,
            talk:G.talk?{who:G.talk.who||'mom',full:G.talk.shown>=G.talk.text.length,text:G.talk.text}:null, guide:G.guide?G.guide.it.side:null, sprint:G.sprint,
            items:G.items.filter(i=>i.state==='on').map((i,n)=>[i.id,i.kind,i.side,i.p,i.spawn]), sh:G.shoppers.some(s=>!s.greeted&&!s.chat&&s.p>0.35&&s.p<0.85), near:G.shoppers.some(s=>s.p>0.8)}; })()""")
        k=st['k']
        if k=='dlg':
            if st['ch'] and 'How fast' in st['text'] and mode=='weee':
                pg.wait_for_timeout(600); press('ArrowDown'); pg.wait_for_timeout(80); press('ArrowDown'); pg.wait_for_timeout(80)
            press('z'); pg.wait_for_timeout(250)
        elif k=='card':
            if i>40: pg.wait_for_timeout(900); shot('board' if 'rcpt' in seen else 'rcpt')
            press('z'); pg.wait_for_timeout(300)
        elif k=='belt':
            if any(abs(x)<60 for x in st['xs']): shot('belt')
            tol=4 if mode!='avg' else 11
            if mode!='bad' and any(abs(x)<tol for x in st['xs']): press('z')
            pg.wait_for_timeout(25)
        elif k=='game':
            if st['talk']:
                if st['talk']['full']:
                    pg.wait_for_timeout(350)
                    if st['talk']['who']=='shopper': shot('closeup')
                    elif 'grab' in st['talk']['text']: shot('ask')
                    elif st['aisle']==0 and 'intro' not in seen: shot('intro')
                    elif 'Weeeeee' in st['talk']['text']: shot('weee')
                    press('z')
                pg.wait_for_timeout(60); continue
            if st['guide'] is not None:
                pg.wait_for_timeout(500); shot('guide'+str(st['aisle'])); press('ArrowRight' if st['guide'] else 'ArrowLeft'); pg.wait_for_timeout(80); continue
            for id_,kind,side,pp,sp in st['items']:
                key=(st['aisle'],id_,round(sp,3))
                if key not in plan:
                    r=random.random()
                    if mode=='avg': plan[key]=dict(tgt=0.86+random.gauss(0,0.045),skip=r<0.12,greedy=random.random()<0.12)
                    else: plan[key]=dict(tgt=0.85,skip=False,greedy=False)
                pl=plan[key]
                if pl.get('done') or pl['skip'] or pp<pl['tgt']: continue
                want=(kind=='mom' and id_ in st['reqs']) or (kind=='cam' and (st['look']<0.2 or id_=='icecream' or pl['greedy']))
                if mode=='bad': want= kind in('junk','cam')
                if want: press('ArrowRight' if side else 'ArrowLeft'); pl['done']=True
                elif pp>0.97: pl['done']=True
            if st['sh'] and mode!='bad': shot('hi'); press('z')
            if st['near']: shot('pass')
            if st['sprint']: shot('sprint')
            if st['phase']=='play' and shots<6 and i%70==30: pg.screenshot(path=f'/tmp/shots/cub_{mode}_{shots}.png'); shots+=1
            pg.wait_for_timeout(22)
        else:
            if st.get('goal','').startswith('Talk to Mom'): break
            pg.wait_for_timeout(200)
    print(mode, ev("JSON.stringify(window._cubRes)"), ev("JSON.stringify(META.best)"), sorted(seen), errs)
    b.close()
