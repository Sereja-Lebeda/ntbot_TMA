// add-xl-prefix.js
import fs from "fs";

const file = process.argv[2];
let code = fs.readFileSync(file, "utf-8");

// находит className="..." (только простые строковые литералы, без {шаблонных `...`})
code = code.replace(/className="([^"]+)"/g, (match, classes) => {
  const prefixed = classes
    .trim()
    .split(/\s+/)
    .map((cls) => (cls.startsWith("xl:") ? cls : `xl:${cls}`))
    .join(" ");
  return `className="${prefixed}"`;
});

fs.writeFileSync(file, code);
