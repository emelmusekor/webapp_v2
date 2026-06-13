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
   공용 헬퍼 + AI 엔진 + 드래그 선택 + 테마 사진
   ============================================================ */
function feedback(msg, type){
  const e = $("#fb");
  if(!msg){ e.className = "feedback"; e.innerHTML = ""; return; }
  e.className = "feedback show " + type; e.innerHTML = msg;
}
function passStep(id, msg){ feedback(msg, "good"); markDone(id); $("#fb").insertAdjacentHTML("beforeend", nextRow(id)); }
function teacherBox(html){ return `<details class="teacher"><summary>교사용 정답/채점기준 보기</summary><div class="inner">${html}</div></details>`; }
function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function rint(n){ return Math.floor(Math.random()*n); }
function svgPerson(step,id,cx,topY,color,label,r){
  r=r||26;
  return `<g class="obj" data-id="${id}">
    <circle cx="${cx}" cy="${topY}" r="${r}" fill="#f5c6a5" stroke="#e8a87c"/>
    <rect x="${cx-r}" y="${topY+r+2}" width="${r*2}" height="${r*2.6}" rx="${r*0.55}" fill="${color}"/>
    <rect class="ring" x="${cx-r-10}" y="${topY-r-6}" width="${r*2+20}" height="${r*4+8}" rx="12"/>
    <text class="lbl" x="${cx}" y="${topY+r*3.4}" text-anchor="middle">${label}</text>
  </g>`;
}
const AIGEN = {
  q:{},
  nextIndex(key,n){ let qq=this.q[key]; if(!qq||!qq.length) qq=shuffle([...Array(n).keys()]); const i=qq.pop(); this.q[key]=qq; return i; },
  pickN(key,n,count){ const out=[]; let g=0; const need=Math.min(count,n); while(out.length<need&&g++<300){ const i=this.nextIndex(key,n); if(!out.includes(i)) out.push(i); } return out; }
};

/* ----- 드래그 영역 선택 ----- */
function svgPt(svg,cx,cy){ const p=svg.createSVGPoint(); p.x=cx; p.y=cy; const r=p.matrixTransform(svg.getScreenCTM().inverse()); return {x:r.x,y:r.y}; }
function attachDrag(svg,onComplete){
  let start=null, box=null;
  svg.addEventListener('pointerdown',e=>{ if(e.button) return; start=svgPt(svg,e.clientX,e.clientY);
    box=document.createElementNS('http://www.w3.org/2000/svg','rect'); box.setAttribute('class','selbox'); svg.appendChild(box);
    try{svg.setPointerCapture(e.pointerId);}catch(_){} e.preventDefault(); });
  svg.addEventListener('pointermove',e=>{ if(!start||!box) return; const c=svgPt(svg,e.clientX,e.clientY);
    box.setAttribute('x',Math.min(start.x,c.x)); box.setAttribute('y',Math.min(start.y,c.y));
    box.setAttribute('width',Math.abs(c.x-start.x)); box.setAttribute('height',Math.abs(c.y-start.y)); });
  const end=e=>{ if(!start) return; const c=svgPt(svg,e.clientX,e.clientY);
    const rect={x:Math.min(start.x,c.x),y:Math.min(start.y,c.y),w:Math.abs(c.x-start.x),h:Math.abs(c.y-start.y)};
    if(box){box.remove();box=null;} start=null; if(rect.w>4&&rect.h>4) onComplete(rect); };
  svg.addEventListener('pointerup',end); svg.addEventListener('pointerleave',end);
}
function objsInRect(svg,rect){
  return [...svg.querySelectorAll('.obj')].filter(o=>!o.classList.contains('gone')).filter(o=>{
    const b=o.getBBox();
    return !(b.x+b.width<rect.x || rect.x+rect.w<b.x || b.y+b.height<rect.y || rect.y+rect.h<b.y);
  });
}

/* ----- 테마 사진(인스타/카드용) ----- */
const THEMES=[
  {key:"card",  label:"환영 카드 만들기", desc:"환영 카드를 함께 드는 모습", bg:"#fde2e4"},
  {key:"play",  label:"운동장에서 놀기",   desc:"운동장에서 공놀이를 하는 모습", bg:"#dbeafe"},
  {key:"kimchi",label:"김치 만들기",       desc:"함께 김치를 만드는 모습", bg:"#fef3c7"},
  {key:"group", label:"단체 사진",         desc:"반 친구들과 단체 사진을 찍는 모습", bg:"#e9d5ff"},
  {key:"lunch", label:"급식 먹기",         desc:"급식을 함께 먹는 모습", bg:"#dcfce7"},
];
function kid(cx,baseY,shirt){
  return `<circle cx="${cx}" cy="${baseY-86}" r="20" fill="#fcd9c2" stroke="#e8a87c"/>
    <rect x="${cx-20}" y="${baseY-62}" width="40" height="52" rx="13" fill="${shirt}"/>
    <rect x="${cx-13}" y="${baseY-12}" width="9" height="20" rx="4" fill="#475569"/>
    <rect x="${cx+4}" y="${baseY-12}" width="9" height="20" rx="4" fill="#475569"/>`;
}
function themeScene(key){
  const t=THEMES.find(x=>x.key===key)||THEMES[0]; const baseY=320;
  let body="";
  if(key==="card") body=`${kid(150,baseY,"#7aa2f7")}${kid(255,baseY,"#34d399")}
    <rect x="178" y="232" width="50" height="38" rx="6" fill="#fff" stroke="#f472b6" stroke-width="2" transform="rotate(-6 203 251)"/>
    <text x="203" y="259" text-anchor="middle" font-size="20" transform="rotate(-6 203 251)">💌</text>
    <text x="200" y="60" text-anchor="middle" font-size="22" font-weight="900" fill="#be185d">WELCOME</text>`;
  else if(key==="play") body=`<circle cx="330" cy="70" r="34" fill="#fde68a"/>${kid(150,baseY,"#60a5fa")}${kid(255,baseY,"#f472b6")}
    <circle cx="205" cy="250" r="22" fill="#fff" stroke="#475569" stroke-width="2"/><path d="M205 228 l8 14 -16 0 z" fill="#475569"/>`;
  else if(key==="kimchi") body=`${kid(150,baseY,"#f87171")}${kid(255,baseY,"#34d399")}
    <ellipse cx="203" cy="262" rx="52" ry="20" fill="#fca5a5" stroke="#dc2626" stroke-width="2"/>
    <path d="M175 258 q12 -16 28 -2 q14 -14 26 0" fill="none" stroke="#16a34a" stroke-width="4"/>`;
  else if(key==="group") body=`${kid(110,baseY,"#7aa2f7")}${kid(180,baseY,"#34d399")}${kid(250,baseY,"#f59e0b")}${kid(310,baseY,"#a78bfa")}
    <rect x="172" y="92" width="56" height="40" rx="8" fill="#334155"/><circle cx="200" cy="112" r="13" fill="#94a3b8"/><rect x="214" y="86" width="14" height="10" rx="2" fill="#334155"/>`;
  else body=`${kid(150,baseY,"#60a5fa")}${kid(255,baseY,"#fbbf24")}
    <rect x="158" y="250" width="90" height="34" rx="7" fill="#fff" stroke="#cbd5e1"/>
    <circle cx="180" cy="267" r="9" fill="#fca5a5"/><circle cx="205" cy="267" r="9" fill="#86efac"/><rect x="220" y="259" width="20" height="16" rx="3" fill="#fcd34d"/>`;
  return `<svg class="photoSvg" viewBox="0 0 400 360" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${t.desc}">
    <rect width="400" height="360" fill="${t.bg}"/><rect y="300" width="400" height="60" fill="rgba(0,0,0,.06)"/>${body}</svg>`;
}

