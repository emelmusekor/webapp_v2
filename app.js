/* ============================================================
   모듈1 · AI 실습 중심 — "함께 만드는 환영 앨범"
   해외 교류 친구 환영·추억 앨범을 AI 콘텐츠 제작 도구로 만들기
   단일 SPA (해시 라우팅 + localStorage 진행 저장)
   ============================================================ */

const STEPS = [
  { id:"step1", no:1, title:"번역 결과 역번역으로 검증하기", perf:"B2-3", area:"B. AI 활용 / B2. AI 콘텐츠 생성과 편집", desc:"AI 번역을 한국어로 역번역해 의미가 보존된 가장 정확한 번역을 고릅니다." },
  { id:"step2", no:2, title:"사진에 넣을 영어 문구 만들기", perf:"B2-2", area:"B. AI 활용 / B2. AI 콘텐츠 생성과 편집", desc:"사진 상황에 맞는 짧고 쉬운 문구를 AI로 만들어 봅니다." },
  { id:"step3", no:3, title:"사진 배경 정리하기",       perf:"B2-2", area:"B. AI 활용 / B2. AI 콘텐츠 생성과 편집", desc:"필요한 장면은 남기고 불필요한 배경을 지워 봅니다." },
  { id:"step4", no:4, title:"사진으로 추억 영상 만들기", perf:"B2-2", area:"B. AI 활용 / B2. AI 콘텐츠 생성과 편집", desc:"사진을 짧은 추억 영상으로 만드는 옵션을 골라 봅니다." },
  { id:"step5", no:5, title:"자동 번역 자막 확인하기",   perf:"B2-3", area:"B. AI 활용 / B2. AI 콘텐츠 생성과 편집", desc:"AI 자동 번역 자막의 어색한 부분을 찾아 고쳐 봅니다." },
  { id:"step6", no:6, title:"친구 사진 사용 동의 확인하기", perf:"C2-3", area:"C. AI 윤리 / C2. 책임 있는 AI 활용", desc:"동의하지 않은 친구의 얼굴·개인정보를 가려 봅니다." },
  { id:"step7", no:7, title:"공유 전 표현과 범위 점검하기", perf:"C2-2", area:"C. AI 윤리 / C2. 책임 있는 AI 활용", desc:"표현을 점검하고 알맞은 공유 범위를 정해 봅니다." },
];

/* ---------- 상태 저장 ---------- */
const KEY = id => "ai_lit_m1_" + id;
const isDone = id => localStorage.getItem(KEY(id)) === "1";
function setDone(id){ localStorage.setItem(KEY(id), "1"); renderSidebar(); }
function resetOne(id){ localStorage.removeItem(KEY(id)); route(); }
function clearAll(){ STEPS.forEach(s => localStorage.removeItem(KEY(s.id))); route(); }

