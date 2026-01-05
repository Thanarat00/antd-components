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
  const packageJsonPath = path.join(cwd, 'package.json');
  
  // Check package.json for Next.js
  let isNextJs = false;
  let nextVersion = null;
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      if (deps.next) {
        isNextJs = true;
        nextVersion = deps.next;
      }
    } catch (e) {
      // Ignore parse errors
    }
  }
  
  if (isNextJs || fs.existsSync(nextConfigJs) || fs.existsSync(nextConfigMjs) || fs.existsSync(nextConfigTs)) {
    // Check for App Router vs Pages Router
    // App Router: has app directory (or src/app)
    const appDir = path.join(cwd, 'app');
    const srcAppDir = path.join(cwd, 'src', 'app');
    const pagesDir = path.join(cwd, 'pages');
    const srcPagesDir = path.join(cwd, 'src', 'pages');
    
    if (fs.existsSync(appDir) || fs.existsSync(srcAppDir)) {
      return 'nextjs-app';
    }
    if (fs.existsSync(pagesDir) || fs.existsSync(srcPagesDir)) {
      return 'nextjs-pages';
    }
    // If neither exists but has next.config, default to App Router (Next.js 13+)
    if (isNextJs) {
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
      // Next.js App Router: prefer src directory if exists, otherwise root
      // Components can be in src/components or components (root level)
      if (fs.existsSync(path.join(cwd, 'src'))) {
        return path.join(cwd, 'src');
      }
      // If no src directory, create components at root level
      return cwd;
    case 'nextjs-pages':
      // Next.js Pages Router: prefer src directory if exists
      if (fs.existsSync(path.join(cwd, 'src'))) {
        return path.join(cwd, 'src');
      }
      // If no src directory, use root
      return cwd;
    default:
      return path.join(cwd, 'src');
  }
}

