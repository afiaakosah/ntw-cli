#!/usr/bin/env node

const { program } = require('commander');
const simpleGit = require('simple-git');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const chalk = require('chalk');
const figlet = require('figlet');
const ora = require('ora');

const packageJson = require('./package.json');
const git = simpleGit();

function showHeader() {
  console.log(
    chalk.blue(
      figlet.textSync('NTW CLI', { horizontalLayout: 'full' })
    )
  );
  console.log(chalk.green('Welcome to Node TypeScript Wizard! 🎩✨'));
  console.log(chalk.yellow('Let’s create something magical... 🪄'));
}

function showTips(projectName) {
  console.log(chalk.blue('\n✨✨ Project Setup Complete ✨✨\n'));
  console.log(chalk.green(`Your project ${projectName} is ready to go! 🎉`));
  console.log(chalk.magenta('Here are some tips from the author to get you started:'));
  console.log(chalk.cyan(`\n1. To launch the project (in Docker - development):\n   ${chalk.bold('npm run docker:launch')}`));
  console.log(chalk.cyan(`2. To launch the project (in Docker - production):\n   ${chalk.bold('npm run docker:launch:prod')}`));
  console.log(chalk.cyan('3. Explore the project structure.'));
  console.log(chalk.cyan('4. Don’t forget to set up your environment variables!'));
  console.log(chalk.yellow('\nHappy coding! 💻🚀'));
}

async function createHiddenFile(projectPath){
  // file names startting with . are hidden in Unix-based systems
  const hiddenFilePath = path.join(projectPath, '.ntw_identifier'); 

  try {
    fs.writeFileSync(hiddenFilePath, "This project was created with NTW CLI.");

    if (process.platform == path.win32) {
      exec(`attrib + h ${hiddenFilePath}`, (error) => {
        if(error) {
          console.log('Error when setting file as hidden on Windows:', error)
        }
      })
    }

    await git.add(hiddenFilePath);

  } catch(err) {
    console.error(chalk.red('Error creating NTW identifier:', err));
    return;
  }

}

program
  .version(packageJson.version, '-v, --version', 'output the current version')
  .description('NTW CLI - Node TypeScript Wizard');

program
  .command('init [projectName]')
  .alias('i')
  .description('Initialize a new project with TypeScript support')
  .action((projectName = 'new-ntw-project') => {
    showHeader();

    const projectPath = path.join(process.cwd(), projectName);
    const spinner = ora(`Setting up your project: ${projectName}...`).start();

    git.clone('https://github.com/fless-lab/ntw-init.git', projectPath)
      .then(() => {
        spinner.text = 'Configuring project...';

        fs.rmSync(path.join(projectPath, '.git'), { recursive: true, force: true });

        return simpleGit(projectPath).init();
      })
      .then(() => {
        spinner.succeed('Project configured successfully.');

        const installSpinner = ora('Step 1/2: Installing project dependencies. This may take a few moments...').start();

        exec('npm install', { cwd: projectPath }, (err, stdout, stderr) => {
          if (err) {
            installSpinner.fail('Failed to install dependencies.');
            console.error(chalk.red(`Error: ${stderr}`));
            return;
          }

          installSpinner.succeed('Step 1/2: All dependencies have been installed successfully.');

          installSpinner.start('Step 2/2: Finalizing project setup...');

          createHiddenFile(projectPath);

          setTimeout(() => {
            installSpinner.succeed('Step 2/2: Project setup completed.');

            const newGit = simpleGit(projectPath);

            newGit.add('.', () => {
              showTips(projectName);
            })
            //   .commit('Initial setup completed with NTW CLI 🎩✨', () => {
            //     showTips(projectName);
            // });
          }, 1000);
        });
      })
      .catch((err) => {
        spinner.fail('Error during project setup.');
        console.error(chalk.red('Error:', err));
      });
  });

program
  .command('generate <type> [name]')
  .aliases(['g', 'gen'])
  .description('Generate a new application with TypeScript scaffolding.')
  .action((name = 'new-ntw-application') => {
    const typeMapping = {
      application: 'application',
      a: 'application', // Alias for 'application'
    }

    // Check if the provided type matches one of the aliases or full forms
    const normalizedType = typeMapping[type] || type;

    if (normalizedType === 'application') {
      console.log(`Generating application named: ${name}`);
    } 

  });

program.on('--help', () => {
  console.log('');
  console.log('Example call:');
  console.log('  $ ntw init demo');
  console.log('');
  console.log('Additional Information:');
  console.log('  Ensure that ntw.json is present in order for commands like `ntw generate [appName]` to work.');
});

program.parse(process.argv);
