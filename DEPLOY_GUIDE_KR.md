# Pet-survivors v1.16.1 Visual Polish 배포

## 기존 Pet-survivors Render 링크 업데이트
새 Render 서비스를 만들 필요가 없습니다.

1. `pet-survivors-phaser-v1.16.1-visual-polish.zip`을 압축 해제합니다.
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

`npm test`는 v1.15 전투/네트워크 회귀 테스트와 v1.16.1 비주얼 정적 검사를 함께 실행합니다. 브라우저 비주얼 검증 스크립트는 `python3 tests/v161_visual_browser_test.py`입니다.

## v1.16.1 확인 포인트

- 로비/ESC에서 네 캐릭터 PNG의 원본 종횡비가 유지되는지 확인
- 전투에서 캐릭터 얼굴/눈/귀가 눌리거나 늘어나지 않는지 확인
- 혼자 시작 / 2인 방 만들기 / 방 입장 버튼이 정상 동작하는지 확인
- 전투의 DOM HUD 글자가 선명하고 좌상단 HP/XP, 우상단 시간/WAVE/KILL, 좌하단 BUILD가 동일 safe margin을 사용하는지 확인
- 우하단 `♪` 버튼으로 BGM/SFX 팝업이 열리는지 확인
- 중앙 광장이 작고 낮은 대비인지, 산책길이 사각 타일 연결처럼 보이지 않는지 확인
- 공원 장식이 이동이나 적 AI를 막지 않는지 확인
- ESC에서 현재 캐릭터, 패시브, 핵심 스탯, 3개 빌드 구역이 정상 표시되는지 확인
- TRUE BOSS 입장 경고 및 전용 HP바 확인
- 2인에서 내 캐릭터/파트너 이름표와 발밑 표시, 부활/동기화가 기존대로 동작하는지 확인

무료 Render 인스턴스는 오래 사용하지 않으면 잠들 수 있어 첫 접속 때 수십 초 걸릴 수 있습니다.