/* ============================================================
   2단계 · 사진에 어울리는 영어 문구 만들기 (B2-2)
   인스타 카드 사진(매번 랜덤) → 사진에 어울리고(ok+fit) 뜻 확인한 문구를 위치·크기 정해 올리기
   ============================================================ */
const STEP2 = {
  UNIV:[
    {en:"Welcome! Happy to be friends.",ko:"환영해! 친구가 되어 기뻐.",fit:"all",ok:true},
    {en:"So glad you're here!",ko:"네가 와서 정말 기뻐!",fit:"all",ok:true},
    {en:"Great to be friends!",ko:"친구가 되어 좋아!",fit:"all",ok:true},
    {en:"Happy memories together!",ko:"함께한 행복한 추억!",fit:"all",ok:true},
  ],
  TGOOD:{
    card:[{en:"Making a welcome card together!",ko:"함께 환영 카드를 만들어요!"},{en:"Our welcome card for you!",ko:"너를 위한 환영 카드!"}],
    play:[{en:"Fun on the playground!",ko:"운동장에서 신나게!"},{en:"Playing ball together!",ko:"함께 공놀이!"}],
    kimchi:[{en:"Making kimchi together!",ko:"함께 김치를 만들어요!"},{en:"Our first kimchi!",ko:"우리의 첫 김치!"}],
    group:[{en:"Our class photo!",ko:"우리 반 단체 사진!"},{en:"All of us together!",ko:"다 함께!"}],
    lunch:[{en:"Lunch time together!",ko:"함께 먹는 점심!"},{en:"Yummy school lunch!",ko:"맛있는 급식!"}],
  },
  DIS:[
    {en:"Look at the funny foreign kid!",ko:"웃긴 외국 친구를 보세요!",fit:"all",ok:false,why:"친구를 놀리는 표현이에요."},
    {en:"Our cute and exotic friend!",ko:"귀엽고 이국적인 친구!",fit:"all",ok:false,why:"‘이국적’은 고정관념 표현이에요."},
    {en:"Welcome to our zoo of cultures!",ko:"우리 문화 동물원에 온 걸 환영해!",fit:"all",ok:false,why:"‘동물원’ 비유는 대상화예요. (뜻을 봐야 알 수 있어요)"},
    {en:"A rare guest from far away!",ko:"머나먼 곳에서 온 진귀한 손님!",fit:"all",ok:false,why:"구경거리처럼 보는 표현이에요."},
  ],
  POS:[{t:"위쪽",v:"top",ok:false,why:"제목이 위로 떠 어색해요."},{t:"가운데",v:"mid",ok:false,why:"문구가 친구들의 얼굴을 가려요."},{t:"아래쪽",v:"bottom",ok:true},{t:"구석에 작게",v:"corner",ok:false,why:"너무 작아 읽기 어려워요."}],
  theme:null, cands:[], sel:null, checked:new Set(), pos:null, count:0,

  render(){
    const s=STEPS[1]; this.theme=THEMES[rint(THEMES.length)].key;
    const posBtns=this.POS.map((p,i)=>`<button class="optBtn" data-p="${i}" onclick="STEP2.pickPos(${i})">${p.t}</button>`).join("");
    return `<section class="module">${stepHeader(s)}
      <div class="modBody">
        <div class="taskBox"><b>상황</b> · 인스타그램 카드에 넣을 <b>영어 문구</b>를 만들어요. <b>사진을 보고</b>, 그 사진에 <b>어울리면서</b>
        친구를 존중하는(<b>오류 없는</b>) 문구를 골라야 해요. 영어 문구는 <b>한국어 뜻을 꼭 확인</b>하고, 글자 위치·크기를 정해 올리세요.
        <b>[🔀 다른 사진]</b>을 누르면 사진이 바뀌고, 문구도 <b>마음에 들 때까지</b> 다시 추천받을 수 있어요.</div>

        <div class="device">${deviceBar("AI 카드 편집기","Canva형 텍스트 생성")}
          <div class="deviceBody">
            <div class="canvaWrap">
              <div class="canvaStage">
                <div class="canvaScene" id="cardPhoto">${themeScene(this.theme)}<div class="capLayer" id="capLayer"></div></div>
                <div class="photoMeta">📷 사진 상황 · <b id="themeDesc">${THEMES.find(t=>t.key===this.theme).desc}</b>
                  <button class="shuffleBtn" style="float:right" onclick="STEP2.shuffle()">🔀 다른 사진</button></div>
              </div>
              <div class="canvaPanel">
                <h5>✨ AI 문구 추천 (사진에 어울리게)</h5>
                <button class="btn primary" style="width:100%" onclick="STEP2.recommend()">AI 문구 추천 받기 🔄</button><span class="genCounter" id="genCount"></span>
                <div class="candGrid" id="cands"><div class="genEmpty" style="grid-column:1/-1">사진을 보고 추천받아 보세요.</div></div>
                <hr class="panelHr"><h5>글자 크기</h5>
                <div class="sizeRow">작게<input type="range" min="14" max="30" value="18" oninput="STEP2.size(this.value)">크게</div>
                <h5 style="margin-top:12px">글자 위치</h5><div class="posMini">${posBtns}</div>
                <hr class="panelHr"><button class="btn good" style="width:100%" onclick="STEP2.apply()">사진에 넣어 올리기</button>
              </div>
            </div>
          </div>
        </div>
        <div id="fb" class="feedback"></div>
        ${teacherBox(`<b>성취수행 기준</b> · B2-2. AI 도구로 산출물을 생성한다.<br>
          <b>측정 의도</b> · 매번 바뀌는 사진을 보고, <b>사진에 어울리고(fit)</b> 친구를 존중하며(ok) 뜻을 확인한 문구를 알맞은 위치에 배치.<br><br>
          <b>채점(모두 충족)</b> · ① 뜻 확인, ② 문구 ok=true(존중), ③ 문구 fit=현재 사진 상황(또는 fit=all), ④ 위치=아래쪽.<br>
          후보는 사진별로 ‘어울리는 좋은 문구 + 다른 상황 문구 + 대상화 문구’가 섞여 추천되며, <b>선택 데이터의 ok·fit로 채점</b>한다.`)}
      </div></section>`;
  },

  shuffle(){ let n; do{ n=THEMES[rint(THEMES.length)].key; }while(n===this.theme); this.theme=n;
    $("#cardPhoto").innerHTML=themeScene(this.theme)+'<div class="capLayer" id="capLayer"></div>';
    $("#themeDesc").textContent=THEMES.find(t=>t.key===this.theme).desc;
    this.cands=[]; this.sel=null; this.pos=null; this.count=0;
    $("#cands").innerHTML='<div class="genEmpty" style="grid-column:1/-1">새 사진에 어울리는 문구를 추천받아 보세요.</div>'; $("#genCount").textContent=""; feedback("","");
  },
  pool(){ const others=shuffle(THEMES.filter(t=>t.key!==this.theme)).slice(0,2)
      .flatMap(t=>this.TGOOD[t.key].map(c=>({...c,fit:[t.key],ok:true})));
    const mine=this.TGOOD[this.theme].map(c=>({...c,fit:[this.theme],ok:true}));
    return [...this.UNIV, ...mine, ...others, ...this.DIS]; },
  recommend(){ const fp=this.pool(); const key="s2-"+this.theme; const idx=AIGEN.pickN(key,fp.length,4).map(i=>fp[i]);
    this.cands=idx; this.sel=null; this.count++; $("#genCount").textContent=`추천 ${this.count}회`;
    $("#cands").innerHTML=this.cands.map((c,i)=>`<div class="choice" data-i="${i}" onclick="STEP2.select(${i})">
      <div class="cText">${c.en}</div>
      <button class="btn" style="margin-top:7px;font-size:12px;padding:6px 9px" onclick="event.stopPropagation();STEP2.showMeaning(${i})">🔤 뜻 보기</button>
      <div class="meaningBox" id="m${i}"><b>뜻</b> · ${c.ko}</div></div>`).join(""); feedback("","");
  },
  showMeaning(i){ $("#m"+i).classList.add("show"); this.checked.add(this.cands[i].en); },
  select(i){ this.sel=i; $$("#cands .choice").forEach(c=>c.classList.toggle("sel",+c.dataset.i===i)); this.preview(); },
  size(v){ document.documentElement.style.setProperty("--capSize",v+"px"); },
  pickPos(i){ this.pos=i; $$(".posMini .optBtn").forEach(b=>b.classList.toggle("sel",+b.dataset.p===i)); this.preview(); },
  preview(){ const cap=$("#capLayer"); if(!cap) return; if(this.sel===null){ cap.className="capLayer"; return; }
    cap.textContent=this.cands[this.sel].en; cap.className="capLayer show "+(this.pos!==null?"pos-"+this.POS[this.pos].v:"pos-bottom"); },
  fits(c){ return c.fit==="all" || (Array.isArray(c.fit)&&c.fit.includes(this.theme)); },
  apply(){
    if(this.sel===null){ feedback("AI 문구를 추천받고 하나를 고르세요.","warn"); return; }
    const c=this.cands[this.sel];
    if(!this.checked.has(c.en)){ feedback("올리기 전에 <b>[🔤 뜻 보기]</b>로 이 영어 문구가 무슨 뜻인지 확인하세요.","warn"); return; }
    if(!c.ok){ feedback(`이 문구는 올리기 어려워요. ${c.why} 다시 추천받아 알맞은 문구를 찾아보세요.`,"warn"); return; }
    if(!this.fits(c)){ feedback(`이 문구는 지금 사진(<b>${THEMES.find(t=>t.key===this.theme).desc}</b>)과 어울리지 않아요. 사진 상황에 맞는 문구를 골라 보세요.`,"warn"); return; }
    if(this.pos===null){ feedback("글자 위치를 정하세요.","warn"); return; }
    if(!this.POS[this.pos].ok){ feedback(`위치를 다시 정해 보세요. ${this.POS[this.pos].why}`,"warn"); return; }
    passStep("step2","정답입니다. 사진에 어울리고 친구를 존중하는 문구를, 뜻을 확인하고 알맞은 위치에 잘 올렸어요.");
  },
  mount(){ this.cands=[]; this.sel=null; this.checked=new Set(); this.pos=null; this.count=0; document.documentElement.style.setProperty("--capSize","18px"); }
};

