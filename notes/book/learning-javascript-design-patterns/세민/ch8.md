## 패턴의 종류

### MVC 패턴

- Model: 도메인 관련 데이터를 다루며 View와 Controller 에 대해서는 관여하지 않음
- View: 모델의 현재 상태를 표현
- Controller: View와 Model의 상호작용 로직을 처리

#### 레이싱카 게임을 MVC 패턴으로 구현

- Model: Car.js
  - Car 이라는 하나의 객체로서 차의 움직임 (move) 을 책임진다.

```js
const { GAME } = require('../constant/constants');
const common = require('../utils/common');

class Car {
  #name;
  #distance;

  constructor(name) {
    this.#name = name;
    this.#distance = 0;
  }

  move() {
    const randomNumber = common.generateRandomNumberInRange(
      GAME.MOVE_CONDITION.min,
      GAME.MOVE_CONDITION.max,
    );
    if (randomNumber >= GAME.MOVE_CONDITION.satisfaction) this.#distance += 1;
  }

  getName() {
    return this.#name;
  }

  getDistance() {
    return this.#distance;
  }
}

module.exports = Car;
```

- View: InputView.js
  - readline 모듈을 통해서 console 입력 받기

```js
const readlinePromises = require('node:readline/promises');
const rl = readlinePromises.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const InputView = {
  async readline(text) {
    const input = await rl.question(text);
    return input;
  },
};

module.exports = InputView;
```

- View: OutputView.js
  - console output

```js
const OutputView = {
  print(text) {
    console.log(text);
  },
};

module.exports = OutputView;
```

- Controller: RacingGame.js
  - view, model 상호작용 로직

```js
const InputView = require('../view/InputView');
const OutputView = require('../view/OutputView');
const Car = require('../domain/Car');
const { GAME, INPUT, OUTPUT } = require('../constant/constants');
const { validateCarNames, validateWinningDistance } = require('../validation/input.js');
const { toInt } = require('../utils/common');

class RacingGame {
  #cars;
  #winningDistance;
  #histories;

  constructor() {
    this.#cars = [];
    this.#winningDistance = 0;
    this.#histories = [];
  }

  play() {
    OutputView.print(OUTPUT.startGame);
    this.setCars();
  }

  async setCars() {
    const input = await InputView.readline(INPUT.carName);
    const carNames = input.split(GAME.nameDivider);
    if (!validateCarNames(carNames)) return this.setCars();
    this.makeCars(carNames);
  }

  async makeCars(carNames) {
    carNames.forEach((carName) => {
      this.#cars.push(new Car(carName));
    });
    this.setWinningDistance();
  }

  async setWinningDistance() {
    this.#winningDistance = toInt(await InputView.readline(INPUT.winningDistance));
    if (!validateWinningDistance(this.#winningDistance)) return this.setWinningDistance();
    this.moveCars();
  }

  moveCars() {
    this.#cars.forEach((car) => car.move());
    this.#histories.push(
      this.#cars.map((car) => ({ name: car.getName(), distance: car.getDistance() })),
    );
    if (!this.#cars.some((car) => car.getDistance() >= this.#winningDistance)) {
      this.moveCars();
      return;
    }
    this.#showResult();
  }

  #showResult() {
    OutputView.print(OUTPUT.resultMent);
    this.#histories.forEach((history) => {
      history.forEach((car) => {
        OutputView.print(OUTPUT.result(car));
      });
      OutputView.print('');
    });
    this.showWinners();
  }

  showWinners() {
    const winners = this.#cars.filter((car) => car.isFinish(this.#winningDistance));
    OutputView.print(OUTPUT.winner(winners));
  }
}
module.exports = RacingGame;
```

---

### MVP 패턴

- Presenter: UI와 비즈니스 로직을 중재

#### 전환 이유 (장점)
- 테스트 용이성: Presenter는 UI와 독립된 순수 로직으로 구현되므로, 단위 테스트를 통한 검증이 쉬움
- 유연성 및 모듈화: View 인터페이스를 추상화함으로써 다양한 UI 구현(예: 웹, 모바일) 간에 코드를 재사용하거나 교체하기 편리
- 단순한 View 구현: View는 단순히 데이터를 표현하는 역할만 수행하므로, 복잡한 로직이 줄어들고 UI 변경에 따른 영향을 최소화

#### MVC와의 차이점
- 의미론적인 수준이여서, MVC에 존재하는 근본적인 문제들이 존재할 가능성이 크다.

---

### MVVM 패턴

