import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { GameData as GameDataI, BoardState, Cell } from "@/pages/gameplay";
import { GetServerSidePropsContext } from "next";

interface ServerSideProps {
  gameData: GameDataI;
}

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

export default SavedGamePlayPage;
