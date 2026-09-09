# Pet-survivors v1.17 배포 가이드

## 기존 Render 링크 업데이트

새 Render 서비스를 만들 필요가 없습니다.

1. `pet-survivors-phaser-v1.17-skill-boss-evolution.zip`을 압축 해제합니다.
2. 압축 안의 `public/`, `tests/`, `server.js`, `package.json`, `render.yaml`, README/보고서 등 내용물 전체를 기존 GitHub `Pet-survivors` 저장소 최상위에 덮어씁니다.
3. GitHub에서 Commit changes를 누릅니다.
4. Render Auto-Deploy가 끝날 때까지 기다립니다.
5. 기존 Render 링크에서 새로고침 후 v1.17을 테스트합니다.

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

`npm test`는 기존 v1.15~v1.16.2 회귀 테스트와 v1.17 스킬/보스 성장 테스트를 모두 실행합니다.

## v1.17 플레이 체크

- 보물상자에서 새 7종 이름/설명이 정상 노출되는지
- 같은 보물 스킬을 반복 획득했을 때 Lv.1~Lv.5 행동이 실제로 달라지는지
- Lv.10 전투 증강의 레벨업 직후 시각 변화가 보이는지
- 포도 탄환이 포도알, 초콜릿 탄환이 초콜릿 조각, 양파 탄환이 껍질/링으로 읽히는지
- 포도 돌진이 v1.16.2보다 반응 가능하면서 target lock/overshoot는 유지되는지
- 초콜릿 장판과 분열탄이 공간 판단을 요구하는지
- 양파의 정/역회전 및 시간차 층이 포도와 다른 회피 감각인지
- 2인에서 각자 다른 `skillLevels`가 유지되고 부활 뒤에도 스킬이 남는지
- 15분대에서 아군 FX 때문에 적 탄환이 가려지지 않는지

무료 Render 인스턴스는 오래 사용하지 않으면 잠들 수 있어 첫 접속이 느릴 수 있습니다.
