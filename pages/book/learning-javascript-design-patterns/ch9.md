## 1. 자바스크립트 환경

자바스크립트는 **싱글 스레드 기반의 언어** 이다. 브라우저와 Node.js 모두 단일 스레드에서 동작하기 때문에, 네트워크 요청, 파일 입출력, 대규모 데이터 처리 등 시간이 오래 걸리는 작업이 있을 때 이를 **비동기적으로** 처리하지 않으면 전체 애플리케이션이 멈춘다.

## 2. 콜백 패턴

### 2.1 콜백 함수

콜백 함수는 `특정 작업이 끝난 뒤 호출되는 함수`를 말한다.

```js
setTimeout(function() {
  console.log('3초 후 실행!');
}, 3000);
```

### 2.2 콜백 지옥

콜백 안에서 또 다른 비동기 콜백을 부르면, 코드가 점점 “옆으로” 길어지고 가독성이 떨어진다.

```js
login(user, function(err, info) {
  if (err) { ... }
  getProfile(info.id, function(err, profile) {
    if (err) { ... }
    updateUI(profile);
  });
});
```
**문제점** 

- 들여쓰기가 깊어진다.
- 에러 핸들링이 중첩 구조로 반복된다.

---

## 3. Promise 패턴

### 3.1 Promise

Promise는 **아직 끝나지 않은 비동기 작업**을 감싸는 객체이다.

3가지 상태:  
- Pending(대기),  
- Fulfilled(성공),  
- Rejected(실패)

```js
const promise = fetch('api/data');
promise.then(res => res.json()).catch(err => ...);
```

**장점**  

- then/catch로 직렬 처리와 에러 분리를 깔끔하게 할 수 있다.
- 여러 비동기 작업을 “체인” 형태로 이어 쓸 수 있다.

### 3.2 Promise 체이닝

```js
login(user)
  .then(info => getProfile(info.id))
  .then(profile => updateUI(profile))
  .catch(err => handleError(err));
```
- 들여쓰기가 유지되는 then 체이닝 지옥이 발생한다.
- 에러 핸들링을 한 군데로 모일 수 있다.

### 3.3 ⭐ Promise.all / Promise.race

#### Promise.all
여러 비동기 작업을 병렬로 실행:
```js
Promise.all([api1(), api2(), api3()])
  .then(([res1, res2, res3]) => { ... });
```
- 여러 API를 병렬적으로 요청한다.

#### Promise.race
가장 먼저 종료(fulfilled 또는 rejected)되는 Promise의 결과(값 또는 에러)를 반환
```js
function fetchWithTimeout(url, options = {}, timeout = 5000) {
  const fetchPromise = fetch(url, options);
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Request timed out')), timeout)
  );

  return Promise.race([fetchPromise, timeoutPromise]);
}
```
```js
fetchWithTimeout('https://jsonplaceholder.typicode.com/todos/1', {}, 2000)
  .then(res => res.json())
  .then(data => {
    console.log('성공:', data);
  })
  .catch(err => {
    console.error('실패:', err.message); // 2초 안에 응답 없으면 'Request timed out'
  });

```

---

## 4. async/await 패턴

### 4.1 async/await

Promise 패턴은 좋지만 여전히 then/catch의 “계단식” 체이닝이 발생한다.
**async/await**는 이러한 Promise 기반 비동기 코드를 **동기 코드**처럼 흐를 수 있게 해준다.

```js
async function showProfile(user) {
  try {
    const info = await login(user);
    const profile = await getProfile(info.id);
    updateUI(profile);
  } catch (err) {
    handleError(err);
  }
}
```
- 가독성 향상.
- try/catch 문으로 에러도 동기 코드처럼 처리.

---

## 5. 비동기 제어 흐름 패턴

### 5.1 시퀀셜(순차) vs. 패러럴(병렬) 실행

비동기 작업은 서로 의존성이 있으면 순차로, 독립적이면 병렬로 처리하는 것이 효율적이다.

- **순차 실행**: for...of + await
- **병렬 실행**: Promise.all

```js
for (const url of urls) {
    const response = await fetch(url);
}
```

(사실상 위 두 개 말고는 써본적이 없는.. 🤔)

## 6. 궁금한 점

### 8.2 Promise와 async/await 선택 기준
- 코드가 짧고 한 번만 쓰이는 곳엔 Promise 체이닝이 더 가독성 높을 때도 있다.
- 하지만 실제 비즈니스 로직, 특히 여러 단계의 API 요청과 조건 분기가 뒤섞이면 async/await가 훨씬 낫다고 생각함.

혹시 Promise랑 async/await를 혼용해서 쓰는지? 언제는 00 을 쓴다. 이런 기준이 있는지?

