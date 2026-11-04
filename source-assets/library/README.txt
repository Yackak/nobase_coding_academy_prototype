노베이스 학원 이미지 라이브러리 · 2026-11-04

새로 확보한 자산: 생성 이미지 4종, 선정 스톡 사진 3종, 제공 문서 원본 로고 1종.
기존 홈페이지의 투명 모션 레이어 4종과 전체 정물 1종도 이미지북에 별도로 정리했습니다.

이미지북: public/image-library/index.html
온라인: https://yackak.github.io/nobase_coding_academy_prototype/image-library/
웹용 파일: public/image-library/assets/
생성 PNG 원본: source-assets/library/generated/
선정 스톡 다운로드 원본: source-assets/library/stock/
추출 로고 원본: source-assets/library/originals/nobase-logo-original.png
조사 근거, 출처 및 검수 기록: research/*.json
생성 프롬프트: research/generation-prompts.json

생성 도구: 내장 image_gen. CLI/API 대체 생성은 사용하지 않았습니다.
원본 내용은 변경하지 않았고, 웹용 파일은 비율을 유지해 축소한 WebP입니다.
800px급 파일은 실제 폭 799px 또는 800px입니다. srcset에는 실제 폭을 사용합니다.
이미지북은 HTML을 직접 열어도 이미지와 본문을 확인할 수 있습니다.
리서치 카드는 클릭하거나 키보드로 펼칠 수 있습니다. 외부 근거 링크에는 인터넷이 필요합니다.

활용 기준
- 생성 정물과 스톡 사진은 설명용 소재이며 실제 노베이스 학원, 강사, 학생, 성적, 교재의 사진이 아닙니다.
- 영어/수학 이미지 중 필요한 위치부터 사용하고 같은 화면에 모든 이미지를 반복 배치하지 않습니다.
- 실제 시설·강사·학생 기록은 확인 가능한 촬영 자료를 확보한 뒤 별도 반영합니다.
- 스톡 사용 조건과 개별 출처는 research/stock-sources.json에 기록했습니다.
- 브랜드 레퍼런스의 스크린샷, 후보에서 탈락한 스톡 파일은 배포 묶음과 공개 저장소에 포함하지 않았습니다.
- 제공 문서에서 추출한 로고는 기존 브랜드 자산입니다. AI로 다시 그린 로고가 아닙니다.

출처
Ann poan / Pexels: https://www.pexels.com/photo/opened-diary-with-pencil-placed-on-desk-5797898/
Thought Catalog / Unsplash: https://unsplash.com/photos/person-holding-pencil-writing-on-notebook-RdmLSJR-tq8
2H Media / Unsplash: https://unsplash.com/photos/a-small-potted-plant-sitting-on-top-of-a-stack-of-books-HujBXdflxK0
Pexels 사용 조건: https://www.pexels.com/license/
Unsplash 사용 조건: https://unsplash.com/license/
Pretendard 글꼴 라이선스: public/image-library/Pretendard-LICENSE.txt

이미지북 재생성: python3 scripts/build-image-library.py
프로젝트 빌드: npm run build
