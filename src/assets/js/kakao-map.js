/**
 * 카카오 "지도 퍼가기"(roughmap) 렌더링.
 *
 * 왜 별도 파일인가:
 * 원본 사이트는 이 호출을 인라인 <script> 로 두었는데, 우리 CSP 는
 * script-src 'self' 라 인라인 스크립트를 막습니다. 자체 호스팅 파일로 두면
 * 정책을 풀지 않고도 실행됩니다.
 *
 * timestamp / key 는 카카오 "지도 퍼가기"에 등록할 때 발급된 값입니다.
 * API 키가 아니라 등록된 지도를 가리키는 식별자이므로 공개되어도 무방합니다.
 * (원본 사이트의 js/map.js 에 있던 값을 그대로 옮겼습니다.)
 *
 * ⚠️ timestamp 는 마크업의 컨테이너 id 와 반드시 짝이 맞아야 합니다.
 *    id="daumRoughmapContainer<timestamp>"
 *    원본 사이트는 원주지사(1670571451133)의 컨테이너가 없어서 그 지도가
 *    실제로는 그려지지 않고 있었습니다. 여기서는 짝을 맞춰 두었습니다.
 */
(function renderRoughmaps() {
  const MAPS = [
    { timestamp: "1607656468304", key: "23fmx" }, // 본사 (서울 영등포)
    { timestamp: "1670571451133", key: "2cxcu" }, // 원주지사
  ];

  // 로더가 막혔거나(광고 차단기 등) 아직 안 뜬 경우. 지도만 비고 나머지
  // 페이지는 정상 동작해야 하므로 조용히 넘어갑니다.
  if (!window.daum || !window.daum.roughmap || !window.daum.roughmap.Lander) return;

  for (const map of MAPS) {
    if (!document.getElementById(`daumRoughmapContainer${map.timestamp}`)) continue;
    try {
      new window.daum.roughmap.Lander(map).render();
    } catch (error) {
      console.error("지도를 불러오지 못했습니다", error);
    }
  }
})();
