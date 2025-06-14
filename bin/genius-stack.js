const chalk = require('chalk');
const figlet = require('figlet');
const inquirer = require('inquirer');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ASCII Art
function showLogo() {
  console.clear();
  console.log(
    chalk.cyan(
      figlet.textSync('GENIUS STACK', {
        horizontalLayout: 'full',
        font: 'Big'
      })
    )
  );
  console.log(chalk.yellow('🚀 Vue 3 + Express + Prisma Boilerplate Generator\n'));
}

// Main function
async function createProject() {
  showLogo();

  // Get project name
  const { projectName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'What do you want to name your project?',
      validate: (input) => {
        if (!input) return 'Project name is required!';
        if (!/^[a-zA-Z0-9-_]+$/.test(input)) return 'Project name can only contain letters, numbers, hyphens, and underscores';
        return true;
      }
    }
  ]);

  console.log(chalk.blue(`\n🎯 Creating project: ${projectName}\n`));

  try {
    // Create directory
    console.log(chalk.yellow('📁 Creating directory...'));
    if (fs.existsSync(projectName)) {
      console.log(chalk.red(`❌ Directory ${projectName} already exists!`));
      process.exit(1);
    }
    fs.mkdirSync(projectName);

    // Clone repository
    console.log(chalk.yellow('📦 Cloning boilerplate...'));
    execSync(`git clone https://github.com/everettsmith928/Boiler-Plate-Fullstack.git ${projectName}`,
      { stdio: 'inherit' });

    // Change to project directory
    process.chdir(projectName);

    // Remove .git folder
    console.log(chalk.yellow('🔧 Setting up new git repository...'));
    if (process.platform === 'win32') {
      execSync('rmdir /s /q .git', { stdio: 'inherit' });
    } else {
      execSync('rm -rf .git', { stdio: 'inherit' });
    }

    // Install dependencies for client
    console.log(chalk.yellow('📦 Installing client dependencies...'));
    process.chdir('client');
    execSync('npm install', { stdio: 'inherit' });

    // Install dependencies for server
    console.log(chalk.yellow('📦 Installing server dependencies...'));
    process.chdir('../server');
    execSync('npm install', { stdio: 'inherit' });

    // Go back to root
    process.chdir('..');

    // Initialize new git repo
    console.log(chalk.yellow('🔄 Initializing new git repository...'));
    execSync('git init', { stdio: 'inherit' });
    execSync('git add .', { stdio: 'inherit' });
    execSync('git commit -m "Initial commit from Genius Stack"', { stdio: 'inherit' });

    // Success message
    console.log(chalk.green(`\n✅ Project ${projectName} created successfully!\n`));
    console.log(chalk.cyan('Next steps:'));
    console.log(chalk.white(`  cd ${projectName}`));
    console.log(chalk.white('  # Set up your .env files'));
    console.log(chalk.white('  # Start coding! 🎉\n'));

  } catch (error) {
    console.log(chalk.red(`❌ Error: ${error.message}`));
    process.exit(1);
  }
}

createProject();