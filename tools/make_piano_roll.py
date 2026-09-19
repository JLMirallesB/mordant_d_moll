#!/usr/bin/env python3
"""Genera assets/bwv565/piano-roll.svg: el MIDI interpretado perforado en un
rollo de pianola estándar de 88 notas, a escala 1:1 (unidades en milímetros).

Rollo de 88 notas (convención de Buffalo, 1908): 11¼″ de ancho, 9 orificios
por pulgada. Velocidad «tempo 70» = 7 pies por minuto ≈ 35,56 mm/s.

Uso: python3 tools/make_piano_roll.py
"""
import struct
from pathlib import Path

ROOT      = Path(__file__).resolve().parent.parent
MIDI_FILE = ROOT / 'assets/bwv565/midi-interpreted.mid'
SVG_FILE  = ROOT / 'assets/bwv565/piano-roll.svg'

INCH       = 25.4
ROLL_W     = 11.25 * INCH          # 285.75 mm de ancho de papel
PITCH      = INCH / 9              # 2.822 mm entre orificios
SPEED      = 7 * 12 * INCH / 60    # tempo 70 → 35.56 mm/s
HOLE_H     = 1.6                   # alto de la perforación (mm)
LEAD, TAIL = 25.0, 35.0            # papel antes y después de la música (mm)
MARGIN     = (ROLL_W - 87 * PITCH) / 2


def read_vlq(d, p):
    v = 0
    while True:
        b = d[p]; p += 1
        v = (v << 7) | (b & 0x7F)
        if b < 0x80:
            return v, p


def parse_notes(path):
    d = open(path, 'rb').read()
    ntracks, tpq = struct.unpack('>xxHH', d[8:14])
    pos, tempo, notes = 14, 500000, []
    for _ in range(ntracks):
        length = struct.unpack('>I', d[pos + 4:pos + 8])[0]
        p, end, tick, status, open_ = pos + 8, pos + 8 + length, 0, 0, {}
        while p < end:
            delta, p = read_vlq(d, p)
            tick += delta
            if d[p] == 0xFF:
                kind = d[p + 1]
                n, p = read_vlq(d, p + 2)
                if kind == 0x51:
                    tempo = int.from_bytes(d[p:p + 3], 'big')
                p += n
                continue
            if d[p] & 0x80:
                status = d[p]; p += 1
            kind = status >> 4
            size = 1 if kind in (0xC, 0xD) else 2
            a, b = d[p], (d[p + 1] if size == 2 else 0)
            p += size
            if kind == 0x9 and b > 0:
                open_[a] = (tick, b)
            elif kind == 0x8 or (kind == 0x9 and b == 0):
                if a in open_:
                    start, vel = open_.pop(a)
                    notes.append((a, start, tick, vel))
        pos = end
    sec = tempo / 1e6 / tpq
    return [(n, s * sec, e * sec, v) for n, s, e, v in notes]


def main():
    notes  = parse_notes(MIDI_FILE)
    music  = max(e for _, _, e, _ in notes) * SPEED
    length = LEAD + music + TAIL
    y_of   = lambda key: ROLL_W - MARGIN - (key - 21) * PITCH   # agudos arriba

    out = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{length:.2f}mm" height="{ROLL_W:.2f}mm" '
        f'viewBox="0 0 {length:.2f} {ROLL_W:.2f}">',
        '<title>BWV 565 · mordente inicial · rollo de pianola de 88 notas (escala 1:1)</title>',
        f'<rect width="{length:.2f}" height="{ROLL_W:.2f}" fill="#efe6cf"/>',
        f'<text x="4" y="8" font-family="serif" font-size="4.2" fill="#6b5a3a">'
        f'BWV 565 · Tempo 70</text>',
    ]
    for key in range(24, 109, 12):   # guías finas en cada Do (C1…C8)
        y = y_of(key)
        out.append(f'<line x1="0" y1="{y:.3f}" x2="{length:.2f}" y2="{y:.3f}" '
                   f'stroke="#d9ccaa" stroke-width="0.15"/>')
    for key, start, end, vel in sorted(notes, key=lambda n: (n[1], n[0])):
        x, w = LEAD + start * SPEED, (end - start) * SPEED
        out.append(f'<rect x="{x:.3f}" y="{y_of(key) - HOLE_H / 2:.3f}" width="{w:.3f}" '
                   f'height="{HOLE_H}" rx="{HOLE_H / 2}" fill="#2a2418">'
                   f'<title>MIDI {key} · {start * 1000:.0f}–{end * 1000:.0f} ms</title></rect>')
    out.append('</svg>\n')
    SVG_FILE.write_text('\n'.join(out))
    print(f'{SVG_FILE.relative_to(ROOT)}: {len(notes)} perforaciones, '
          f'{length:.1f} × {ROLL_W:.2f} mm')


if __name__ == '__main__':
    main()
