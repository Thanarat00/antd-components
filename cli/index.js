#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const command = args[0];

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function detectProjectType(cwd) {
  // Check for Next.js
  const nextConfigJs = path.join(cwd, 'next.config.js');
  const nextConfigMjs = path.join(cwd, 'next.config.mjs');
  const nextConfigTs = path.join(cwd, 'next.config.ts');
  
  if (fs.existsSync(nextConfigJs) || fs.existsSync(nextConfigMjs) || fs.existsSync(nextConfigTs)) {
    // Check for App Router vs Pages Router
    if (fs.existsSync(path.join(cwd, 'app')) || fs.existsSync(path.join(cwd, 'src', 'app'))) {
      return 'nextjs-app';
    }
    return 'nextjs-pages';
  }
  
  // Check for Vite
  const viteConfig = path.join(cwd, 'vite.config.ts');
  const viteConfigJs = path.join(cwd, 'vite.config.js');
  if (fs.existsSync(viteConfig) || fs.existsSync(viteConfigJs)) {
    return 'vite';
  }
  
  // Default to src structure
  return 'default';
}

function getBaseDir(cwd, projectType) {
  switch (projectType) {
    case 'nextjs-app':
      // Check if using src/app or app
      if (fs.existsSync(path.join(cwd, 'src', 'app'))) {
        return path.join(cwd, 'src');
      }
      // Create in src if doesn't exist
      return path.join(cwd, 'src');
    case 'nextjs-pages':
      if (fs.existsSync(path.join(cwd, 'src'))) {
        return path.join(cwd, 'src');
      }
      return cwd;
    default:
      return path.join(cwd, 'src');
  }
}

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      // Skip story files
      if (entry.name.includes('.stories.')) continue;
      fs.copyFileSync(srcPath, destPath);
      log(`  + ${entry.name}`, 'green');
    }
  }
}

function installDependencies(cwd) {
  const dependencies = ['antd', '@ant-design/icons', 'dayjs', 'clsx'];
  const devDependencies = ['tailwindcss', '@tailwindcss/postcss', 'postcss'];
  
  log('\n📦 Installing dependencies...', 'yellow');
  
  try {
    execSync(`npm install ${dependencies.join(' ')}`, {
      cwd: cwd,
      stdio: 'inherit'
    });
    
    log('\n📦 Installing Tailwind CSS...', 'yellow');
    execSync(`npm install -D ${devDependencies.join(' ')}`, {
      cwd: cwd,
      stdio: 'inherit'
    });
    
    log('\n✅ Dependencies installed!', 'green');
    return true;
  } catch (error) {
    log('\n❌ Failed to install dependencies', 'red');
    log('Please run manually:', 'yellow');
    log(`npm install ${dependencies.join(' ')}`, 'blue');
    log(`npm install -D ${devDependencies.join(' ')}`, 'blue');
    return false;
  }
}

function setupTailwind(cwd, projectType, baseDir) {
  log('\n⚙️  Setting up Tailwind CSS v4...', 'yellow');

  // Create postcss.config.mjs
  const postcssConfigMjs = `export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}
`;

  const postcssConfigPath = path.join(cwd, 'postcss.config.mjs');
  const postcssConfigJsPath = path.join(cwd, 'postcss.config.js');
  
  if (!fs.existsSync(postcssConfigPath) && !fs.existsSync(postcssConfigJsPath)) {
    fs.writeFileSync(postcssConfigPath, postcssConfigMjs);
    log('  + postcss.config.mjs', 'green');
  } else {
    log('  ~ postcss.config (already exists)', 'yellow');
  }

  // Check and update CSS file based on project type
  let cssFiles;
  switch (projectType) {
    case 'nextjs-app':
      cssFiles = [
        'app/globals.css',
        'src/app/globals.css',
        'styles/globals.css',
        'src/styles/globals.css',
      ];
      break;
    case 'nextjs-pages':
      cssFiles = [
        'styles/globals.css',
        'src/styles/globals.css',
      ];
      break;
    default:
      cssFiles = [
        'src/index.css',
        'src/App.css',
        'src/styles/index.css',
      ];
  }
  
  let cssUpdated = false;
  
  for (const cssFile of cssFiles) {
    const cssPath = path.join(cwd, cssFile);
    if (fs.existsSync(cssPath)) {
      let cssContent = fs.readFileSync(cssPath, 'utf-8');
      if (!cssContent.includes('@import "tailwindcss"') && !cssContent.includes('@tailwind')) {
        const tailwindDirectives = `@import "tailwindcss";

`;
        fs.writeFileSync(cssPath, tailwindDirectives + cssContent);
        log(`  + Added Tailwind directives to ${cssFile}`, 'green');
        cssUpdated = true;
        break;
      } else {
        log(`  ~ ${cssFile} (Tailwind already configured)`, 'yellow');
        cssUpdated = true;
        break;
      }
    }
  }

  if (!cssUpdated) {
    log('  ⚠️  No CSS file found. Please add to your CSS:', 'yellow');
    log('     @import "tailwindcss";', 'blue');
  }
}

