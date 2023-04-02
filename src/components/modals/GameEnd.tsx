import React from "react";
import ButtonBase from "../ButtonBase";
import { useRouter } from "next/router";
import useModal from "@/hooks/useModal";

interface GameEndProps {
  boardSize: number;
  winTarget: number;
  /**
   * @description 게임을 저장하는 함수, gameplay.tsx에서 넘겨줌
   */
  saveGame?: () => void;
}

const GameEnd = ({ boardSize, winTarget, saveGame }: GameEndProps) => {
  const router = useRouter();
  const { closeModal } = useModal();

  const goHome = () => {
    closeModal();
    router.push("/");
  };

  const restartGame = () => {
    closeModal();
    router.reload();
  };

  const saveGameHandler = () => {
    if (saveGame) {
      saveGame();
    } else {
      alert("게임을 저장할 수 없습니다.");
    }
    closeModal();
    router.push("/");
  };

  return (
    <div className="flex h-full flex-col gap-5">
      <ButtonBase variant="goHome" size="xl" onClick={goHome}>
        홈 화면으로
      </ButtonBase>
      <ButtonBase variant="restartGame" size="xl" onClick={restartGame}>
        다시 플레이
      </ButtonBase>
      <ButtonBase
        variant="saveGame"
        size="xl"
        onClick={saveGame ? saveGameHandler : undefined}
      >
        게임 저장
      </ButtonBase>
    </div>
  );
};

export default GameEnd;
