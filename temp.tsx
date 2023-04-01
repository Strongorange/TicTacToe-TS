import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useModal from "@/hooks/useModal";
import GameEnd from "@/components/modals/GameEnd";
import { GetServerSidePropsContext } from "next";

type CellValue = "X" | "O" | null;

interface Cell {
  player: CellValue;
  turn: number | null;
}

type BoardState = Cell[][];

interface UndoCountProps {
  X: number;
  O: number;
}

interface ServerSideProps {
  boardSize: number;
  winTarget: number;
  randomStartPlayer: CellValue;
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { boardSize, winTarget } = context.query;

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

  const initialBoardState: BoardState = new Array(boardSize)
    .fill(null)
    .map(() =>
      new Array(boardSize).fill(null).map(() => ({ player: null, turn: null }))
    );

  const [boardState, setBoardState] = useState<BoardState>(initialBoardState);
  const [currentPlayer, setCurrentPlayer] = useState<CellValue>(
    props.randomStartPlayer
  );
  const [winner, setWinner] = useState<CellValue>(null);
  const [undoCount, setUndoCount] = useState<UndoCountProps>({
    X: 0,
    O: 0,
  });

  const [boardHistory, setBoardHistory] = useState<BoardState[]>([
    initialBoardState,
  ]);

  const handleTurnUp = (boardSize: number) => {
    const maxTurn = boardSize * boardSize;
    if (currentTurn > maxTurn) return;
    setCurrentTurn((prev) => prev + 1);
  };

  const checkWinner = (board: BoardState): CellValue => {
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col <= boardSize - winTarget; col++) {
        const winRow = board[row].slice(col, col + winTarget);

        if (
          winRow.every(
            (cell) => cell.player === winRow[0].player && cell.player !== null
          )
        ) {
          return winRow[0].player;
        }
      }
    }

    for (let col = 0; col < boardSize; col++) {
      for (let row = 0; row <= boardSize - winTarget; row++) {
        let sameValue = true;
        const firstCellValue = board[row][col].player;
        if (firstCellValue === null) continue;

        for (let i = 1; i < winTarget; i++) {
          if (board[row + i][col].player !== firstCellValue) {
            sameValue = false;
            break;
          }
        }

        if (sameValue) {
          return firstCellValue;
        }
      }
    }

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

  const handleCellClick = (row: number, col: number) => {
    if (winner || boardState[row][col].player) {
      return;
    }

    const newBoardState = boardState.map((row) =>
      row.map((cell) => ({ ...cell }))
    );

    newBoardState[row][col].player = currentPlayer;
    newBoardState[row][col].turn = currentTurn;
    const newBoardHistory = [...boardHistory, newBoardState];
    setBoardState(newBoardState);
    setBoardHistory(newBoardHistory);

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

  useEffect(() => {
    setWinner(checkWinner(boardState));
  }, [boardState]);

  useEffect(() => {
    if (winner) {
      const showEndGameModal = () => {
        openModal({
          title: `승자는 ${winner}입니다!`,
          content: <GameEnd boardSize={boardSize} winTarget={winTarget} />,
        });
      };

      showEndGameModal();
    }
  }, [winner]);

  return (
    <>
      <div className="flex h-screen w-full items-center justify-center bg-amber-200 ">
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
