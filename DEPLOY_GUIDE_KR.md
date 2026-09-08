# Pet-survivors v1.8 업데이트/배포

## 이미 Pet-survivors 링크가 있는 경우
새 Render 서비스를 만들 필요가 없습니다.

1. 이 ZIP을 압축 해제합니다.
2. 안의 `public/`, `server.js`, `package.json`, `render.yaml` 등 **내용물 전체**를 기존 GitHub `Pet-survivors` 저장소 최상위에 덮어씁니다.
3. GitHub 웹 업로드라면 `Commit changes`를 누릅니다.
4. Render의 기존 Pet-survivors 서비스가 Auto-Deploy를 시작합니다.
5. `Deploy succeeded | Live`가 뜨면 기존 링크를 그대로 사용합니다.

이번 버전부터 온라인 2인 협동에 Socket.IO를 사용하므로 `package.json`에 `socket.io` 의존성이 들어 있습니다. Render의 Build Command는 기존처럼 `npm install`, Start Command는 `npm start`면 됩니다.

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

무료 Render 인스턴스는 오래 사용하지 않으면 잠들 수 있어 첫 접속 때 수십 초 걸릴 수 있습니다.
