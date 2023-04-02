import Head from "next/head";
import ButtonBase from "@/components/ButtonBase";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const handleStartButton = () => {
    router.push("/board");
  };

  const handleSavedGameButton = () => {
    router.push("/savedgames");
  };

  return (
    <>
      <Head>
        <title>Tic-Tac-Toe</title>
      </Head>
      <main>
        <div className="flex h-screen w-full items-center justify-center bg-amber-200">
          {/**
           * @description 버튼들이 들어있는 박스
           */}
          <div className="box-border flex h-1/2 w-1/3 flex-col justify-center gap-y-10 rounded-3xl bg-amber-400 p-14 text-2xl">
            <ButtonBase variant="start" size="xl" onClick={handleStartButton}>
              시작
            </ButtonBase>
            <ButtonBase
              variant="savedGame"
              size="xl"
              onClick={handleSavedGameButton}
            >
              저장된 게임
            </ButtonBase>
          </div>
        </div>
      </main>
    </>
  );
}
