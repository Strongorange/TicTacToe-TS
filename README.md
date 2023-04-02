# Tic Tac Toe with Next.js and TypeScript

# TODO

- [ ] 게임 완성후 Firebaes에 유저별로 데이터 저장하기

# 메인 트러블 슈팅

## 새로고침하면 오류뜨는 문제

SSR 사용하여 query로 받은 boardSize, winTarget을 props로 넘겨주고
Hydration 문제를 야기시키는 randomStartPlayer 함수를 서버사이드로 옮겨 시작 플레이어를 서버에서 랜덤으로 정해줌

## 현재 턴 정보 저장하기

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

4. - [x] handleCellClick 함수 수정
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

> 정상적인 위치에 턴 정보, 플레이어 정보가 저장되는 것을 확인할 수 있다.
> <img width="920" alt="image" src="https://user-images.githubusercontent.com/74127841/229264878-92185652-3cbf-43b4-b950-8ed5995865cf.png">

## 게임 저장

이제 boardState에 턴 정보까지 저장하는 것을 성공했으니 게임을 저장하는 기능을 구현해보자.

### 어디까지 저장할까?

> boardHistory 전체 vs boardHistory의 마지막 요소만 저장

현재 게임판의 변화는 boardHistory에 저장되고 이를 통해 게임의 상황을 추적할 수 있다.  
게임이 종료된 판을 다시 불러와 턴 수를 표시해주는 기능이라면 gameHistory의 가장 마지막 요소를 불러오면 되고 기능이 그 뿐이라면 gameHistory 배열 전체를 다 보낼 필요없이 가장 마지막 요소만 보내면 된다.

하지만 추후에 어떤 기능을 추가할지 모르기 때문에 게임의 모든 정보를 저장하는 것이 좋다고 생각하여 gameHistory 배열 전체를 저장하도록 구현하였다.

> 어디에 저장할까?

데이터를 저장하는 방법은 여러가지가 있고 개인적으로 localStorage와 firebase를 사용하는 것을 좋아해 비교해보았다.

- localStorage

  - 가장 간단함
  - 오프라인에서도 동작

- firebase
  - 유저별로 데이터를 저장할 수 있음
  - 인터넷 연결이 가능한 어디서든 접근 가능
  - 유저간 데이터를 기반으로 다양한 기능을 제공할 수 있음

firebase를 사용하고 싶지만 일단 앱을 만들고 나서 firebase를 사용하는 것이 더 좋을 것 같아서 localStorage를 사용하기로 결정하였다.

### 구현

게임이 끝나고 모달창의 저장 버튼을 누르면 현재 게임의 boardHistory를 localStorage에 저장한다.  
하지만 현재 boardHistory 는 gameplay.tsx의 상태로 관리되고 있기 때문에 Modal에서 직접적으로 boardHistory에 접근할 수 없다.

이를 해결하가 위해 Recoil을 사용해 boardHistory를 전역 상태로 관리할 수도 있지만 상태 하나만을 위해 굳이 그렇게까지 할 필요는 없다고 생각해 saveGame을 콜백함수로 전달하여 Modal에서 게임을 저장할 수 있게 하였다.

> gameplay.tsx

```typescript
/**
 * @description 게임을 localStorage에 저장하는 함수.
 * @param boardHistory boardHistory를 저장.
 */
const saveGame = (boardHistory: BoardState[]) => {
  const localStorageSavedGames = localStorage.getItem("savedGames");
  let savedGames;
  if (localStorageSavedGames) {
    savedGames = JSON.parse(localStorageSavedGames);
  } else {
    savedGames = {
      games: [],
    };
  }

  savedGames.games.push(boardHistory);
  localStorage.setItem("savedGames", JSON.stringify(savedGames));
};

/**
 * @description 승자가 결정되면, 승자를 표시하는 모달을 띄움.
 */
useEffect(() => {
  if (winner) {
    const showEndGameModal = () => {
      openModal({
        title: `승자는 ${winner}입니다!`,
        content: (
          <GameEnd
            boardSize={boardSize}
            winTarget={winTarget}
            saveGame={() => saveGame(boardHistory)}
          />
        ),
      });
    };

    showEndGameModal();
  }
}, [winner]);
```

> GameEndModal.tsx (모달 컨텐츠 페이지)

```typescript
const GameEnd = ({ boardSize, winTarget, saveGame }: GameEndProps) => {
  /** ... */

  <ButtonBase
    variant="saveGame"
    size="xl"
    onClick={saveGame ? saveGame : undefined}
  >
    게임 저장
  </ButtonBase>;
};
```

> 성공적으로 localStorage에 저장

<img width="521" alt="image" src="https://user-images.githubusercontent.com/74127841/229268784-d2b25e5d-0aff-4daa-86df-eb2a16fdd603.png">

## 게임 불러오기

게임을 저장하는 기능을 구현했으니 저장한 게임을 불러오는 기능을 구현해보자.
/savedgames 페이지를 만들고 저장된 게임을 목록으로 보여준다.
savedgames 페이지에서는 localStorage에 저장된 게임을 불러오아 보여주고, 게임을 선택하면 게임을 불러오는 페이지로 이동시켜준다.

### localStorage에서 게임 불러오기