/* ============================================================
   3단계 · 사진 배경 정리하기 (B2-2)
   매번 랜덤 사진 + 영역 드래그로 지우기 + 잘못 지우면 복원 + 자동 채우기 과장 점검(2단계 패스)
   ============================================================ */
const STEP3 = {
  CLUTTER:[
    {id:"c_pass",label:"지나가는 학생",draw:(x,y)=>`<circle cx="${x+20}" cy="${y+18}" r="16" fill="#cbd5e1"/><rect x="${x+6}" y="${y+34}" width="28" height="40" rx="10" fill="#94a3b8"/>`},
    {id:"c_post",label:"낡은 게시물",draw:(x,y)=>`<rect x="${x}" y="${y}" width="74" height="50" rx="5" fill="#fde68a" stroke="#d97706"/><line x1="${x+10}" y1="${y+16}" x2="${x+64}" y2="${y+16}" stroke="#b45309" stroke-width="3"/><line x1="${x+10}" y1="${y+30}" x2="${x+50}" y2="${y+30}" stroke="#b45309" stroke-width="3"/>`},
    {id:"c_can",label:"음료수 캔",draw:(x,y)=>`<rect x="${x+8}" y="${y}" width="22" height="34" rx="4" fill="#fda4af" stroke="#e11d48"/>`},
    {id:"c_broom",label:"청소 도구",draw:(x,y)=>`<line x1="${x}" y1="${y+40}" x2="${x+46}" y2="${y}" stroke="#a16207" stroke-width="5"/><rect x="${x-6}" y="${y+36}" width="20" height="14" fill="#fcd34d"/>`},
    {id:"c_bag",label:"남의 가방",draw:(x,y)=>`<rect x="${x}" y="${y+6}" width="44" height="38" rx="9" fill="#60a5fa" stroke="#2563eb"/><path d="M${x+10} ${y+10} q12 -14 24 0" fill="none" stroke="#2563eb" stroke-width="3"/>`},
    {id:"c_bin",label:"휴지통",draw:(x,y)=>`<path d="M${x} ${y} h36 l-5 44 h-26 z" fill="#d1d5db" stroke="#6b7280"/>`},
  ],
  SLOTS:[[30,30],[560,40],[40,300],[470,300],[300,20],[590,250],[20,170]],
  KEEP:["m1","m2","m3"], clutter:[], marked:new Set(), wrongErased:new Set(), phase:"clean",

  buildScene(){
    const pick=shuffle(this.CLUTTER).slice(0, 3+rint(2)); // 3~4개
    const slots=shuffle(this.SLOTS).slice(0,pick.length);
    this.clutter=pick.map((c,i)=>({...c, x:slots[i][0], y:slots[i][1]}));
    const keep=`${svgPerson('STEP3','m1',250,150,'#7aa2f7','지수')}${svgPerson('STEP3','m2',360,150,'#34d399','교류 친구')}
      <g class="obj" data-id="m3"><rect x="296" y="196" width="56" height="44" rx="6" fill="#fff" stroke="#f472b6" stroke-width="2"/><text x="324" y="223" text-anchor="middle" font-size="20">💌</text><rect class="ring" x="290" y="190" width="70" height="56" rx="8"/><text class="lbl" x="324" y="262" text-anchor="middle">함께 만든 카드</text></g>`;
    const cl=this.clutter.map(c=>`<g class="obj" data-id="${c.id}">${c.draw(c.x,c.y)}<rect class="ring" x="${c.x-8}" y="${c.y-8}" width="86" height="74" rx="8"/><text class="lbl" x="${c.x+34}" y="${c.y+70}" text-anchor="middle">${c.label}</text></g>`).join("");
    return `<svg class="eraseScene" id="s3scene" viewBox="0 0 680 380" role="img" aria-label="앨범 사진 정리">${keep}${cl}</svg>`;
  },

  render(){
    const s=STEPS[2];
    return `<section class="module">${stepHeader(s)}
      <div class="modBody">
        <div class="taskBox"><b>상황</b> · 앨범에 넣을 사진을 정리해요. 사진은 <b>열 때마다 달라져요</b>. 활동 장면(지수·교류 친구·카드)은 남기고,
        관계없는 것들을 <b>영역을 드래그해서</b> 지우세요. 너무 넓게 그리면 <b>친구까지 지워질 수</b> 있으니 그때는 <b>되돌리기</b>로 복원하세요.
        다 지우면 AI가 빈 곳을 <b>자동으로 채우는데</b>, 이상하게 생성되면 그 부분도 정리해야 해요.</div>

        <div class="eraseWrap">
          <div class="phaseBar"><span>진행:</span><span class="phasePill on" id="ph-clean">1) 관계없는 것 지우기</span><span class="phasePill" id="ph-auto">2) 자동 채우기 점검</span>
            <span class="markCount" id="markCount" style="margin-left:auto">선택 0개</span></div>
          ${this.buildScene()}
          <div class="eraseToolbar">
            <span class="eraseHint" id="s3hint">🖱️ 지울 영역을 드래그해서 감싸세요.</span>
            <button class="btn" onclick="STEP3.undo()">↩︎ 되돌리기(복원)</button>
            <button class="btn primary" style="margin-left:auto" onclick="STEP3.apply()">🧽 지우개 적용</button>
          </div>
          <div class="restoreBanner" id="s3restore"></div>
        </div>
        <div id="fb" class="feedback"></div>
        ${teacherBox(`<b>성취수행 기준</b> · B2-2. AI 도구로 산출물을 생성·편집한다.<br>
          <b>측정 의도</b> · 매번 달라지는 사진에서 <b>필요한 것은 남기고 불필요한 것만 영역 선택으로 제거</b>, 실수(과잉 선택) 시 <b>복원</b>, AI 자동 채우기의 <b>과장 생성물 점검</b>.<br><br>
          <b>채점</b> · (1단계) 무관한 잡동사니만 모두 지우고 활동 대상은 남김 → (2단계) 자동 채우기로 생긴 과장된 생성물까지 지우면 정답.
          활동 대상을 지우면 복원 안내, 과장 생성물을 남기면 미완료.`)}
      </div></section>`;
  },

  setHint(){ const n=this.marked.size; $("#markCount").textContent=`선택 ${n}개`; },
  dragDone(rect){
    const svg=$("#s3scene"); objsInRect(svg,rect).forEach(o=>{ const id=o.dataset.id; this.marked.add(id); o.classList.add("marked"); });
    this.setHint();
  },
  undo(){
    const svg=$("#s3scene");
    this.wrongErased.forEach(id=>{ const o=svg.querySelector(`.obj[data-id="${id}"]`); o.classList.remove("gone","marked"); });
    this.wrongErased.clear();
    this.marked.forEach(id=>{ const o=svg.querySelector(`.obj[data-id="${id}"]`); if(o) o.classList.remove("marked"); });
    this.marked.clear(); $("#s3restore").classList.remove("show"); this.setHint();
    feedback("되돌렸어요. 다시 정리해 보세요.","warn");
  },
  apply(){
    const svg=$("#s3scene");
    if(!this.marked.size){ feedback("지울 영역을 먼저 드래그해서 선택하세요.","warn"); return; }
    const keepIds = this.phase==="clean" ? this.KEEP : [...this.KEEP];
    const markedKeep=[...this.marked].filter(id=>keepIds.includes(id));
    // 적용: 표시된 것 지움
    this.marked.forEach(id=>{ const o=svg.querySelector(`.obj[data-id="${id}"]`); if(o){ o.classList.add("gone"); o.classList.remove("marked"); } });
    if(markedKeep.length){
      markedKeep.forEach(id=>this.wrongErased.add(id));
      const names=markedKeep.map(id=>svg.querySelector(`.obj[data-id="${id}"] .lbl`)?.textContent||"친구").join(", ");
      const b=$("#s3restore"); b.className="restoreBanner show";
      b.innerHTML=`⚠️ 영역을 너무 넓게 그려 <b>${names}</b>까지 지워졌어요! <button class="btn" onclick="STEP3.undo()">↩︎ 복원하기</button>`;
      this.marked.clear(); this.setHint(); return;
    }
    this.marked.clear(); this.setHint();
    if(this.phase==="clean"){
      const remain=this.clutter.filter(c=>!svg.querySelector(`.obj[data-id="${c.id}"]`).classList.contains("gone"));
      if(remain.length){ feedback(`아직 지우지 않은 게 남았어요 (${remain.length}개). 관계없는 것을 모두 영역으로 지워 주세요.`,"warn"); return; }
      this.autofill();
    } else {
      const auto=svg.querySelector('.obj[data-id="auto"]');
      if(auto && !auto.classList.contains("gone")){ feedback("AI가 자동 생성한 이상한 부분이 아직 남아 있어요. 그 부분을 영역으로 지워 주세요.","warn"); return; }
      passStep("step3","정답입니다. 관계없는 것을 지우고, AI가 과장되게 자동 생성한 부분까지 찾아 정리했어요.");
    }
  },
  autofill(){
    this.phase="auto"; $("#ph-clean").className="phasePill done"; $("#ph-auto").className="phasePill on";
    $("#s3hint").textContent="🖱️ 이상하게 생성된 부분을 드래그해서 지우세요.";
    const svg=$("#s3scene");
    const g=document.createElementNS('http://www.w3.org/2000/svg','g'); g.setAttribute('class','obj'); g.setAttribute('data-id','auto');
    g.innerHTML=`<circle cx="120" cy="150" r="34" fill="#fca5a5"/><circle cx="92" cy="120" r="16" fill="#f87171"/><circle cx="150" cy="118" r="18" fill="#f87171"/><circle cx="100" cy="185" r="14" fill="#f87171"/><circle cx="142" cy="186" r="15" fill="#f87171"/><path d="M120 150 l40 -30" stroke="#ef4444" stroke-width="6"/><rect class="ring" x="74" y="96" width="100" height="108" rx="10"/><text class="lbl" x="124" y="220" text-anchor="middle" fill="#b91c1c">AI 자동 생성(과장됨)</text>`;
    svg.appendChild(g);
    feedback("✨ AI가 빈 곳을 자동으로 채웠어요. 그런데 <b>과장되고 이상한 형태</b>가 생겼네요. 발표 사진에 맞지 않으니 그 부분을 찾아 지우세요.","warn");
  },
  mount(){ this.marked=new Set(); this.wrongErased=new Set(); this.phase="clean";
    setTimeout(()=>{ const svg=$("#s3scene"); if(svg) attachDrag(svg,r=>this.dragDone(r)); },0); }
};

