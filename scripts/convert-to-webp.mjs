import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const gamesDir = path.join(process.cwd(), 'public', 'images', 'games');
const files = ['pt.png', 'global.png'];

async function convert() {
  for (const file of files) {
    const inputPath = path.join(gamesDir, file);
    const outputPath = path.join(gamesDir, file.replace('.png', '.webp'));

    if (fs.existsSync(inputPath)) {
      console.log(`Đang chuyển đổi: ${file} -> ${path.basename(outputPath)}`);
      await sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(outputPath);
      console.log(`Hoàn tất: ${path.basename(outputPath)}`);
    } else {
      console.log(`Không tìm thấy file: ${file}`);
    }
  }
}

convert().catch(console.error);
