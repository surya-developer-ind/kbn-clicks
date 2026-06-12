const fs = require('fs');
const path = require('path');

const LANDING_DIR = path.join(__dirname, '..', 'Landing');
const GALLERY_OUTPUT = path.join(__dirname, '..', 'gallery.json');
const HERO_OUTPUT = path.join(__dirname, '..', 'hero.json');

const VALID_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

// Helper to check if file is a valid image
function isImage(filename) {
    const ext = path.extname(filename).toLowerCase();
    return VALID_EXTENSIONS.has(ext);
}

// Ensure Landing directory exists
if (!fs.existsSync(LANDING_DIR)) {
    console.error('Landing directory not found.');
    process.exit(1);
}

const galleryData = {};
const heroData = {
    desktop: [],
    mobile: []
};

const EXCLUDED_DIRS = new Set(['.git', '.github', 'css', 'js', 'node_modules', 'scripts', 'Landing', 'profile', 'Logo']);

// Find all category directories dynamically
const GALLERY_CATEGORIES = fs.readdirSync(path.join(__dirname, '..'), { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && !EXCLUDED_DIRS.has(dirent.name))
    .map(dirent => dirent.name);

// Handle Hero specifically (inside Landing/)
const heroCategoryPath = path.join(LANDING_DIR, 'Hero');
if (fs.existsSync(heroCategoryPath)) {
    const heroFiles = fs.readdirSync(heroCategoryPath, { withFileTypes: true });
    heroFiles.forEach(file => {
        if (file.isFile() && isImage(file.name)) {
            heroData.desktop.push(file.name);
        }
    });
    
    // Check for Mobile subfolder
    const mobilePath = path.join(heroCategoryPath, 'Mobile');
    if (fs.existsSync(mobilePath)) {
        const mobileFiles = fs.readdirSync(mobilePath, { withFileTypes: true });
        mobileFiles.forEach(file => {
            if (file.isFile() && isImage(file.name)) {
                heroData.mobile.push(file.name);
            }
        });
    }
}

// Handle all regular categories for gallery.json (in root directory)
GALLERY_CATEGORIES.forEach(category => {
    const categoryPath = path.join(__dirname, '..', category);
    if (!fs.existsSync(categoryPath)) {
        galleryData[category] = [];
        return;
    }
    
    const files = fs.readdirSync(categoryPath, { withFileTypes: true });
    const images = files
        .filter(file => file.isFile() && isImage(file.name))
        .map(file => file.name);
        
    galleryData[category] = images;
});

// Write JSON files
fs.writeFileSync(GALLERY_OUTPUT, JSON.stringify(galleryData, null, 2));
fs.writeFileSync(HERO_OUTPUT, JSON.stringify(heroData, null, 2));

console.log('Successfully generated gallery.json and hero.json');
