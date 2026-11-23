"""Original background tunes for Cam's Adventure.
Each style is a small recipe: tempo, key, chord progression, instruments, a comp
pattern, a bass pattern and a drum groove. The melody is built from a seeded
motif that repeats and answers itself (A A' B A) so it sounds written, not random.
Rendered with FluidSynth + FluidR3 GM, then normalised to mp3."""
import random, subprocess, sys, os, pretty_midi as pm

SF = '/usr/share/sounds/sf2/FluidR3_GM.sf2'
OUT = '/home/claude/music/out'
os.makedirs(OUT, exist_ok=True)

MAJ = [0, 2, 4, 5, 7, 9, 11]
MIN = [0, 2, 3, 5, 7, 8, 10]

def chord(scale, root_deg, key, octave=4, ext=3):
    return [key + 12 * octave + scale[(root_deg + 2 * i) % 7] + 12 * ((root_deg + 2 * i) // 7) for i in range(ext)]

def scale_note(scale, key, deg, octave=5):
    o, d = divmod(deg, 7)
    return key + 12 * (octave + o) + scale[d]

def make_motif(rng, beats_per_bar, chord_degs, scale, rhythm_pool):
    """2-bar motif: list of (start_beat, dur, scale_degree_offset_from_chord_root)"""
    out, t = [], 0.0
    total = beats_per_bar * 2
    while t < total - 0.01:
        d = rng.choice(rhythm_pool)
        if t + d > total: d = total - t
        bar = int(t // beats_per_bar)
        strong = abs(t - round(t)) < 0.01 and int(round(t)) % 2 == 0
        deg = rng.choice([0, 2, 4, 7] if strong else [0, 1, 2, 3, 4, 5, -1, 7])
        out.append((t, d, deg, bar))
        t += d
    # let the motif breathe: drop one weak note to a rest
    if len(out) > 4: out.pop(rng.randrange(2, len(out) - 1))
    return out

def render(name, st):
    rng = random.Random(st.get('seed', hash(name) & 0xffff))
    bpm, key, sc = st['bpm'], st['key'], (MIN if st.get('minor') else MAJ)
    bpb = st.get('bpb', 4)
    sw = st.get('swing', 0.0)
    spb = 60.0 / bpm
    prog = st['prog']                       # chord degrees, one per bar, 8 bars (A); 'progB' for B
    progB = st.get('progB', prog[4:] + prog[:4])
    form = st.get('form', 'AABA')
    m = pm.PrettyMIDI(initial_tempo=bpm)
    I = lambda prog_no, drum=False, nm='': pm.Instrument(program=prog_no, is_drum=drum, name=nm)
    mel = I(st['lead']); comp = I(st['comp']); bass = I(st['bass'])
    ctr = I(st['ctr']) if st.get('ctr') is not None else None
    pad = I(st['pad']) if st.get('pad') is not None else None
    dr = I(0, True)
    def T(beat):
        b = int(beat); f = beat - b
        if sw and abs(f - 0.5) < 0.01: f = 0.5 + sw
        return (b + f) * spb
    def N(inst, p, s, d, v):
        inst.notes.append(pm.Note(velocity=max(1, min(127, int(v))), pitch=int(p), start=T(s), end=T(s) + d * spb * 0.92))
    pool = st.get('rhythm', [0.5, 0.5, 1, 1, 1.5, 2])
    motA = make_motif(rng, bpb, prog, sc, pool)
    motB = make_motif(rng, bpb, progB, sc, pool)
    sections = [(c, prog if c == 'A' else progB) for c in form] * st.get('reps', 2)
    beat = 0.0
    if st.get('intro', True):   # 2 bars of comp + bass to settle in
        sections = [('I', prog[:2])] + sections
    for si, (sec, P) in enumerate(sections):
        nb = len(P)
        for bi, cdeg in enumerate(P):
            b0 = beat + bi * bpb
            ch = chord(sc, cdeg, key, st.get('compOct', 4), 3)
            # comp
            for (o, d, vel) in st['compPat']:
                for p in ch: N(comp, p, b0 + o, d, vel * st.get('compVol', 1))
            if pad:
                for p in ch: N(pad, p + 12 * st.get('padShift', 0), b0, bpb, 45 * st.get('padVol', 1))
            # bass
            root = key + 12 * st.get('bassOct', 2) + sc[cdeg % 7]
            fifth = key + 12 * st.get('bassOct', 2) + sc[(cdeg + 4) % 7] + (12 if sc[(cdeg + 4) % 7] < sc[cdeg % 7] else 0)
            for (o, d, which, vel) in st['bassPat']:
                N(bass, {'r': root, 'f': fifth, 'o': root + 12, 'l': fifth - 12}[which], b0 + o, d, vel)
            # drums
            for (o, note, vel) in st.get('drums', []):
                if o < bpb: N(dr, note, b0 + o, 0.2, vel * (1.08 if (o == 0 and bi % 4 == 0) else 1) + rng.randint(-6, 6))
        if sec != 'I':
            mot = motA if sec == 'A' else motB
            for half in range(nb // 2):
                vary = half % 2 == 1        # the answer phrase: same rhythm, moved notes, lands home
                for (o, d, deg, bar) in mot:
                    cdeg = P[half * 2 + bar]
                    dd = deg + (rng.choice([-1, 1, 2]) if vary and o > bpb else 0)
                    if vary and o + d >= 2 * bpb - 0.01: dd = 0
                    p = scale_note(sc, key, cdeg + dd, st.get('leadOct', 5))
                    N(mel, p, beat + half * 2 * bpb + o, d, st.get('leadVel', 92) - (10 if o % 1 else 0))
                    if ctr is not None and (o % 1 == 0) and rng.random() < st.get('ctrProb', 0.35):
                        N(ctr, p + 12 + st.get('ctrShift', 0), beat + half * 2 * bpb + o + st.get('ctrOff', 0), min(d, 1), st.get('ctrVel', 60))
        beat += nb * bpb
    # a soft final chord so a loop can crossfade nicely
    for p in chord(sc, 0, key, st.get('compOct', 4), 3): N(comp, p, beat, bpb, 70)
    N(bass, key + 12 * st.get('bassOct', 2), beat, bpb, 80)
    for i in [mel, comp, bass, ctr, pad, dr]:
        if i is not None and i.notes: m.instruments.append(i)
    mid = f'{OUT}/{name}.mid'; wav = f'{OUT}/{name}.wav'; mp3 = f'{OUT}/{name}.mp3'
    m.write(mid)
    subprocess.run(['fluidsynth', '-ni', '-g', '0.6', '-r', '32000', '-F', wav, SF, mid], check=True, capture_output=True)
    subprocess.run(['ffmpeg', '-nostdin', '-loglevel', 'error', '-y', '-i', wav, '-af',
                    'aecho=0.8:0.5:60:0.12,loudnorm=I=-18:TP=-2,afade=t=in:d=0.3', '-ac', '1', '-ar', '32000', '-b:a', '56k', mp3], check=True)
    os.remove(wav)
    return mp3

# GM programs
PIANO, EP, CELESTA, GLOCK, MBOX, VIBES, MARIMBA, XYLO = 0, 4, 8, 9, 10, 11, 12, 13
NYLON, STEEL, CLEANGTR, MUTEGTR = 24, 25, 27, 28
ACBASS, FINGBASS, PICKBASS, SLAPBASS, SYNBASS = 32, 33, 34, 36, 38
STRINGS, PIZZ, WARMPAD = 48, 45, 89
TRUMPET, TUBA, SAXA = 56, 58, 65
OBOE, BASSOON, CLAR, FLUTE, RECORDER, WHISTLE, OCARINA = 68, 70, 71, 73, 74, 78, 79
SQLEAD, SAWLEAD, ACCORD, HARMON, BANJO, KALIMBA, STEELDR = 80, 81, 21, 22, 105, 108, 114
K, SN, CH, OH, RIM, CLAP, TAMB, SHAK, CBELL, WB, CON = 36, 38, 42, 46, 37, 39, 54, 70, 56, 76, 63

def hats8(v=55): return [(i * 0.5, CH, v - (12 if i % 2 else 0)) for i in range(8)]
POP = [(0, K, 95), (2, K, 85), (1, SN, 80), (3, SN, 85)]
LIGHT = [(0, K, 70), (2, RIM, 50)] + [(i * 0.5, SHAK, 40 - (10 if i % 2 else 0)) for i in range(8)]
COMP_STRUM = [(0, 1, 70), (1.5, 0.5, 55), (2, 1, 65), (3, 0.5, 55), (3.5, 0.5, 50)]
COMP_OFF = [(0.5, 0.4, 60), (1.5, 0.4, 60), (2.5, 0.4, 60), (3.5, 0.4, 60)]
COMP_BLOCK = [(0, 2, 55), (2, 2, 50)]
COMP_ARP = [(0, 0.5, 55), (1, 0.5, 45), (2, 0.5, 50), (3, 0.5, 45)]
BASS_WALK = [(0, 1, 'r', 85), (1, 1, 'f', 70), (2, 1, 'o', 75), (3, 1, 'f', 70)]
BASS_ROOTS = [(0, 1.5, 'r', 85), (1.5, 0.5, 'r', 60), (2, 2, 'f', 75)]
BASS_OOM = [(0, 1, 'r', 90), (2, 1, 'f', 80)]
BASS_DRIVE = [(i * 0.5, 0.45, 'r' if i < 6 else 'f', 85 - (10 if i % 2 else 0)) for i in range(8)]

STYLES = {
  # areas
  'title':    dict(bpm=96,  key=2, prog=[0,4,5,3,0,4,3,4], lead=GLOCK, comp=STRINGS, compPat=COMP_BLOCK, bass=ACBASS, bassPat=BASS_ROOTS, ctr=FLUTE, ctrProb=0.4, ctrShift=-12, drums=LIGHT, leadOct=5, seed=11),
  'house_am': dict(bpm=84,  key=7, prog=[0,3,4,0,5,3,1,4], lead=FLUTE, comp=NYLON, compPat=COMP_ARP+[(0.5,0.5,40),(1.5,0.5,40),(2.5,0.5,40),(3.5,0.5,40)], bass=ACBASS, bassPat=BASS_ROOTS, ctr=CELESTA, ctrProb=0.3, drums=[(0,SHAK,35),(1,SHAK,25),(2,SHAK,35),(3,SHAK,25)], leadVel=80, seed=3),
  'house_pm': dict(bpm=92,  key=5, prog=[0,5,1,4,0,5,3,4], lead=VIBES, comp=EP, compPat=COMP_OFF, bass=FINGBASS, bassPat=BASS_WALK, swing=0.12, drums=[(0,K,65),(2,K,55),(1,RIM,45),(3,RIM,50)]+hats8(40), ctr=None, seed=21),
  'walk':     dict(bpm=112, key=0, prog=[0,4,5,3,0,3,4,0], lead=WHISTLE, comp=STEEL, compPat=COMP_STRUM, bass=PICKBASS, bassPat=BASS_OOM+[(3,0.5,'r',60),(3.5,0.5,'f',60)], drums=POP+hats8(45)+[(2.5,TAMB,40)], ctr=GLOCK, ctrProb=0.25, seed=7),
  'park':     dict(bpm=124, key=9, prog=[0,3,4,3,0,3,4,4], lead=STEELDR, comp=CLEANGTR, compPat=COMP_OFF, bass=FINGBASS, bassPat=BASS_DRIVE, drums=POP+hats8(50)+[(0.5,CON,45),(2.5,CON,45)], ctr=MARIMBA, ctrProb=0.3, rhythm=[0.5,0.5,1,1,1.5], seed=13),
  'cub':      dict(bpm=104, key=3, prog=[0,1,4,0,5,1,4,4], lead=VIBES, comp=NYLON, compPat=[(0,1,55),(1.5,1,50),(3,0.5,45)], bass=ACBASS, bassPat=[(0,1.5,'r',80),(1.5,0.5,'f',60),(2,1.5,'f',75),(3.5,0.5,'r',60)], drums=[(0,RIM,45),(0.75,RIM,35),(1.5,RIM,40),(2.5,RIM,40),(3,RIM,35)]+[(i*0.5,SHAK,35) for i in range(8)], ctr=FLUTE, ctrProb=0.2, seed=17),
  'bsmt':     dict(bpm=100, key=4, minor=True, prog=[0,0,3,4,0,0,5,4], lead=CLAR, comp=EP, compPat=[(0,0.25,70),(0.75,0.25,55),(1.5,0.25,60),(2.5,0.25,65)], bass=SLAPBASS, bassPat=[(0,0.5,'r',95),(0.75,0.25,'o',70),(1.5,0.5,'r',80),(2.5,0.5,'f',85),(3.5,0.25,'o',70)], drums=POP+hats8(50)+[(3.5,OH,45)], swing=0.08, rhythm=[0.5,0.5,1,1.5], seed=29),
  'yard':     dict(bpm=118, key=7, prog=[0,0,3,0,4,4,0,4], lead=HARMON, comp=BANJO, compPat=[(i*0.5,0.4,55-(15 if i%2 else 0)) for i in range(8)], compOct=4, bass=TUBA, bassPat=BASS_OOM, drums=[(1,SN,55),(3,SN,60),(0,K,70),(2,K,60)]+[(i*0.5,SHAK,30) for i in range(8)], ctr=STEEL, ctrProb=0.2, seed=31),
  # mini games
  'fling':    dict(bpm=110, key=2, minor=True, prog=[0,3,0,4,0,3,5,4], lead=BASSOON, comp=PIZZ, compPat=[(0,0.3,70),(1,0.3,60),(2,0.3,70),(3,0.3,60)], bass=PIZZ, bassPat=[(0,0.4,'r',85),(1,0.4,'f',70),(2,0.4,'r',80),(3,0.4,'l',70)], drums=[(0,WB,45),(2,WB,40),(3.5,WB,35)], rhythm=[0.5,0.5,1,1,0.5], leadOct=4, seed=41),
  'dress':    dict(bpm=132, key=5, bpb=3, prog=[0,4,4,0,3,0,4,0], lead=MBOX, comp=ACCORD, compPat=[(1,0.5,55),(2,0.5,50)], bass=TUBA, bassPat=[(0,1,'r',85)], drums=[(0,K,60),(1,CH,40),(2,CH,40)], ctr=GLOCK, ctrProb=0.3, rhythm=[0.5,1,1,1,2], seed=43, reps=2),
  'tread':    dict(bpm=150, key=9, minor=True, prog=[0,5,2,6,0,5,3,4], lead=SQLEAD, comp=SAWLEAD, compPat=[(i*0.5,0.3,40) for i in range(8)], compVol=0.6, bass=SYNBASS, bassPat=BASS_DRIVE, drums=[(0,K,100),(1,K,95),(2,K,100),(3,K,95),(1,CLAP,80),(3,CLAP,85)]+hats8(60), rhythm=[0.5,0.5,0.5,1], seed=47),
  'feed':     dict(bpm=168, key=10, prog=[0,4,4,0,0,4,4,0], progB=[3,0,4,0,3,0,4,0], lead=CLAR, comp=ACCORD, compPat=[(0.5,0.4,60),(1.5,0.4,60),(2.5,0.4,60),(3.5,0.4,60)], bass=TUBA, bassPat=BASS_OOM, drums=[(0,K,85),(2,K,80),(1,SN,60),(3,SN,65),(1,CH,45),(3,CH,45)], rhythm=[0.5,0.5,0.5,1], seed=53),
  'cube':     dict(bpm=116, key=0, prog=[0,5,3,4,0,5,1,4], lead=XYLO, comp=MARIMBA, compPat=COMP_ARP+[(0.5,0.5,40),(2.5,0.5,40)], bass=ACBASS, bassPat=BASS_ROOTS, drums=[(0,WB,50),(1,CBELL,30),(2,WB,45),(3,CBELL,30)], ctr=KALIMBA, ctrProb=0.3, rhythm=[0.5,0.5,1,1], seed=59),
  'bed':      dict(bpm=138, key=7, prog=[0,4,5,3,0,4,3,4], lead=SQLEAD, comp=CLEANGTR, compPat=COMP_OFF, bass=PICKBASS, bassPat=BASS_DRIVE, drums=POP+[(0.5,K,70)]+hats8(55), ctr=GLOCK, ctrProb=0.4, rhythm=[0.5,0.5,1,1], leadVel=80, seed=61),
  'slides':   dict(bpm=128, key=4, prog=[0,3,4,4,0,3,5,4], lead=TRUMPET, comp=CLEANGTR, compPat=COMP_STRUM, bass=FINGBASS, bassPat=BASS_DRIVE, drums=POP+hats8(55)+[(3.5,OH,50)], ctr=SAXA, ctrProb=0.25, ctrShift=-12, rhythm=[0.5,0.5,1,1,1.5], seed=67),
}

if __name__ == '__main__':
    names = sys.argv[1:] or list(STYLES)
    for n in names:
        print(render(n, STYLES[n]))
