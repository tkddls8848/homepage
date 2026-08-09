(function renderMaps() {
  const maps = [
    { timestamp: "1607656468304", key: "23fmx" },
    { timestamp: "1670571451133", key: "2cxcu" },
  ];

  maps.forEach((map) => new window.daum.roughmap.Lander(map).render());
})();
