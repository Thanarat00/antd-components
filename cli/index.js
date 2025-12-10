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

function setupTailwind(cwd, projectType, baseDir, lang = 'ts') {
  log('\n⚙️  Setting up Tailwind CSS v4...', 'yellow');

  // Copy tailwind.config from package (support both .js and .ts)
  const packageDir = path.dirname(__dirname);
  const sourceTailwindConfig = path.join(packageDir, 'tailwind.config.js');
  const configExt = lang === 'ts' ? '.ts' : '.js';
  const targetTailwindConfig = path.join(cwd, `tailwind.config${configExt}`);
  
  if (fs.existsSync(sourceTailwindConfig)) {
    if (!fs.existsSync(targetTailwindConfig)) {
      // Read and adapt tailwind config for target project
      let tailwindConfig = fs.readFileSync(sourceTailwindConfig, 'utf-8');
      
      // Adjust content paths based on project type
      let contentPaths = [];
      switch (projectType) {
        case 'nextjs-app':
          contentPaths = [
            './app/**/*.{js,ts,jsx,tsx}',
            './src/app/**/*.{js,ts,jsx,tsx}',
            './components/**/*.{js,ts,jsx,tsx}',
            './src/components/**/*.{js,ts,jsx,tsx}',
          ];
          break;
        case 'nextjs-pages':
          contentPaths = [
            './pages/**/*.{js,ts,jsx,tsx}',
            './src/pages/**/*.{js,ts,jsx,tsx}',
            './components/**/*.{js,ts,jsx,tsx}',
            './src/components/**/*.{js,ts,jsx,tsx}',
          ];
          break;
        default:
          contentPaths = [
            './src/**/*.{js,ts,jsx,tsx}',
            './components/**/*.{js,ts,jsx,tsx}',
            './src/components/**/*.{js,ts,jsx,tsx}',
          ];
      }
      
      // Always include both .js and .jsx even if only TypeScript is selected
      // This ensures Tailwind works with both JS and TS files
      
      // Replace content array
      const contentArray = contentPaths.map(p => `    '${p}'`).join(',\n');
      tailwindConfig = tailwindConfig.replace(
        /content:\s*\[[\s\S]*?\]/,
        `content: [\n${contentArray},\n  ]`
      );
      
      // Convert to TypeScript if needed
      if (lang === 'ts' && configExt === '.ts') {
        // Convert JSDoc type to TypeScript import
        tailwindConfig = tailwindConfig.replace(
          /\/\*\* @type \{import\('tailwindcss'\)\.Config\} \*\//,
          "import type { Config } from 'tailwindcss';"
        );
        tailwindConfig = tailwindConfig.replace(
          /export default/,
          'const config: Config ='
        );
        tailwindConfig = tailwindConfig + '\n\nexport default config;';
      }
      
      fs.writeFileSync(targetTailwindConfig, tailwindConfig);
      log(`  + tailwind.config${configExt}`, 'green');
    } else {
      log(`  ~ tailwind.config${configExt} (already exists)`, 'yellow');
    }
  }
  
  // Also check if opposite extension exists and warn
  const oppositeExt = lang === 'ts' ? '.js' : '.ts';
  const oppositeConfig = path.join(cwd, `tailwind.config${oppositeExt}`);
  if (fs.existsSync(oppositeConfig)) {
    log(`  ⚠️  tailwind.config${oppositeExt} also exists (consider removing it)`, 'yellow');
  } else {
    // If source doesn't exist, create a basic tailwind config anyway
    if (!fs.existsSync(targetTailwindConfig)) {
      const configHeader = lang === 'ts' 
        ? `import type { Config } from 'tailwindcss';

const config: Config = {`
        : `/** @type {import('tailwindcss').Config} */
export default {`;
      
      const configFooter = lang === 'ts'
        ? `};

export default config;`
        : `};`;
      
      const basicTailwindConfig = `${configHeader}
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
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
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
${configFooter}`;
      fs.writeFileSync(targetTailwindConfig, basicTailwindConfig);
      log(`  + tailwind.config${configExt} (created basic config)`, 'green');
    } else {
      log('  ~ tailwind.config.js (already exists)', 'yellow');
    }
  }

  // Create postcss.config.mjs (always create, regardless of file types)
  const postcssConfigMjs = `export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}
`;

  const postcssConfigPath = path.join(cwd, 'postcss.config.mjs');
  const postcssConfigJsPath = path.join(cwd, 'postcss.config.js');
  
  // Always create postcss config if it doesn't exist
  if (!fs.existsSync(postcssConfigPath) && !fs.existsSync(postcssConfigJsPath)) {
    fs.writeFileSync(postcssConfigPath, postcssConfigMjs);
    log('  + postcss.config.mjs', 'green');
  } else {
    log('  ~ postcss.config (already exists)', 'yellow');
  }
  
  // If tailwind.config.js doesn't exist and source doesn't exist either, create a basic one
  if (!fs.existsSync(targetTailwindConfig) && !fs.existsSync(sourceTailwindConfig)) {
    const basicTailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
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
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
`;
    fs.writeFileSync(targetTailwindConfig, basicTailwindConfig);
    log('  + tailwind.config.js (created basic config)', 'green');
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
  log(`  ✓ Tailwind CSS config (tailwind.config.${options.lang === 'ts' ? 'ts' : 'js'})`, 'green');
  log('  ✓ PostCSS config (postcss.config.mjs)', 'green');
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
    // Copy all hooks except useForm (we'll handle it separately)
    const entries = fs.readdirSync(hooksDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && entry.name !== 'useForm.ts' && entry.name !== 'useForm.js') {
        const srcPath = path.join(hooksDir, entry.name);
        const ext = path.extname(entry.name);
        const allowedExt = options.lang === 'ts' ? ['.ts'] : ['.js'];
        if (allowedExt.includes(ext)) {
          const destPath = path.join(targetHooksDir, entry.name);
          if (!fs.existsSync(targetHooksDir)) {
            fs.mkdirSync(targetHooksDir, { recursive: true });
          }
          fs.copyFileSync(srcPath, destPath);
          log(`  + ${entry.name}`, 'green');
        }
      }
    }
    
    // Copy useForm only if form library is selected
    if (options.formLibrary !== 'none') {
      const useFormFile = path.join(hooksDir, `useForm.${options.lang === 'ts' ? 'ts' : 'js'}`);
      if (fs.existsSync(useFormFile)) {
        const targetUseFormFile = path.join(targetHooksDir, `useForm.${options.lang === 'ts' ? 'ts' : 'js'}`);
        if (!fs.existsSync(targetHooksDir)) {
          fs.mkdirSync(targetHooksDir, { recursive: true });
        }
        fs.copyFileSync(useFormFile, targetUseFormFile);
        log(`  + useForm.${options.lang === 'ts' ? 'ts' : 'js'}`, 'green');
      }
    }
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
        if (fs.existsSync(routingFile)) {
          copyFile(routingFile, targetRoutingDir, options.lang);
        }
        
        // Create custom index file that only exports selected routing
        const routingIndexExt = options.lang === 'ts' ? '.ts' : '.js';
        const routingIndexPath = path.join(targetRoutingDir, `index${routingIndexExt}`);
        let routingIndexContent = '';
        
        if (options.routing === 'tanstack-router') {
          const fileExt = options.lang === 'ts' ? 'tsx' : 'jsx';
          routingIndexContent = `// Tanstack Router
export { TanstackRouterProvider, createAppRoute, router } from './tanstack-router${options.lang === 'ts' ? '' : '.jsx'}';
`;
        } else if (options.routing === 'react-router-dom') {
          const fileExt = options.lang === 'ts' ? 'tsx' : 'jsx';
          if (options.lang === 'ts') {
            routingIndexContent = `// React Router DOM
export { ReactRouterProvider } from './react-router';
export type { RouteConfig, ReactRouterProviderProps } from './react-router';
export { Link, NavLink, useNavigate, useParams, useLocation } from './react-router';
`;
          } else {
            routingIndexContent = `// React Router DOM
export { ReactRouterProvider } from './react-router.jsx';
export { Link, NavLink, useNavigate, useParams, useLocation } from './react-router.jsx';
`;
          }
        }
        
        fs.writeFileSync(routingIndexPath, routingIndexContent);
        log(`  + index${routingIndexExt}`, 'green');
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
        if (fs.existsSync(storeFile)) {
          copyFile(storeFile, targetStoreDir, options.lang);
        }
        
        // Create custom index file that only exports selected state management
        const storeIndexExt = options.lang === 'ts' ? '.ts' : '.js';
        const storeIndexPath = path.join(targetStoreDir, `index${storeIndexExt}`);
        let storeIndexContent = '';
        
        if (options.stateManagement === 'zustand') {
          if (options.lang === 'ts') {
            storeIndexContent = `// Zustand
export { createZustandStore, create, persist, createJSONStorage } from './zustand-store';
export type { ZustandStoreConfig } from './zustand-store';
`;
          } else {
            storeIndexContent = `// Zustand
export { createZustandStore, create, persist, createJSONStorage } from './zustand-store.js';
`;
          }
        } else if (options.stateManagement === 'redux') {
          if (options.lang === 'ts') {
            storeIndexContent = `// Redux
export { createReduxSlice, createReduxStore, ReduxProvider, useAppDispatch, useAppSelector } from './redux-store';
export type { ReduxSliceConfig } from './redux-store';
export { configureStore, createSlice, Provider } from './redux-store';
`;
          } else {
            storeIndexContent = `// Redux
export { createReduxSlice, createReduxStore, ReduxProvider, useAppDispatch, useAppSelector } from './redux-store.js';
export { configureStore, createSlice, Provider } from './redux-store.js';
`;
          }
        }
        
        fs.writeFileSync(storeIndexPath, storeIndexContent);
        log(`  + index${storeIndexExt}`, 'green');
      }
    }
  }

  // Create main index file in baseDir (not components dir)
  const indexExt = options.lang === 'ts' ? '.ts' : '.js';
  const mainIndexPath = path.join(baseDir, `index${indexExt}`);
  
  let indexContent = `// Styles
import './styles/index.css';

// ============================================
// GENERAL COMPONENTS
// ============================================
export * from './components/General';

// ============================================
// LAYOUT COMPONENTS
// ============================================
export * from './components/Layout';

// ============================================
// NAVIGATION COMPONENTS
// ============================================
export * from './components/Navigation';

// ============================================
// DATA ENTRY COMPONENTS
// ============================================
export * from './components/DataEntry';

// ============================================
// DATA DISPLAY COMPONENTS
// ============================================
export * from './components/DataDisplay';

// ============================================
// TABLE COMPONENTS
// ============================================
export * from './components/Table';

// ============================================
// FEEDBACK COMPONENTS
// ============================================
export * from './components/Feedback';

// ============================================
// HOOKS
// ============================================
export { useTableSearch } from './hooks/useTableSearch';
export { useLocalStorage } from './hooks/useLocalStorage';
`;

  // Add useForm only if form library is selected
  if (options.formLibrary !== 'none') {
    if (options.lang === 'ts') {
      indexContent += `
// ============================================
// FORMS
// ============================================
export { useForm } from './hooks/useForm';
export type { FormLibrary, UseFormConfig } from './hooks/useForm';
export { Controller, FormProvider, useFormContext, useController, useWatch, useFieldArray } from './hooks/useForm';
`;
    } else {
      indexContent += `
// ============================================
// FORMS
// ============================================
export { useForm } from './hooks/useForm';
export { Controller, FormProvider, useFormContext, useController, useWatch, useFieldArray } from './hooks/useForm';
`;
    }
  }

  indexContent += `
// ============================================
// OTHER COMPONENTS
// ============================================
export * from './components/Other';

// ============================================
// UTILS
// ============================================
export { formatDate, formatThaiDate, getDatePresets, getDateRangePresets } from './utils/dateUtils';
export { cn } from './utils/cn';

// ============================================
// SERVICES
// ============================================
export { axiosInstant, AxiosInstant } from './services';
`;

  // Add type exports for TypeScript
  if (options.lang === 'ts') {
    indexContent += `export type { AxiosInstantConfig, ApiResponse } from './services';
`;
  }

  // Add Tanstack Query only if selected
  if (options.tanstackQuery) {
    const ext = options.lang === 'ts' ? '' : '.js';
    indexContent += `
// ============================================
// TANSTACK QUERY
// ============================================
export { QueryProvider, queryClient } from './lib/tanstack-query${ext}';
export { useApiQuery, useApiMutation, useApiPut, useApiDelete } from './lib/tanstack-query-hooks${ext}';
export { useQuery, useMutation, useQueryClient, useInfiniteQuery } from './lib/tanstack-query${ext}';
`;
  }

  // Add routing only if selected
  if (options.routing !== 'none') {
    const ext = options.lang === 'ts' ? '' : '.js';
    if (options.routing === 'tanstack-router') {
      indexContent += `
// ============================================
// ROUTING - Tanstack Router
// ============================================
export { TanstackRouterProvider, createAppRoute, router } from './lib/routing/tanstack-router${options.lang === 'ts' ? '' : '.jsx'}';
`;
    } else if (options.routing === 'react-router-dom') {
      if (options.lang === 'ts') {
        indexContent += `
// ============================================
// ROUTING - React Router DOM
// ============================================
export { ReactRouterProvider } from './lib/routing/react-router';
export type { RouteConfig, ReactRouterProviderProps } from './lib/routing/react-router';
export { Link, NavLink, useNavigate, useParams, useLocation } from './lib/routing/react-router';
`;
      } else {
        indexContent += `
// ============================================
// ROUTING - React Router DOM
// ============================================
export { ReactRouterProvider } from './lib/routing/react-router.jsx';
export { Link, NavLink, useNavigate, useParams, useLocation } from './lib/routing/react-router.jsx';
`;
      }
    }
  }

  // Add state management only if selected
  if (options.stateManagement !== 'none') {
    const ext = options.lang === 'ts' ? '' : '.js';
    if (options.stateManagement === 'zustand') {
      if (options.lang === 'ts') {
        indexContent += `
// ============================================
// STATE MANAGEMENT - Zustand
// ============================================
export { createZustandStore, create, persist, createJSONStorage } from './lib/store/zustand-store${ext}';
export type { ZustandStoreConfig } from './lib/store/zustand-store${ext}';
`;
      } else {
        indexContent += `
// ============================================
// STATE MANAGEMENT - Zustand
// ============================================
export { createZustandStore, create, persist, createJSONStorage } from './lib/store/zustand-store${ext}';
`;
      }
    } else if (options.stateManagement === 'redux') {
      if (options.lang === 'ts') {
        indexContent += `
// ============================================
// STATE MANAGEMENT - Redux
// ============================================
export { createReduxSlice, createReduxStore, ReduxProvider, useAppDispatch, useAppSelector } from './lib/store/redux-store${ext}';
export type { ReduxSliceConfig } from './lib/store/redux-store${ext}';
export { configureStore, createSlice, Provider } from './lib/store/redux-store${ext}';
`;
      } else {
        indexContent += `
// ============================================
// STATE MANAGEMENT - Redux
// ============================================
export { createReduxSlice, createReduxStore, ReduxProvider, useAppDispatch, useAppSelector } from './lib/store/redux-store${ext}';
export { configureStore, createSlice, Provider } from './lib/store/redux-store${ext}';
`;
      }
    }
  }

  fs.writeFileSync(mainIndexPath, indexContent);
  log(`\n  + index${indexExt} (main)`, 'green');

  // Also create components index file
  const componentsIndexPath = path.join(targetDir, `index${indexExt}`);
  const componentsIndexContent = `// Antd Custom Components
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

  fs.writeFileSync(componentsIndexPath, componentsIndexContent);
  log(`  + index${indexExt} (components)`, 'green');

  log('\n✅ Files created!', 'green');
  
  // Auto install dependencies
  installDependencies(cwd, options);
  
  // Setup Tailwind CSS
  setupTailwind(cwd, projectType, baseDir, options.lang);
  
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
