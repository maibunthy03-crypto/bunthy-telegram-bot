const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

const files = walk(path.join(process.cwd(), 'src')).filter((file) => file.endsWith('.js'));
let failed = false;
for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], { stdio: 'inherit' });
  if (result.status !== 0) failed = true;
}
if (failed) process.exit(1);
console.log(`✅ Syntax checked ${files.length} JavaScript files`);