/* ============================================================
   4단계 · 사진으로 추억 영상 만들기 (B2-2) · 애니메이션 미리보기
   ============================================================ */
const STEP4 = {
  GROUPS:[
    {key:"len",label:"영상 길이",opts:[{t:"약 15초",ok:true},{t:"30초",ok:true},{t:"3분",ok:false},{t:"10분",ok:false}]},
    {key:"trans",label:"전환 효과 (누르면 미리보기 재생)",opts:[{t:"부드럽게",fx:"fade",ok:true},{t:"슬라이드",fx:"slide",ok:true},{t:"천천히 줌인",fx:"zoom",ok:true},{t:"빠른 번쩍임",fx:"flash",ok:false},{t:"글리치 지지직",fx:"glitch",ok:false}]},
    {key:"comp",label:"사진 구성",opts:[{t:"세 친구를 골고루",ok:true},{t:"한 친구만 계속 클로즈업",ok:false}]},
    {key:"music",label:"배경 음악",opts:[{t:"잔잔하고 따뜻하게",ok:true},{t:"신나고 자극적으로",ok:false},{t:"무섭고 긴장되게",ok:false}]},
  ],
  uploaded:false, sel:{}, timer:null,
  render(){ const s=STEPS[3];
    const groups=this.GROUPS.map(g=>`<div class="optRow"><div class="optLabel">${g.label}</div><div class="optBtns">${g.opts.map((o,i)=>`<button class="optBtn" data-g="${g.key}" data-i="${i}" onclick="STEP4.pick('${g.key}',${i})">${o.t}</button>`).join("")}</div></div>`).join("");
    return `<section class="module">${stepHeader(s)}<div class="modBody">
      <div class="taskBox"><b>상황</b> · 교류 친구와 함께 본 <b>따뜻한 추억 영상</b>을 만들어요. 사진을 업로드하고, 길이·전환·구성·배경 음악을 <b>상황에 맞게</b> 골라 만드세요. 전환 효과는 누르면 <b>실제 미리보기가 재생</b>돼요.</div>
      <div class="device">${deviceBar("AI 영상 편집기","사진 → 영상")}<div class="deviceBody">
        <div id="upArea"><div class="uploadZone" onclick="STEP4.upload()">⬆️ 사진 업로드하기<br><span style="font-size:12px;font-weight:600;color:#94a3b8">(클릭하면 추억 사진 3장을 불러옵니다)</span></div></div>
        <div id="editArea" style="display:none">
          <div class="vstage" id="vstage"><div class="vslide" data-i="0">👋<div class="vcap">환영 인사</div></div><div class="vslide" data-i="1">🎨<div class="vcap">함께 카드 만들기</div></div><div class="vslide" data-i="2">📸<div class="vcap">단체 사진</div></div></div>
          ${groups}<div style="margin-top:14px"><button class="btn primary" onclick="STEP4.make()">추억 영상 만들기 ▶</button></div>
        </div></div></div>
      <div id="fb" class="feedback"></div>
      ${teacherBox(`<b>성취수행 기준</b> · B2-2. 다양한 형태의 산출물을 생성한다.<br><b>채점</b> · 길이=15/30초, 전환=부드럽게/슬라이드/줌인, 구성=골고루, 배경음=잔잔 → 정답. 자극적·과장 선택은 오류.`)}
    </div></section>`;
  },
  upload(){ this.uploaded=true; $("#upArea").style.display="none"; $("#editArea").style.display="block"; this.playPreview("fade"); feedback("사진 3장을 불러왔어요. 전환 효과를 눌러 미리보기를 보고 옵션을 골라 만들어 보세요.","warn"); },
  pick(key,i){ this.sel[key]=i; $$(`.optBtn[data-g="${key}"]`).forEach(b=>b.classList.toggle("sel",+b.dataset.i===i)); if(key==="trans") this.playPreview(this.GROUPS[1].opts[i].fx); },
  playPreview(fx){ clearInterval(this.timer); const stage=$("#vstage"); if(!stage) return; stage.className="vstage fx-"+fx;
    const slides=$$("#vstage .vslide"); let i=0; const show=()=>{ slides.forEach(s=>s.classList.remove("active")); slides[i].classList.add("active"); }; show();
    this.timer=setInterval(()=>{ if(!document.body.contains(stage)){ clearInterval(this.timer); return; } i++; if(i>=slides.length){ clearInterval(this.timer); return; } show(); },950); },
  make(){ if(!this.uploaded){ feedback("먼저 사진을 업로드하세요.","warn"); return; }
    const missing=this.GROUPS.filter(g=>this.sel[g.key]===undefined); if(missing.length){ feedback(`아직 고르지 않은 항목이 있어요: ${missing.map(g=>g.label.replace(/ \(.*\)/,'')).join(", ")}.`,"warn"); return; }
    const wrong=this.GROUPS.filter(g=>!g.opts[this.sel[g.key]].ok); if(wrong.length){ feedback(`⚠️ 영상 만들기 오류 · 어울리지 않는 선택: <b>${wrong.map(g=>g.label.replace(/ \(.*\)/,'')).join(", ")}</b>. 차분하고 따뜻하게 다시 골라 주세요.`,"bad"); return; }
    this.playPreview(this.GROUPS[1].opts[this.sel.trans].fx); passStep("step4","정답입니다. 짧고 부드럽고 잔잔하며 골고루 담긴 따뜻한 추억 영상을 만들었어요. 🎬"); },
  mount(){ this.uploaded=false; this.sel={}; clearInterval(this.timer); }
};

