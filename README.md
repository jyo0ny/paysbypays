# PaysByPays 대시보드

## 📌 프로젝트 개요
올페이즈 채용 과제 - 결제/가맹점 관리 대시보드

## 🛠️ 개발 환경
- **Node.js**: 20.x LTS
- **React**: 18+
- **TypeScript**: 5+
- **빌드 도구**: Vite
- **패키지 매니저**: npm

## 📦 사용 기술 스택

### Core
- React 18
- TypeScript
- Vite

### Styling
- Tailwind CSS (직접 디자인 구성)

### Libraries
- React Router DOM (라우팅)
- Axios (API 통신)
- Recharts (데이터 시각화)
- date-fns (날짜 처리)
- lucide-react (아이콘)

## 🎨 디자인 의도
- **모던하고 깔끔한 UI**: Tailwind CSS를 활용한 심플한 디자인
- **직관적인 UX**: 대시보드 특성에 맞는 카드 레이아웃과 명확한 정보 계층 구조
- **반응형 디자인**: 다양한 화면 크기에서 최적화된 사용자 경험 제공

## 🚀 설치 및 실행

### 환경 변수 설정
`.env` 파일을 생성하고 다음 내용을 추가하세요:
```
VITE_API_BASE_URL=https://recruit.paysbypays.com/api/v1
```

### 설치
```bash
npm install
```

### 개발 서버 실행
```bash
npm run dev
```

로컬 서버가 `http://localhost:5173`에서 실행됩니다.

### 빌드
```bash
npm run build
```

### 빌드 결과 미리보기
```bash
npm run preview
```

## 📁 프로젝트 구조
```
src/
├── components/     # 재사용 가능한 컴포넌트
├── pages/          # 페이지 컴포넌트
├── services/       # API 호출 로직
├── types/          # TypeScript 타입 정의
├── utils/          # 유틸리티 함수
└── App.tsx         # 메인 앱 컴포넌트
```

## 📄 주요 페이지
- **대시보드 메인**: 거래 통계 및 주요 지표 시각화
- **거래 내역 리스트**: 전체 거래 내역 조회 및 검색

## 🔗 API
- **Base URL**: `https://recruit.paysbypays.com/api/v1`
- **API 문서**: [Swagger](https://recruit.paysbypays.com/swagger-ui/index.html)

## 📝 개발 노트
- 모든 API 호출은 GET 메서드만 사용
- 환경 변수를 통한 API URL 관리
- TypeScript를 활용한 타입 안정성 확보

## 👤 개발자
지원자: 서지윤

## 📅 개발 기간
2025.12.01 ~ 2025.12.06
