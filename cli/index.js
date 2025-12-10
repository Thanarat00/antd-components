#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import readline from 'readline';

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

function copyDir(src, dest, options = {}) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  const { allowedExtensions = [], skipExtensions = [] } = options;

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, options);
    } else {
      // Skip story files
      if (entry.name.includes('.stories.')) continue;
      
      const ext = path.extname(entry.name);
      
      // Filter by allowed extensions if specified
      if (allowedExtensions.length > 0) {
        if (!allowedExtensions.includes(ext)) continue;
      }
      
      // Skip specified extensions
      if (skipExtensions.includes(ext)) continue;
      
      fs.copyFileSync(srcPath, destPath);
      log(`  + ${entry.name}`, 'green');
    }
  }
}

function copyFile(src, destDir, lang = 'ts') {
  if (!fs.existsSync(src)) return false;
  
  const ext = path.extname(src);
  const baseName = path.basename(src, ext);
  const targetExt = lang === 'ts' ? ext : ext.replace('.ts', '.js').replace('.tsx', '.jsx');
  const targetPath = path.join(destDir, baseName + targetExt);
  
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  let content = fs.readFileSync(src, 'utf-8');
  
  // Convert TypeScript to JavaScript if needed
  if (lang === 'js' && (ext === '.ts' || ext === '.tsx')) {
    // Remove type annotations (basic conversion)
    content = content
      .replace(/:\s*[A-Za-z][A-Za-z0-9<>\[\]|&\s,]*(\s*=\s*[^,;\)}]+)?/g, '')
      .replace(/<[^>]+>/g, '')
      .replace(/import\s+type\s+{[^}]+}\s+from/g, '// Types removed')
      .replace(/export\s+type\s+/g, '// Type export removed: ')
      .replace(/export\s+interface\s+/g, '// Interface export removed: ');
  }
  
  fs.writeFileSync(targetPath, content);
  log(`  + ${path.basename(targetPath)}`, 'green');
  return true;
}

