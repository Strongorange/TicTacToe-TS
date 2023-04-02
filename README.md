# Tic Tac Toe with Next.js and TypeScript

Typescript와 Next.js를 사용해서 만든 간단한 틱택토 게임입니다.
두 명의 플레이어가 차례대로 보드판에 마킹하여 가로,세로, 대각선 방향으로 지정된 수 만큼 연속으로 마킹한 플레이어가 승리하는 게임입니다.  
원래 틱택토 게임은 3x3 보드를 사용하지만 본 게임에서는 3x3, 4x4, 5x5 보드를 사용할 수 있습니다.  
기본 승리조건은 N x N 보드에서 N개의 마킹을 연속으로 하면 승리하는 게임이지만 사용자가 설정할 수도 있습니다.

</br>
</br>

# 데모 [🌐](https://bit.ly/40xSiQF)
[https://bit.ly/40xSiQF](https://bit.ly/40xSiQF)

# 기술 스택

- Typescript
- Next.js
- TailwindCSS

</br>

# 핵심 기능

- 3x3, 4x4, 5x5 보드 선택
- 각 플레이어마다 3회의 되돌리기 기능
- 게임 종료 후 게임 보드를 저장하고 다시 불러올 수 있는 기능

</br>
</br>

# 핵심 트러블 슈팅

<details>
   <summary style="font-size: 22px;">Spread Operator 다차원 배열 객체 참조 문제</summary>

2차원 배열 boardState의 요소에 turn 정보를 추가하기위해 데이터를 "O" | "X"의 string에서
{player: "O" | "X", turn: number}의 object로 변경 후 게임 보드를 클릭했을때 같은 row의 모든 요소가 변경되는 문제가 발생했다.

문제가 발생했던 코드

```typescript
const newBoardState = boardState.map((row) => [...row]);
```

### 문제가 발생한 원인

문제가 발생했던 코드는 newBoardState가 생성될때 객체 참조를 이용해서 생생되어 같은 행의 모든 요소가 동일한 객체를 참조하게되어 다른 요소들도 영향을 받기 때문이었다.
spread 연산자는 깊은 복사를 실행한다고 배웠고 지금까지 실제로 그렇게 작동했었는데 이번에는 그렇지 않았다.
[참고 📌](https://velog.io/@yukyung/Spread-Operator%EB%8A%94-%EC%96%95%EC%9D%80-%EB%B3%B5%EC%82%AC%EC%9D%BC%EA%B9%8C-%EA%B9%8A%EC%9D%80-%EB%B3%B5%EC%82%AC%EC%9D%BC%EA%B9%8C)

**Spread Operator는 1depth 값에서만 깊은 복사를 실행한다** 즉 다차원 배열을 복사하기에 적합하지 않다고 한다.

이를 해결하기 위해서 각 행에 대해 새로운 배열을 생성할때 각 행에 다시 map을 사용해 col에 대한 1 depth의 새로운 객체를 생성하고 이를 배열로 만들어 서로 독립적인 객체를 가지는 새로운 배열을 만들어야한다.

해결된 코드

```typescript
const newBoardState = boardState.map((row) => row.map((col) => ({ ...col })));
```

객체의 참조에 대해서는 알고있다고 생각했는데 이런 문제가 발생할 줄 몰랐다.  
spread 연산자는 정말 많이 사용하고있었고 객체의 참조를 유지하지 않고 깊은 복사를 하기위해서 사용하던 방법이었는데 다차원 배열에서는 생각대로 동작하지 않는다는 것을 알게되었다.
이 경험을 통해 객체의 참조에대해 다시 찾아보며 공부할 수 있는 계기가되었다.

</details>

</br>
</br>

# 기타 트러블 슈팅

<details>
   <summary style="font-size: 22px;">게임 플레이에서 새로고침하면 오류뜨는 문제</summary>

[Github 📌](https://github.com/Strongorange/TicTacToe-TS/commit/33a29a2d8ebbc2db4577c33ad7c3c5a22f04fafc)  
라우터로 전달한 쿼리가 새로고침시 인식되지 않아 생긴 문제였다.  
SSR 함수 getServerSideProps를 사용하여 query로 받은 boardSize, winTarget을 props로 넘겨주고
Hydration 문제를 야기시키는 randomStartPlayer 함수를 서버사이드로 옮겨 시작 플레이어를 서버에서 랜덤으로 정해주었다.

</details>

</br>

<details>
   <summary style="font-size: 22px;">현재 턴 정보 저장하기</summary>

[Github 📌](https://github.com/Strongorange/TicTacToe-TS/commit/7d2219aec394635184acd5ca998c077f3f8ae8b8)

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

</details>

</br>
</br>

# 개발과정 정리

[블로그 📝](https://velog.io/@strongorange/tictactoe1)

---
