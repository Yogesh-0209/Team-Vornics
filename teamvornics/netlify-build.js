// Script to ensure Netlify Functions directory is properly created during build
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create netlify/functions directory if it doesn't exist
const functionsDir = path.join(__dirname, 'netlify', 'functions');
if (!fs.existsSync(functionsDir)) {
  console.log('Creating netlify/functions directory...');
  fs.mkdirSync(functionsDir, { recursive: true });
}

// Copy function files if they're not in the right place
const sourceDir = path.join(__dirname, '.netlify', 'functions');
if (fs.existsSync(sourceDir)) {
  console.log('Copying function files from .netlify/functions to netlify/functions...');
  const files = fs.readdirSync(sourceDir);
  files.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const destPath = path.join(functionsDir, file);
    if (fs.statSync(sourcePath).isFile()) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Copied ${file}`);
    }
  });
}

console.log('Netlify build script completed successfully!');