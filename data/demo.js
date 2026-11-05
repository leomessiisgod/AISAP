/* EXPO DESK 데모 시나리오 데이터. 회사·전시회·주최사·일정은 모두 가상(DEMO)이다.
   COEX 시설·주차·대관·도면 값은 knowledge.js(AISAP 정제 데이터셋)에서 가져온다. */
window.DEMO = {
  today: '2026-11-05',
  user: { name: '김서윤', role: '마케팅팀 매니저 · 전시 담당', email: 'seoyun.kim@hanbit-demo.kr' },
  company: {
    name: '㈜한빛로보틱스', demo: true, biz: '123-45-67890 (데모)', industry: '산업용 협동로봇·자동화 설비',
    address: '경기도 성남시 분당구 판교로 000 (데모)', homepage: 'hanbit-robotics.example',
    staff: [
      { name: '김서윤', role: '전시 총괄 · 서류', phone: '010-0000-1201', app: true },
      { name: '박정훈', role: '부스 시공 · 도면', phone: '010-0000-1202', app: true },
      { name: '이도현', role: '물류 · 반입 · 통신', phone: '010-0000-1203', app: true },
      { name: '최유진', role: '재무 · 계약', phone: '010-0000-1204', app: false },
      { name: '정하늘', role: '현장 응대 · 리드', phone: '010-0000-1205', app: true }
    ]
  },
  exhibitions: {
    approved: {
      id: 'smf-2026', name: '2026 서울 스마트제조 엑스포', short: '스마트제조 엑스포', host: '㈜스마트제조산업전람(데모)',
      status: '참가 승인', hall: 'Hall C', hallKey: 'c', booth: 'C-228 외 3', boothSize: '36㎡ (3×3m 4부스)',
      open: '2026-12-09', install: '12.07–12.08', show: '12.09–12.11', teardown: '12.11 17:00~',
      phases: [
        { name: '기업 등록', date: '10.02', state: 'done' }, { name: '참가 신청', date: '10.10', state: 'done' },
        { name: '신청 승인', date: '10.21', state: 'done' }, { name: '서류·신청', date: '~11.23', state: 'now' },
        { name: '설치', date: '12.07–08', state: 'next' }, { name: '전시 운영', date: '12.09–11', state: 'next' },
        { name: '철거·정산', date: '12.11–', state: 'next' }
      ]
    },
    pre: {
      id: 'slw-2027', name: '2027 스마트물류 위크', short: '스마트물류 위크', host: '㈜물류산업전시(데모)',
      status: '신청 전', hall: 'Hall A', hallKey: 'a', booth: '미배정', boothSize: '희망 36㎡',
      open: '2027-03-17', applyDue: '2026-11-27', install: '03.15–03.16', show: '03.17–03.19', teardown: '03.19 17:00~'
    }
  },

  /* 신청 전 단계: 참가 신청 서류 체크리스트 */
  preChecklist: [
    { id: 'pre-biz', title: '사업자등록증 사본', desc: '발급 3개월 이내 PDF', req: true, src: { label: '참가신청 안내(데모) p.3' } },
    { id: 'pre-form', title: '참가신청서 작성', desc: '희망 부스 타입·면적·전시 품목', req: true, src: { label: '참가신청 안내(데모) p.4' } },
    { id: 'pre-profile', title: '회사 소개서', desc: '국문·영문 각 1부 (디렉토리 등재용)', req: true, src: { label: '참가신청 안내(데모) p.5' } },
    { id: 'pre-booth', title: '희망 부스 위치 1~3지망', desc: 'Hall A 기본 배치도 기준', req: true, src: { chunk: 'coex-dwg-hall-a-floor-2024#02-zones' } },
    { id: 'pre-deposit', title: '참가비 계약금 30% 납부', desc: '신청 후 7일 이내 · 세금계산서 발행', req: true, src: { label: '참가신청 안내(데모) p.6' } },
    { id: 'pre-privacy', title: '개인정보 수집·이용 동의', desc: '담당자 연락처 수집 [필수]', req: true, src: { chunk: 'coex-rental-inquiry#04-privacy-consent' } },
    { id: 'pre-history', title: '최근 3년 전시 참가 이력', desc: '부스 배정 가점 참고 (선택)', req: false, src: { label: '참가신청 안내(데모) p.7' } },
    { id: 'pre-catalog', title: '출품 제품 카탈로그', desc: '심사 참고용 (선택)', req: false, src: { label: '참가신청 안내(데모) p.7' } }
  ],
  preCalendar: [
    { date: '2026-11-13', title: '얼리버드 할인 신청 마감', who: 'host' },
    { date: '2026-11-20', title: '참가업체 설명회 (온라인)', who: 'host' },
    { date: '2026-11-27', title: '1차 참가 신청 마감', who: 'host' },
    { date: '2026-12-04', title: '부스 배정 결과 통보', who: 'host' }
  ],

  /* 승인 후: 할 일 (세부 일정표·대시보드 공용) */
  tasks: [
    { id: 't-layout', title: '부스 디자인 도면 재제출', desc: '통로 너비·벽면 이격거리 표기 누락으로 반려', owner: '박정훈', due: '2026-11-06', badge: 'rejected', sub: 'sub-layout', src: { label: '이용안내서 p.26' } },
    { id: 't-contractor', title: '시공업체 계약', desc: '코엑스 등록 서비스협력업체 중에서 선정', owner: '박정훈', due: '2026-11-13', src: { label: '이용안내서 p.10~11' } },
    { id: 't-waste', title: '폐기물 수거 조건 계약서 반영', desc: '장치 업체가 공사 폐기물을 모두 수거하도록 명시', owner: '박정훈', due: '2026-11-13', src: { label: '이용안내서 p.11' } },
    { id: 't-power', title: '전기 사용 신청 (단상 220V 5kW)', desc: '기술지원 신청서 · 주최사 취합', owner: '김서윤', due: '2026-11-16', badge: 'draft', sub: 'sub-power', src: { label: '이용안내서 p.26' } },
    { id: 't-water', title: '급배수 신청 + 사용 서약서', desc: '커피머신 1대 · 공사업체 날인 필요', owner: '김서윤', due: '2026-11-16', sub: 'sub-water', src: { label: '급배수 주의사항 서약 1~2항' } },
    { id: 't-net', title: '유선 인터넷 신청 (KTNET)', desc: '02-6000-2356~7', owner: '이도현', due: '2026-11-20', sub: 'sub-net', src: { label: '이용안내서 p.11~12' } },
    { id: 't-worknotice', title: '시공업체 온라인 작업신고 확인', desc: '협력업체가 사용개시 14일 전까지 코엑스에 신고', owner: '박정훈', due: '2026-11-23', sub: 'sub-work', src: { label: '협력업체 매뉴얼 p.7' } },
    { id: 't-pass', title: '출입증 사전 등록', desc: '부스당 최대 8매', owner: '이도현', due: '2026-11-25', src: { label: '주최사 매뉴얼 p.12' } },
    { id: 't-loading', title: '전시품 운송·반입 예약', desc: 'Hall C 화물출입구 W5.4×H5.0m 기준 차량·장비 확인', owner: '이도현', due: '2026-12-01', src: { chunk: 'coex-dwg-hall-c-floor-2024#03-loading' } },
    { id: 't-truck', title: '화물차 무료주차 대상 확인', desc: '준비·철거일 1톤 이상 화물차 1일 1회 3시간', owner: '이도현', due: '2026-12-04', src: { chunk: 'coex-parking-information#03-truck-free-parking' } },
    { id: 't-parkpass', title: '전시기간 주차권 사전구매', desc: '카카오 T 주차 For Manager 계정 · 3일 연속 일자만', owner: '최유진', due: '2026-12-04', src: { chunk: 'coex-parking-information#05-parking-pass-prepurchase' } },
    { id: 't-app', title: '부스 App 스태프 계정 등록', desc: '정하늘 외 2명 App 권한 확인', owner: '김서윤', due: '2026-12-04' },
    { id: 't-fee', title: '참가비 잔금 납부', desc: '세금계산서 수령', owner: '최유진', due: '2026-10-31', done: true, src: { label: '주최사 매뉴얼 p.5' } },
    { id: 't-fire', title: '방염필증 업로드', desc: '목재·카펫·패브릭', owner: '박정훈', due: '2026-11-03', done: true, src: { label: '이용안내서 p.57' } },
    { id: 't-dir', title: '참가업체 디렉토리 정보 등록', desc: '회사 소개·전시 품목·로고', owner: '김서윤', due: '2026-11-04', done: true, src: { label: '주최사 매뉴얼 p.8' } }
  ],
  calendarEvents: [
    { date: '2026-11-16', title: '주최사 기술지원 신청 취합 마감', who: 'host' },
    { date: '2026-11-19', title: '참가업체 설명회 (온라인)', who: 'host' },
    { date: '2026-11-23', title: '주최사→홀매니저실 서류 제출', who: 'coex' },
    { date: '2026-11-30', title: '홀매니저실 기술지원 상담', who: 'coex' },
    { date: '2026-12-07', title: '설치 1일차 · 반입 08:00–11:00', who: 'site' },
    { date: '2026-12-09', title: '개막', who: 'site' }
  ],

  /* 제출·신청 관리 */
  submissions: [
    { id: 'sub-dir', title: '참가업체 디렉토리 정보', desc: '회사 소개 · 전시 품목 · 로고', req: 'required', to: '주최사 사무국', due: '2026-11-04', status: 'approved', file: 'hanbit_profile.docx', src: { label: '이용안내서 p.44' } },
    { id: 'sub-layout', title: '부스 디자인 도면 (Lay-out)', desc: 'A3 3부 · 부스 유형별 색상 구분 · 벽면 이격거리·통로 너비 표시', req: 'required', to: '주최사 사무국', due: '2026-11-06', status: 'rejected', file: 'C228_layout_v2.pdf', reject: '통로 너비와 벽면 이격거리 표기가 빠져 있습니다. 독립부스는 색상으로 구분해 A3 3부로 다시 제출해 주세요.', rejectDate: '11.03', src: { label: '이용안내서 p.26' } },
    { id: 'sub-power', title: '기술지원 신청서 (전기)', desc: '전력 용량 · 사용 시간 · 분전반 위치 · 계약자 직인', req: 'required', to: '주최사 → 홀매니저실', due: '2026-11-16', status: 'draft', src: { label: '이용안내서 p.26' } },
    { id: 'sub-water', title: '급배수 사용 신청 + 서약서', desc: '전시주최·참가업체·공사업체 날인 · 배수관 1:1 체결', req: 'cond', cond: 'water', to: '주최사 → 홀매니저실', due: '2026-11-16', status: 'todo', src: { label: '급배수 주의사항 서약 1~2항' } },
    { id: 'sub-self', title: '자체시공 서약서', desc: '공문, 도면, 서약서 원본, 사업자등록증 사본', req: 'cond', cond: 'self', to: '주최사 → 홀매니저실', due: '2026-11-16', status: 'na', src: { label: '이용안내서 p.52~53' } },
    { id: 'sub-hazard', title: '위험물 반입(반출) 허가 신청', desc: '가스·인화성 물질 시연 시 · 코엑스 승인 물품만', req: 'cond', cond: 'hazard', to: '주최사 → 홀매니저실', due: '2026-11-16', status: 'na', src: { label: '이용안내서 p.57' } },
    { id: 'sub-sign', title: '광고안내시설물 설치 신청', desc: '부스 밖 배너·사인물 · 위치 도면, 시안 1부', req: 'cond', cond: 'sign', to: '주최사 → 홀매니저실', due: '2026-11-16', status: 'todo', src: { label: '이용안내서 p.29' } },
    { id: 'sub-rigging', title: '천장 배너·호이스트 사용 신청', desc: 'Hall C 포인트 호이스트 1Point 150kg 이하', req: 'cond', cond: 'rig', to: '주최사 → 홀매니저실', due: '2026-11-16', status: 'na', src: { chunk: 'coex-dwg-hall-c-ceiling-2024#01-rigging' } },
    { id: 'sub-net', title: '유선 인터넷 신청', desc: 'KTNET 02-6000-2356~7 · 무선은 SK브로드밴드', req: 'required', to: 'KTNET', due: '2026-11-20', status: 'todo', src: { label: '이용안내서 p.11~12' } },
    { id: 'sub-work', title: '시공업체 온라인 작업신고', desc: '코엑스 등록 협력업체 명의 · 도면·방염필증·4대보험 증빙', req: 'required', to: '코엑스 (협력업체 신고)', due: '2026-11-23', status: 'todo', src: { label: '협력업체 매뉴얼 p.7~8' } },
    { id: 'sub-fire', title: '방염필증', desc: '목재·카펫·파이텍스·패브릭', req: 'required', to: '현장 제시 · 작업신고 첨부', due: '2026-12-07', status: 'submitted', file: 'fire_cert.jpg', src: { label: '이용안내서 p.57' } }
  ],

  /* 조건별 필수 판정 질문 (규칙 기반, AI는 설명만 담당) */
  conditions: [
    { id: 'water', q: '부스에서 커피머신·싱크대 등 물을 쓰나요?', yes: '급배수 사용 신청 + 서약서가 필수가 됩니다.', def: true },
    { id: 'self', q: '협력업체가 아닌 자체 인테리어팀이 부스를 시공하나요?', yes: '자체시공 서약서와 공문·사업자등록증 사본이 필요합니다.', def: false },
    { id: 'hazard', q: '시연에 가스·인화성 물질을 쓰나요?', yes: '위험물 반입(반출) 허가 신청이 필요합니다.', def: false },
    { id: 'sign', q: '부스 밖 통로·벽면에 배너나 사인물을 설치하나요?', yes: '광고안내시설물 설치 신청이 필요합니다.', def: true },
    { id: 'rig', q: '천장에 배너나 장비를 매달 계획이 있나요?', yes: '천장 배너·호이스트 사용 신청이 필요합니다. Hall C는 1Point 150kg 이하입니다.', def: false }
  ],

  /* 제출 전 AI 점검 결과 (데모 고정값) */
  precheck: {
    'sub-layout': {
      file: 'C228_layout_v3_draft.pdf', score: 3, total: 6,
      items: [
        { ok: true, text: '부스 번호 C-228~C-231 표기', src: { label: '주최사 매뉴얼 p.9' } },
        { ok: true, text: 'A3 규격 · 축척 1/100 표기' },
        { ok: false, text: '통로 쪽 너비 치수가 없습니다. 반려 사유와 같은 항목입니다.', src: { label: '이용안내서 p.26' } },
        { ok: false, text: '벽면 이격거리 표기가 없습니다.', src: { label: '이용안내서 p.26' } },
        { ok: false, text: '독립부스 구역의 색상 구분이 없습니다.', src: { label: '이용안내서 p.26' } },
        { ok: 'warn', text: '부스 높이 4.5m는 Hall C C2 구역 천장고 8.0m 안이지만, 주최사 높이 제한을 따로 확인해야 합니다.', src: { chunk: 'coex-dwg-hall-c-ceiling-2024#01-rigging' } }
      ]
    },
    'sub-power': {
      file: '기술지원신청서_작성중.xlsx', score: 4, total: 5,
      items: [
        { ok: true, text: '전력 용량 단상 220V 5kW 기재' },
        { ok: true, text: '사용 시간 09:00–18:00 기재' },
        { ok: true, text: '분전반 위치 도면 표시' },
        { ok: true, text: '부스 도면 A3 첨부' },
        { ok: false, text: '계약자 직인이 비어 있습니다.', src: { label: '이용안내서 p.26' } }
      ]
    }
  },

  notices: [
    { from: '주최사', title: '설치 1일차 반입 시간대 배정 (C-2xx 08:00–11:00)', date: '11.04', isNew: true },
    { from: '주최사', title: '출입증 사전 등록 오픈 · 부스당 8매', date: '11.03', isNew: true },
    { from: '코엑스', title: '준비·철거일 화물차 3시간 무료주차', date: '10.30', src: { chunk: 'coex-parking-information#03-truck-free-parking' } }
  ],

  contacts: [
    { name: '코엑스 홀매니저실', what: '전시장 현장운영 · 기술 지원', tel: '02-6000-1143~5, 1148' },
    { name: '코엑스 전시서비스팀', what: '전시장 대관 문의 · 계약', tel: '02-6000-1112, 1124' },
    { name: 'KTNET', what: '유선 인터넷', tel: '02-6000-2356~7' },
    { name: 'SK브로드밴드', what: '전화 · 무선 인터넷', tel: '02-6000-1588' },
    { name: '코엑스 안전상황실', what: '안전 문의·신고 · 분실물', tel: '02-6000-0112' },
    { name: '코엑스 주차관리실', what: '주차권 사전구매 계정 승인', tel: '02-6002-7130', src: { chunk: 'coex-parking-information#05-parking-pass-prepurchase' } },
    { name: '코엑스 콜센터', what: '종합안내', tel: '02-6000-0114' }
  ],

  guides: [
    { title: '코엑스 전시장 이용 안내서 2026', desc: '대관·계약 절차, 홀별 시설, 홀매니저실 제출 서류', kind: 'PDF', pages: 66, ext: true },
    { title: '코엑스 전시장 시설운영규정', desc: '임대시간, 협력업체, 작업신고, 높이제한', kind: 'PDF', pages: 15, ext: true },
    { title: '코엑스 서비스협력업체 운영 매뉴얼', desc: '등록 업체, 작업신고 절차, 분야별 준수사항', kind: 'PDF', pages: 39, ext: true },
    { title: '급/배수 설치 및 사용 시 주의사항 (서약서)', desc: '협력업체 시공, 배수관 1:1 체결, 누수 점검', kind: 'DOCX', ext: true },
    { title: '참가업체 매뉴얼 · 2026 서울 스마트제조 엑스포', desc: '일정, 부스 규정, 출입증, 기술지원 신청 마감', kind: 'PDF', pages: 28, demo: true }
  ],

  /* 부스 App (전시 기간 모바일) */
  booth: {
    notice: '14:00 Hall C 남측 입구 VIP 투어 동선 통제. 통로 적치물 정리 바랍니다.',
    visitors: [12, 18, 25, 31, 22, 17, 9, 8], leads: 38, hot: 9, visits: 142,
    schedule: [
      { t: '11:00', title: '협동로봇 HB-7 라이브 시연', s: '예정' },
      { t: '14:00', title: '바이어 미팅 · 대성정밀(데모)', s: '확정' },
      { t: '16:30', title: '시연 2회차', s: '예정' }
    ],
    leadsList: [
      { name: '오세준', co: '대성정밀(데모)', interest: 'HB-7 도입 견적', grade: 'Hot', time: '10:42' },
      { name: '한지민', co: '미래오토텍(데모)', interest: '용접 자동화 셀', grade: 'Warm', time: '10:15' },
      { name: '서강호', co: '그린팩토리(데모)', interest: '카탈로그 요청', grade: 'Cold', time: '09:51' }
    ],
    requests: [
      { title: '부스 전원 차단 (C-229 분전반)', state: '접수', time: '09:12', who: '홀매니저실' },
      { title: '커피머신 배수 누수 점검', state: '완료', time: '어제 18:20', who: '협력업체' }
    ]
  }
};

