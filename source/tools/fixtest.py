from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome'); errs=[]
    def page(h):
        pg=b.new_page(viewport={'width':1280,'height':720}); pg.on('pageerror',lambda e:errs.append(h+':'+str(e))); pg.goto('file:///home/claude/game/build/Cams_Adventure.html'+h); pg.wait_for_timeout(900); pg.keyboard.press('z'); return pg
    def settle(pg,cond="S.lock===0&&S.fade<0.05&&!S.mini&&!S.dlg",n=200,shotat=None):
        for i in range(n):
            if pg.evaluate("S.dlg?1:0"):
                if shotat and shotat[0] in pg.evaluate("S.dlg.text||''"): pg.wait_for_timeout(900); pg.screenshot(path=shotat[1]); shotat=None
                pg.keyboard.press('z')
            elif pg.evaluate(cond): return True
            pg.wait_for_timeout(250)
        return False
    import sys
    SEC=sys.argv[1] if len(sys.argv)>1 else 'abc'
    if 'a' in SEC:
        pg=page('#pm'); pg.wait_for_timeout(1500)
        for i in range(120):
            if 'good nap' in (pg.evaluate("S.dlg?S.dlg.text:''") or ''): pg.wait_for_timeout(900); pg.screenshot(path='/tmp/shots/fx_crib.png'); print('crib shot'); break
            pg.keyboard.press('z'); pg.wait_for_timeout(300)
        pg.close()
        pg=page(''); pg.wait_for_timeout(1000)
        for i in range(200):
            if 'sleep okay' in (pg.evaluate("S.dlg?S.dlg.text:''") or ''): pg.wait_for_timeout(900); pg.screenshot(path='/tmp/shots/fx_crib_am.png'); print('crib am shot'); break
            pg.keyboard.press('z'); pg.wait_for_timeout(300)
        pg.close()
    pg=page('#bsmt'); print('bs',settle(pg)); pg.screenshot(path='/tmp/shots/fx_nick.png')
    pg.evaluate("S.cut=true; void drumGame().then(r=>{window._dr=r; S.mini=null; S.cut=false;})"); pg.wait_for_timeout(600)
    for k in ['z','ArrowUp','ArrowRight','x']: pg.keyboard.press(k); pg.wait_for_timeout(130); pg.screenshot(path=f'/tmp/shots/fx_dr_{k}.png'); pg.wait_for_timeout(250)
    pg.evaluate("(()=>{const G=S.mini.G; G.phase='end'; G.pT=0; G.endCard=true;})()"); pg.wait_for_timeout(1600)
    pg.keyboard.press('ArrowDown'); pg.wait_for_timeout(300); print('still up after drum key', pg.evaluate("!!(S.mini&&S.mini.drums)")); pg.keyboard.press('z'); pg.wait_for_timeout(500); print('closed after A', pg.evaluate("!S.mini&&!!window._dr")); pg.close()
    # 3 playground: Grace facing, hair, finish prompt
    pg=page('#park'); pg.wait_for_timeout(1500)
    for i in range(80):
        if pg.evaluate("S.dlg?1:0"): pg.keyboard.press('z')
        elif pg.evaluate("S.map==='park'&&S.lock===1&&S.fade<0.05&&!S.dlg") or pg.evaluate("S.map==='park'&&S.lock===0&&S.fade<0.05"): break
        pg.wait_for_timeout(300)
    pg.evaluate("void runHandler('p_struct')"); pg.wait_for_timeout(1800)
    pg.keyboard.down('ArrowRight'); pg.wait_for_timeout(1400); pg.screenshot(path='/tmp/shots/fx_pg_r.png'); pg.keyboard.up('ArrowRight'); pg.keyboard.down('ArrowLeft'); pg.wait_for_timeout(900); pg.screenshot(path='/tmp/shots/fx_pg_l.png'); pg.keyboard.up('ArrowLeft')
    pg.evaluate("(()=>{ PGS.slides={big:500,curly:400}; for(let i=0;i<PG.stars.length;i++) PGS.got.add(i); })()"); pg.wait_for_timeout(700); pg.screenshot(path='/tmp/shots/fx_pg_ask.png')
    pg.keyboard.press('ArrowRight'); pg.keyboard.press('z'); pg.wait_for_timeout(500); pg.screenshot(path='/tmp/shots/fx_pg_keep.png'); print('keep playing ->', pg.evaluate("!!(S.mini&&!S.mini.card)"))
    pg.keyboard.down('x'); pg.wait_for_timeout(1200); pg.keyboard.up('x'); pg.wait_for_timeout(1500); pg.screenshot(path='/tmp/shots/fx_pg_done.png'); print('after hold B card', pg.evaluate("!!(S.mini&&S.mini.card)")); pg.close()
    # 4 cub hair
    pg=page('#cub'); pg.wait_for_timeout(9000)
    for i in range(10): pg.keyboard.press('z'); pg.wait_for_timeout(700)
    pg.screenshot(path='/tmp/shots/fx_cub.png'); pg.close()
    pg=page('#walk'); pg.wait_for_timeout(6000)
    for i in range(6): pg.keyboard.press('z'); pg.wait_for_timeout(600)
    pg.screenshot(path='/tmp/shots/fx_walk.png'); pg.close()
    print(errs); b.close()
