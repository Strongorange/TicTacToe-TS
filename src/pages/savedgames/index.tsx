import React, { useEffect, useState } from "react";
import { GameData as GameDataI, SavedGames as SavedGamesI } from "../gameplay";
import { useRouter } from "next/router";
import Head from "next/head";

const SavedGamesPage = () => {
  const router = useRouter();
  const [savedGames, setSavedGames] = useState<SavedGamesI>({ games: [] });

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
        className="flex w-full cursor-pointer flex-col rounded-3xl bg-white p-4"
        onClick={() => handleGoToSavedGame(gameData)}
      >
        {`${gameData.savedAt}에 저장된 게임`}
      </div>
    );
  };

  /**
   * @description localStorage에 저장된 게임을 불러와 state에 저장
   */
  useEffect(() => {
    const localStorageSavedGames = localStorage.getItem("savedGames");
    if (localStorageSavedGames) {
      setSavedGames(JSON.parse(localStorageSavedGames));
    }
  }, []);

  return (
    <>
      <Head>
        <title>Saved Games</title>
      </Head>
      <div className="flex h-screen w-full items-center justify-center bg-amber-200 ">
        <div className="box-border flex h-1/2 w-1/3 flex-col justify-center gap-y-10 rounded-3xl bg-amber-800 p-14 text-2xl">
          {savedGames && savedGames.games.length > 0
            ? savedGames.games.map((item, index) =>
                renderSavedGames(item, index)
              )
            : "저장된 게임이 없습니다."}
        </div>
      </div>
    </>
  );
};

export default SavedGamesPage;
