## LCP 최적화하기

> 반디부디가 느려터졌다는 이야기를 듣고
> 
> 사이트 성능 측정을 해보았습니다
> 
> 그리고 이 글을 작성하게 되는데...

### LCP
- 모든 웹 경험에서 중요한 공통 집합을 `Core Web Vitals` 이라고 하는데 그 중 하나
- [Large Contentful Paint](https://web.dev/articles/lcp?hl=ko)
- 페이지를 처음 로드 했을 때, 가장 큰 컨텐츠가 렌더링 되는 시점까지 걸리는 시간
   - 보통 LCP가 `0 - 2.5초`면 빠름
   - `2.5 ~ 4초`: 중간
   - `4초 이상`: 느림


#### 반디부디 LCP

<img width="400" alt="image" src="https://github.com/10000-Bagger/free-topic-study/assets/80238096/62370971-e805-444b-8dee-d16eea6668c5">

> LCP `4.8초` ..
> 심각하게 느린 편 🗿

> 참고: 웹사이트 속도가 중요한 이유
> 
> <img width="300" alt="image" src="https://github.com/10000-Bagger/free-topic-study/assets/80238096/40c8e89b-6fd1-4cca-8fbf-959e4ea2bc51">
>
> 반디부디 유저 이탈율 38% 확보.


## LCP 개선하기
- 페이지 로딩 ~ LCP까지 대략적으로 아래 일들이 발생
   - DNS, TCP, TLS / 리다이렉트 / TTFB / First Paint / FCP
- 이 중 하나만 느려도 LCP에 영향을 미침

### 1. 사이즈가 큰 이미지 제거하기

> 가장 큰 컨텐츠로 잡혔던 부분은 아래 이미지 내 빨간박스 영역

<img width="300" alt="image" src="https://github.com/10000-Bagger/free-topic-study/assets/80238096/c275aa9e-ed0a-486a-8ebb-b2aec0a7343e">

- LCP 측정 시간:`4830ms` 로 아주 오래 걸림

주로 이미지로 인한 LCP 개선 방식은
1. CSS에 정의된 리소스 대신 -> `<img />` 와 같은 HTML 태그 사용
2. `webp`, `avif` 같은 이미지 형식 사용
3. 이미지 용량 압축

등등 이외 1024가지의 방법이 존재하는데

반디부디에서는 어떻게 해결을 했냐면
- 해결 방식: 이미지 제거
    - 사실상, 이미지로 인한 문제이기 때문에 이미지 자체를 사용하지 않는게 베스트
    - 기존 그라데이션만 들어간 이미지이기 때문에 이미지 압축 및 변환 필요 없이 css로 변환 가능

### 2. 번들 사이즈 줄이기

#### 번들 사이즈가 중요한 이유
  - 자바스크립트는 이미지나 웹 폰트 등과 다르게 **브라우저가 처리하는 비용이 많이 듦**
     - 이미지: `파일 다운로드 -> 디코딩`
     - 자바스크립트: `파일 다운로드 -> 파싱 -> 컴파일 -> 실행`

#### 번들 사이즈 확인하기
  - [bundle-analyzer]()를 사용하면 번들 크기를 시각적으로 확인할 수 있음

반디부디의 번들 사이즈 측정 결과
  ![image](https://github.com/10000-Bagger/free-topic-study/assets/80238096/35e3bbb4-21bf-4c49-9b39-fea2cc45e4e6)

#### 번들 사이즈 줄이는 방법
1. 용량이 큰 라이브러리 -> 용량이 더 작은 라이브러리로 대체
    - [bundle phobia](https://bundlephobia.com/) 에서 라이브러리 용량 확인 가능
2. 같은 용도의 라이브러리 -> 하나로 통일

#### 더 가벼운 라이브러리 사용하기

- 용량이 큰 `lottie` -> `lottie-light` 버전을 사용해서 번들 사이즈 줄이기
 
| AS-IS | TO-BE |
|--------|--------|
| ![image](https://github.com/depromeet/amazing3-fe/assets/80238096/1e03ce02-932a-410b-8871-b80427860c52) | ![image](https://github.com/depromeet/amazing3-fe/assets/80238096/27c05d23-c25e-4129-9605-393413128f50) |
| gzip `75kb` | gzip `44kb` | 

---

- 참고자료
   - [LCP](https://web.dev/articles/lcp?hl=ko)
   - [토스 - Javascript Bundle Diet](https://www.youtube.com/watch?v=EP7g5R-7zwM)
