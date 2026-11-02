import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const root = resolve('skills');
async function files(dir, prefix = '') {
  const result = [];
  for (const item of await readdir(join(dir, prefix), { withFileTypes: true })) {
    const path = join(prefix, item.name);
    if (item.isDirectory()) result.push(...await files(dir, path));
    else if (item.isFile()) result.push(path);
    else throw new Error(`Unexpected entry: ${path}`);
  }
  return result.sort();
}
test('new and legacy standalone Skills carry the same implementation and references', async () => {
  const primary = join(root, 'ui-design');
  const legacy = join(root, 'portfolio-website');
  const paths = await files(primary);
  assert.deepEqual(await files(legacy), paths);
  for (const path of paths.filter(p => !['SKILL.md', join('agents', 'openai.yaml')].includes(p))) {
    const [a, b] = await Promise.all([readFile(join(primary, path)), readFile(join(legacy, path))]);
    if (a.includes(0) || b.includes(0)) assert.deepEqual(a, b, path);
    else assert.equal(a.toString('utf8').replaceAll('\r\n', '\n'), b.toString('utf8').replaceAll('\r\n', '\n'), path);
  }
  assert.match(await readFile(join(primary, 'SKILL.md'), 'utf8'), /^---\s*\nname: ui-design\s*$/m);
  assert.match(await readFile(join(legacy, 'SKILL.md'), 'utf8'), /^---\s*\nname: portfolio-website\s*$/m);
});
