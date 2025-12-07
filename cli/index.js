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
  const devDependencies = ['tailwindcss', '@tailwindcss/postcss', 'postcss', 'autoprefixer'];
  
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

function setupTailwind(cwd) {
  log('\n⚙️  Setting up Tailwind CSS...', 'yellow');
  
  // Create tailwind.config.js
  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f4ff',
          100: '#bae0ff',
          200: '#91caff',
          300: '#69b1ff',
          400: '#4096ff',
          500: '#1677ff',
          600: '#0958d9',
          700: '#003eb3',
          800: '#002c8c',
          900: '#001d66',
        },
        success: {
          50: '#f6ffed',
          100: '#d9f7be',
          200: '#b7eb8f',
          300: '#95de64',
          400: '#73d13d',
          500: '#52c41a',
          600: '#389e0d',
          700: '#237804',
          800: '#135200',
          900: '#092b00',
        },
        warning: {
          50: '#fffbe6',
          100: '#fff1b8',
          200: '#ffe58f',
          300: '#ffd666',
          400: '#ffc53d',
          500: '#faad14',
          600: '#d48806',
          700: '#ad6800',
          800: '#874d00',
          900: '#613400',
        },
        error: {
          50: '#fff2f0',
          100: '#ffccc7',
          200: '#ffa39e',
          300: '#ff7875',
          400: '#ff4d4f',
          500: '#f5222d',
          600: '#cf1322',
          700: '#a8071a',
          800: '#820014',
          900: '#5c0011',
        },
      },
      borderRadius: {
        'antd': '6px',
        'antd-lg': '8px',
      },
      boxShadow: {
        'antd': '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
        'antd-md': '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
        'antd-lg': '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}
`;

  const tailwindConfigPath = path.join(cwd, 'tailwind.config.js');
  if (!fs.existsSync(tailwindConfigPath)) {
    fs.writeFileSync(tailwindConfigPath, tailwindConfig);
    log('  + tailwind.config.js', 'green');
  } else {
    log('  ~ tailwind.config.js (already exists)', 'yellow');
  }

  // Create postcss.config.js
  const postcssConfig = `export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
`;

  const postcssConfigPath = path.join(cwd, 'postcss.config.js');
  if (!fs.existsSync(postcssConfigPath)) {
    fs.writeFileSync(postcssConfigPath, postcssConfig);
    log('  + postcss.config.js', 'green');
  } else {
    log('  ~ postcss.config.js (already exists)', 'yellow');
  }

  // Check and update CSS file
  const cssFiles = ['src/index.css', 'src/App.css', 'src/styles/index.css'];
  let cssUpdated = false;
  
  for (const cssFile of cssFiles) {
    const cssPath = path.join(cwd, cssFile);
    if (fs.existsSync(cssPath)) {
      let cssContent = fs.readFileSync(cssPath, 'utf-8');
      if (!cssContent.includes('@tailwind')) {
        const tailwindDirectives = `@tailwind base;
@tailwind components;
@tailwind utilities;

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
    // Create src/index.css if no CSS file exists
    const srcDir = path.join(cwd, 'src');
    if (!fs.existsSync(srcDir)) {
      fs.mkdirSync(srcDir, { recursive: true });
    }
    const newCssPath = path.join(srcDir, 'index.css');
    const tailwindCss = `@tailwind base;
@tailwind components;
@tailwind utilities;
`;
    fs.writeFileSync(newCssPath, tailwindCss);
    log('  + src/index.css', 'green');
  }
}

function init() {
  const cwd = process.cwd();
  const targetDir = path.join(cwd, 'src', 'components');
  
  log('\n🚀 Antd Components Generator\n', 'cyan');
  
  // Find the package directory
  const packageDir = path.dirname(__dirname);
  const srcDir = path.join(packageDir, 'src');
  
  // Check if src exists
  if (!fs.existsSync(srcDir)) {
    log('❌ Source files not found!', 'red');
    return;
  }

  // Copy components
  log('📁 Creating components...', 'yellow');
  const componentsDir = path.join(srcDir, 'components');
  if (fs.existsSync(componentsDir)) {
    copyDir(componentsDir, targetDir);
  }

  // Copy utils
  log('\n📁 Creating utils...', 'yellow');
  const utilsDir = path.join(srcDir, 'utils');
  const targetUtilsDir = path.join(cwd, 'src', 'utils');
  if (fs.existsSync(utilsDir)) {
    copyDir(utilsDir, targetUtilsDir);
  }

  // Copy hooks
  log('\n📁 Creating hooks...', 'yellow');
  const hooksDir = path.join(srcDir, 'hooks');
  const targetHooksDir = path.join(cwd, 'src', 'hooks');
  if (fs.existsSync(hooksDir)) {
    copyDir(hooksDir, targetHooksDir);
  }

  // Copy styles
  log('\n📁 Creating styles...', 'yellow');
  const stylesDir = path.join(srcDir, 'styles');
  const targetStylesDir = path.join(cwd, 'src', 'styles');
  if (fs.existsSync(stylesDir)) {
    copyDir(stylesDir, targetStylesDir);
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
  setupTailwind(cwd);
  
  log('\n✅ Setup complete!', 'green');
  log('\n📝 Usage:', 'cyan');
  log(`// Import styles in main.tsx or App.tsx`, 'blue');
  log(`import './styles/index.css';`, 'blue');
  log('');
  log(`// Import components`, 'blue');
  log(`import { CustomInput, CustomTable } from './components';`, 'blue');
  log('');
}

function help() {
  log('\n🎨 Antd Components CLI\n', 'cyan');
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
