# Pet-survivors v1.18 배포 가이드

## 기존 Render 링크 업데이트

새 Render 서비스를 만들 필요가 없습니다.

1. `pet-survivors-phaser-v1.18-boss-run-variety.zip`을 압축 해제합니다.
2. 압축 안의 프로젝트 내용물 `public/`, `tests/`, `server.js`, `package.json`, `render.yaml`, README/보고서 등을 기존 GitHub `Pet-survivors` 저장소 최상위에 덮어씁니다.
3. GitHub에서 Commit changes를 누릅니다.
4. Render Auto-Deploy가 끝날 때까지 기다립니다.
5. 기존 Render 링크에서 강력 새로고침 후 테스트합니다.

- Build Command: `npm install`
- Start Command: `npm start`
- Root Directory: 비움
- Node: 20 이상

## 로컬 검사

```bash
npm install
npm test
npm start
```

## v1.18 우선 플레이 체크

- 3분 청포도 / 6분 화이트 초콜릿 / 9분 흰양파 / 12분 아이스커피 / 15분 자일리톨이 순서대로 나오는지
- 각 TRUE BOSS가 65%와 20%에서 외형/패턴이 바뀌는지
- Final 진입 직후 필살기를 한 번 볼 수 있는지
- F2로 보스 hurtbox가 외형 대부분을 덮되 허공까지 지나치게 크지 않은지
- 산책줄이 머리가 아니라 목/등 뒤에서 나오고 Lv.3 이상 두 줄 길이가 같은지
- 발톱 슥삭이 3줄 claw mark이고 Lv.5에서 실제 중거리까지 닿는지
- 초콜릿 장판이 예고 → 초콜릿 투사 → 착지 순서로 보이는지
- 포도 분열탄이 보스 바로 앞이 아니라 중거리에서 갈라지는지
- TRUE BOSS 진입 때 바닥 XP와 상자/간식이 사라지지 않는지
- 멍배송 상자가 45~75초 불규칙하게 등장하고 착지 전에 경고가 보이는지
- 2인에서 초콜릿 착탄 경고 / 껌 장판 경고 / 멍배송 경고 / Final 필살기 경고가 guest에도 보이는지
- 자일리톨 격파 후 산책 완료 화면과 `계속 산책하기` Endless가 정상인지

무료 Render 인스턴스는 오래 사용하지 않으면 잠들 수 있어 첫 접속이 느릴 수 있습니다.
