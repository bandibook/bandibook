## 들어가며
정리는 도은핑이 야무지게 해주셨더군요. 저는 의견을 나눠볼만한 것들과 디자인 패턴을 적용한 경험을 위주로 정리해보았습니다.

## 7.2 생성자 패턴

자바스크립트의 프로토타입에 메서드를 직접 생성하는게 가독성, 안정성 측면에서 좋은 방식일지요?

**[장점]**

- 모든 인스턴스가 공유하는 메서드를 한 곳 프로토타입 에 설정할 수 있으므로 메모리 효율적으로 사용 가능합니다.
  - toString과 같은 공통 메서드는 매 인스턴스마다 생성할 필요는 없습니다. 따라서 프로토타입에 생성 시 효율적인 관리 가능합니다.

**[단점]**

- 프로토타입에 직접 설정하면 모든 인스턴스의 공통 적용되므로 히스토리 관리가 되지 않는다면, 예기치 못한 버그로 이어질 수 있습니다.
  - 사실 이 이유만으로도 쓰지 않는게 맞지 않나 라는 생각이 들긴해요.

## 7.5 싱글톤 패턴

개인적으로 자바스크립트에서 굉장히 자주 사용되는 패턴이라고 생각합니다. 브라우저 환경에서는 몰랐는데 Next.js와 같은 서버 환경에서는 잘못 사용하면 매우 위험한 패턴이더라구요?

### 서버 환경에서 싱글톤
브라우저는 각 유저마다 유저의 환경에서 구동되므로 싱글톤 패턴이 크게 문제를 일으키는 일은 없는데, 서버는 (거의) 모든 유저가 하나의 서버에 요청을 보내다보니 싱글톤 패턴을 남발하면 예기치 않은 버그가 발생할 수 있습니다.

경험담을 비유하면 React Query를 싱글톤으로 관리한다면 다음과 같은 일이 발생할 수도 있습니다.

1. A가 서버에 최초 요청 보냄. 인스턴스가 비어있으므로 A 인스턴스 생성 후 응답.
2. B가 서버에 요청 보냄. A 인스턴스를 응답. (이후 B 인스턴스를 생성 후 응답.)

즉, B 사용자가 A 사용자의 정보를 아주 잠깐 볼 수 있는 버그가 발현되더군요. 물론 인스턴스를 생성하는 로직은 있기 때문에, 영구히 보이진 않고 찰나의 순간만 보이지만 이는 심각한 보안 사고를 유발할 수 있습니다.

이처럼 서버 환경에서 싱글톤은 주의가 필요할 것 같습니다.

## 7.6 프로토타입 패턴