/* ============================================================
   5단계 · 자동 번역 자막 수정 (B2-3) · 10트랙 + 재생 + 노골적 오타
   ============================================================ */
const STEP5 = {
  LINES:[
    {emoji:"👋", ko:"안녕, 친구들!",                ai:"Hello, friends!",                 check:_=>true},
    {emoji:"🪪", ko:"내 친구 이름은 지수예요.",        ai:"My friend's name is Banana.",     check:v=>/jisu/i.test(v)&&!/banana/i.test(v), why:"이름 ‘지수’가 ‘Banana(바나나)’로 황당하게 번역됐어요. → Jisu"},
    {emoji:"😀", ko:"우리는 좋은 친구예요.",          ai:"We are good friends.",            check:_=>true},
    {emoji:"👥", ko:"우리 반은 28명이에요.",          ai:"Our class has 2800 students.",    check:v=>/(^|\D)28(\D|$)/.test(v)&&!/2800/.test(v), why:"‘28명’이 ‘2800명’으로 잘못 번역됐어요. → 28"},
    {emoji:"🏃", ko:"우리는 함께 놀았어요.",          ai:"We played together.",             check:_=>true},
    {emoji:"🎤", ko:"민준이가 노래했어요.",            ai:"Robot sang a song.",              check:v=>/minjun/i.test(v)&&!/robot/i.test(v), why:"이름 ‘민준’이 ‘Robot(로봇)’으로 황당하게 번역됐어요. → Minjun"},
    {emoji:"😊", ko:"우리는 행복해요.",              ai:"We are happy.",                   check:_=>true},
    {emoji:"📸", ko:"우리는 사진 5장을 찍었어요.",      ai:"We took 500 photos.",             check:v=>/(^|\D)5(\D|$)/.test(v)&&!/500/.test(v), why:"‘5장’이 ‘500장’으로 잘못 번역됐어요. → 5"},
    {emoji:"🙏", ko:"고마워, 친구야.",              ai:"Thank you, friend.",              check:_=>true},
    {emoji:"👋", ko:"내일 또 만나!",                ai:"See you tomorrow!",               check:_=>true},
  ],
  val:[], sel:0, viewKo:false, timer:null,
  render(){ const s=STEPS[4];
    const tl=this.LINES.map((l,i)=>`<div class="seg ${i===0?'active':''}" data-i="${i}" onclick="STEP5.selectSeg(${i})">${i+1}<small>${l.emoji}</small></div>`).join("");
    return `<section class="module">${stepHeader(s)}<div class="modBody">
      <div class="taskBox"><b>상황</b> · 추억 영상에 AI가 자동 번역으로 <b>영어 자막</b> 10개를 달았어요. 그런데 <b>이름이나 숫자가 엉뚱하게 바뀐</b> 자막이 섞여 있어요.
      <b>[▶ 재생]</b>으로 영상을 처음부터 보며(그림이 넘어가요), 자막을 <b>원문(한국어)과 비교</b>해 틀린 곳을 <b>직접 고쳐</b> 저장하세요. (영어를 몰라도 이름·숫자로 찾을 수 있어요.)</div>
      <div class="device">${deviceBar("AI 영상 자막 편집기","자동 번역 자막")}<div class="deviceBody">
        <div class="playRow"><button class="btn primary" onclick="STEP5.play()">▶ 재생</button>
          <button class="viewTab on" id="vtSub" onclick="STEP5.view(false)">번역 자막</button>
          <button class="viewTab" id="vtKo" onclick="STEP5.view(true)">원문 보기</button></div>
        <div class="videoStage"><span id="vEmoji" style="font-size:70px">${this.LINES[0].emoji}</span><div class="subOverlay" id="subOverlay">${this.LINES[0].ai}</div></div>
        <div class="timeline" id="s5tl">${tl}</div>
        <div class="editLineBox">
          <div class="ko">선택한 자막 ${"<b id='segNo'>1</b>"} · 원문(한국어): <b id="koRef">${this.LINES[0].ko}</b></div>
          <input class="subEdit" id="subEdit" value="${this.LINES[0].ai}" oninput="STEP5.edit(this.value)">
          <div class="subNote">원문과 이름·숫자가 같은지 확인하고 틀린 부분만 고치세요. 고치면 영상 자막이 바로 바뀌어요.</div>
        </div>
        <div style="margin-top:14px"><button class="btn primary" onclick="STEP5.save()">수정 후 저장</button></div>
      </div></div>
      <div id="fb" class="feedback"></div>
      ${teacherBox(`<b>성취수행 기준</b> · B2-3. AI 산출물을 목적에 맞게 수정·개선한다.<br>
        <b>측정 의도</b> · 외국어 실력과 무관하게, 원문과 비교해 <b>자동 번역의 노골적 오류(이름·숫자)를 발견·수정</b>.<br><br>
        <b>오류 자막(4개)</b> · 2번 지수→Banana, 4번 28→2800, 6번 민준→Robot, 8번 5→500. 모두 바르게 고치면 정답(나머지 6개는 정상).`)}
    </div></section>`;
  },
  view(ko){ this.viewKo=ko; $("#vtKo").classList.toggle("on",ko); $("#vtSub").classList.toggle("on",!ko); $("#subOverlay").classList.toggle("koMode",ko); this.refreshOverlay(); },
  refreshOverlay(){ const ov=$("#subOverlay"); if(ov) ov.textContent=this.viewKo?this.LINES[this.sel].ko:this.val[this.sel]; },
  selectSeg(i){ this.sel=i; $$("#s5tl .seg").forEach(s=>s.classList.toggle("active",+s.dataset.i===i));
    $("#vEmoji").textContent=this.LINES[i].emoji; $("#segNo").textContent=i+1; $("#koRef").textContent=this.LINES[i].ko;
    $("#subEdit").value=this.val[i]; this.refreshOverlay(); },
  edit(v){ this.val[this.sel]=v; if(!this.viewKo) $("#subOverlay").textContent=v; },
  play(){ clearInterval(this.timer); const stage=$("#videoStage")||$(".videoStage"); let i=0;
    const tick=()=>{ if(!document.body.contains($(".videoStage"))){ clearInterval(this.timer); return; }
      $$("#s5tl .seg").forEach(s=>s.classList.toggle("playing",+s.dataset.i===i));
      $("#vEmoji").textContent=this.LINES[i].emoji; $("#subOverlay").classList.remove("koMode");
      $("#subOverlay").textContent=this.val[i]; };
    tick(); this.timer=setInterval(()=>{ i++; if(i>=this.LINES.length){ clearInterval(this.timer); $$("#s5tl .seg").forEach(s=>s.classList.remove("playing")); this.refreshOverlay(); return; } tick(); },1100); },
  save(){ const bad=this.LINES.map((l,i)=>({l,i})).filter(({l,i})=>!l.check(this.val[i]));
    if(bad.length){ const fix=bad.filter(({l})=>l.why);
      feedback(fix.length?`아직 고쳐야 할 자막이 있어요: <b>${fix.map(x=>x.i+1+"번").join(", ")}</b>. [원문 보기]로 이름·숫자를 다시 비교하세요.`:`자막 ${bad.map(x=>x.i+1).join(", ")}번을 다시 확인하세요.`,"warn"); return; }
    passStep("step5","정답입니다. 자동 번역에서 이름과 숫자가 엉뚱하게 바뀐 자막 4개를 모두 찾아 바르게 고쳤어요."); },
  mount(){ this.val=this.LINES.map(l=>l.ai); this.sel=0; this.viewKo=false; clearInterval(this.timer); }
};