function installDependencies(cwd, options = {}) {
  const {
    lang = 'ts',
    routing = 'none',
    stateManagement = 'none',
    formLibrary = 'none',
    tanstackQuery = false,
  } = options;

  const dependencies = ['antd', '@ant-design/icons', 'dayjs', 'clsx', 'axios', 'js-cookie'];
  const devDependencies = ['tailwindcss', '@tailwindcss/postcss', 'postcss'];

  // Add routing dependencies
  if (routing === 'tanstack-router') {
    dependencies.push('@tanstack/react-router');
  } else if (routing === 'react-router-dom') {
    dependencies.push('react-router-dom');
  }

  // Add state management dependencies
  if (stateManagement === 'zustand') {
    dependencies.push('zustand');
  } else if (stateManagement === 'redux') {
    dependencies.push('@reduxjs/toolkit', 'react-redux', 'redux-persist');
  }

  // Add form library dependencies
  if (formLibrary === 'react-hook-form') {
    dependencies.push('react-hook-form', '@hookform/resolvers', 'zod');
  } else if (formLibrary === 'olapat') {
    dependencies.push('olapat');
  }

  // Add Tanstack Query
  if (tanstackQuery) {
    dependencies.push('@tanstack/react-query', '@tanstack/react-query-devtools');
  }

  // Add TypeScript dev dependencies if using TS
  if (lang === 'ts') {
    devDependencies.push('@types/js-cookie');
    if (routing === 'react-router-dom') {
      devDependencies.push('@types/react-router-dom');
    }
  }

  log('\n📦 Installing dependencies...', 'yellow');
  
  try {
    if (dependencies.length > 0) {
      execSync(`npm install ${dependencies.join(' ')}`, {
        cwd: cwd,
        stdio: 'inherit'
      });
    }
    
    if (devDependencies.length > 0) {
      log('\n📦 Installing dev dependencies...', 'yellow');
      execSync(`npm install -D ${devDependencies.join(' ')}`, {
        cwd: cwd,
        stdio: 'inherit'
      });
    }
    
    log('\n✅ Dependencies installed!', 'green');
    return true;
  } catch (error) {
    log('\n❌ Failed to install dependencies', 'red');
    log('Please run manually:', 'yellow');
    if (dependencies.length > 0) {
      log(`npm install ${dependencies.join(' ')}`, 'blue');
    }
    if (devDependencies.length > 0) {
      log(`npm install -D ${devDependencies.join(' ')}`, 'blue');
    }
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

function question(rl, query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

function createReadline() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

async function promptUser() {
  const rl = createReadline();

  const options = {};

  // Language selection
  log('\n📝 Language Selection:', 'cyan');
  log('  1) TypeScript (ts)', 'blue');
  log('  2) JavaScript (js)', 'blue');
  const langChoice = await question(rl, 'Select language (1-2, default: 1): ');
  options.lang = langChoice.trim() === '2' ? 'js' : 'ts';

  // Routing selection
  log('\n🛣️  Routing Library:', 'cyan');
  log('  1) None', 'blue');
  log('  2) Tanstack Router', 'blue');
  log('  3) React Router DOM', 'blue');
  const routingChoice = await question(rl, 'Select routing (1-3, default: 1): ');
  const routingMap = { '1': 'none', '2': 'tanstack-router', '3': 'react-router-dom' };
  options.routing = routingMap[routingChoice.trim()] || 'none';

  // State management selection
  log('\n🗄️  State Management:', 'cyan');
  log('  1) None', 'blue');
  log('  2) Zustand', 'blue');
  log('  3) Redux', 'blue');
  const stateChoice = await question(rl, 'Select state management (1-3, default: 1): ');
  const stateMap = { '1': 'none', '2': 'zustand', '3': 'redux' };
  options.stateManagement = stateMap[stateChoice.trim()] || 'none';

  // Form library selection
  log('\n📋 Form Library:', 'cyan');
  log('  1) None', 'blue');
  log('  2) React Hook Form', 'blue');
  log('  3) Olapat', 'blue');
  const formChoice = await question(rl, 'Select form library (1-3, default: 1): ');
  const formMap = { '1': 'none', '2': 'react-hook-form', '3': 'olapat' };
  options.formLibrary = formMap[formChoice.trim()] || 'none';

  // Tanstack Query
  log('\n🔍 Tanstack Query:', 'cyan');
  const tanstackChoice = await question(rl, 'Install Tanstack Query? (y/n, default: n): ');
  options.tanstackQuery = tanstackChoice.trim().toLowerCase() === 'y';

  rl.close();
  return options;
}

async function init() {
  const cwd = process.cwd();
  
  log('\n🚀 Antd Components Generator\n', 'cyan');
  
  // Prompt user for options
  const options = await promptUser();
  
  // Show summary
  log('\n📋 Configuration Summary:', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
  log(`  Language: ${options.lang === 'ts' ? 'TypeScript' : 'JavaScript'}`, 'blue');
  log(`  Routing: ${options.routing === 'none' ? 'None' : options.routing === 'tanstack-router' ? 'Tanstack Router' : 'React Router DOM'}`, 'blue');
  log(`  State Management: ${options.stateManagement === 'none' ? 'None' : options.stateManagement === 'zustand' ? 'Zustand' : 'Redux'}`, 'blue');
  log(`  Form Library: ${options.formLibrary === 'none' ? 'None' : options.formLibrary === 'react-hook-form' ? 'React Hook Form' : 'Olapat'}`, 'blue');
  log(`  Tanstack Query: ${options.tanstackQuery ? 'Yes' : 'No'}`, 'blue');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
  
  // Detect project type
  const projectType = detectProjectType(cwd);
  log(`\n📋 Detected project: ${projectType}`, 'blue');
  
  // Show what will be created
  log('\n📁 Files that will be created:', 'cyan');
  log('  ✓ Components (all categories)', 'green');
  log('  ✓ Utils (cn, dateUtils)', 'green');
  log('  ✓ Hooks (useLocalStorage, useTableSearch, useForm)', 'green');
  log('  ✓ Services (axiosInstant)', 'green');
  if (options.tanstackQuery) {
    log('  ✓ Tanstack Query setup', 'green');
  }
  if (options.routing !== 'none') {
    log(`  ✓ Routing (${options.routing === 'tanstack-router' ? 'Tanstack Router' : 'React Router DOM'})`, 'green');
  }
  if (options.stateManagement !== 'none') {
    log(`  ✓ State Management (${options.stateManagement === 'zustand' ? 'Zustand' : 'Redux'})`, 'green');
  }
  
  // Ask for confirmation
  const confirmRl = createReadline();
  const confirm = await question(confirmRl, '\n❓ Proceed with setup? (y/n, default: y): ');
  confirmRl.close();
  
  if (confirm.trim().toLowerCase() === 'n') {
    log('\n❌ Setup cancelled.', 'yellow');
    return;
  }
  
  log('\n🚀 Starting setup...\n', 'cyan');
  
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
    copyDir(componentsDir, targetDir, { 
      allowedExtensions: options.lang === 'ts' ? ['.ts', '.tsx'] : ['.js', '.jsx'] 
    });
  }

  // Copy utils
  log('\n📁 Creating utils...', 'yellow');
  const utilsDir = path.join(srcDir, 'utils');
  const targetUtilsDir = path.join(baseDir, 'utils');
  if (fs.existsSync(utilsDir)) {
    copyDir(utilsDir, targetUtilsDir, { 
      allowedExtensions: options.lang === 'ts' ? ['.ts'] : ['.js'] 
    });
  }

  // Copy hooks (including useForm)
  log('\n📁 Creating hooks...', 'yellow');
  const hooksDir = path.join(srcDir, 'hooks');
  const targetHooksDir = path.join(baseDir, 'hooks');
  if (fs.existsSync(hooksDir)) {
    copyDir(hooksDir, targetHooksDir, { 
      allowedExtensions: options.lang === 'ts' ? ['.ts'] : ['.js'] 
    });
  }

  // Copy services (axiosInstant)
  log('\n📁 Creating services...', 'yellow');
  const servicesDir = path.join(srcDir, 'services');
  const targetServicesDir = path.join(baseDir, 'services');
  if (fs.existsSync(servicesDir)) {
    copyDir(servicesDir, targetServicesDir, { 
      allowedExtensions: options.lang === 'ts' ? ['.ts'] : ['.js'] 
    });
  }

  // Copy lib files based on selections
  log('\n📁 Creating lib files...', 'yellow');
  const libDir = path.join(srcDir, 'lib');
  const targetLibDir = path.join(baseDir, 'lib');
  
  if (fs.existsSync(libDir)) {
    if (!fs.existsSync(targetLibDir)) {
      fs.mkdirSync(targetLibDir, { recursive: true });
    }

    // Copy Tanstack Query if selected
    if (options.tanstackQuery) {
      const tanstackQueryFile = path.join(libDir, `tanstack-query.${options.lang === 'ts' ? 'ts' : 'js'}`);
      const tanstackQueryHooksFile = path.join(libDir, `tanstack-query-hooks.${options.lang === 'ts' ? 'ts' : 'js'}`);
      if (fs.existsSync(tanstackQueryFile)) {
        copyFile(tanstackQueryFile, targetLibDir, options.lang);
      }
      if (fs.existsSync(tanstackQueryHooksFile)) {
        copyFile(tanstackQueryHooksFile, targetLibDir, options.lang);
      }
    }

    // Copy routing if selected
    if (options.routing !== 'none') {
      const routingDir = path.join(libDir, 'routing');
      const targetRoutingDir = path.join(targetLibDir, 'routing');
      if (fs.existsSync(routingDir)) {
        if (!fs.existsSync(targetRoutingDir)) {
          fs.mkdirSync(targetRoutingDir, { recursive: true });
        }
        const routingFileExt = options.lang === 'ts' ? 'tsx' : 'jsx';
        const routingFile = path.join(routingDir, `${options.routing === 'tanstack-router' ? 'tanstack-router' : 'react-router'}.${routingFileExt}`);
        const routingIndexFile = path.join(routingDir, `index.${options.lang === 'ts' ? 'ts' : 'js'}`);
        if (fs.existsSync(routingFile)) {
          copyFile(routingFile, targetRoutingDir, options.lang);
        }
        if (fs.existsSync(routingIndexFile)) {
          copyFile(routingIndexFile, targetRoutingDir, options.lang);
        }
      }
    }

    // Copy state management if selected
    if (options.stateManagement !== 'none') {
      const storeDir = path.join(libDir, 'store');
      const targetStoreDir = path.join(targetLibDir, 'store');
      if (fs.existsSync(storeDir)) {
        if (!fs.existsSync(targetStoreDir)) {
          fs.mkdirSync(targetStoreDir, { recursive: true });
        }
        const storeFileExt = options.lang === 'ts' ? 'ts' : 'js';
        const storeFile = path.join(storeDir, `${options.stateManagement}-store.${storeFileExt}`);
        const storeIndexFile = path.join(storeDir, `index.${storeFileExt}`);
        if (fs.existsSync(storeFile)) {
          copyFile(storeFile, targetStoreDir, options.lang);
        }
        if (fs.existsSync(storeIndexFile)) {
          copyFile(storeIndexFile, targetStoreDir, options.lang);
        }
      }
    }
  }

  // Create index file
  const indexExt = options.lang === 'ts' ? '.ts' : '.js';
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

  const indexPath = path.join(targetDir, `index${indexExt}`);
  fs.writeFileSync(indexPath, indexContent);
  log(`\n  + index${indexExt}`, 'green');

  log('\n✅ Files created!', 'green');
  
  // Auto install dependencies
  installDependencies(cwd, options);
  
  // Setup Tailwind CSS
  setupTailwind(cwd, projectType, baseDir);
  
  log('\n✅ Setup complete!', 'green');
  
  // Show usage
  log('\n📝 Usage:', 'cyan');
  log(`import { CustomInput, CustomTable, CustomCard } from './components';`, 'blue');
  if (options.routing !== 'none') {
    log(`import { ${options.routing === 'tanstack-router' ? 'TanstackRouterProvider' : 'ReactRouterProvider'} } from './lib/routing';`, 'blue');
  }
  if (options.stateManagement !== 'none') {
    log(`import { ${options.stateManagement === 'zustand' ? 'createZustandStore' : 'createReduxStore'} } from './lib/store';`, 'blue');
  }
  if (options.formLibrary !== 'none') {
    log(`import { useForm } from './hooks/useForm';`, 'blue');
  }
  if (options.tanstackQuery) {
    log(`import { QueryProvider } from './lib/tanstack-query';`, 'blue');
  }
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
