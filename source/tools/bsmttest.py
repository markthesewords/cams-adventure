import os,sys
from playwright.sync_api import sync_playwright
PH=bool(os.environ.get('PHONE'))
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome'); pg=b.new_page(viewport=({'width':390,'height':844} if PH else {'width':1280,'height':720}),has_touch=PH,is_mobile=PH)
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html#bsmt'); pg.wait_for_timeout(900); ev=pg.evaluate; press=pg.keyboard.press; press('z')
    sfx='_ph' if PH else ''
    def shot(n): pg.screenshot(path=f'/tmp/shots/bs_{n}{sfx}.png')
    clips=[]; gs=[]
    def settle(maxn=160,tag=''):
        for i in range(maxn):
            if ev("S.dlg&&S.dlg.choices?1:0"): press('z')
            elif ev("S.dlg?1:0"): press('z')
            elif ev("S.lock===0&&S.fade<0.05&&!S.mini&&!S.dlg&&!S.cut"): return True
            c=ev("(()=>{const r=[];for(const k of ['nick','grace']){const e=NPC[k]; if(e.visible&&!e.seated&&!S.noCollide&&e.path&&!boxFree(e.x,e.y)) r.push(k+'@'+Math.round(e.x)+','+Math.round(e.y));} return r.join(' ')})()")
            if c: clips.append(tag+':'+c)
            pg.wait_for_timeout(250)
        return False
    pg.wait_for_timeout(1500); shot('intro1'); pg.wait_for_timeout(5000); shot('intro2'); pg.wait_for_timeout(4500); shot('intro3')
    print('intro',settle(tag='intro'), ev("JSON.stringify({goal:S.goal,t:S.targets,n:goalThings().length,P:[P.x|0,P.y|0],nick:[NPC.nick.x|0,NPC.nick.y|0,NPC.nick.seated]})")); shot('free')
    # drums not ready
    ev("void runHandler('bs_drums')"); pg.wait_for_timeout(1500); shot('notready'); settle()
    # guitar
    ev("P.x=290;P.y=380;void runHandler('bs_guitar')"); pg.wait_for_timeout(600)
    for k in ['ArrowDown','ArrowDown','z','ArrowRight','z','ArrowUp','ArrowUp','z']: press(k); pg.wait_for_timeout(120)
    shot('guitar'); press('x'); pg.wait_for_timeout(3500); shot('vinny_in'); print('guitar',settle(tag='g'), ev("JSON.stringify({bs:S.flags.bs,vin:[NPC.vinny.visible,NPC.vinny.follow],t:S.targets})"))
    # sneak: run in -> heard
    ev("P.x=180;P.y=264;S.snapCam=true"); pg.wait_for_timeout(200); pg.keyboard.down('x'); pg.keyboard.down('ArrowLeft'); pg.wait_for_timeout(900); shot('sneak_run'); pg.wait_for_timeout(1500); pg.keyboard.up('ArrowLeft'); pg.keyboard.up('x'); pg.wait_for_timeout(600); shot('heard'); print('heard',settle(tag='h'), ev("JSON.stringify([P.x|0,P.y|0])"))
    # sneak walking + squeak
    ev("P.x=160;P.y=268;S.snapCam=true"); pg.wait_for_timeout(600); print('inroom',ev("JSON.stringify({on:BSN.on,vl:NPC.vinny.lie,vf:NPC.vinny.follow})"))
    ev("P.x=132;P.y=284"); pg.wait_for_timeout(300); shot('squeak'); print('noise',ev("BSN.noise|0"))
    ev("P.x=94;P.y=322;P.dir='down'"); pg.wait_for_timeout(300); ev("void runHandler('bs_bed')"); pg.wait_for_timeout(3500); shot('bed_on')
    for i in range(40):
        if not ev("S.mini&&S.mini.bed&&!S.mini.G.done?1:0"): break
        pg.keyboard.down('z'); pg.wait_for_timeout(300 if i<6 else 800); pg.keyboard.up('z'); pg.wait_for_timeout(750)
        if i==3: shot('bed_jump')
        if i==2: pg.keyboard.down('ArrowLeft'); pg.wait_for_timeout(400); pg.keyboard.up('ArrowLeft')
    print('bed',ev("S.mini&&S.mini.G?JSON.stringify({s:S.mini.G.score,j:S.mini.G.jumps,st:S.mini.G.strikes}):'gone'")); shot('bed_caught'); pg.wait_for_timeout(3500); shot('bed_dad')
    for i in range(60):
        if ev("S.dlg?1:0"): shot('bed_dadsays'); press('z'); break
        pg.wait_for_timeout(300)
    pg.wait_for_timeout(2500); shot('bed_carry'); pg.wait_for_timeout(3500); shot('bed_board'); pg.wait_for_timeout(1500); shot('bed_board2')
    for i in range(120):
        st=ev("JSON.stringify({d:!!S.dlg,l:S.lock,m:!!S.mini,g:NPC.grace.visible})")
        if ev("S.lock===0&&!S.dlg&&!S.mini"): break
        press('z'); pg.wait_for_timeout(350)
        if ev("NPC.grace.visible&&S.dlg?1:0") and not gs: gs.append(1); shot('grace')
    print('after bed',st, ev("JSON.stringify({bs:S.flags.bs,t:S.targets,P:[P.x|0,P.y|0],g:NPC.grace.visible})")); shot('after_bed')
    # cube
    ev("P.x=444;P.y=306;S.snapCam=true;void runHandler('bs_cube')"); pg.wait_for_timeout(1200); shot('cube_hub')
    def face(): return ev("S.mini&&S.mini.cube?JSON.stringify({m:S.mini.G.mode,f:S.mini.G.face,d:S.mini.G.done}):'none'")
    press('z'); pg.wait_for_timeout(300)
    # bead maze: steer along tangent using game state
    for i in range(400):
        s=ev("(()=>{const G=S.mini&&S.mini.G; if(!G||!S.mini.cube||G.mode!=='play'||G.face!==0) return null; const st=G.st,w=st.wires[st.w]; let i=0; while(i<w.L.length-2&&w.L[i+1]<st.s) i++; return [w.p[i+1][0]-w.p[i][0],w.p[i+1][1]-w.p[i][1]]})()")
        if not s: break
        k='ArrowRight' if abs(s[0])>=abs(s[1]) and s[0]>0 else 'ArrowLeft' if abs(s[0])>=abs(s[1]) else 'ArrowDown' if s[1]>0 else 'ArrowUp'
        pg.keyboard.down(k); pg.wait_for_timeout(90); pg.keyboard.up(k)
        if i==12: shot('cube_bead')
    print('bead',face()); pg.wait_for_timeout(1300); print(face()); shot('cube_hub2'); press('z'); pg.wait_for_timeout(300)
    for i in range(30):
        s=ev("(()=>{const G=S.mini.G; if(G.mode!=='play'||G.face!==1) return null; return ['circle','square','triangle','star'].indexOf(G.st.order[G.st.i])})()")
        if s is None: break
        if i==0: press('z'); pg.wait_for_timeout(150); shot('cube_sort')
        press('ArrowLeft' if s%2==0 else 'ArrowRight'); press('ArrowUp' if s<2 else 'ArrowDown'); pg.wait_for_timeout(80); press('z'); pg.wait_for_timeout(150)
    print('sort',face()); pg.wait_for_timeout(1300); press('z'); pg.wait_for_timeout(300)
    for i in range(30):
        s=ev("(()=>{const G=S.mini.G; if(G.mode!=='play'||G.face!==2) return null; const st=G.st; if(st.wait>0) return 'w'; const left=[0,1,2,3,4,5].filter(i=>!st.found.includes(i)); if(!left.length) return null; let tgt; if(st.open.length===1) tgt=left.find(i=>i!==st.open[0]&&st.cards[i]===st.cards[st.open[0]]); else tgt=left[0]; return [st.cur,tgt]})()")
        if s is None: break
        if s=='w': pg.wait_for_timeout(200); continue
        for _ in range((s[1]-s[0])%6): press('ArrowRight'); pg.wait_for_timeout(40)
        press('z'); pg.wait_for_timeout(150)
        if i==2: shot('cube_doors')
    print('doors',face()); pg.wait_for_timeout(1300); press('z'); pg.wait_for_timeout(300); shot('cube_mix')
    for i in range(12):
        s=ev("(()=>{const G=S.mini.G; if(!G||G.mode!=='play'||G.face!==3) return null; return [G.st.cur,G.st.rows]})()")
        if s is None: break
        r=s[1][s[0]]
        if r!=0: press('ArrowRight' if r==2 else 'ArrowLeft'); pg.wait_for_timeout(120)
        else: press('ArrowDown'); pg.wait_for_timeout(120)
    pg.wait_for_timeout(700); shot('cube_dog'); print('mix',ev("S.mini&&S.mini.G?JSON.stringify(S.mini.G.done):'gone'")); pg.wait_for_timeout(3500); shot('cube_board')
    # through board -> third done -> drums scene
    for i in range(200):
        if ev("S.mini&&S.mini.drums?1:0"): break
        press('z'); pg.wait_for_timeout(300)
        if ev("P.carry?1:0") and len(gs)<2: gs.append(1); shot('carry')
    print('drums up',ev("S.mini&&S.mini.drums?S.mini.G.phase:'no'"), ev("JSON.stringify(S.flags.bs)")); pg.wait_for_timeout(900); shot('dr_free')
    keys=['ArrowLeft','ArrowUp','ArrowRight','ArrowDown','z','x']
    for i in range(16): press(keys[i%6]); pg.wait_for_timeout(330)
    shot('dr_free2'); pg.wait_for_timeout(3200); print(ev("S.mini.G.phase"))
    KM={'left':'ArrowLeft','up':'ArrowUp','right':'ArrowRight','down':'ArrowDown','a':'z','b':'x'}
    for i in range(90):
        ph=ev("S.mini.G.phase")
        if ph=='learn':
            if i%3==0 and len(gs)<3: gs.append(1); shot('dr_learn')
            press(KM[ev("S.mini.PADS[['kick','snare','tom','floor','hat','crash'][S.mini.G.li]].key")])
        elif ph=='quiz':
            if len(gs)<4: gs.append(1); shot('dr_quiz')
            press(KM[ev("S.mini.PADS[S.mini.G.quiz].key")])
        elif ph=='pick': pg.wait_for_timeout(500); shot('dr_pick'); press('z'); pg.wait_for_timeout(400)
        elif ph in('count','song'): break
        pg.wait_for_timeout(450)
    print('phase',ev("S.mini.G.phase")); pg.wait_for_timeout(1500); shot('dr_count')
    # play the song: hit each note when due (bot); skip every 7th
    n=0
    for i in range(3000):
        ph=ev("S.mini&&S.mini.drums?S.mini.G.phase:'x'")
        if ph=='end' or ph=='x': break
        if ph=='song':
            d=ev("(()=>{const G=S.mini.G, st=G.live?AC.currentTime-G.t0:G.pT-1.5; const r=G.notes.filter(n=>!n.hit&&!n.miss&&Math.abs(n.t-st)<0.06).map(n=>S.mini.PADS[n.p].key); return r})()")
            for k in d:
                n+=1
                if n%7: press(KM[k])
            if i in(150,600): shot('dr_song%d'%i)
        pg.wait_for_timeout(25)
    pg.wait_for_timeout(1200); shot('dr_end'); print('song',ev("JSON.stringify({s:S.mini.G.score,p:S.mini.G.perfect,g:S.mini.G.good,m:S.mini.G.miss,j:S.mini.G.jam,bs:S.mini.G.bestStreak})"))
    press('z'); pg.wait_for_timeout(2500); shot('dr_board')
    for i in range(120):
        if ev("S.lock===0&&!S.dlg&&!S.mini&&S.fade<0.05"): break
        press('z'); pg.wait_for_timeout(350)
    shot('done'); print('end',ev("JSON.stringify({goal:S.goal,done:S.flags.bsDone,P:[P.x|0,P.y|0,P.lift],nick:[NPC.nick.x|0,NPC.nick.y|0,NPC.nick.seated],ach:Object.keys(S.ach||{})})"))
    print('clips',clips[:10]); print('errs',errs); b.close()
