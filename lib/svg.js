import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { optimize } from "svgo";

// 로고 SVG는 일러스트레이터가 내보낸 원본이라 좌표 소수점이 길고 주석·메타데이터가 남아 있다.
// 헤더와 푸터에서 모든 페이지가 내려받으므로 빌드 산출물 단계에서 한 번 정리한다.
// floatPrecision 2는 viewBox 88 기준 0.01단위로, 표시 크기에서 차이가 드러나지 않는다.

const OUTPUT_DIR = "_site";

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(target)));
    else if (entry.name.endsWith(".svg")) files.push(target);
  }
  return files;
}

export default function svg(eleventyConfig) {
  eleventyConfig.on("eleventy.after", async ({ dir }) => {
    const root = dir?.output ?? OUTPUT_DIR;
    for (const file of await walk(root)) {
      const raw = await readFile(file, "utf8");
      const { data } = optimize(raw, { multipass: true, floatPrecision: 2 });
      if (data.length < raw.length) await writeFile(file, data);
    }
  });
}
