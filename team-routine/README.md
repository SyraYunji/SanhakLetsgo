# 팀 루틴 (Team Routine)

팀원의 **운동 출석/시간 기록**과 **논문 스터디(읽은 논문 + 리뷰 등록)** 만 지원하는 미니멀 웹앱입니다.

## 기능

- **운동**: 오늘 출석 체크, 운동 시작/종료 시간 기록. 최근 14일 기록 테이블 및 날짜별 수정.
- **논문 스터디**: 내가 읽은 논문 목록, 논문 추가, 논문별 리뷰(한줄요약, 핵심 기여, 방법/모델, 실험/결과, 한계/의문점, 아이디어/후속 실험).

## 기술 스택

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS**
- **PostgreSQL** + **Prisma**
- **NextAuth** (Credentials + Google 선택)

## 요구 사항

- Node.js 18+
- PostgreSQL 14+

## 설치 및 실행

### 1. 의존성 설치

```bash
cd team-routine
npm install
```

### 2. 환경 변수

`.env.example`을 복사해 `.env`를 만들고 값을 채웁니다.

```bash
cp .env.example .env
```

**필수:**

| 변수 | 설명 |
|------|------|
| `DATABASE_URL` | PostgreSQL 연결 문자열. 예: `postgresql://user:password@localhost:5432/team_routine?schema=public` |
| `NEXTAUTH_URL` | 앱 URL. 로컬: `http://localhost:3000` |
| `NEXTAUTH_SECRET` | NextAuth 세션 암호화용. 32자 이상 랜덤 문자열 권장 |

**선택 (Google 로그인):**

| 변수 | 설명 |
|------|------|
| `GOOGLE_CLIENT_ID` | Google OAuth 클라이언트 ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 시크릿 |

Google 사용 시 [Google Cloud Console](https://console.cloud.google.com/)에서 OAuth 2.0 클라이언트를 만들고, 승인된 리디렉션 URI에 `http://localhost:3000/api/auth/callback/google` (또는 배포 URL)을 추가합니다.

### 3. 데이터베이스 마이그레이션

```bash
npm run db:generate
npm run db:migrate
```

첫 실행 시 마이그레이션 이름을 물어보면 `init` 등 원하는 이름을 입력합니다.

### 4. 시드 데이터 (선택)

더미 사용자(이메일/비밀번호), 최근 7일 운동 기록, 논문 3개, 리뷰 1개를 넣습니다.

```bash
npm run db:seed
```

- 로그인: `demo@example.com` / `demo1234`

### 5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속.

- 미로그인: 로그인/회원가입 페이지
- 로그인 후: 대시보드(오늘 운동 카드, 논문 스터디 카드) → 상단 탭으로 **운동**, **논문** 페이지 이동

## NEXTAUTH 설정 요약

- **Credentials**: 이메일 + 비밀번호. 회원가입(`/register`)으로 계정 생성 후 `/login`에서 로그인.
- **Google**: `.env`에 `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`이 있으면 로그인 화면에 “Google로 로그인” 버튼이 노출됩니다.
- 세션은 JWT 방식이며, `NEXTAUTH_SECRET`으로 서명됩니다. 프로덕션에서는 반드시 강한 비밀값을 사용하세요.

## 스크립트

| 스크립트 | 설명 |
|----------|------|
| `npm run dev` | 개발 서버 (기본 3000 포트) |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 실행 |
| `npm run db:generate` | Prisma 클라이언트 생성 |
| `npm run db:push` | 스키마를 DB에 반영 (마이그레이션 파일 없이) |
| `npm run db:migrate` | 마이그레이션 적용 |
| `npm run db:seed` | 시드 데이터 삽입 |
| `npm run db:studio` | Prisma Studio 실행 |

## 라이선스

MIT
