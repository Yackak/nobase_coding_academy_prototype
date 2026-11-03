# 노베이스 코딩학원 웹사이트

첨부 기획서의 브랜드·정보 구조에 사용자의 추가 요청인 **코딩 단일 과목**과 **임의 예시 작성**을 반영한 반응형 소개 페이지입니다.

- 홈페이지: https://yackak.github.io/nobase_coding_academy_prototype
- 접근 범위: 링크로 누구나 열람 가능 (GitHub Pages)
- 실행: 프로젝트 폴더에서 `python3 -m http.server 4173 --directory dist`
- 별도 설치나 빌드 없이 `dist` 폴더를 정적 호스팅할 수 있습니다.

## GitHub Pages 배포

`main` 브랜치에 변경 사항을 올리면 `.github/workflows/pages.yml`에서 `dist/`만 자동 배포합니다. GitHub 저장소의 Actions 탭에서 배포 상태를 확인할 수 있습니다. 별도의 서버, 데이터베이스, 유료 호스팅은 사용하지 않습니다.

- 소스 저장소: https://github.com/Yackak/nobase_coding_academy_prototype
- Pages 설정: GitHub Actions
- 기본 주소: https://yackak.github.io/nobase_coding_academy_prototype/

## 포함된 화면과 동작

학원 소개, 스크래치·파이썬·웹 프로젝트 과정, 4단계 학습관리 예시, 수강 안내, FAQ, 상담 안내, 모바일 메뉴와 하단 상담 바를 구현했습니다. 학습관리 탭은 방향키/Home/End로 이동할 수 있으며, 상담 팝업은 Escape로 닫힙니다. 과정별 상담 버튼은 선택한 과정을 문의 문구에 반영합니다. 문의 문구 복사에 실패하면 직접 복사할 수 있는 입력 영역을 표시합니다.

## 운영 정보 수정

`dist/site-config.js`에서 상담 링크, 전화, 주소, 지도 링크, 상담 시간, 교육 대상, 수업 일정과 수강료를 변경합니다. 학원 설명과 상세 과정 원고는 `dist/index.html`, 디자인은 `dist/styles.css`, 인터랙션은 `dist/app.js`에서 수정합니다.

현재 학년, 과정, 정원, 운영시간과 수강료는 사용자가 요청한 **예시**입니다. 실제 상담 연락처는 입력하지 않았습니다. 따라서 상담 버튼은 안내 팝업으로 연결되고, 임의의 전화번호나 카카오톡으로 연락하지 않습니다. 강사·학생 실명, 후기나 성과는 만들지 않았습니다.

실제 운영 시에는 다음을 반영합니다.

1. 확정된 과정·가격·일정과 상담 링크·전화·주소를 반영합니다.
2. `demoMode`를 `false`로 바꾸면 실제 전화 연결/PC 전화번호 복사를 사용할 수 있습니다. 카카오톡 HTTPS 링크는 설정 시 직접 연결됩니다.
3. 본문의 시안 안내와 예시 표기를 확정 내용에 맞춰 수정합니다.
4. 공개용 도메인을 변경한다면 OG URL/이미지 URL과 sitemap의 주소도 수정합니다. 현재 공유용 시안은 `noindex, nofollow` 및 robots 수집 차단이 설정되어 있습니다.

## 검증

360, 390, 768, 1024, 1440px에서 가로 넘침과 이미지 누락이 없음을 브라우저로 확인했습니다. 모바일 메뉴, 메뉴 내 앵커 이동, 과정별 상담 문구, 문의 복사 성공 안내, 학습관리 클릭·방향키 전환, FAQ 펼치기를 확인했습니다. JavaScript 구문 검사 통과 및 검수 중 브라우저 오류 로그 없음. iOS/Android 실기기와 실제 상담 연결은 미검증입니다.

## 이미지·서체

- 로고 `dist/assets/nobase-logo.png`: 사용자가 제공한 PDF에 포함된 원본 로고 이미지를 추출하고 웹 표시용 PNG로 변환했습니다.
- 메인 이미지 `dist/assets/learning-hero.webp`: 기본 내장 이미지 생성 도구로 만든 책·새싹·연필의 브랜드 일러스트입니다. 실제 학원의 공간이나 학생을 표현한 사진이 아닙니다. 생성 원본에서 웹용 WebP로 최적화했습니다.
- 파비콘과 과정 그래픽: 웹용 SVG 및 CSS로 작성했습니다.
- Pretendard 1.3.9: 자체 호스팅, SIL Open Font License. 라이선스는 `dist/assets/Pretendard-LICENSE.txt`에 포함했습니다.

메인 이미지 생성 프롬프트 전문은 `asset-provenance.json`에 기록했습니다.
