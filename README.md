# 원클리닉 홈페이지

한방 피부미용 프랜차이즈 **원클리닉 1호점** 공식 홈페이지입니다.
HTML, CSS, JS만으로 만든 정적 사이트라서 빌드 과정이 없습니다. GitHub Pages에 바로 배포할 수 있습니다.

## 페이지 구성
| 파일 | 내용 |
|---|---|
| `index.html` | 메인: 히어로, 세 가지 원칙, 고민별 시술 슬라이더, 피부 고민 자가체크, 오픈 이벤트, 브랜드, 오시는 길 |
| `about.html` | 원클리닉 소개, 대표원장, 공간 안내, 오시는 길 |
| `treatments.html` | 시술안내와 공개 가격표. `+`로 시술을 담아 예약 페이지로 넘깁니다 |
| `reserve.html` | 온라인 예약 폼과 개인정보 동의 |
| `care.html` | 시술 후 주의사항 (탭) |
| `franchise.html` | 가맹 안내와 가맹 상담 신청 |

공통 헤더, 푸터, 플로팅 버튼(카카오톡, 전화, 예약), 하단 빠른 상담 바는 `js/main.js`가 모든 페이지에 자동으로 넣습니다.

## 오픈 전에 꼭 바꿔야 할 것
1. **`js/config.js`**: 전화번호, 주소, 대표원장, 사업자등록번호, 카카오 채널, 네이버 지도, 진료시간을 넣으세요. 여기서 바꾸면 사이트 전체에 반영됩니다.
2. **가격**: `index.html`의 이벤트 섹션과 `treatments.html`의 가격표는 예시 가격입니다.
3. **원장 약력**: `about.html`의 `[수정필요]` 부분입니다.
4. **공간 사진**: `about.html`의 공간 안내는 지금 색 블록입니다. 사진을 `assets/`에 넣고 교체하세요. 인물이 나오지 않는 사진을 쓰세요.
5. **의료광고 심의**: 시술명과 문구는 의료법 제56조를 고려해 작성했지만, 게시하기 전에 의료광고 자율심의 필요 여부를 확인하세요.

## 예약 폼 접수 연결 (Google 스프레드시트)
`config.js`의 `formEndpoint`가 비어 있으면 폼은 "전화로 예약해 주세요"라는 안내만 띄웁니다.

1. 새 Google 스프레드시트를 만들고 **확장 프로그램 → Apps Script**를 여세요.
2. 아래 코드를 붙여 넣으세요.
   ```js
   function doPost(e) {
     const sh = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     const p = e.parameters;
     const keys = Object.keys(p);
     if (sh.getLastRow() === 0) sh.appendRow(keys);
     const head = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
     keys.forEach(k => { if (!head.includes(k)) { head.push(k); sh.getRange(1, head.length).setValue(k); } });
     sh.appendRow(head.map(h => (p[h] || []).join(", ")));
     return ContentService.createTextOutput("ok");
   }
   ```
3. **배포 → 새 배포 → 웹 앱**을 고르고, 액세스 권한을 "모든 사용자"로 정해 배포하세요.
4. 발급된 URL을 `config.js`의 `formEndpoint`에 넣으세요.

Formspree(https://formspree.io) 주소를 넣어도 됩니다. 이 경우 접수 내용이 이메일로 옵니다.

## 배포 (GitHub Pages)
GitHub 저장소에서 **Settings → Pages → Branch: main / (root)**를 선택하세요. 잠시 후 `https://jwpark0330.github.io/homepage/`에서 사이트가 열립니다.
독자 도메인을 쓰려면 같은 화면의 Custom domain에 입력하세요.

## 로컬에서 보기
`index.html`을 브라우저로 열면 됩니다. 로컬 서버를 쓸 수도 있습니다(`npx serve .` 등).
