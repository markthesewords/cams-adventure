import sys, json, random
from playwright.sync_api import sync_playwright
mode=sys.argv[1] if len(sys.argv)>1 else 'good'; random.seed(3)
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome')
    vp={'width':1280,'height':720} if mode!='phone' else {'width':390,'height':844}
    c=b.new_context(viewport=vp,has_touch=(mode=='phone'),is_mobile=(mode=='phone'),device_scale_factor=2 if mode=='phone' else 1); pg=c.new_page()
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html#walk'); pg.wait_for_timeout(600); pg.evaluate("localStorage.clear()")
    ev=pg.evaluate; press=pg.keyboard.press; press('z'); shots=0; skip=set(); held=False
    keymap={'point':'z','vinny':'x','wave':'ArrowUp'}
    for i in range(6000):
        st=ev("""(()=>{ if(S.dlg) return {k:'dlg'}; const m=S.mini; if(!m) return {k:'none',goal:S.goal}; if(!m.G||!m.G.tg) return {k:'card'};
          const G=m.G, c=G.scroll+WALK.X+30; return {k:'game',phase:G.phase,score:G.score,stage:G.stage,
            near:G.tg.map((t,i)=>[i,t.type,t.d-c,t.state,t.stage]).filter(a=>a[3]==='wait'&&Math.abs(a[2])<12)}; })()""")
        k=st['k']
        if k=='dlg': press('z'); pg.wait_for_timeout(220)
        elif k=='card': press('z'); pg.wait_for_timeout(300)
        elif k=='game':
            if st['phase']=='play':
                for idx,ty,ph,_,stg in st['near']:
                    if idx in skip: continue
                    if mode=='avg' and random.random()<0.28: skip.add(idx); continue
                    press(keymap[ty]); skip.add(idx)
                if shots<4 and i%150==60: pg.screenshot(path=f'/tmp/shots/walk_{mode}_{shots}.png'); shots+=1
            elif st['phase']=='camwalk':
                if not held: pg.keyboard.down('ArrowRight'); held=True; pg.screenshot(path=f'/tmp/shots/walk_{mode}_camwalk.png')
            elif st['phase']=='ryan' and shots<5: pg.screenshot(path=f'/tmp/shots/walk_{mode}_ryan.png'); shots=5
            elif st['phase']=='end':
                if held: pg.keyboard.up('ArrowRight'); held=False
                if shots<7: pg.wait_for_timeout(1500); pg.screenshot(path=f'/tmp/shots/walk_{mode}_score.png'); shots=7
                press('z')
            pg.wait_for_timeout(40)
        else:
            if st.get('goal','').startswith('Talk to Mom'): break
            pg.wait_for_timeout(200)
    print(mode, ev("JSON.stringify(window._res)"), ev("JSON.stringify(META)"), errs)
    b.close()
