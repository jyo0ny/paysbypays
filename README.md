# 💳 PaysByPays 대시보드

올페이즈 프론트엔드 개발자 채용 과제 - 결제/가맹점 통합 관리 대시보드

## 📌 프로젝트 개요

실시간 결제 데이터 분석과 가맹점 관리를 위한 관리자 대시보드입니다.
결제 통계 시각화, 가맹점 관리, 고급 필터링 기능을 제공합니다.

## ✨ 주요 기능

### 📊 대시보드
- **핵심 지표 카드**: 총 결제 건수, 성공률, 총 금액, 평균 금액
- **일별 결제 추이**: 전체 기간 Area Chart 시각화
- **시간대별 분석**: 24시간 거래 분포 Bar Chart
- **TOP 10 가맹점**: 매출 순위 및 시각적 강조
- **결제 수단 분석**: 수단별 금액 Pie Chart
- **실시간 최근 거래**: 최신 5건 거래 내역

### 💳 결제 내역 관리
- **고급 필터링**
  - 가맹점명 검색
  - 날짜 범위 선택
  - 결제 수단별 필터 (복수 선택)
  - 결제 상태별 필터 (복수 선택)
  - 금액 범위 필터
- **정렬 기능**: 모든 컬럼 클릭으로 오름차순/내림차순 정렬
- **페이지네이션**: 10/20/50/100개씩 보기
- **상세 모달**: 결제 및 가맹점 정보 통합 표시

### 🏪 가맹점 관리
- **통계 카드**: 전체/활성/비활성 가맹점 수, 업종 수
- **업종별 필터**: CAFE, SHOP, MART, APP, TRAVEL, EDU 등
- **상태별 필터**: ACTIVE, INACTIVE, READY, CLOSED
- **가맹점명/코드 검색**
- **정렬 및 페이지네이션**
- **상세 정보 모달**: 사업자 정보, 연락처, 주소 등

## 🛠️ 기술 스택

### Core
- **React** 18.3.1 - 컴포넌트 기반 UI 라이브러리
- **TypeScript** 5.6.2 - 타입 안정성
- **Vite** 6.0.1 - 빠른 개발 환경

### Routing & State
- **React Router DOM** 7.1.1 - SPA 라우팅

### Styling
- **Tailwind CSS** 3.4.17 - 유틸리티 기반 CSS
- **PostCSS** 8.4.49 - CSS 후처리

### Data Fetching
- **Axios** 1.7.9 - HTTP 클라이언트

### Data Visualization
- **Recharts** 2.14.1 - React 차트 라이브러리

### Code Quality
- **ESLint** 9.17.0 - 코드 품질 관리
- **TypeScript ESLint** - TS 린팅

## 🎨 디자인 철학

### 사용자 중심 설계
- **직관적인 네비게이션**: 사이드바 기반 명확한 구조
- **시각적 계층**: 카드 레이아웃으로 정보 우선순위 구분
- **일관된 색상 체계**: 
  - 성공(초록), 대기(노랑), 실패(빨강), 취소(회색)
  - Primary(파랑), Secondary(보라)

### 반응형 디자인
- **모바일 우선**: 320px부터 지원
- **브레이크포인트**: sm(640px), md(768px), lg(1024px), xl(1280px)
- **유연한 그리드**: Tailwind Grid 시스템 활용

### 사용성 개선
- **로딩 상태**: 명확한 로딩 인디케이터
- **빈 상태**: 데이터 없을 때 친절한 안내
- **에러 핸들링**: 사용자 친화적 에러 메시지
- **키보드 지원**: ESC로 모달 닫기 등

## 🚀 시작하기

### 사전 요구사항
- **Node.js**: 20.x LTS 이상
- **npm**: 10.x 이상

### 설치
```bash
# 저장소 클론
git clone https://github.com/jyo0ny/paysbypays.git

# 디렉토리 이동
cd paysbypays

# 의존성 설치
npm install
```

### 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:
```env
VITE_API_BASE_URL=https://recruit.paysbypays.com/api/v1
```

### 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속하세요.

