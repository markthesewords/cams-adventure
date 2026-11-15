from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome'); errs=[]
    ctx=b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True,device_scale_factor=2); pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e))); ev=pg.evaluate
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html'); pg.wait_for_timeout(1500)
    ev("void (S.title=false, S.dlg=null, window.__r=null, cubeTour().then(r=>window.__r=r))"); pg.wait_for_timeout(500)
    ev("pressed.a=true"); pg.wait_for_timeout(300)
    # bead maze: hold right, nudging up/down
    ev("K.right=true"); 
    for i in range(400):
        if ev("S.mini.G.mode")!='play': break
        ev("(()=>{const st=S.mini.G.st,w=st.wires[st.w]; let i=0; while(i<w.L.length-2&&w.L[i+1]<st.s) i++; const dx=w.p[i+1][0]-w.p[i][0], dy=w.p[i+1][1]-w.p[i][1]; K.right=dx>0.3; K.left=dx<-0.3; K.down=dy>0.3; K.up=dy<-0.3;})()"); pg.wait_for_timeout(60)
        if i==40: pg.screenshot(path='/tmp/shots/ct_play.png')
    ev("K.right=K.left=K.up=K.down=false"); print('maze',ev("JSON.stringify([S.mini.G.mode,S.mini.G.pts,S.mini.G.T.toFixed(1)])")); pg.wait_for_timeout(350); pg.screenshot(path='/tmp/shots/ct_gain.png'); pg.wait_for_timeout(1500)
    # sorter: solve by reading state
    ev("pressed.a=true"); pg.wait_for_timeout(300)
    for i in range(4): ev("(()=>{const st=S.mini.G.st; st.cur=['circle','square','triangle','star'].indexOf(st.order[st.i]); pressed.a=true})()"); pg.wait_for_timeout(250)
    print('sorter',ev("JSON.stringify(S.mini.G.pts)")); pg.wait_for_timeout(1800)
    ev("pressed.a=true"); pg.wait_for_timeout(300)
    for v in range(3):
        for k in ev(f"S.mini.G.st.cards.map((c,i)=>c==={v}?i:-1).filter(i=>i>=0)"): ev(f"S.mini.G.st.cur={k}; pressed.a=true"); pg.wait_for_timeout(250)
    print('doors',ev("JSON.stringify(S.mini.G.pts)")); pg.wait_for_timeout(1800)
    ev("pressed.a=true"); pg.wait_for_timeout(300); ev("S.mini.G.T=20"); pg.wait_for_timeout(300); pg.screenshot(path='/tmp/shots/ct_nobonus.png')
    for r in range(3):
        ev(f"S.mini.G.st.cur={r}")
        while ev(f"S.mini.G.st.rows[{r}]")!=0: ev("pressed.right=true"); pg.wait_for_timeout(200)
    pg.wait_for_timeout(2600); pg.screenshot(path='/tmp/shots/ct_end.png'); print('end',ev("JSON.stringify([S.mini&&S.mini.G.pts,S.mini&&S.mini.G.score])")); pg.wait_for_timeout(2500); print('result',ev("JSON.stringify(window.__r)"),errs); b.close()
