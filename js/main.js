/* ==========================================================
   원클리닉 — 공통 스크립트
   헤더/푸터/플로팅 버튼 렌더링, 폼 전송, 슬라이더, 자가체크 등
   ========================================================== */
(function () {
  "use strict";
  const S = window.SITE || {};
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const telHref = "tel:" + (S.phone || "").replace(/[^0-9+]/g, "");

  /* ---------- 고민 분류 ---------- */
  const CONCERNS = {
    pigment: { name: "기미·잡티·색소", en: "PIGMENT" },
    acne:    { name: "여드름·모공·흉터", en: "ACNE & PORE" },
    lifting: { name: "탄력·리프팅", en: "LIFTING" },
    contour: { name: "윤곽·볼륨", en: "CONTOUR" },
    hair:    { name: "레이저 제모", en: "HAIR REMOVAL" },
    body:    { name: "한방 다이어트·바디", en: "BODY & DIET" }
  };
  window.CONCERNS = CONCERNS;

  /* ---------- 추상 일러스트 (인물 사진 대체) ---------- */
  const ART = {
    pigment: `<svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="gp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F4E9DA"/><stop offset="1" stop-color="#E2CDB0"/></linearGradient><radialGradient id="gp2"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><rect width="400" height="500" fill="url(#gp)"/><circle cx="260" cy="170" r="190" fill="url(#gp2)"/>${[[90,90,9,.5],[140,150,6,.4],[320,80,7,.45],[210,60,4,.35],[60,210,5,.3],[300,250,5,.25],[180,230,3,.2],[120,300,4,.15],[350,190,3,.2]].map(d=>`<circle cx="${d[0]}" cy="${d[1]}" r="${d[2]}" fill="#9C7A55" opacity="${d[3]}"/>`).join("")}</svg>`,
    acne: `<svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E3ECE4"/><stop offset="1" stop-color="#C6D8CB"/></linearGradient></defs><rect width="400" height="500" fill="url(#ga)"/>${[[110,120],[280,90],[200,210],[320,250],[80,270],[240,330]].map((p,i)=>`<g opacity="${.55-i*.06}"><circle cx="${p[0]}" cy="${p[1]}" r="34" fill="none" stroke="#5E8470" stroke-width="1"/><circle cx="${p[0]}" cy="${p[1]}" r="18" fill="none" stroke="#5E8470" stroke-width="1"/><circle cx="${p[0]}" cy="${p[1]}" r="5" fill="#5E8470"/></g>`).join("")}</svg>`,
    lifting: `<svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="gl" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#E7E1EC"/><stop offset="1" stop-color="#F5EFE6"/></linearGradient></defs><rect width="400" height="500" fill="url(#gl)"/>${Array.from({length:9},(_,i)=>`<path d="M-20 ${360-i*28} C 120 ${300-i*34}, 260 ${200-i*30}, 420 ${110-i*26}" fill="none" stroke="#8C7A9B" stroke-width="1.2" opacity="${.15+i*.06}"/>`).join("")}</svg>`,
    contour: `<svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="gc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F7E4D8"/><stop offset="1" stop-color="#EBC9B4"/></linearGradient></defs><rect width="400" height="500" fill="url(#gc)"/><ellipse cx="200" cy="170" rx="120" ry="150" fill="none" stroke="#B07C5E" stroke-width="1.2" opacity=".5"/><ellipse cx="200" cy="170" rx="92" ry="124" fill="none" stroke="#B07C5E" stroke-width="1" opacity=".35"/><ellipse cx="200" cy="170" rx="64" ry="96" fill="#fff" opacity=".35"/></svg>`,
    hair: `<svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="gh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EEF1EC"/><stop offset="1" stop-color="#D7E0D8"/></linearGradient></defs><rect width="400" height="500" fill="url(#gh)"/>${Array.from({length:22},(_,i)=>{const x=20+i*17;const h=60+((i*37)%90);return `<line x1="${x}" y1="${80}" x2="${x+6}" y2="${80+h}" stroke="#6F8A7A" stroke-width="1.4" stroke-linecap="round" opacity="${i<11?.5:.12}"/>`}).join("")}<rect x="196" y="60" width="2" height="200" fill="#B08D57" opacity=".7"/></svg>`,
    body: `<svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="gb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E6E9D6"/><stop offset="1" stop-color="#CFD6B8"/></linearGradient></defs><rect width="400" height="500" fill="url(#gb)"/><g fill="none" stroke="#5E7448" stroke-width="1.3" opacity=".55"><path d="M200 300 C 150 230, 150 140, 200 60 C 250 140, 250 230, 200 300 Z"/><path d="M200 300 L200 70"/><path d="M200 300 C 120 280, 70 220, 60 150 C 130 160, 180 220, 200 300 Z"/><path d="M200 300 C 280 280, 330 220, 340 150 C 270 160, 220 220, 200 300 Z"/></g></svg>`
  };
  window.ART = ART;

  /* ---------- 아이콘 ---------- */
  const ICON = {
    tel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
    kakao: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.9 5.3 4.7 6.7L5.7 21.4c-.1.3.3.6.6.4l4.4-2.9c.4 0 .9.1 1.3.1 5.5 0 10-3.6 10-8S17.5 3 12 3"/></svg>',
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 15l6-6 6 6"/></svg>',
    insta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>'
  };
  const LOGO_MARK = '<svg class="logo-mark" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="17" stroke="currentColor" stroke-width="1.5" opacity=".35"/><circle cx="20" cy="20" r="11" stroke="#B08D57" stroke-width="3"/><circle cx="20" cy="20" r="2.6" fill="#B08D57"/></svg>';
  const logo = `<a href="index.html" class="logo" aria-label="${S.name} 홈">${LOGO_MARK}<span class="logo-text"><strong>${S.name}</strong><small>ONE CLINIC</small></span></a>`;

  /* ---------- 헤더 ---------- */
  const NAV = [
    { href: "about.html", label: "원클리닉 소개", page: "about", sub: [["about.html#story", "원클리닉 이야기"], ["about.html#director", "대표원장 소개"], ["about.html#space", "공간 안내"], ["about.html#visit", "오시는 길"]] },
    { href: "treatments.html", label: "시술안내·가격", page: "treatments", sub: Object.keys(CONCERNS).map(k => ["treatments.html#" + k, CONCERNS[k].name]) },
    { href: "reserve.html", label: "온라인예약", page: "reserve" },
    { href: "care.html", label: "시술 후 주의사항", page: "care" },
    { href: "franchise.html", label: "가맹문의", page: "franchise" }
  ];
  const page = document.body.dataset.page;
  const header = document.createElement("header");
  header.className = "site-header" + (document.body.dataset.header === "dark" ? " on-dark" : " is-light-page");
  header.innerHTML = `<div class="container">${logo}
    <nav aria-label="주 메뉴"><ul class="gnb">${NAV.map(n => `<li><a href="${n.href}"${n.page === page ? ' class="active"' : ""}>${n.label}</a>${n.sub ? `<div class="sub">${n.sub.map(s => `<a href="${s[0]}">${s[1]}</a>`).join("")}</div>` : ""}</li>`).join("")}</ul></nav>
    <a href="reserve.html" class="btn btn--primary header-cta">상담 예약</a>
    <button class="menu-toggle" aria-label="메뉴 열기"><span></span><span></span><span></span></button></div>`;
  document.body.prepend(header);
  $(".menu-toggle", header).addEventListener("click", () => document.body.classList.toggle("menu-open"));
  $$(".gnb a", header).forEach(a => a.addEventListener("click", () => document.body.classList.remove("menu-open")));

  /* ---------- 푸터 ---------- */
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `<div class="container">
    <div class="footer-top">
      <div>${logo}<p>원장이 직접, 원칙대로, 원하는 만큼만.<br>한방 피부미용 프랜차이즈 원클리닉 ${S.branch}</p>
        <div class="sns"><a href="${S.instagram}" target="_blank" rel="noopener" aria-label="인스타그램">${ICON.insta}</a><a href="${S.kakao}" target="_blank" rel="noopener" aria-label="카카오톡 채널">${ICON.kakao}</a><a href="${S.naverMap}" target="_blank" rel="noopener" aria-label="네이버 지도">${ICON.map}</a></div></div>
      <div><h5>예약·상담</h5><a href="${telHref}" class="footer-tel">${S.phone}</a><p style="margin-top:10px">카카오톡 채널 상담 가능</p></div>
      <div><h5>진료시간</h5><table class="hours-table"><tbody>${(S.hours || []).map(h => `<tr><td>${h[0]}</td><td>${h[1]}</td></tr>`).join("")}</tbody></table></div>
      <div><h5>바로가기</h5><ul>${NAV.map(n => `<li><a href="${n.href}">${n.label}</a></li>`).join("")}<li><a href="reserve.html#privacy">개인정보처리방침</a></li></ul></div>
    </div>
    <div class="footer-bottom">
      <div class="biz"><span>${S.name} ${S.branch}</span><span>대표원장 ${S.director}</span><span>사업자등록번호 ${S.bizNo}</span><span>${S.address}</span><span>${S.email}</span></div>
      <div>© ${new Date().getFullYear()} ONE CLINIC. All rights reserved.</div>
      <p class="legal">본 홈페이지의 시술 정보는 의료법을 준수하여 제공되며, 시술 효과와 부작용은 개인에 따라 다를 수 있습니다. 모든 시술은 원장 진료 후 결정됩니다.</p>
    </div></div>`;
  document.body.append(footer);

  /* ---------- 플로팅 버튼 ---------- */
  const fl = document.createElement("div");
  fl.className = "floating";
  fl.innerHTML = `<a class="f-kakao" href="${S.kakao}" target="_blank" rel="noopener" data-tip="카카오톡 상담" aria-label="카카오톡 상담">${ICON.kakao}</a>
    <a class="f-tel" href="${telHref}" data-tip="전화 상담" aria-label="전화 상담">${ICON.tel}</a>
    <a class="f-res" href="reserve.html" data-tip="온라인 예약" aria-label="온라인 예약">${ICON.cal}</a>
    <button class="f-top" data-tip="맨 위로" aria-label="맨 위로">${ICON.up}</button>`;
  document.body.append(fl);
  const topBtn = $(".f-top", fl);
  topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- 하단 빠른 상담 바 (예약 페이지 제외) ---------- */
  let quick = null;
  if (page !== "reserve" && sessionStorage.getItem("quickClosed") !== "1") {
    quick = document.createElement("div");
    quick.className = "quick-bar";
    quick.innerHTML = `<div class="container"><form data-form="빠른상담" novalidate>
      <span class="qt">빠른 상담 신청</span>
      <input name="name" placeholder="이름" required aria-label="이름">
      <input name="phone" type="tel" placeholder="연락처" required aria-label="연락처">
      <select name="concern" aria-label="관심 시술"><option value="">관심 시술</option>${Object.values(CONCERNS).map(c => `<option>${c.name}</option>`).join("")}</select>
      <input name="date" type="date" aria-label="희망일">
      <label class="agree-q"><input type="checkbox" name="agree" required> 개인정보 수집 동의</label>
      <button class="btn btn--gold" type="submit">상담 신청</button>
      <button type="button" class="close-q" aria-label="닫기">×</button>
    </form></div>`;
    document.body.append(quick);
    document.body.classList.add("has-quick");
    $(".close-q", quick).addEventListener("click", () => {
      quick.classList.remove("show"); document.body.classList.remove("has-quick");
      sessionStorage.setItem("quickClosed", "1");
    });
  }

  /* ---------- 스크롤 ---------- */
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("is-solid", y > 40);
    topBtn.classList.toggle("show", y > 600);
    if (quick && sessionStorage.getItem("quickClosed") !== "1") quick.classList.toggle("show", y > 400);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 설정값 채우기 ---------- */
  $$("[data-site]").forEach(el => {
    const key = el.dataset.site;
    if (key === "phone-link") { el.href = telHref; el.textContent = el.textContent || S.phone; return; }
    if (key === "kakao-link" || key === "map-link") { el.href = key === "kakao-link" ? S.kakao : S.naverMap; return; }
    if (key === "hours") { el.innerHTML = (S.hours || []).map(h => `<tr><td>${h[0]}</td><td>${h[1]}</td></tr>`).join(""); return; }
    if (S[key] != null) el.textContent = S[key];
  });
  $$("[data-art]").forEach(el => { el.innerHTML = ART[el.dataset.art] || ""; });

  /* ---------- 등장 애니메이션 ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
  $$(".reveal").forEach(el => io.observe(el));

  /* ---------- 슬라이더 ---------- */
  $$("[data-slider]").forEach(wrap => {
    const track = $(".slider", wrap), bar = $(".slider-progress span", wrap);
    const step = () => track.firstElementChild.getBoundingClientRect().width + 24;
    $("[data-prev]", wrap)?.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
    $("[data-next]", wrap)?.addEventListener("click", () => {
      const end = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      end ? track.scrollTo({ left: 0, behavior: "smooth" }) : track.scrollBy({ left: step(), behavior: "smooth" });
    });
    const upd = () => {
      if (!bar) return;
      const ratio = track.clientWidth / track.scrollWidth;
      bar.style.width = ratio * 100 + "%";
      bar.style.transform = `translateX(${(track.scrollLeft / track.clientWidth) * 100}%)`;
    };
    track.addEventListener("scroll", upd, { passive: true });
    window.addEventListener("resize", upd); upd();
  });

  /* ---------- 피부 고민 자가 체크 ---------- */
  const chk = $("[data-check]");
  if (chk) {
    const Q = [
      { q: "거울을 볼 때 가장 먼저 눈에 띄는 건?", o: [["얼룩덜룩한 기미·잡티", { pigment: 3 }], ["올라오는 트러블과 넓은 모공", { acne: 3 }], ["처지고 흐려진 턱선", { lifting: 2, contour: 1 }], ["불필요한 털", { hair: 3 }]] },
      { q: "요즘 가장 신경 쓰이는 변화는?", o: [["피부 톤이 칙칙해졌어요", { pigment: 2 }], ["피지가 많고 자국이 남아요", { acne: 2 }], ["얼굴 볼륨이 꺼져 보여요", { contour: 2, lifting: 1 }], ["체중·부기가 늘었어요", { body: 3 }]] },
      { q: "원하는 변화는 어느 쪽인가요?", o: [["맑고 균일한 피부결", { pigment: 1, acne: 1 }], ["또렷하고 탄탄한 라인", { lifting: 2, contour: 1 }], ["매끈한 관리의 편리함", { hair: 2 }], ["몸이 가벼워지는 체질 관리", { body: 2 }]] }
    ];
    const DESC = {
      pigment: "색소 침착은 원인(호르몬·자외선·염증 후)에 따라 접근이 달라집니다. 토닝과 한방 미백 관리를 원장 진단 후 조합합니다.",
      acne: "피지 분비와 열(熱) 체질을 함께 살펴, 레이저와 한방 처방으로 트러블과 흔적을 단계적으로 관리합니다.",
      lifting: "피부 층별 상태를 확인해 초음파·고주파 리프팅과 매선을 필요한 만큼만 권해드립니다.",
      contour: "얼굴 비율과 꺼진 부위를 분석해 자연스러운 볼륨과 윤곽 정리를 제안합니다.",
      hair: "모질과 피부 타입에 맞춘 레이저로 통증과 자극을 줄여 관리합니다.",
      body: "체질 진단을 바탕으로 한약 처방과 바디 관리를 병행해 무리 없는 감량을 돕습니다."
    };
    let i = 0, score = {};
    const qEl = $(".check-q", chk), oEl = $(".check-opts", chk), sEl = $(".check-step", chk), bar = $(".check-bar span", chk), res = $(".check-result", chk), body = $(".check-body", chk);
    const render = () => {
      sEl.textContent = `QUESTION ${i + 1} / ${Q.length}`;
      qEl.textContent = Q[i].q;
      oEl.innerHTML = Q[i].o.map((o, k) => `<button type="button" data-k="${k}">${o[0]}</button>`).join("");
      bar.style.width = (i / Q.length) * 100 + "%";
    };
    oEl.addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      const add = Q[i].o[b.dataset.k][1];
      for (const k in add) score[k] = (score[k] || 0) + add[k];
      i++;
      if (i < Q.length) return render();
      bar.style.width = "100%";
      const top = Object.keys(score).sort((a, b) => score[b] - score[a])[0];
      body.style.display = "none";
      res.classList.add("show");
      $("h4", res).textContent = CONCERNS[top].name;
      $("p", res).textContent = DESC[top];
      $("[data-go]", res).href = "treatments.html#" + top;
      $("[data-res]", res).href = "reserve.html?concern=" + top;
    });
    $("[data-restart]", chk).addEventListener("click", () => { i = 0; score = {}; res.classList.remove("show"); body.style.display = ""; render(); });
    render();
  }

  /* ---------- 시술 선택 (가격표) ---------- */
  const pickBar = $(".pick-bar");
  if (pickBar) {
    let picked = JSON.parse(sessionStorage.getItem("picked") || "[]");
    const sync = () => {
      $$(".add-btn").forEach(b => { const on = picked.includes(b.dataset.item); b.classList.toggle("on", on); b.textContent = on ? "✓" : "+"; b.setAttribute("aria-pressed", on); });
      $(".t b", pickBar).textContent = picked.length;
      pickBar.classList.toggle("show", picked.length > 0);
      sessionStorage.setItem("picked", JSON.stringify(picked));
    };
    $$(".add-btn").forEach(b => b.addEventListener("click", () => {
      const it = b.dataset.item;
      picked = picked.includes(it) ? picked.filter(x => x !== it) : [...picked, it];
      sync();
    }));
    $("[data-clear]", pickBar).addEventListener("click", () => { picked = []; sync(); });
    sync();
  }

  /* ---------- 예약 페이지: 선택 시술/고민 미리 채우기 ---------- */
  const resForm = $("form[data-form='온라인예약']");
  if (resForm) {
    const params = new URLSearchParams(location.search);
    const c = params.get("concern");
    if (c && CONCERNS[c]) { const box = resForm.querySelector(`input[name="concern"][value="${CONCERNS[c].name}"]`); if (box) box.checked = true; }
    const picked = JSON.parse(sessionStorage.getItem("picked") || "[]");
    if (picked.length) resForm.elements.memo.value = "선택한 시술: " + picked.join(", ");
    const d = resForm.elements.date; if (d) d.min = new Date().toISOString().slice(0, 10);
  }

  /* ---------- 폼 전송 ---------- */
  $$("form[data-form]").forEach(form => {
    form.addEventListener("submit", async e => {
      e.preventDefault();
      let msg = form.querySelector(".form-msg");
      const say = (t, ok) => {
        if (!msg) { alert(t); return; }
        msg.textContent = t; msg.className = "form-msg " + (ok ? "ok" : "err");
      };
      const fd = new FormData(form);
      const name = (fd.get("name") || "").trim(), phone = (fd.get("phone") || "").replace(/[^0-9]/g, "");
      if (!name) return say("이름을 입력해 주세요.");
      if (!/^0\d{8,10}$/.test(phone)) return say("연락처를 정확히 입력해 주세요. (예: 010-1234-5678)");
      if (!fd.get("agree")) return say("개인정보 수집·이용에 동의해 주세요.");
      const data = new URLSearchParams();
      data.append("구분", form.dataset.form);
      data.append("접수시각", new Date().toLocaleString("ko-KR"));
      for (const [k, v] of fd.entries()) data.append(k, v);
      if (!S.formEndpoint) {
        say(`현재 온라인 접수 준비 중입니다. 전화(${S.phone}) 또는 카카오톡으로 예약해 주세요.`);
        return;
      }
      const btn = form.querySelector("[type=submit]"); btn.disabled = true;
      try {
        await fetch(S.formEndpoint, { method: "POST", mode: "no-cors", body: data });
        say("신청이 접수되었습니다. 확인 후 연락드리겠습니다.", true);
        form.reset(); sessionStorage.removeItem("picked");
      } catch (err) {
        say(`전송에 실패했습니다. 전화(${S.phone})로 문의해 주세요.`);
      } finally { btn.disabled = false; }
    });
  });

  /* ---------- 주의사항 탭 ---------- */
  $$("[data-tabs]").forEach(w => {
    const btns = $$(".care-tabs button", w), panels = $$(".care-panel", w);
    const show = k => { btns.forEach(b => b.classList.toggle("on", b.dataset.tab === k)); panels.forEach(p => p.classList.toggle("on", p.id === "care-" + k)); };
    btns.forEach(b => b.addEventListener("click", () => { show(b.dataset.tab); history.replaceState(null, "", "#" + b.dataset.tab); }));
    const h = location.hash.slice(1); show(btns.some(b => b.dataset.tab === h) ? h : btns[0].dataset.tab);
  });

  /* ---------- 해시 링크로 들어온 경우 위치 보정 (헤더 삽입 후) ---------- */
  if (location.hash.length > 1 && !$("[data-tabs]")) {
    const t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (t) requestAnimationFrame(() => t.scrollIntoView());
  }

  /* ---------- 서브 내비 활성화 ---------- */
  const subLinks = $$(".subnav a");
  if (subLinks.length) {
    const targets = subLinks.map(a => $(a.getAttribute("href"))).filter(Boolean);
    const so = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) subLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    }), { rootMargin: "-40% 0px -55% 0px" });
    targets.forEach(t => so.observe(t));
  }
})();