```typescript
const [savedGames, setSavedGames] = useState<SavedGamesI>({ games: [] });

useEffect(() => {
  const localStorageSavedGames = localStorage.getItem("savedGames");
  if (localStorageSavedGames) {
    setSavedGames(JSON.parse(localStorageSavedGames));
  }
}, []);

return (
  <div className="flex h-screen w-full items-center justify-center bg-amber-200 ">
    <div className="box-border flex h-1/2 w-1/3 flex-col justify-center gap-y-10 rounded-3xl bg-amber-800 p-14 text-2xl">
      {savedGames && savedGames.games.length > 0
        ? savedGames.games.map((item, index) => renderSavedGames(item, index))
        : "저장된 게임이 없습니다."}
    </div>
  </div>
);
```

useEffect를 사용하여 localStorage에 저장된 게임을 불러와 savedGames state에 저장후 데이터가 있는 경우 데이터를 보여주고 없는 경우 "저장된 게임이 없습니다."를 보여준다.

### 저장된 게임 불러오기

```typescript
const handleGoToSavedGame = (gameData: GameDataI) => {
  router.push({
    pathname: `/savedgames/replay`,
    query: { gameData: JSON.stringify(gameData) },
  });
};

const renderSavedGames = (gameData: GameDataI, index: number) => {
  return (
    <div
      key={index}
      className="flex w-full cursor-pointer flex-col"
      onClick={() => handleGoToSavedGame(gameData)}
    >
      {`${gameData.savedAt}에 저장된 게임`}
    </div>
  );
};
```

저장된 데이터를 렌더링 할떄 클릭을하면 게임을 불러오는 페이지로 이동시켜주는 handleGoToSavedGame 함수를 달아주었다.

handleGoToSavedGame에서 라우팅을 할때 쿼리로 게임 데이터를 전달해주어 페이지에서 게임 데이터를 사용할 수 있게했다.

> Replay.tsx

리플레이 페이지에서는 쿼리로 받은 게임 데이터를 사용하여 게임을 불러온다.
이때 새로고침시에도 데이터가 유지될 수 있게 getServerSideProps를 사용하였다.

```typescript
export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { gameData } = context.query;
  console.log(gameData);
  if (gameData) {
    return {
      props: {
        gameData: JSON.parse(gameData as string),
      },
    };
  }

  return {
    props: {},
  };
};
```

gameData를 console로 확인해보면


<img width="753" alt="image" src="https://user-images.githubusercontent.com/74127841/229349173-a1c19dad-3416-407b-b86f-9df30aeaf3f6.png">


boardHistory와 savedAt으로 이루어졌고 boardState 상태는 boardHistory의 가장 마지막 상태이고 이를 사용해서 게임의 마지막 상태를 화면에 렌더링 할 수 있다.

```typescript
const SavedGamePlayPage = ({ gameData }: ServerSideProps) => {
  const router = useRouter();
  const [gameDataState, setGameDataState] = useState<GameDataI | null>(null);
  const [boardState, setBoardState] = useState<BoardState | null>(null);

  const renderCell = (row: number, col: number) => {
    const value = boardState![row][col].player;
    const cellText = value ? value : "";

    return (
      <div
        key={`${row}-${col}`}
        className="flex h-32 w-32 items-center justify-center border border-black text-6xl"
      >
        {cellText}
      </div>
    );
  };

  const renderRow = (row: Cell[], rowIndex: number) => {
    return (
      <div key={rowIndex} className="flex justify-center">
        {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
      </div>
    );
  };

  useEffect(() => {
    if (gameData) {
      setGameDataState(gameData);
      setBoardState(gameData.boardHistory[gameData.boardHistory.length - 1]);
    }
  }, []);

  useEffect(() => {
    console.log("게임 데이터 스테이트");
    console.log(gameDataState);
    console.log("보드 스테이트");
    console.log(boardState);
  }, [gameDataState, boardState]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-amber-200 ">
      <div className="flex flex-col border border-black p-5">
        {boardState && boardState.map(renderRow)}
        <div className=""></div>
      </div>
    </div>
  );
};
```

<img width="353" alt="image" src="https://user-images.githubusercontent.com/74127841/229349170-bc553ca1-9735-45f9-9939-95acc9e109ca.png">


## 불러온 게임의 기호 위에 턴 수 표시하기

성공적으로 저장된 게임을 불러오는 것에 성공했고 이제 불러온 게임의 기호 위에 턴 수를 표시해보자.
현재 2차원 배열의 각 원소는 player와 turn으로 이루어져있고 player키를 통해 기호를 표시하고있다.
이제 turn키를 사용하여 턴 수를 표시하기 위해서 데이터의 렌더링을 담담하고있는 renderCell 함수를 수정한다.

```typescript
const renderCell = (row: number, col: number) => {
  const value = boardState![row][col].player;
  const turn = boardState![row][col].turn;
  const cellText = value ? value : "";

  return (
    <div
      key={`${row}-${col}`}
      className="relative flex h-32 w-32 items-center justify-center border border-black text-6xl"
    >
      <div className="absolute top-0">{cellText}</div>
      {turn && (
        <div className="absolute bottom-0 flex w-3/4 items-center justify-center rounded-3xl bg-slate-400 text-3xl">
          {turn}턴
        </div>
      )}
    </div>
  );
};
```


<img width="366" alt="image" src="https://user-images.githubusercontent.com/74127841/229349164-03177ec5-af60-4320-8b86-101508c34e59.png">