function getComponentsDir(cwd, projectType, baseDir) {
  // For Next.js, components can be at root level or in src
  const rootComponents = path.join(cwd, 'components');
  const srcComponents = path.join(baseDir, 'components');
  
  // Prefer root level components for Next.js (common pattern)
  if (projectType === 'nextjs-app' || projectType === 'nextjs-pages') {
    // Check if root components already exists
    if (fs.existsSync(rootComponents)) {
      return rootComponents;
    }
    // Check if src/components exists
    if (fs.existsSync(srcComponents)) {
      return srcComponents;
    }
    // Default to root level for Next.js (better for App Router)
    return rootComponents;
  }
  
  // For other projects, use src/components
  return srcComponents;
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

function setupJSXConfig(cwd, projectType) {
  // Determine JSX mode based on project type
  // Next.js uses 'preserve', others use 'react-jsx'
  const isNextJs = projectType === 'nextjs-app' || projectType === 'nextjs-pages';
  const jsxMode = isNextJs ? 'preserve' : 'react-jsx';
  
  // Check if tsconfig.json exists (TypeScript project)
  const tsconfigPath = path.join(cwd, 'tsconfig.json');
  if (fs.existsSync(tsconfigPath)) {
    // TypeScript project - check if JSX is configured
    try {
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
      if (tsconfig.compilerOptions && tsconfig.compilerOptions.jsx) {
        // JSX already configured
        return;
      }
      // Add JSX if missing
      if (!tsconfig.compilerOptions) {
        tsconfig.compilerOptions = {};
      }
      tsconfig.compilerOptions.jsx = jsxMode;
      fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
      log(`  + Updated tsconfig.json (added JSX support: ${jsxMode})`, 'green');
      return;
    } catch (e) {
      // Ignore parse errors
    }
  }
  
  // Check if jsconfig.json already exists
  const jsconfigPath = path.join(cwd, 'jsconfig.json');
  if (fs.existsSync(jsconfigPath)) {
    // Read existing jsconfig.json
    try {
      const existingConfig = JSON.parse(fs.readFileSync(jsconfigPath, 'utf-8'));
      // Check if JSX is already enabled
      if (existingConfig.compilerOptions && existingConfig.compilerOptions.jsx) {
        log('  ~ jsconfig.json (JSX already configured)', 'yellow');
        return;
      }
      // Add JSX configuration
      if (!existingConfig.compilerOptions) {
        existingConfig.compilerOptions = {};
      }
      existingConfig.compilerOptions.jsx = jsxMode;
      fs.writeFileSync(jsconfigPath, JSON.stringify(existingConfig, null, 2));
      log(`  + Updated jsconfig.json (added JSX support: ${jsxMode})`, 'green');
      return;
    } catch (e) {
      log('  ⚠️  Could not parse existing jsconfig.json', 'yellow');
    }
  }
  
  // Create new jsconfig.json
  const baseUrl = fs.existsSync(path.join(cwd, 'src')) ? '.' : '.';
  const paths = fs.existsSync(path.join(cwd, 'src')) 
    ? { '@/*': ['./src/*'] }
    : { '@/*': ['./*'] };
  
  const includePaths = [];
  if (isNextJs) {
    if (projectType === 'nextjs-app') {
      includePaths.push('./app/**/*', './src/app/**/*');
    } else {
      includePaths.push('./pages/**/*', './src/pages/**/*');
    }
  } else {
    includePaths.push('src/**/*');
  }
  includePaths.push('./components/**/*', './src/components/**/*');
  
  const jsconfig = {
    compilerOptions: {
      jsx: jsxMode,
      module: 'ESNext',
      moduleResolution: 'bundler',
      target: 'ES2020',
      allowJs: true,
      checkJs: false,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      strict: false,
      skipLibCheck: true,
      resolveJsonModule: true,
      isolatedModules: true,
      baseUrl: baseUrl,
      paths: paths
    },
    include: includePaths,
    exclude: [
      'node_modules',
      'dist',
      'build'
    ]
  };
  
  fs.writeFileSync(jsconfigPath, JSON.stringify(jsconfig, null, 2));
  log('  + Created jsconfig.json (JSX enabled)', 'green');
}

function setupNextJSConfig(cwd, projectType, lang = 'ts') {
  log('\n⚙️  Setting up Next.js configuration...', 'yellow');
  
  // For Next.js App Router, ensure app directory exists
  if (projectType === 'nextjs-app') {
    const appDir = path.join(cwd, 'app');
    const srcAppDir = path.join(cwd, 'src', 'app');
    
    if (!fs.existsSync(appDir) && !fs.existsSync(srcAppDir)) {
      // Create app directory
      const targetAppDir = fs.existsSync(path.join(cwd, 'src')) ? srcAppDir : appDir;
      if (!fs.existsSync(targetAppDir)) {
        fs.mkdirSync(targetAppDir, { recursive: true });
        log('  + Created app directory', 'green');
      }
    }
  }
  
  // For Next.js Pages Router, ensure pages directory exists
  if (projectType === 'nextjs-pages') {
    const pagesDir = path.join(cwd, 'pages');
    const srcPagesDir = path.join(cwd, 'src', 'pages');
    
    if (!fs.existsSync(pagesDir) && !fs.existsSync(srcPagesDir)) {
      // Create pages directory
      const targetPagesDir = fs.existsSync(path.join(cwd, 'src')) ? srcPagesDir : pagesDir;
      if (!fs.existsSync(targetPagesDir)) {
        fs.mkdirSync(targetPagesDir, { recursive: true });
        log('  + Created pages directory', 'green');
      }
    }
  }
  
  // Update or create tsconfig.json/jsconfig.json for Next.js
  if (lang === 'ts') {
    const tsconfigPath = path.join(cwd, 'tsconfig.json');
    if (fs.existsSync(tsconfigPath)) {
      try {
        const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
        
        // Ensure Next.js specific settings
        if (!tsconfig.compilerOptions) {
          tsconfig.compilerOptions = {};
        }
        
        // Add Next.js recommended settings
        if (!tsconfig.compilerOptions.jsx) {
          tsconfig.compilerOptions.jsx = 'preserve'; // Next.js uses 'preserve'
        }
        
        // Ensure paths are set for @ imports
        if (!tsconfig.compilerOptions.paths) {
          tsconfig.compilerOptions.paths = {};
        }
        if (!tsconfig.compilerOptions.paths['@/*']) {
          if (fs.existsSync(path.join(cwd, 'src'))) {
            tsconfig.compilerOptions.paths['@/*'] = ['./src/*'];
          } else {
            tsconfig.compilerOptions.paths['@/*'] = ['./*'];
          }
        }
        
        // Update include paths for Next.js
        if (!tsconfig.include) {
          tsconfig.include = [];
        }
        
        // Add Next.js specific paths
        const includesToAdd = [];
        if (projectType === 'nextjs-app') {
          if (!tsconfig.include.some(inc => inc.includes('app'))) {
            includesToAdd.push('./app/**/*', './src/app/**/*');
          }
        } else {
          if (!tsconfig.include.some(inc => inc.includes('pages'))) {
            includesToAdd.push('./pages/**/*', './src/pages/**/*');
          }
        }
        
        // Add components to include
        if (!tsconfig.include.some(inc => inc.includes('components'))) {
          includesToAdd.push('./components/**/*', './src/components/**/*');
        }
        
        // Add new includes
        includesToAdd.forEach(inc => {
          if (!tsconfig.include.includes(inc)) {
            tsconfig.include.push(inc);
          }
        });
        
        fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
        log('  + Updated tsconfig.json (Next.js optimized)', 'green');
      } catch (e) {
        log('  ⚠️  Could not update tsconfig.json', 'yellow');
      }
    }
  } else {
    // JavaScript project - update jsconfig.json
    const jsconfigPath = path.join(cwd, 'jsconfig.json');
    if (fs.existsSync(jsconfigPath)) {
      try {
        const jsconfig = JSON.parse(fs.readFileSync(jsconfigPath, 'utf-8'));
        
        // Ensure Next.js specific settings
        if (!jsconfig.compilerOptions) {
          jsconfig.compilerOptions = {};
        }
        
        // Add Next.js recommended settings
        if (!jsconfig.compilerOptions.jsx) {
          jsconfig.compilerOptions.jsx = 'preserve'; // Next.js uses 'preserve'
        }
        
        // Ensure paths are set for @ imports
        if (!jsconfig.compilerOptions.paths) {
          jsconfig.compilerOptions.paths = {};
        }
        if (!jsconfig.compilerOptions.paths['@/*']) {
          if (fs.existsSync(path.join(cwd, 'src'))) {
            jsconfig.compilerOptions.paths['@/*'] = ['./src/*'];
          } else {
            jsconfig.compilerOptions.paths['@/*'] = ['./*'];
          }
        }
        
        // Update include paths for Next.js
        if (!jsconfig.include) {
          jsconfig.include = [];
        }
        
        // Add Next.js specific paths
        const includesToAdd = [];
        if (projectType === 'nextjs-app') {
          if (!jsconfig.include.some(inc => inc.includes('app'))) {
            includesToAdd.push('./app/**/*', './src/app/**/*');
          }
        } else {
          if (!jsconfig.include.some(inc => inc.includes('pages'))) {
            includesToAdd.push('./pages/**/*', './src/pages/**/*');
          }
        }
        
        // Add components to include
        if (!jsconfig.include.some(inc => inc.includes('components'))) {
          includesToAdd.push('./components/**/*', './src/components/**/*');
        }
        
        // Add new includes
        includesToAdd.forEach(inc => {
          if (!jsconfig.include.includes(inc)) {
            jsconfig.include.push(inc);
          }
        });
        
        fs.writeFileSync(jsconfigPath, JSON.stringify(jsconfig, null, 2));
        log('  + Updated jsconfig.json (Next.js optimized)', 'green');
      } catch (e) {
        log('  ⚠️  Could not update jsconfig.json', 'yellow');
      }
    }
  }
  
  // Check next.config.js/ts/mjs
  const nextConfigFiles = [
    path.join(cwd, 'next.config.js'),
    path.join(cwd, 'next.config.ts'),
    path.join(cwd, 'next.config.mjs'),
  ];
  
  let nextConfigUpdated = false;
  for (const configFile of nextConfigFiles) {
    if (fs.existsSync(configFile)) {
      try {
        let configContent = fs.readFileSync(configFile, 'utf-8');
        
        // Add transpilePackages for antd-components
        if (!configContent.includes('transpilePackages:')) {
          // Try to add transpilePackages to the config
          if (configFile.endsWith('.ts')) {
            // TypeScript config
            if (configContent.includes('export default')) {
              configContent = configContent.replace(
                /export default\s*\{/,
                `export default {\n  transpilePackages: ['antd-components'],`
              );
            } else if (configContent.includes('const nextConfig =')) {
              configContent = configContent.replace(
                /const nextConfig\s*=\s*\{/,
                `const nextConfig = {\n  transpilePackages: ['antd-components'],`
              );
            }
          } else {
            // JavaScript config
            if (configContent.includes('module.exports =')) {
              configContent = configContent.replace(
                /module\.exports\s*=\s*\{/,
                `module.exports = {\n  transpilePackages: ['antd-components'],`
              );
            } else if (configContent.includes('export default')) {
              configContent = configContent.replace(
                /export default\s*\{/,
                `export default {\n  transpilePackages: ['antd-components'],`
              );
            }
          }
          
          fs.writeFileSync(configFile, configContent);
          log(`  + Updated ${path.basename(configFile)} (added transpilePackages)`, 'green');
          nextConfigUpdated = true;
          break;
        } else if (!configContent.includes("'antd-components'") && !configContent.includes('"antd-components"')) {
          // If transpilePackages exists but doesn't include antd-components
          configContent = configContent.replace(
            /transpilePackages:\s*\[([^\]]*)\]/,
            (match, existing) => {
              const trimmed = existing.trim();
              return `transpilePackages: [${trimmed ? `${trimmed}, ` : ''}'antd-components']`;
            }
          );
          fs.writeFileSync(configFile, configContent);
          log(`  + Updated ${path.basename(configFile)} (added antd-components to transpilePackages)`, 'green');
          nextConfigUpdated = true;
          break;
        } else {
          log(`  ~ ${path.basename(configFile)} (transpilePackages already configured)`, 'yellow');
          nextConfigUpdated = true;
          break;
        }
      } catch (e) {
        log(`  ⚠️  Could not update ${path.basename(configFile)}: ${e.message}`, 'yellow');
      }
    }
  }
  
  if (!nextConfigUpdated) {
    log('  ⚠️  Could not find or update next.config.js/ts/mjs. Please ensure `transpilePackages: [\'antd-components\']` is added.', 'yellow');
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

async function promptUser(projectType) {
  const rl = createReadline();

  const options = {};

  // Language selection
  log('\n📝 Language Selection:', 'cyan');
  log('  1) TypeScript (ts)', 'blue');
  log('  2) JavaScript (js)', 'blue');
  const langChoice = await question(rl, 'Select language (1-2, default: 1): ');
  options.lang = langChoice.trim() === '2' ? 'js' : 'ts';

  // Routing selection - Skip for Next.js (has built-in routing)
  if (projectType === 'nextjs-app' || projectType === 'nextjs-pages') {
    log('\n🛣️  Routing: Next.js has built-in routing (skipped)', 'cyan');
    options.routing = 'none';
  } else {
    log('\n🛣️  Routing Library:', 'cyan');
    log('  1) None', 'blue');
    log('  2) Tanstack Router', 'blue');
    log('  3) React Router DOM', 'blue');
    const routingChoice = await question(rl, 'Select routing (1-3, default: 1): ');
    const routingMap = { '1': 'none', '2': 'tanstack-router', '3': 'react-router-dom' };
    options.routing = routingMap[routingChoice.trim()] || 'none';
  }

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
  
  // Detect project type first (needed for routing selection)
  const projectType = detectProjectType(cwd);
  
  // Prompt user for options
  const options = await promptUser(projectType);
  
  // Show summary
  log('\n📋 Configuration Summary:', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
  log(`  Language: ${options.lang === 'ts' ? 'TypeScript' : 'JavaScript'}`, 'blue');
  if (projectType === 'nextjs-app' || projectType === 'nextjs-pages') {
    log(`  Routing: Next.js built-in routing`, 'blue');
  } else {
    log(`  Routing: ${options.routing === 'none' ? 'None' : options.routing === 'tanstack-router' ? 'Tanstack Router' : 'React Router DOM'}`, 'blue');
  }
  log(`  State Management: ${options.stateManagement === 'none' ? 'None' : options.stateManagement === 'zustand' ? 'Zustand' : 'Redux'}`, 'blue');
  log(`  Form Library: ${options.formLibrary === 'none' ? 'None' : options.formLibrary === 'react-hook-form' ? 'React Hook Form' : 'Olapat'}`, 'blue');
  log(`  Tanstack Query: ${options.tanstackQuery ? 'Yes' : 'No'}`, 'blue');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
  
  // Project type already detected above
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
  } else if (projectType === 'nextjs-app' || projectType === 'nextjs-pages') {
    log('  ✓ Next.js built-in routing', 'green');
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
  const targetDir = getComponentsDir(cwd, projectType, baseDir);
  
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

  // Create components index file
  const indexExt = options.lang === 'ts' ? '.ts' : '.js';
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
  
  // Setup JSX configuration for JavaScript projects
  if (options.lang === 'js') {
    setupJSXConfig(cwd, projectType);
  }
  
  // Setup Next.js specific configurations
  if (projectType === 'nextjs-app' || projectType === 'nextjs-pages') {
    setupNextJSConfig(cwd, projectType, options.lang);
  }
  
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