프토토타입 패턴과 [철학적 관점](https://parkjju.github.io/vue-TIL/javascript/prototype.html)
- 개인적으로 객체 지향 패턴보단 포로토타입 패턴을 조금 더 선호하는 편입니다. (실리적이고 효율적이라고 생각)

## 7.14.2 추상 데코레이터

메서드 오버라이드에 대해서 어떻게 생각하나요?
- 더 나아가 타입스크립트 interface 병합에 대해서는? (실제로 활용하는 케이스가 있는지?)

## 7.16.4 플라이웨이트
메모리 경량화를 위해서 공통된 부분을 외부로 정의한다고 되어있는데, 그 외부도 싱글톤 형태의 데이터베이스 성격을 띄기 때문에 메모리 경량화 측면에서 얼마나 이점이 있을지 궁금하군요.

책에서는 아래의 코드를 예시로 들고 있습니다.

```js
// 책의 공통 속성을 정의하는 외부 데이터 베이스
const bookRecordDataBase = {}

class BookRecordManager {
  updateBookRecord ({id, title, status, ...rest}) {
    // bookRecordDataBase 업데이트 로직
  }
}

class Book {
  constructor ({id, title, author, genre, ...rest}) {
    // 책의 속성
  }
}
```
결국 Book 인스턴스의 개수만큼 `bookRecordDataBase` 에 객체가 쌓이는 구조일텐데, Book 클래스 내부에 외부 속성을 관리하는 것이랑 큰 차이가 있나 생각이 들군요.

각종 getter 메서드를 생략할 수 있기 때문에, 이 부분에서 이점이 큰 것일까요?

### GPT 4o 센세의 답변

```
당신이 지적한 대로, bookRecordDataBase 도 결국은 데이터를 저장해야 하므로, 메모리 절약의 효과가 미미해 보일 수 있습니다. 하지만 주요한 차이점은 다음과 같습니다.

1. 중복 데이터의 제거
  - Book 인스턴스 내부에 모든 데이터를 저장하면, 중복된 데이터도 개별 인스턴스마다 존재하게 됩니다. 하지만 bookRecordDataBase 같은 공유 저장소를 사용하면, 같은 책 정보(title, author, genre 등)는 한 번만 저장되고, 개별 Book 인스턴스는 최소한의 정보(id 등)만 유지합니다. 예를 들어, 같은 책이 여러 사용자에 의해 대여된다고 가정하면, title, author, genre 등의 정보가 Book 인스턴스마다 중복될 필요 없이, bookRecordDataBase 에 한 번만 저장될 수 있습니다.

2. 객체 생성 비용 감소
- 일반적으로 객체를 생성할 때마다 속성을 메모리에 할당해야 하는데, 플라이웨이트 패턴을 사용하면 동일한 데이터를 여러 개의 인스턴스가 공유할 수 있어, 불필요한 속성 할당을 줄일 수 있습니다. Book 인스턴스가 갖는 정보가 id 같은 최소한의 값이면, 수천 개의 Book 인스턴스를 생성해도 메모리 사용량이 훨씬 줄어듭니다.

3. 데이터 접근 방식의 변화 (메모리 vs 참조)
- 만약 Book 클래스가 모든 속성을 내부적으로 가진다면, 각 인스턴스가 각각의 메모리를 차지하게 됩니다. 반면, bookRecordDataBase 를 사용하면 Book 인스턴스들은 해당 객체를 참조(Reference)하는 방식으로 접근하므로, 객체 크기를 줄일 수 있습니다. 예를 들어, title, author, genre 등은 bookRecordDataBase[id] 에 저장하고, Book 인스턴스는 id 만 유지한 후 필요할 때 참조하는 구조가 됩니다.

4. 속성 변경 시 효율성 증가
- bookRecordDataBase 같은 저장소를 사용하면 특정 속성을 업데이트할 때 모든 Book 인스턴스를 수정할 필요가 없습니다. 예를 들어, title 이 변경될 경우, bookRecordDataBase 에서 한 번만 변경하면 관련된 모든 Book 인스턴스가 변경된 값을 참조할 수 있습니다. 반면, Book 인스턴스 내부에 title 을 저장하면, 모든 인스턴스를 순회하면서 값을 변경해야 합니다.

**[결론]**
- 플라이웨이트 패턴의 효과는 데이터의 중복 정도에 따라 다릅니다.

- 중복이 적다면: 메모리 절약 효과가 크지 않음
- 중복이 많다면: 중복 제거로 인해 상당한 메모리 절약 가능

즉, bookRecordDataBase 같은 저장소가 단순한 싱글톤이 아니라, 공유 가능한 데이터를 저장하는 역할을 하며, 개별 객체는 ID나 상태 같은 최소한의 정보만 유지할 때 효과적입니다.
```

위 답변을 미루어보았을 때 다음 두 가지 맥락에서 장점이 있겠군요.

1. 외부 상태는 대부분 중복되며 재정의 되지 않은 상태일 수 있다. (모든 책이 대출 상태는 아니므로)
2. 책 인스턴스 내부의 메서드 또는 필드 생성 비용을 줄일 수 있다.

## 7.16.8 중앙 집중식 이벤트 핸들링
이 방식에 대해서 어떻게 생각하나요?

결국 이벤트 버블링, 캡쳐링 등의 속성을 활용해서 이벤트 핸들러를 특정 엘레멘트에 위임해서 통합 관리하는 방식으로 이해했는데, 저는 비선호하는 방식입니다.

**[비선호 이유]**
- 이벤트 핸들링 로직을 한 곳에 몰아 넣을 수 있어서 코드 응집도가 높아질 수 있지만, 결합도도 동시에 높아집니다. (핸들러 내부에서 분기 발생 가능성 높음)
- `e.stoppropagation()` 메서드를 사용하는 경우, 즉 세밀한 이벤트 핸들링 컨트롤이 어렵습니다.

## 7.18 관찰자 패턴

저는 개인적으로 이 관찰자(옵저버) 패턴을 좋아합니다. 예전에 바닐라 자바스크립트로 과제를 할 때 썼던 방식 ([PR 링크](https://github.com/semnil5202/vanilla-js-practice/pull/2/files)) 도 나쁘지는 않았습니다.

각 컴포넌트마다 결합도를 낮추고 상태를 효과적으로 관리할 수 있었습니다. (물론 모든 상태가 전역 상태가 되서, 상태가 너무 많아지면 관리가 되려 어려웠지만요.)

유사한 패턴으로 프록시 패턴도 활용해보았었습니다. ([PR 링크](https://github.com/semnil5202/vanilla-js-practice/pull/3/files)) 개인적으론 옵저버 패턴이 조금 더 취향인편..

## 7.18.1 관찰자 패턴과 발행/구독 패턴의 차이점

개인적으로 관찰자 패턴과 발행/구독 패턴의 구분이 명확하지 않았는데요. GPT 4o 센세가 아주 좋은 예시를 들어줘서 공유드립니다.

결국 Subject와 Observer 간 Event Bus 같은 매개 요소를 하나 두어서, Subject와 Observer 간 의존성을 끊고 매개 요소에 위임하게 되네요.

### GPT 4o 센세의 답변
```
옵저버 패턴과 PubSub(발행-구독) 패턴은 개념이 비슷하지만 중요한 차이가 있어. 동일한 예시(유튜브 구독 시스템)를 통해 비교해볼게.

🎥 예제: 유튜브 채널 구독 시스템
1️⃣ 옵저버 패턴 (Observer Pattern)
옵저버 패턴에서는 구독자(Observer)가 직접 유튜브 채널(Subject)에 등록해서 변경 사항을 알림받아.
```

```javascript
// 유튜브 채널 (Subject)
class YouTubeChannel {
  constructor(name) {
    this.name = name;
    this.subscribers = []; // 구독자 리스트
  }

  subscribe(subscriber) {
    this.subscribers.push(subscriber);
  }

  unsubscribe(subscriber) {
    this.subscribers = this.subscribers.filter(sub => sub !== subscriber);
  }

  uploadNewVideo(videoTitle) {
    console.log(`📢 ${this.name} 채널: '${videoTitle}' 업로드!`);
    this.subscribers.forEach(sub => sub.notify(this.name, videoTitle));
  }
}

// 구독자 (Observer)
class Subscriber {
  constructor(name) {
    this.name = name;
  }

  notify(channel, videoTitle) {
    console.log(`👀 ${this.name}님, ${channel} 채널의 '${videoTitle}' 새 영상이 업로드되었습니다!`);
  }
}

// 사용 예시
const channel = new YouTubeChannel("개발 채널");
const user1 = new Subscriber("철수");
const user2 = new Subscriber("영희");

channel.subscribe(user1);
channel.subscribe(user2);

channel.uploadNewVideo("옵저버 패턴 vs PubSub 패턴"); 
// 📢 개발 채널: '옵저버 패턴 vs PubSub 패턴' 업로드!
// 👀 철수님, 개발 채널의 '옵저버 패턴 vs PubSub 패턴' 새 영상이 업로드되었습니다!
// 👀 영희님, 개발 채널의 '옵저버 패턴 vs PubSub 패턴' 새 영상이 업로드되었습니다!
```

> 🔍 옵저버 패턴 특징
>
> **구독자(Observer)** 가 직접 채널(Subject)을 알고 있어야 함. 채널이 구독자 리스트를 직접 관리하며, 업로드될 때 직접 알림을 보냄. 객체 간 강한 결합이 있음(구독자가 채널을 직접 알고 있어야 함).

```
2️⃣ PubSub (Publish-Subscribe) 패턴
PubSub 패턴에서는 채널과 구독자가 서로 직접 알지 않음. 이벤트 브로커(Event Bus)가 중간에서 전달 역할을 해.
```
```javascript
// 이벤트 브로커 (PubSub 시스템)
class EventBus {
  constructor() {
    this.subscribers = {};
  }

  subscribe(event, callback) {
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }
    this.subscribers[event].push(callback);
  }

  publish(event, data) {
    if (this.subscribers[event]) {
      this.subscribers[event].forEach(callback => callback(data));
    }
  }
}

// 이벤트 시스템 생성
const eventBus = new EventBus();

// 유튜브 채널 (발행자)
class YouTubeChannel {
  constructor(name) {
    this.name = name;
  }

  uploadNewVideo(videoTitle) {
    console.log(`📢 ${this.name} 채널: '${videoTitle}' 업로드!`);
    eventBus.publish("new-video", { channel: this.name, videoTitle });
  }
}

// 구독자 (구독자)
class Subscriber {
  constructor(name) {
    this.name = name;
    eventBus.subscribe("new-video", this.notify.bind(this));
  }

  notify({ channel, videoTitle }) {
    console.log(`👀 ${this.name}님, ${channel} 채널의 '${videoTitle}' 새 영상이 업로드되었습니다!`);
  }
}

// 사용 예시
const channel2 = new YouTubeChannel("개발 채널");
const user3 = new Subscriber("철수");
const user4 = new Subscriber("영희");

channel2.uploadNewVideo("옵저버 패턴 vs PubSub 패턴");
// 📢 개발 채널: '옵저버 패턴 vs PubSub 패턴' 업로드!
// 👀 철수님, 개발 채널의 '옵저버 패턴 vs PubSub 패턴' 새 영상이 업로드되었습니다!
// 👀 영희님, 개발 채널의 '옵저버 패턴 vs PubSub 패턴' 새 영상이 업로드되었습니다!
```
> 🔍 PubSub 패턴 특징
>
> 유튜브 채널(발행자)과 구독자(구독자)가 직접 서로 알 필요 없음. 이벤트 브로커(Event Bus)를 통해 메시지를 중재. 더 유연하고 확장 가능하지만, 중간 이벤트 브로커가 없으면 메시지를 받을 수 없음.

- 🎯 비교 정리

| 특징 | 옵저버 패턴 | PubSub 패턴 |
|------|-----------|-------------|
| **구독 방식** | 객체(Subject)가 직접 구독자(Observer) 관리 | 중앙 이벤트 브로커(Event Bus)를 통해 관리 |
| **결합도** | 높은 결합도 (Subject가 Observer를 직접 참조) | 낮은 결합도 (발행자와 구독자가 서로 모름) |
| **알림 방식** | Subject가 직접 Observer에 알림 | 이벤트 브로커가 구독자에게 알림 |
| **확장성** | 다소 제한적 (Subject가 직접 Observer를 관리해야 함) | 확장성이 뛰어남 (브로커만 변경하면 구조 변경 가능) |
| **사용 예시** | UI 이벤트 핸들링, 모델-뷰 패턴 등 | 메시징 시스템, 이벤트 드리븐 아키텍처 등 |

PubSub에서 Event Bus 만 갈아 끼우면 여러 맥락의 구독도 가능하겠네요. (ex: 유튜브, 트위터, 인스타그램을 각각의 Event Bus로 바라보기)