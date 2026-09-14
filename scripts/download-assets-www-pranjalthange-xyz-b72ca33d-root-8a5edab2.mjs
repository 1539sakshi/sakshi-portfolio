// Asset downloader for https://www.pranjalthange.xyz/  (site-key/page-key namespaced)
import { mkdir, writeFile } from 'node:fs/promises';

const ORIGIN = 'https://www.pranjalthange.xyz';
const IMG_DIR = 'public/sites/www-pranjalthange-xyz-b72ca33d/root-8a5edab2/images';
const FONT_DIR = 'public/sites/www-pranjalthange-xyz-b72ca33d/root-8a5edab2/fonts';

const IMAGES = ['/star-3d.png', '/bolt-3d.png', '/croppedimg.jpeg'];
const FONTS = ['/fonts/NeueMontreal-Medium.woff2'];

async function grab(path, dir) {
  const res = await fetch(ORIGIN + path);
  if (!res.ok) throw new Error(`${path} -> ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const name = path.split('/').pop();
  await writeFile(`${dir}/${name}`, buf);
  console.log(`  ok  ${name}  ${(buf.length / 1024).toFixed(1)}KB`);
}

async function batch(list, dir) {
  await mkdir(dir, { recursive: true });
  for (let i = 0; i < list.length; i += 4) {
    await Promise.all(list.slice(i, i + 4).map((p) => grab(p, dir).catch((e) => console.error('  FAIL', e.message))));
  }
}

await batch(IMAGES, IMG_DIR);
await batch(FONTS, FONT_DIR);
