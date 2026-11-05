/* EXPO DESK 홀 맵 — 개략 배치도(2D SVG) + 입체 보기(3D 캔버스) + 길찾기(A*).
   홀 외곽 치수·구역·화물출입구 규격은 2024 CAD 정제 데이터 기준. 부스 배치·번호·예약 현황·편의시설 위치는 데모용 개략값. */
(function () {
  'use strict';
  var HALLS = {
    c: { key: 'c', name: 'Hall C', floor: '3F', w: 144, h: 72, letter: 'C', mine: ['C-228', 'C-229', 'C-230', 'C-231'],
      zones: [{ n: 'C4', x: 0, w: 36 }, { n: 'C3', x: 36, w: 36 }, { n: 'C2', x: 72, w: 36 }, { n: 'C1', x: 108, w: 36 }],
      doors: [{ id: 'd1', n: '화물출입구 1', x: 31.5, w: 5.4, spec: 'W 5.4 × H 5.0m' }, { id: 'd2', n: '화물출입구 2', x: 58.5, w: 5.4, spec: 'W 5.4 × H 5.0m' }, { id: 'd3', n: '화물출입구 3', x: 85.5, w: 5.4, spec: 'W 5.4 × H 5.0m' }, { id: 'd4', n: '화물출입구 4', x: 112.5, w: 5.4, spec: 'W 5.4 × H 5.0m' }],
      gates: [{ id: 'g1', n: 'C3·C4 주출입구', x: 36, w: 8 }, { id: 'g2', n: 'C1·C2 주출입구', x: 108, w: 8 }],
      fac: [{ id: 'f-off1', n: '주최자사무실', side: 's', x: 18, w: 8, t: 'office' }, { id: 'f-wc1', n: '화장실', side: 's', x: 50, w: 7, t: 'wc' }, { id: 'f-util', n: '다용도실', side: 's', x: 72, w: 7, t: 'room' }, { id: 'f-wc2', n: '화장실', side: 's', x: 94, w: 7, t: 'wc' }, { id: 'f-off2', n: '주최자사무실', side: 's', x: 124, w: 8, t: 'office' },
        { id: 'f-pantry', n: '탕비실', side: 'n', x: 6, w: 6, t: 'room' }, { id: 'f-help1', n: '도우미휴게실', side: 'n', x: 44, w: 7, t: 'room' }, { id: 'f-help2', n: '도우미휴게실', side: 'n', x: 100, w: 7, t: 'room' }, { id: 'f-util2', n: '다용도실', side: 'n', x: 132, w: 6, t: 'room' }],
      src: 'coex-dwg-hall-c-floor-2024#03-loading' },
    a: { key: 'a', name: 'Hall A', floor: '1F', w: 144, h: 72, letter: 'A', mine: [],
      zones: [{ n: 'A4', x: 0, w: 36 }, { n: 'A3', x: 36, w: 36 }, { n: 'A2', x: 72, w: 36 }, { n: 'A1', x: 108, w: 36 }],
      doors: [{ id: 'd1', n: '화물출입구 1', x: 27, w: 6.5, spec: 'W 6.5 × H 4.3m' }, { id: 'd2', n: '화물출입구 2', x: 58.5, w: 5.5, spec: 'W 5.5 × H 5.5m' }, { id: 'd3', n: '화물출입구 3', x: 86, w: 5.9, spec: 'W 5.9 × H 5.5m' }, { id: 'd4', n: '화물출입구 4', x: 95, w: 3.9, spec: 'W 3.9 × H 5.5m' }, { id: 'd5', n: '화물출입구 5', x: 113, w: 6.9, spec: 'W 6.9 × H 5.5m' }, { id: 'd6', n: '화물출입구 6', x: 122, w: 2.5, spec: 'W 2.5 × H 5.5m' }],
      gates: [{ id: 'g1', n: 'A3·A4 주출입구', x: 36, w: 8 }, { id: 'g2', n: 'A1·A2 주출입구', x: 108, w: 8 }],
      fac: [{ id: 'f-off1', n: '주최자사무실', side: 's', x: 18, w: 8, t: 'office' }, { id: 'f-wc1', n: '화장실', side: 's', x: 52, w: 7, t: 'wc' }, { id: 'f-wc2', n: '화장실', side: 's', x: 92, w: 7, t: 'wc' }, { id: 'f-off2', n: '주최자사무실', side: 's', x: 126, w: 8, t: 'office' }, { id: 'f-util', n: '다용도실', side: 'n', x: 8, w: 6, t: 'room' }, { id: 'f-util2', n: '다용도실', side: 'n', x: 136, w: 6, t: 'room' }],
      note: 'A1~A4 구역 분할 사용 여부는 확인 필요', src: 'coex-dwg-hall-a-floor-2024#03-loading' },
    b: { key: 'b', name: 'Hall B', floor: '1F', w: 108, h: 81, letter: 'B', mine: [],
      zones: [{ n: 'S/S', x: 0, w: 18, ss: true }, { n: 'B1', x: 18, w: 45 }, { n: 'B2', x: 63, w: 45 }],
      doors: [{ id: 'd1', n: '화물출입구 1', x: 40, w: 7.5, spec: 'W 7.5 × H 4.3m' }, { id: 'd2', n: '화물출입구 2', x: 86, w: 7.5, spec: 'W 7.5 × H 4.3m' }],
      gates: [{ id: 'g1', n: 'B1 주출입구', x: 40, w: 8 }, { id: 'g2', n: 'B2 주출입구', x: 86, w: 8 }],
      fac: [{ id: 'f-util', n: '다용도실', side: 'n', x: 52, w: 6, t: 'room' }, { id: 'f-util2', n: '다용도실', side: 'n', x: 98, w: 6, t: 'room' }, { id: 'f-wc1', n: '화장실', side: 's', x: 62, w: 7, t: 'wc' }],
      src: 'coex-dwg-hall-b-floor-2024#02-loading-support' },
    d: { key: 'd', name: 'Hall D', floor: '3F', w: 99, h: 81, letter: 'D', mine: [],
      zones: [{ n: 'S/S', x: 0, w: 18, ss: true }, { n: 'D1', x: 18, w: 36 }, { n: '중앙', x: 54, w: 9 }, { n: 'D2', x: 63, w: 36 }],
      doors: [{ id: 'd1', n: '화물출입구 1', x: 36, w: 7.5, spec: 'W 7.5 × H 4.3m' }, { id: 'd2', n: '화물출입구 2', x: 81, w: 7.5, spec: 'W 7.5 × H 4.3m' }],
      gates: [{ id: 'g1', n: 'D1 주출입구', x: 36, w: 8 }, { id: 'g2', n: 'D2 주출입구', x: 81, w: 8 }],
      fac: [{ id: 'f-util', n: '다용도실', side: 'n', x: 46, w: 6, t: 'room' }, { id: 'f-util2', n: '다용도실', side: 'n', x: 91, w: 6, t: 'room' }, { id: 'f-wc1', n: '화장실', side: 's', x: 58, w: 7, t: 'wc' }],
      src: 'coex-dwg-hall-d-floor-2024#02-loading-support' }
  };
  var EXHIBITORS = ['한빛로보틱스', '대성정밀', '미래오토텍', '그린팩토리', '세온비전', '누리센서', '케이드라이브', '알파모션', '도담테크', '오성기계', '바로AI', '청람에너지', '유니로보', '하나계측', '에이스밸브', '모아팩', '신우산전', '라온엑스', '티엠솔루션', '프라임CNC'];

  function rng(seed) { var s = seed; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }

  /* 부스 생성: 외곽 6m 통로, 2열 블록(깊이 6m) + 통로 3m, 8부스마다 교차통로 4.5m */
  var cache = {};
  function model(key) {
    if (cache[key]) return cache[key];
    var H = HALLS[key], booths = [], r = rng(key.charCodeAt(0) * 97 + 13);
    var m = 6, rowY = m, row = 1;
    while (rowY + 6 <= H.h - m) {
      ['u', 'l'].forEach(function (side, si) {
        var y = rowY + si * 3, k = 0, x = m;
        H.zones.forEach(function (z) { if (z.ss && x < z.x + z.w) x = z.x + z.w + 3; });
        var run = 0;
        while (x + 3 <= H.w - m) {
          var label = H.letter + '-' + (row * 100 + (si ? 50 : 0) + k + 1);
          var st = r() < 0.8 ? 'booked' : 'vacant';
          booths.push({ id: label, x: x, y: y, w: 3, h: 3, row: row, side: side, st: st, co: st === 'booked' ? EXHIBITORS[1 + Math.floor(r() * (EXHIBITORS.length - 1))] + '(데모)' : '' });
          k++; run++; x += 3;
          if (run === 8) { run = 0; x += 4.5; }
        }
      });
      rowY += 9; row++;
    }
    H.mine.forEach(function (id) { booths.forEach(function (b) { if (b.id === id) { b.st = 'mine'; b.co = '㈜한빛로보틱스(데모)'; } }); });
    var res = { hall: H, booths: booths };
    cache[key] = res; return res;
  }

  /* ---------- 길찾기: 1m 격자 A* (8방향) ---------- */
  function grid(M) {
    if (M.grid) return M.grid;
    var W = M.hall.w, Hh = M.hall.h, g = new Uint8Array(W * Hh);
    M.booths.forEach(function (b) { for (var yy = Math.floor(b.y); yy < Math.ceil(b.y + b.h); yy++) for (var xx = Math.floor(b.x); xx < Math.ceil(b.x + b.w); xx++) g[yy * W + xx] = 1; });
    M.grid = g; return g;
  }
  function nearestFree(M, x, y) {
    var g = grid(M), W = M.hall.w, Hh = M.hall.h, best = null, bd = 1e9;
    for (var r = 0; r < 12 && !best; r++) for (var yy = Math.max(0, Math.floor(y) - r); yy <= Math.min(Hh - 1, Math.floor(y) + r); yy++) for (var xx = Math.max(0, Math.floor(x) - r); xx <= Math.min(W - 1, Math.floor(x) + r); xx++) {
      if (!g[yy * W + xx]) { var d = Math.hypot(xx + .5 - x, yy + .5 - y); if (d < bd) { bd = d; best = [xx, yy]; } }
    }
    return best;
  }
  function astar(M, a, b) {
    var g = grid(M), W = M.hall.w, Hh = M.hall.h, N = W * Hh;
    var gs = new Float32Array(N).fill(1e9), came = new Int32Array(N).fill(-1), closed = new Uint8Array(N);
    var s = a[1] * W + a[0], t = b[1] * W + b[0], open = [s]; gs[s] = 0;
    function h(i) { var dx = Math.abs(i % W - b[0]), dy = Math.abs(((i / W) | 0) - b[1]); return Math.max(dx, dy) + .414 * Math.min(dx, dy); }
    var D = [[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [1, 1, 1.414], [1, -1, 1.414], [-1, 1, 1.414], [-1, -1, 1.414]];
    while (open.length) {
      var bi = 0, bf = 1e9;
      for (var i = 0; i < open.length; i++) { var f = gs[open[i]] + h(open[i]); if (f < bf) { bf = f; bi = i; } }
      var c = open[bi]; open[bi] = open[open.length - 1]; open.pop();
      if (c === t) break;
      if (closed[c]) continue; closed[c] = 1;
      var cx = c % W, cy = (c / W) | 0;
      for (var d = 0; d < 8; d++) {
        var nx = cx + D[d][0], ny = cy + D[d][1]; if (nx < 0 || ny < 0 || nx >= W || ny >= Hh) continue;
        var n = ny * W + nx; if (g[n] || closed[n]) continue;
        if (d >= 4 && (g[cy * W + nx] || g[ny * W + cx])) continue;
        var ng = gs[c] + D[d][2]; if (ng < gs[n]) { gs[n] = ng; came[n] = c; open.push(n); }
      }
    }
    if (came[t] < 0 && s !== t) return null;
    var path = [], k = t; while (k >= 0) { path.push([k % W + .5, ((k / W) | 0) + .5]); if (k === s) break; k = came[k]; }
    path.reverse();
    /* 꺾이는 점만 남기기 */
    var out = [path[0]];
    for (var j = 1; j < path.length - 1; j++) { var p0 = out[out.length - 1], p1 = path[j], p2 = path[j + 1]; var d1 = [Math.sign(p1[0] - p0[0]), Math.sign(p1[1] - p0[1])], d2 = [Math.sign(p2[0] - p1[0]), Math.sign(p2[1] - p1[1])]; if (d1[0] !== d2[0] || d1[1] !== d2[1]) out.push(p1); }
    out.push(path[path.length - 1]);
    return { pts: out, len: gs[t] };
  }
  function boothCenter(b) { return [b.x + b.w / 2, b.y + b.h / 2]; }
  function poiList(M) {
    var H = M.hall, L = [];
    H.doors.forEach(function (d) { L.push({ id: d.id, n: d.n, t: 'door', x: d.x, y: 0.5, spec: d.spec }); });
    H.gates.forEach(function (d) { L.push({ id: d.id, n: d.n, t: 'gate', x: d.x, y: H.h - .5 }); });
    H.fac.forEach(function (f) { L.push({ id: f.id, n: f.n, t: f.t, x: f.x, y: f.side === 'n' ? .5 : H.h - .5 }); });
    return L;
  }
  function route(M, fromBooth, to) {
    var a = nearestFree(M, fromBooth[0], fromBooth[1]), b = to.booth ? nearestFree(M, to.x, to.y) : nearestFree(M, to.x, to.y);
    if (!a || !b) return null;
    var r = astar(M, a, b); if (!r) return null;
    r.pts.unshift(fromBooth.slice()); if (to.booth) r.pts.push([to.x, to.y]); else r.pts.push([to.x, to.t === 'door' ? 0 : to.t === 'gate' ? M.hall.h : (to.y < 1 ? 2.1 : M.hall.h - 2.1)]);
    var len = 0; for (var i = 1; i < r.pts.length; i++) len += Math.hypot(r.pts[i][0] - r.pts[i - 1][0], r.pts[i][1] - r.pts[i - 1][1]);
    r.len = len; r.steps = steps(r.pts); return r;
  }
  function steps(pts) {
    var out = [], acc = null;
    for (var i = 1; i < pts.length; i++) {
      var dx = pts[i][0] - pts[i - 1][0], dy = pts[i][1] - pts[i - 1][1], dist = Math.hypot(dx, dy);
      if (dist < .2) continue;
      var ang = Math.atan2(-dy, dx) * 180 / Math.PI, dir = ang > -22.5 && ang <= 22.5 ? '동쪽' : ang > 22.5 && ang <= 67.5 ? '북동쪽' : ang > 67.5 && ang <= 112.5 ? '북쪽(화물출입구 방향)' : ang > 112.5 && ang <= 157.5 ? '북서쪽' : ang > 157.5 || ang <= -157.5 ? '서쪽' : ang > -157.5 && ang <= -112.5 ? '남서쪽' : ang > -112.5 && ang <= -67.5 ? '남쪽(주출입구 방향)' : '남동쪽';
      if (acc && acc.dir === dir) acc.d += dist; else { acc = { dir: dir, d: dist }; out.push(acc); }
    }
    return out.filter(function (s) { return s.d >= 1; }).map(function (s) { return { dir: s.dir, d: Math.round(s.d) }; });
  }

  /* ---------- 2D SVG ---------- */
  function svg2D(M, o) {
    var H = M.hall, pad = 8, W = H.w + pad * 2, Ht = H.h + pad * 2 + 6;
    var s = '<svg class="hm2d" viewBox="' + (-pad) + ' ' + (-pad - 2) + ' ' + W + ' ' + Ht + '" role="img" aria-label="' + H.name + ' 부스 배치도">';
    s += '<rect x="0" y="0" width="' + H.w + '" height="' + H.h + '" class="hm-floor" rx="0.6"/>';
    for (var gx = 18; gx < H.w; gx += 18) for (var gy = 18; gy < H.h; gy += 18) s += '<circle cx="' + gx + '" cy="' + gy + '" r="0.35" class="hm-col"/>';
    H.zones.forEach(function (z, i) {
      if (i > 0) s += '<line x1="' + z.x + '" y1="0" x2="' + z.x + '" y2="' + H.h + '" class="hm-part"/>';
      s += '<text x="' + (z.x + z.w / 2) + '" y="' + (H.h / 2 + 4) + '" class="hm-zone">' + z.n + '</text>';
      if (z.ss) s += '<rect x="' + z.x + '" y="' + (H.h - 40) / 2 + '" width="' + z.w + '" height="40" class="hm-ss"/>';
    });
    M.booths.forEach(function (b) {
      var cls = 'hm-b ' + b.st + (o.sel === b.id ? ' sel' : '') + (o.hi && o.hi.indexOf(b.id) >= 0 ? ' hi' : '') + (o.filter === 'vacant' && b.st !== 'vacant' ? ' dim' : '');
      s += '<rect data-booth="' + b.id + '" x="' + (b.x + .15) + '" y="' + (b.y + .15) + '" width="' + (b.w - .3) + '" height="' + (b.h - .3) + '" rx="0.35" class="' + cls + '"><title>' + b.id + ' · ' + (b.st === 'vacant' ? '공실' : b.co) + '</title></rect>';
    });
    /* 벽: 문 위치는 비워 둠 */
    function wall(y, gaps) {
      var segs = [], x0 = 0; gaps.slice().sort(function (a, b) { return a.x - b.x; }).forEach(function (g) { segs.push([x0, g.x - g.w / 2]); x0 = g.x + g.w / 2; }); segs.push([x0, H.w]);
      return segs.map(function (sg) { return '<line x1="' + sg[0] + '" y1="' + y + '" x2="' + sg[1] + '" y2="' + y + '" class="hm-wall"/>'; }).join('');
    }
    s += wall(0, H.doors) + wall(H.h, H.gates) + '<line x1="0" y1="0" x2="0" y2="' + H.h + '" class="hm-wall"/><line x1="' + H.w + '" y1="0" x2="' + H.w + '" y2="' + H.h + '" class="hm-wall"/>';
    H.doors.forEach(function (d) { s += '<g class="hm-poi' + (o.dest === d.id ? ' on' : '') + '" data-poi="' + d.id + '"><rect x="' + (d.x - d.w / 2) + '" y="-4.6" width="' + d.w + '" height="4" rx="0.6" class="hm-door"/><text x="' + d.x + '" y="-5.6" class="hm-lbl">' + d.n.replace('화물출입구 ', '화물 ') + '</text></g>'; });
    H.gates.forEach(function (d) { s += '<g class="hm-poi' + (o.dest === d.id ? ' on' : '') + '" data-poi="' + d.id + '"><rect x="' + (d.x - d.w / 2) + '" y="' + (H.h + .6) + '" width="' + d.w + '" height="4" rx="0.6" class="hm-gate"/><text x="' + d.x + '" y="' + (H.h + 7.6) + '" class="hm-lbl">' + d.n + '</text></g>'; });
    H.fac.forEach(function (f) { var y = f.side === 'n' ? 0.6 : H.h - 3.6; s += '<g class="hm-poi' + (o.dest === f.id ? ' on' : '') + '" data-poi="' + f.id + '"><rect x="' + (f.x - f.w / 2) + '" y="' + y + '" width="' + f.w + '" height="3" rx="0.4" class="hm-fac ' + f.t + '"/><text x="' + f.x + '" y="' + (y + 2.05) + '" class="hm-flbl">' + f.n + '</text></g>'; });
    if (o.route) {
      var d = o.route.pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(2) + ' ' + p[1].toFixed(2); }).join(' ');
      s += '<path d="' + d + '" class="hm-route-bg"/><path d="' + d + '" class="hm-route"/>';
      var e = o.route.pts[o.route.pts.length - 1], st = o.route.pts[0];
      s += '<g class="hm-pin start"><circle cx="' + st[0] + '" cy="' + st[1] + '" r="1.6"/><text x="' + st[0] + '" y="' + (st[1] - 2.4) + '">출발</text></g><g class="hm-pin end"><circle cx="' + e[0] + '" cy="' + e[1] + '" r="1.6"/><text x="' + e[0] + '" y="' + (e[1] < 3 ? e[1] + 4.6 : e[1] - 2.4) + '">도착</text></g>';
    }
    if (o.mine) { var mb = M.booths.filter(function (b) { return b.st === 'mine'; }); if (mb.length) { var mx = (mb[0].x + mb[mb.length - 1].x + 3) / 2, my = mb[0].y; s += '<g class="hm-you"><rect x="' + (mx - 7) + '" y="' + (my - 5.4) + '" width="14" height="4" rx="2"/><text x="' + mx + '" y="' + (my - 2.55) + '">내 부스</text></g>'; } }
    s += '<text x="' + H.w + '" y="' + (H.h + 12) + '" class="hm-scale" text-anchor="end">N ↑ · 격자 18m · 1칸 3×3m</text>';
    return s + '</svg>';
  }

  /* ---------- 3D (등각 투영 캔버스) ---------- */
  function draw3D(canvas, M, o) {
    var H = M.hall, dpr = window.devicePixelRatio || 1, cw = canvas.clientWidth, ch = canvas.clientHeight;
    canvas.width = cw * dpr; canvas.height = ch * dpr;
    var ctx = canvas.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, cw, ch);
    var cs = getComputedStyle(document.documentElement), C = function (n) { return cs.getPropertyValue(n).trim(); };
    var th = (o.angle == null ? -28 : o.angle) * Math.PI / 180, tilt = 0.52, cx = H.w / 2, cy = H.h / 2;
    function rot(x, y) { var dx = x - cx, dy = y - cy; return [dx * Math.cos(th) - dy * Math.sin(th), dx * Math.sin(th) + dy * Math.cos(th)]; }
    var span = 0; [[0, 0], [H.w, 0], [0, H.h], [H.w, H.h]].forEach(function (p) { var r = rot(p[0], p[1]); span = Math.max(span, Math.abs(r[0]) * 2, Math.abs(r[1]) * 2 * tilt + 20); });
    var sc = Math.min(cw / (span + 16), ch / (span * tilt + 30)) * (o.zoom || 1);
    function P(x, y, z) { var r = rot(x, y); return [cw / 2 + r[0] * sc, ch / 2 + 10 + (r[1] * tilt - (z || 0) * 0.9) * sc]; }
    function poly(pts, fill, stroke) { ctx.beginPath(); pts.forEach(function (p, i) { i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }); ctx.closePath(); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); } }
    /* 바닥·벽 */
    poly([P(0, 0), P(H.w, 0), P(H.w, H.h), P(0, H.h)], C('--map-floor'), C('--map-wall'));
    var wallH = 6;
    [[0, 0, H.w, 0], [H.w, 0, H.w, H.h], [H.w, H.h, 0, H.h], [0, H.h, 0, 0]].forEach(function (w) {
      var r1 = rot(w[0], w[1]), r2 = rot(w[2], w[3]); if ((r1[1] + r2[1]) / 2 > 0) return; /* 뒤쪽 벽만 */
      poly([P(w[0], w[1]), P(w[2], w[3]), P(w[2], w[3], wallH), P(w[0], w[1], wallH)], C('--map-wallface'), C('--map-wall'));
    });
    H.zones.forEach(function (z, i) { if (!i) return; var a = P(z.x, 0), b = P(z.x, H.h); ctx.setLineDash([4, 4]); ctx.strokeStyle = C('--map-part'); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.setLineDash([]); });
    H.zones.forEach(function (z) { var p = P(z.x + z.w / 2, H.h / 2); ctx.fillStyle = C('--map-zone'); ctx.font = '700 ' + Math.max(12, 9 * sc) + 'px ' + C('--font'); ctx.textAlign = 'center'; ctx.fillText(z.n, p[0], p[1]); });
    /* 문 표시 */
    H.doors.forEach(function (d) { poly([P(d.x - d.w / 2, -.2), P(d.x + d.w / 2, -.2), P(d.x + d.w / 2, -.2, 4.5), P(d.x - d.w / 2, -.2, 4.5)], o.dest === d.id ? C('--accent') : C('--map-door'), null); });
    /* 부스: 깊이순 */
    var list = M.booths.map(function (b) { var r = rot(b.x + b.w / 2, b.y + b.h / 2); return { b: b, d: r[1] }; }).sort(function (a, b) { return a.d - b.d; });
    list.forEach(function (it) {
      var b = it.b, hgt = b.st === 'mine' ? 4.2 : b.st === 'vacant' ? 0.4 : 2.5, x0 = b.x + .2, y0 = b.y + .2, x1 = b.x + b.w - .2, y1 = b.y + b.h - .2;
      var top = b.st === 'mine' ? C('--accent') : b.st === 'vacant' ? C('--map-vacant') : (o.hi && o.hi.indexOf(b.id) >= 0) ? C('--warn') : C('--map-booked');
      var side = b.st === 'mine' ? C('--accent-hover') : C('--map-side');
      var corners = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
      for (var i = 0; i < 4; i++) { var p = corners[i], q = corners[(i + 1) % 4]; var rp = rot((p[0] + q[0]) / 2, (p[1] + q[1]) / 2), rc = rot((x0 + x1) / 2, (y0 + y1) / 2); if (rp[1] > rc[1]) poly([P(p[0], p[1]), P(q[0], q[1]), P(q[0], q[1], hgt), P(p[0], p[1], hgt)], side, C('--map-edge')); }
      poly(corners.map(function (c) { return P(c[0], c[1], hgt); }), top, C('--map-edge'));
    });
    if (o.route) {
      ctx.lineWidth = 4; ctx.strokeStyle = C('--accent'); ctx.lineJoin = 'round'; ctx.beginPath();
      o.route.pts.forEach(function (p, i) { var q = P(p[0], p[1], 0.3); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }); ctx.stroke();
      [[o.route.pts[0], '출발'], [o.route.pts[o.route.pts.length - 1], '도착']].forEach(function (pp) { var q = P(pp[0][0], pp[0][1], 0), t = P(pp[0][0], pp[0][1], 9); ctx.strokeStyle = C('--text'); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(q[0], q[1]); ctx.lineTo(t[0], t[1]); ctx.stroke(); ctx.fillStyle = C('--text'); ctx.beginPath(); ctx.arc(t[0], t[1] - 9, 13, 0, 7); ctx.fill(); ctx.fillStyle = C('--surface'); ctx.font = '700 10px ' + C('--font'); ctx.textAlign = 'center'; ctx.fillText(pp[1], t[0], t[1] - 5.5); });
    }
    var mb = M.booths.filter(function (b) { return b.st === 'mine'; });
    if (mb.length && o.mine) { var m0 = mb[0], m1 = mb[mb.length - 1], q = P((m0.x + m1.x + 3) / 2, m0.y + 1.5, 13); ctx.fillStyle = C('--accent'); ctx.font = '700 12px ' + C('--font'); ctx.textAlign = 'center'; var tw = ctx.measureText('내 부스').width + 16; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(q[0] - tw / 2, q[1] - 20, tw, 22, 11) : ctx.rect(q[0] - tw / 2, q[1] - 20, tw, 22); ctx.fill(); ctx.fillStyle = C('--on-accent'); ctx.fillText('내 부스', q[0], q[1] - 5); }
  }

  window.HallMap = { HALLS: HALLS, model: model, svg2D: svg2D, draw3D: draw3D, route: route, poiList: poiList, boothCenter: boothCenter };
})();
