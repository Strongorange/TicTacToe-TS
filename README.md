# Directional-Test

# 메인 트러블 슈팅

## 새로고침하면 오류뜨는 문제

SSR 사용하여 query로 받은 boardSize, winTarget을 props로 넘겨주고
Hydration 문제를 야기시키는 randomStartPlayer 함수를 서버사이드로 옮겨 시작 플레이어를 서버에서 랜덤으로 정해줌

## 게임저장하고 불러올때 몇번째 턴인지 표시하는 기능

boardHistory로 게임 보드 상태를 관리했기에 게임 저장 자체는 어렵지 않았으나
각 기호위에 해당 기호가 놓인 차례를 표시해주는 기능을 구현하는데 어려움을 겪었다.  
게임 저장 기능만 생각해두고 턴 정보를 관리하지 않아서 생긴 문제였다.

생각해본 해결법은

1. 2차원 배열 boardState의 row-col 위치에 턴 정보도 같이 저장한다.

   1. 게임 턴수를 관리하는 state를 만든다.
   2. handleCellClick 함수에서 boardHistory에 push할때 턴 정보를 같이 넣어주는 방법
   3. 기존 2차원 배열의 boardState 는 [[O, X, O]... [...]]
   4. 현재 플레이어 정보만 있는 string에서 object로 변경한다.
   5. 여기에 턴 정보를 추가해
   6. ```typescript
      [
        [{"player" : "O", "turn" : 1},{"player" : "X", "turn" : 2},{"player" : "O", "turn" : 3}]
        ...
        [...]
        ]

      ```

      방식으로 만든다.

2. 턴수를 관리하는 2차원 배열을 만들고 boardState가 마킹될때 동일한 위치에 턴 수를 저장한다
   1. 결과적으로 동일한 크기, 형태의 2차원 배열이 만들어지며 존재하는 데이터만 달라진다.

첫번째 방법은 기존의 boardState의 구조를 변경해야하지만 메모리 낭비가 덜하고 두번째 방법은 기존의 boardState를 변경하지 않지만 메모리 낭비가 더 많다.

턴 정보와 플레이어를 함께 저장하는 첫번째 방법이 더 좋은 방법이라고 생각하여 첫번째 방법으로 구현하였다.

1. - [x] Cell 타입 설정, BoardState 타입 수정

2. - [x] 새로워진 구조에 맞게 initialBoardState 함수 수정
3. - [x] currentTurn state 추가

4. - [ ] handleCellClick 함수 수정
   1. - [x] winner나 위치에 플레이어가 있을때 return
   2. - [x] row-col 위치에 플레이어 정보와 턴 정보 저장
   3. - [x] 위 과정이 끝나면 turn + 1
5. - [x] checkWinner 함수 수정
   1. - [x] row-col 위치를 검사할때 객체의 player 키값을 검사하도록 수정
6. - [x] 렌더링 부분 수정
   1. - [x] row-col위치의 객체의 player 키값을 렌더링하도록 수정

### 버그

첫번째 클릭에 가로열이 모두 클릭되어 첫번째 플레이어가 무조건 승리하는 버그가 있었다.
initialBoardState를 생성할때 .fill({player:null, turn:null})로 초기화를 하였는데  
이렇게 하면 모든 객체가 같은 주소를 가리키게 되어서 생긴 문제였다.

```typescript
const initialBoardState: BoardState = new Array(boardSize)
  .fill(null)
  .map(() => new Array(boardSize).fill({ player: null, turn: null }));

const [boardState, setBoardState] = useState<BoardState>(initialBoardState);

const handlCellClick = (row: number, col: number) => {
  const newBoardState = boardState.map((row) => [...row]);
  newBoardState[row][col].player = "O";
  newBoardState[row][col].turn = 1;
};
```

map 함수는 새로운 배열을 만들어서 그 안에 각각의 원소를 변환하는 함수를 실행한 결과를 할당한다.  
하지만 배열 안에 있는 객체는 레퍼런스(참조) 타입으로, 배열 안에 있는 객체를 직접 수정하면 해당 객체의 참조가 저장된 모든 변수나 상수에서 해당 객체의 변화를 볼 수 있다.

즉, 현재 코드에서 newBoardState는 boardState와 같은 객체를 가리키고 있고 따라서 newBoardState[row][col]로 선택한 객체의 값을 바꿔도 boardState의 해당 위치 객체도 같은 참조이기 때문에 함께 변경되기때문에 위와같은 버그가 발생했다.

따라서 map을 이용하여 새로운 객체를 생성하는 것이 아니라, 다음과 같이 해당 위치의 객체를 복사한 새로운 객체를 만들어서 변경해야 한다

```typescript
const handlCellClick = (row: number, col: number) => {
  const newBoardState = boardState.map((row) => row.map((col) => ({ ...col })));
  newBoardState[row][col].player = "O";
  newBoardState[row][col].turn = 1;
  setBoardState(newBoardState);
};
```

불변성을 위지하기 위해 spread operator를 사용했으며 이렇게하면 `newBoardState`는 `boardState` 와 다른 참조를 가지게되어 연관성이 없는 독립적인 객체가 된다.


<img width="920" alt="image" src="https://user-images.githubusercontent.com/74127841/229264878-92185652-3cbf-43b4-b950-8ed5995865cf.png">

