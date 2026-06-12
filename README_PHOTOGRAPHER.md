# KBN Website - Photographer Guide

Welcome to your new fully automated website! You do **not** need to touch any code to update your photos. The system handles everything automatically.

## How to Update Your Gallery

1. **Open GitHub**: Go to your repository on github.com.
2. **Find the Category**: Click into the `Landing/` folder, then click on the category you want to update (e.g., `Wedding`, `Baby`, `Hero`).
3. **Upload Photos**: 
   - Click the "Add file" button in the top right.
   - Choose "Upload files".
   - Drag and drop your new photos (`.jpg`, `.png`, etc.) directly into the browser.
4. **Save**: Click the green "Commit changes" button at the bottom.

**That's it! You are done.** 

## What happens next?
Behind the scenes, GitHub will instantly wake up a bot that:
1. Scans the folders for your new photos.
2. Generates the necessary data files for the website.
3. Repackages your code.
4. Redeploys your website.

Within **1 to 2 minutes**, your website will automatically update with the new photos. No developers required!

## Adding a Brand New Category?
If you want to add a completely new category (e.g., "Maternity"):
1. Open the `Landing/` folder on GitHub.
2. Click "Add file" -> "Create new file".
3. In the text box, type `Maternity/placeholder.txt` (this creates the folder).
4. Commit it.
5. Now you can upload photos to your new `Maternity` folder, and the system will instantly build a gallery for it automatically!