/* ============================================================
   6단계 · 친구 사진 동의·개인정보 (C2-3) · 영역 드래그 + 지우개/모자이크 + 복원
   ============================================================ */
const STEP6 = {
  KEEP:["f1","f2","f3"], PROTECT:["p1","p2","p3","p4","p5"], action:"erase", marked:new Set(), wrongCovered:new Set(),
  scene(){
    const item=(id,x,y,w,h,fill,stroke,inner,label)=>`<g class="obj" data-id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="2"/>${inner}<rect class="ring" x="${x-6}" y="${y-6}" width="${w+12}" height="${h+12}" rx="10"/><text class="lbl" x="${x+w/2}" y="${y+h+18}" text-anchor="middle">${label}</text></g>`;
    return `<svg class="eraseScene" id="s6scene" viewBox="0 0 680 380" role="img" aria-label="학급 단체 사진 개인정보 점검">
      ${svgPerson('STEP6','f1',150,140,'#7aa2f7','지수 (동의함)')}${svgPerson('STEP6','f2',250,140,'#34d399','교류 친구 (동의함)')}${svgPerson('STEP6','f3',350,140,'#f59e0b','친구 A (동의함)')}
      ${svgPerson('STEP6','p1',455,140,'#a78bfa','친구 B (동의 안 함)')}${svgPerson('STEP6','p2',610,110,'#94a3b8','지나가던 학생',20)}
      ${item('p3',40,288,176,42,'#fff','#f59e0b','<text x="128" y="314" text-anchor="middle" font-size="13" fill="#334155">이서연 010-1234-5678</text>','이름표 (이름·전화)')}
      ${item('p4',250,288,118,72,'#eef2ff','#6366f1','<circle cx="278" cy="320" r="13" fill="#c7d2fe"/><line x1="300" y1="312" x2="356" y2="312" stroke="#818cf8" stroke-width="4"/><line x1="300" y1="326" x2="356" y2="326" stroke="#818cf8" stroke-width="4"/>','학생증')}
      ${item('p5',468,300,176,40,'#dcfce7','#16a34a','<text x="556" y="325" text-anchor="middle" font-size="12" fill="#166534">행복아파트 101동 1502호</text>','집 주소 표지')}
    </svg>`;
  },
  render(){ const s=STEPS[5];
    return `<section class="module">${stepHeader(s)}<div class="modBody">
      <div class="taskBox"><b>상황</b> · 앨범에 넣을 <b>학급 단체 사진</b>이에요. 사진 사용에 <b>동의하지 않은 친구</b>·지나가던 학생과 이름·전화번호가 적힌 <b>이름표·학생증·집 주소</b> 같은 개인정보가 함께 찍혔어요.
      <b>영역을 드래그</b>해서 보호할 대상을 감싸고 <b>지우개</b>나 <b>모자이크</b>로 가리세요. 동의한 친구까지 가리면 <b>되돌리기</b>로 복원하세요.</div>
      <div class="eraseWrap">
        <div class="phaseBar"><span>도구:</span><div class="actionToggle"><button class="segBtn on" id="act-erase" onclick="STEP6.setAction('erase')">🧽 지우개</button><button class="segBtn" id="act-mosaic" onclick="STEP6.setAction('mosaic')">▦ 모자이크</button></div><span class="markCount" id="markCount" style="margin-left:auto">선택 0개</span></div>
        ${this.scene()}
        <div class="eraseToolbar"><span class="eraseHint">🖱️ 보호할 대상을 영역으로 감싼 뒤 적용하세요.</span>
          <button class="btn" onclick="STEP6.undo()">↩︎ 되돌리기(복원)</button>
          <button class="btn primary" style="margin-left:auto" onclick="STEP6.apply()">적용</button></div>
        <div class="restoreBanner" id="s6restore"></div>
      </div>
      <div id="fb" class="feedback"></div>
      ${teacherBox(`<b>성취수행 기준</b> · C2-3. AI 윤리 원칙(동의·개인정보) 준수.<br>
        <b>채점</b> · 동의 안 한 친구 B·지나가던 학생·이름표·학생증·집 주소(5개)를 지우개/모자이크로 가리면 정답. 동의한 친구를 가리면 복원 안내, 개인정보를 남기면 미완료.`)}
    </div></section>`;
  },
  setAction(a){ this.action=a; $("#act-erase").classList.toggle("on",a==="erase"); $("#act-mosaic").classList.toggle("on",a==="mosaic"); },
  covered(o){ return o.classList.contains("gone")||o.classList.contains("mosaicCSS"); },
  dragDone(rect){ const svg=$("#s6scene"); objsInRect(svg,rect).forEach(o=>{ if(this.covered(o))return; this.marked.add(o.dataset.id); o.classList.add("marked"); }); $("#markCount").textContent=`선택 ${this.marked.size}개`; },
  undo(){ const svg=$("#s6scene"); this.wrongCovered.forEach(id=>{ const o=svg.querySelector(`.obj[data-id="${id}"]`); o.classList.remove("gone","mosaicCSS","marked"); }); this.wrongCovered.clear();
    this.marked.forEach(id=>{ const o=svg.querySelector(`.obj[data-id="${id}"]`); if(o)o.classList.remove("marked"); }); this.marked.clear();
    $("#s6restore").classList.remove("show"); $("#markCount").textContent="선택 0개"; feedback("되돌렸어요. 다시 해 보세요.","warn"); },
  apply(){ const svg=$("#s6scene"); if(!this.marked.size){ feedback("보호할 대상을 먼저 영역으로 선택하세요.","warn"); return; }
    const markedKeep=[...this.marked].filter(id=>this.KEEP.includes(id));
    this.marked.forEach(id=>{ const o=svg.querySelector(`.obj[data-id="${id}"]`); o.classList.remove("marked"); o.classList.add(this.action==="erase"?"gone":"mosaicCSS"); });
    if(markedKeep.length){ markedKeep.forEach(id=>this.wrongCovered.add(id));
      const names=markedKeep.map(id=>svg.querySelector(`.obj[data-id="${id}"] .lbl`).textContent).join(", ");
      const b=$("#s6restore"); b.className="restoreBanner show"; b.innerHTML=`⚠️ 동의한 친구 <b>${names}</b>까지 가려졌어요! <button class="btn" onclick="STEP6.undo()">↩︎ 복원하기</button>`;
      this.marked.clear(); $("#markCount").textContent="선택 0개"; return; }
    this.marked.clear(); $("#markCount").textContent="선택 0개";
    const missed=this.PROTECT.filter(id=>!this.covered(svg.querySelector(`.obj[data-id="${id}"]`)));
    if(missed.length){ feedback(`아직 보호하지 않은 개인정보가 있어요 (${missed.length}개). 동의 안 한 얼굴·이름표·학생증·집 주소를 모두 가려 주세요.`,"warn"); return; }
    passStep("step6","정답입니다. 동의받지 않은 얼굴과 이름·전화·학생증·주소 같은 개인정보를 모두 가리고, 동의한 친구는 남겼어요."); },
  mount(){ this.action="erase"; this.marked=new Set(); this.wrongCovered=new Set(); setTimeout(()=>{ const svg=$("#s6scene"); if(svg) attachDrag(svg,r=>this.dragDone(r)); },0); }
};

