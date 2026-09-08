# Pet-survivors v1.14 업데이트 / 배포

## 기존 Pet-survivors Render 링크를 업데이트하는 경우
새 Render 서비스를 만들 필요가 없습니다.

1. 이 ZIP을 압축 해제합니다.
2. `public/`, `server.js`, `package.json`, `render.yaml`, `README.md` 등 **압축 안의 내용물 전체**를 기존 GitHub `Pet-survivors` 저장소 최상위에 덮어씁니다.
3. GitHub에서 `Commit changes`를 누릅니다.
4. 기존 Render 서비스의 Auto-Deploy가 시작됩니다.
5. `Deploy succeeded | Live`가 뜨면 기존 링크를 그대로 사용합니다.

온라인 2인 협동은 Socket.IO를 사용합니다.
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

## 2인 플레이
1. 두 사람 모두 같은 `.onrender.com` 링크에 접속합니다.
2. 한 명이 `2인 방 만들기`를 누릅니다.
3. 표시된 5자리 코드를 친구에게 보냅니다.
4. 친구가 코드를 입력하고 `방 입장`을 누릅니다.
5. 각자 캐릭터를 선택한 뒤 방장이 `2인 게임 시작`을 누릅니다.
6. 한 명이 DOWN되면 살아 있는 플레이어가 쓰러진 동료의 초록 구조 범위 안에서 버티면 부활시킬 수 있습니다.

무료 Render 인스턴스는 오래 사용하지 않으면 잠들 수 있어 첫 접속 때 수십 초 걸릴 수 있습니다.
