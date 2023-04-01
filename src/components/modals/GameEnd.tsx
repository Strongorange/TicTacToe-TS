import React from "react";
import ButtonBase from "../ButtonBase";
import { useRouter } from "next/router";
import useModal from "@/hooks/useModal";
import { BoardState } from "@/pages/gameplay";

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
        onClick={saveGame ? saveGame : undefined}
      >
        게임 저장
      </ButtonBase>
    </div>
  );
};

export default GameEnd;
