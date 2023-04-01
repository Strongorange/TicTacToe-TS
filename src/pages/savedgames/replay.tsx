import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { GameData as GameDataI, BoardState } from "@/pages/gameplay";
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

  //TODO: 데이터 가져온걸로 화면 렌더링
  //TODO: 데이터 가져온걸로 화면 렌더링
  //TODO: 데이터 가져온걸로 화면 렌더링
  //TODO: 데이터 가져온걸로 화면 렌더링
  //TODO: 데이터 가져온걸로 화면 렌더링
  //TODO: 데이터 가져온걸로 화면 렌더링
  //TODO: 데이터 가져온걸로 화면 렌더링
  //TODO: 데이터 가져온걸로 화면 렌더링
  //TODO: 데이터 가져온걸로 화면 렌더링
  //TODO: 데이터 가져온걸로 화면 렌더링
  //TODO: 데이터 가져온걸로 화면 렌더링
  //TODO: 데이터 가져온걸로 화면 렌더링
  //TODO: 데이터 가져온걸로 화면 렌더링
  //TODO: 데이터 가져온걸로 화면 렌더링
  //TODO: 데이터 가져온걸로 화면 렌더링
  //TODO: 데이터 가져온걸로 화면 렌더링
  //TODO: 데이터 가져온걸로 화면 렌더링
  //TODO: 데이터 가져온걸로 화면 렌더링
  //TODO: 데이터 가져온걸로 화면 렌더링
  //TODO: 데이터 가져온걸로 화면 렌더링
  //TODO: 데이터 가져온걸로 화면 렌더링
  //TODO: 데이터 가져온걸로 화면 렌더링
  //TODO: 데이터 가져온걸로 화면 렌더링
  //TODO: 데이터 가져온걸로 화면 렌더링
  //TODO: 데이터 가져온걸로 화면 렌더링

  useEffect(() => {
    if (gameData) {
      setGameDataState(gameData);
      setBoardState(gameData.boardHistory[gameData.boardHistory.length - 1]);
    }
  }, []);

  useEffect(() => {
    console.log(gameDataState);
    console.log(boardState);
  }, [gameDataState, boardState]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-amber-200 ">
      SavedGamePlayPage
    </div>
  );
};

export default SavedGamePlayPage;
