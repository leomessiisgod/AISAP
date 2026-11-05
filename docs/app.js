/* EXPO DESK 서비스 데모 — 서버 없이 동작하는 단일 페이지 앱.
   구조: EXPO DESK(팀 데모) / 디자인·AI 대화 방식: 피처링 / 근거 데이터: AISAP COEX 정제 데이터셋(웹 10건 + 도면 9건). */
(function () {
  'use strict';
  var D = window.DEMO, CH = window.KB_CHUNKS || [], DOCS = window.KB_DOCS || [];
  var TODAY = new Date(D.today + 'T00:00:00');
  var KEY = 'expo-desk-ax-demo-v2';

  /* ---------- 저장 (브라우저 개인 저장, 실패해도 동작) ---------- */
  function fresh() {
    var done = {}; D.tasks.forEach(function (t) { if (t.done) done[t.id] = true; });
    var sub = {}; D.submissions.forEach(function (s) { sub[s.id] = s.status; });
    var cond = {}; D.conditions.forEach(function (c) { cond[c.id] = c.def; });
    return { role: null, theme: 'light', mode: 'approved', done: done, sub: sub, cond: cond, pre: { 'pre-biz': true, 'pre-profile': true, 'pre-privacy': true }, chats: [], active: null, nudge: true, req: {}, extraReq: [], inq: {}, iss: {}, log: [], assign: {}, sent: [] };
  }
  var S = fresh();
  try { var raw = localStorage.getItem(KEY); if (raw) { var p = JSON.parse(raw); for (var k in p) S[k] = p[k]; } } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

  /* ---------- 아이콘 ---------- */
  var IC = {
    home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    cal: '<rect x="3" y="4.5" width="18" height="16.5" rx="2"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>',
    doc: '<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5M8.5 13h7M8.5 17h5"/>',
    check: '<path d="M9 11.5 11.5 14 16 9"/><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"/>',
    spark: '<path d="M12 3c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7z"/><path d="M19 15.5c.25 1.6 1 2.3 2.5 2.5-1.5.25-2.25 1-2.5 2.5-.25-1.5-1-2.25-2.5-2.5 1.5-.2 2.25-.9 2.5-2.5z"/>',
    book: '<path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H20v15H5.5A1.5 1.5 0 0 0 4 19.5z"/><path d="M4 19.5A1.5 1.5 0 0 0 5.5 21H20v-3"/>',
    map: '<path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20z"/><path d="M9 4v13.5M15 6.5V20"/>',
    building: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8.5 7h2M13.5 7h2M8.5 11h2M13.5 11h2M8.5 15h2M13.5 15h2"/>',
    phone: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>',
    clip: '<path d="m20 11.5-8.2 8.2a5 5 0 0 1-7.1-7.1l8.6-8.6a3.4 3.4 0 0 1 4.8 4.8l-8.6 8.6a1.7 1.7 0 0 1-2.4-2.4L15 7.1"/>',
    send: '<path d="M12 19V5M5.5 11.5 12 5l6.5 6.5"/>',
    bell: '<path d="M6 16.5V11a6 6 0 1 1 12 0v5.5l1.5 1.5h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    chev: '<path d="m9 6 6 6-6 6"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    reset: '<path d="M4 12a8 8 0 1 0 2.4-5.7L4 8.5"/><path d="M4 4v4.5h4.5"/>',
    upload: '<path d="M12 16V4M7 8.5 12 4l5 4.5"/><path d="M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"/>',
    truck: '<path d="M2.5 6h11v10h-11zM13.5 9.5h4l3 3.5V16h-7z"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
    plug: '<path d="M9 3v5M15 3v5M6.5 8h11v3.5a5.5 5.5 0 0 1-11 0zM12 17v4"/>',
    alert: '<path d="M12 3.5 2.5 20h19z"/><path d="M12 10v4.5M12 17.2v.3"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.8a3.5 3.5 0 0 1 0 6.4M18 14.2a6.5 6.5 0 0 1 3.5 5.8"/>',
    scan: '<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M7 12h10"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/>',
    ruler: '<path d="M3 16.5 16.5 3 21 7.5 7.5 21z"/><path d="m7 12.5 2 2M10 9.5l2 2M13 6.5l2 2"/>'
  };
  function ic(n, extra) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' + (extra || '') + '>' + IC[n] + '</svg>'; }

  /* ---------- 유틸 ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function days(d) { return Math.round((new Date(d + 'T00:00:00') - TODAY) / 864e5); }
  function md(d) { var p = d.split('-'); return p[1] + '.' + p[2]; }
  function ddayHtml(d, done) {
    if (done) return '<span class="dday past">완료</span>';
    var n = days(d), cls = n < 0 ? 'urgent' : n <= 1 ? 'urgent' : n <= 7 ? 'soon' : '';
    return '<span class="dday ' + cls + '">' + (n < 0 ? '지남 ' + (-n) + '일' : n === 0 ? 'D-DAY' : 'D-' + n) + '</span>';
  }
  function chunk(id) { for (var i = 0; i < CH.length; i++) if (CH[i].id === id) return CH[i]; return null; }
  function docOf(id) { for (var i = 0; i < DOCS.length; i++) if (DOCS[i].id === id) return DOCS[i]; return null; }
  function srcLabel(src) {
    if (!src) return '';
    if (src.chunk) { var c = chunk(src.chunk), d = c && docOf(c.doc); return (d ? d.title : src.chunk) + (c && c.sec ? ' · ' + c.sec : ''); }
    return src.label;
  }
  function cite(src, prefix) {
    if (!src) return '';
    var kb = !!src.chunk;
    return '<button class="cite' + (kb ? ' kb' : '') + '" data-src="' + esc(JSON.stringify(src)) + '"><b>' + (prefix || '근거') + '</b>' + esc(shortLabel(src)) + '</button>';
  }
  function shortLabel(src) {
    if (!src.chunk) return src.label;
    var c = chunk(src.chunk); if (!c) return src.chunk;
    var d = docOf(c.doc);
    if (c.ds === 'dwg') return (d ? d.title.replace(/\s*\(.*\)/, '') : '도면') + (c.page ? ' p.' + c.page : '');
    return 'COEX ' + (d ? d.title : '') + ' · ' + (c.sec || '').split('>').pop().trim();
  }
  function statusPill(st) {
    var m = { approved: ['ok', '승인'], submitted: ['acc', '제출됨'], rejected: ['bad', '반려'], draft: ['warn', '작성 중'], todo: ['', '미착수'], na: ['n', '해당 없음'] }[st] || ['', st];
    return '<span class="pill ' + m[0] + '">' + m[1] + '</span>';
  }
  function valPill(status) {
    if (status === 'source_verified') return '<span class="pill ok">원문 확인</span>';
    if (status === 'vision_extracted_needs_review') return '<span class="pill warn">도면 판독 · 검토 필요</span>';
    return '<span class="pill warn">검토 필요</span>';
  }
  var toastT;
  function toast(msg) {
    var t = $('#toast'); t.textContent = msg; t.hidden = false;
    clearTimeout(toastT); toastT = setTimeout(function () { t.hidden = true; }, 2600);
  }
  function ex() { return D.exhibitions[S.mode]; }
  function isPre() { return S.mode === 'pre'; }

  /* ---------- 라우팅 ---------- */
  var ROUTES = {
    home: { t: '대시보드', icon: 'home', group: '준비' },
    apply: { t: '참가 신청 준비', icon: 'doc', group: '준비' },
    schedule: { t: '세부 일정표', icon: 'cal', group: '준비' },
    submissions: { t: '제출·신청 관리', icon: 'doc', group: '준비' },
    check: { t: 'AI 사전 점검', icon: 'check', group: '준비', tag: 'AI' },
    assistant: { t: 'AI 어시스턴트', icon: 'spark', group: '지식', tag: 'BETA' },
    library: { t: 'Library', icon: 'book', group: '지식' },
    halls: { t: '홀 맵·도면', icon: 'map', group: '지식', tag: 'NEW' },
    company: { t: '기업 정보·담당자', icon: 'building', group: '회사' },
    booth: { t: '부스 App', icon: 'phone', group: '현장' }
  };
  var ORG_ROUTES = {
    'org-home': { t: '주최 대시보드', icon: 'home', group: '전시 운영' },
    'org-exhibitors': { t: '참가사 현황', icon: 'users', group: '전시 운영' },
    'org-review': { t: '서류 1차 검토', icon: 'check', group: '전시 운영', badge: function () { return reqCount('org'); } },
    'org-inbox': { t: '문의 관리', icon: 'chat', group: '전시 운영', badge: function () { return allInq().filter(function (q) { return inqSt(q) === 'new'; }).length; } },
    'org-map': { t: '부스 배정 맵', icon: 'map', group: '전시 운영' },
    'org-relay': { t: '운영사 제출 현황', icon: 'doc', group: '전시 운영' },
    assistant: { t: 'AI 어시스턴트', icon: 'spark', group: '지식', tag: 'BETA' },
    library: { t: 'Library', icon: 'book', group: '지식' }
  };
  var OP_ROUTES = {
    'op-home': { t: '통합 관제', icon: 'home', group: '전시장 총괄' },
    'op-approvals': { t: '통합 승인함', icon: 'check', group: '전시장 총괄', badge: function () { return reqCount('op'); } },
    'op-schedule': { t: '전시장 일정', icon: 'cal', group: '전시장 총괄' },
    'op-map': { t: '홀 맵', icon: 'map', group: '전시장 총괄' },
    'op-issues': { t: '현장 이슈', icon: 'alert', group: '전시장 총괄', badge: function () { return D.issues.filter(function (i) { return issueSt(i) === 'new'; }).length; } },
    'op-log': { t: '처리 이력', icon: 'doc', group: '전시장 총괄' },
    assistant: { t: 'AI 어시스턴트', icon: 'spark', group: '지식', tag: 'BETA' },
    library: { t: 'Library', icon: 'book', group: '지식' }
  };
  function routesFor() { return S.role === 'organizer' ? ORG_ROUTES : S.role === 'operator' ? OP_ROUTES : ROUTES; }
  var PRE_OPEN = { apply: 1, assistant: 1, library: 1, halls: 1, company: 1 };
  var hallSel = null, libFilter = 'all', subFilter = 'all', schedFilter = 'all', boothTab = 'today', checkSel = 'sub-layout', homeFlow = 0, asstScope = { ev: true, coex: true, hall: true };

  function route() {
    var h = (location.hash || '').replace('#', ''), R = routesFor();
    if (S.role === 'organizer') return R[h] ? h : 'org-home';
    if (S.role === 'operator') return R[h] ? h : 'op-home';
    if (!R[h]) h = isPre() ? 'apply' : 'home';
    if (isPre() && !PRE_OPEN[h]) h = 'apply';
    if (!isPre() && h === 'apply') h = 'home';
    return h;
  }
  function go(r) { if (location.hash === '#' + r) render(); else location.hash = r; }

  /* ---------- 결재 체인 상태 (세 역할 공유) ---------- */
  function reqAll() { return D.requests.concat(S.extraReq || []); }
  function reqState(r) { return S.req[r.id] || { stage: r.stage, reason: r.reason, by: r.by }; }
  function reqCount(stage) { return reqAll().filter(function (r) { return reqState(r).stage === stage; }).length; }
  function inqSt(q) { return (S.inq[q.id] || {}).st || q.st; }
  function issueSt(i) { return (S.iss[i.id] || {}).st || i.st; }
  function syncSub() {
    reqAll().forEach(function (r) {
      if (r.from !== 'ex' || r.co !== '㈜한빛로보틱스') return;
      var st = reqState(r).stage;
      S.sub[r.id] = st === 'approved' ? 'approved' : st === 'rejected' ? 'rejected' : 'submitted';
    });
  }
  function chainHtml(st) {
    var s = st.stage, steps = [['ex', '참가사 제출'], ['org', '주최사 검토'], ['op', '운영사 승인']];
    var idx = { org: 1, op: 2, approved: 3, rejected: -1 }[s];
    return '<div class="chain">' + steps.map(function (x, i) {
      var cls = s === 'rejected' && ((st.by === 'org' && i === 1) || (st.by === 'op' && i === 2)) ? 'bad' : i < idx || s === 'approved' ? 'ok' : i === idx ? 'on' : '';
      return '<span class="' + cls + '">' + x[1] + '</span>' + (i < 2 ? '›' : '');
    }).join('') + '</div>';
  }
  function logPush(text) { S.log.unshift({ at: nowStr(), who: (D.roles[S.role] || {}).label || '', text: text }); }
  function nowStr() { var d = new Date(); return '11.05 ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); }

  /* ---------- 테마 (화이트 기본, 나이트 선택) ---------- */
  function applyTheme() { document.documentElement.dataset.theme = S.theme === 'dark' ? 'dark' : 'light'; var b = $('#theme-btn'); if (b) { b.textContent = S.theme === 'dark' ? '🌙' : '☀️'; b.setAttribute('aria-label', S.theme === 'dark' ? '밝은 화면으로 바꾸기' : '나이트 모드로 바꾸기'); b.title = b.getAttribute('aria-label'); } }

  /* ---------- 로그인 ---------- */
  var loginRole = 'exhibitor';
  function viewLogin() {
    var R = D.roles, r = R[loginRole];
    return '<div class="login"><section class="login-brand"><div><div class="row"><div class="logo">ED</div><b style="font-size:16px">EXPO DESK</b><span class="pill demo">데모</span></div>'
      + '<h1 style="margin-top:28px">전시 준비를<br>판단 가능한 업무로.</h1><p>참가기업·주최사·전시장 운영사가 같은 근거 문서를 보고, 같은 결재 흐름 위에서 일합니다.</p></div>'
      + '<div class="flowline"><div><span class="dotc role-pill ex">참</span><span><b>참가사</b>가 서류를 내면</span></div><div><span class="dotc role-pill org">주</span><span><b>주최사</b>가 1차로 검토해 넘기고</span></div><div><span class="dotc role-pill op">운</span><span><b>운영사</b>가 승인하거나 반려합니다. 결과는 세 화면에 바로 반영돼요.</span></div></div>'
      + '<p class="muted" style="font-size:12px;margin:0">회사·전시회·주최사·계정은 모두 가상입니다. COEX 시설·도면 값만 AISAP 정제 데이터셋을 씁니다.</p></section>'
      + '<form class="login-form" id="login-form"><div><h2 style="font-size:22px">로그인</h2><p class="muted" style="margin:4px 0 0;font-size:13px">역할을 고르면 데모 계정이 채워져요. 그대로 로그인하면 됩니다.</p></div>'
      + '<div class="role-cards" role="radiogroup" aria-label="역할">' + ['exhibitor', 'organizer', 'operator'].map(function (k) { var x = R[k]; return '<button type="button" role="radio" aria-checked="' + (k === loginRole) + '" data-lrole="' + k + '" class="' + (k === loginRole ? 'on' : '') + '"><span class="role-pill ' + { exhibitor: 'ex', organizer: 'org', operator: 'op' }[k] + '">' + x.label + '</span><b>' + x.who + '</b><span>' + esc(x.scen ? x.scen + '(데모)' : '참가기업(데모)') + '</span><span>' + esc(x.desc) + '</span></button>'; }).join('') + '</div>'
      + '<div class="field"><label for="login-id">아이디</label><input id="login-id" value="' + esc(r.id) + '" autocomplete="off"></div>'
      + '<div class="field"><label for="login-pw">비밀번호</label><input id="login-pw" type="password" value="demo-only" autocomplete="off"></div>'
      + (loginRole === 'exhibitor' ? '<div class="field"><label>데모 계정 상태</label><div class="seg"><button type="button" data-lmode="pre" class="' + (S.mode === 'pre' ? 'on' : '') + '">참가 신청 전 · 2027 스마트물류 위크</button><button type="button" data-lmode="approved" class="' + (S.mode !== 'pre' ? 'on' : '') + '">신청 승인 완료 · 2026 스마트제조</button></div></div>' : '')
      + '<button class="btn primary lg" type="submit">' + r.label + '로 로그인</button><p class="muted" style="font-size:12px;margin:0;text-align:center">' + esc(r.org) + ' · ' + esc(r.name) + ' 님 · 화면 기준일 2026.11.05</p></form></div>';
  }

  /* ---------- 셸 ---------- */
  function renderSide(cur) {
    var R = routesFor(), groups = {}, role = S.role, rr = D.roles[role];
    Object.keys(R).forEach(function (k) {
      if (k === 'booth') return;
      if (role === 'exhibitor' && (isPre() ? k === 'home' : k === 'apply')) return;
      var r = R[k]; (groups[r.group] = groups[r.group] || []).push(k);
    });
    var unread = D.submissions.filter(function (s) { var st = S.sub[s.id]; return st === 'rejected' || st === 'todo' || st === 'draft'; }).length;
    var h;
    if (role === 'exhibitor') {
      var e = ex();
      h = '<div class="ws"><div class="ws-top"><div class="logo">ED</div><div style="min-width:0"><div class="ws-name">' + esc(e.name) + '</div><div class="ws-sub">' + esc(e.hall) + ' · 부스 ' + esc(e.booth) + '</div></div></div>'
        + '<div class="row"><span class="role-pill ex">참가사</span><span class="pill ' + (isPre() ? 'warn' : 'ok') + '">' + esc(e.status) + '</span><span class="pill demo">데모</span></div></div>';
    } else {
      h = '<div class="ws"><div class="ws-top"><div class="logo">ED</div><div style="min-width:0"><div class="ws-name">' + esc(role === 'organizer' ? D.exhibitions.approved.name : '전시장 통합 관제') + '</div><div class="ws-sub">' + esc(role === 'organizer' ? 'Hall C · 참가사 ' + D.exhibitorsList.length + '곳' : 'Hall A·B·C·D · THE PLATZ') + '</div></div></div>'
        + '<div class="row"><span class="role-pill ' + (role === 'organizer' ? 'org' : 'op') + '">' + rr.label + '</span><span class="pill demo">' + esc(rr.scen) + ' · 데모</span></div></div>';
    }
    h += '<label class="search">' + ic('search', ' width="16" height="16"') + '<span class="sr">검색</span><input id="side-search" placeholder="규정, 서류, 연락처 검색"></label><nav class="nav" aria-label="주 메뉴">';
    Object.keys(groups).forEach(function (g) {
      h += '<div class="nav-h">' + g + '</div>';
      groups[g].forEach(function (k) {
        var r = R[k], locked = role === 'exhibitor' && isPre() && !PRE_OPEN[k];
        var n = r.badge ? r.badge() : 0;
        var badge = k === 'submissions' && !isPre() ? '<span class="tag n">' + unread + '</span>' : n ? '<span class="tag">' + n + '</span>' : r.tag ? '<span class="tag">' + r.tag + '</span>' : '';
        h += '<a href="#' + k + '" class="' + (k === cur ? 'on' : '') + (locked ? ' locked' : '') + '">' + ic(r.icon) + '<span>' + r.t + '</span>' + badge + '</a>';
      });
    });
    h += '</nav><div class="side-foot">';
    if (role === 'exhibitor') h += '<div class="mode"><div class="mode-row"><span>데모 계정 상태</span><span class="muted">기준 11.05</span></div><div class="seg" role="group" aria-label="데모 계정 상태">'
      + '<button data-mode="pre" class="' + (isPre() ? 'on' : '') + '">참가 신청 전</button><button data-mode="approved" class="' + (!isPre() ? 'on' : '') + '">신청 승인 완료</button></div></div>'
      + (isPre() ? '' : '<a class="side-link" href="#booth">' + ic('phone', ' width="16" height="16"') + '부스 App 열기 <span class="tag n" style="margin-left:auto">전시 기간</span></a>');
    h += '<button class="side-link" id="reset">' + ic('reset', ' width="16" height="16"') + '데모 데이터 초기화</button>'
      + '<button class="side-link" data-act="logout">' + ic('users', ' width="16" height="16"') + '다른 역할로 로그인</button>'
      + '<div class="me"><div class="avatar">' + esc(rr.name.charAt(0)) + '</div><div><div style="font-weight:600;font-size:13px">' + esc(rr.name) + ' 매니저</div><div class="muted" style="font-size:11.5px">' + esc(rr.org) + ' · ' + rr.label + '</div></div></div></div>';
    return h;
  }

  function render() {
    applyTheme();
    var login = !S.role;
    $('#login').hidden = !login; $('.app').hidden = login;
    if (login) { $('#login').innerHTML = viewLogin(); $('#fab').innerHTML = ''; $('#mini').hidden = true; document.title = '로그인 · EXPO DESK'; return; }
    syncSub();
    var cur = route(), R = routesFor();
    $('#side').innerHTML = renderSide(cur);
    $('#side').classList.remove('open');
    var title = S.role === 'exhibitor' ? ex().name : S.role === 'organizer' ? D.exhibitions.approved.name : '전시장 운영본부';
    $('#crumb').innerHTML = '<span class="role-pill ' + { exhibitor: 'ex', organizer: 'org', operator: 'op' }[S.role] + '">' + D.roles[S.role].label + '</span><span>' + esc(title) + '</span><span>/</span><b>' + R[cur].t + '</b>';
    var c = $('#content');
    c.className = 'content';
    $('#main').dataset.route = cur;
    c.innerHTML = VIEWS[cur]();
    if (cur === 'assistant') { c.style.padding = '0'; c.style.maxWidth = 'none'; } else { c.style.padding = ''; c.style.maxWidth = ''; }
    mapRedraw = null;
    if (AFTER[cur]) AFTER[cur]();
    renderFab(cur);
    document.title = R[cur].t + ' · EXPO DESK';
    window.scrollTo(0, 0);
  }

  /* ---------- 화면: 홈 ---------- */
  var FLOWS = [
    { t: '서류 점검', i: 'check', cards: [
      { i: 'check', t: '반려된 도면, 다시 내기 전에 점검', d: '반려 사유와 이용안내서 기준으로 수정본을 확인합니다', q: '도면 반려 사유 고치려면?' },
      { i: 'doc', t: '우리 부스에 필요한 서류만 판정', d: '커피머신·배너·자체시공 여부로 필수 서류를 가립니다', go: 'check' },
      { i: 'plug', t: '기술지원 신청서 빠진 칸 찾기', d: '전기·급배수·통신 신청서의 누락 항목을 표시합니다', q: '전기 신청서에 뭐가 빠졌어?' },
      { i: 'cal', t: '이번 주 마감 서류 정리', d: '마감순으로 담당자와 남은 일을 묶어 보여줍니다', q: '이번 주 마감 뭐 있어?' } ] },
    { t: '규정 확인', i: 'book', cards: [
      { i: 'plug', t: '커피머신 급배수 신청', d: '협력업체 시공·서약서·배수관 체결 규정', q: '커피머신 급배수 신청' },
      { i: 'alert', t: 'Hall A 구역 분할 사용', d: '웹 공시와 도면이 다른 항목은 확정하지 않고 함께 보여줍니다', q: 'Hall A 분할 사용 가능해?' },
      { i: 'ruler', t: '천장 배너 하중 확인', d: 'Hall C 포인트 호이스트 기준', q: 'Hall C 천장 배너 하중 얼마까지야?' },
      { i: 'book', t: '정기대관 절차', d: '신청부터 계약까지 5단계', q: '코엑스 정기대관 절차 알려줘' } ] },
    { t: '반입·주차', i: 'truck', cards: [
      { i: 'truck', t: '화물차 무료주차 조건', d: '준비·철거 기간 1일 1회 3시간 기준', q: '준비기간 화물차 무료주차 조건은?' },
      { i: 'map', t: 'Hall C 화물출입구 규격', d: '반입 차량·장비 높이를 도면 기준으로 확인', q: 'Hall C 화물출입구 크기는?' },
      { i: 'truck', t: '로딩독 진입 동선', d: '3층 Hall C·D 진입 경로', q: '3층 로딩독 어떻게 들어가?' },
      { i: 'chat', t: '주차 전반 물어보기', d: '질문이 넓으면 AI가 범위를 되물어봅니다', q: '주차' } ] },
    { t: '현장 운영', i: 'phone', cards: [
      { i: 'alert', t: '전시 중 누수 점검', d: '매일 종료 후 확인 항목', q: '전시 기간 중 급배수 점검은?' },
      { i: 'users', t: '홀매니저실 연락처', d: '현장 기술지원 창구', q: '홀매니저실 연락처' },
      { i: 'phone', t: '부스 App 미리보기', d: '리드 수집·현장 요청·현장 AI', go: 'booth' },
      { i: 'building', t: '편의시설 위치', d: '의무실·물품보관소·휠체어 대여', q: '의무실이랑 물품보관소 어디야?' } ] }
  ];
  function composerHtml(id, ph) {
    return '<div class="composer"><div class="chips"><span class="chip on"># 이 전시회 매뉴얼</span><span class="chip on"># COEX 규정·시설</span><span class="chip">@ ' + esc(ex().hall) + '</span></div>'
      + '<label class="sr" for="' + id + '">질문</label><textarea id="' + id + '" rows="2" placeholder="' + esc(ph) + '"></textarea>'
      + '<div class="bar"><button class="icon-btn" style="width:30px;height:30px" data-act="attach" aria-label="파일 첨부">' + ic('clip') + '</button><span>문서 근거 · 쪽수 표시</span><span class="muted">· 확인 안 되면 확정하지 않음</span><button class="send" data-send="' + id + '" aria-label="보내기">' + ic('send', ' width="18" height="18"') + '</button></div></div>';
  }
  VIEWS_home = function () {
    var e = ex(), dd = days(e.open);
    var reqs = D.submissions.filter(function (s) { return s.req === 'required'; });
    var reqDone = reqs.filter(function (s) { return S.sub[s.id] === 'approved' || S.sub[s.id] === 'submitted'; }).length;
    var tasks = D.tasks.filter(function (t) { return !S.done[t.id]; }).sort(function (a, b) { return a.due < b.due ? -1 : 1; });
    var total = D.tasks.length, doneN = total - tasks.length;
    var week = tasks.filter(function (t) { return days(t.due) <= 7; }).length;
    var f = FLOWS[homeFlow];
    var h = '<section class="hero"><h1>' + esc(D.user.name) + '님, 개막까지 ' + dd + '일 남았어요.<br>무엇을 확인해 드릴까요?</h1>' + composerHtml('home-q', '진행할 업무를 문장으로 적어 주세요 · 예) 커피머신 쓰려면 뭘 신청해야 해?')
      + '<div class="flows" role="tablist">' + FLOWS.map(function (x, i) { return '<button class="flow' + (i === homeFlow ? ' on' : '') + '" data-flow="' + i + '" role="tab" aria-selected="' + (i === homeFlow) + '">' + ic(x.i, ' width="15" height="15"') + x.t + '</button>'; }).join('') + '</div>'
      + '<div class="scen">' + f.cards.map(function (c) { return '<button data-q="' + esc(c.q || '') + '" data-go="' + (c.go || '') + '"><span class="ic">' + ic(c.i) + '</span><span><b>' + esc(c.t) + '</b><span>' + esc(c.d) + '</span></span></button>'; }).join('') + '</div></section>';

    h += '<section class="card"><div class="event"><div><div class="muted" style="font-size:12px">전시 개막까지</div><div class="dbig">D-' + dd + '</div><div class="muted tnum" style="font-size:12px">' + e.open.replace(/-/g, '.') + ' (수)</div></div>'
      + '<div style="min-width:0"><div class="row"><h2 style="font-size:18px">' + esc(e.name) + '</h2><span class="pill demo">데모</span><span class="pill ok">' + esc(e.status) + '</span></div>'
      + '<div class="ev-meta"><span>장소<b>코엑스 ' + esc(e.hall) + '</b></span><span>부스<b>' + esc(e.booth) + ' · ' + esc(e.boothSize) + '</b></span><span>설치<b class="tnum">' + e.install + '</b></span><span>전시<b class="tnum">' + e.show + '</b></span><span>철거<b class="tnum">' + e.teardown + '</b></span></div></div>'
      + '<a class="btn" href="#halls">' + ic('map') + e.hall + ' 도면 보기</a></div>'
      + '<div class="phases">' + e.phases.map(function (p) { return '<div class="phase ' + p.state + '"><i></i><b>' + p.name + '</b><span class="tnum">' + p.date + '</span></div>'; }).join('') + '</div></section>';

    var rej = D.submissions.filter(function (s) { return S.sub[s.id] === 'rejected'; }).length;
    h += '<section class="grid g-4">'
      + kpi('#submissions', '필수 제출 서류', reqDone, '/ ' + reqs.length + ' 완료', (rej ? '<span style="color:var(--bad)">반려 ' + rej + '건</span> · ' : '') + '마감 임박 1건', reqDone / reqs.length)
      + kpi('#check', 'AI 사전 점검', '2', '건 대기', '도면 수정본 · 전기 신청서', null, true)
      + kpi('#submissions', '기술지원 신청', '0', '/ 3 접수', '주최사 취합 마감 11.16')
      + kpi('#schedule', '남은 할 일', tasks.length, '/ ' + total + '건', '완료 ' + doneN + ' · 7일 내 마감 ' + week, doneN / total) + '</section>';

    h += '<section class="grid g-main"><div class="card"><div class="card-h"><h2>미완료 할 일 · 마감순</h2><a class="link-row" href="#schedule">전체 체크리스트 →</a></div><div class="card-b table-wrap"><table class="stack"><thead><tr><th>할 일</th><th>담당</th><th>마감</th><th>근거</th></tr></thead><tbody>'
      + tasks.slice(0, 6).map(function (t) {
        return '<tr><td><div class="t-title">' + esc(t.title) + (t.badge === 'rejected' ? ' <span class="pill bad">반려</span>' : t.badge === 'draft' ? ' <span class="pill warn">작성 중</span>' : '') + '</div><div class="t-desc">' + esc(t.desc) + '</div></td>'
          + '<td data-l="담당">' + esc(t.owner) + '</td><td data-l="마감" class="tnum">' + md(t.due) + ' ' + ddayHtml(t.due) + '</td><td data-l="근거">' + cite(t.src) + '</td></tr>';
      }).join('') + '</tbody></table></div></div>'
      + '<div class="grid" style="align-content:start"><div class="card"><div class="card-h"><h2>AI가 먼저 찾은 것</h2><span class="tag">AI</span></div><div class="card-b" style="display:flex;flex-direction:column;gap:10px">'
      + '<div class="verdict need">' + ic('alert', ' width="18" height="18" style="color:var(--bad);flex:none;margin-top:2px"') + '<div><b>도면 수정본에 반려 사유 3개가 그대로 남아 있어요</b><div class="t-desc">통로 너비·벽면 이격거리·독립부스 색상 구분</div><button class="link-row" data-go="check" style="margin-top:4px">점검 결과 보기 →</button></div></div>'
      + '<div class="verdict">' + ic('truck', ' width="18" height="18" style="color:var(--accent);flex:none;margin-top:2px"') + '<div><b>HB-7 시연 장비 높이를 화물출입구와 비교해 보세요</b><div class="t-desc">Hall C 북측 화물출입구 4개소는 모두 W 5.4m × H 5.0m입니다.</div><div style="margin-top:6px">' + cite({ chunk: 'coex-dwg-hall-c-floor-2024#03-loading' }) + '</div></div></div>'
      + '</div></div><div class="card"><div class="card-h"><h2>공지 · 변경사항</h2><span class="muted" style="font-size:12px">최근 3건</span></div><div class="card-b" style="display:flex;flex-direction:column;gap:10px">'
      + D.notices.map(function (n) { return '<div style="display:flex;gap:10px;align-items:flex-start"><span class="pill ' + (n.from === '코엑스' ? 'ok' : 'info') + '">' + n.from + '</span><div style="flex:1;min-width:0;font-size:13px">' + esc(n.title) + (n.src ? '<div style="margin-top:4px">' + cite(n.src) + '</div>' : '') + '</div><span class="muted tnum" style="font-size:12px">' + n.date + '</span></div>'; }).join('')
      + '</div></div></div></section>';
    return h;
  };
  function kpi(href, l, v, small, sub, ratio, ai) {
    return '<a class="card kpi" href="' + href + '"><span class="k-l">' + l + (ai ? ' <span class="tag">AI</span>' : '') + '</span><span class="k-v">' + v + ' <small>' + small + '</small></span>'
      + (ratio != null ? '<div class="bar-track"><div class="bar-fill" style="width:' + Math.round(ratio * 100) + '%"></div></div>' : '') + '<span class="k-s">' + sub + '</span></a>';
  }
  var VIEWS_home;

  /* ---------- 화면: 참가 신청 준비 (신청 전 모드) ---------- */
  function viewApply() {
    var e = ex(), items = D.preChecklist, req = items.filter(function (i) { return i.req; });
    var reqDone = req.filter(function (i) { return S.pre[i.id]; }).length, all = reqDone === req.length;
    var h = '<div class="page-h"><div><h1>참가 신청 준비</h1><p>' + esc(e.name) + ' · 신청 마감 ' + md(e.applyDue) + ' ' + ddayHtml(e.applyDue).replace('class="dday', 'class="dday') + '</p></div>'
      + '<button class="btn primary" id="apply-submit"' + (all ? '' : ' disabled style="opacity:.5;cursor:not-allowed"') + '>' + ic('send') + '신청서 제출</button></div>';
    h += '<section class="hero" style="padding:24px 20px"><h1 style="font-size:19px">신청 전에도 물어볼 수 있어요</h1>' + composerHtml('home-q', '예) Hall A 화물출입구 높이가 어떻게 돼?')
      + '<div class="follow" style="justify-content:center"><button data-q="Hall A 분할 사용 가능해?">Hall A 분할 사용 가능해?</button><button data-q="코엑스 정기대관 절차 알려줘">정기대관 절차</button><button data-q="Hall A 화물출입구 크기는?">Hall A 화물출입구</button></div></section>';
    h += '<section class="grid g-main"><div class="card"><div class="card-h"><h2>신청 서류 체크리스트</h2><span class="muted tnum">필수 ' + reqDone + ' / ' + req.length + '</span></div><div class="card-b"><div class="bar-track" style="margin-bottom:8px"><div class="bar-fill" style="width:' + Math.round(reqDone / req.length * 100) + '%"></div></div>'
      + items.map(function (i) {
        return '<label class="todo' + (S.pre[i.id] ? ' done' : '') + '"><input type="checkbox" id="pre-' + i.id + '" data-pre="' + i.id + '"' + (S.pre[i.id] ? ' checked' : '') + '><div class="tx"><div class="t-title">' + esc(i.title) + ' ' + (i.req ? '<span class="pill acc">필수</span>' : '<span class="pill">선택</span>') + '</div><div class="t-desc">' + esc(i.desc) + '</div><div style="margin-top:6px">' + cite(i.src) + '</div></div></label>';
      }).join('') + (all ? '' : '<p class="muted" style="font-size:12.5px;margin:10px 0 0">필수 항목을 모두 체크하면 신청서를 제출할 수 있어요.</p>') + '</div></div>'
      + '<div class="card"><div class="card-h"><h2>신청 마감 캘린더</h2></div><div class="card-b" style="display:flex;flex-direction:column;gap:10px">'
      + D.preCalendar.map(function (c) { return '<div style="display:flex;gap:12px;align-items:center"><div class="tnum" style="font-weight:700;width:44px">' + md(c.date) + '</div><div style="flex:1">' + esc(c.title) + '</div>' + ddayHtml(c.date) + '</div>'; }).join('')
      + '<div class="verdict" style="margin-top:6px">' + ic('map', ' width="18" height="18" style="color:var(--accent);flex:none;margin-top:2px"') + '<div><b>희망 위치를 고르기 전에 Hall A 도면을 보세요</b><div class="t-desc">A1~A4 구역은 각 2,592㎡입니다. 분할 대관 가능 여부는 확인이 필요해요.</div><a class="link-row" href="#halls">Hall A 도면 →</a></div></div></div></div></section>';
    return h;
  }

  /* ---------- 화면: 세부 일정표 ---------- */
  function viewSchedule() {
    var list = D.tasks.slice().sort(function (a, b) { return a.due < b.due ? -1 : 1; });
    var open = list.filter(function (t) { return !S.done[t.id]; });
    if (schedFilter === 'mine') open = open.filter(function (t) { return t.owner === D.user.name; });
    if (schedFilter === 'week') open = open.filter(function (t) { return days(t.due) <= 7; });
    var done = list.filter(function (t) { return S.done[t.id]; });
    var h = '<div class="page-h"><div><h1>세부 일정표</h1><p>체크하면 대시보드와 캘린더에 바로 반영돼요.</p></div><div class="filters">'
      + [['all', '전체'], ['mine', '내 할 일'], ['week', '7일 내 마감']].map(function (f) { return '<button data-sf="' + f[0] + '" class="' + (schedFilter === f[0] ? 'on' : '') + '">' + f[1] + '</button>'; }).join('') + '</div></div>';
    h += '<section class="grid g-main"><div class="card"><div class="card-h"><h2>체크리스트</h2><span class="muted tnum">' + done.length + ' / ' + list.length + ' 완료</span></div><div class="card-b">'
      + open.map(todoRow).join('') + (open.length ? '' : '<div class="empty">조건에 맞는 할 일이 없어요.</div>')
      + '<div class="nav-h" style="padding-left:0">완료 ' + done.length + '</div>' + done.map(todoRow).join('') + '</div></div>'
      + '<div class="card"><div class="card-h"><h2>2026년 11월</h2><span class="pill acc">오늘 11.05</span></div><div class="card-b">' + calendar(2026, 10) + '<div class="legend" style="margin-top:10px"><span><i style="background:var(--accent-weak)"></i>우리 회사</span><span><i style="background:var(--bad-weak)"></i>마감 임박</span><span><i style="background:var(--info-weak)"></i>주최사</span><span><i style="background:var(--ok-weak)"></i>코엑스</span></div></div></div></section>';
    return h;
  }
  function todoRow(t) {
    var d = !!S.done[t.id];
    return '<div class="todo' + (d ? ' done' : '') + '"><input type="checkbox" id="task-' + t.id + '" data-task="' + t.id + '"' + (d ? ' checked' : '') + ' aria-label="' + esc(t.title) + ' 완료"><div class="tx"><div class="t-title">' + esc(t.title) + (t.badge === 'rejected' && !d ? ' <span class="pill bad">반려</span>' : '') + '</div><div class="t-desc">' + esc(t.desc) + '</div>' + (t.src ? '<div style="margin-top:6px">' + cite(t.src) + '</div>' : '') + '</div>'
      + '<div class="side-meta"><span class="tnum">' + md(t.due) + ' · ' + esc(t.owner) + '</span>' + ddayHtml(t.due, d) + '</div></div>';
  }
  function calendar(y, m) {
    var first = new Date(y, m, 1), start = first.getDay(), dim = new Date(y, m + 1, 0).getDate();
    var ev = {};
    D.tasks.forEach(function (t) { (ev[t.due] = ev[t.due] || []).push({ t: t.title, c: S.done[t.id] ? 'done' : days(t.due) <= 1 ? 'bad' : '' }); });
    D.calendarEvents.forEach(function (c) { (ev[c.date] = ev[c.date] || []).push({ t: c.title, c: c.who }); });
    var h = '<div class="cal">' + '일월화수목금토'.split('').map(function (d) { return '<div class="dow">' + d + '</div>'; }).join('');
    for (var i = 0; i < start; i++) h += '<div class="out"></div>';
    for (var d = 1; d <= dim; d++) {
      var key = y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
      h += '<div class="' + (key === D.today ? 'today' : '') + '"><span class="d">' + d + '</span>' + (ev[key] || []).map(function (e) { return '<span class="ev ' + (e.c === 'done' ? '' : e.c) + '" title="' + esc(e.t) + '"' + (e.c === 'done' ? ' style="opacity:.5;text-decoration:line-through"' : '') + '>' + esc(e.t) + '</span>'; }).join('') + '</div>';
    }
    var rest = (7 - (start + dim) % 7) % 7; for (i = 0; i < rest; i++) h += '<div class="out"></div>';
    return h + '</div>';
  }

  /* ---------- 화면: 제출·신청 관리 ---------- */
  function viewSubmissions() {
    var rows = D.submissions.map(function (s) { return Object.assign({}, s, { st: S.sub[s.id] }); });
    var counts = { all: rows.length, required: rows.filter(function (r) { return r.req === 'required' || (r.req === 'cond' && S.cond[r.cond]); }).length, cond: rows.filter(function (r) { return r.req === 'cond'; }).length, rejected: rows.filter(function (r) { return r.st === 'rejected'; }).length, done: rows.filter(function (r) { return r.st === 'approved' || r.st === 'submitted'; }).length };
    var shown = rows.filter(function (r) {
      if (subFilter === 'required') return r.req === 'required' || (r.req === 'cond' && S.cond[r.cond]);
      if (subFilter === 'cond') return r.req === 'cond';
      if (subFilter === 'rejected') return r.st === 'rejected';
      if (subFilter === 'done') return r.st === 'approved' || r.st === 'submitted';
      return true;
    });
    var h = '<div class="page-h"><div><h1>제출·신청 관리</h1><p>주최사·코엑스에 낼 서류와 기술지원 신청을 한 곳에서 관리해요.</p></div><div class="row"><button class="btn" data-act="inquiry">' + ic('chat') + '주최사에 문의</button><button class="btn" data-act="forms">' + ic('doc') + '양식 일괄 받기</button><button class="btn primary" data-go="check">' + ic('check') + 'AI 사전 점검</button></div></div>';
    h += '<div class="filters">' + [['all', '전체'], ['required', '우리 부스 필수'], ['cond', '조건부'], ['rejected', '반려'], ['done', '완료']].map(function (f) { return '<button data-subf="' + f[0] + '" class="' + (subFilter === f[0] ? 'on' : '') + '">' + f[1] + '<em class="tnum">' + counts[f[0]] + '</em></button>'; }).join('') + '</div>';
    h += '<div class="card"><div class="table-wrap"><table class="stack"><thead><tr><th>서류 / 신청</th><th>구분</th><th>제출처</th><th>근거</th><th>마감</th><th>상태</th><th></th></tr></thead><tbody>'
      + shown.map(function (s) {
        var reqLbl = s.req === 'required' ? '<span class="pill acc">필수</span>' : S.cond[s.cond] ? '<span class="pill acc">필수(조건)</span>' : '<span class="pill">선택</span>';
        var st = s.req === 'cond' && !S.cond[s.cond] ? 'na' : (s.st === 'na' ? 'todo' : s.st);
        var rq = reqAll().filter(function (r) { return r.id === s.id; })[0], rst = rq ? reqState(rq) : null, rjReason = rst && rst.stage === 'rejected' && rst.reason ? rst.reason : s.reject;
        var act = st === 'rejected' ? '<div class="row" style="flex-wrap:nowrap"><button class="btn sm primary" data-precheck="' + s.id + '">수정본 점검</button><button class="btn sm" data-upload="' + s.id + '">재제출</button></div>' : st === 'draft' ? '<button class="btn sm" data-precheck="' + s.id + '">AI 점검</button>' : st === 'todo' ? '<button class="btn sm" data-upload="' + s.id + '">' + ic('upload') + '업로드</button>' : st === 'na' ? '<span class="muted" style="font-size:12px">해당 없음</span>' : '<button class="btn sm ghost" data-act="view">' + esc(s.file || '보기') + '</button>';
        return '<tr><td><div class="t-title">' + esc(s.title) + '</div><div class="t-desc">' + esc(s.desc) + '</div>' + (rst && st !== 'na' ? '<div style="margin-top:6px">' + chainHtml(rst) + '</div>' : '') + (st === 'rejected' ? '<div class="reject"><b>반려 사유 · ' + (rst && rst.by === 'op' ? '운영사' : '주최사') + (rst && S.req[s.id] ? '' : ' · ' + s.rejectDate) + '</b> ' + esc(rjReason) + '</div>' : '') + '</td>'
          + '<td data-l="구분">' + reqLbl + '</td><td data-l="제출처" style="font-size:12.5px">' + esc(s.to) + '</td><td data-l="근거">' + cite(s.src) + '</td><td data-l="마감" class="tnum" style="white-space:nowrap">' + md(s.due) + '<br>' + ddayHtml(s.due, st === 'approved' || st === 'submitted' || st === 'na') + '</td><td data-l="상태">' + statusPill(st) + '</td><td>' + act + '</td></tr>';
      }).join('') + '</tbody></table></div></div>'
      + '<p class="muted" style="font-size:12.5px;margin:0">조건부 서류는 <a href="#check">AI 사전 점검 › 조건별 필수 판정</a>의 답에 따라 필수 여부가 바뀌어요.</p>';
    return h;
  }

  /* ---------- 화면: AI 사전 점검 (제출 전 점검 + 조건별 필수 판정) ---------- */
  function viewCheck() {
    var pc = D.precheck[checkSel], sub = D.submissions.filter(function (s) { return s.id === checkSel; })[0];
    var pct = Math.round(pc.score / pc.total * 100);
    var needed = D.conditions.filter(function (c) { return S.cond[c.id]; });
    var h = '<div class="page-h"><div><h1>AI 사전 점검</h1><p>EMS나 주최사에 내기 전에, 규정 기준으로 빠진 항목과 우리 부스에 필요한 서류를 먼저 확인해요.</p></div></div>';
    h += '<section class="grid g-2"><div class="card"><div class="card-h"><h2>① 제출 전 점검</h2><div class="filters">' + Object.keys(D.precheck).map(function (k) { var s = D.submissions.filter(function (x) { return x.id === k; })[0]; return '<button data-chk="' + k + '" class="' + (k === checkSel ? 'on' : '') + '">' + esc(s.title.replace(/\s*\(.*\)/, '')) + '</button>'; }).join('') + '</div></div><div class="card-b" style="display:flex;flex-direction:column;gap:14px">'
      + '<div class="drop">' + ic('doc', ' width="22" height="22" style="color:var(--accent)"') + '<div style="flex:1;min-width:0"><b class="mono">' + esc(pc.file) + '</b><div class="t-desc">' + esc(sub.title) + ' · 데모 파일</div></div><button class="btn sm" data-act="reupload">' + ic('upload') + '다른 파일</button></div>'
      + '<div style="display:flex;gap:14px;align-items:center"><div class="score-ring" style="--p:' + pct + '"><span>' + pc.score + '/' + pc.total + '</span></div><div><b>' + (pc.score === pc.total ? '제출해도 좋아요' : '고칠 항목 ' + pc.items.filter(function (i) { return i.ok !== true; }).length + '개가 있어요') + '</b><div class="t-desc">점검 기준: ' + esc(sub.src ? srcLabel(sub.src) : '') + ' · 반려 이력 · 홀 규격</div></div></div><div>'
      + pc.items.map(function (i) { var cls = i.ok === true ? 'ok' : i.ok === 'warn' ? 'warn' : 'no'; return '<div class="check-item"><span class="ck ' + cls + '">' + (i.ok === true ? '✓' : i.ok === 'warn' ? '!' : '✕') + '</span><div style="flex:1;min-width:0"><div style="font-size:13.5px">' + esc(i.text) + '</div>' + (i.src ? '<div style="margin-top:4px">' + cite(i.src) + '</div>' : '') + '</div></div>'; }).join('')
      + '</div><div class="row"><button class="btn primary" data-q="' + (checkSel === 'sub-layout' ? '도면 반려 사유 고치려면?' : '전기 신청서에 뭐가 빠졌어?') + '">' + ic('spark') + 'AI에게 고치는 법 묻기</button><button class="btn" data-act="report">점검 결과 공유용 요약</button></div></div></div>';
    h += '<div class="card"><div class="card-h"><h2>② 조건별 필수 판정</h2><span class="tag">규칙 + AI 설명</span></div><div class="card-b"><p class="muted" style="margin:0 0 6px;font-size:12.5px">우리 부스 계획에 맞게 답하면 필요한 서류가 바로 정해져요. 판정은 규칙으로, 설명은 AI가 맡습니다.</p>'
      + D.conditions.map(function (c) { var v = S.cond[c.id]; return '<div class="q-row"><span style="font-size:13.5px">' + esc(c.q) + '</span><span class="yn" role="group"><button data-cond="' + c.id + '" data-v="1" class="' + (v ? 'on' : '') + '">예</button><button data-cond="' + c.id + '" data-v="0" class="' + (!v ? 'on' : '') + '">아니오</button></span></div>'; }).join('')
      + '<div class="nav-h" style="padding-left:0">판정 결과 · 추가로 필요한 서류 ' + needed.length + '건</div><div style="display:flex;flex-direction:column;gap:8px">'
      + (needed.length ? needed.map(function (c) { var s = D.submissions.filter(function (x) { return x.cond === c.id; })[0]; return '<div class="verdict need"><span class="ck ok" style="background:var(--accent);color:var(--on-accent)">+</span><div style="flex:1;min-width:0"><b>' + esc(s.title) + '</b><div class="t-desc">' + esc(c.yes) + ' 마감 ' + md(s.due) + '</div><div style="margin-top:4px">' + cite(s.src) + '</div></div></div>'; }).join('') : '<div class="verdict">조건부 서류는 필요 없어요. 기본 필수 서류만 챙기면 됩니다.</div>')
      + '</div></div></div></section>';
    return h;
  }

  /* ---------- 화면: Library ---------- */
  function viewLibrary() {
    var kb = DOCS.filter(function (d) { return d.ds === 'web'; }), dw = DOCS.filter(function (d) { return d.ds === 'dwg'; });
    var tabs = [['all', '전체', D.guides.length + kb.length + dw.length + D.contacts.length], ['guide', '안내서·규정', D.guides.length], ['web', 'COEX 웹 지식', kb.length], ['dwg', '도면', dw.length], ['tel', '연락처', D.contacts.length]];
    var h = '<div class="page-h"><div><h1>Library</h1><p>AI 답변의 근거가 되는 문서예요. 상태 배지로 검증 단계를 함께 보여줘요.</p></div><span class="muted" style="font-size:12.5px">AISAP 정제 데이터셋 · 청크 ' + CH.length + '개</span></div>';
    h += '<div class="filters">' + tabs.map(function (t) { return '<button data-lf="' + t[0] + '" class="' + (libFilter === t[0] ? 'on' : '') + '">' + t[1] + '<em class="tnum">' + t[2] + '</em></button>'; }).join('') + '</div>';
    function grid(title, items) { return '<section style="display:flex;flex-direction:column;gap:10px"><h2 style="font-size:15px">' + title + '</h2><div class="grid g-3">' + items + '</div></section>'; }
    if (libFilter === 'all' || libFilter === 'guide') h += grid('안내서·규정', D.guides.map(function (g) { return '<button class="doc" data-act="pdf"><span class="kind">' + g.kind + (g.pages ? ' · ' + g.pages + '쪽' : '') + '</span><b>' + esc(g.title) + '</b><p>' + esc(g.desc) + '</p><span class="row">' + (g.demo ? '<span class="pill demo">데모</span>' : '<span class="pill">원문 PDF 연동 예정</span>') + '</span></button>'; }).join(''));
    if (libFilter === 'all' || libFilter === 'web') h += grid('COEX 웹 지식 <span class="muted" style="font-weight:500;font-size:12.5px">business.coex.co.kr · 2026-11-02 수집</span>', kb.map(function (d) { return '<button class="doc" data-doc="' + d.id + '"><span class="kind">WEB · ' + esc(d.cat.split('.')[0]) + ' · 청크 ' + d.chunks + '</span><b>' + esc(d.title) + '</b><p>' + esc(d.type) + '</p><span class="row">' + valPill(d.status) + '</span></button>'; }).join(''));
    if (libFilter === 'all' || libFilter === 'dwg') h += grid('도면 <span class="muted" style="font-weight:500;font-size:12.5px">CAD PDF·이미지 판독 · 2026-11-05 정제</span>', dw.map(function (d) { return '<button class="doc" data-doc="' + d.id + '"><span class="kind">DWG · ' + esc(d.facility) + ' · ' + d.year + '</span><b>' + esc(d.title) + '</b><p class="mono" style="font-size:11px">' + esc(d.url) + '</p><span class="row">' + valPill('vision_extracted_needs_review') + (d.year < '2024' ? '<span class="pill">구버전 참고</span>' : '') + '</span></button>'; }).join(''));
    if (libFilter === 'all' || libFilter === 'tel') h += grid('연락처', D.contacts.map(function (c) { return '<div class="doc"><span class="kind">TEL</span><b>' + esc(c.name) + '</b><p>' + esc(c.what) + '</p><div class="row"><span class="mono" style="user-select:all;font-size:13px">' + esc(c.tel) + '</span><button class="btn sm" data-copy="' + esc(c.tel) + '">복사</button></div></div>'; }).join(''));
    return h;
  }

  /* ---------- 화면: 홀·도면 ---------- */
  var HALLS = {
    a: { name: 'Hall A', floor: '1F', area: '10,368㎡', booths: '520부스', load: '1.5 t/㎡', ceil: '7.5 / 9.0m', ceilNote: '배너 설치 높이는 가장자리 8.0m 기준', door: '최저 H 4.3m', rig: '호이스트 12기 · 1Point 125kg',
      flags: [{ t: '구역 분할 사용', d: '웹 공시는 "4개실 분할 사용 불가", 2024 도면에는 A1~A4 파티션선이 있어요. 분할 대관 가능 여부는 COEX 확인 전까지 단정하지 않아요.', src: { chunk: 'coex-dwg-hall-a-floor-2024#02-zones' } }],
      dw: ['coex-dwg-hall-a-floor-2024', 'coex-dwg-hall-a-ceiling-2024', 'coex-dwg-hall-a-banner-2024'], web: 'coex-hall-a' },
    b: { name: 'Hall B', floor: '1F', area: '8,010㎡ (S/S 포함)', booths: '360부스', load: '1.5 t/㎡', ceil: '9.5m', ceilNote: '스윙스페이스 6.2m', door: 'W 7.5 × H 4.3m · 2개소', rig: '배너 설비 표시 없는 판', flags: [{ t: '다용도실 면적 소수점 차이', d: '웹 60㎡, 2024 도면 60.7㎡ → 최신 도면 값을 씁니다.', ok: true, src: { chunk: 'coex-dwg-hall-b-floor-2024#02-loading-support' } }],
      dw: ['coex-dwg-hall-b-floor-2024'], web: 'coex-hall-b' },
    c: { name: 'Hall C', floor: '3F', area: '10,348㎡', booths: '520부스', load: '1.5 t/㎡', ceil: '8.0 / 12.3m', ceilNote: 'C2·C3 중앙 무주구간 12.3m', door: 'W 5.4 × H 5.0m · 4개소', rig: '호이스트 12기 · 1Point 150kg',
      flags: [{ t: 'C1 면적', d: '2024 CAD·웹 2,572㎡, 2018 매뉴얼 2,592㎡ → 2024 최신 CAD 기준으로 확정했어요.', ok: true, src: { chunk: 'coex-dwg-hall-c-floor-2024#02-zones' } }, { t: '다용도실 개수', d: '웹 4개소, 2018 매뉴얼 6개소, 2024 도면 5실 → 5실로 확정했어요.', ok: true, src: { chunk: 'coex-dwg-hall-c-floor-2024#04-support-rooms' } }],
      dw: ['coex-dwg-hall-c-floor-2024', 'coex-dwg-hall-c-ceiling-2024'], web: 'coex-hall-c' },
    d: { name: 'Hall D', floor: '3F', area: '7,281㎡ (S/S 포함)', booths: '360부스', load: '1.5 t/㎡', ceil: '17.5m', ceilNote: '전체 무주공간 · 스윙스페이스 9.3m', door: 'W 7.5 × H 4.3m · 2개소', rig: '—',
      flags: [{ t: 'D2 면적 표기', d: '웹 D2 3,645㎡ = 도면 중앙 729㎡ + D2 2,916㎡. 모순이 아니라 표기 차이예요.', ok: true, src: { chunk: 'coex-dwg-hall-d-floor-2024#01-overview' } }],
      dw: ['coex-dwg-hall-d-floor-2024'], web: 'coex-hall-d' },
    p: { name: 'THE PLATZ', floor: '2F', area: '2,224㎡', booths: '최대 114부스 (3×2m)', load: '—', ceil: '4.5m', ceilNote: '실사용 63 × 35.3 × 4.5m', door: '—', rig: '바텐 12개',
      flags: [{ t: '도면 해상도', d: '2010년 PNG 도면은 저해상도라 치수를 읽을 수 없어요. 고해상도 원본이 필요해요.', src: { chunk: 'coex-dwg-the-platz-floor-2010#01-layout' } }],
      dw: ['coex-dwg-the-platz-floor-2010'], web: 'coex-hall-the-platz' }
  };
  var dwSel = {};
  /* ---------- 홀 맵 (2D 기본 / 3D 전환 / 길찾기) ---------- */
  var MS = { mode: '2d', filter: 'all', sel: null, dest: null, angle: -28, zoom: 1, q: '' };
  var mapRedraw = null;
  function hmModel(key) {
    var M0 = HallMap.model(key);
    return { hall: M0.hall, booths: M0.booths.map(function (b) {
      var a = S.assign[b.id];
      if (a) return Object.assign({}, b, { st: 'booked', co: a, assigned: true });
      if (b.st === 'mine' && S.role !== 'exhibitor') return Object.assign({}, b, { st: 'booked', co: '㈜한빛로보틱스' });
      return b;
    }) };
  }
  function mapStart(M) {
    var mine = M.booths.filter(function (b) { return b.st === 'mine'; });
    if (S.role === 'exhibitor' && mine.length) { var a = mine[0], z = mine[mine.length - 1]; return { label: '내 부스 ' + a.id + '~' + z.id.split('-')[1], pt: [(a.x + z.x + 3) / 2, a.y + 1.5] }; }
    var g = M.hall.gates[0]; return { label: g.n, pt: [g.x, M.hall.h - .5] };
  }
  function mapDestObj(M) {
    if (!MS.dest) return null;
    if (MS.dest.indexOf('booth:') === 0) { var id = MS.dest.slice(6), b = M.booths.filter(function (x) { return x.id === id; })[0]; return b ? { booth: true, x: b.x + 1.5, y: b.y + 1.5, n: b.id + (b.co ? ' · ' + b.co : '') } : null; }
    return HallMap.poiList(M).filter(function (p) { return p.id === MS.dest; })[0] || null;
  }
  function mapBlock(key, opt) {
    opt = opt || {};
    var M = hmModel(key), H = M.hall, start = mapStart(M), dest = mapDestObj(M);
    var rt = dest ? HallMap.route(M, start.pt, dest) : null;
    var booked = M.booths.filter(function (b) { return b.st === 'booked'; }).length, vac = M.booths.filter(function (b) { return b.st === 'vacant'; }).length;
    var sel = MS.sel && M.booths.filter(function (b) { return b.id === MS.sel; })[0];
    var nameN = {}; HallMap.poiList(M).forEach(function (p) { nameN[p.n] = (nameN[p.n] || 0) + 1; });
    var poiName = function (p) { var z = (H.zones.filter(function (z) { return p.x >= z.x && p.x < z.x + z.w; })[0] || {}).n; return p.n.replace('화물출입구 ', '화물 ') + (nameN[p.n] > 1 && z ? ' · ' + z : ''); };
    var pois = HallMap.poiList(M), groups = [['화물출입구', pois.filter(function (p) { return p.t === 'door'; })], ['주출입구', pois.filter(function (p) { return p.t === 'gate'; })], ['편의·부대시설', pois.filter(function (p) { return p.t !== 'door' && p.t !== 'gate'; })]];
    var h = '<section class="map-shell"><div class="card map-card"><div class="map-tools"><div class="seg" role="group" aria-label="보기 방식" style="width:150px"><button data-mm="2d" class="' + (MS.mode === '2d' ? 'on' : '') + '">2D 평면</button><button data-mm="3d" class="' + (MS.mode === '3d' ? 'on' : '') + '">3D 입체</button></div>'
      + '<div class="filters"><button data-mf="all" class="' + (MS.filter === 'all' ? 'on' : '') + '">전체 부스</button><button data-mf="vacant" class="' + (MS.filter === 'vacant' ? 'on' : '') + '">공실만</button></div>'
      + '<div class="legend-row" style="margin-left:auto">' + (H.mine.length && S.role === 'exhibitor' ? '<span><i style="background:var(--accent)"></i>내 부스</span>' : '') + '<span><i style="background:var(--map-booked)"></i>입실 ' + booked + '</span><span><i style="background:var(--map-vacant);border:1.5px dashed var(--map-vacant-line)"></i>공실 ' + vac + '</span><span><i style="background:var(--map-door)"></i>화물출입구</span><span><i style="background:var(--map-gate)"></i>주출입구</span></div></div>'
      + '<div class="map-stage">' + (MS.mode === '2d' ? '<div class="map-scroll">' + HallMap.svg2D(M, { sel: MS.sel, dest: MS.dest, route: rt, filter: MS.filter, mine: S.role === 'exhibitor', hi: opt.hi }) + '</div>'
        : '<canvas id="hm3d" aria-label="' + H.name + ' 3D 입체 보기"></canvas><div class="map-3d-ctl"><button data-rot="-15" aria-label="왼쪽으로 회전">⟲</button><button data-rot="15" aria-label="오른쪽으로 회전">⟳</button><button data-zm="1.15" aria-label="확대">＋</button><button data-zm="0.87" aria-label="축소">－</button></div><div class="map-hint">드래그해서 돌려 보세요</div>')
      + '</div><div class="row" style="padding:10px 14px;border-top:1px solid var(--line);justify-content:space-between"><span class="muted" style="font-size:12px">홀 외곽·구역·화물출입구 규격은 2024 CAD 기준 · 부스 배치·번호·예약 현황·편의시설 위치는 데모 개략값</span><button class="btn sm" data-cad="' + key + '">' + ic('doc') + '원본 CAD 도면</button></div></div>';
    h += '<div class="map-side">';
    if (opt.side) h += opt.side(M, sel);
    h += '<div class="card"><div class="card-h"><h2>길찾기</h2>' + (rt ? '<button class="link-row" data-mclear="1">지우기</button>' : '') + '</div><div class="card-b" style="display:flex;flex-direction:column;gap:12px">'
      + '<div class="verdict"><span class="ck ok" style="background:var(--accent);color:var(--on-accent)">●</span><div><div class="t-desc">출발</div><b>' + esc(start.label) + '</b></div></div>'
      + '<form class="row" id="booth-find" style="flex-wrap:nowrap"><label class="sr" for="booth-q">부스 번호</label><input id="booth-q" placeholder="부스 번호 예) ' + H.letter + '-112" value="' + esc(MS.q) + '" style="flex:1;min-width:0;border:1px solid var(--line-2);border-radius:var(--r-sm);padding:7px 10px;background:var(--surface)"><button class="btn sm" type="submit">찾기</button></form>'
      + groups.map(function (g) { return '<div><div class="t-desc" style="margin-bottom:6px">' + g[0] + '</div><div class="poi-list">' + g[1].map(function (p) { return '<button data-dest="' + p.id + '" class="' + (MS.dest === p.id ? 'on' : '') + '">' + esc(poiName(p)) + '</button>'; }).join('') + '</div></div>'; }).join('')
      + (rt ? '<div style="border-top:1px solid var(--line);padding-top:12px"><div class="t-desc">도착 · ' + esc(dest.booth ? dest.n : poiName(dest)) + (dest.spec ? ' · ' + dest.spec : '') + '</div><div class="big-metric"><b>' + Math.round(rt.len) + 'm</b><span class="muted">도보 약 ' + Math.max(1, Math.round(rt.len / 70)) + '분</span></div><div class="nav-steps" style="margin-top:6px">' + rt.steps.map(function (s) { return '<div>' + esc(s.dir) + '으로 ' + s.d + 'm</div>'; }).join('') + '<div>도착</div></div></div>' : dest ? '<div class="verdict">경로를 찾지 못했어요.</div>' : '<p class="muted" style="font-size:12.5px;margin:0">가고 싶은 곳을 누르거나 지도의 부스를 눌러 보세요. 통로만 따라 가장 짧은 길을 계산해요.</p>')
      + '</div></div>';
    if (sel) h += '<div class="card"><div class="card-h"><h2>' + sel.id + '</h2>' + (sel.st === 'vacant' ? '<span class="pill ok">공실</span>' : sel.st === 'mine' ? '<span class="pill acc">내 부스</span>' : '<span class="pill">입실</span>') + '</div><div class="card-b" style="display:flex;flex-direction:column;gap:8px"><dl class="meta-grid"><dt>참가사</dt><dd>' + esc(sel.co || '—') + '</dd><dt>규격</dt><dd>3 × 3m (9㎡)</dd><dt>구역</dt><dd>' + esc((H.zones.filter(function (z) { return sel.x >= z.x && sel.x < z.x + z.w; })[0] || {}).n || '') + '</dd></dl>'
      + '<div class="row"><button class="btn sm primary" data-dest="booth:' + sel.id + '">여기로 길찾기</button>' + (opt.selAct ? opt.selAct(sel) : '') + '</div></div></div>';
    return h + '</div></section>';
  }
  function mapAfter() {
    var sc = $('.map-scroll');
    if (sc && sc.scrollWidth > sc.clientWidth) {
      var mk = sc.querySelector('.hm-b.sel') || sc.querySelector('.hm-pin.start') || sc.querySelector('.hm-you');
      if (mk) { var r = mk.getBoundingClientRect(), r0 = sc.getBoundingClientRect(); sc.scrollLeft += r.left - r0.left - sc.clientWidth / 2; }
    }
    var cv = $('#hm3d');
    if (!cv) { mapRedraw = function () {}; return; }
    var key = cv.closest('[data-hallkey]') ? cv.closest('[data-hallkey]').dataset.hallkey : 'c';
    var M = hmModel(key), start = mapStart(M), dest = mapDestObj(M), rt = dest ? HallMap.route(M, start.pt, dest) : null;
    mapRedraw = function () { HallMap.draw3D(cv, M, { angle: MS.angle, zoom: MS.zoom, route: rt, dest: MS.dest, mine: S.role === 'exhibitor' }); };
    mapRedraw();
    var drag = null;
    cv.addEventListener('pointerdown', function (e) { drag = e.clientX; cv.setPointerCapture(e.pointerId); });
    cv.addEventListener('pointermove', function (e) { if (drag == null) return; MS.angle += (e.clientX - drag) * 0.4; drag = e.clientX; mapRedraw(); });
    cv.addEventListener('pointerup', function () { drag = null; });
  }
  window.addEventListener('resize', function () { if (mapRedraw && $('#hm3d')) mapRedraw(); });

  function viewHalls() {
    if (!hallSel) hallSel = ex().hallKey;
    var H = HALLS[hallSel];
    var h = '<div class="page-h"><div><h1>홀 맵·도면</h1><p>' + (S.role === 'exhibitor' && hallSel === ex().hallKey && !isPre() ? '보라색이 우리 부스예요. 가고 싶은 곳을 고르면 통로를 따라 길을 안내해요.' : '부스 입실·공실 현황과 길찾기를 볼 수 있어요.') + '</p></div><div class="hall-tabs" role="tablist">'
      + Object.keys(HALLS).map(function (k) { return '<button role="tab" aria-selected="' + (k === hallSel) + '" data-hall="' + k + '" class="' + (k === hallSel ? 'on' : '') + '">' + HALLS[k].name + (k === ex().hallKey && S.role === 'exhibitor' ? ' ·우리' : '') + '</button>'; }).join('') + '</div></div>';
    h += '<div class="spec"><div><small>위치</small><b>' + H.floor + '</b></div><div><small>면적</small><b>' + H.area + '</b></div><div><small>수용</small><b>' + H.booths + '</b></div><div><small>바닥 하중</small><b>' + H.load + '</b></div>'
      + '<div><small>천장고</small><b>' + H.ceil + '</b><small>' + H.ceilNote + '</small></div><div><small>화물출입구</small><b style="font-size:15px">' + H.door + '</b></div><div><small>천장 리깅</small><b style="font-size:15px">' + H.rig + '</b></div><div><small>근거</small><span class="row" style="margin-top:4px">' + cite({ chunk: H.web + '#02-spec-detail' }, '웹') + '</span></div></div>';
    if (HallMap.HALLS[hallSel]) h += '<div data-hallkey="' + hallSel + '">' + mapBlock(hallSel) + '</div>';
    else h += '<div class="card"><div class="card-b"><div class="empty">THE PLATZ는 2010년 저해상도 도면만 있어 부스 맵을 만들지 않았어요. 고해상도 원본이 들어오면 같은 방식으로 추가할 수 있어요.</div></div></div>';
    h += '<section class="card"><div class="card-h"><h2>자료 간 차이 · 확인 필요</h2><button class="btn sm" data-cad="' + hallSel + '">도면 판독 내용 보기</button></div><div class="card-b grid g-2">'
      + H.flags.map(function (f) { return '<div class="verdict" style="' + (f.ok ? '' : 'background:var(--warn-weak)') + '">' + (f.ok ? '<span class="ck ok">✓</span>' : '<span class="ck warn">!</span>') + '<div style="flex:1;min-width:0"><b>' + esc(f.t) + '</b> ' + (f.ok ? '<span class="pill ok">결정됨</span>' : '<span class="pill warn">확인 필요</span>') + '<div class="t-desc" style="margin-top:4px">' + esc(f.d) + '</div><div style="margin-top:6px">' + cite(f.src) + '</div></div></div>'; }).join('') + '</div></section>';
    return h;
  }
  function openCad(key) {
    var H = HALLS[key], ids = H.dw;
    $('#drawer').innerHTML = '<div class="drawer-h"><div><span class="pill info">원본 CAD</span><h2 style="font-size:17px;margin-top:8px">' + H.name + ' 도면·판독 내용</h2><div class="muted" style="font-size:12.5px">2024 CAD PDF를 렌더링한 원본과 AI 판독 결과예요.</div></div><button class="icon-btn" data-act="close" aria-label="닫기">' + ic('x') + '</button></div><div class="drawer-b">'
      + ids.map(function (id) { var d = docOf(id); return '<div style="display:flex;flex-direction:column;gap:8px"><div class="row"><b>' + esc(d.title) + '</b>' + valPill('vision_extracted_needs_review') + '</div>' + (d.img ? '<div class="drawing" style="max-height:300px"><img src="' + d.img + '" alt="' + esc(d.title) + '"></div>' : '') + CH.filter(function (c) { return c.doc === id; }).map(function (c) { return '<div class="chunk"><b style="font-size:13px">' + esc(c.sec) + '</b><p>' + hl(c.text) + '</p></div>'; }).join('') + '</div>'; }).join('<hr style="border:0;border-top:1px solid var(--line);margin:8px 0">') + '</div>';
    $('#drawer').hidden = false; $('#scrim').hidden = false;
  }
  function hl(t) { return esc(t).replace(/\[(확인 필요|검증 메모)\]/g, '<mark>$1</mark>'); }

  /* ---------- 화면: 기업 정보 ---------- */
  function viewCompany() {
    var c = D.company;
    return '<div class="page-h"><div><h1>기업 정보·담당자</h1><p>신청서와 디렉토리에 자동으로 채워지는 정보예요.</p></div><span class="pill demo">데모 회사</span></div>'
      + '<section class="grid g-2"><div class="card"><div class="card-h"><h2>' + esc(c.name) + '</h2></div><div class="card-b"><dl class="meta-grid"><dt>사업자번호</dt><dd class="tnum">' + esc(c.biz) + '</dd><dt>업종</dt><dd>' + esc(c.industry) + '</dd><dt>주소</dt><dd>' + esc(c.address) + '</dd><dt>홈페이지</dt><dd>' + esc(c.homepage) + '</dd><dt>참가 전시</dt><dd>' + esc(D.exhibitions.approved.name) + ' · ' + esc(D.exhibitions.pre.name) + '</dd></dl></div></div>'
      + '<div class="card"><div class="card-h"><h2>담당자 ' + c.staff.length + '명</h2><button class="btn sm" data-act="invite">담당자 추가</button></div><div class="card-b table-wrap"><table class="stack"><thead><tr><th>이름</th><th>역할</th><th>연락처</th><th>부스 App</th></tr></thead><tbody>'
      + c.staff.map(function (s) { return '<tr><td><b>' + esc(s.name) + '</b></td><td data-l="역할">' + esc(s.role) + '</td><td data-l="연락처" class="tnum">' + esc(s.phone) + '</td><td data-l="App">' + (s.app ? '<span class="pill ok">권한 있음</span>' : '<span class="pill">없음</span>') + '</td></tr>'; }).join('')
      + '</tbody></table></div></div></section>';
  }

  /* ---------- 화면: 부스 App ---------- */
  function viewBooth() {
    var B = D.booth, body = '';
    if (boothTab === 'today') {
      var max = Math.max.apply(null, B.visitors), w = 300, hgt = 52, pts = B.visitors.map(function (v, i) { return [i * (w / (B.visitors.length - 1)), hgt - 4 - (v / max) * (hgt - 10)]; });
      var line = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
      body = '<div class="alert"><b>주최사 공지 09:20</b><br>' + esc(B.notice) + '</div>'
        + '<div class="ph-card"><div class="row" style="justify-content:space-between"><b>오늘 방문객</b><span class="muted" style="font-size:12px">09:30 개장 이후</span></div><div class="grid" style="grid-template-columns:repeat(3,1fr);gap:8px;margin:10px 0"><div><small class="muted">방문</small><div class="k-v tnum" style="font-size:22px;font-weight:700">' + B.visits + '</div></div><div><small class="muted">리드</small><div class="tnum" style="font-size:22px;font-weight:700">' + B.leads + '</div></div><div><small class="muted">Hot</small><div class="tnum" style="font-size:22px;font-weight:700;color:var(--bad)">' + B.hot + '</div></div></div>'
        + '<svg class="spark" viewBox="0 0 300 56" preserveAspectRatio="none" role="img" aria-label="시간대별 방문객"><path d="' + line + ' L300 56 L0 56 Z" fill="var(--accent-weak)"/><path d="' + line + '" fill="none" stroke="var(--accent)" stroke-width="2"/><circle cx="' + pts[pts.length - 1][0] + '" cy="' + pts[pts.length - 1][1] + '" r="3.5" fill="var(--accent)"/></svg></div>'
        + '<div class="ph-card"><b>오늘 일정</b>' + B.schedule.map(function (s) { return '<div style="display:flex;gap:10px;padding:8px 0;border-bottom:1px solid var(--line);font-size:13px"><span class="tnum muted">' + s.t + '</span><span style="flex:1">' + esc(s.title) + '</span><span class="pill ' + (s.s === '확정' ? 'acc' : '') + '">' + s.s + '</span></div>'; }).join('') + '</div>'
        + '<div class="ph-card"><b>마감 점검 · 매일 종료 후</b><label class="todo" style="padding:8px 0"><input type="checkbox" id="b1"><div class="tx" style="font-size:13px">커피머신 급배수 누수 점검<div style="margin-top:4px">' + cite({ label: '급배수 주의사항 서약 3항' }) + '</div></div></label><label class="todo" style="padding:8px 0"><input type="checkbox" id="b2"><div class="tx" style="font-size:13px">시연 장비 전원 차단<div style="margin-top:4px">' + cite({ label: '시설운영규정 p.9' }) + '</div></div></label></div>'
        + '<div class="ph-card"><b>오늘 알아둘 것</b><p style="margin:6px 0;font-size:13px">전시 기간에는 화물차 무료주차가 되지 않아요. 전시장 입출구 인근 50% 할인 주차권(QR)을 쓰세요.</p>' + cite({ chunk: 'coex-parking-information#02-parking-by-period' }) + '</div>';
    } else if (boothTab === 'leads') {
      body = '<button class="btn primary" data-act="scan" style="justify-content:center">' + ic('scan') + '명함 스캔해서 리드 등록</button>' + B.leadsList.map(function (l) { return '<div class="ph-card"><div class="row" style="justify-content:space-between"><b>' + esc(l.name) + ' · ' + esc(l.co) + '</b><span class="pill ' + (l.grade === 'Hot' ? 'bad' : l.grade === 'Warm' ? 'warn' : '') + '">' + l.grade + '</span></div><div class="t-desc">' + esc(l.interest) + ' · ' + l.time + '</div></div>'; }).join('');
    } else if (boothTab === 'req') {
      body = '<div class="grid" style="grid-template-columns:1fr 1fr;gap:8px">' + ['전기', '누수', '인터넷', '청소'].map(function (x) { return '<button class="btn" data-act="req" style="justify-content:center;padding:14px">' + x + ' 요청</button>'; }).join('') + '</div>'
        + B.requests.map(function (r) { return '<div class="ph-card"><div class="row" style="justify-content:space-between"><b style="font-size:13px">' + esc(r.title) + '</b><span class="pill ' + (r.state === '완료' ? 'ok' : 'warn') + '">' + r.state + '</span></div><div class="t-desc">' + esc(r.who) + ' · ' + r.time + '</div></div>'; }).join('')
        + '<div class="ph-card" style="font-size:12.5px">홀매니저실 <span class="mono" style="user-select:all">02-6000-1143~5</span></div>';
    } else {
      body = '<div class="ph-card" style="font-size:13px">현장 AI는 웹 어시스턴트와 같은 근거를 써요.</div><div class="follow">' + ['전시 기간 중 급배수 점검은?', '의무실이랑 물품보관소 어디야?', '홀매니저실 연락처'].map(function (q) { return '<button data-q="' + q + '">' + q + '</button>'; }).join('') + '</div>';
    }
    var tabs = [['today', 'home', '오늘'], ['leads', 'users', '리드'], ['scan', 'scan', '스캔'], ['req', 'alert', '요청'], ['ai', 'spark', 'AI']];
    return '<div class="page-h"><div><h1>부스 App</h1><p>전시 기간에 부스 스태프가 휴대폰으로 쓰는 화면이에요.</p></div><a class="btn" href="#home">← 웹 대시보드로</a></div><div class="phone-wrap"><div class="phone"><div class="ph-status"><span class="tnum">10:52</span><span>LTE ▮▮▮</span></div>'
      + '<div class="ph-head"><div class="row" style="justify-content:space-between"><b style="font-size:16px">C-228 한빛로보틱스</b><span class="pill ok">● 운영 중</span></div><div class="t-desc">전시 2일차 · 12.10 (목) · Hall C</div></div><div class="ph-body">' + body + '</div>'
      + '<div class="ph-tabs">' + tabs.map(function (t) { return '<button data-bt="' + t[0] + '" class="' + (boothTab === t[0] ? 'on' : '') + '">' + ic(t[1]) + t[2] + '</button>'; }).join('') + '</div></div></div>';
  }

  /* ---------- AI 어시스턴트 엔진 (데모: 준비된 시나리오 + 데이터셋 검색) ---------- */
  function C(id) { return { chunk: id }; }
  function G(l) { return { label: l }; }
  var SCRIPTS = [
    { re: /커피|급배수|싱크|물\s?쓰/, not: /점검|누수/, run: function () { return {
      steps: [['이 전시회 매뉴얼을 찾았어요', '기술지원 신청 마감'], ['코엑스 규정을 살펴봤어요', '급배수 주의사항 1~3항'], ['우리 제출 현황과 대조했어요', '급배수 신청 미착수']],
      html: '<p>급배수는 직접 설치할 수 없고 <b>코엑스에 등록된 서비스협력업체</b>가 시공해야 해요.[1]</p><ol><li>기술지원 신청서에 급배수 사용을 표기하세요. 이 전시회는 주최사가 <b>11.16</b>까지 취합해요.[2]</li><li>급배수 사용 서약서에 전시주최·참가업체·공사업체가 모두 날인해요.[1]</li><li>배수관은 장비와 1:1로 연결하고, 중간에 T관으로 잇는 공사는 금지예요.[1]</li></ol><p>지금 우리 회사 상태: <span class="pill">미착수</span> · 마감까지 11일 남았어요.</p>',
      cites: [G('급배수 주의사항 서약 1~3항'), G('참가업체 매뉴얼(데모) p.14')],
      follow: ['서약서 양식 받기', '전시 기간 중 급배수 점검은?', '시공업체는 어떻게 찾아?'] }; } },
    { re: /누수|급배수\s?점검|기간\s?중.*급배수/, run: function () { return {
      steps: [['코엑스 규정을 살펴봤어요', '급배수 주의사항 3항']],
      html: '<p>전시 기간에는 <b>매일 행사 종료 후</b> 누수 여부를 확인하세요.[1] 부스 App의 "마감 점검"에 매일 체크 항목으로 들어가 있어요.</p>',
      cites: [G('급배수 주의사항 서약 3항')], follow: ['부스 App 열기', '홀매니저실 연락처'] }; } },
    { re: /도면.*(반려|고치|수정)|반려.*도면/, run: function () { return {
      steps: [['제출 이력을 확인했어요', 'C228_layout_v2.pdf · 11.03 반려'], ['이용안내서 기준을 찾았어요', 'p.26 부스 도면 요건'], ['수정본을 점검했어요', '6개 항목 중 3개 미충족']],
      html: '<p>11.03 반려 사유는 <b>통로 너비·벽면 이격거리 표기 누락</b>과 <b>독립부스 색상 미구분</b>이에요.[1] 수정본(v3 초안)에도 세 항목이 그대로 남아 있어요.</p><ol><li>통로 쪽 너비 치수를 넣어 주세요.</li><li>벽면 이격거리를 표기해 주세요.</li><li>독립부스 구역을 색상으로 구분하고 A3 3부로 출력해요.[1]</li></ol><p>부스 높이 4.5m는 Hall C 천장고(8.0m) 안이지만, 주최사 높이 제한은 별도로 확인이 필요해요.[2]</p>',
      cites: [G('이용안내서 p.26'), C('coex-dwg-hall-c-ceiling-2024#01-rigging')], follow: ['AI 사전 점검 열기', '박정훈 님에게 수정 요청 초안 써줘'] }; } },
    { re: /전기|기술지원\s?신청/, run: function () { return {
      steps: [['작성 중인 신청서를 열었어요', '기술지원신청서_작성중.xlsx'], ['필수 기재 항목과 비교했어요', '5개 중 4개 완료']],
      html: '<p>전기 신청서는 거의 다 됐어요. <b>계약자 직인</b>만 비어 있어요.[1] 전력 용량(단상 220V 5kW), 사용 시간, 분전반 위치, A3 도면은 모두 들어가 있어요.</p><p>주최사 취합 마감은 <b>11.16</b>이에요.</p>',
      cites: [G('이용안내서 p.26')], follow: ['급배수도 같이 신청해야 해?', '이번 주 마감 뭐 있어?'] }; } },
    { re: /분할|A1|A4|나눠|나누어/, run: function () { return {
      steps: [['COEX 웹 공시를 확인했어요', 'Hall A 상세정보'], ['2024 CAD 도면을 확인했어요', 'Hall A 평면도 구역 표기'], ['두 자료를 비교했어요', '내용 불일치']],
      hold: '두 자료가 서로 달라 가능 여부를 확정하지 않았어요.',
      html: '<p><b>웹 공시</b>에는 Hall A가 "4개실 분할 사용 불가"로 되어 있어요.[1] 반면 <b>2024 CAD 평면도</b>에는 A1~A4 구역(각 2,592㎡)과 구역 경계 파티션선이 표시되어 있어요.[2]</p><p>도면 표시만으로 구역별 분할 대관이 된다고 볼 수는 없어요. 분할 대관이 필요하면 코엑스 전시서비스팀(02-6000-1112)에 확인해 주세요.</p>',
      cites: [C('coex-hall-a#02-spec-detail'), C('coex-dwg-hall-a-floor-2024#02-zones')], follow: ['Hall A 도면 보기', 'Hall B는 분할 돼?', '정기대관 절차 알려줘'] }; } },
    { re: /hall\s?b.*분할|B홀.*분할/i, run: function () { return {
      steps: [['COEX 웹 공시를 확인했어요', 'Hall B 상세정보']],
      html: '<p>Hall B는 <b>2개실 분할 사용이 가능</b>하다고 공시되어 있어요. B1·B2 각 3,645㎡예요.[1][2]</p>',
      cites: [C('coex-hall-b#02-spec-detail'), C('coex-dwg-hall-b-floor-2024#01-overview')], follow: ['Hall B 도면 보기'] }; } },
    { re: /배너|호이스트|리깅|매달|하중/, run: function () { return {
      steps: [['Hall C 천장평면도를 확인했어요', '2024 CAD p.2']],
      html: '<p>Hall C에는 전동식 포인트 호이스트가 <b>12기</b> 있고, 1기당 4Point예요. <b>1Point 적정 인양하중은 150kg</b>이에요.[1]</p><ul><li>천장고: C2·C3 중앙 무주구간 12.3m, 그 외 8.0m</li><li>참고로 Hall A는 1Point 125kg이라 더 낮아요.[2]</li></ul><p>천장 배너를 쓰면 "천장 배너·호이스트 사용 신청"이 필수 서류로 추가돼요.</p>',
      cites: [C('coex-dwg-hall-c-ceiling-2024#01-rigging'), C('coex-dwg-hall-a-banner-2024#01-rigging')], follow: ['조건별 필수 판정 열기', 'Hall C 도면 보기'] }; } },
    { re: /(hall\s?a|a홀).*(화물|출입구|반입)/i, run: function () { return {
      steps: [['Hall A 평면도를 확인했어요', '2024 CAD 북측 화물출입구']],
      html: '<p>Hall A 북측 화물출입구는 위치마다 크기가 달라요. 가장 낮은 곳은 <b>A4 쪽 W 6.5m × H 4.3m</b>이고, 나머지는 높이 5.5m예요.[1] 반입 차량·장비 높이를 출입구별로 맞춰 보세요.</p>',
      cites: [C('coex-dwg-hall-a-floor-2024#03-loading')], follow: ['Hall A 도면 보기', '1층 로딩독 동선은?'] }; } },
    { re: /화물\s?출입구|반입\s?(문|규격|크기)|출입구\s?(크기|높이)/, run: function () { return {
      steps: [['Hall C 평면도를 확인했어요', '2024 CAD 북측']],
      html: '<p>Hall C 북측 화물출입구는 <b>4개소, 모두 W 5.4m × H 5.0m</b>예요.[1] 우리 부스(C-228)와 가까운 출입구는 반입 시간대 배정(설치 1일차 08:00–11:00)과 함께 주최사에 확인해 주세요.</p><p>HB-7 시연 장비를 실은 차량이나 지게차 높이가 5.0m를 넘지 않는지 확인이 필요해요.</p>',
      cites: [C('coex-dwg-hall-c-floor-2024#03-loading')], follow: ['3층 로딩독 어떻게 들어가?', '준비기간 화물차 무료주차 조건은?'] }; } },
    { re: /로딩|동선|진입/, run: function () { return {
      steps: [['COEX 주차안내를 확인했어요', '화물차 로딩독 진입 동선']],
      html: '<p>Hall C·D(3층)는 테헤란로에서 현대백화점을 끼고 우회전한 뒤, 전방 200m 우측 <b>서문 GATE로 들어가 바로 우회전</b>해서 지상 3층까지 올라가요.[1] Hall A·B(1층)는 서문 GATE로 들어가 직진하면 돼요.</p>',
      cites: [C('coex-parking-information#01-loading-dock-route')], follow: ['준비기간 화물차 무료주차 조건은?'] }; } },
    { re: /화물차|트럭|무료\s?주차/, run: function () { return {
      steps: [['COEX 주차안내를 확인했어요', '화물차 무료주차 대상·적용과정'], ['우리 일정과 맞춰 봤어요', '준비 12.07–08 · 철거 12.11']],
      html: '<p>준비·철거 기간에만 <b>작업용 화물차</b>에 무료주차가 적용돼요.[1]</p><ul><li>대상: 1톤 이상 화물차(트럭)와 승합차(번호 앞자리 7·8·9)</li><li>시간: 코엑스 진입 후 <b>1일 1회 3시간</b>, 차량 수 제한 없음</li><li>출차할 때 경비원에게 작업차량 QR 등록을 안내받아요.[2]</li></ul><p>승용·SUV는 해당되지 않고, 전시 기간(12.09–11)에는 무료주차가 없어요.[3]</p>',
      cites: [C('coex-parking-information#03-truck-free-parking'), C('coex-parking-information#04-truck-free-parking'), C('coex-parking-information#02-parking-by-period')], follow: ['전시기간 주차권 사전구매는?', '3층 로딩독 어떻게 들어가?'] }; } },
    { re: /주차권|사전\s?구매|카카오/, run: function () { return {
      steps: [['COEX 주차안내를 확인했어요', '주차권 사전구매']],
      html: '<p>참가업체는 <b>카카오 T 주차 For Manager</b> 계정을 만들고 운영업체 승인을 받은 뒤 온라인으로 할인권·주차권을 살 수 있어요.[1]</p><ul><li>가입할 때 입주사명은 "전시회명 + 회사명"으로 적어요. 예) 2026 서울 스마트제조 엑스포 한빛로보틱스</li><li>3일 이상 연속된 일자만 살 수 있고, 등록 후 차량 변경·환불이 안 돼요.</li><li>승인 문의: 코엑스 주차관리실 02-6002-7130</li></ul>',
      cites: [C('coex-parking-information#05-parking-pass-prepurchase')], follow: ['준비기간 화물차 무료주차 조건은?'] }; } },
    { re: /정기\s?대관|대관\s?절차|대관/, run: function () { return {
      steps: [['COEX 정기대관 안내를 확인했어요', '5단계 절차']],
      html: '<p>코엑스 정기대관은 5단계로 진행돼요.[1]</p><ol><li><b>신청</b> · 2년 뒤 개최 전시회를 받아요. 공고 후 약 1개월 접수[2]</li><li><b>배정작업</b> · 신청 시기와 규모 기준</li><li><b>배정심의</b> · 대관운영위원회</li><li><b>조정</b> · 시기·면적 조정 신청</li><li><b>계약체결</b></li></ol><p>참가기업이 아니라 주최사가 진행하는 절차예요.</p>',
      cites: [C('coex-lease-procedure#01-process-overview'), C('coex-lease-procedure#02-step1-application')], follow: ['대관문의는 어떻게 해?'] }; } },
    { re: /홀매니저|연락처|전화/, run: function () { return {
      steps: [['연락처를 찾았어요', 'Library · 연락처']],
      html: '<p>코엑스 <b>홀매니저실</b>은 전시장 현장운영과 기술지원 창구예요. 번호는 <span class="mono" style="user-select:all">02-6000-1143~5, 1148</span>이에요.[1]</p>',
      cites: [G('이용안내서 p.13')], follow: ['Library 연락처 전체 보기'] }; } },
    { re: /의무실|물품\s?보관|휠체어|편의/, run: function () { return {
      steps: [['COEX 편의시설 안내를 확인했어요', '1층 편의시설']],
      html: '<p>의무실, 물품보관소, 휠체어 대여는 모두 <b>1층</b>에 있어요.[1][2][3] 정확한 위치는 각 근거의 원문을 눌러 확인하세요.</p>',
      cites: [C('coex-amenities#03-medical-room'), C('coex-amenities#09-storage'), C('coex-amenities#05-wheelchair')], follow: ['홀매니저실 연락처'] }; } },
    { re: /이번\s?주|마감\s?뭐|할\s?일/, run: function () {
      var list = D.tasks.filter(function (t) { return !S.done[t.id] && days(t.due) <= 7; });
      return { steps: [['세부 일정표를 확인했어요', '7일 내 마감 ' + list.length + '건']],
        html: '<p>7일 안에 마감되는 일은 <b>' + list.length + '건</b>이에요.</p><ul>' + list.map(function (t) { return '<li><b>' + md(t.due) + '</b> ' + esc(t.title) + ' · ' + esc(t.owner) + '</li>'; }).join('') + '</ul>',
        cites: [], follow: ['세부 일정표 열기', '도면 반려 사유 고치려면?'] }; } },
    { re: /수정 요청 초안|초안/, run: function () { return {
      steps: [['반려 사유와 점검 결과를 묶었어요', '보낼 사람: 박정훈']],
      html: '<p>아래 초안을 복사해서 쓰세요. 보내기 전에 내용을 확인해 주세요.</p><div class="quote" style="font-size:13px">정훈님, C-228 부스 도면이 11.03 반려됐어요. 수정본에 아래 세 가지를 반영해 11.06까지 다시 부탁드려요.<br>1) 통로 쪽 너비 치수 2) 벽면 이격거리 3) 독립부스 색상 구분(A3 3부)</div>',
      cites: [G('이용안내서 p.26')], follow: ['AI 사전 점검 열기'] }; } }
  ];
  var CLARIFY = { re: /^\s*주차\s*\??$|주차\s*(어떻게|알려|안내)\s*\??$/, ask: '어떤 주차를 찾으세요?', opts: ['준비기간 화물차 무료주차 조건은?', '전시기간 주차권 사전구매는?', '3층 로딩독 어떻게 들어가?'] };
  var NAV_FOLLOW = { 'AI 사전 점검 열기': 'check', '조건별 필수 판정 열기': 'check', 'Hall A 도면 보기': 'halls:a', 'Hall B 도면 보기': 'halls:b', 'Hall C 도면 보기': 'halls:c', '세부 일정표 열기': 'schedule', '부스 App 열기': 'booth', 'Library 연락처 전체 보기': 'library:tel', '서약서 양식 받기': 'toast', '시공업체는 어떻게 찾아?': 'toast' };

  function bigrams(s) { s = s.toLowerCase().replace(/[^0-9a-z가-힣]/g, ''); var o = []; for (var i = 0; i < s.length - 1; i++) o.push(s.substr(i, 2)); return o; }
  function retrieve(q) {
    var qb = bigrams(q); if (!qb.length) return [];
    var hall = (q.match(/hall\s?([a-d])|([a-d])\s?홀/i) || []);
    var hk = (hall[1] || hall[2] || '').toUpperCase();
    return CH.map(function (c) {
      var t = (c.sec + ' ' + c.text).toLowerCase().replace(/[^0-9a-z가-힣]/g, ''), hit = 0;
      qb.forEach(function (b) { if (t.indexOf(b) >= 0) hit++; });
      var sc = hit / qb.length; if (hk && c.facility && c.facility.indexOf('Hall ' + hk) === 0) sc += .25;
      return { c: c, s: sc };
    }).filter(function (x) { return x.s >= .45; }).sort(function (a, b) { return b.s - a.s; }).slice(0, 3);
  }
  function answer(q) {
    if (CLARIFY.re.test(q)) return { steps: [['질문 범위를 확인했어요', '주차 관련 문서 6건']], ask: CLARIFY.ask, opts: CLARIFY.opts };
    for (var i = 0; i < SCRIPTS.length; i++) { var s = SCRIPTS[i]; if (s.re.test(q) && !(s.not && s.not.test(q))) return s.run(); }
    var r = retrieve(q);
    if (!r.length) return { steps: [['이 전시회 매뉴얼과 COEX 데이터를 찾아봤어요', '맞는 근거 없음']], hold: '근거를 찾지 못해 답을 확정하지 않았어요.',
      html: '<p>지금 등록된 문서에서는 이 질문에 답할 근거를 찾지 못했어요. 행사별 규정이면 주최사 사무국에, 시설·현장 문의는 홀매니저실(<span class="mono">02-6000-1143~5</span>)에 확인해 주세요.</p>', cites: [], follow: ['커피머신 급배수 신청', '준비기간 화물차 무료주차 조건은?'] };
    return { steps: [['COEX 데이터셋을 검색했어요', '관련 근거 ' + r.length + '건'], ['원문을 발췌했어요', '데모: 생성형 요약 대신 원문 그대로']],
      html: '<p>찾은 근거를 원문 그대로 보여드려요. 실제 서비스에서는 이 근거로 답을 요약해요.</p><ul>' + r.map(function (x, k) { var t = x.c.text.replace(/\[검증 메모\].*$/, ''); return '<li>' + esc(t.length > 180 ? t.slice(0, 180) + '…' : t) + '[' + (k + 1) + ']</li>'; }).join('') + '</ul>',
      cites: r.map(function (x) { return C(x.c.id); }), follow: ['홀매니저실 연락처'] };
  }
  function ansHtml(res, mi) {
    var h = '<div class="msg-a">';
    if (res.steps) h += '<button class="steps" aria-expanded="false" data-steps="' + mi + '">' + ic('chev') + res.steps.length + '가지 업무를 진행했어요</button><div class="step-list" id="st-' + mi + '" hidden>' + res.steps.map(function (s) { return '<div>✓ ' + esc(s[0]) + ' <em>· ' + esc(s[1]) + '</em></div>'; }).join('') + '</div>';
    if (res.ask) return h + '<div class="ask"><b>' + esc(res.ask) + '</b><span class="muted" style="font-size:12px">하나 선택</span><div class="opts">' + res.opts.map(function (o, i) { return '<button data-q="' + esc(o) + '"><i>' + (i + 1) + '</i>' + esc(o) + '</button>'; }).join('') + '</div></div></div>';
    var body = (res.html || '').replace(/\[(\d)\]/g, function (m, n) { return '<sup class="n" data-ci="' + mi + ':' + (n - 1) + '" title="근거 ' + n + '">' + n + '</sup>'; });
    h += '<div class="ans">' + (res.hold ? '<div class="hold">' + ic('alert', ' width="16" height="16" style="flex:none;margin-top:2px"') + '<span><b>확정 보류</b> · ' + esc(res.hold) + '</span></div>' : '') + body;
    if (res.cites && res.cites.length) h += '<div class="row" style="margin-top:10px">' + res.cites.map(function (c, i) { return cite(c, String(i + 1)); }).join('') + '</div>';
    h += '</div>';
    if ((res.follow && res.follow.length) || (res.hold && S.role === 'exhibitor')) h += '<div class="follow">' + (res.hold && S.role === 'exhibitor' ? '<button data-act="inquiry">주최사에 문의 보내기</button>' : '') + (res.follow || []).map(function (f) { return '<button data-q="' + esc(f) + '">' + esc(f) + '</button>'; }).join('') + '</div>';
    return h + '</div>';
  }
  function activeChat() { for (var i = 0; i < S.chats.length; i++) if (S.chats[i].id === S.active) return S.chats[i]; return null; }
  function ask(q, opts) {
    q = (q || '').trim(); if (!q) return;
    var nav = NAV_FOLLOW[q];
    if (nav) { if (nav === 'toast') { toast('데모에서는 양식 파일 연결 대신 안내만 보여줘요.'); return; } var p = nav.split(':'); if (p[0] === 'halls') hallSel = p[1]; if (p[0] === 'library') libFilter = p[1]; miniOpen = false; go(p[0]); return; }
    var chat = activeChat();
    if (!chat || (opts && opts.fresh)) { chat = { id: 'c' + Date.now(), title: q.slice(0, 22), at: '오늘', msgs: [] }; S.chats.unshift(chat); S.active = chat.id; }
    chat.msgs.push({ r: 'u', t: q }); chat.pending = true; save();
    paintThreads();
    setTimeout(function () { chat.pending = false; chat.msgs.push({ r: 'a', res: answer(q) }); save(); paintThreads(); }, 650);
  }
  function threadHtml() {
    var chat = activeChat();
    if (!chat) return '<div class="msg-a"><div class="ans"><p>안녕하세요. 전시 준비 중 궁금한 점을 물어보세요. <b>이 전시회 매뉴얼</b>과 <b>COEX 시설·규정 데이터</b>를 근거로 답하고, 근거가 부족하거나 자료끼리 다르면 확정하지 않고 알려드려요.</p></div><div class="follow">' + ['커피머신 급배수 신청', '도면 반려 사유 고치려면?', 'Hall A 분할 사용 가능해?', '주차', 'Hall C 천장 배너 하중 얼마까지야?'].map(function (q) { return '<button data-q="' + q + '">' + q + '</button>'; }).join('') + '</div></div>';
    var h = '';
    chat.msgs.forEach(function (m, i) { h += m.r === 'u' ? '<div class="msg-u">' + esc(m.t) + '</div>' : ansHtml(m.res, i); });
    if (chat.pending) h += '<div class="msg-a"><span class="steps">' + ic('spark') + '근거 문서를 찾는 중</span><span class="typing"><i></i><i></i><i></i></span></div>';
    return h;
  }
  function ctxHtml() {
    var chat = activeChat(), cites = [], steps = [];
    if (chat) chat.msgs.forEach(function (m) { if (m.r === 'u') steps.push({ q: m.t, s: [] }); else if (m.res) { if (steps.length) steps[steps.length - 1].s = m.res.steps || []; (m.res.cites || []).forEach(function (c) { var k = JSON.stringify(c); if (!cites.some(function (x) { return JSON.stringify(x) === k; })) cites.push(c); }); } });
    var h = '<h3>대화 맥락 <span class="muted" style="font-weight:500">' + esc(ex().short) + '</span></h3><div class="row"><span class="chip on"># 이 전시회 매뉴얼</span><span class="chip on"># COEX 규정·시설</span><span class="chip on">@ ' + esc(ex().hall) + '</span></div>';
    h += '<h3>진행 상황</h3><div class="tl">' + (steps.length ? steps.map(function (st) { return '<div><i>✓</i><div><b style="font-size:12.5px">' + esc(st.q) + '</b>' + st.s.map(function (s) { return '<div class="muted" style="font-size:12px">' + esc(s[0]) + '</div>'; }).join('') + '</div></div>'; }).join('') : '<span class="muted">질문하면 AI가 한 일이 여기에 쌓여요.</span>') + '</div>';
    h += '<h3>근거 문서 <span class="muted tnum">' + cites.length + '건</span></h3>' + (cites.length ? cites.map(function (c, i) {
      var ch = c.chunk && chunk(c.chunk);
      return '<div class="src-card" data-src="' + esc(JSON.stringify(c)) + '"><div class="h"><sup class="n">' + (i + 1) + '</sup>' + esc(shortLabel(c)) + '</div><div class="q">' + esc(ch ? ch.text : '원문 PDF 연동 예정 (데모)') + '</div>' + (ch ? valPill(ch.status) : '<span class="pill">외부 문서</span>') + '</div>';
    }).join('') : '<div class="muted" style="font-size:12.5px">아직 근거가 없어요.</div>');
    return h;
  }
  function paintThreads() {
    ['#thread', '#mini-thread'].forEach(function (s) { var el = $(s); if (el) { el.innerHTML = threadHtml(); el.scrollTop = el.scrollHeight; } });
    var ctx = $('#ctx'); if (ctx) ctx.innerHTML = ctxHtml();
    var list = $('#conv-list'); if (list) list.innerHTML = convList();
  }
  function convList() {
    return '<div class="h">대화 기록</div>' + (S.chats.length ? S.chats.map(function (c) { return '<button class="conv' + (c.id === S.active ? ' on' : '') + '" data-conv="' + c.id + '">' + esc(c.title) + '</button>'; }).join('') : '<span class="muted" style="font-size:12px;padding:0 8px">아직 대화가 없어요</span>');
  }
  function viewAssistant() {
    return '<div class="asst"><aside class="asst-list"><button class="btn primary" data-act="newchat" style="justify-content:center">+ 새 대화</button><div id="conv-list">' + convList() + '</div></aside>'
      + '<section class="asst-main"><div class="thread" id="thread" aria-live="polite"></div><div class="asst-input">' + composerHtml('asst-q', '진행할 업무를 문장으로 적어 주세요') + '</div></section><aside class="ctx" id="ctx"></aside></div>';
  }

  /* ---------- 플로팅 AI ---------- */
  var miniOpen = false;
  function renderFab(cur) {
    var f = $('#fab');
    if (cur === 'assistant') { f.innerHTML = ''; return; }
    f.innerHTML = (S.nudge && !miniOpen && cur === 'home' ? '<div class="nudge"><span>도면 수정본에 반려 사유가 남아 있어요. <a href="#check">지금 볼까요?</a></span><button data-act="nudge-x" aria-label="닫기">' + ic('x', ' width="14" height="14"') + '</button></div>' : '')
      + '<button class="fab-btn" data-act="mini">' + ic(miniOpen ? 'x' : 'spark') + '<span>' + (miniOpen ? '닫기' : 'AI 어시스턴트') + '</span></button>';
    var m = $('#mini');
    m.hidden = !miniOpen;
    if (miniOpen) { m.innerHTML = '<div class="mini-h"><b>AI 어시스턴트 <span class="tag">BETA</span></b><a class="link-row" href="#assistant">크게 보기 →</a></div><div class="thread" id="mini-thread"></div><div class="asst-input">' + composerHtml('mini-q', '무엇이든 물어보세요') + '</div>'; paintThreads(); }
  }

  /* ---------- 근거 드로어 ---------- */
  function openSrc(src) {
    var h, c = src.chunk && chunk(src.chunk);
    if (c) {
      var d = docOf(c.doc);
      h = '<div class="drawer-h"><div><div class="row">' + (c.ds === 'dwg' ? '<span class="pill info">도면</span>' : '<span class="pill acc">COEX 웹</span>') + valPill(c.status) + '</div><h2 style="font-size:17px;margin-top:8px">' + esc(d ? d.title : c.doc) + '</h2><div class="muted" style="font-size:13px">' + esc(c.sec) + '</div></div><button class="icon-btn" data-act="close" aria-label="닫기">' + ic('x') + '</button></div>'
        + '<div class="drawer-b"><div class="quote">' + hl(c.text) + '</div>' + (c.img ? '<div class="drawing" style="max-height:300px"><img src="' + c.img + '" alt="도면 원본"></div>' : '')
        + '<dl class="meta-grid"><dt>청크 ID</dt><dd class="mono">' + esc(c.id) + '</dd><dt>시설</dt><dd>' + esc(c.facility || '—') + '</dd><dt>출처</dt><dd>' + (c.url ? '<a href="' + esc(c.url) + '" target="_blank" rel="noopener">' + esc(c.url) + '</a>' : esc(c.file) + (c.page ? ' p.' + c.page : '')) + '</dd>' + (c.year ? '<dt>도면 연도</dt><dd>' + c.year + '</dd>' : '') + '<dt>검증 단계</dt><dd>' + esc(c.status) + '</dd></dl>'
        + (c.ds === 'dwg' ? '<a class="btn" href="#halls" data-hallgo="' + (c.facility || '').replace('Hall ', '').toLowerCase().replace('the platz', 'p') + '">홀·도면에서 보기 →</a>' : '') + '</div>';
    } else {
      h = '<div class="drawer-h"><div><span class="pill">외부 문서</span><h2 style="font-size:17px;margin-top:8px">' + esc(src.label) + '</h2></div><button class="icon-btn" data-act="close" aria-label="닫기">' + ic('x') + '</button></div><div class="drawer-b"><div class="quote">이 근거는 코엑스 이용안내서·주최사 매뉴얼 원문 PDF의 해당 쪽을 가리켜요. 데모에서는 원문 PDF를 연결하지 않았어요. 실제 서비스에서는 이 버튼을 누르면 해당 쪽이 바로 열려요.</div><p class="muted" style="font-size:12.5px;margin:0">파란 태그는 AISAP이 정제한 COEX 데이터셋 원문으로 바로 열려요.</p></div>';
    }
    $('#drawer').innerHTML = h; $('#drawer').hidden = false; $('#scrim').hidden = false;
  }
  function openDoc(id) {
    var d = docOf(id), cs = CH.filter(function (c) { return c.doc === id; });
    $('#drawer').innerHTML = '<div class="drawer-h"><div><div class="row">' + (d.ds === 'dwg' ? '<span class="pill info">도면</span>' : '<span class="pill acc">COEX 웹</span>') + valPill(d.ds === 'dwg' ? 'vision_extracted_needs_review' : d.status) + '</div><h2 style="font-size:17px;margin-top:8px">' + esc(d.title) + '</h2><div class="muted" style="font-size:12.5px">' + esc(d.type) + ' · 수집 ' + d.date + ' · 청크 ' + cs.length + '</div></div><button class="icon-btn" data-act="close" aria-label="닫기">' + ic('x') + '</button></div>'
      + '<div class="drawer-b">' + (d.img ? '<div class="drawing" style="max-height:280px"><img src="' + d.img + '" alt=""></div>' : '') + cs.map(function (c) { return '<div class="chunk"><div class="row"><b style="font-size:13px">' + esc(c.sec) + '</b><span class="mono muted" style="font-size:10.5px">' + esc(c.id.split('#')[1]) + '</span></div><p>' + hl(c.text) + '</p></div>'; }).join('')
      + (d.url ? '<p class="muted" style="font-size:12px;margin:0;word-break:break-all">출처 · ' + (d.url.indexOf('http') === 0 ? '<a href="' + esc(d.url) + '" target="_blank" rel="noopener">' + esc(d.url) + '</a>' : esc(d.url)) + '</p>' : '') + '</div>';
    $('#drawer').hidden = false; $('#scrim').hidden = false;
  }
  function closeDrawer() { $('#drawer').hidden = true; $('#scrim').hidden = true; var m = $('#modal'); if (m) m.hidden = true; }

  /* ================= 주최사 · 운영사 콘솔 ================= */
  function allInq() { return D.inquiries.concat(S.sent || []); }
  var inqSel = null, opTab = 'op', opSel = {};
  function soft() { var y = window.scrollY; render(true); window.scrollTo(0, y); }
  function exDocs(e) {
    if (!e.live) return e.docs;
    var req = D.submissions.filter(function (s) { return s.req === 'required'; });
    return [req.filter(function (s) { return S.sub[s.id] === 'approved' || S.sub[s.id] === 'submitted'; }).length, req.length];
  }
  function exRejected(e) { return e.live ? reqAll().filter(function (r) { return r.co === e.co && reqState(r).stage === 'rejected'; }).length : (e.rej || 0); }
  function pctBar(a, b) { var p = b ? a / b : 0; return '<div class="row" style="flex-wrap:nowrap;gap:8px"><div class="bar-track" style="flex:1;min-width:60px"><div class="bar-fill" style="width:' + Math.round(p * 100) + '%;' + (p < .5 ? 'background:var(--warn)' : '') + '"></div></div><span class="tnum muted" style="font-size:12px">' + a + '/' + b + '</span></div>'; }
  function stagePill(st) {
    return { org: '<span class="pill info">주최사 검토</span>', op: '<span class="pill warn">운영사 승인 대기</span>', approved: '<span class="pill ok">승인</span>', rejected: '<span class="pill bad">반려</span>' }[st.stage] || '';
  }
  function briefing(items) {
    return '<div class="card"><div class="card-h"><h2>AI 브리핑</h2><span class="tag">AI</span></div><div class="card-b" style="display:flex;flex-direction:column;gap:10px">'
      + items.map(function (x) { return '<div class="verdict' + (x.need ? ' need' : '') + '">' + ic(x.i || 'alert', ' width="18" height="18" style="color:' + (x.need ? 'var(--bad)' : 'var(--accent)') + ';flex:none;margin-top:2px"') + '<div style="flex:1;min-width:0"><b>' + x.t + '</b><div class="t-desc">' + x.d + '</div>' + (x.src ? '<div style="margin-top:6px">' + cite(x.src) + '</div>' : '') + (x.go ? '<div style="margin-top:8px"><a class="btn sm" href="#' + x.go + '">' + x.btn + '</a></div>' : '') + '</div></div>'; }).join('') + '</div></div>';
  }
  function reqCard(r, actor) {
    var st = reqState(r), canAct = (actor === 'org' && st.stage === 'org') || (actor === 'op' && (st.stage === 'op' || st.stage === 'org'));
    return '<div class="card"><div class="card-b" style="display:flex;flex-direction:column;gap:10px"><div class="row" style="justify-content:space-between;align-items:flex-start;flex-wrap:nowrap"><div style="min-width:0">'
      + '<div class="row">' + (actor === 'op' && canAct ? '<input type="checkbox" data-rqsel="' + r.id + '" aria-label="선택"' + (opSel[r.id] ? ' checked' : '') + '>' : '') + '<span class="pill">' + esc(r.type) + '</span><span class="role-pill ' + (r.from === 'org' ? 'org' : 'ex') + '" style="font-size:11px;padding:1px 8px">' + (r.from === 'org' ? '주최사' : '참가사') + '</span>' + stagePill(st) + (r.flag ? '<span class="pill bad">AI · ' + esc(r.flag) + '</span>' : '') + '</div>'
      + '<div class="t-title" style="margin-top:6px">' + esc(r.title) + '</div><div class="t-desc">' + esc(r.co) + ' · 부스 ' + esc(r.booth) + ' · ' + esc(r.file) + ' · 제출 ' + r.at + '</div></div>'
      + '<div style="text-align:right;flex:none"><div class="tnum" style="font-size:12px">마감 ' + md(r.due) + '</div>' + ddayHtml(r.due, st.stage === 'approved') + '</div></div>'
      + '<div class="row" style="justify-content:space-between">' + chainHtml(st) + '<span>' + cite(r.src) + '</span></div>'
      + (st.stage === 'rejected' && st.reason ? '<div class="reject"><b>반려 사유 · ' + (st.by === 'op' ? '운영사' : '주최사') + '</b> ' + esc(st.reason) + '</div>' : '')
      + (canAct ? '<div class="row" style="justify-content:flex-end"><button class="btn sm" data-rqno="' + r.id + '">반려</button><button class="btn sm primary" data-rqok="' + r.id + '">' + (actor === 'org' ? '검토 통과 · 운영사로' : st.stage === 'org' ? '직권 승인' : '승인') + '</button></div>' : '')
      + '</div></div>';
  }
  function decide(id, ok, reason) {
    var r = reqAll().filter(function (x) { return x.id === id; })[0], st = reqState(r), me = S.role === 'organizer' ? 'org' : 'op';
    if (ok) S.req[id] = { stage: me === 'org' ? 'op' : 'approved', by: me };
    else S.req[id] = { stage: 'rejected', by: me, reason: reason };
    logPush((ok ? (me === 'org' ? '1차 검토 통과 → 운영사 · ' : '승인 · ') : '반려 · ') + r.co + ' · ' + r.title);
    delete opSel[id];
    save();
  }

  /* ----- 모달 ----- */
  function openModal(html) { var m = $('#modal'); if (!m) { m = document.createElement('div'); m.id = 'modal'; m.className = 'modal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); document.body.appendChild(m); } m.innerHTML = html; m.hidden = false; $('#scrim').hidden = false; var f = m.querySelector('textarea,select,input'); if (f) f.focus(); }
  function closeModal() { var m = $('#modal'); if (m) m.hidden = true; }
  function rejectModal(id) {
    var r = reqAll().filter(function (x) { return x.id === id; })[0];
    openModal('<div class="modal-h"><div><span class="pill bad">반려</span><h2 style="font-size:17px;margin-top:8px">' + esc(r.title) + '</h2><div class="muted" style="font-size:12.5px">' + esc(r.co) + ' · ' + esc(r.file) + '</div></div><button class="icon-btn" data-act="mclose" aria-label="닫기">' + ic('x') + '</button></div>'
      + '<div class="modal-b"><div class="field"><label for="rj-text">반려 사유 <span class="tag">AI 초안</span></label><textarea id="rj-text" rows="5">' + esc(D.rejectDrafts[r.type] || '보완이 필요합니다. 확인 후 다시 제출해 주세요.') + '</textarea></div>'
      + '<div class="verdict"><span class="ck warn">!</span><div style="flex:1;min-width:0"><b>근거</b><div class="t-desc">반려 사유와 함께 아래 근거가 ' + (r.from === 'org' ? '주최사' : '참가사') + '에게 전달돼요.</div><div style="margin-top:6px">' + cite(r.src) + '</div></div></div></div>'
      + '<div class="modal-f"><button class="btn" data-act="mclose">취소</button><button class="btn primary" data-rjgo="' + id + '" style="background:var(--bad);border-color:var(--bad)">반려 보내기</button></div>');
  }
  function inquiryModal() {
    openModal('<div class="modal-h"><div><span class="role-pill org">주최사에 문의</span><h2 style="font-size:17px;margin-top:8px">사무국에 질문 보내기</h2><div class="muted" style="font-size:12.5px">주최사 문의함에 바로 들어가요. 답변이 오면 알림으로 알려드려요.</div></div><button class="icon-btn" data-act="mclose" aria-label="닫기">' + ic('x') + '</button></div>'
      + '<div class="modal-b"><div class="field"><label for="iq-text">문의 내용</label><textarea id="iq-text" rows="4" placeholder="예) 부스 안에서 시연용 지게차를 써도 되나요?"></textarea></div></div>'
      + '<div class="modal-f"><button class="btn" data-act="mclose">취소</button><button class="btn primary" data-act="iqsend">보내기</button></div>');
  }
  function assignModal(id) {
    var opts = D.exhibitorsList.map(function (e) { return '<option>' + esc(e.co) + '</option>'; }).join('') + '<option>신규 참가사(대기)</option>';
    openModal('<div class="modal-h"><div><span class="pill ok">공실</span><h2 style="font-size:17px;margin-top:8px">' + id + ' 부스 배정</h2><div class="muted" style="font-size:12.5px">3 × 3m · 배정하면 홀 맵에 바로 입실로 표시돼요.</div></div><button class="icon-btn" data-act="mclose" aria-label="닫기">' + ic('x') + '</button></div>'
      + '<div class="modal-b"><div class="field"><label for="as-co">참가사</label><select id="as-co">' + opts + '</select></div></div>'
      + '<div class="modal-f"><button class="btn" data-act="mclose">취소</button><button class="btn primary" data-asgo="' + id + '">배정하기</button></div>');
  }
  function relayModal() {
    var types = ['기술지원 취합', '반입 계획', '광고시설물', '부대시설 대관'];
    openModal('<div class="modal-h"><div><span class="role-pill org">운영사에 신청</span><h2 style="font-size:17px;margin-top:8px">새 신청 올리기</h2><div class="muted" style="font-size:12.5px">운영사 통합 승인함으로 바로 들어가요.</div></div><button class="icon-btn" data-act="mclose" aria-label="닫기">' + ic('x') + '</button></div>'
      + '<div class="modal-b"><div class="field"><label for="rl-type">구분</label><select id="rl-type">' + types.map(function (t) { return '<option>' + t + '</option>'; }).join('') + '</select></div><div class="field"><label for="rl-title">신청 내용</label><input id="rl-title" value="기술지원 신청 취합본 (2차)"></div></div>'
      + '<div class="modal-f"><button class="btn" data-act="mclose">취소</button><button class="btn primary" data-act="rlsend">신청 올리기</button></div>');
  }

  /* ----- 주최사 ----- */
  function viewOrgHome() {
    var e = D.exhibitions.approved, L = D.exhibitorsList, late = L.filter(function (x) { return x.late; });
    var newInq = allInq().filter(function (q) { return inqSt(q) === 'new'; }).length, mine = reqAll().filter(function (r) { return r.from === 'org'; });
    var h = '<section class="hero"><h1>' + esc(D.roles.organizer.name) + '님, 개막까지 ' + days(e.open) + '일 남았어요.<br>참가사 ' + L.length + '곳 중 무엇부터 챙길까요?</h1>' + composerHtml('home-q', '참가사 문의나 규정을 물어보세요 · 예) 천장 배너 하중 기준은?') + '</section>';
    h += '<section class="grid g-4">' + kpi('#org-exhibitors', '참가사', L.length, '곳', '독려 필요 ' + late.length + '곳', null)
      + kpi('#org-review', '서류 1차 검토', reqCount('org'), '건 대기', 'AI 의심 표시 1건', null, true)
      + kpi('#org-inbox', '새 문의', newInq, '건', 'AI 답변 초안 준비됨', null, true)
      + kpi('#org-relay', '운영사 승인 대기', mine.filter(function (r) { return reqState(r).stage === 'op'; }).length, '/ ' + mine.length + '건', '주최사가 올린 신청', null) + '</section>';
    h += '<section class="grid g-main"><div class="card"><div class="card-h"><h2>전시 준비 단계별 현황</h2><span class="muted" style="font-size:12px">참가사 ' + L.length + '곳 기준</span></div><div class="card-b stage-bars">'
      + D.orgStages.map(function (s) { var p = s.done / s.total; return '<div class="sb"><span style="min-width:0">' + esc(s.n) + '<br><span class="muted tnum" style="font-size:11.5px">마감 ' + s.due + '</span></span><div class="bar-track"><div class="bar-fill" style="width:' + Math.round(p * 100) + '%;' + (p < .5 ? 'background:var(--warn)' : '') + '"></div></div><span class="tnum" style="text-align:right">' + s.done + '/' + s.total + '</span></div>'; }).join('') + '</div></div>'
      + briefing([
        { need: true, t: '천장 배너 신청 1건이 기준 하중을 넘어요', d: '케이드라이브 로고 배너 2개 · 각 180kg. Hall C 1Point 적정 인양하중은 150kg이에요.', src: { chunk: 'coex-dwg-hall-c-ceiling-2024#01-rigging' }, go: 'org-review', btn: '검토하러 가기' },
        { t: '도면 마감(11.06)까지 6곳이 미제출이에요', d: '그린팩토리·도담테크는 서류 진행률이 30% 아래예요. 독려 알림을 보내 보세요.', i: 'bell', go: 'org-exhibitors', btn: '참가사 현황' },
        { t: '새 문의 ' + newInq + '건 중 3건은 근거 문서로 바로 답할 수 있어요', d: '화물출입구 크기, 천장 배너 하중, 커피머신 급배수', i: 'chat', go: 'org-inbox', btn: '문의 관리' }
      ]) + '</section>';
    return h;
  }
  function viewOrgExhibitors() {
    var h = '<div class="page-h"><div><h1>참가사 현황</h1><p>참가사별 서류 진행률과 반려·문의를 한눈에 봐요. ㈜한빛로보틱스는 참가사 화면의 실제 상태가 반영돼요.</p></div><button class="btn" data-act="nudgeall">' + ic('bell') + '지연 참가사 일괄 독려</button></div>';
    h += '<div class="card"><div class="table-wrap"><table class="stack"><thead><tr><th>참가사</th><th>부스</th><th>담당</th><th>필수 서류</th><th>반려</th><th>문의</th><th>상태</th><th></th></tr></thead><tbody>'
      + D.exhibitorsList.map(function (e) {
        var d = exDocs(e), rj = exRejected(e), st = e.late ? '<span class="pill bad">지연</span>' : rj ? '<span class="pill warn">보완 중</span>' : d[0] === d[1] ? '<span class="pill ok">완료</span>' : '<span class="pill">진행 중</span>';
        return '<tr><td><div class="t-title">' + esc(e.co) + (e.live ? ' <span class="pill acc">실시간</span>' : '') + '</div></td><td data-l="부스" class="tnum">' + esc(e.booth) + ' · ' + e.size + '㎡</td><td data-l="담당">' + esc(e.mgr) + '</td><td data-l="서류" style="min-width:140px">' + pctBar(d[0], d[1]) + '</td><td data-l="반려" class="tnum">' + (rj || '—') + '</td><td data-l="문의" class="tnum">' + (e.inq || '—') + '</td><td data-l="상태">' + st + '</td><td>' + (d[0] < d[1] ? '<button class="btn sm" data-nudge="' + esc(e.co) + '">독려</button>' : '') + '</td></tr>';
      }).join('') + '</tbody></table></div></div>';
    return h;
  }
  function viewOrgReview() {
    var q = reqAll().filter(function (r) { return r.from === 'ex' && reqState(r).stage === 'org'; }), done = reqAll().filter(function (r) { return r.from === 'ex' && reqState(r).stage !== 'org'; });
    var h = '<div class="page-h"><div><h1>서류 1차 검토</h1><p>참가사가 낸 서류를 근거 문서와 대조해 운영사로 넘기거나 반려해요. 반려 사유는 AI가 근거와 함께 초안을 써 둬요.</p></div></div>';
    h += '<h2 style="font-size:15px">검토 대기 ' + q.length + '건</h2>' + (q.length ? q.map(function (r) { return reqCard(r, 'org'); }).join('') : '<div class="card"><div class="empty">검토할 서류가 없어요.</div></div>');
    h += '<h2 style="font-size:15px;margin-top:8px">처리한 서류</h2>' + done.map(function (r) { return reqCard(r, 'org'); }).join('');
    return h;
  }
  function viewOrgInbox() {
    var L = allInq().slice().sort(function (a, b) { return (inqSt(a) === 'new' ? 0 : 1) - (inqSt(b) === 'new' ? 0 : 1); });
    if (!inqSel || !L.filter(function (q) { return q.id === inqSel; }).length) inqSel = L[0].id;
    var q = L.filter(function (x) { return x.id === inqSel; })[0], st = inqSt(q);
    var stp = function (s) { return { new: '<span class="pill bad">새 문의</span>', answered: '<span class="pill ok">답변 완료</span>', escalated: '<span class="pill warn">운영사 이관</span>' }[s]; };
    var res = answer(q.ask), draft = (S.inq[q.id] || {}).reply || q.draft || (res.html || '').replace(/<[^>]+>/g, '').replace(/\[\d\]/g, '').replace(/\s+/g, ' ').trim();
    var h = '<div class="page-h"><div><h1>문의 관리</h1><p>참가사 문의에 AI가 근거 문서로 답변 초안을 써 둬요. 확인하고 보내거나, 시설 문제는 운영사로 넘겨요.</p></div></div>';
    h += '<div class="inbox"><div class="card" style="overflow:hidden;align-self:start">' + L.map(function (x) { return '<button class="inq' + (x.id === inqSel ? ' on' : '') + '" data-inq="' + x.id + '"><span class="top"><span>' + esc(x.co) + ' · ' + esc(x.who) + '</span><span class="tnum">' + x.at + '</span></span><span style="font-size:13.5px;font-weight:' + (inqSt(x) === 'new' ? 700 : 400) + '">' + esc(x.q) + '</span><span>' + stp(inqSt(x)) + '</span></button>'; }).join('') + '</div>';
    h += '<div class="card"><div class="card-h"><h2>' + esc(q.co) + ' · ' + esc(q.who) + '</h2>' + stp(st) + '</div><div class="card-b" style="display:flex;flex-direction:column;gap:14px"><div class="msg-u" style="align-self:flex-start;max-width:100%">' + esc(q.q) + '</div>'
      + '<div class="msg-a" style="max-width:100%">' + (res.steps ? '<div class="muted" style="font-size:12px">AI가 ' + res.steps.length + '가지 업무를 진행했어요 · ' + esc(res.steps.map(function (s) { return s[0]; }).join(' → ')) + '</div>' : '') + (res.hold ? '<div class="hold">' + ic('alert', ' width="16" height="16" style="flex:none;margin-top:2px"') + '<span><b>확정 보류</b> · ' + esc(res.hold) + ' 운영사 이관을 권해요.</span></div>' : '') + '</div>'
      + '<div class="field"><label for="inq-reply">답변 <span class="tag">AI 초안</span></label><textarea id="inq-reply" rows="6"' + (st !== 'new' ? ' readonly' : '') + '>' + esc(draft) + '</textarea></div>'
      + (res.cites && res.cites.length ? '<div class="row"><span class="muted" style="font-size:12px">함께 보낼 근거</span>' + res.cites.map(function (c, i) { return cite(c, String(i + 1)); }).join('') + '</div>' : '')
      + (st === 'new' ? '<div class="row" style="justify-content:flex-end"><button class="btn" data-inqesc="' + q.id + '">운영사로 이관</button><button class="btn primary" data-inqok="' + q.id + '">' + ic('send') + '답변 보내기</button></div>' : '<p class="muted" style="margin:0;font-size:12.5px">' + (st === 'answered' ? '참가사에게 답변을 보냈어요.' : '운영사 현장 이슈로 넘겼어요. 운영사 화면에서 처리돼요.') + '</p>')
      + '</div></div></div>';
    return h;
  }
  function viewOrgMap() {
    var h = '<div class="page-h"><div><h1>부스 배정 맵</h1><p>Hall C 입실·공실 현황이에요. 공실을 누르면 참가사를 배정할 수 있어요.</p></div></div>';
    return h + '<div data-hallkey="c">' + mapBlock('c', { selAct: function (b) { return b.st === 'vacant' ? '<button class="btn sm" data-assign="' + b.id + '">참가사 배정</button>' : b.assigned ? '<button class="btn sm" data-unassign="' + b.id + '">배정 취소</button>' : ''; } }) + '</div>';
  }
  function viewOrgRelay() {
    var L = reqAll().filter(function (r) { return r.from === 'org'; });
    var h = '<div class="page-h"><div><h1>운영사 제출 현황</h1><p>주최사가 운영사에 올린 신청과 승인 상태예요.</p></div><button class="btn primary" data-act="relay">' + ic('send') + '운영사에 새 신청</button></div>';
    return h + L.map(function (r) { return reqCard(r, 'view'); }).join('');
  }

  /* ----- 운영사 ----- */
  function gantt(compact) {
    var start = new Date('2026-11-01T00:00:00'), N = 61, pos = function (d) { return (new Date(d + 'T00:00:00') - start) / 864e5 / N * 100; };
    var h = '<div class="gantt"><div class="gh">홀</div><div class="gh row" style="justify-content:space-between"><span>11월</span><span>12월</span><span>12.31</span></div>';
    D.venueSchedule.forEach(function (row) {
      h += '<div class="gl">' + row.hall + '</div><div class="gr">' + row.items.map(function (it) {
        var sd = new Date(new Date(it.s + 'T00:00:00') - it.setup * 864e5), sIso = sd.getFullYear() + '-' + String(sd.getMonth() + 1).padStart(2, '0') + '-' + String(sd.getDate()).padStart(2, '0');
        var a = pos(sIso), b = pos(it.s), c = pos(it.e) + 100 / N;
        return '<div class="bar setup" style="left:' + a + '%;width:' + (b - a) + '%" title="설치 ' + it.setup + '일"></div><div class="bar' + (it.ours ? ' ours' : '') + '" style="left:' + b + '%;width:' + (c - b) + '%" title="' + esc(it.n) + ' ' + md(it.s) + '~' + md(it.e) + '">' + (compact ? '' : esc(it.n)) + '</div>';
      }).join('') + '<div class="today-line" style="left:' + pos(D.today) + '%" title="오늘 11.05"></div></div>';
    });
    return h + '</div><div class="legend-row" style="margin-top:8px"><span><i style="background:var(--warn-weak)"></i>설치</span><span><i style="background:var(--accent-weak)"></i>전시</span><span><i style="background:var(--accent)"></i>스마트제조 엑스포</span><span><i style="background:var(--bad)"></i>오늘</span></div>';
  }
  function viewOpHome() {
    var iss = D.issues.filter(function (i) { return issueSt(i) !== 'done'; }), esc2 = allInq().filter(function (q) { return inqSt(q) === 'escalated'; }).length;
    var h = '<section class="hero"><h1>' + esc(D.roles.operator.name) + '님, 오늘 처리할 승인 ' + reqCount('op') + '건과<br>현장 이슈 ' + iss.length + '건이 있어요.</h1>' + composerHtml('home-q', '시설 규정이나 도면 값을 물어보세요 · 예) Hall C 화물출입구 크기는?') + '</section>';
    h += '<section class="grid g-4">' + kpi('#op-approvals', '운영사 승인 대기', reqCount('op'), '건', '참가사·주최사 신청', null)
      + kpi('#op-approvals', '주최사 검토 중', reqCount('org'), '건', '직권 처리 가능', null)
      + kpi('#op-issues', '현장 이슈', iss.length, '건 진행', '긴급 ' + iss.filter(function (i) { return i.lvl === 'high'; }).length + ' · 이관 문의 ' + esc2, null)
      + kpi('#op-schedule', '11~12월 행사', D.venueSchedule.reduce(function (n, r) { return n + r.items.length; }, 0), '건', '5개 홀 · 오늘 기준', null) + '</section>';
    h += '<section class="card"><div class="card-h"><h2>전시장 일정</h2><a class="link-row" href="#op-schedule">크게 보기 →</a></div><div class="card-b">' + gantt(true) + '</div></section>';
    h += '<section class="grid g-main">' + briefing([
      { need: true, t: '위험물(LPG) 반입 허가 1건이 승인 대기예요', d: '알파모션 · C-118 시연용. 코엑스 승인 물품 여부와 안전관리 계획 확인이 필요해요.', src: { label: '이용안내서 p.57' }, go: 'op-approvals', btn: '승인함 열기' },
      { need: true, t: 'Hall B 급배수 누수 · 담당 미배정', d: '푸드테크 쇼(데모) B-214 · 10:40 접수', i: 'alert', go: 'op-issues', btn: '이슈 배정' },
      { t: '주최사 검토 단계에 하중 초과 의심 신청이 있어요', d: '케이드라이브 천장 배너 180kg > 1Point 150kg. 운영사가 직권으로 반려할 수 있어요.', src: { chunk: 'coex-dwg-hall-c-ceiling-2024#01-rigging' } }
    ]) + '<div class="card"><div class="card-h"><h2>최근 처리 이력</h2><a class="link-row" href="#op-log">전체 →</a></div><div class="card-b tl">' + logRows().slice(0, 6).map(function (l) { return '<div><i>✓</i><span><b class="tnum">' + l.at + '</b> · ' + esc(l.who) + ' · ' + esc(l.text) + '</span></div>'; }).join('') + '</div></div></section>';
    return h;
  }
  function viewOpApprovals() {
    var all = reqAll(), tabs = [['op', '승인 대기'], ['org', '주최사 검토 중'], ['done', '처리 완료']];
    var cnt = { op: reqCount('op'), org: reqCount('org'), done: all.filter(function (r) { var s = reqState(r).stage; return s === 'approved' || s === 'rejected'; }).length };
    var L = all.filter(function (r) { var s = reqState(r).stage; return opTab === 'done' ? (s === 'approved' || s === 'rejected') : s === opTab; });
    var nsel = Object.keys(opSel).filter(function (k) { return opSel[k]; }).length;
    var h = '<div class="page-h"><div><h1>통합 승인함</h1><p>참가사와 주최사가 올린 모든 신청을 최종 승인하거나 반려해요. 주최사 검토 중인 건도 직권으로 처리할 수 있어요.</p></div>' + (opTab !== 'done' ? '<button class="btn primary" data-act="batchok"' + (nsel ? '' : ' disabled') + '>' + ic('check') + '선택 ' + nsel + '건 일괄 승인</button>' : '') + '</div>';
    h += '<div class="filters">' + tabs.map(function (t) { return '<button data-optab="' + t[0] + '" class="' + (opTab === t[0] ? 'on' : '') + '">' + t[1] + '<em class="tnum">' + cnt[t[0]] + '</em></button>'; }).join('') + '</div>';
    return h + (L.length ? L.map(function (r) { return reqCard(r, opTab === 'done' ? 'view' : 'op'); }).join('') : '<div class="card"><div class="empty">해당하는 신청이 없어요.</div></div>');
  }
  function viewOpSchedule() {
    return '<div class="page-h"><div><h1>전시장 일정</h1><p>2026년 11~12월 홀별 행사와 설치 기간이에요. 행사명은 스마트제조 엑스포를 빼고 모두 가상이에요.</p></div></div><div class="card"><div class="card-b table-wrap">' + gantt(false) + '</div></div>';
  }
  function viewOpMap() {
    if (!hallSel || !HallMap.HALLS[hallSel]) hallSel = 'c';
    var h = '<div class="page-h"><div><h1>홀 맵</h1><p>홀별 입실·공실과 동선을 봐요. 화물출입구·편의시설까지 길찾기를 할 수 있어요.</p></div><div class="hall-tabs" role="tablist">'
      + ['a', 'b', 'c', 'd'].map(function (k) { return '<button role="tab" aria-selected="' + (k === hallSel) + '" data-hall="' + k + '" class="' + (k === hallSel ? 'on' : '') + '">' + HALLS[k].name + '</button>'; }).join('') + '</div></div>';
    return h + '<div data-hallkey="' + hallSel + '">' + mapBlock(hallSel) + '</div>';
  }
  var TEAMS = ['홀매니저실', '전기 협력업체', '설비(급배수) 협력업체', '보안·안전팀', '통신 협력업체'];
  function viewOpIssues() {
    var lv = { high: '<span class="pill bad">긴급</span>', mid: '<span class="pill warn">보통</span>', low: '<span class="pill">낮음</span>' };
    var sp = { new: '<span class="pill bad">미배정</span>', assigned: '<span class="pill info">처리 중</span>', done: '<span class="pill ok">완료</span>' };
    var h = '<div class="page-h"><div><h1>현장 이슈</h1><p>홀별 현장 문제와 주최사가 넘긴 문의를 담당 팀에 배정하고 닫아요.</p></div></div>';
    h += '<div class="card"><div class="table-wrap"><table class="stack"><thead><tr><th>이슈</th><th>홀</th><th>등급</th><th>담당</th><th>상태</th><th></th></tr></thead><tbody>'
      + D.issues.map(function (i) { var st = issueSt(i), team = (S.iss[i.id] || {}).team || i.team; return '<tr><td><div class="t-title">' + esc(i.title) + '</div><div class="t-desc">' + esc(i.ex) + ' · ' + i.at + '</div></td><td data-l="홀">' + i.hall + '</td><td data-l="등급">' + lv[i.lvl] + '</td><td data-l="담당"><label class="sr" for="tm-' + i.id + '">담당 팀</label><select id="tm-' + i.id + '" data-issteam="' + i.id + '"' + (st === 'done' ? ' disabled' : '') + '><option value="">선택</option>' + TEAMS.concat(team && TEAMS.indexOf(team) < 0 ? [team] : []).map(function (t) { return '<option' + (t === team ? ' selected' : '') + '>' + t + '</option>'; }).join('') + '</select></td><td data-l="상태">' + sp[st] + '</td><td>' + (st !== 'done' ? '<button class="btn sm" data-issdone="' + i.id + '">완료 처리</button>' : '') + '</td></tr>'; }).join('') + '</tbody></table></div></div>';
    var esq = allInq().filter(function (q) { return inqSt(q) === 'escalated'; });
    h += '<div class="card"><div class="card-h"><h2>주최사가 넘긴 문의</h2><span class="muted" style="font-size:12px">' + esq.length + '건</span></div><div class="card-b" style="display:flex;flex-direction:column;gap:10px">'
      + (esq.length ? esq.map(function (q) { var res = answer(q.ask); return '<div class="verdict"><span class="ck warn">!</span><div style="flex:1;min-width:0"><b>' + esc(q.q) + '</b><div class="t-desc">' + esc(q.co) + ' · ' + q.at + '</div>' + (res.cites && res.cites.length ? '<div class="row" style="margin-top:6px">' + res.cites.map(function (c, k) { return cite(c, String(k + 1)); }).join('') + '</div>' : '<div class="t-desc" style="margin-top:4px">근거 문서 없음 · 운영사 판단 필요</div>') + '</div><button class="btn sm" data-inqdone="' + q.id + '">답변 완료</button></div>'; }).join('') : '<div class="empty">넘어온 문의가 없어요.</div>') + '</div></div>';
    return h;
  }
  var LOG_SEED = [{ at: '11.04 17:40', who: '운영사', text: '승인 · ㈜한빛로보틱스 · 참가업체 디렉토리 정보' }, { at: '11.04 16:05', who: '주최사', text: '반려 · ㈜한빛로보틱스 · 부스 디자인 도면 (Lay-out)' }, { at: '11.04 11:20', who: '운영사', text: '배정 · Hall A 화물출입구 2 반입 지연 → 홀매니저실' }];
  function logRows() { return (S.log || []).concat(LOG_SEED); }
  function viewOpLog() {
    return '<div class="page-h"><div><h1>처리 이력</h1><p>세 역할이 승인·반려·배정한 기록이에요. 이 브라우저 안에서만 남아요.</p></div></div><div class="card"><div class="table-wrap"><table class="stack"><thead><tr><th>시각</th><th>처리자</th><th>내용</th></tr></thead><tbody>'
      + logRows().map(function (l) { return '<tr><td data-l="시각" class="tnum">' + l.at + '</td><td data-l="처리자"><span class="role-pill ' + (l.who === '운영사' ? 'op' : l.who === '주최사' ? 'org' : 'ex') + '">' + esc(l.who) + '</span></td><td data-l="내용">' + esc(l.text) + '</td></tr>'; }).join('') + '</tbody></table></div></div>';
  }

  /* ---------- 이벤트 ---------- */
  document.addEventListener('click', function (ev) {
    var t = ev.target.closest('button,a,[data-src],sup.n,[data-booth],[data-poi]'); if (!t) return;
    var ds = t.dataset;
    if (ds.src) { ev.preventDefault(); openSrc(JSON.parse(ds.src)); return; }
    if (ds.ci) { var p = ds.ci.split(':'), ch = activeChat(); if (ch && ch.msgs[p[0]] && ch.msgs[p[0]].res.cites[p[1]]) openSrc(ch.msgs[p[0]].res.cites[p[1]]); return; }
    if (ds.mode) { S.mode = ds.mode; hallSel = null; save(); location.hash = ds.mode === 'pre' ? 'apply' : 'home'; render(); return; }
    if (ds.flow) { homeFlow = +ds.flow; render(); return; }
    if (ds.go) { ev.preventDefault(); go(ds.go); return; }
    if (ds.q) { ev.preventDefault(); var r = route(); if (r !== 'assistant' && !miniOpen && !NAV_FOLLOW[ds.q]) { S.active = null; go('assistant'); setTimeout(function () { ask(ds.q, { fresh: true }); }, 30); } else ask(ds.q); return; }
    if (ds.send) { var ta = $('#' + ds.send), v = ta.value; ta.value = ''; if (!v.trim()) return; if (ds.send === 'home-q') { S.active = null; go('assistant'); setTimeout(function () { ask(v, { fresh: true }); }, 30); } else ask(v); return; }
    if (ds.steps) { var el = $('#st-' + ds.steps, t.parentNode.parentNode) || t.nextElementSibling; var open = t.getAttribute('aria-expanded') === 'true'; t.setAttribute('aria-expanded', String(!open)); t.nextElementSibling.hidden = open; return; }
    if (ds.conv) { S.active = ds.conv; save(); paintThreads(); return; }
    if (ds.sf) { schedFilter = ds.sf; render(); return; }
    if (ds.subf) { subFilter = ds.subf; render(); return; }
    if (ds.lf) { libFilter = ds.lf; render(); return; }
    if (ds.chk) { checkSel = ds.chk; render(); return; }
    if (ds.precheck) { checkSel = ds.precheck; go('check'); return; }
    if (ds.cond) { S.cond[ds.cond] = ds.v === '1'; save(); render(); return; }
    if (ds.hall) { hallSel = ds.hall; MS.sel = MS.dest = null; MS.q = ''; soft(); return; }
    if (ds.lrole) { loginRole = ds.lrole; render(); return; }
    if (ds.lmode) { S.mode = ds.lmode; save(); render(); return; }
    if (ds.mm) { MS.mode = ds.mm; soft(); return; }
    if (ds.mf) { MS.filter = ds.mf; soft(); return; }
    if (ds.rot) { MS.angle += +ds.rot; if (mapRedraw) mapRedraw(); return; }
    if (ds.zm) { MS.zoom = Math.max(.6, Math.min(2.5, MS.zoom * +ds.zm)); if (mapRedraw) mapRedraw(); return; }
    if (ds.dest) { MS.dest = ds.dest; soft(); return; }
    if (ds.mclear) { MS.dest = null; soft(); return; }
    if (ds.booth) { MS.sel = ds.booth; soft(); return; }
    if (ds.poi) { MS.dest = ds.poi; soft(); return; }
    if (ds.cad) { openCad(ds.cad); return; }
    if (ds.assign) { assignModal(ds.assign); return; }
    if (ds.asgo) { var co = $('#as-co').value; S.assign[ds.asgo] = co; logPush('부스 배정 · ' + ds.asgo + ' → ' + co); save(); closeDrawer(); soft(); toast(ds.asgo + ' 부스를 ' + co + '에 배정했어요.'); return; }
    if (ds.unassign) { delete S.assign[ds.unassign]; logPush('배정 취소 · ' + ds.unassign); save(); soft(); return; }
    if (ds.rqok) { decide(ds.rqok, true); soft(); toast(S.role === 'organizer' ? '운영사 승인함으로 넘겼어요.' : '승인했어요. 참가사·주최사 화면에 바로 반영돼요.'); return; }
    if (ds.rqno) { rejectModal(ds.rqno); return; }
    if (ds.rjgo) { decide(ds.rjgo, false, $('#rj-text').value.trim() || '보완이 필요합니다.'); closeDrawer(); soft(); toast('반려 사유와 근거를 보냈어요.'); return; }
    if (ds.optab) { opTab = ds.optab; opSel = {}; render(); return; }
    if (ds.inq) { inqSel = ds.inq; soft(); return; }
    if (ds.inqok) { S.inq[ds.inqok] = { st: 'answered', reply: $('#inq-reply').value }; logPush('문의 답변 · ' + (allInq().filter(function (q) { return q.id === ds.inqok; })[0] || {}).co); save(); soft(); toast('참가사에게 답변을 보냈어요.'); return; }
    if (ds.inqesc) { S.inq[ds.inqesc] = { st: 'escalated' }; logPush('문의 이관 → 운영사 · ' + (allInq().filter(function (q) { return q.id === ds.inqesc; })[0] || {}).co); save(); soft(); toast('운영사 현장 이슈로 넘겼어요.'); return; }
    if (ds.inqdone) { S.inq[ds.inqdone] = { st: 'answered' }; logPush('이관 문의 답변 완료'); save(); soft(); return; }
    if (ds.issdone) { S.iss[ds.issdone] = Object.assign({}, S.iss[ds.issdone], { st: 'done' }); logPush('이슈 완료 · ' + D.issues.filter(function (i) { return i.id === ds.issdone; })[0].title); save(); soft(); return; }
    if (ds.nudge) { logPush('독려 알림 · ' + ds.nudge); save(); toast(ds.nudge + '에 서류 제출 독려 알림을 보냈어요. (데모)'); return; }
    if (ds.hallgo) { hallSel = ds.hallgo || hallSel; closeDrawer(); }
    if (ds.dw) { dwSel[hallSel] = ds.dw; render(); return; }
    if (ds.doc) { openDoc(ds.doc); return; }
    if (ds.bt) { if (ds.bt === 'scan') { toast('데모: 카메라 대신 명함 사진 업로드로 연결될 예정이에요.'); return; } boothTab = ds.bt; render(); return; }
    if (ds.upload) {
      var sid = ds.upload, sb = D.submissions.filter(function (x) { return x.id === sid; })[0], has = reqAll().filter(function (x) { return x.id === sid; }).length;
      if (!has && sb) S.extraReq.push({ id: sid, from: 'ex', co: '㈜한빛로보틱스', booth: 'C-228', type: sb.title.split(/[ (]/)[0], title: sb.title, file: sb.file || (sb.title + '.pdf'), at: '11.05', due: sb.due, stage: 'org', src: sb.src });
      S.req[sid] = { stage: 'org' }; S.sub[sid] = 'submitted'; save(); soft(); toast('제출했어요. 주최사 1차 검토 → 운영사 승인 순서로 진행돼요.'); return;
    }
    if (ds.copy) { var txt = ds.copy; try { navigator.clipboard.writeText(txt).then(function () { toast('복사했어요: ' + txt); }, function () { toast('번호를 길게 눌러 복사하세요: ' + txt); }); } catch (e) { toast('번호를 길게 눌러 복사하세요: ' + txt); } return; }
    var a = ds.act;
    if (!a) return;
    if (a === 'close') closeDrawer();
    else if (a === 'mini') { miniOpen = !miniOpen; renderFab(route()); }
    else if (a === 'nudge-x') { S.nudge = false; save(); renderFab(route()); }
    else if (a === 'newchat') { S.active = null; save(); paintThreads(); }
    else if (a === 'menu') { $('#side').classList.toggle('open'); }
    else if (a === 'theme') { S.theme = S.theme === 'dark' ? 'light' : 'dark'; save(); applyTheme(); if (mapRedraw) mapRedraw(); }
    else if (a === 'logout') { S.role = null; save(); history.replaceState(null, '', location.pathname); render(); }
    else if (a === 'mclose') closeDrawer();
    else if (a === 'inquiry') inquiryModal();
    else if (a === 'iqsend') { var v = $('#iq-text').value.trim(); if (!v) { $('#iq-text').focus(); return; } S.sent.push({ id: 's' + Date.now(), co: '㈜한빛로보틱스', who: '김서윤', at: nowStr(), q: v, ask: v, st: 'new' }); logPush('문의 등록 · ㈜한빛로보틱스'); save(); closeDrawer(); toast('주최사 문의함에 보냈어요. 주최사로 로그인하면 확인할 수 있어요.'); }
    else if (a === 'relay') relayModal();
    else if (a === 'rlsend') { var ty = $('#rl-type').value, ti = $('#rl-title').value.trim() || ty; S.extraReq.push({ id: 'x' + Date.now(), from: 'org', co: '㈜스마트제조산업전람', booth: '전체', type: ty, title: ti, file: '(데모 첨부)', at: '11.05', due: '2026-11-23', stage: 'op', src: { label: '이용안내서 p.26' } }); logPush('운영사 신청 · ' + ti); save(); closeDrawer(); soft(); toast('운영사 통합 승인함에 올렸어요.'); }
    else if (a === 'batchok') { var ids = Object.keys(opSel).filter(function (k) { return opSel[k]; }); ids.forEach(function (id) { decide(id, true); }); opSel = {}; soft(); toast(ids.length + '건을 승인했어요.'); }
    else if (a === 'nudgeall') { var late = D.exhibitorsList.filter(function (e) { return e.late; }).map(function (e) { return e.co; }); logPush('일괄 독려 · ' + late.join(', ')); save(); toast(late.join(', ') + '에 독려 알림을 보냈어요. (데모)'); }
    else if (t.id === 'reset' || a === 'reset') {}
    else toast({ attach: '데모: 파일 첨부는 알림으로만 보여줘요.', forms: '데모: 양식 일괄 다운로드는 연결 전이에요.', view: '데모: 원본 파일 열기는 연결 전이에요.', reupload: '데모: 점검할 파일은 고정 예시를 써요.', report: '데모: 점검 요약 공유는 다음 단계에서 연결해요.', invite: '데모: 담당자 초대는 연결 전이에요.', pdf: '데모: 원문 PDF 열기는 연결 전이에요.', scan: '데모: 명함 스캔은 사진 업로드로 연결될 예정이에요.', req: '데모: 현장 요청을 접수한 것처럼 보여줘요.' }[a] || '데모 동작이에요.');
  });
  document.addEventListener('click', function (ev) {
    if (ev.target.closest('#reset')) { var keepR = S.role, keepT = S.theme; S = fresh(); S.role = keepR; S.theme = keepT; save(); hallSel = null; miniOpen = false; MS.sel = MS.dest = null; location.hash = keepR === 'organizer' ? 'org-home' : keepR === 'operator' ? 'op-home' : 'home'; render(); toast('데모 데이터를 처음 상태로 돌렸어요.'); }
    if (ev.target.closest('#apply-submit') && !ev.target.closest('#apply-submit').disabled) toast('데모: 신청서를 제출한 것으로 표시했어요. 실제 제출은 주최사 시스템에서 해요.');
    if (ev.target.closest('#drawing')) $('#drawing').classList.toggle('zoom');
    if (ev.target.id === 'scrim') closeDrawer();
  });
  document.addEventListener('change', function (ev) {
    var t = ev.target;
    if (t.dataset.task) { S.done[t.dataset.task] = t.checked; save(); render(); }
    if (t.dataset.pre) { S.pre[t.dataset.pre] = t.checked; save(); render(); }
    if (t.dataset.rqsel) { opSel[t.dataset.rqsel] = t.checked; soft(); }
    if (t.dataset.issteam) { var iid = t.dataset.issteam; S.iss[iid] = { st: t.value ? 'assigned' : 'new', team: t.value }; if (t.value) logPush('이슈 배정 · ' + D.issues.filter(function (i) { return i.id === iid; })[0].title + ' → ' + t.value); save(); soft(); }
  });
  document.addEventListener('submit', function (ev) {
    var f = ev.target; ev.preventDefault();
    if (f.id === 'login-form') { S.role = loginRole; save(); var home = loginRole === 'organizer' ? 'org-home' : loginRole === 'operator' ? 'op-home' : (isPre() ? 'apply' : 'home'); if (location.hash === '#' + home) render(); else location.hash = home; render(); return; }
    if (f.id === 'booth-find') {
      var v = $('#booth-q').value.trim().toUpperCase().replace(/\s/g, ''), key = (f.closest('[data-hallkey]') || {}).dataset ? f.closest('[data-hallkey]').dataset.hallkey : 'c';
      if (/^\d+$/.test(v)) v = key.toUpperCase() + '-' + v;
      MS.q = v; var b = hmModel(key).booths.filter(function (x) { return x.id === v; })[0];
      if (b) { MS.sel = b.id; MS.dest = 'booth:' + b.id; soft(); } else toast(v + ' 부스를 찾지 못했어요. 예) ' + key.toUpperCase() + '-112');
    }
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape') closeDrawer();
    if (ev.key === 'Enter' && !ev.shiftKey && ev.target.tagName === 'TEXTAREA') { ev.preventDefault(); var b = ev.target.closest('.composer').querySelector('[data-send]'); if (b) b.click(); }
  });
  document.addEventListener('input', function (ev) {
    if (ev.target.id === 'side-search') { /* 간단 검색: 엔터 시 어시스턴트로 */ }
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.target.id === 'side-search' && ev.key === 'Enter' && ev.target.value.trim()) { var v = ev.target.value; ev.target.value = ''; S.active = null; go('assistant'); setTimeout(function () { ask(v, { fresh: true }); }, 30); }
  });

  var VIEWS = { home: function () { return VIEWS_home(); }, apply: viewApply, schedule: viewSchedule, submissions: viewSubmissions, check: viewCheck, assistant: viewAssistant, library: viewLibrary, halls: viewHalls, company: viewCompany, booth: viewBooth,
    'org-home': viewOrgHome, 'org-exhibitors': viewOrgExhibitors, 'org-review': viewOrgReview, 'org-inbox': viewOrgInbox, 'org-map': viewOrgMap, 'org-relay': viewOrgRelay,
    'op-home': viewOpHome, 'op-approvals': viewOpApprovals, 'op-schedule': viewOpSchedule, 'op-map': viewOpMap, 'op-issues': viewOpIssues, 'op-log': viewOpLog };
  var AFTER = { assistant: paintThreads, halls: mapAfter, 'org-map': mapAfter, 'op-map': mapAfter };
  window.addEventListener('hashchange', render);
  render();
})();