function init() {
  const cwd = process.cwd();
  
  log('\n🚀 Antd Components Generator\n', 'cyan');
  
  // Detect project type
  const projectType = detectProjectType(cwd);
  log(`📋 Detected project: ${projectType}`, 'blue');
  
  // Get base directory
  const baseDir = getBaseDir(cwd, projectType);
  const targetDir = path.join(baseDir, 'components');
  
  // Find the package directory
  const packageDir = path.dirname(__dirname);
  const srcDir = path.join(packageDir, 'src');
  
  // Check if src exists
  if (!fs.existsSync(srcDir)) {
    log('❌ Source files not found!', 'red');
    return;
  }

  // Copy components
  log('\n📁 Creating components...', 'yellow');
  const componentsDir = path.join(srcDir, 'components');
  if (fs.existsSync(componentsDir)) {
    copyDir(componentsDir, targetDir);
  }

  // Copy utils
  log('\n📁 Creating utils...', 'yellow');
  const utilsDir = path.join(srcDir, 'utils');
  const targetUtilsDir = path.join(baseDir, 'utils');
  if (fs.existsSync(utilsDir)) {
    copyDir(utilsDir, targetUtilsDir);
  }

  // Copy hooks
  log('\n📁 Creating hooks...', 'yellow');
  const hooksDir = path.join(srcDir, 'hooks');
  const targetHooksDir = path.join(baseDir, 'hooks');
  if (fs.existsSync(hooksDir)) {
    copyDir(hooksDir, targetHooksDir);
  }

  // Create index.ts
  const indexContent = `// Antd Custom Components
// Generated by antd-components CLI

export * from './Form';
export * from './Layout';
export * from './Table';
export * from './Feedback';
export * from './General';
export * from './Navigation';
export * from './DataEntry';
export * from './DataDisplay';
export * from './Other';
`;

  const indexPath = path.join(targetDir, 'index.ts');
  fs.writeFileSync(indexPath, indexContent);
  log(`\n  + index.ts`, 'green');

  log('\n✅ Components created!', 'green');
  
  // Auto install dependencies
  installDependencies(cwd);
  
  // Setup Tailwind CSS
  setupTailwind(cwd, projectType, baseDir);
  
  log('\n✅ Setup complete!', 'green');
  
  // Show usage
  log('\n📝 Usage:', 'cyan');
  log(`import { CustomInput, CustomTable, CustomCard } from './components';`, 'blue');
  log('');
}

function help() {
  log('\n🎨 Antd Components CLI\n', 'cyan');
  log('Supports: Vite, Next.js (App Router & Pages Router)\n', 'blue');
  log('Usage:', 'yellow');
  log('  npx antd-components init    Generate all components + setup Tailwind');
  log('  npx antd-components help    Show help\n');
}

// Main
switch (command) {
  case 'init':
    init();
    break;
  case 'help':
  case '--help':
  case '-h':
    help();
    break;
  default:
    help();
}
