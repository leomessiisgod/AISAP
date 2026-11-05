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
