import sys, json
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome'); pg=b.new_page(viewport=({'width':390,'height':844} if bool(__import__('os').environ.get('PHONE')) else {'width':1280,'height':720}),has_touch=bool(__import__('os').environ.get('PHONE')),is_mobile=bool(__import__('os').environ.get('PHONE')))
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html#park'); pg.wait_for_timeout(600); pg.evaluate("localStorage.clear()")
    ev=pg.evaluate; press=pg.keyboard.press; press('z')
    def shot(n): pg.screenshot(path=f'/tmp/shots/park_{n}.png')
    def settle(maxs=40):
        pg.wait_for_timeout(350)
        for _ in range(int(maxs*4)):
            if ev("S.dlg?1:0"):
                if ev("S.dlg.choices?1:0"): return 'choice'
                press('z')
            elif ev("S.mini?1:0"): pass
            elif ev("S.lock===0&&S.fade<0.05"): return 'ok'
            pg.wait_for_timeout(250)
        return 'timeout'
    def go(pts):
        for tx,ty in pts:
            for _ in range(160):
                x,y=ev("[P.x,P.y]")
                if abs(x-tx)<3 and abs(y-ty)<3: break
                ks=[]
                if x<tx-2: ks.append('ArrowRight')
                elif x>tx+2: ks.append('ArrowLeft')
                if y<ty-2: ks.append('ArrowDown')
                elif y>ty+2: ks.append('ArrowUp')
                for k in ks: pg.keyboard.down(k)
                pg.wait_for_timeout(90)
                for k in ks: pg.keyboard.up(k)
            else: print('STUCK',tx,ty,ev("[Math.round(P.x),Math.round(P.y)]"))
    def choose(i):
        pg.wait_for_timeout(700)
        for _ in range(i): press('ArrowDown'); pg.wait_for_timeout(90)
        press('z')
    MODE=sys.argv[1] if len(sys.argv)>1 else 'good'
    SH=(20,150,330,470) if len(sys.argv)<3 else ()
    import random; random.seed(3)
    def play(tag):
        n=0; shots=0; down=False
        while True:
            st=ev("""(()=>{const m=S.mini; if(!m) return null; if(m.card) return {card:1}; if(!m.G) return {other:1}; const G=m.G; if(m.slide) return {slide:1,ph:G.phase,s:G.s,marks:G.marks.filter(q=>!q.done&&!q.miss).map(q=>[q.s,q.key])};
              if(!m.obs) return {other:1}; const o=m.obs.filter(o=>!o.hit&&!o.ok&&(o.b||o.x)>G.x-2)[0]; return {ph:G.phase,x:G.x,air:G.air,sp:G.speed,bonk:G.bonk,o:o?[o.t,o.x,o.b||o.x]:null,score:G.score,stars:G.stars,total:G.total,bonks:G.bonks}})()""")
            n+=1
            if st and st.get('bonk',0)>0.6 and st.get('o') is not None and n%3==0: print('BONKLOG',st['x'],st['o'])
            if st is None or n>4000: break
            if st.get('other'): pg.wait_for_timeout(100); continue
            if st.get('card'):
                if down: pg.keyboard.up('ArrowDown'); down=False
                shot(tag+'_card'); pg.wait_for_timeout(1000); press('z'); pg.wait_for_timeout(1200); shot(tag+'_board'); press('z'); pg.wait_for_timeout(600); press('z'); break
            if st.get('slide'):
                if down: pg.keyboard.up('ArrowDown'); down=False
                if shots<8 and n%14==0: shot(f'{tag}_slide{shots}'); shots+=1
                for s_,k in st['marks']:
                    if abs(s_-st['s'])<0.018 and (MODE=='good' or random.random()<0.5): press({'a':'z','left':'ArrowLeft','right':'ArrowRight'}[k])
                pg.wait_for_timeout(16); continue
            if st['ph']=='run' and st['o'] and st['bonk']<=0:
                t_,x0,x1=st['o']; d=x0-st['x']; skip=(MODE=='bad' and random.random()<0.02)
                if t_=='bar':
                    if d<14 and not down and not skip: pg.keyboard.down('ArrowDown'); down=True
                else:
                    if down: pg.keyboard.up('ArrowDown'); down=False
                    lead=10 if t_=='step' else 3
                    if d<lead and not st['air'] and not skip and MODE!='idle': pg.keyboard.down('z'); pg.wait_for_timeout(180 if t_=='gap' else 110); pg.keyboard.up('z')
            elif down and (not st['o'] or st['o'][0]!='bar'): pg.keyboard.up('ArrowDown'); down=False
            if n in SH: shot(f'{tag}_run{n}')
            pg.wait_for_timeout(25)
        if down: pg.keyboard.up('ArrowDown')
        return st
    print(settle()); shot('map0')
    go([(130,120),(130,172),(212,172),(212,152)]); press('ArrowUp'); pg.wait_for_timeout(80); press('z'); print(settle()); choose(0); pg.wait_for_timeout(1200)
    print('big',play('big')); print(settle()); shot('after_big'); print(ev("JSON.stringify([META.ach,META.best])"))
    go([(212,172),(212,152)]); press('ArrowUp'); pg.wait_for_timeout(80); press('z'); print(settle()); choose(1); pg.wait_for_timeout(1200)
    print('curly',play('curly')); print(settle()); shot('after_curly'); print(ev("JSON.stringify([META.ach,META.best])")); print('errs',errs)
    b.close()