/* ===== v2: 주최사·운영사 데모 데이터 (모두 가상) ===== */
window.DEMO.roles = {
  exhibitor: { label: '참가사', who: '참가기업', id: 'seoyun.kim@hanbit-demo.kr', name: '김서윤', org: '㈜한빛로보틱스', desc: '서류·일정·규정 확인, 부스 App' },
  organizer: { label: '주최사', who: '전시 주최', id: 'host@smf-expo-demo.kr', name: '정민아', org: '㈜스마트제조산업전람', scen: '소싱인마켓 시나리오', desc: '참가사 관리·문의 응대·1차 검토' },
  operator: { label: '운영사', who: '전시장 운영', id: 'hall-ops@venue-demo.kr', name: '오태준', org: '전시장 운영본부', scen: '코엑스 시나리오', desc: '전체 승인·반려·전시장 총괄' }
};
/* 참가사 목록 (주최사 화면). 한빛로보틱스 진행률은 화면에서 실제 상태로 계산 */
window.DEMO.exhibitorsList = [
  { co: '㈜한빛로보틱스', booth: 'C-228~231', size: 36, mgr: '김서윤', docs: null, inq: 1, live: true },
  { co: '대성정밀', booth: 'C-112~113', size: 18, mgr: '오세준', docs: [7, 7], inq: 0 },
  { co: '미래오토텍', booth: 'C-305~308', size: 36, mgr: '한지민', docs: [5, 7], inq: 2, rej: 1 },
  { co: '그린팩토리', booth: 'C-141', size: 9, mgr: '서강호', docs: [2, 6], inq: 0, late: true },
  { co: '세온비전', booth: 'C-210~211', size: 18, mgr: '이수빈', docs: [6, 7], inq: 1 },
  { co: '누리센서', booth: 'C-402', size: 9, mgr: '박도윤', docs: [3, 6], inq: 0 },
  { co: '케이드라이브', booth: 'C-520~523', size: 36, mgr: '최하람', docs: [4, 8], inq: 3, rej: 1 },
  { co: '알파모션', booth: 'C-118~119', size: 18, mgr: '윤지호', docs: [7, 7], inq: 0 },
  { co: '도담테크', booth: 'C-356', size: 9, mgr: '강예린', docs: [1, 6], inq: 1, late: true },
  { co: '오성기계', booth: 'C-601~604', size: 36, mgr: '임재현', docs: [6, 8], inq: 0 },
  { co: '바로AI', booth: 'C-233', size: 9, mgr: '조은솔', docs: [5, 6], inq: 0 },
  { co: '청람에너지', booth: 'C-450~451', size: 18, mgr: '배성민', docs: [4, 7], inq: 1 }
];
/* 전시 프로세스 단계별 완료 (주최사 대시보드) */
window.DEMO.orgStages = [
  { n: '참가 신청·승인', done: 12, total: 12, due: '10.21' },
  { n: '디렉토리 정보 등록', done: 11, total: 12, due: '11.04' },
  { n: '부스 디자인 도면', done: 6, total: 12, due: '11.06' },
  { n: '기술지원 신청 (전기·급배수·통신)', done: 4, total: 12, due: '11.16' },
  { n: '시공업체 작업신고', done: 2, total: 12, due: '11.23' },
  { n: '출입증 사전 등록', done: 0, total: 12, due: '11.25' }
];
/* 문의 (주최사 문의 관리) — q는 AI 엔진으로 답변 초안 생성 */
window.DEMO.inquiries = [
  { id: 'q1', draft: 'Hall C 화물출입구는 북측 4개소이며 모두 W 5.4m × H 5.0m입니다. 5톤 윙바디는 적재 상태 차량 높이가 5.0m를 넘지 않으면 진입할 수 있습니다. 설치일 반입 시간대는 사무국이 출입구별로 배정해 따로 안내드리겠습니다.', co: '미래오토텍', who: '한지민', at: '11.05 09:12', q: '5톤 윙바디 차량이 Hall C 화물출입구로 들어갈 수 있나요?', ask: 'Hall C 화물출입구 크기는?', st: 'new' },
  { id: 'q2', draft: 'Hall C 천장 포인트 호이스트는 1Point 적정 인양하중이 150kg입니다. 배너 1개가 150kg을 넘으면 무게를 줄이거나 Point를 나눠 설치해야 합니다. 천장 배너 설치 신청은 11.16까지 사무국으로 보내 주세요.', co: '케이드라이브', who: '최하람', at: '11.05 08:40', q: '천장에 로고 배너를 달고 싶은데 하중 제한이 있나요?', ask: 'Hall C 천장 배너 하중 얼마까지야?', st: 'new' },
  { id: 'q3', draft: '급배수는 코엑스에 등록된 서비스협력업체만 시공할 수 있습니다. 기술지원 신청서에 급배수 사용을 표기해 11.16까지 사무국에 보내 주시고, 급배수 사용 서약서에 전시주최·참가업체·공사업체 3자 날인을 받아 함께 제출해 주세요.', co: '세온비전', who: '이수빈', at: '11.04 17:22', q: '부스에서 커피머신을 쓰려면 뭘 신청해야 하나요?', ask: '커피머신 급배수 신청', st: 'new' },
  { id: 'q4', draft: '준비·철거 기간에는 1톤 이상 화물차가 코엑스 진입 후 1일 1회 3시간 무료주차됩니다. 전시 기간에는 무료주차가 없습니다.', co: '케이드라이브', who: '최하람', at: '11.04 15:05', q: '준비기간에 1톤 트럭 주차는 무료인가요?', ask: '준비기간 화물차 무료주차 조건은?', st: 'answered' },
  { id: 'q5', draft: '출입증 추가 발급 기준은 이 전시회 매뉴얼에 없어 확인 후 다시 안내드리겠습니다.', co: '도담테크', who: '강예린', at: '11.04 11:30', q: '출입증을 8매 넘게 추가 발급받을 수 있나요?', ask: '출입증 추가 발급 가능해?', st: 'new' },
  { id: 'q6', co: '청람에너지', who: '배성민', at: '11.03 16:48', q: '부스 바닥에 앵커를 박아 장비를 고정해도 되나요?', ask: '부스 바닥에 앵커 박아도 돼?', st: 'escalated' }
];
/* 결재 요청 (참가사 → 주최사 1차 검토 → 운영사 승인) */
window.DEMO.requests = [
  { id: 'sub-layout', from: 'ex', co: '㈜한빛로보틱스', booth: 'C-228', type: '부스 도면', title: '부스 디자인 도면 (Lay-out)', file: 'C228_layout_v2.pdf', at: '11.02', due: '2026-11-06', stage: 'rejected', by: 'org', reason: '통로 너비와 벽면 이격거리 표기가 빠져 있습니다. 독립부스는 색상으로 구분해 A3 3부로 다시 제출해 주세요.', src: { label: '이용안내서 p.26' } },
  { id: 'sub-fire', from: 'ex', co: '㈜한빛로보틱스', booth: 'C-228', type: '방염', title: '방염필증', file: 'fire_cert.jpg', at: '11.03', due: '2026-12-07', stage: 'op', src: { label: '이용안내서 p.57' } },
  { id: 'sub-dir', from: 'ex', co: '㈜한빛로보틱스', booth: 'C-228', type: '디렉토리', title: '참가업체 디렉토리 정보', file: 'hanbit_profile.docx', at: '11.01', due: '2026-11-04', stage: 'approved', src: { label: '이용안내서 p.44' } },
  { id: 'r-mirae-layout', from: 'ex', co: '미래오토텍', booth: 'C-305', type: '부스 도면', title: '부스 디자인 도면 (독립부스)', file: 'mirae_C305_layout.pdf', at: '11.04', due: '2026-11-06', stage: 'org', src: { label: '이용안내서 p.26' } },
  { id: 'r-seon-water', from: 'ex', co: '세온비전', booth: 'C-210', type: '급배수', title: '급배수 사용 신청 + 서약서', file: 'seon_water.pdf', at: '11.04', due: '2026-11-16', stage: 'org', src: { label: '급배수 주의사항 서약 1~2항' } },
  { id: 'r-kdrive-rig', from: 'ex', co: '케이드라이브', booth: 'C-520', type: '천장 배너', title: '천장 배너 설치 (로고 배너 2개 · 각 180kg)', file: 'kdrive_banner.pdf', at: '11.05', due: '2026-11-16', stage: 'org', flag: '1Point 150kg 초과 의심', src: { chunk: 'coex-dwg-hall-c-ceiling-2024#01-rigging' } },
  { id: 'r-alpha-gas', from: 'ex', co: '알파모션', booth: 'C-118', type: '위험물', title: '위험물 반입 허가 (LPG 시연)', file: 'alpha_hazard.pdf', at: '11.03', due: '2026-11-16', stage: 'op', src: { label: '이용안내서 p.57' } },
  { id: 'o-power', from: 'org', co: '㈜스마트제조산업전람', booth: '전체', type: '기술지원 취합', title: '기술지원 신청 취합본 (전기 32건 · 급배수 6건)', file: 'SMF_기술지원_취합_1차.xlsx', at: '11.05', due: '2026-11-23', stage: 'op', src: { label: '이용안내서 p.26' } },
  { id: 'o-loading', from: 'org', co: '㈜스마트제조산업전람', booth: '전체', type: '반입 계획', title: '설치일 반입 시간대 배정표 (화물출입구 4개소)', file: 'SMF_반입배정.xlsx', at: '11.04', due: '2026-11-23', stage: 'op', src: { chunk: 'coex-dwg-hall-c-floor-2024#03-loading' } },
  { id: 'o-sign', from: 'org', co: '㈜스마트제조산업전람', booth: '로비', type: '광고시설물', title: '광고안내시설물 설치 신청 (로비 배너 6개)', file: 'SMF_signage.pdf', at: '11.03', due: '2026-11-16', stage: 'op', src: { label: '이용안내서 p.29' } }
];
window.DEMO.rejectDrafts = {
  '부스 도면': '부스 도면에 통로 너비와 벽면 이격거리 표기가 없습니다. 이용안내서 p.26 기준에 맞춰 A3 3부로 다시 제출해 주세요.',
  '천장 배너': 'Hall C 포인트 호이스트는 1Point 적정 인양하중이 150kg입니다. 배너 1개 180kg은 기준을 넘으니 무게를 줄이거나 Point를 나눠 다시 신청해 주세요.',
  '위험물': '반입 물품이 코엑스 승인 물품인지 확인이 필요합니다. 물품 목록과 안전관리 계획을 첨부해 다시 신청해 주세요.',
  '급배수': '급배수 사용 서약서에 공사업체 날인이 빠져 있습니다. 전시주최·참가업체·공사업체 3자 날인 후 다시 제출해 주세요.',
  '기술지원 취합': '취합본 중 전력 용량이 비어 있는 행이 있습니다. 보완 후 다시 제출해 주세요.',
  '반입 계획': '같은 시간대에 한 화물출입구로 배정된 차량이 많습니다. 출입구별로 분산해 다시 제출해 주세요.',
  '광고시설물': '설치 위치 도면이 빠져 있습니다. 위치 도면과 시안 1부를 첨부해 다시 신청해 주세요.',
  '방염': '방염필증의 자재명과 실제 사용 자재가 다릅니다. 확인 후 다시 제출해 주세요.',
  '디렉토리': '로고 파일 해상도가 낮습니다. 다시 제출해 주세요.'
};
/* 전시장 일정 (운영사): 2026-11-01 ~ 12-31 */
window.DEMO.venueSchedule = [
  { hall: 'Hall A', items: [{ n: '2026 리빙디자인 페어(데모)', s: '2026-11-10', e: '2026-11-14', setup: 2 }, { n: '스마트시티 엑스포(데모)', s: '2026-12-02', e: '2026-12-05', setup: 2 }] },
  { hall: 'Hall B', items: [{ n: '푸드테크 쇼(데모)', s: '2026-11-18', e: '2026-11-21', setup: 2 }, { n: '반려동물 박람회(데모)', s: '2026-12-16', e: '2026-12-20', setup: 1 }] },
  { hall: 'Hall C', items: [{ n: '뷰티 소싱 페어(데모)', s: '2026-11-12', e: '2026-11-14', setup: 1 }, { n: '2026 서울 스마트제조 엑스포', s: '2026-12-09', e: '2026-12-11', setup: 2, ours: true }] },
  { hall: 'Hall D', items: [{ n: '국제 의료기기 전시회(데모)', s: '2026-11-24', e: '2026-11-27', setup: 2 }] },
  { hall: 'THE PLATZ', items: [{ n: '스타트업 데모데이(데모)', s: '2026-11-06', e: '2026-11-07', setup: 1 }, { n: '브랜드 팝업(데모)', s: '2026-12-12', e: '2026-12-24', setup: 1 }] }
];
window.DEMO.issues = [
  { id: 'i1', hall: 'Hall B', ex: '푸드테크 쇼(데모)', title: 'B-214 부스 급배수 누수', at: '11.05 10:40', lvl: 'high', st: 'new', team: '' },
  { id: 'i2', hall: 'Hall A', ex: '리빙디자인 페어(데모)', title: '화물출입구 2 반입 차량 대기 지연', at: '11.05 09:55', lvl: 'mid', st: 'assigned', team: '홀매니저실' },
  { id: 'i3', hall: 'Hall C', ex: '뷰티 소싱 페어(데모)', title: 'C-3xx 구역 분전반 차단', at: '11.05 09:20', lvl: 'high', st: 'assigned', team: '전기 협력업체' },
  { id: 'i4', hall: 'THE PLATZ', ex: '스타트업 데모데이(데모)', title: '무선 인터넷 접속 불량', at: '11.04 16:10', lvl: 'low', st: 'done', team: 'SK브로드밴드' }
];
