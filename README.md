# Directional-Test

## 메인 트러블 슈팅

새로고침하면 오류뜨는 문제
SSR 사용하여 query로 받은 boardSize, winTarget을 props로 넘겨주고
Hydration 문제를 야기시키는 randomStartPlayer 함수를 서버사이드로 옮겨 시작 플레이어를 서버에서 랜덤으로 정해줌
