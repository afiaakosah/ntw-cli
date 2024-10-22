#!/usr/bin/env

import { program } from 'commander';
import simpleGit from 'simple-git';
import path from 'path';
import { exec } from 'child_process';
import fs from 'fs';
import chalk from 'chalk';
import figlet from 'figlet';
import ora from 'ora';
import { createFolderStructure } from './add-cli';

import packageJson from './package.json';
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

function showTips(projectName: string) {
  console.log(chalk.blue('\n✨✨ Project Setup Complete ✨✨\n'));
  console.log(chalk.green(`Your project ${projectName} is ready to go! 🎉`));
  console.log(chalk.magenta('Here are some tips from the author to get you started:'));
  console.log(chalk.cyan(`\n1. To launch the project (in Docker - development):\n   ${chalk.bold('npm run docker:launch')}`));
  console.log(chalk.cyan(`2. To launch the project (in Docker - production):\n   ${chalk.bold('npm run docker:launch:prod')}`));
  console.log(chalk.cyan('3. Explore the project structure.'));
  console.log(chalk.cyan('4. Don’t forget to set up your environment variables!'));
  console.log(chalk.yellow('\nHappy coding! 💻🚀'));
}

function encode(identifier: string) {
  return Buffer.from(identifier).toString('base64');
}

function decode(encodedIdentifier: WithImplicitCoercion<string> | { [Symbol.toPrimitive](hint: "string"): string; }) {
  // Convert the Base64 encoded string back to its original form
  return Buffer.from(encodedIdentifier, 'base64').toString('utf-8');
}

function isNtwProject(projectPath: string) {
  // Check if the encoded id from the config contains our identifier.
  const configFilePath = path.join(projectPath, 'ntw.config.json');
  const data = fs.readFileSync(configFilePath, 'utf-8');
  const config = JSON.parse(data);

  const decodedIdentifier = decode(config.id);

  if (decodedIdentifier.includes('was made with NTW on')) {
    return true;
  } else {
    return false;
  }
}

async function createConfigFile(projectPath: string, projectName: string){
  const date = new Date().toUTCString();
  const identifier = `${projectName} was made with NTW on ${date}`; 
  const encodedIdentifier = encode(identifier)

  const config = {
    name: projectName,
    "id": encodedIdentifier,
    "apps-path": "./src/apps",
    dateCreated: date,
  };

  const configFilePath = path.join(projectPath, 'ntw.config.json');

  try {
    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));

    await git.add(configFilePath);

  } catch(err) {
    console.error(chalk.red('Error creating config file:', err));
    return;
  }

}

module.exports = {
  createConfigFile,
  encode,
};

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

          createConfigFile(projectPath, projectName)

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

  const genDescription: { [argName: string]: string } = {
    type: `Specify the type of resource to generate. E.g. can be "application" or its aliases.
              Type can be one of:
                 - application: Generate a new application structure`,
    name: 'Optional: The name of the resource to be generated. Defaults to "new-ntw-resource".',
  };
  
program
  .command('generate <type> [name]')
  .aliases(['g', 'gen'])
  .description(`Generate a new resource (e.g. an application) with TypeScript scaffolding.

Example:
  $ ntw g application MyApp
Ensure that you call this from the root of a ntw project with a valid ntw.config.json file`)
  .argument('<type>', `Specify the type of resource to generate. E.g. can be "application" or its aliases.
  Type can be one of:
       - application: Generate a new application structure`)
  .argument('[name]', 'Optional: The name of the resource to be generated. Defaults to "new-ntw-resource".')
  .action((type, name = 'new-ntw-resource') => {

    const typeMapping: { [key: string]: string } = {
      application: 'application',
      // Aliases for 'application'
      a: 'application',
      app: 'application',
    };

    // Check if the provided type matches one of the aliases or full forms
    const normalizedType : string = typeMapping[type] || type;

    if (normalizedType === 'application') {
      const genAppSpinner = ora('Generating a new NTW application.\n').start();
      var isNtw : boolean;

      try {
        isNtw = isNtwProject(process.cwd());
      } catch(error) {
        genAppSpinner.fail('Failed to generate a new NTW application.');
        console.error(chalk.red(`Error: ${error}\n\n` + "Please ensure you execute this command at the root of an NTW project with a valid ntw.config.json file."));
        return;
      }

      if(!isNtw){
        genAppSpinner.fail('Failed to generate a new NTW application.');
        console.error(chalk.red(`Error: Current directory is not a NTW project. Please execute this command at the root of an NTW project with a valid ntw.config.json file.`));
      }

      genAppSpinner.text = 'Creating folder structure...\n'

      createFolderStructure(process.cwd(), name);

      genAppSpinner.succeed(`New ${name} NTW Application sucessfully generated.`)
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
