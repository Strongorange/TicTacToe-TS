import ButtonBase from "@/components/ButtonBase";
import React, { useState } from "react";

type BoardSize = 0 | 3 | 4 | 5;
type WinTarget = number;

const Board = () => {
  const [boardSize, setBoardSize] = useState<BoardSize>(0);
  const [winTarget, setWinTarget] = useState<WinTarget>(0);
  const [isCustom, setIsCustom] = useState(false);
  const [customWinTarget, setCustomWinTarget] = useState(boardSize);

  return (
    <div className="w-ful flex h-screen items-center justify-center bg-amber-200">
      <div className="box-border flex h-1/2 w-1/3 flex-col justify-center gap-y-10 rounded-3xl bg-amber-800 p-14 text-2xl">
        <h1>게임판 크기</h1>
        <div className="flex w-full items-center justify-between gap-7">
          <ButtonBase size="xl" fullWidth onClick={() => setBoardSize(3)}>
            3x3
          </ButtonBase>
          <ButtonBase size="xl" fullWidth onClick={() => setBoardSize(4)}>
            4x4
          </ButtonBase>
          <ButtonBase size="xl" fullWidth onClick={() => setBoardSize(5)}>
            5x5
          </ButtonBase>
        </div>
        <div>
          <div className="flex w-full justify-between">
            <h1>승리조건</h1>
            <div className="flex w-1/3 items-center justify-between">
              <label>
                <input
                  type="radio"
                  name="isCustom"
                  value="basic"
                  onChange={() => setIsCustom(false)}
                  checked={!isCustom}
                />
                기본 설정
              </label>
              <label>
                <input
                  type="radio"
                  name="isCustom"
                  value="custom"
                  onChange={() => setIsCustom(true)}
                  checked={isCustom}
                />
                직접 설정
              </label>
            </div>
          </div>
        </div>
        <div className="w-full">
          {isCustom ? (
            <>
              <label htmlFor="customWinNumber">숫자 입력</label>
              <input id="customWinNumber" type={"number"} max={10} min={3} />
            </>
          ) : (
            <p>{boardSize}</p>
          )}
        </div>

        <ButtonBase size="xl" fullWidth>
          다음
        </ButtonBase>
      </div>
    </div>
  );
};

export default Board;
