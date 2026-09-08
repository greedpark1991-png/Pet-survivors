# Pet-survivors v1.16 UI / 그래픽 리마스터 배포

## 기존 Pet-survivors Render 링크 업데이트
새 Render 서비스를 만들 필요가 없습니다.

1. `pet-survivors-phaser-v16-ui-remaster.zip`을 압축 해제합니다.
2. 압축 안의 `public/`, `tests/`, `server.js`, `package.json`, `render.yaml`, `README.md` 등 **내용물 전체**를 기존 GitHub `Pet-survivors` 저장소 최상위에 덮어씁니다.
3. GitHub에서 `Commit changes`를 누릅니다.
4. 기존 Render 서비스의 Auto-Deploy가 시작됩니다.
5. `Deploy succeeded / Live`가 뜨면 기존 링크를 그대로 사용합니다.

온라인 2인 협동은 기존 Socket.IO / Host-authoritative 구조를 그대로 사용합니다.

- Build Command: `npm install`
- Start Command: `npm start`
- Root Directory: 비움
- Node: 20 이상

## 처음 배포하는 경우

- Language: Node
- Branch: main
- Root Directory: 빈칸
- Build Command: `npm install`
- Start Command: `npm start`
- Region: Singapore 권장
- Compute: Free 가능

## 로컬 검사

```bash
npm install
npm test
npm start
```

`npm test`는 v1.15 전투/네트워크 회귀 테스트와 v1.16 UI 정적 검사를 함께 실행합니다.

## v1.16 확인 포인트

- 로비에서 선택 캐릭터가 크게 표시되고 도트가 흐려지지 않는지 확인
- 혼자 시작 / 2인 방 만들기 / 방 입장 버튼이 정상 동작하는지 확인
- 전투에서 좌상단 HP/XP, 우상단 시간/WAVE/KILL, 좌하단 BUILD 슬롯 확인
- 우하단 `♪` 버튼으로 BGM/SFX 팝업이 열리는지 확인
- 공원 장식이 이동이나 적 AI를 막지 않는지 확인
- ESC에서 현재 캐릭터, 패시브, 핵심 스탯, 3개 빌드 구역이 정상 표시되는지 확인
- TRUE BOSS 입장 경고 및 전용 HP바 확인
- 2인에서 내 캐릭터/파트너 이름표와 발밑 표시, 부활/동기화가 기존대로 동작하는지 확인

무료 Render 인스턴스는 오래 사용하지 않으면 잠들 수 있어 첫 접속 때 수십 초 걸릴 수 있습니다.
