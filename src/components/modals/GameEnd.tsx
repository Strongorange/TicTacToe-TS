import React from "react";
import ButtonBase from "../ButtonBase";
import { useRouter } from "next/router";
import useModal from "@/hooks/useModal";

interface GameEndProps {
  boardSize: number;
  winTarget: number;
}

const GameEnd = ({ boardSize, winTarget }: GameEndProps) => {
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
      <ButtonBase variant="saveGame" size="xl">
        게임 저장
      </ButtonBase>
    </div>
  );
};

export default GameEnd;
