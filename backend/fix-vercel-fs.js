const fs = require('fs');
const path = require('path');

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith('.ts')) {
      let content = fs.readFileSync(p, 'utf8');
      let modified = false;

      // Fix raw mkdirSync calls
      if (content.includes('mkdirSync')) {
        // Find lines like: mkdirSync(uploadPath, { recursive: true });
        // and replace with: if (!process.env.VERCEL) { mkdirSync(...) }
        const originalContent = content;
        content = content.replace(
          /([ \t]*)mkdirSync\s*\(\s*([^,]+)(?:,\s*([^)]+))?\s*\);/g,
          (match, prefix, arg1, arg2) => {
            if (match.includes('process.env.VERCEL')) return match; // already fixed
            return `${prefix}if (!process.env.VERCEL) {\n${prefix}  mkdirSync(${arg1}${arg2 ? ', ' + arg2 : ''});\n${prefix}}`;
          },
        );

        content = content.replace(
          /([ \t]*)fs\.mkdirSync\s*\(\s*([^,]+)(?:,\s*([^)]+))?\s*\);/g,
          (match, prefix, arg1, arg2) => {
            if (match.includes('process.env.VERCEL')) return match;
            return `${prefix}if (!process.env.VERCEL) {\n${prefix}  fs.mkdirSync(${arg1}${arg2 ? ', ' + arg2 : ''});\n${prefix}}`;
          },
        );

        if (content !== originalContent) modified = true;
      }

      // Fix multer diskStorage destination strings
      if (content.includes('destination:')) {
        const originalContent = content;
        content = content.replace(
          /destination:\s*['"](\.\/uploads\/[^'"]+)['"]/g,
          "destination: process.env.VERCEL ? '/tmp' : '$1'",
        );
        if (content !== originalContent) modified = true;
      }

      if (modified) {
        fs.writeFileSync(p, content);
        console.log('Fixed', p);
      }
    }
  }
}

walk(path.join(__dirname, 'src'));
