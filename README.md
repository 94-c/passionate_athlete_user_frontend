# Passionate_Athlete (운동 기록 웹 프로젝트)

> 이 프로젝트는 **ChatGPT**의 도움을 받고 만든 프로젝트입니다.

이 리포지토리는 `Passionate Athlete` 애플리케이션의 회원 프론트 프로젝트입니다.
- 개발 기간 : 2024년 7월 ~ 2024년 9월 4일 (초기 베타 기준)
- 개발 인력 : 1명


## Development Stack


- 언어: JavaScript/TypeScript
- 프레임워크: React 18
- 스타일링: CSS Modules 또는 styled-components
- 패키지 관리자: npm 또는 yarn

## Project Architecture

```
src/
├── components/       # 재사용 가능한 컴포넌트
├── pages/         # 기능별 모듈
│   ├── auth/         # 인증 관련 코드
│   ├── dashboard/    # 대시보드 기능 모듈
├── api/         # API 서비스 및 유틸리티
├── styles/           # 글로벌 스타일 및 변수
├── utils/           # 공통 컴포넌트
├── App.js            # 메인 애플리케이션 컴포넌트
└── index.js          # 애플리케이션 진입점
```

## 설치 및 실행 방법

```
git clone https://github.com/yourusername/passionate-athlete-frontend.git
```
```
npm install
```
### 애플리케이션 실행
```
npm start
```
### 프로덕션 빌드
```
npm run build
```
