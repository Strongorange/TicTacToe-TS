import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useModal from "@/hooks/useModal";
import GameEnd from "@/components/modals/GameEnd";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";

/**
 * @description null은 아직 놓이지 않은 상태.
 * @description "X"는 플레이어 1의 표시.
 * @description "O"는 플레이어 2의 표시.
 */
export type CellValue = "X" | "O" | null;

export interface Cell {
  player: CellValue;
  turn: number | null;
}

export type BoardState = Cell[][];
/**
 * @description undoCount는 각 플레이어가 undo를 몇번 했는지를 저장.
 */
interface UndoCountProps {
  X: number;
  O: number;
}

interface ServerSideProps {
  boardSize: number;
  winTarget: number;
  randomStartPlayer: CellValue;
}

export interface GameData {
  boardHistory: BoardState[];
  savedAt: string;
}

export interface SavedGames {
  games: GameData[];
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { boardSize, winTarget } = context.query;
  /**
   * @description 랜덤으로 플레이어를 정함.
   */

  const randomStartPlayer = Math.random() < 0.5 ? "X" : "O";

  return {
    props: {
      boardSize: Number(boardSize),
      winTarget: Number(winTarget),
      randomStartPlayer,
    },
  };
};

const GamePlay = (props: ServerSideProps) => {
  const router = useRouter();
  const { openModal } = useModal();
  const { boardSize: queryBoardSize, winTarget: queryWinTarget } = router.query;

  const [currentTurn, setCurrentTurn] = useState<number>(1);
  const [boardSize, setBoardSize] = useState<number>(
    Number(queryBoardSize || props.boardSize)
  );
  const [winTarget, setWinTarget] = useState<number>(
    Number(queryWinTarget || props.winTarget)
  );

  /**
   * @description 게임 보드의 초기 상태를 생성.
   * @description 게임 보드의 크기는 boardSize * boardSize.
   * @description 게임 보드의 각 칸은 null로 초기화.
   */
  const initialBoardState: BoardState = new Array(boardSize)
    .fill(null)
    .map(() => new Array(boardSize).fill({ player: null, turn: null }));

  const [boardState, setBoardState] = useState<BoardState>(initialBoardState);
  const [currentPlayer, setCurrentPlayer] = useState<CellValue>(
    props.randomStartPlayer
  );
  const [winner, setWinner] = useState<CellValue>(null);
  const [undoCount, setUndoCount] = useState<UndoCountProps>({
    X: 0,
    O: 0,
  });
  /**
   * @description 게임 보드의 이전 상태를 저장.
   * @description 맨 처음에 보드의 초기상태를 저장하고 이후로 마킹이 될때마다 생긴 보드의 상태를 배열로 쌓는다.
   */
  const [boardHistory, setBoardHistory] = useState<BoardState[]>([
    initialBoardState,
  ]);

  /**
   * @description 보드의 턴 수를 증가시킴, boardSize * boradSize 보다 커지지 못하게 함.
   * @param boardSize {number} 게임 보드의 가로, 세로 크기
   */
  const handleTurnUp = (boardSize: number) => {
    const maxTurn = boardSize * boardSize;
    if (currentTurn > maxTurn) return;
    setCurrentTurn((prev) => prev + 1);
  };

  /**
   * @description 게임 보드의 가로, 세로, 대각선 방향을 검사하여 승리자를 찾음.
   * @param board {BoardState} 게임 보드
   * @returns {CellValue} 승리자의 표시. 승리자가 없으면 null.
   */
  const checkWinner = (board: BoardState): CellValue => {
    /**
     * @description 가로 방향의 승리 조건을 만족하는지 검사.
     * @description winTarget이 3이고, boardSize가 5이라고 하면 가로에서는 해당 가로열을 모두 검색할 필요 없이 시작하는 부분의 열 부터 3개의 열을 검사.(winTarget)
     * @example [o, o, x ,x ,x] 를 검사할때 index 0 번의 o는 index 4의 x 까지 검사할 필요 없이 index 2의 x 까지만 검사하면 됨.
     * @example index 2번의 x를 검사할때 연속한 3개까지인 index 4번의 x까지 검사하면 되고 이 경우 승리 조건을 만족함.
     */
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col <= boardSize - winTarget; col++) {
        const winRow = board[row].slice(col, col + winTarget);

        /**
         * @description winRow의 모든 요소가 같은 값이고 null이 아닌 경우 승리 조건을 만족함.
         * @returns {CellValue} 승리자의 표시.
         */
        if (
          winRow.every(
            (cell) => cell.player === winRow[0].player && cell.player !== null
          )
        ) {
          return winRow[0].player;
        }
      }
    }

    /**
     * @description 세로 방향에서는 가로방향과 다르게 col, row 순서로 검사.
     * @description 가로 방향과 마찬가지로 winTarget이 3이고, boardSize가 5이라고 하면 세로에서는 해당 세로열을 모두 검색할 필요 없이 시작하는 부분의 행 부터 3개의 행을 검사.(winTarget)
     * @example [[o,x,o,x,o,x],
     *           [o,x,o,x,o,x],
     *           [o,x,o,x,o,x],
     *           [o,x,o,x,o,x],
     *           [o,x,o,x,o,x]] 를 검사할때 세로 방향을 0 ~ 4 번의 index로 잡는다면 0번 index의 o는 2번 index의 o까지만 검사하면 그 이후 요소들은 검사할 필요가 없음.
     */
    for (let col = 0; col < boardSize; col++) {
      for (let row = 0; row <= boardSize - winTarget; row++) {
        let sameValue = true;
        const firstCellValue = board[row][col].player;
        if (firstCellValue === null) continue;

        /**
         * @description 세로 방향으로 한개씩 index를 올리면서 firstCellValue와 일치는지 검사.
         * @description 일치하지 않는 경우 sameValue를 false로 변경하고 break.
         */
        for (let i = 1; i < winTarget; i++) {
          if (board[row + i][col].player !== firstCellValue) {
            sameValue = false;
            break;
          }
        }

        /**
         * @description 위의 검사를 통과해 sameValue가 true로 유지된다면 승리 조건을 만족함.
         * @returns {CellValue} 승리자의 마크. "X" or "O"
         */
        if (sameValue) {
          return firstCellValue;
        }
      }
    }

    /**
     * @description 왼쪽 대각선 방향 검사
     * @description 세로방향 검사와 비슷
     */
    for (let row = 0; row <= boardSize - winTarget; row++) {
      for (let col = 0; col <= boardSize - winTarget; col++) {
        let sameValue = true;
        const firstCellValue = board[row][col].player;
        if (firstCellValue === null) continue;

        for (let i = 1; i < winTarget; i++) {
          if (board[row + i][col + i].player !== firstCellValue) {
            sameValue = false;
            break;
          }
        }

        if (sameValue) {
          return firstCellValue;
        }
      }
    }

    /**
     * @description 오른쪽 대각선 방향 검사
     * @description 세로방향 검사와 비슷
     */
    for (let row = 0; row <= boardSize - winTarget; row++) {
      for (let col = winTarget - 1; col < boardSize; col++) {
        let sameValue = true;
        const firstCellValue = board[row][col].player;
        if (firstCellValue === null) continue;

        for (let i = 1; i < winTarget; i++) {
          if (board[row + i][col - i].player !== firstCellValue) {
            sameValue = false;
            break;
          }
        }

        if (sameValue) {
          return firstCellValue;
        }
      }
    }

    return null;
  };

  const handleUndo = () => {
    /**
     * @description undoCount가 3이상이면 더이상 undo를 할 수 없음.
     */
    if (undoCount[currentPlayer!] > 3) return;

    if (boardHistory.length > 1) {
      const newBoardHistory = [...boardHistory];
      newBoardHistory.pop();
      setBoardHistory(newBoardHistory);
      setBoardState(newBoardHistory[newBoardHistory.length - 1]);

      // 플레이어의 undoCount를 1 증가
      const newUndoCount = { ...undoCount };
      newUndoCount[currentPlayer!] += 1;
      setUndoCount(newUndoCount);
      // 플레이어 전환
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  /**
   * @description 셀 클릭시 실행되는 함수.
   * @description 보드의 마킹과, 보드의 히스토리를 관리, 플레이어 전환, 승리 여부를 판단.
   * @param {number} row - 클릭한 셀의 행 번호.
   * @param {number} col - 클릭한 셀의 열 번호.
   */
  const handleCellClick = (row: number, col: number) => {
    /**
     * @description 이미 누군가가 놓았거나, 이미 승자가 결정되었으면 더 이상 놓을 수 없음.
     */
    if (winner || boardState[row][col].player) {
      return;
    }

    /**
     * @description 새로운 보드 상태를 생성.
     * boardState를 직접 수정하면 생길 수 있는 문제를 방지하기위해, boardState와 동일한 배열을 생성하고 생성하고, 그 배열을 수정.
     * @description 새로운 보드 상태를 boardHistory에 추가. (이전 상태를 보관하는 로직 추가)
     * @description 새로운 보드 상태를 boardState에 저장.
     */
    const newBoardState = boardState.map((row) =>
      row.map((col) => ({ ...col }))
    );
    newBoardState[row][col].player = currentPlayer;
    newBoardState[row][col].turn = currentTurn;
    const newBoardHistory = [...boardHistory, newBoardState];
    setBoardState(newBoardState);
    setBoardHistory(newBoardHistory);

    /**
     * @description 승자가 결정되었는지 확인
     * @description 승자가 결정되었으면 승자를 표시하고, 아니면 플레이어를 전환.
     */
    const gameWinner = checkWinner(newBoardState);
    if (gameWinner) {
      setWinner(gameWinner);
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
      handleTurnUp(boardSize);
    }
  };

  const renderCell = (row: number, col: number) => {
    const value = boardState[row][col].player;
    const cellText = value ? value : "";

    return (
      <div
        key={`${row}-${col}`}
        className="flex h-32 w-32 items-center justify-center border border-black text-6xl"
        onClick={() => handleCellClick(row, col)}
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

  /**
   * @description 게임을 localStorage에 저장하는 함수.
   * @param boardHistory boardHistory를 저장.
   */
  const saveGame = (boardHistory: BoardState[]): void => {
    const localStorageSavedGames = localStorage.getItem("savedGames");
    let savedGames: SavedGames;

    if (localStorageSavedGames) {
      savedGames = JSON.parse(localStorageSavedGames);
    } else {
      savedGames = {
        games: [],
      };
    }

    /**
     * @description 게임을 저장할 때, 현재 시간을 ISOString으로 저장.
     */
    const now = new Date();

    const gameData: GameData = {
      boardHistory,
      savedAt: now.toISOString(),
    };

    savedGames.games.push(gameData);

    localStorage.setItem("savedGames", JSON.stringify(savedGames));
  };

  useEffect(() => {
    setWinner(checkWinner(boardState));
  }, [boardState]);

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

  return (
    <>
      <Head>
        <title>Playing</title>
      </Head>
      <div className="flex h-screen w-full items-center justify-center bg-amber-200 ">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold">현재 턴 : {currentTurn}</h1>
          <div className="flex flex-col border border-black p-5">
            {boardState.map(renderRow)}
          </div>
          <div className="mt-4 text-2xl">{`현재 플레이어: ${currentPlayer}`}</div>
          {winner && <div>승자: {winner}</div>}
          <button
            className="mt-4 box-border rounded-3xl bg-[#ff5c00] py-4 px-6 text-2xl font-bold text-white hover:bg-blue-700"
            onClick={handleUndo}
          >
            Undo
          </button>
          <div>
            <h1 className="text-3xl">남은 무르기 횟수</h1>
            <div className="flex items-center justify-between text-xl">
              <h3>X: {3 - undoCount.X}</h3>
              <h3>O: {3 - undoCount.O}</h3>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GamePlay;