- ViewModel: Model과 View 사이의 인터페이스 역할 (데이터를 바인딩)
  - DOM(View) -> DOM Listeners (ViewModel) -> JS Logic(Model) -> Directives(ViewModel) -> DOM(View) 와 같은 순서

대표적으로 Vue 가 VM을 이용한 양방향 데이터 바인딩을 수행한 프레임워크이다.

#### 전환 이유 (장점)

- 양방향 데이터 바인딩: View와 ViewModel 간 자동 동기화가 이루어져, 코드에서 직접 UI 업데이트를 관리할 필요가 없습니다. 이로 인해 개발 생산성이 향상되고, UI 업데이트 로직이 단순해짐
- 명령(Command) 및 이벤트 처리: 단순히 데이터를 보관하는 역할을 넘어 사용자의 행동(예: 버튼 클릭)과 관련된 명령(Command)들을 구현하여, View와 연동할 수 있게 함

#### 레이싱카 게임을 MVVM 패턴으로 구현

`Model과 View는 MVC와 동일함.`

- ViewModel
```js
const EventEmitter = require('events');
const Car = require('../domain/Car');
const { GAME } = require('../constant/constants');
const { validateCarNames, validateWinningDistance } = require('../validation/input.js');
const { toInt } = require('../utils/common');

class RacingGameViewModel extends EventEmitter {
  #cars;
  #winningDistance;
  #histories;

  constructor() {
    super();
    this.#cars = [];
    this.#winningDistance = 0;
    this.#histories = [];
  }

  setCars(carNames) {
    if (!validateCarNames(carNames)) {
      this.emit('error', '잘못된 자동차 이름입니다. 다시 입력해주세요.');
      return;
    }
    carNames.forEach((name) => {
      this.#cars.push(new Car(name));
    });
    this.emit('carsSet');
  }

  setWinningDistance(distance) {
    const intDistance = toInt(distance);
    if (!validateWinningDistance(intDistance)) {
      this.emit('error', '잘못된 우승 거리입니다. 다시 입력해주세요.');
      return;
    }
    this.#winningDistance = intDistance;
    this.emit('winningDistanceSet');
  }

  moveCars() {
    const moveRound = () => {
      this.#cars.forEach((car) => car.move());
      const currentRound = this.#cars.map((car) => ({
        name: car.getName(),
        distance: car.getDistance()
      }));
      this.#histories.push(currentRound);
      this.emit('roundCompleted', currentRound);

      if (this.#cars.some((car) => car.getDistance() >= this.#winningDistance)) {
        this.emit('raceCompleted', this.#cars, this.#histories);
      } else {
        setImmediate(moveRound);
      }
    };

    moveRound();
  }

  getWinningDistance() {
    return this.#winningDistance;
  }
}

module.exports = RacingGameViewModel;

```
```js
const InputView = require('../view/InputView');
const OutputView = require('../view/OutputView');
const RacingGameViewModel = require('../viewmodel/RacingGameViewModel');
const { INPUT, OUTPUT, GAME } = require('../constant/constants');

class RacingGameView {
  constructor() {
    this.viewModel = new RacingGameViewModel();

    this.viewModel.on('error', (message) => {
      OutputView.print(message);
      this.start();  
    });

    this.viewModel.on('carsSet', () => {
      this.askWinningDistance();
    });

    this.viewModel.on('winningDistanceSet', () => {
      this.viewModel.moveCars();
    });

    this.viewModel.on('roundCompleted', (roundData) => {
      roundData.forEach((carData) => {
        OutputView.print(OUTPUT.result(carData));
      });
      OutputView.print('');
    });

    this.viewModel.on('raceCompleted', (cars, histories) => {
      OutputView.print(OUTPUT.resultMent);
      histories.forEach((round) => {
        round.forEach((carData) => {
          OutputView.print(OUTPUT.result(carData));
        });
        OutputView.print('');
      });
      this.showWinners(cars);
    });
  }

  async start() {
    OutputView.print(OUTPUT.startGame);
    await this.askCarNames();
  }

  async askCarNames() {
    const input = await InputView.readline(INPUT.carName);
    const carNames = input.split(GAME.nameDivider);
    this.viewModel.setCars(carNames);
  }

  async askWinningDistance() {
    const input = await InputView.readline(INPUT.winningDistance);
    this.viewModel.setWinningDistance(input);
  }

  showWinners(cars) {
    const winningDistance = this.viewModel.getWinningDistance();
    const winners = cars.filter(car => car.getDistance() >= winningDistance);
    OutputView.print(OUTPUT.winner(winners));
    process.exit(0);
  }
}

module.exports = RacingGameView;

```