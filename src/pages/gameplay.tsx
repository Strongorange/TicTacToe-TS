import { useRouter } from "next/router";
import { useEffect, useState } from "react";

/**
 * @description null은 아직 놓이지 않은 상태.
 * @description "X"는 플레이어 1의 표시.
 * @description "O"는 플레이어 2의 표시.
 */
type CellValue = "X" | "O" | null;
type BoardState = CellValue[][];

const GamePlay = () => {
  const router = useRouter();
  const { boardSize: queryBoardSize, winTarget: queryWinTarget } = router.query;
  const boardSize = Number(queryBoardSize);
  const winTarget = Number(queryWinTarget);
  /**
   * @description 게임 보드의 초기 상태를 생성.
   * @description 게임 보드의 크기는 boardSize * boardSize.
   * @description 게임 보드의 각 칸은 null로 초기화.
   */
  const initialBoardState: BoardState = new Array(boardSize)
    .fill(null)
    .map(() => new Array(boardSize).fill(null));

  const [boardState, setBoardState] = useState<BoardState>(initialBoardState);
  const [currentPlayer, setCurrentPlayer] = useState<CellValue>("X");
  const [winner, setWinner] = useState<CellValue>(null);
  const [boardHistory, setBoardHistory] = useState<BoardState[]>([
    initialBoardState,
  ]);

  const checkWinner = (board: BoardState): CellValue => {
    // 가로 방향 검사
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col <= boardSize - winTarget; col++) {
        const winRow = board[row].slice(col, col + winTarget);
        if (winRow.every((cell) => cell === winRow[0] && cell !== null)) {
          return winRow[0];
        }
      }
    }

    // 세로 방향 검사
    for (let col = 0; col < boardSize; col++) {
      for (let row = 0; row <= boardSize - winTarget; row++) {
        const winCol = board.slice(row, row + winTarget).map((r) => r[col]);
        if (winCol.every((cell) => cell === winCol[0] && cell !== null)) {
          return winCol[0];
        }
      }
    }

    // 왼쪽 대각선 방향 검사
    for (let row = 0; row <= boardSize - winTarget; row++) {
      for (let col = 0; col <= boardSize - winTarget; col++) {
        const winDiag: CellValue[] = [];
        for (let i = 0; i < winTarget; i++) {
          winDiag.push(board[row + i][col + i]);
        }
        if (winDiag.every((cell) => cell === winDiag[0] && cell !== null)) {
          return winDiag[0];
        }
      }
    }

    // 오른쪽 대각선 방향 검사
    for (let row = 0; row <= boardSize - winTarget; row++) {
      for (let col = winTarget - 1; col < boardSize; col++) {
        const winDiag: CellValue[] = [];
        for (let i = 0; i < winTarget; i++) {
          winDiag.push(board[row + i][col - i]);
        }
        if (winDiag.every((cell) => cell === winDiag[0] && cell !== null)) {
          return winDiag[0];
        }
      }
    }

    return null;
  };

  // 2. 무르기 기능 구현
  const handleUndo = () => {
    if (boardHistory.length > 1) {
      const newBoardHistory = [...boardHistory];
      newBoardHistory.pop();
      setBoardHistory(newBoardHistory);
      setBoardState(newBoardHistory[newBoardHistory.length - 1]);

      // 플레이어 전환
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  // 3. 이전 상태를 보관하는 로직 추가
  const handleCellClick = (row: number, col: number) => {
    // If the game is over or the cell is not empty, ignore the click
    if (winner || boardState[row][col]) {
      return;
    }

    const newBoardState = boardState.map((row) => [...row]);
    newBoardState[row][col] = currentPlayer;
    const newBoardHistory = [...boardHistory, newBoardState];

    setBoardState(newBoardState);
    setBoardHistory(newBoardHistory);

    // Check for a winner
    const gameWinner = checkWinner(newBoardState);
    if (gameWinner) {
      setWinner(gameWinner);
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  const renderCell = (row: number, col: number) => {
    const value = boardState[row][col];
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

  const renderRow = (row: CellValue[], rowIndex: number) => {
    return (
      <div key={rowIndex} className="flex justify-center">
        {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
      </div>
    );
  };

  useEffect(() => {
    if (queryBoardSize && queryWinTarget) {
      console.log(boardSize, winTarget);
    }
  }, [queryBoardSize, queryWinTarget]);

  useEffect(() => {
    setWinner(checkWinner(boardState));
  }, [boardState]);

  return (
    <>
      <div className="flex h-screen w-full items-center justify-center bg-amber-200">
        <div className="flex flex-col items-center">
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
        </div>
      </div>
    </>
  );
};

export default GamePlay;
