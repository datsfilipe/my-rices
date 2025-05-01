import fs from "node:fs";
import path from "node:path";
import imageSize from "image-size";

function generateRiceData() {
  const srcDir = path.resolve("public/rices");
  const outPath = path.resolve("src/lib/rices.json");
  const files = fs.readdirSync(srcDir).filter((f) => /\.(png|jpe?g)$/i.test(f));
  const data = [];
  let id = 1;

  for (const file of files) {
    const filePath = path.join(srcDir, file);
    const stats = fs.statSync(filePath);
    const date = stats.mtime.toISOString().slice(0, 10);

    const fileBuffer = fs.readFileSync(filePath);
    const { width, height } = imageSize(fileBuffer);
    const dimensions = `${width}x${height}`;

    const name = path.parse(file).name;
    const parts = name.split(/[+_]/);
    const title = parts.map((p) => p[0].toUpperCase() + p.slice(1)).join(" ");
    const tags = parts;
    const wm = parts[1] || "";

    data.push({
      id,
      title,
      description: "",
      image: `/rices/${file}`,
      tags,
      wm,
      date,
      dimensions,
    });
    id++;
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
  console.log(`> Wrote ${data.length} entries to ${outPath}`);
}

generateRiceData();
