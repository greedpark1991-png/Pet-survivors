# 기존 멍냥대난투를 보존하면서 새 링크 만들기

기존 `Tofu-stew` 저장소와 Render 서비스는 건드리지 않습니다.

## 1. GitHub 새 저장소 만들기
예시 이름:
`Pet-survivors`

GitHub → 오른쪽 위 `+` → `New repository` → 새 저장소 생성.

## 2. 이 압축파일 내용 업로드
압축을 풀고 **압축파일 자체가 아니라 안의 파일/폴더 전체**를 새 저장소 최상위에 업로드합니다.

최상위에 아래가 보여야 합니다.
- `public/`
- `server.js`
- `package.json`
- `render.yaml`
- `README.md`

GitHub 웹 업로드를 사용하면 마지막에 `Commit changes`를 누르면 커밋/푸시까지 완료됩니다.

## 3. Render에서 새 서비스
Render Dashboard → `+ New` → `Web Service` → 방금 만든 새 GitHub 저장소 선택.

설정:
- Language: Node
- Branch: main
- Root Directory: 빈칸
- Build Command: `npm install`
- Start Command: `npm start`
- Region: Singapore 권장
- Compute: Free

그 다음 Deploy Web Service.

## 4. 독립 링크 완성
배포가 `Deploy succeeded | Live`가 되면 새 `.onrender.com` 주소가 생깁니다.

이 링크는 기존 멍냥대난투 링크와 완전히 별개입니다.