### 빌드
```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 📁 프로젝트 구조
```
src/
├── api/                    # API 클라이언트 및 엔드포인트
│   ├── client.ts          # Axios 인스턴스 및 인터셉터
│   ├── payments.ts        # 결제 API
│   └── merchants.ts       # 가맹점 API
│
├── components/            # 재사용 가능한 컴포넌트
│   ├── PaymentDetailModal.tsx    # 결제 상세 모달
│   └── MerchantDetailModal.tsx   # 가맹점 상세 모달
│
├── layout/               # 레이아웃 컴포넌트
│   └── MainLayout.tsx    # 사이드바 + 헤더 레이아웃
│
├── pages/                # 페이지 컴포넌트
│   ├── Dashboard/        # 대시보드 페이지
│   │   └── Dashboard.tsx
│   ├── Payments/         # 결제 내역 페이지
│   │   └── Payments.tsx
│   └── Merchants/        # 가맹점 관리 페이지
│       └── Merchants.tsx
│
├── router/               # 라우팅 설정
│   └── AppRouter.tsx
│
├── types/                # TypeScript 타입 정의
│   └── payment.ts        # Payment, Merchant 타입
│
├── App.tsx               # 루트 컴포넌트
├── main.tsx             # 엔트리 포인트
└── index.css            # 글로벌 스타일
```

## 🌐 API 명세

### Base URL
```
https://recruit.paysbypays.com/api/v1
```

### Endpoints

#### 결제 내역
- `GET /payments/list` - 전체 결제 내역 조회

#### 가맹점
- `GET /merchants/list` - 가맹점 목록 조회
- `GET /merchants/details` - 가맹점 상세 정보 조회
- `GET /merchants/details/{mchtCode}` - 특정 가맹점 상세 조회

#### 공통 코드
- `GET /common/payment-status/all` - 결제 상태 코드
- `GET /common/paymemt-type/all` - 결제 수단 코드
- `GET /common/mcht-status/all` - 가맹점 상태 코드

### API 문서
[Swagger UI](https://recruit.paysbypays.com/swagger-ui/index.html)

## 🔑 핵심 구현 사항

### 타입 안정성
```typescript
// 명확한 타입 정의
interface Payment {
  paymentCode: string;
  mchtCode: string;
  amount: string;
  currency: string;
  payType: "ONLINE" | "DEVICE" | "MOBILE" | "VACT" | "BILLING";
  status: "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";
  paymentAt: string;
}
```

### API 인터셉터
```typescript
// Request/Response 인터셉터로 중앙 집중식 에러 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 에러 상태별 처리
    return Promise.reject(error);
  }
);
```

### 성능 최적화
- 컴포넌트 단위 코드 스플리팅 준비
- Lazy Loading 적용 가능
- 메모이제이션 최적화 가능

## 📊 데이터 처리 특징

### 날짜 처리
- 소수점 포함 금액 처리 (`parseFloat`)
- 타임존 고려한 날짜 정규화
- 실제 데이터 범위 기반 차트 표시

### 필터링 로직
- 복수 조건 AND 연산
- 실시간 필터 적용
- 필터 변경 시 페이지 자동 리셋

## 🎯 기술적 의사결정

### 1. Vite 선택 이유
- ES Module 기반 최적화
- 플러그인 생태계

### 2. Tailwind CSS 선택 이유
- 빠른 프로토타이핑
- 일관된 디자인 시스템
- 번들 사이즈 최적화 (PurgeCSS)

### 3. Recharts 선택 이유
- React 친화적 API
- 반응형 차트 기본 지원
- 커스터마이징 용이

## 🐛 알려진 이슈 및 개선 사항

### 현재 제한사항
- 실시간 데이터 업데이트 없음 (polling 미구현)
- 오프라인 모드 미지원
- 다국어 지원 없음

### 향후 개선 계획
- [ ] React Query로 서버 상태 관리 개선
- [ ] 무한 스크롤 구현
- [ ] CSV/Excel 내보내기 기능
- [ ] 더 다양한 차트 추가
- [ ] 다크 모드 지원
- [ ] PWA 적용

## 📝 개발 노트

### 커밋 컨벤션
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `refactor`: 리팩토링
- `style`: 스타일 변경
- `docs`: 문서 수정

## 👤 개발자 정보

**지원자**: 서지윤  
**이메일**: blahwah1@naver.com

## 📅 개발 기간

**2025.12.01 ~ 2025.12.05**

## 📜 라이선스

이 프로젝트는 올페이즈 채용 과제용으로 제작되었습니다.

---