/* ============================================================
   7단계 · 인스타그램 공식 게시 (C2-2) · 사진(랜덤) 보고 어울리는 글, 요청 DB
   ============================================================ */
const STEP7 = {
  REQS:[{t:"존중하는 표현으로",good:true},{t:"짧고 친근하게",good:true},{t:"특정 나라·문화 강조하지 않기",good:true},{t:"따뜻한 말투로",good:true},{t:"우리 반 중심으로",good:true},
        {t:"더 재미있게 신기함 강조",good:false},{t:"화려하고 길게",good:false},{t:"외국에서 온 점 강조",good:false},{t:"웃긴 느낌으로",good:false}],
  SHARES:[{t:"학교 공식 계정 · 학급에게만 (동의·검토 완료)",icon:"🏫",ok:true},{t:"학교 공식 계정 · 전체 공개",icon:"📣",ok:false,why:"동의받은 학급 범위를 넘어 전체 공개는 알맞지 않아요."},{t:"내 개인 계정 · 전체 공개",icon:"📱",ok:false,why:"친구들의 사진·개인정보가 있어 개인 계정 전체 공개는 안 돼요."}],
  ACT:{card:"환영 카드를 함께 만든",play:"운동장에서 함께 뛰논",kimchi:"함께 김치를 만든",group:"다 함께 사진을 찍은",lunch:"함께 점심을 먹은"},
  NOUN:["소중한 시간","즐거운 하루","따뜻한 추억","고마운 친구","좋은 기억","행복한 순간","특별한 날","우리들의 이야기"],
  TAIL:[" 😊"," 💛"," ✨"," 🤝"," 🌟",""],
  BAD:[], theme:null, reqs:new Set(), item:null, used:false, tSel:null, count:0,
  build(){ const ad=["신기한","이국적인","진귀한","웃긴","구경거리 같은","특이한","불쌍한"],n2=["외국 친구","외국인 손님","먼 나라 친구","이방인 친구"],t2=["✨ 등장!","ㅋㅋ","!!","🎪 신기방기"];
    this.BAD=[]; ad.forEach(a=>n2.forEach(n=>t2.forEach(t=>this.BAD.push({text:`${a} ${n} ${t}`,ok:false,why:"친구를 구경거리처럼 보거나 특정 나라를 강조한 표현이에요."})))); },
  goodPool(){ const a=this.ACT[this.theme]; const out=[]; this.NOUN.forEach(n=>this.TAIL.forEach(t=>out.push({text:`${a} ${n}${t}`,ok:true}))); return out; },
  render(){ const s=STEPS[6]; this.build(); this.theme=THEMES[rint(THEMES.length)].key;
    const reqChips=this.REQS.map((r,i)=>`<button class="segBtn" data-r="${i}" onclick="STEP7.toggleReq(${i})">${r.t}</button>`).join("");
    const targets=this.SHARES.map((t,i)=>`<div class="shareOpt" data-i="${i}" onclick="STEP7.pickTarget(${i})"><span class="so">${t.icon}</span>${t.t}</div>`).join("");
    return `<section class="module">${stepHeader(s)}<div class="modBody">
      <div class="taskBox"><b>상황</b> · 완성한 앨범 사진을 인스타그램에 <b>공식적으로 게시</b>해요. <b>사진을 보고</b> 어울리는 글을 써야 하는데, AI가 만든 문구에 친구를
      <b>구경거리처럼 보거나 놀리는 표현</b>이 섞여 있어요. AI에게 <b>요청을 고르고</b> <b>마음에 들 때까지 여러 번</b> 다시 쓰며 다듬고, 공유 범위와 AI 표시를 정해 게시하세요. <b>[🔀 다른 사진]</b>으로 사진을 바꿀 수 있어요.</div>
      <div class="device">${deviceBar("인스타그램 게시","공유 전 점검")}<div class="deviceBody"><div class="igWrap">
        <div class="ig">
          <div class="igTop"><div class="igAvatar">초</div><div class="igUser">행복초 3학년 1반<small>welcome_album</small></div><div class="igDots">⋯</div></div>
          <div class="igPhoto" id="igPhoto" style="padding:0">${themeScene(this.theme)}<div class="igPhotoCap" id="igCap">${"외국에서 와서 신기한 우리 친구!"}</div></div>
          <div class="igActions"><span>♡</span><span>💬</span><span>✈️</span><span class="sp">🔖</span></div>
          <div class="igCap"><b>welcome_album</b> <span class="igCapText" id="igCapText">외국에서 와서 신기한 우리 친구!</span></div>
          <div style="padding:8px 12px"><button class="shuffleBtn" onclick="STEP7.shuffle()">🔀 다른 사진</button> <span class="themeTag" id="themeTag">사진: ${THEMES.find(t=>t.key===this.theme).desc}</span></div>
        </div>
        <div class="igPanel">
          <div class="sectionLabel">① AI에게 요청할 내용 (여러 개)</div><div class="reqChipRow">${reqChips}</div>
          <button class="btn" onclick="STEP7.aiRewrite()">✨ AI에게 문구 다시 써 달라기</button><span class="genCounter" id="reqCount"></span>
          <div class="sectionLabel">② 표현 점검 체크리스트</div>
          <div class="checklist" id="checklist">
            <div class="checkRow" id="ck-expr"><span class="ck">✓</span><span>문구에 친구를 구경거리처럼 보거나 놀리는 표현이 없는가</span></div>
            <div class="checkRow" id="ck-target"><span class="ck">✓</span><span>공유 범위가 사진 속 친구들에게 알맞은가</span></div>
            <div class="checkRow" id="ck-ai"><span class="ck">✓</span><span>AI 도구를 사용했음을 표시했는가</span></div>
          </div>
          <div class="sectionLabel">③ 공유 범위</div><div class="shareOpts" id="targets">${targets}</div>
          <label class="aiFlag"><input type="checkbox" id="aiFlag" onchange="STEP7.refreshCheck()"><span>이 게시물은 <b>AI 번역·생성 도구</b>를 사용해 만들었습니다. (#AI사용)</span></label>
          <div style="margin-top:14px"><button class="btn primary" style="width:100%" onclick="STEP7.save()">점검 완료하고 게시하기</button></div>
        </div>
      </div></div></div>
      <div id="fb" class="feedback"></div>
      ${teacherBox(`<b>성취수행 기준</b> · C2-2. 차별적·편향적 요소를 인식하고 포용적으로 개선한다.<br>
        <b>측정 의도</b> · 사진을 보고 어울리는 글을, AI에게 <b>적절히 요청</b>해 마음에 들 때까지 다시 받아 존중적으로 다듬고, 공유 범위·AI 표시를 적절히 설정.<br><br>
        <b>채점(모두 충족)</b> · ① 최종 문구 데이터 ok=true(대상화 없음, 사진 활동을 반영), ② 공유 범위=학교 공식·학급, ③ AI 사용 표시. 요청에 부적절 항목이 들어가면 ok=false 문구가 생성돼 통과되지 않음. 좋은 문구 풀은 사진 테마별로 생성되어 ‘사진에 어울리는 글’이 된다.`)}
    </div></section>`;
  },
  shuffle(){ let n; do{ n=THEMES[rint(THEMES.length)].key; }while(n===this.theme); this.theme=n;
    $("#igPhoto").innerHTML=themeScene(this.theme)+`<div class="igPhotoCap" id="igCap">${this.item?this.item.text:"외국에서 와서 신기한 우리 친구!"}</div>`;
    $("#themeTag").textContent="사진: "+THEMES.find(t=>t.key===this.theme).desc; feedback("사진을 바꿨어요. 이 사진에 어울리는 글을 다시 써 보세요.","warn"); },
  toggleReq(i){ if(this.reqs.has(i))this.reqs.delete(i); else this.reqs.add(i); $$(`.segBtn[data-r="${i}"]`).forEach(b=>b.classList.toggle("on",this.reqs.has(i))); },
  aiRewrite(){ const chosen=[...this.reqs].map(i=>this.REQS[i]); const hasBad=chosen.some(r=>!r.good),hasGood=chosen.some(r=>r.good);
    let pool,key; if(chosen.length===0){ pool=[{text:"오늘의 사진입니다!",ok:false,why:"사진에 어울리는 내용이 잘 드러나지 않아요. 요청을 골라 다시 써 보세요."},{text:"사진 한 장 올려요!",ok:false,why:"사진 상황이 드러나지 않아요. 요청을 골라 보세요."}]; key="s7-neu"; }
      else if(hasBad||!hasGood){ pool=this.BAD; key="s7-bad"; } else { pool=this.goodPool(); key="s7-good-"+this.theme; }
    this.item=pool[AIGEN.nextIndex(key,pool.length)]; this.used=true; this.count++;
    $("#igCap").textContent=this.item.text; $("#igCapText").textContent=this.item.text; $("#reqCount").textContent=`다시쓰기 ${this.count}회`;
    feedback("AI가 요청에 따라 문구를 다시 썼어요. 마음에 안 들면 요청을 바꿔 다시 눌러 보세요.","warn"); this.refreshCheck(); },
  pickTarget(i){ this.tSel=i; $$("#targets .shareOpt").forEach(c=>c.classList.toggle("sel",+c.dataset.i===i)); this.refreshCheck(); },
  refreshCheck(){ const exprOk=this.used&&this.item&&this.item.ok, targetOk=this.tSel!==null&&this.SHARES[this.tSel].ok, aiOk=$("#aiFlag")&&$("#aiFlag").checked;
    const set=(id,ok,started)=>{ const e=$(id); if(!e)return; e.classList.toggle("done",ok); e.classList.toggle("fail",started&&!ok); e.querySelector(".ck").textContent=ok?"✓":(started?"✕":"✓"); };
    set("#ck-expr",exprOk,this.used); set("#ck-target",targetOk,this.tSel!==null); set("#ck-ai",aiOk,this.used||this.tSel!==null); },
  save(){ if(!this.used){ feedback("먼저 요청을 골라 [AI에게 문구 다시 써 달라기]로 사진에 어울리는 문구를 만들어 보세요.","warn"); return; }
    if(!this.item.ok){ feedback(`문구를 다시 보세요. ${this.item.why} ‘존중하는 표현으로’ 같은 요청으로 바꿔 다시 써 보세요.`,"warn"); return; }
    if(this.tSel===null){ feedback("공유 범위를 정하세요.","warn"); return; }
    if(!this.SHARES[this.tSel].ok){ feedback(`공유 범위를 다시 보세요. ${this.SHARES[this.tSel].why}`,"warn"); return; }
    if(!$("#aiFlag").checked){ feedback("AI 도구를 사용했으니 <b>AI 사용 표시</b>에 체크해 주세요.","warn"); return; }
    passStep("step7","정답입니다. 사진에 어울리는 존중하는 문구로 다듬고, 학교 공식·학급 범위로 정하고, AI 사용도 표시해 게시했어요. 🎉"); },
  mount(){ this.reqs=new Set(); this.item=null; this.used=false; this.tSel=null; this.count=0; }
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
