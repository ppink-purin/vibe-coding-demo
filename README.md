# Mirello - 메모 & 생산성 앱 🚀

Mirello는 모던하고 직관적인 메모 작성 및 생산성 관리 애플리케이션입니다. 카테고리별 메모 관리, 아름다운 UI/UX, 그리고 반응형 디자인을 제공합니다.

## ✨ 주요 기능

### 📝 메모 관리
- **카테고리별 메모 작성**: Journal, Quick Notes, Questionnaires, Life Systems & Goals
- **실시간 검색**: 모든 메모에서 빠르게 검색
- **CRUD 작업**: 메모 생성, 읽기, 수정, 삭제
- **카테고리 필터링**: 카테고리별로 메모 정리 및 보기

### 🎨 디자인 특징
- **모던 UI/UX**: Mirello 앱 스타일의 카드 기반 레이아웃
- **그라데이션 배경**: 카테고리별 고유한 색상 테마
- **일러스트레이션 아이콘**: 각 카테고리를 표현하는 시각적 요소
- **글래스모피즘**: 반투명 효과와 블러 필터
- **부드러운 애니메이션**: 호버 효과와 전환 애니메이션

### 📱 사용자 경험
- **반응형 디자인**: 데스크톱, 태블릿, 모바일 최적화
- **키보드 단축키**: Ctrl+N (새 메모), Escape (모달 닫기), Ctrl+Enter (저장)
- **직관적인 인터페이스**: 카드 클릭으로 카테고리 필터링
- **실시간 업데이트**: 카테고리별 마지막 수정 날짜 표시

## 🛠️ 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **스타일링**: CSS Grid, Flexbox, CSS Variables
- **애니메이션**: CSS Transitions, Keyframes, Transform
- **데이터 저장**: LocalStorage
- **아이콘**: Font Awesome 6.0
- **폰트**: Inter (Google Fonts)

## 📁 파일 구조

```
mirello-memo-app/
├── index.html          # 메인 HTML 구조
├── style.css           # 스타일시트
├── script.js           # JavaScript 로직
└── README.md           # 프로젝트 문서
```

## 🎯 카테고리 시스템

### 1. Journal 📖
- **용도**: 일기, 생각, 아이디어 기록
- **테마**: 따뜻한 노란색 그라데이션
- **아이콘**: 헤드폰, 노트북, 전구, 구름

### 2. Quick Notes ⚡
- **용도**: 빠른 메모, 할 일, 체크리스트
- **테마**: 차가운 파란색 그라데이션
- **아이콘**: 연필, 클립보드, 체크마크

### 3. Questionnaires ❓
- **용도**: 질문, 설문, 문제 해결
- **테마**: 주황색 그라데이션
- **아이콘**: 물음표, 전구, 사용자

### 4. Life Systems & Goals 🎯
- **용도**: 목표 설정, 시스템 관리, 진도 추적
- **테마**: 보라색 그라데이션
- **아이콘**: 과녁, 차트, 별

## 🚀 실행 방법

1. **프로젝트 다운로드**
   ```bash
   git clone [repository-url]
   cd mirello-memo-app
   ```

2. **브라우저에서 실행**
   - `index.html` 파일을 웹 브라우저에서 열기
   - 또는 로컬 서버 실행 (권장)

3. **로컬 서버 실행 (권장)**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js
   npx serve .
   
   # PHP
   php -S localhost:8000
   ```

4. **브라우저에서 접속**
   ```
   http://localhost:8000
   ```

## 💡 사용법

### 메모 작성
1. **새 메모 버튼** 클릭 또는 `Ctrl+N` 단축키
2. **카테고리 선택** (Journal, Quick Notes, Questionnaires, Goals)
3. **제목과 내용** 입력
4. **저장** 버튼 클릭 또는 `Ctrl+Enter`

### 카테고리 필터링
- **카테고리 카드 클릭**: 해당 카테고리의 메모만 표시
- **전체 보기**: 모든 카테고리의 메모 표시

### 메모 관리
- **편집**: 메모의 편집 버튼 클릭
- **삭제**: 메모의 삭제 버튼 클릭 (확인 후 삭제)
- **검색**: 상단 검색바에 키워드 입력

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary**: `#8b5cf6` (보라색)
- **Secondary**: `#ec4899` (핑크색)
- **Background**: `#f8fafc` (연한 회색)
- **Text**: `#1e293b` (진한 회색)

### 타이포그래피
- **제목**: Inter Bold, 2.5rem
- **카테고리**: Inter SemiBold, 1.5rem
- **본문**: Inter Regular, 1rem
- **라벨**: Inter Medium, 0.875rem

### 간격 시스템
- **기본 간격**: 20px
- **카드 간격**: 20px
- **내부 여백**: 24px
- **버튼 패딩**: 16px 24px

## 📱 반응형 지원

### 브레이크포인트
- **Desktop**: 1200px 이상
- **Tablet**: 768px - 1199px
- **Mobile**: 767px 이하
- **Small Mobile**: 480px 이하

### 모바일 최적화
- 터치 친화적 버튼 크기
- 모바일 우선 레이아웃
- 적응형 그리드 시스템
- 터치 제스처 지원

## 🔧 커스터마이징

### 색상 변경
`style.css`에서 CSS 변수 수정:
```css
:root {
    --primary-color: #8b5cf6;
    --secondary-color: #ec4899;
    --background-color: #f8fafc;
}
```

### 카테고리 추가
1. HTML에 새 카테고리 카드 추가
2. CSS에 카테고리별 스타일 정의
3. JavaScript에 카테고리 로직 추가

## 🚀 향후 계획

- [ ] 클라우드 동기화
- [ ] 마크다운 지원
- [ ] 태그 시스템
- [ ] 공유 기능
- [ ] 다크 모드
- [ ] 오프라인 지원

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Mirello** - 당신의 아이디어를 아름답게 기록하세요 ✨
"# vibe-coding-demo" 
