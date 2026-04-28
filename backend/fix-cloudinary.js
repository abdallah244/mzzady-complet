const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. the import
  if (content.includes("import { diskStorage } from 'multer';")) {
    content = content.replace(
      "import { diskStorage } from 'multer';",
      "import { storage } from '../cloudinary.config';",
    );
  } else if (content.includes('diskStorage')) {
    content = content.replace(
      /import\s+\{[^}]*diskStorage[^}]*\}\s+from\s+['"]multer['"];?/,
      "import { storage } from '../cloudinary.config';",
    );
  }

  // 2. the usage block. we need to match from `diskStorage({` to the closing `})`
  // It's usually like:
  // storage: diskStorage({
  //   destination: ...,
  //   filename: (req, file, cb) => { ... }
  // }),
  const diskStorageRegex =
    /diskStorage\(\{\s*destination:[\s\S]*?filename:\s*\([^)]*\)\s*=>\s*\{[\s\S]*?\}\s*,\s*\}\)/g;
  content = content.replace(diskStorageRegex, 'storage');

  // Some files might have slightly different format, let's catch typical multer diskStorage blocks
  // specifically: storage: diskStorage({ ... }) -> storage: storage
  const storageRegex =
    /storage:\s*diskStorage\(\{(?:[^{}]*|\{(?:[^{}]*|\{[^{}]*\})*\})*\}\)/g;
  content = content.replace(storageRegex, 'storage: storage');

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith('.ts')) {
      fixFile(p);
    }
  }
}

walk(srcDir);