/* ---------- 유틸 ---------- */
const $  = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
const esc = t => String(t).replace(/[<>&]/g, m => ({ "<":"&lt;", ">":"&gt;", "&":"&amp;" }[m]));
function currentId(){ const h = location.hash.replace(/^#\/?/, ""); return h || "index"; }

/* ---------- 사이드바 ---------- */
function renderSidebar(){
  const cur = currentId();
  const n = STEPS.filter(s => isDone(s.id)).length;
  const links = STEPS.map(s =>
    `<a href="#/${s.id}" class="${cur===s.id?'active ':''}${isDone(s.id)?'done':''}">
       <span class="bubbleNo">${s.no}</span>
       <span><span class="navTitle">${s.title}</span><span class="navSub">${s.perf}</span></span>
       <span class="doneDot"></span>
     </a>`).join("");
  $("#side").innerHTML = `<aside class="sidebar">
    <div class="brand"><div class="logo">앨범</div><div><h1>함께 만드는 환영 앨범</h1><p>AI 실습 중심 · 모듈1</p></div></div>
    <div class="info">
      <div><span>유형</span><b>AI 콘텐츠 제작·실습형</b></div>
      <div><span>과제 맥락</span><b>학급·공동</b></div>
      <div><span>구성</span><b>1~7단계</b></div>
    </div>
    <div class="progressTxt"><span>완료</span><span>${n}/7</span></div>
    <div class="bar"><i style="width:${n/7*100}%"></i></div>
    <nav class="nav">
      <a href="#/index" class="${cur==='index'?'active':''}"><span class="bubbleNo">ⓘ</span><span><span class="navTitle">메인페이지</span><span class="navSub">시나리오·구성표</span></span><span class="doneDot"></span></a>
      ${links}
    </nav>
  </aside>`;
}

/* ---------- 공통 조각 ---------- */
function stepHeader(s){
  return `<div class="modHead">
    <div>
      <h3>${s.no}단계. ${s.title}</h3>
      <p>${s.desc}</p>
      <div class="badges"><span class="badge">${s.area}</span><span class="badge">성취수행 ${s.perf}</span><span class="badge">AI 실습형</span></div>
    </div>
    <div id="status" class="status ${isDone(s.id)?'ok':''}">${isDone(s.id)?'완료':'진행 전'}</div>
  </div>`;
}
function deviceBar(appName, chip){
  return `<div class="deviceBar"><div class="dots"><i></i><i></i><i></i></div>
    <div class="appName">${appName}${chip?`<span class="appChip">${chip}</span>`:''}</div></div>`;
}
function nextRow(id){
  const next = STEPS.find(s => s.no === STEPS.find(x=>x.id===id).no + 1);
  const nextHref = next ? `#/${next.id}` : `#/index`;
  const nextLabel = next ? `제출하고 ${next.no}단계로 이동` : "구성표로 돌아가기";
  return `<div class="nextRow">
    <a class="btn primary" href="${nextHref}">${nextLabel}</a>
    <button class="btn warn" onclick="resetOne('${id}')">이 단계 다시 하기</button>
  </div>`;
}
function markDone(id){
  setDone(id);
  const s = $("#status"); if(s){ s.textContent="완료"; s.className="status ok"; }
}
const speakerSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 9 8 9 13 4 13 20 8 15 3 15"/><path d="M16 8a5 5 0 0 1 0 8"/><path d="M19 5a9 9 0 0 1 0 14"/></svg>`;

/* ============================================================
   메인 페이지
   ============================================================ */
function renderIndex(){
  const rows = [
    [1,"번역기 결과를 믿어도 될지 모름","B2-3","역번역으로 의미 보존을 확인해 가장 정확한 번역 선택"],
    [2,"사진에 영어 문구가 필요함","B2-2","상황에 맞는 짧고 쉬운 문구 생성·선택"],
    [3,"배경에 지나가는 사람이 보임","B2-2","AI 배경 지우기로 필요한 장면만 남기기"],
    [4,"사진을 영상으로 만들고 싶음","B2-2","길이·분위기·전환을 목적에 맞게 선택"],
    [5,"자동 번역 자막이 어색함","B2-3","의미가 바뀐 자막을 찾아 수정"],
    [6,"동의 안 한 친구 얼굴이 보임","C2-3","얼굴·이름표를 가려 개인정보 보호"],
    [7,"공유 전 표현·범위 점검","C2-2","포용적 표현으로 수정, 공유 범위 제한"],
  ].map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join("");

  $("#main").innerHTML = `
    <section class="hero">
      <div class="eyebrow">2026 KERIS AI 리터러시 검사도구 · 모듈1 (AI 실습 중심)</div>
      <h2>함께 만드는 환영 앨범</h2>
      <p>학교에 해외 교류 친구가 며칠 동안 함께 생활하게 되었습니다. 지수는 교류 친구와 우리 반이 함께 볼 수 있는
      <b>환영·추억 앨범</b>을 AI 콘텐츠 제작 도구로 만듭니다. 학생은 번역·문구 생성·이미지 편집·영상 제작·자막 수정·개인정보 보호·공유 점검을
      직접 수행하며, AI 산출물을 <b>목적에 맞게 수정·개선</b>하고 <b>윤리 원칙</b>을 지키는 과정을 평가받습니다.</p>
    </section>
    <section class="module">
      <div class="modHead"><div><h3>단계별 구성</h3><p>각 단계는 하나의 성취수행 예시만 측정합니다.</p></div></div>
      <div class="modBody">
        <div class="taskBox"><b>주의</b> · 교류 친구를 구경거리처럼 다루지 않고 함께 추억을 만드는 친구로 표현합니다.
        사진·이름·국적·언어 정보는 꼭 필요한 범위에서만 사용합니다.</div>
        <table class="table">
          <tr><th>단계</th><th>장면/상황</th><th>성취수행</th><th>수행 과제</th></tr>
          ${rows}
        </table>
        <div class="nextRow">
          <a class="btn primary" href="#/step1">1단계 시작하기</a>
          <button class="btn warn" onclick="clearAll()">전체 기록 초기화</button>
        </div>
      </div>
    </section>`;
}

/* ============================================================
   1단계 · 환영 인사 번역 다듬기  (B2-3)
   ============================================================ */
const STEP1 = {
  ORIG: "환영해! 만나서 정말 반가워. 내 이름은 지수야.",
  // 번역하기를 누를 때마다 순서대로 누적되는 결과. 1~4는 문제가 있고, 5번째가 정답.
  ATTEMPTS: [
    { sw:"Ninakukaribisha rasmi katika shule kwa heshima kubwa. Jina langu ni Jisu.",
      back:"우리 학교에 당신을 공식적으로 정중히 환영합니다. 제 이름은 지수입니다.",
      faithful:false, why:"원문은 친근한 인사인데 너무 격식적인 말투로 바뀌었어요." },
    { sw:"Karibu! Nafurahi kukutana nawe. Jina langu ni Suji.",
      back:"환영해! 만나서 반가워. 내 이름은 수지야.",
      faithful:false, why:"이름이 ‘지수’에서 ‘수지’로 바뀌었어요." },
    { sw:"Karibu! Jina langu ni Jisu.",
      back:"환영해! 내 이름은 지수야.",
      faithful:false, why:"‘만나서 정말 반가워’가 빠졌어요." },
    { sw:"Karibu! Nafurahi kukutana nawe. Mimi ni mwalimu Jisu.",
      back:"환영해! 만나서 반가워. 나는 지수 선생님이야.",
      faithful:false, why:"원문에 없던 ‘선생님’이라는 정보가 더해졌어요." },
    { sw:"Karibu! Nafurahi sana kukutana nawe. Jina langu ni Jisu.",
      back:"환영해! 만나서 정말 반가워. 내 이름은 지수야.",
      faithful:true,  why:"원문과 의미가 그대로예요." },
  ],
  MAX: 5,

  render(){
    const s = STEPS[0];
    return `<section class="module">
      ${stepHeader(s)}
      <div class="modBody">
        <div class="taskBox"><b>상황</b> · 지수네 반에 <b>스와힐리어를 쓰는 교류 친구</b>가 왔어요. 지수는 친구를 위해 환영 인사를 번역 앱으로 만들려고 해요.
        그런데 지수는 스와힐리어를 몰라서, 번역이 제대로 됐는지 알 수가 없어요. 그래서 번역 결과를 다시 <b>한국어로 바꿔(역번역)</b> 원문과 같은지 확인하기로 했어요.
        번역기를 <b>최대 ${this.MAX}번</b>까지 돌려 보고, 역번역으로 비교해서 <b>가장 정확한 번역 하나를 골라</b> 사용하세요.<br><br>
        아래 인사말을 번역 앱에 그대로 입력해 보세요 → <b>“${this.ORIG}”</b></div>

        <div class="device">
          ${deviceBar("번역 도우미", "한국어 → 스와힐리어")}
          <div class="deviceBody">
            <div class="gt">
              <div class="gtPanes">
                <div class="gtPane">
                  <div class="gtHead"><span>한국어</span><span class="clr" onclick="STEP1.clearSrc()">✕ 지우기</span></div>
                  <textarea id="src" placeholder="번역할 한국어 문장을 입력하세요"></textarea>
                </div>
                <div class="gtPane gtOut">
                  <div class="gtHead"><span>스와힐리어 (가장 최근 번역)</span></div>
                  <div id="out" class="gtOutText empty">번역 결과가 여기에 표시됩니다.</div>
                </div>
              </div>
              <div class="gtBar">
                <span class="gtCounter" id="counter">번역 0 / ${this.MAX}</span>
                <div class="gtBtns" id="gtBtns">
                  <button class="btn primary" onclick="STEP1.translate()">번역하기</button>
                </div>
              </div>
            </div>

            <div class="results">
              <div class="resultsHead"><h4>번역 결과 비교</h4><span class="resHint">각 번역을 ‘한국어로 역번역’해 원문과 비교한 뒤, 사용할 번역을 고르세요.</span></div>
              <div class="resList" id="resList"><div class="resEmpty">아직 번역한 결과가 없어요. [번역하기]를 눌러 보세요.</div></div>
              <div class="decideRow">
                <button class="btn primary" onclick="STEP1.decide()">이 번역으로 결정하기</button>
                <span id="pickLabel" style="font-size:13px;color:#64748b;font-weight:850">선택한 번역: 없음</span>
              </div>
            </div>
          </div>
        </div>

        <div id="fb" class="feedback"></div>

        <details class="teacher"><summary>교사용 정답/채점기준 보기</summary><div class="inner">
          <b>성취수행 기준</b> · B2-3. AI 도구를 활용하여 생성한 산출물을 문제해결 목적에 맞게 수정·개선한다.<br>
          <b>측정 의도</b> · 외국어 실력과 무관하게 <b>역번역(round-trip)으로 AI 번역 품질을 검증</b>하고, 의미가 보존된 번역을 선택하는 리터러시.<br><br>
          <b>진행 흐름</b> · 한국어 원문 입력(오타·불일치 시 재입력 안내) → [번역하기]/[다시 번역하기]로 최대 ${this.MAX}회 번역 누적 → 각 번역을 [한국어로 역번역]으로 원문과 비교 → 사용할 번역 선택 → [이 번역으로 결정하기].<br><br>
          <b>자동채점 방식</b> · ① ${this.MAX}회 번역을 모두 해 보고, ② 선택한 번역의 <b>역번역을 확인</b>했으며(검증 과정), ③ <b>의미가 보존된 번역</b>을 선택해야 정답.<br>
          역번역을 보지 않고 결정하면 “역번역으로 의미를 먼저 확인하라”고 안내하여 검증 과정을 강제한다.<br><br>
          <b>번역기 결과(고정 시나리오)</b> — 정답은 항상 5번째.<br>
          1. 격식 과잉(rasmi/heshima kubwa) → 친근함 소실<br>
          2. 이름 왜곡(Jisu→Suji)<br>
          3. ‘반가워’ 누락<br>
          4. 없던 정보 추가(mwalimu=선생님)<br>
          <b>5. 의미 완전 보존 → 정답</b><br><br>
          <b>설계 주의</b> · 정확한 외국어 실력 평가가 아니라 “번역기는 맹신하지 않고 역번역으로 직접 검증한다”는 수행을 본다.</div></details>
      </div>
    </section>`;
  },

  idx: 0, selected: null, backViewed: new Set(),

  norm(t){ return String(t).trim().replace(/\s+/g, " "); },
  clearSrc(){ $("#src").value = ""; $("#src").focus(); },

  translate(){
    const v = $("#src").value;
    if(!this.norm(v)){ this.fb("번역할 한국어 문장을 입력하세요.", "warn"); return; }
    if(this.norm(v) !== this.norm(this.ORIG)){
      this.fb(`입력한 한국어가 원문과 달라요. 글자를 다시 확인해 주세요.<br>원문: <b>“${this.ORIG}”</b>`, "warn");
      return;
    }
    if(this.idx >= this.MAX){ this.fb(`번역은 최대 ${this.MAX}번까지예요. 아래 결과를 비교해 사용할 번역을 고르세요.`, "warn"); return; }
    this.idx++;
    const n = this.idx;
    const a = this.ATTEMPTS[n - 1];
    const out = $("#out"); out.classList.remove("empty"); out.textContent = a.sw;
    $("#counter").textContent = `번역 ${this.idx} / ${this.MAX}`;
    if(n === 1) $("#resList").innerHTML = "";
    $("#resList").insertAdjacentHTML("beforeend", `
      <div class="resItem" data-n="${n}">
        <div class="resHead"><span class="aNo">번역 ${n}</span>
          <button class="btn selBtn" data-sel="${n}" onclick="STEP1.select(${n})">이 번역 선택</button></div>
        <div class="sw">${a.sw}</div>
        <div class="resBtns"><button class="btn" onclick="STEP1.toggleBack(${n})">🔁 한국어로 역번역</button></div>
        <div class="backBox" id="rb${n}" style="display:none;margin-top:10px">
          <div class="cmpRow orig"><span class="cmpLab">원문</span><span class="cmpTxt">${this.ORIG}</span></div>
          <div class="cmpRow back"><span class="cmpLab">역번역</span><span class="cmpTxt">${a.back}</span></div>
        </div>
      </div>`);
    this.fb("", "");
    this.renderBar();
  },

  renderBar(){
    const canMore = this.idx < this.MAX;
    if(this.idx === 0){ $("#gtBtns").innerHTML = `<button class="btn primary" onclick="STEP1.translate()">번역하기</button>`; return; }
    $("#gtBtns").innerHTML = `<button class="btn primary" onclick="STEP1.translate()" ${canMore?'':'disabled'}>${canMore?'다시 번역하기':`번역 완료 (${this.MAX}/${this.MAX})`}</button>`;
  },

  toggleBack(n){
    const box = document.getElementById("rb"+n);
    const show = box.style.display === "none";
    box.style.display = show ? "block" : "none";
    if(show) this.backViewed.add(n);
  },

  select(n){
    this.selected = n;
    $$(".resItem").forEach(it => it.classList.toggle("sel", +it.dataset.n === n));
    $$("[data-sel]").forEach(b => b.classList.toggle("on", +b.dataset.sel === n));
    $("#pickLabel").textContent = `선택한 번역: 번역 ${n}`;
  },

  decide(){
    if(this.idx < this.MAX){ this.fb(`번역기를 ${this.MAX}번 모두 돌려 보고, 결과를 비교한 뒤 고르세요. (현재 ${this.idx}/${this.MAX})`, "warn"); return; }
    if(!this.selected){ this.fb("사용할 번역을 하나 선택하세요.", "warn"); return; }
    if(!this.backViewed.has(this.selected)){ this.fb("고른 번역을 <b>[한국어로 역번역]</b>으로 눌러 원문과 뜻이 같은지 먼저 확인해 보세요.", "warn"); return; }
    const a = this.ATTEMPTS[this.selected - 1];
    if(a.faithful){
      this.fb("정답입니다. 5번의 번역을 역번역으로 비교해서, 원문과 뜻이 그대로인 번역을 골랐어요. 언어를 몰라도 <b>역번역</b>으로 AI 번역의 품질을 검증할 수 있습니다.", "good");
      markDone("step1");
      $("#fb").insertAdjacentHTML("beforeend", nextRow("step1"));
      return;
    }
    this.fb(`역번역을 다시 보세요. <b>번역 ${this.selected}</b>은 ${a.why} 의미가 달라진 번역이에요. 역번역이 원문 “${this.ORIG}”과 <b>똑같은</b> 번역을 찾아 고르세요.`, "warn");
  },

  fb(msg, type){ const e = $("#fb"); if(!msg){ e.className = "feedback"; e.innerHTML = ""; return; } e.className = "feedback show " + type; e.innerHTML = msg; },

  mount(){ this.idx = 0; this.selected = null; this.backViewed = new Set(); }
};

/* ============================================================
   공용 헬퍼 (step2~7)
   ============================================================ */
function feedback(msg, type){
  const e = $("#fb");
  if(!msg){ e.className = "feedback"; e.innerHTML = ""; return; }
  e.className = "feedback show " + type;
  e.innerHTML = msg;
}
function passStep(id, msg){
  feedback(msg, "good");
  markDone(id);
  $("#fb").insertAdjacentHTML("beforeend", nextRow(id));
}
function teacherBox(html){ return `<details class="teacher"><summary>교사용 정답/채점기준 보기</summary><div class="inner">${html}</div></details>`; }
function svgPerson(step,id,cx,topY,color,label,r){
  r=r||26; const h=topY+ (r+4);
  return `<g class="obj" data-id="${id}" onclick="${step}.toggle('${id}')">
    <circle cx="${cx}" cy="${topY}" r="${r}" fill="#f5c6a5" stroke="#e8a87c"/>
    <rect x="${cx-r}" y="${topY+r+2}" width="${r*2}" height="${r*2.6}" rx="${r*0.55}" fill="${color}"/>
    <rect class="ring" x="${cx-r-10}" y="${topY-r-6}" width="${r*2+20}" height="${r*4+8}" rx="12"/>
    <text class="lbl" x="${cx}" y="${topY+r*3.4}" text-anchor="middle">${label}</text>
  </g>`;
}

/* ============================================================
   2단계 · 사진에 넣을 문구 만들기 (B2-2)
   상황에 맞는 영어 문구 생성 → 한국어 뜻 확인 → 위치 정해서 올리기
   ============================================================ */
const STEP2 = {
  // len:1짧게 2보통 3길게
  POOL: [
    { len:1, warm:true,  text:"Welcome! Happy to be friends.",  ko:"환영해! 친구가 되어 기뻐.",       ok:true },
    { len:1, warm:true,  text:"So glad you're here!",           ko:"네가 와서 정말 기뻐!",            ok:true },
    { len:1, warm:false, text:"Welcome. Nice to meet.",         ko:"환영. 만나서 반가워.",            ok:false, why:"딱딱하고 정이 느껴지지 않아 사진 분위기와 안 맞아요." },
    { len:1, warm:true,  text:"Look at our funny foreign friend!", ko:"우리의 웃긴 외국인 친구를 보세요!", ok:false, why:"친구를 구경거리처럼 놀리는 표현이에요." },
    { len:2, warm:true,  text:"Welcome to our zoo of cultures!", ko:"우리 문화 동물원에 온 걸 환영해!", ok:false, why:"‘동물원’ 비유는 친구를 대상화하는 표현이에요. (뜻을 봐야 알 수 있어요)" },
    { len:2, warm:false, text:"Our cute and exotic new friend.", ko:"귀엽고 이국적인 우리의 새 친구.",  ok:false, why:"‘이국적’은 특정 나라를 단순화한 고정관념 표현이에요." },
    { len:3, warm:false, text:"On this historic day, we proudly welcome a very special foreign guest from a faraway land.", ko:"역사적인 오늘, 머나먼 나라에서 온 아주 특별한 외국 손님을 자랑스럽게 환영합니다.", ok:false, why:"너무 길고 과장됐어요." },
  ],
  POS: [ {t:"사진 위쪽", v:"top", ok:false, why:"제목이 하늘 위에 떠 어색해요."},
         {t:"사진 가운데 (인물 위)", v:"mid", ok:false, why:"문구가 친구들의 얼굴을 가려요."},
         {t:"사진 아래쪽", v:"bottom", ok:true},
         {t:"구석에 아주 작게", v:"corner", ok:false, why:"너무 작아 읽기 어려워요."} ],
  len:2, warm:false, cyc:{}, items:[], sel:null, checked:new Set(), pos:null,

  render(){
    const s = STEPS[1];
    const L={1:"짧게",2:"보통",3:"길게"};
    const posBtns = this.POS.map((p,i)=>`<button class="optBtn" data-p="${i}" onclick="STEP2.pickPos(${i})">${p.t}</button>`).join("");
    return `<section class="module">
      ${stepHeader(s)}
      <div class="modBody">
        <div class="taskBox"><b>상황</b> · 환영 카드 사진 위에 넣을 <b>영어 문구</b>를 AI로 만들어요.
        사진 상황에 어울리는 문구를 <b>영어로 생성</b>하고, <b>한국어 뜻을 확인</b>한 뒤(영어만 보면 무슨 뜻인지 모를 수 있어요!),
        친구를 존중하는 문구를 골라 <b>알맞은 위치</b>에 넣어 올리세요.</div>

        <div class="device">
          ${deviceBar("AI 카드 편집기", "사진 문구")}
          <div class="deviceBody">
            <div class="photoCard">
              <div class="photoScene"><div class="sceneRow">🧒🎨🧑</div><div class="sceneCap" id="cap"></div></div>
              <div class="photoMeta">📷 사진 상황 · 지수와 교류 친구가 <b>함께 환영 카드를 들고 웃는 장면</b></div>
            </div>

            <div class="genBox" style="margin-top:12px">
              <div class="genControls">
                <span class="reqChip">언어: 영어</span>
                <div class="ctrlGroup"><span class="cl">길이</span>
                  <button class="stepBtn" onclick="STEP2.bump(-1)">−</button>
                  <span class="val" id="lenVal">${L[this.len]}</span>
                  <button class="stepBtn" onclick="STEP2.bump(1)">＋</button>
                </div>
                <button class="segBtn ${this.warm?'on':''}" id="warmBtn" onclick="STEP2.toggleWarm()">✨ 따뜻하게</button>
                <button class="btn primary" onclick="STEP2.generate()">영어 문구 생성</button>
              </div>
              <div class="genList" id="genList"><div class="genEmpty">조건을 정하고 [영어 문구 생성]을 눌러 보세요. 마음에 들 때까지 다시 생성할 수 있어요.</div></div>
            </div>

            <div class="optRow"><div class="optLabel">문구를 넣을 위치</div><div class="optBtns">${posBtns}</div></div>
            <div><button class="btn good" onclick="STEP2.apply()">사진에 넣어 올리기</button></div>
          </div>
        </div>

        <div id="fb" class="feedback"></div>
        ${teacherBox(`
          <b>성취수행 기준</b> · B2-2. AI 도구를 활용하여 산출물을 생성한다.<br>
          <b>측정 의도</b> · 조건을 바꿔 반복 생성하고, 외국어 산출물을 <b>한국어 뜻으로 확인</b>한 뒤, 상황에 맞고 존중적인 문구를 <b>적절한 위치</b>에 배치.<br><br>
          <b>채점(모두 충족 시 정답)</b> · ① 선택 문구의 한국어 뜻 확인, ② 문구가 상황에 맞고 짧고 존중적(정답 예: “Welcome! Happy to be friends.”, “So glad you're here!”), ③ 위치=사진 아래쪽(인물을 가리지 않음).<br>
          놀림·대상화(zoo/funny/exotic)·과장·딱딱함, 인물을 가리는 위치는 오답. ‘zoo of cultures’처럼 영어만 보면 모르는 함정은 뜻 확인으로 걸러야 함.<br><br>
          <b>설계 주의</b> · 외국어 실력이 아니라 ‘뜻 확인 후 목적에 맞게 선택·배치’를 본다.`)}
      </div>
    </section>`;
  },

  bump(d){ this.len=Math.min(3,Math.max(1,this.len+d)); $("#lenVal").textContent={1:"짧게",2:"보통",3:"길게"}[this.len]; },
  toggleWarm(){ this.warm=!this.warm; $("#warmBtn").classList.toggle("on",this.warm); },
  generate(){
    let pool=this.POOL.filter(p=>p.len===this.len && p.warm===this.warm);
    if(!pool.length) pool=this.POOL.filter(p=>p.len===this.len);
    if(!pool.length) pool=this.POOL.slice();
    const sig=`${this.len}-${this.warm}`; const k=this.cyc[sig]||0; this.cyc[sig]=k+1;
    const entry=pool[k%pool.length]; const idx=this.items.length; this.items.push(entry);
    if(idx===0) $("#genList").innerHTML="";
    $("#genList").insertAdjacentHTML("beforeend",
      `<div class="choice" data-i="${idx}" onclick="STEP2.select(${idx})">
        <div class="genTag">생성 ${idx+1} · ${({1:'짧게',2:'보통',3:'길게'})[entry.len]}${entry.warm?' · 따뜻하게':''}</div>
        <div class="cText">${entry.text}</div>
        <button class="btn" style="margin-top:8px" onclick="event.stopPropagation();STEP2.showMeaning(${idx})">🔤 한국어 뜻 보기</button>
        <div class="meaningBox" id="mean${idx}"><b>뜻</b> · ${entry.ko}</div>
      </div>`);
    this.select(idx); $("#genList").scrollTop=$("#genList").scrollHeight; feedback("","");
  },
  showMeaning(i){ $("#mean"+i).classList.add("show"); this.checked.add(i); },
  select(i){ this.sel=i; $$("#genList .choice").forEach(c=>c.classList.toggle("sel",+c.dataset.i===i)); this.preview(); },
  pickPos(i){ this.pos=i; $$(".optBtn[data-p]").forEach(b=>b.classList.toggle("sel",+b.dataset.p===i)); this.preview(); },
  preview(){
    const cap=$("#cap"); if(this.sel===null){ cap.classList.remove("show"); return; }
    cap.textContent=this.items[this.sel].text; cap.className="sceneCap show";
    if(this.pos!==null) cap.classList.add("pos-"+this.POS[this.pos].v);
  },
  apply(){
    if(this.sel===null){ feedback("영어 문구를 생성하고 하나를 고르세요.", "warn"); return; }
    if(!this.checked.has(this.sel)){ feedback("올리기 전에 <b>[🔤 한국어 뜻 보기]</b>로 이 영어 문구가 무슨 뜻인지 확인하세요.", "warn"); return; }
    const c=this.items[this.sel];
    if(!c.ok){ feedback(`이 문구는 올리기 어려워요. ${c.why} 조건을 바꿔 다시 생성해 더 알맞은 문구를 찾아보세요.`, "warn"); return; }
    if(this.pos===null){ feedback("문구를 넣을 위치를 정하세요.", "warn"); return; }
    const p=this.POS[this.pos];
    if(!p.ok){ feedback(`위치를 다시 정해 보세요. ${p.why}`, "warn"); return; }
    passStep("step2","정답입니다. 영어 문구의 뜻을 확인하고, 상황에 맞는 존중적인 문구를 인물을 가리지 않는 위치에 잘 넣었어요.");
  },
  mount(){ this.len=2; this.warm=false; this.cyc={}; this.items=[]; this.sel=null; this.checked=new Set(); this.pos=null; }
};

/* ============================================================
   3단계 · 사진 배경 정리하기 — AI 지우개 (B2-2) · 객체 다양화
   ============================================================ */
const STEP3 = {
  KEEP: ["m1","m2","m3","m4"],
  ERASE: ["d1","d2","d3","d4","d5"],
  marked:new Set(),

  scene(){
    const item=(id,x,y,w,h,inner,label)=>`<g class="obj" data-id="${id}" onclick="STEP3.toggle('${id}')">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#fff" stroke="#cbd5e1"/>${inner}
      <rect class="ring" x="${x-6}" y="${y-6}" width="${w+12}" height="${h+12}" rx="8"/>
      <text class="lbl" x="${x+w/2}" y="${y+h+18}" text-anchor="middle">${label}</text></g>`;
    return `<svg class="eraseScene" viewBox="0 0 680 370" role="img" aria-label="앨범 사진 편집 장면">
      ${svgPerson('STEP3','m1',250,150,'#7aa2f7','지수')}
      ${svgPerson('STEP3','m2',360,150,'#34d399','교류 친구')}
      ${item('m3',285,212,52,40,'<text x="311" y="240" text-anchor="middle" font-size="20">💌</text>','함께 만든 카드')}
      <g class="obj" data-id="m4" onclick="STEP3.toggle('m4')">
        <circle cx="305" cy="44" r="20" fill="#fca5a5"/><circle cx="338" cy="40" r="16" fill="#93c5fd"/>
        <line x1="305" y1="64" x2="305" y2="92" stroke="#cbd5e1" stroke-width="2"/><line x1="338" y1="56" x2="338" y2="92" stroke="#cbd5e1" stroke-width="2"/>
        <rect class="ring" x="282" y="20" width="76" height="80" rx="10"/><text class="lbl" x="320" y="112" text-anchor="middle">환영 풍선 장식</text></g>
      ${svgPerson('STEP3','d1',600,120,'#94a3b8','지나가는 학생',20)}
      ${item('d2',28,26,92,60,'<line x1="40" y1="44" x2="108" y2="44" stroke="#b45309" stroke-width="3"/><line x1="40" y1="58" x2="108" y2="58" stroke="#b45309" stroke-width="3"/><line x1="40" y1="72" x2="90" y2="72" stroke="#b45309" stroke-width="3"/>','낡은 게시물')}
      ${item('d3',36,300,64,32,'<rect x="46" y="310" width="44" height="14" rx="3" fill="#e5e7eb"/>','어질러진 물건')}
      ${item('d4',470,300,40,40,'<rect x="480" y="306" width="20" height="30" rx="4" fill="#fda4af"/>','음료수 캔')}
      ${item('d5',580,250,70,30,'<line x1="588" y1="278" x2="640" y2="252" stroke="#a16207" stroke-width="5"/><rect x="582" y="270" width="20" height="16" fill="#fcd34d"/>','청소 도구')}
    </svg>`;
  },

  render(){
    const s=STEPS[2];
    return `<section class="module">
      ${stepHeader(s)}
      <div class="modBody">
        <div class="taskBox"><b>상황</b> · 앨범에 넣을 사진에 여러 가지가 함께 찍혔어요. <b>AI 지우개</b>로,
        앨범의 주제가 되는 <b>활동 장면과 환영 장식은 남기고</b>, 사진과 관계없는 것들(지나가는 사람·낡은 게시물·잡동사니·음료수 캔·청소 도구 등)만
        <b>탭해서 지우세요.</b> 예쁘게 꾸미기가 아니라 필요한 정보만 남기는 편집이에요.</div>

        <div class="eraseWrap">
          <div class="deviceBar"><div class="dots"><i></i><i></i><i></i></div><div class="appName">AI 사진 편집기<span class="appChip">AI 지우개</span></div></div>
          ${this.scene()}
          <div class="eraseToolbar">
            <span class="markCount" id="markCount">지울 대상 0개 선택</span>
            <span class="eraseHint">지울 것을 탭해 선택한 뒤 [지우개 적용]. 잘못 골랐으면 다시 탭해 취소.</span>
            <button class="btn primary" style="margin-left:auto" onclick="STEP3.apply()">🧽 지우개 적용</button>
          </div>
        </div>

        <div id="fb" class="feedback"></div>
        ${teacherBox(`
          <b>성취수행 기준</b> · B2-2. AI 도구를 활용하여 산출물을 생성·편집한다.<br>
          <b>측정 의도</b> · 필요한 장면(인물·활동·환영 장식)은 남기고 <b>무관한 요소만 선별 제거</b>.<br><br>
          <b>채점</b> · 지울 것 5개(지나가는 학생·낡은 게시물·어질러진 물건·음료수 캔·청소 도구)만 지우면 정답.
          주요 대상(지수·교류 친구·함께 만든 카드·환영 풍선 장식)을 지우면 오답, 무관한 것을 남겨도 오답.<br><br>
          <b>설계 주의</b> · 꾸미기가 아니라 정보 선별 편집임을 분명히 한다.`)}
      </div>
    </section>`;
  },

  toggle(id){
    const g=document.querySelector(`.eraseScene .obj[data-id="${id}"]`);
    if(g.classList.contains("gone")) return;
    if(this.marked.has(id)){ this.marked.delete(id); g.classList.remove("marked"); }
    else { this.marked.add(id); g.classList.add("marked"); }
    $("#markCount").textContent=`지울 대상 ${this.marked.size}개 선택`;
  },
  apply(){
    if(!this.marked.size){ feedback("지울 대상을 먼저 탭해서 선택하세요.", "warn"); return; }
    const wrong=[...this.marked].filter(id=>this.KEEP.includes(id));
    if(wrong.length){ feedback("앨범 주제가 되는 활동 장면이나 환영 장식을 지우려고 했어요. 그 대상은 남겨야 해요. 다시 탭해 취소하세요.", "warn"); return; }
    const missed=this.ERASE.filter(id=>!this.marked.has(id));
    if(missed.length){ feedback("아직 지우지 않은 무관한 요소가 있어요. 지나가는 사람·낡은 게시물·잡동사니·음료수 캔·청소 도구를 모두 찾아 지워 주세요.", "warn"); return; }
    this.marked.forEach(id=>document.querySelector(`.eraseScene .obj[data-id="${id}"]`).classList.add("gone"));
    passStep("step3","정답입니다. 활동 장면과 환영 장식은 남기고, 사진과 관계없는 것들만 깔끔하게 지웠어요.");
  },
  mount(){ this.marked=new Set(); }
};

/* ============================================================
   4단계 · 사진으로 추억 영상 만들기 (B2-2) · 실제 애니메이션 미리보기
   ============================================================ */
const STEP4 = {
  GROUPS: [
    { key:"len",   label:"영상 길이",  opts:[{t:"약 15초",ok:true},{t:"30초",ok:true},{t:"3분",ok:false},{t:"10분",ok:false}] },
    { key:"trans", label:"전환 효과 (누르면 미리보기 재생)", opts:[{t:"부드럽게",fx:"fade",ok:true},{t:"슬라이드",fx:"slide",ok:true},{t:"천천히 줌인",fx:"zoom",ok:true},{t:"빠른 번쩍임",fx:"flash",ok:false},{t:"글리치 지지직",fx:"glitch",ok:false}] },
    { key:"comp",  label:"사진 구성",  opts:[{t:"세 친구를 골고루",ok:true},{t:"한 친구만 계속 클로즈업",ok:false}] },
    { key:"music", label:"배경 음악",  opts:[{t:"잔잔하고 따뜻하게",ok:true},{t:"신나고 자극적으로",ok:false},{t:"무섭고 긴장되게",ok:false}] },
  ],
  uploaded:false, sel:{}, timer:null,

  render(){
    const s=STEPS[3];
    const groups=this.GROUPS.map(g=>`<div class="optRow"><div class="optLabel">${g.label}</div>
      <div class="optBtns">${g.opts.map((o,i)=>`<button class="optBtn" data-g="${g.key}" data-i="${i}" onclick="STEP4.pick('${g.key}',${i})">${o.t}</button>`).join("")}</div></div>`).join("");
    return `<section class="module">
      ${stepHeader(s)}
      <div class="modBody">
        <div class="taskBox"><b>상황</b> · 교류 친구와 함께 본 <b>따뜻한 추억 영상</b>을 만들어요. 사진을 업로드하고,
        길이·전환 효과·구성·배경 음악을 <b>상황(차분하고 따뜻한 추억 영상)에 맞게</b> 골라 만드세요.
        전환 효과는 누르면 <b>실제로 미리보기가 재생</b >돼요. 상황에 안 맞으면 만들 때 오류가 나요.</div>

        <div class="device">
          ${deviceBar("AI 영상 편집기", "사진 → 영상")}
          <div class="deviceBody">
            <div id="upArea"><div class="uploadZone" onclick="STEP4.upload()">⬆️ 사진 업로드하기<br><span style="font-size:12px;font-weight:600;color:#94a3b8">(클릭하면 추억 사진 3장을 불러옵니다)</span></div></div>
            <div id="editArea" style="display:none">
              <div class="vstage" id="vstage">
                <div class="vslide" data-i="0">👋<div class="vcap">환영 인사</div></div>
                <div class="vslide" data-i="1">🎨<div class="vcap">함께 카드 만들기</div></div>
                <div class="vslide" data-i="2">📸<div class="vcap">단체 사진</div></div>
              </div>
              ${groups}
              <div style="margin-top:14px"><button class="btn primary" onclick="STEP4.make()">추억 영상 만들기 ▶</button></div>
            </div>
          </div>
        </div>

        <div id="fb" class="feedback"></div>
        ${teacherBox(`
          <b>성취수행 기준</b> · B2-2. AI 도구를 활용하여 다양한 형태의 산출물을 생성한다.<br>
          <b>측정 의도</b> · 산출물 옵션을 <b>맥락(차분하고 따뜻한 추억 영상)에 맞게</b> 선택.<br><br>
          <b>채점</b> · 길이=15초/30초, 전환=부드럽게/슬라이드/줌인, 구성=골고루, 배경음=잔잔·따뜻 → 정답.
          긴 길이·번쩍임/글리치·한 친구만 부각·자극적/무서운 음악은 오답(만들기 시 오류).<br><br>
          <b>설계 주의</b> · 특정 학생만 부각/과도 반복되지 않게.`)}
      </div>
    </section>`;
  },

  upload(){ this.uploaded=true; $("#upArea").style.display="none"; $("#editArea").style.display="block"; this.playPreview("fade"); feedback("사진 3장을 불러왔어요. 전환 효과를 눌러 미리보기를 보고, 옵션을 상황에 맞게 골라 만들어 보세요.", "warn"); },
  pick(key,i){ this.sel[key]=i; $$(`.optBtn[data-g="${key}"]`).forEach(b=>b.classList.toggle("sel",+b.dataset.i===i));
    if(key==="trans"){ this.playPreview(this.GROUPS[1].opts[i].fx); } },
  playPreview(fx){
    clearInterval(this.timer);
    const stage=$("#vstage"); if(!stage) return;
    stage.className="vstage fx-"+fx;
    const slides=$$("#vstage .vslide"); let i=0;
    const show=()=>{ slides.forEach(s=>s.classList.remove("active")); slides[i].classList.add("active"); };
    show();
    this.timer=setInterval(()=>{ if(!document.body.contains(stage)){ clearInterval(this.timer); return; } i++; if(i>=slides.length){ clearInterval(this.timer); return; } show(); }, 950);
  },
  make(){
    if(!this.uploaded){ feedback("먼저 사진을 업로드하세요.", "warn"); return; }
    const missing=this.GROUPS.filter(g=>this.sel[g.key]===undefined);
    if(missing.length){ feedback(`아직 고르지 않은 항목이 있어요: ${missing.map(g=>g.label.replace(/ \(.*\)/,'')).join(", ")}.`, "warn"); return; }
    const wrong=this.GROUPS.filter(g=>!g.opts[this.sel[g.key]].ok);
    if(wrong.length){ feedback(`⚠️ 영상 만들기 오류 · 추억 영상에 어울리지 않는 선택이 있어요: <b>${wrong.map(g=>g.label.replace(/ \(.*\)/,'')).join(", ")}</b>. 차분하고 따뜻한 분위기에 맞게 다시 골라 주세요.`, "bad"); return; }
    this.playPreview(this.GROUPS[1].opts[this.sel.trans].fx);
    passStep("step4","정답입니다. 짧고 부드럽고 잔잔하며, 세 친구가 골고루 담긴 따뜻한 추억 영상을 만들었어요. 🎬 (미리보기가 재생됩니다)");
  },
  mount(){ this.uploaded=false; this.sel={}; clearInterval(this.timer); }
};

/* ============================================================
   5단계 · 자동 번역 자막 직접 수정하기 (B2-3) · 영상 자막 편집기
   ============================================================ */
const STEP5 = {
  LINES: [
    { emoji:"🧑‍🤝‍🧑", ko:"내 친구 이름은 지수예요.",      ai:"My friend's name is Jesus.", check:v=>/jisu/i.test(v)&&!/jesus/i.test(v), why:"이름 ‘지수’가 ‘Jesus’로 잘못 번역됐어요. (지수 → Jisu)" },
    { emoji:"📸", ko:"우리는 사진 세 장을 골랐어요.", ai:"We chose 30 photos.",        check:v=>/(^|\D)3(\D|$)/.test(v)&&!/30/.test(v), why:"‘세 장(3장)’이 ‘30장’으로 잘못 번역됐어요. (30 → 3)" },
    { emoji:"🥬", ko:"우리는 김치를 만들었어요.",      ai:"We made kimchi.",            check:v=>/kimchi/i.test(v), why:"" },
  ],
  val:[], sel:0,

  render(){
    const s=STEPS[4];
    const tl=this.LINES.map((l,i)=>`<div class="seg ${i===0?'active':''}" data-i="${i}" onclick="STEP5.selectSeg(${i})">자막 ${i+1}<small>${l.ko.slice(0,8)}…</small></div>`).join("");
    return `<section class="module">
      ${stepHeader(s)}
      <div class="modBody">
        <div class="taskBox"><b>상황</b> · 추억 영상에 AI가 자동 번역으로 <b>영어 자막</b>을 달았어요. 그런데 <b>이름이나 숫자가 바뀐 자막</b>이 있어요.
        영어를 잘 몰라도 괜찮아요 — 영상 아래 자막을 <b>원문(한국어)과 비교</b>하면 무엇이 틀렸는지 찾을 수 있어요. 자막을 <b>직접 고쳐</b> 저장하세요.</div>

        <div class="device">
          ${deviceBar("AI 영상 자막 편집기", "자동 번역 자막")}
          <div class="deviceBody">
            <div class="videoStage"><span id="vEmoji">${this.LINES[0].emoji}</span><div class="subOverlay" id="subOverlay">${this.LINES[0].ai}</div></div>
            <div class="timeline">${tl}</div>
            <div class="editLineBox">
              <div class="ko">선택한 자막의 원문(한국어) · <b id="koRef">${this.LINES[0].ko}</b></div>
              <input class="subEdit" id="subEdit" value="${this.LINES[0].ai}" oninput="STEP5.edit(this.value)">
              <div class="subNote">원문과 뜻이 같은지(이름·숫자) 확인하고, 틀린 부분만 고치세요. 고치면 영상 자막이 바로 바뀌어요.</div>
            </div>
            <div style="margin-top:14px"><button class="btn primary" onclick="STEP5.save()">자막 저장하기</button></div>
          </div>
        </div>

        <div id="fb" class="feedback"></div>
        ${teacherBox(`
          <b>성취수행 기준</b> · B2-3. AI 산출물을 문제해결 목적에 맞게 수정·개선한다.<br>
          <b>측정 의도</b> · 외국어 실력과 무관하게, 원문과 비교해 <b>자동 번역 오류(이름·숫자)를 찾아 직접 수정</b>.<br><br>
          <b>채점</b> · 자막1=‘Jisu’(‘Jesus’ 아님), 자막2=‘3’(‘30’ 아님), 자막3=‘kimchi’ 유지 → 정답. 오역을 그대로 두면 오답.<br><br>
          <b>설계 주의</b> · 영어 실력이 아니라 ‘번역 오류 발견·수정’ 수행(이름·숫자 기반).`)}
      </div>
    </section>`;
  },

  selectSeg(i){
    this.sel=i;
    $$(".seg").forEach(s=>s.classList.toggle("active",+s.dataset.i===i));
    $("#vEmoji").textContent=this.LINES[i].emoji;
    $("#koRef").textContent=this.LINES[i].ko;
    $("#subEdit").value=this.val[i];
    $("#subOverlay").textContent=this.val[i];
  },
  edit(v){ this.val[this.sel]=v; $("#subOverlay").textContent=v; },
  save(){
    const bad=this.LINES.map((l,i)=>({l,i})).filter(({l,i})=>!l.check(this.val[i]));
    if(bad.length){
      const fix=bad.filter(({l})=>l.why);
      feedback(fix.length?`아직 고쳐야 할 자막이 있어요: <b>자막 ${fix.map(x=>x.i+1).join(", ")}</b>. 원문과 이름·숫자가 같은지 다시 확인하세요.`
        :`자막 ${bad.map(x=>x.i+1).join(", ")}을(를) 다시 확인하세요. 원문과 뜻이 같아야 해요.`,"warn");
      return;
    }
    passStep("step5","정답입니다. 원문과 비교해서 이름과 숫자가 바뀐 자막을 찾아 직접 바르게 고쳤어요.");
  },
  mount(){ this.val=this.LINES.map(l=>l.ai); this.sel=0; }
};

/* ============================================================
   6단계 · 친구 사진 사용 동의·개인정보 점검 (C2-3) · 학급 단체 사진
   ============================================================ */
const STEP6 = {
  KEEP:["f1","f2","f3"],
  PROTECT:["p1","p2","p3","p4","p5"],
  marked:new Set(),

  scene(){
    const item=(id,x,y,w,h,fill,stroke,inner,label)=>`<g class="obj" data-id="${id}" onclick="STEP6.toggle('${id}')">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="2"/>${inner}
      <rect class="ring" x="${x-6}" y="${y-6}" width="${w+12}" height="${h+12}" rx="10"/>
      <text class="lbl" x="${x+w/2}" y="${y+h+18}" text-anchor="middle">${label}</text></g>`;
    return `<svg class="eraseScene" viewBox="0 0 680 380" role="img" aria-label="학급 단체 사진 개인정보 점검">
      ${svgPerson('STEP6','f1',150,140,'#7aa2f7','지수 (동의함)')}
      ${svgPerson('STEP6','f2',250,140,'#34d399','교류 친구 (동의함)')}
      ${svgPerson('STEP6','f3',350,140,'#f59e0b','친구 A (동의함)')}
      ${svgPerson('STEP6','p1',455,140,'#a78bfa','친구 B (동의 안 함)')}
      ${svgPerson('STEP6','p2',600,110,'#94a3b8','지나가던 학생',20)}
      ${item('p3',40,288,176,42,'#fff','#f59e0b','<text x="128" y="314" text-anchor="middle" font-size="13" fill="#334155">이서연 010-1234-5678</text>','이름표 (이름·전화)')}
      ${item('p4',250,288,118,72,'#eef2ff','#6366f1','<circle cx="278" cy="320" r="13" fill="#c7d2fe"/><line x1="300" y1="312" x2="356" y2="312" stroke="#818cf8" stroke-width="4"/><line x1="300" y1="326" x2="356" y2="326" stroke="#818cf8" stroke-width="4"/>','학생증')}
      ${item('p5',468,300,176,40,'#dcfce7','#16a34a','<text x="556" y="325" text-anchor="middle" font-size="12" fill="#166534">행복아파트 101동 1502호</text>','집 주소 표지')}
    </svg>`;
  },

  render(){
    const s=STEPS[5];
    return `<section class="module">
      ${stepHeader(s)}
      <div class="modBody">
        <div class="taskBox"><b>상황</b> · 앨범에 넣을 <b>학급 단체 사진</b>이에요. 그런데 사진 사용에 <b>동의하지 않은 친구</b>,
        지나가던 학생, 그리고 이름·전화번호가 적힌 <b>이름표·학생증·집 주소</b> 같은 개인정보가 함께 찍혔어요.
        <b>동의받지 않은 얼굴과 개인정보를 모두 찾아 지우고</b>, 사진 사용에 동의한 친구는 남기세요.</div>

        <div class="eraseWrap">
          <div class="deviceBar"><div class="dots"><i></i><i></i><i></i></div><div class="appName">AI 사진 편집기<span class="appChip">동의·개인정보 점검</span></div></div>
          ${this.scene()}
          <div class="eraseToolbar">
            <span class="markCount" id="markCount">지울 대상 0개 선택</span>
            <span class="eraseHint">동의 표시와 개인정보를 보고, 보호가 필요한 것을 탭해 선택한 뒤 [지우개 적용].</span>
            <button class="btn primary" style="margin-left:auto" onclick="STEP6.apply()">🧽 지우개 적용</button>
          </div>
        </div>

        <div id="fb" class="feedback"></div>
        ${teacherBox(`
          <b>성취수행 기준</b> · C2-3. AI 도구로 산출물을 제작·활용·공유할 때 AI 윤리 원칙을 준수한다.<br>
          <b>측정 의도</b> · 사진 사용 <b>동의 여부</b>와 <b>개인정보(이름·전화·학생증·주소)</b>를 같은 기준으로 식별·보호.<br><br>
          <b>채점</b> · 동의 안 한 친구 B·지나가던 학생·이름표·학생증·집 주소(5개)를 모두 지우면 정답.
          동의한 친구(지수·교류 친구·친구 A)를 지우면 오답, 개인정보·미동의 얼굴을 남겨도 오답.<br><br>
          <b>설계 주의</b> · 모든 학생을 동일 기준으로 다루고 개인정보 보호와 동의를 함께 본다.`)}
      </div>
    </section>`;
  },

  toggle(id){
    const g=document.querySelector(`.eraseScene .obj[data-id="${id}"]`);
    if(g.classList.contains("gone")) return;
    if(this.marked.has(id)){ this.marked.delete(id); g.classList.remove("marked"); }
    else { this.marked.add(id); g.classList.add("marked"); }
    $("#markCount").textContent=`지울 대상 ${this.marked.size}개 선택`;
  },
  apply(){
    if(!this.marked.size){ feedback("보호가 필요한 대상을 먼저 탭해서 선택하세요.", "warn"); return; }
    const wrong=[...this.marked].filter(id=>this.KEEP.includes(id));
    if(wrong.length){ feedback("사진 사용에 동의한 친구(지수·교류 친구·친구 A)는 지우면 안 돼요. 다시 탭해 선택을 취소하세요.", "warn"); return; }
    const missed=this.PROTECT.filter(id=>!this.marked.has(id));
    if(missed.length){ feedback("아직 보호하지 않은 대상이 있어요. 동의 안 한 친구·지나가던 학생·이름표·학생증·집 주소를 모두 찾아 지워 주세요.", "warn"); return; }
    this.marked.forEach(id=>document.querySelector(`.eraseScene .obj[data-id="${id}"]`).classList.add("gone"));
    passStep("step6","정답입니다. 동의받지 않은 얼굴과 이름·전화·학생증·주소 같은 개인정보를 모두 지우고, 동의한 친구는 남겼어요.");
  },
  mount(){ this.marked=new Set(); }
};

/* ============================================================
   7단계 · 공유 전 점검 — 학교/개인 인스타그램 공식 게시 (C2-2)
   ============================================================ */
const STEP7 = {
  BANNED:/(신기|구경|귀엽|귀여운|이상|특이|불쌍|진귀|웃긴|이국)/,
  REQS:[
    { t:"존중하는 표현으로", good:true },
    { t:"짧고 친근하게", good:true },
    { t:"특정 나라·문화 강조하지 않기", good:true },
    { t:"더 재미있게, 신기함 강조", good:false },
    { t:"화려하고 길게", good:false },
  ],
  GOOD:["함께 추억을 만든 소중한 친구 🤝","우리 반에서 함께한 즐거운 시간","서로 배우며 친해진 우리 반 친구들"],
  BAD:["역사적인 날! 신기한 외국 친구 등장 ✨","머나먼 나라에서 온 진귀한 손님!","웃긴 외국 친구와의 하루 ㅋㅋ"],
  TARGETS:[
    { t:"학교 공식 인스타그램 · 학급 대상(동의·검토 완료)", icon:"🏫", ok:true },
    { t:"학교 공식 인스타그램 · 전체 공개", icon:"📣", ok:false, why:"동의받은 학급 범위를 넘어 외부 전체 공개는 알맞지 않아요." },
    { t:"내 개인 인스타그램 · 전체 공개", icon:"📱", ok:false, why:"친구들의 사진·개인정보가 있어 개인 계정 전체 공개는 안 돼요." },
  ],
  DRAFT:"외국에서 와서 신기한 우리 친구!",
  reqs:new Set(), cyc:0, caption:"", tSel:null,

  render(){
    const s=STEPS[6];
    const reqChips=this.REQS.map((r,i)=>`<button class="segBtn" data-r="${i}" onclick="STEP7.toggleReq(${i})">${r.t}</button>`).join("");
    const targets=this.TARGETS.map((t,i)=>`<div class="shareOpt" data-i="${i}" onclick="STEP7.pickTarget(${i})"><span class="so">${t.icon}</span>${t.t}</div>`).join("");
    return `<section class="module">
      ${stepHeader(s)}
      <div class="modBody">
        <div class="taskBox"><b>상황</b> · 완성한 앨범을 인스타그램에 <b>공식적으로 게시</b>하려고 해요. AI가 만든 표지 문구에 친구를
        <b>구경거리처럼 보거나 놀리는 표현</b>이 섞여 있어요. AI에게 <b>어떻게 고쳐 달라고 할지 요청 사항을 고르고</b> 여러 번 다시 써 보며
        존중하는 문구로 다듬고, <b>알맞은 게시 위치</b>를 정하고, <b>AI 사용</b>을 표시하세요.</div>

        <div class="device">
          ${deviceBar("인스타그램 게시", "공유 전 점검")}
          <div class="deviceBody">
            <div class="previewCard"><div class="previewCover">📔 환영 앨범</div></div>

            <div class="sectionLabel">① AI에게 요청할 내용 고르기</div>
            <div class="reqChipRow">${reqChips}</div>
            <button class="btn" onclick="STEP7.aiRewrite()">✨ AI에게 문구 다시 써 달라고 하기</button>
            <div class="captionShow" id="captionShow">${this.DRAFT}</div>
            <div class="subNote" style="font-size:12px;color:#94a3b8">요청 내용을 바꿔 가며 여러 번 눌러 볼 수 있어요. 마음에 들면 그대로 게시해요.</div>

            <div class="sectionLabel">② 게시 위치 정하기</div>
            <div class="shareOpts" id="targets">${targets}</div>

            <label class="aiFlag"><input type="checkbox" id="aiFlag"><span>이 게시물은 <b>AI 번역·생성 도구</b>를 사용해 만들었습니다. (#AI사용 표시)</span></label>

            <div style="margin-top:14px"><button class="btn primary" onclick="STEP7.save()">점검 완료하고 게시하기</button></div>
          </div>
        </div>

        <div id="fb" class="feedback"></div>
        ${teacherBox(`
          <b>성취수행 기준</b> · C2-2. AI가 생성한 결과물의 차별적·편향적 요소를 인식하고 포용적으로 개선한다.<br>
          <b>측정 의도</b> · AI에게 <b>적절한 수정 요청</b>을 하고(요청 선택), 결과의 대상화·고정관념을 걸러 <b>존중적 문구</b>로 다듬으며, 공유 범위·AI 표시를 적절히 설정.<br><br>
          <b>채점(모두 충족)</b> · ① 최종 문구에 ‘신기/구경/귀엽/이상/특이/진귀/웃긴/이국’ 등 대상화 표현 없음, ② 게시 위치=학교 공식·학급 대상, ③ AI 사용 표시 체크.<br>
          요청에 ‘신기함 강조/화려하게’ 등 부적절 항목을 고르면 AI가 부적절한 문구를 만들어 통과되지 않는다.<br><br>
          <b>설계 주의</b> · “외국인이라 신기하다”류는 포용적 방향으로 개선.`)}
      </div>
    </section>`;
  },

  toggleReq(i){ if(this.reqs.has(i)) this.reqs.delete(i); else this.reqs.add(i); $$(`.segBtn[data-r="${i}"]`).forEach(b=>b.classList.toggle("on",this.reqs.has(i))); },
  aiRewrite(){
    const chosen=[...this.reqs].map(i=>this.REQS[i]);
    const hasBad=chosen.some(r=>!r.good);
    const hasGood=chosen.some(r=>r.good);
    let pool;
    if(chosen.length===0) pool=[this.DRAFT, ...this.BAD];   // 요청 없이 그냥 다시쓰기 → 비슷하게 부적절
    else if(hasBad || !hasGood) pool=this.BAD;
    else pool=this.GOOD;
    this.caption=pool[this.cyc%pool.length]; this.cyc++;
    $("#captionShow").textContent=this.caption;
    feedback("AI가 요청에 따라 문구를 다시 썼어요. 마음에 안 들면 요청을 바꿔 다시 눌러 보세요.", "warn");
  },
  pickTarget(i){ this.tSel=i; $$("#targets .shareOpt").forEach(c=>c.classList.toggle("sel",+c.dataset.i===i)); },
  save(){
    const text=(this.caption||this.DRAFT).trim();
    if(text===this.DRAFT){ feedback("AI가 처음 만든 문구를 그대로 두면 안 돼요. 요청 내용을 골라 [AI에게 문구 다시 써 달라기]로 다듬어 보세요.", "warn"); return; }
    if(this.BANNED.test(text)){ feedback("문구에 친구를 구경거리처럼 보거나 낮춰 보는 표현이 남아 있어요. 요청 내용을 ‘존중하는 표현으로’ 등으로 바꿔 다시 써 보세요.", "warn"); return; }
    if(this.tSel===null){ feedback("게시 위치를 정하세요.", "warn"); return; }
    const t=this.TARGETS[this.tSel];
    if(!t.ok){ feedback(`게시 위치를 다시 보세요. ${t.why}`, "warn"); return; }
    if(!$("#aiFlag").checked){ feedback("AI 도구를 사용했으니 <b>AI 사용 표시</b>에 체크해 주세요.", "warn"); return; }
    passStep("step7","정답입니다. AI에게 알맞게 요청해 존중하는 문구로 다듬고, 학교 공식·학급 범위로 게시 위치를 정하고, AI 사용도 표시했어요. 환영 앨범을 공유했어요! 🎉");
  },
  mount(){ this.reqs=new Set(); this.cyc=0; this.caption=this.DRAFT; this.tSel=null; }
};

const IMPL = { step1:STEP1, step2:STEP2, step3:STEP3, step4:STEP4, step5:STEP5, step6:STEP6, step7:STEP7 };

function route(){
  renderSidebar();
  const id = currentId();
  window.scrollTo(0, 0);
  if(id === "index" || id === ""){ renderIndex(); return; }
  const s = STEPS.find(x => x.id === id);
  if(!s){ location.hash = "#/index"; return; }
  const impl = IMPL[id];
  if(impl){ $("#main").innerHTML = impl.render(); if(impl.mount) impl.mount(); return; }
  location.hash = "#/index";
}

window.addEventListener("hashchange", route);
window.addEventListener("DOMContentLoaded", () => { if(!location.hash) location.hash = "#/index"; route(); });
