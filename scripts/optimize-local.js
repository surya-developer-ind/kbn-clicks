const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const LANDING_DIR = path.join(__dirname, '..', 'Landing');
const VALID_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

async function optimizeImages(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
        const fullPath = path.join(dir, file.name);

        if (file.isDirectory()) {
            await optimizeImages(fullPath);
        } else if (file.isFile() && VALID_EXTENSIONS.has(path.extname(fullPath).toLowerCase())) {
            const stats = fs.statSync(fullPath);
            if (stats.size > 1.5 * 1024 * 1024) { // Larger than 1.5MB
                console.log(`Optimizing: ${fullPath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
                const tempPath = fullPath + '.tmp';
                try {
                    await sharp(fullPath)
                        .resize({
                            width: 1920,
                            height: 1920,
                            fit: sharp.fit.inside,
                            withoutEnlargement: true
                        })
                        .jpeg({ quality: 80 })
                        .toFile(tempPath);
                    
                    fs.unlinkSync(fullPath);
                    fs.renameSync(tempPath, fullPath);
                    console.log(`✅ Optimized ${file.name}`);
                } catch (err) {
                    console.error(`❌ Error optimizing ${file.name}:`, err);
                    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
                }
            }
        }
    }
}

optimizeImages(LANDING_DIR).then(() => console.log('Done optimizing!')).catch(console.error);
